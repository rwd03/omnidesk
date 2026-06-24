using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Data;
using System.Security.Claims;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
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

        private bool CanViewAllTickets()
        {
            var role = GetCurrentUserRole();

            return role == "Admin"
                || role == "IT Support Agent"
                || role == "Manager";
        }

        [HttpGet("summary")]
        public async Task<ActionResult> GetDashboardSummary()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var role = GetCurrentUserRole();

            var ticketsQuery = _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .AsQueryable();

            if (!CanViewAllTickets())
            {
                if (role == "Employee")
                {
                    ticketsQuery = ticketsQuery.Where(t => t.CreatedByUserId == currentUserId.Value);
                }
                else
                {
                    return Forbid();
                }
            }

            var totalTickets = await ticketsQuery.CountAsync();

            var openTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Open");
            var inProgressTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "In Progress");
            var pendingTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Pending");
            var resolvedTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Resolved");
            var closedTickets = await ticketsQuery.CountAsync(t => t.Status != null && t.Status.Name == "Closed");

            var ticketsByStatus = await ticketsQuery
                .GroupBy(t => t.Status != null ? t.Status.Name : "Unknown")
                .Select(g => new
                {
                    name = g.Key,
                    value = g.Count()
                })
                .OrderBy(x => x.name)
                .ToListAsync();

            var ticketsByCategory = await ticketsQuery
                .GroupBy(t => t.Category != null ? t.Category.Name : "Unknown")
                .Select(g => new
                {
                    name = g.Key,
                    value = g.Count()
                })
                .OrderBy(x => x.name)
                .ToListAsync();

            var ticketsByPriority = await ticketsQuery
                .GroupBy(t => t.Priority != null ? t.Priority.Name : "Unknown")
                .Select(g => new
                {
                    name = g.Key,
                    value = g.Count()
                })
                .OrderBy(x => x.name)
                .ToListAsync();

            var recentTickets = await ticketsQuery
                .OrderByDescending(t => t.CreatedAt)
                .Take(5)
                .Select(t => new
                {
                    id = t.Id,
                    referenceNumber = t.ReferenceNumber,
                    title = t.Title,
                    category = t.Category != null ? t.Category.Name : "",
                    priority = t.Priority != null ? t.Priority.Name : "",
                    status = t.Status != null ? t.Status.Name : "",
                    createdBy = t.CreatedByUser != null ? t.CreatedByUser.FullName : "",
                    assignedTo = t.AssignedToUser != null ? t.AssignedToUser.FullName : "Not assigned",
                    createdAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                role,
                totalTickets,
                openTickets,
                inProgressTickets,
                pendingTickets,
                resolvedTickets,
                closedTickets,
                ticketsByStatus,
                ticketsByCategory,
                ticketsByPriority,
                recentTickets
            });
        }
    }
}