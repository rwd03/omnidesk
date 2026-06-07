using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Data;

namespace OmniDesk.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PrioritiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrioritiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPriorities()
        {
            var priorities = await _context.Priorities
                .Select(p => new
                {
                    p.Id,
                    p.Name
                })
                .ToListAsync();

            return Ok(priorities);
        }
    }
}