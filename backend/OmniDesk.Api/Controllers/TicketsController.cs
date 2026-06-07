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