using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Data;
using OmniDesk.Api.Models;
using System.Security.Claims;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketAttachmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public TicketAttachmentsController(
            ApplicationDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
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
                ?? "";
        }

        private bool IsAdmin()
        {
            return GetCurrentUserRole() == "Admin";
        }

        private bool IsITSupportAgent()
        {
            return GetCurrentUserRole() == "IT Support Agent";
        }

        private bool IsManager()
        {
            return GetCurrentUserRole() == "Manager";
        }

        private bool IsEmployee()
        {
            return GetCurrentUserRole() == "Employee";
        }

        private bool CanViewAllTickets()
        {
            return IsAdmin() || IsITSupportAgent() || IsManager();
        }

        private bool CanUploadAttachment()
        {
            return IsAdmin() || IsITSupportAgent() || IsEmployee();
        }

        private async Task<bool> CanAccessTicketAsync(int ticketId)
        {
            if (CanViewAllTickets())
            {
                return true;
            }

            if (IsEmployee())
            {
                var currentUserId = GetCurrentUserId();

                if (currentUserId == null)
                {
                    return false;
                }

                return await _context.Tickets.AnyAsync(t =>
                    t.Id == ticketId && t.CreatedByUserId == currentUserId.Value);
            }

            return false;
        }

        // GET: api/TicketAttachments/ticket/5
        [HttpGet("ticket/{ticketId}")]
        public async Task<ActionResult> GetTicketAttachments(int ticketId)
        {
            var canAccessTicket = await CanAccessTicketAsync(ticketId);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == ticketId);

            if (!ticketExists)
            {
                return NotFound("Ticket not found.");
            }

            var attachments = await _context.TicketAttachments
                .Include(a => a.UploadedByUser)
                .Where(a => a.TicketId == ticketId)
                .OrderByDescending(a => a.UploadedAt)
                .Select(a => new
                {
                    a.Id,
                    a.TicketId,
                    a.OriginalFileName,
                    a.ContentType,
                    a.FileSize,
                    a.UploadedAt,
                    UploadedBy = a.UploadedByUser != null ? a.UploadedByUser.FullName : ""
                })
                .ToListAsync();

            return Ok(attachments);
        }

        // POST: api/TicketAttachments/ticket/5
        [HttpPost("ticket/{ticketId}")]
        public async Task<ActionResult> UploadTicketAttachment(int ticketId, IFormFile file)
        {
            if (!CanUploadAttachment())
            {
                return Forbid();
            }

            var canAccessTicket = await CanAccessTicketAsync(ticketId);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            var ticket = await _context.Tickets.FindAsync(ticketId);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            const long maxFileSize = 10 * 1024 * 1024;

            if (file.Length > maxFileSize)
            {
                return BadRequest("File size cannot exceed 10 MB.");
            }

            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".pdf", ".doc", ".docx", ".txt" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Only PNG, JPG, JPEG, PDF, DOC, DOCX, and TXT files are allowed.");
            }

            var uploadsFolder = Path.Combine(
                _environment.ContentRootPath,
                "Uploads",
                "TicketAttachments"
            );

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var storedFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, storedFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachment = new TicketAttachment
            {
                TicketId = ticket.Id,
                UploadedByUserId = currentUserId.Value,
                OriginalFileName = Path.GetFileName(file.FileName),
                StoredFileName = storedFileName,
                FilePath = filePath,
                ContentType = file.ContentType,
                FileSize = file.Length,
                UploadedAt = DateTime.UtcNow
            };

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Action = "Attachment Uploaded",
                Description = $"File uploaded: {attachment.OriginalFileName}.",
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketAttachments.Add(attachment);
            _context.ActivityLogs.Add(activityLog);

            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "File uploaded successfully.",
                attachmentId = attachment.Id,
                fileName = attachment.OriginalFileName
            });
        }

        // GET: api/TicketAttachments/5/download
        [HttpGet("{attachmentId}/download")]
        public async Task<ActionResult> DownloadAttachment(int attachmentId)
        {
            var attachment = await _context.TicketAttachments
                .Include(a => a.Ticket)
                .FirstOrDefaultAsync(a => a.Id == attachmentId);

            if (attachment == null)
            {
                return NotFound("Attachment not found.");
            }

            var canAccessTicket = await CanAccessTicketAsync(attachment.TicketId);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            if (!System.IO.File.Exists(attachment.FilePath))
            {
                return NotFound("File not found on server.");
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(attachment.FilePath);

            return File(
                fileBytes,
                attachment.ContentType,
                attachment.OriginalFileName
            );
        }

        // DELETE: api/TicketAttachments/5
        [HttpDelete("{attachmentId}")]
        public async Task<ActionResult> DeleteAttachment(int attachmentId)
        {
            if (!IsAdmin() && !IsITSupportAgent())
            {
                return Forbid();
            }

            var attachment = await _context.TicketAttachments
                .FirstOrDefaultAsync(a => a.Id == attachmentId);

            if (attachment == null)
            {
                return NotFound("Attachment not found.");
            }

            var canAccessTicket = await CanAccessTicketAsync(attachment.TicketId);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            if (System.IO.File.Exists(attachment.FilePath))
            {
                System.IO.File.Delete(attachment.FilePath);
            }

            _context.TicketAttachments.Remove(attachment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Attachment deleted successfully."
            });
        }
    }
}