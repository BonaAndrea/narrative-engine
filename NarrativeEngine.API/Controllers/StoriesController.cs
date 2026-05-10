#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NarrativeEngine.API.Data;
using NarrativeEngine.API.Models.Domain;

namespace NarrativeEngine.API.Controllers
{
    [ApiController]
    [Route("api/stories")]
    public class StoriesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<StoriesController> _logger;

        public StoriesController(AppDbContext db, ILogger<StoriesController> logger)
        {
            _db = db;
            _logger = logger;
        }

        // GET: /api/stories - only published stories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Story>>> GetStories(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Getting published stories");
            var stories = await _db.Stories
                .AsNoTracking()
                .Where(s => s.Published)
                .ToListAsync(cancellationToken);
            return Ok(stories);
        }

        // GET: /api/stories/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Story>> GetStory(Guid id, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Getting story {StoryId}", id);

            var story = await _db.Stories
                .Include(s => s.Scenes)
                .ThenInclude(sc => sc.Choices)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            if (story == null)
            {
                _logger.LogWarning("Story {StoryId} not found", id);
                return NotFound();
            }

            return Ok(story);
        }

        // POST: /api/stories
        [HttpPost]
        public async Task<ActionResult<Story>> CreateStory([FromBody] Story story, CancellationToken cancellationToken)
        {
            if (story == null)
            {
                return BadRequest();
            }

            story.Id = story.Id == Guid.Empty ? Guid.NewGuid() : story.Id;
            story.CreatedAt = story.CreatedAt == default ? DateTime.UtcNow : story.CreatedAt;

            _db.Stories.Add(story);
            await _db.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Created story {StoryId}", story.Id);

            return CreatedAtAction(nameof(GetStory), new { id = story.Id }, story);
        }
    }
}
