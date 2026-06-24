using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Data;
using OmniDesk.Api.DTOs.Tickets;
using OmniDesk.Api.Models;
using System.Security.Claims;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
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

        private bool IsEmployee()
        {
            return GetCurrentUserRole() == "Employee";
        }

        private bool IsManager()
        {
            return GetCurrentUserRole() == "Manager";
        }

        private bool CanViewAllTickets()
        {
            return IsAdmin() || IsITSupportAgent() || IsManager();
        }

        private bool CanCreateTicket()
        {
            return IsAdmin() || IsEmployee();
        }

        private bool CanManageTicketWorkflow()
        {
            return IsAdmin() || IsITSupportAgent();
        }

        private bool CanDeleteTicket()
        {
            return IsAdmin();
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

        private void AddNotificationForUser(
            int userId,
            int? ticketId,
            string title,
            string message,
            int? excludeUserId = null)
        {
            if (excludeUserId.HasValue && userId == excludeUserId.Value)
            {
                return;
            }

            _context.Notifications.Add(new Notification
            {
                UserId = userId,
                TicketId = ticketId,
                Title = title,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        private async Task AddNotificationsForRolesAsync(
            string[] roleNames,
            int? ticketId,
            string title,
            string message,
            int? excludeUserId = null)
        {
            var userIds = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role != null && roleNames.Contains(u.Role.Name))
                .Select(u => u.Id)
                .Distinct()
                .ToListAsync();

            foreach (var userId in userIds)
            {
                AddNotificationForUser(userId, ticketId, title, message, excludeUserId);
            }
        }

        // GET: api/tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> GetTickets()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var query = _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .AsQueryable();

            if (IsEmployee())
            {
                query = query.Where(t => t.CreatedByUserId == currentUserId.Value);
            }
            else if (!CanViewAllTickets())
            {
                return Forbid();
            }

            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TicketResponseDto
                {
                    Id = t.Id,
                    ReferenceNumber = t.ReferenceNumber,
                    Title = t.Title,
                    Description = t.Description,
                    Category = t.Category != null ? t.Category.Name : "",
                    Priority = t.Priority != null ? t.Priority.Name : "",
                    Status = t.Status != null ? t.Status.Name : "",
                    CreatedBy = t.CreatedByUser != null ? t.CreatedByUser.FullName : "",
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .ToListAsync();

            return Ok(tickets);
        }

        // GET: api/tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketResponseDto>> GetTicketById(int id)
        {
            var canAccessTicket = await CanAccessTicketAsync(id);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            var ticket = await _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Where(t => t.Id == id)
                .Select(t => new TicketResponseDto
                {
                    Id = t.Id,
                    ReferenceNumber = t.ReferenceNumber,
                    Title = t.Title,
                    Description = t.Description,
                    Category = t.Category != null ? t.Category.Name : "",
                    Priority = t.Priority != null ? t.Priority.Name : "",
                    Status = t.Status != null ? t.Status.Name : "",
                    CreatedBy = t.CreatedByUser != null ? t.CreatedByUser.FullName : "",
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            return Ok(ticket);
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<ActionResult> CreateTicket(CreateTicketDto dto)
        {
            if (!CanCreateTicket())
            {
                return Forbid();
            }

            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest("Title and description are required.");
            }

            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var ticket = new Ticket
            {
                ReferenceNumber = $"TCK-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                CategoryId = dto.CategoryId,
                PriorityId = dto.PriorityId,
                StatusId = 1,
                CreatedByUserId = currentUserId.Value,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Action = "Ticket Created",
                Description = $"Ticket {ticket.ReferenceNumber} was created.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(activityLog);

            await AddNotificationsForRolesAsync(
                new[] { "Admin", "IT Support Agent", "Manager" },
                ticket.Id,
                "New ticket created",
                $"{ticket.ReferenceNumber}: {ticket.Title}",
                currentUserId.Value
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket created successfully.",
                ticketId = ticket.Id,
                referenceNumber = ticket.ReferenceNumber
            });
        }

        // PUT: api/tickets/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTicket(int id, UpdateTicketDto dto)
        {
            if (!CanManageTicketWorkflow())
            {
                return Forbid();
            }

            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            ticket.Title = dto.Title.Trim();
            ticket.Description = dto.Description.Trim();
            ticket.CategoryId = dto.CategoryId;
            ticket.PriorityId = dto.PriorityId;
            ticket.StatusId = dto.StatusId;
            ticket.UpdatedAt = DateTime.UtcNow;

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Action = "Ticket Updated",
                Description = "Ticket information was updated.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(activityLog);

            AddNotificationForUser(
                ticket.CreatedByUserId,
                ticket.Id,
                "Ticket updated",
                $"{ticket.ReferenceNumber}: ticket information was updated.",
                currentUserId.Value
            );

            if (ticket.AssignedToUserId.HasValue)
            {
                AddNotificationForUser(
                    ticket.AssignedToUserId.Value,
                    ticket.Id,
                    "Ticket updated",
                    $"{ticket.ReferenceNumber}: ticket information was updated.",
                    currentUserId.Value
                );
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket updated successfully."
            });
        }

        // PUT: api/tickets/5/assign
        [HttpPut("{id}/assign")]
        public async Task<ActionResult> AssignTicket(int id, AssignTicketDto dto)
        {
            if (!CanManageTicketWorkflow())
            {
                return Forbid();
            }

            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var agent = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == dto.AssignedToUserId);

            if (agent == null)
            {
                return NotFound("Assigned user not found.");
            }

            if (agent.Role == null || agent.Role.Name != "IT Support Agent")
            {
                return BadRequest("Ticket can only be assigned to an IT Support Agent.");
            }

            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            ticket.AssignedToUserId = dto.AssignedToUserId;
            ticket.UpdatedAt = DateTime.UtcNow;

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Action = "Ticket Assigned",
                Description = $"Ticket assigned to {agent.FullName}.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(activityLog);

            AddNotificationForUser(
                agent.Id,
                ticket.Id,
                "Ticket assigned to you",
                $"{ticket.ReferenceNumber}: {ticket.Title}",
                currentUserId.Value
            );

            AddNotificationForUser(
                ticket.CreatedByUserId,
                ticket.Id,
                "Ticket assigned",
                $"{ticket.ReferenceNumber} was assigned to {agent.FullName}.",
                currentUserId.Value
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket assigned successfully.",
                ticketId = ticket.Id,
                assignedToUserId = agent.Id,
                assignedTo = agent.FullName
            });
        }

        // PUT: api/tickets/5/status
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateTicketStatus(int id, UpdateTicketStatusDto dto)
        {
            if (!CanManageTicketWorkflow())
            {
                return Forbid();
            }

            var ticket = await _context.Tickets
                .Include(t => t.Status)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var newStatus = await _context.Statuses.FindAsync(dto.StatusId);

            if (newStatus == null)
            {
                return BadRequest("Invalid status.");
            }

            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var oldStatusName = ticket.Status != null ? ticket.Status.Name : "Unknown";

            ticket.StatusId = dto.StatusId;
            ticket.UpdatedAt = DateTime.UtcNow;

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Action = "Status Updated",
                Description = $"Ticket status changed from {oldStatusName} to {newStatus.Name}.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(activityLog);

            AddNotificationForUser(
                ticket.CreatedByUserId,
                ticket.Id,
                "Ticket status updated",
                $"{ticket.ReferenceNumber}: status changed from {oldStatusName} to {newStatus.Name}.",
                currentUserId.Value
            );

            if (ticket.AssignedToUserId.HasValue)
            {
                AddNotificationForUser(
                    ticket.AssignedToUserId.Value,
                    ticket.Id,
                    "Ticket status updated",
                    $"{ticket.ReferenceNumber}: status changed from {oldStatusName} to {newStatus.Name}.",
                    currentUserId.Value
                );
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket status updated successfully.",
                ticketId = ticket.Id,
                oldStatus = oldStatusName,
                newStatus = newStatus.Name
            });
        }

        // POST: api/tickets/5/comments
        [HttpPost("{id}/comments")]
        public async Task<ActionResult> AddComment(int id, CreateTicketCommentDto dto)
        {
            var canAccessTicket = await CanAccessTicketAsync(id);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest("Comment message is required.");
            }

            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var comment = new TicketComment
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Message = dto.Message.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId.Value,
                Action = "Comment Added",
                Description = "A new comment was added to the ticket.",
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketComments.Add(comment);
            _context.ActivityLogs.Add(activityLog);

            AddNotificationForUser(
                ticket.CreatedByUserId,
                ticket.Id,
                "New comment added",
                $"{ticket.ReferenceNumber}: a new comment was added.",
                currentUserId.Value
            );

            if (ticket.AssignedToUserId.HasValue)
            {
                AddNotificationForUser(
                    ticket.AssignedToUserId.Value,
                    ticket.Id,
                    "New comment added",
                    $"{ticket.ReferenceNumber}: a new comment was added.",
                    currentUserId.Value
                );
            }
            else if (IsEmployee())
            {
                await AddNotificationsForRolesAsync(
                    new[] { "Admin", "IT Support Agent" },
                    ticket.Id,
                    "New employee comment",
                    $"{ticket.ReferenceNumber}: employee added a comment.",
                    currentUserId.Value
                );
            }

            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Comment added successfully.",
                ticketId = ticket.Id,
                commentId = comment.Id,
                comment = comment.Message
            });
        }

        // GET: api/tickets/5/comments
        [HttpGet("{id}/comments")]
        public async Task<ActionResult> GetComments(int id)
        {
            var canAccessTicket = await CanAccessTicketAsync(id);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == id);

            if (!ticketExists)
            {
                return NotFound("Ticket not found.");
            }

            var comments = await _context.TicketComments
                .Include(c => c.User)
                .Where(c => c.TicketId == id)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.TicketId,
                    CommentedBy = c.User != null ? c.User.FullName : "",
                    c.Message,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }

        // GET: api/tickets/5/history
        [HttpGet("{id}/history")]
        public async Task<ActionResult> GetTicketHistory(int id)
        {
            var canAccessTicket = await CanAccessTicketAsync(id);

            if (!canAccessTicket)
            {
                return Forbid();
            }

            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == id);

            if (!ticketExists)
            {
                return NotFound("Ticket not found.");
            }

            var history = await _context.ActivityLogs
                .Include(a => a.User)
                .Where(a => a.TicketId == id)
                .OrderBy(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    a.TicketId,
                    PerformedBy = a.User != null ? a.User.FullName : "",
                    a.Action,
                    a.Description,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(history);
        }

        // DELETE: api/tickets/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTicket(int id)
        {
            if (!CanDeleteTicket())
            {
                return Forbid();
            }

            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var relatedNotifications = await _context.Notifications
                .Where(n => n.TicketId == ticket.Id)
                .ToListAsync();

            foreach (var notification in relatedNotifications)
            {
                notification.TicketId = null;
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket deleted successfully."
            });
        }
    }
}