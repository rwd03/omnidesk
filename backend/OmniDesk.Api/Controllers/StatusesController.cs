using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Data;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatusesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatusesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _context.Statuses
                .Select(s => new
                {
                    s.Id,
                    s.Name
                })
                .ToListAsync();

            return Ok(statuses);
        }
    }
}