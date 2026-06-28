using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using OmniDesk.Api.DTOs.Ai;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AiController : ControllerBase
    {
        private static readonly SuggestionRule[] CategoryRules =
        [
            new(
                "Email",
                ["cannot access email", "email not working", "outlook not working", "cannot send email", "cannot receive email", "mailbox issue"],
                ["email", "outlook", "mailbox", "inbox", "exchange", "calendar"],
                "The issue is centered on email delivery, mailbox access, or Outlook behavior."
            ),
            new(
                "Access Request",
                ["password reset", "reset password", "account locked", "unlock account", "access denied", "permission request", "cannot login", "unable to login", "signin failed"],
                ["password", "login", "signin", "permission", "permissions", "account", "mfa", "authentication", "authorize", "unlock"],
                "The request is about account access, authentication, or permissions."
            ),
            new(
                "Network",
                ["vpn not working", "cannot connect", "unable to connect", "internet down", "network down", "server down", "remote access"],
                ["vpn", "wifi", "internet", "network", "router", "ethernet", "dns", "latency", "firewall", "server", "connection", "connectivity"],
                "The description points to connectivity, remote access, or shared infrastructure."
            ),
            new(
                "Hardware",
                ["screen flicker", "printer jam", "battery issue", "device not working", "monitor issue", "laptop issue"],
                ["laptop", "computer", "keyboard", "mouse", "screen", "monitor", "printer", "scanner", "device", "charger", "battery", "dock", "headset", "webcam"],
                "The ticket mentions a physical device or workstation component."
            ),
            new(
                "Software",
                ["software install", "application crash", "program not responding", "update failed", "license issue"],
                ["software", "install", "application", "app", "program", "update", "crash", "license", "patch", "upgrade", "driver"],
                "The issue appears related to software usage, deployment, or application stability."
            )
        ];

        private static readonly string[] CriticalPrioritySignals =
        [
            "system down", "production down", "server down", "service down", "outage", "security breach", "data loss", "ransomware", "no one can work"
        ];

        private static readonly string[] WidespreadPrioritySignals =
        [
            "all users", "everyone", "entire team", "whole team", "entire office", "whole office", "company wide", "companywide", "multiple users", "entire department"
        ];

        private static readonly string[] BlockingPrioritySignals =
        [
            "blocked", "cannot login", "unable to login", "cannot access", "unable to access", "cannot work", "unable to work", "not working", "stopped working", "fails to connect", "cannot connect", "cannot send email", "cannot receive email", "offline"
        ];

        private static readonly string[] UrgentPrioritySignals =
        [
            "urgent", "asap", "immediately", "critical", "right away"
        ];

        private static readonly string[] MediumPrioritySignals =
        [
            "install", "printer", "email", "slow", "issue", "problem", "intermittent", "error", "warning", "setup"
        ];

        private static readonly string[] LowPrioritySignals =
        [
            "question", "how to", "request", "information", "minor", "cosmetic", "guidance", "clarification", "approval", "new employee", "new starter"
        ];

        [HttpPost("categorize")]
        public ActionResult<AiSuggestionResponseDto> CategorizeTicket(AiSuggestionRequestDto dto)
        {
            var input = BuildInput(dto.Title, dto.Description);

            if (string.IsNullOrWhiteSpace(input))
            {
                return BadRequest("Ticket title or description is required.");
            }

            return Ok(SuggestCategory(dto.Title, dto.Description));
        }

        [HttpPost("priority")]
        public ActionResult<AiSuggestionResponseDto> SuggestPriority(AiSuggestionRequestDto dto)
        {
            var input = BuildInput(dto.Title, dto.Description);

            if (string.IsNullOrWhiteSpace(input))
            {
                return BadRequest("Ticket title or description is required.");
            }

            return Ok(DeterminePriority(dto.Title, dto.Description));
        }

        [HttpPost("chat")]
        public ActionResult<AiChatResponseDto> Chat(AiChatRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest("A chat message is required.");
            }

            return Ok(GenerateChatResponse(dto.Message));
        }

        private static AiSuggestionResponseDto SuggestCategory(string title, string description)
        {
            var normalizedTitle = Normalize(title);
            var normalizedDescription = Normalize(description);

            var bestMatch = CategoryRules
                .Select(rule => ScoreCategoryRule(rule, normalizedTitle, normalizedDescription))
                .Where(match => match.Score > 0)
                .OrderByDescending(match => match.Score)
                .ThenByDescending(match => match.PhraseMatches.Count)
                .ThenByDescending(match => match.KeywordMatches.Count)
                .FirstOrDefault();

            if (bestMatch is null)
            {
                return new AiSuggestionResponseDto
                {
                    Suggestion = "Other",
                    Reason = "No strong rule matched the ticket content, so the issue is categorized as Other."
                };
            }

            var matchedSignals = bestMatch.PhraseMatches
                .Concat(bestMatch.KeywordMatches)
                .Distinct(StringComparer.Ordinal)
                .Take(3)
                .ToArray();

            return new AiSuggestionResponseDto
            {
                Suggestion = bestMatch.Rule.Name,
                Reason = $"{bestMatch.Rule.Reason} Matched signals: {FormatSignals(matchedSignals)}."
            };
        }

        private static AiSuggestionResponseDto DeterminePriority(string title, string description)
        {
            var normalized = Normalize(BuildInput(title, description));

            var criticalMatches = FindMatches(normalized, CriticalPrioritySignals);
            var widespreadMatches = FindMatches(normalized, WidespreadPrioritySignals);
            var blockingMatches = FindMatches(normalized, BlockingPrioritySignals);
            var urgentMatches = FindMatches(normalized, UrgentPrioritySignals);
            var mediumMatches = FindMatches(normalized, MediumPrioritySignals);
            var lowMatches = FindMatches(normalized, LowPrioritySignals);

            var score = (criticalMatches.Count * 4)
                + (widespreadMatches.Count * 3)
                + (blockingMatches.Count * 2)
                + (urgentMatches.Count * 2)
                + mediumMatches.Count
                - (lowMatches.Count * 2);

            if (criticalMatches.Count > 0 || (widespreadMatches.Count > 0 && blockingMatches.Count > 0) || score >= 7)
            {
                return new AiSuggestionResponseDto
                {
                    Suggestion = "Critical",
                    Reason = BuildPriorityReason(
                        "The issue indicates a widespread outage, severe business impact, or a critical service failure.",
                        criticalMatches,
                        widespreadMatches,
                        blockingMatches,
                        urgentMatches)
                };
            }

            if (score >= 4)
            {
                return new AiSuggestionResponseDto
                {
                    Suggestion = "High",
                    Reason = BuildPriorityReason(
                        "The issue is blocking normal work or needs rapid attention, but it does not look like a company-wide outage.",
                        blockingMatches,
                        urgentMatches,
                        mediumMatches)
                };
            }

            if (lowMatches.Count > 0 && score <= 0)
            {
                return new AiSuggestionResponseDto
                {
                    Suggestion = "Low",
                    Reason = BuildPriorityReason(
                        "The request looks informational, planned, or low-impact rather than disruptive.",
                        lowMatches,
                        mediumMatches)
                };
            }

            return new AiSuggestionResponseDto
            {
                Suggestion = "Medium",
                Reason = mediumMatches.Count > 0
                    ? BuildPriorityReason(
                        "The issue appears important enough for normal support handling but does not show broad business impact.",
                        mediumMatches,
                        blockingMatches)
                    : "The issue does not show a widespread outage or a low-impact request, so it is treated as a standard medium-priority support issue."
            };
        }

        private static AiChatResponseDto GenerateChatResponse(string message)
        {
            var normalized = message.Trim().ToLowerInvariant();

            if (ContainsAny(normalized, "password", "reset"))
            {
                return new AiChatResponseDto
                {
                    Topic = "Password Reset",
                    Answer = "Use the password reset option on the company sign-in page first. If the reset fails or your account stays locked, create a ticket so IT can verify your identity and help restore access."
                };
            }

            if (ContainsAny(normalized, "vpn"))
            {
                return new AiChatResponseDto
                {
                    Topic = "VPN",
                    Answer = "Check that your internet connection is working, reconnect the VPN client, and try signing in again. If the VPN still fails, note the error message and create a support ticket."
                };
            }

            if (ContainsAny(normalized, "email", "outlook"))
            {
                return new AiChatResponseDto
                {
                    Topic = "Email",
                    Answer = "Make sure Outlook is online, try sending a test email, and restart the app if needed. If email is still not syncing or sending, create a ticket with any error details."
                };
            }

            if (ContainsAny(normalized, "internet", "wifi"))
            {
                return new AiChatResponseDto
                {
                    Topic = "Internet and WiFi",
                    Answer = "Check whether other websites load, reconnect to WiFi, and restart the router or network adapter if appropriate. If the connection is still down, create a ticket and mention whether other users are affected."
                };
            }

            if (ContainsAny(normalized, "printer", "print", "scanner"))
            {
                return new AiChatResponseDto
                {
                    Topic = "Printer",
                    Answer = "Check that the printer is powered on, connected, and has paper or toner. If print jobs are stuck, clear the queue and create a ticket if printing still does not work."
                };
            }

            if (ContainsAny(normalized, "software", "install"))
            {
                return new AiChatResponseDto
                {
                    Topic = "Software Installation",
                    Answer = "Check whether the software is already available in the company portal. If you still need help or approval, create a ticket with the software name, version, and business reason."
                };
            }

            return new AiChatResponseDto
            {
                Topic = "General Help Desk",
                Answer = "I do not have a direct answer for that yet. Please create a support ticket in OmniDesk and include the issue details, affected system, and any error message."
            };
        }

        private static string BuildInput(string title, string description)
        {
            var parts = new[] { title?.Trim(), description?.Trim() }
                .Where(part => !string.IsNullOrWhiteSpace(part));

            return string.Join(" ", parts);
        }

        private static bool ContainsAny(string input, params string[] keywords)
        {
            var normalizedInput = Normalize(input);
            return FindMatches(normalizedInput, keywords).Count > 0;
        }

        private static CategoryRuleMatch ScoreCategoryRule(SuggestionRule rule, string normalizedTitle, string normalizedDescription)
        {
            var titlePhraseMatches = FindMatches(normalizedTitle, rule.Phrases);
            var descriptionPhraseMatches = FindMatches(normalizedDescription, rule.Phrases);
            var titleKeywordMatches = FindMatches(normalizedTitle, rule.Keywords);
            var descriptionKeywordMatches = FindMatches(normalizedDescription, rule.Keywords);

            var phraseMatches = titlePhraseMatches
                .Concat(descriptionPhraseMatches)
                .Distinct(StringComparer.Ordinal)
                .ToArray();

            var keywordMatches = titleKeywordMatches
                .Concat(descriptionKeywordMatches)
                .Distinct(StringComparer.Ordinal)
                .ToArray();

            var score = (titlePhraseMatches.Count * 4)
                + (descriptionPhraseMatches.Count * 3)
                + (titleKeywordMatches.Count * 2)
                + descriptionKeywordMatches.Count;

            return new CategoryRuleMatch(rule, score, phraseMatches, keywordMatches);
        }

        private static List<string> FindMatches(string normalizedInput, IEnumerable<string> signals)
        {
            if (string.IsNullOrWhiteSpace(normalizedInput))
            {
                return [];
            }

            return signals
                .Select(Normalize)
                .Where(signal => !string.IsNullOrWhiteSpace(signal))
                .Distinct(StringComparer.Ordinal)
                .Where(signal => ContainsSignal(normalizedInput, signal))
                .ToList();
        }

        private static bool ContainsSignal(string normalizedInput, string signal)
        {
            var pattern = $@"(?<![a-z0-9]){Regex.Escape(signal)}(?![a-z0-9])";
            return Regex.IsMatch(normalizedInput, pattern, RegexOptions.CultureInvariant);
        }

        private static string Normalize(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }

            var normalized = input.ToLowerInvariant();

            normalized = normalized
                .Replace("wi-fi", "wifi")
                .Replace("wi fi", "wifi")
                .Replace("e-mail", "email")
                .Replace("log in", "login")
                .Replace("log-in", "login")
                .Replace("sign in", "signin")
                .Replace("sign-in", "signin")
                .Replace("can't", "cant");

            normalized = Regex.Replace(normalized, @"[^a-z0-9]+", " ");
            normalized = Regex.Replace(normalized, @"\binstalled\b|\binstalling\b|\binstallation\b", "install");
            normalized = Regex.Replace(normalized, @"\bupdated\b|\bupdating\b", "update");
            normalized = Regex.Replace(normalized, @"\bfailing\b|\bfailed\b", "fail");
            normalized = Regex.Replace(normalized, @"\bflickering\b", "flicker");
            normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

            return normalized;
        }

        private static string FormatSignals(IEnumerable<string> signals)
        {
            var formattedSignals = signals
                .Where(signal => !string.IsNullOrWhiteSpace(signal))
                .Distinct(StringComparer.Ordinal)
                .Select(signal => $"'{signal}'")
                .ToArray();

            return formattedSignals.Length > 0
                ? string.Join(", ", formattedSignals)
                : "no specific signals";
        }

        private static string BuildPriorityReason(string summary, params IEnumerable<string>[] signalGroups)
        {
            var matchedSignals = signalGroups
                .SelectMany(group => group)
                .Distinct(StringComparer.Ordinal)
                .Take(4)
                .ToArray();

            return $"{summary} Matched signals: {FormatSignals(matchedSignals)}.";
        }

        private sealed record SuggestionRule(
            string Name,
            string[] Phrases,
            string[] Keywords,
            string Reason);

        private sealed record CategoryRuleMatch(
            SuggestionRule Rule,
            int Score,
            IReadOnlyList<string> PhraseMatches,
            IReadOnlyList<string> KeywordMatches);
    }
}
