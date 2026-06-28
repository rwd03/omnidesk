using System.Security.Claims;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Data;
using OmniDesk.Api.DTOs.Reports;
using OmniDesk.Api.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ReportSummaryDto>> GetSummary()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var role = GetCurrentUserRole();

            if (!CanAccessReports(role))
            {
                return Forbid();
            }

            var summary = await BuildReportSummaryAsync(
                BuildAccessibleTicketsQuery(currentUserId.Value, role));

            return Ok(summary);
        }

        [HttpGet("export/excel")]
        public async Task<ActionResult> ExportExcel()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var role = GetCurrentUserRole();

            if (!CanAccessReports(role))
            {
                return Forbid();
            }

            var summary = await BuildReportSummaryAsync(
                BuildAccessibleTicketsQuery(currentUserId.Value, role));

            var workbookBytes = GenerateExcelReport(summary, role);
            var fileName = $"omnidesk-report-{DateTime.UtcNow:yyyyMMdd-HHmmss}.xlsx";

            return File(
                workbookBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }

        [HttpGet("export/pdf")]
        public async Task<ActionResult> ExportPdf()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var role = GetCurrentUserRole();

            if (!CanAccessReports(role))
            {
                return Forbid();
            }

            var summary = await BuildReportSummaryAsync(
                BuildAccessibleTicketsQuery(currentUserId.Value, role));

            var pdfBytes = GeneratePdfReport(summary, role);
            var fileName = $"omnidesk-report-{DateTime.UtcNow:yyyyMMdd-HHmmss}.pdf";

            return File(pdfBytes, "application/pdf", fileName);
        }

        private IQueryable<Ticket> BuildAccessibleTicketsQuery(int currentUserId, string role)
        {
            var ticketsQuery = _context.Tickets
                .AsNoTracking()
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .AsQueryable();

            if (!CanViewAllTickets(role))
            {
                ticketsQuery = ticketsQuery.Where(t => t.CreatedByUserId == currentUserId);
            }

            return ticketsQuery;
        }

        private async Task<ReportSummaryDto> BuildReportSummaryAsync(IQueryable<Ticket> ticketsQuery)
        {
            return new ReportSummaryDto
            {
                TotalTickets = await ticketsQuery.CountAsync(),
                OpenTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Open"),
                InProgressTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "In Progress"),
                PendingTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Pending"),
                ResolvedTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Resolved"),
                ClosedTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Closed"),
                TicketsByCategory = await BuildGroupedStatsAsync(ticketsQuery, t => t.Category != null ? t.Category.Name : "Unknown"),
                TicketsByPriority = await BuildGroupedStatsAsync(ticketsQuery, t => t.Priority != null ? t.Priority.Name : "Unknown"),
                TicketsByStatus = await BuildGroupedStatsAsync(ticketsQuery, t => t.Status != null ? t.Status.Name : "Unknown")
            };
        }

        private static async Task<List<ReportGroupItemDto>> BuildGroupedStatsAsync(
            IQueryable<Ticket> ticketsQuery,
            System.Linq.Expressions.Expression<Func<Ticket, string>> groupingExpression)
        {
            return await ticketsQuery
                .GroupBy(groupingExpression)
                .Select(g => new ReportGroupItemDto
                {
                    Name = g.Key,
                    Value = g.Count()
                })
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        private static byte[] GenerateExcelReport(ReportSummaryDto summary, string role)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Report Summary");

            var currentRow = 1;

            worksheet.Cell(currentRow, 1).Value = "OmniDesk Ticket Report";
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 1).Style.Font.FontSize = 16;

            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Generated (UTC): {DateTime.UtcNow:dd MMM yyyy HH:mm}";

            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Report Scope: {GetScopeLabel(role)}";

            currentRow += 2;
            worksheet.Cell(currentRow, 1).Value = "Summary";
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;

            currentRow++;
            AddSummaryRow(worksheet, currentRow++, "Total Tickets", summary.TotalTickets);
            AddSummaryRow(worksheet, currentRow++, "Open Tickets", summary.OpenTickets);
            AddSummaryRow(worksheet, currentRow++, "In Progress Tickets", summary.InProgressTickets);
            AddSummaryRow(worksheet, currentRow++, "Pending Tickets", summary.PendingTickets);
            AddSummaryRow(worksheet, currentRow++, "Resolved Tickets", summary.ResolvedTickets);
            AddSummaryRow(worksheet, currentRow++, "Closed Tickets", summary.ClosedTickets);

            currentRow += 2;
            currentRow = AddGroupSection(worksheet, currentRow, "Tickets by Category", summary.TicketsByCategory);
            currentRow++;
            currentRow = AddGroupSection(worksheet, currentRow, "Tickets by Priority", summary.TicketsByPriority);
            currentRow++;
            AddGroupSection(worksheet, currentRow, "Tickets by Status", summary.TicketsByStatus);

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        private static void AddSummaryRow(IXLWorksheet worksheet, int row, string label, int value)
        {
            worksheet.Cell(row, 1).Value = label;
            worksheet.Cell(row, 2).Value = value;

            worksheet.Range(row, 1, row, 2).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            worksheet.Range(row, 1, row, 2).Style.Border.BottomBorderColor = XLColor.FromHtml("#E5E7EB");
        }

        private static int AddGroupSection(
            IXLWorksheet worksheet,
            int startRow,
            string title,
            IEnumerable<ReportGroupItemDto> items)
        {
            worksheet.Cell(startRow, 1).Value = title;
            worksheet.Cell(startRow, 1).Style.Font.Bold = true;

            var headerRow = startRow + 1;
            worksheet.Cell(headerRow, 1).Value = "Name";
            worksheet.Cell(headerRow, 2).Value = "Count";
            worksheet.Range(headerRow, 1, headerRow, 2).Style.Font.Bold = true;
            worksheet.Range(headerRow, 1, headerRow, 2).Style.Fill.BackgroundColor = XLColor.FromHtml("#F3F4F6");

            var currentRow = headerRow + 1;

            foreach (var item in items)
            {
                worksheet.Cell(currentRow, 1).Value = item.Name;
                worksheet.Cell(currentRow, 2).Value = item.Value;
                worksheet.Range(currentRow, 1, currentRow, 2).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                worksheet.Range(currentRow, 1, currentRow, 2).Style.Border.BottomBorderColor = XLColor.FromHtml("#E5E7EB");
                currentRow++;
            }

            if (!items.Any())
            {
                worksheet.Cell(currentRow, 1).Value = "No data available";
                currentRow++;
            }

            return currentRow;
        }

        private static byte[] GeneratePdfReport(ReportSummaryDto summary, string role)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(32);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header().Column(column =>
                    {
                        column.Spacing(6);
                        column.Item().Text("OmniDesk Ticket Report").FontSize(20).SemiBold();
                        column.Item().Text($"Generated (UTC): {DateTime.UtcNow:dd MMM yyyy HH:mm}")
                            .FontColor(Colors.Grey.Darken1);
                        column.Item().Text($"Report Scope: {GetScopeLabel(role)}")
                            .FontColor(Colors.Grey.Darken1);
                    });

                    page.Content().PaddingVertical(18).Column(column =>
                    {
                        column.Spacing(18);

                        column.Item().Element(container => ComposeReportTable(
                            container,
                            "Summary",
                            new List<ReportGroupItemDto>
                            {
                                new() { Name = "Total Tickets", Value = summary.TotalTickets },
                                new() { Name = "Open Tickets", Value = summary.OpenTickets },
                                new() { Name = "In Progress Tickets", Value = summary.InProgressTickets },
                                new() { Name = "Pending Tickets", Value = summary.PendingTickets },
                                new() { Name = "Resolved Tickets", Value = summary.ResolvedTickets },
                                new() { Name = "Closed Tickets", Value = summary.ClosedTickets }
                            }));

                        column.Item().Element(container => ComposeReportTable(
                            container,
                            "Tickets by Category",
                            summary.TicketsByCategory));

                        column.Item().Element(container => ComposeReportTable(
                            container,
                            "Tickets by Priority",
                            summary.TicketsByPriority));

                        column.Item().Element(container => ComposeReportTable(
                            container,
                            "Tickets by Status",
                            summary.TicketsByStatus));
                    });

                    page.Footer().AlignCenter().Text("OmniDesk Reports Export").FontSize(10).FontColor(Colors.Grey.Darken1);
                });
            }).GeneratePdf();
        }

        private static void ComposeReportTable(IContainer container, string title, IEnumerable<ReportGroupItemDto> items)
        {
            container.Column(column =>
            {
                column.Spacing(8);
                column.Item().Text(title).FontSize(14).SemiBold();

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.ConstantColumn(90);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Element(StyleHeaderCell).Text("Name").SemiBold();
                        header.Cell().Element(StyleHeaderCell).AlignRight().Text("Count").SemiBold();
                    });

                    if (!items.Any())
                    {
                        table.Cell().Element(StyleBodyCell).Text("No data available");
                        table.Cell().Element(StyleBodyCell).AlignRight().Text("-");
                        return;
                    }

                    foreach (var item in items)
                    {
                        table.Cell().Element(StyleBodyCell).Text(item.Name);
                        table.Cell().Element(StyleBodyCell).AlignRight().Text(item.Value.ToString());
                    }
                });
            });
        }

        private static IContainer StyleHeaderCell(IContainer container)
        {
            return container
                .Background(Colors.Grey.Lighten3)
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten2)
                .PaddingVertical(6)
                .PaddingHorizontal(8);
        }

        private static IContainer StyleBodyCell(IContainer container)
        {
            return container
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten2)
                .PaddingVertical(6)
                .PaddingHorizontal(8);
        }

        private int? GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userIdString))
            {
                return null;
            }

            if (!int.TryParse(userIdString, out var userId))
            {
                return null;
            }

            return userId;
        }

        private string GetCurrentUserRole()
        {
            return User.FindFirstValue(ClaimTypes.Role)
                ?? User.FindFirstValue("role")
                ?? string.Empty;
        }

        private static bool CanViewAllTickets(string role)
        {
            return role == "Admin"
                || role == "IT Support Agent"
                || role == "Manager";
        }

        private static bool CanAccessReports(string role)
        {
            return role == "Admin"
                || role == "IT Support Agent"
                || role == "Manager"
                || role == "Employee";
        }

        private static string GetScopeLabel(string role)
        {
            return role == "Employee"
                ? "My Tickets"
                : "All Accessible Tickets";
        }
    }
}
