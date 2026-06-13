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

        // GET: api/tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
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
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest("Title and description are required.");
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdString == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var userId = int.Parse(userIdString);

            var ticket = new Ticket
            {
                ReferenceNumber = $"TCK-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                PriorityId = dto.PriorityId,
                StatusId = 1,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
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
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            ticket.Title = dto.Title;
            ticket.Description = dto.Description;
            ticket.CategoryId = dto.CategoryId;
            ticket.PriorityId = dto.PriorityId;
            ticket.StatusId = dto.StatusId;
            ticket.UpdatedAt = DateTime.UtcNow;

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

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdString == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var currentUserId = int.Parse(userIdString);

            ticket.AssignedToUserId = dto.AssignedToUserId;
            ticket.UpdatedAt = DateTime.UtcNow;

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId,
                Action = "Ticket Assigned",
                Description = $"Ticket assigned to {agent.FullName}.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(activityLog);

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

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdString == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var currentUserId = int.Parse(userIdString);

            var oldStatusName = ticket.Status != null ? ticket.Status.Name : "Unknown";

            ticket.StatusId = dto.StatusId;
            ticket.UpdatedAt = DateTime.UtcNow;

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId,
                Action = "Status Updated",
                Description = $"Ticket status changed from {oldStatusName} to {newStatus.Name}.",
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(activityLog);

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
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest("Comment message is required.");
            }

            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdString == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var currentUserId = int.Parse(userIdString);

            var comment = new TicketComment
            {
                TicketId = ticket.Id,
                UserId = currentUserId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            var activityLog = new ActivityLog
            {
                TicketId = ticket.Id,
                UserId = currentUserId,
                Action = "Comment Added",
                Description = "A new comment was added to the ticket.",
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketComments.Add(comment);
            _context.ActivityLogs.Add(activityLog);

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
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
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