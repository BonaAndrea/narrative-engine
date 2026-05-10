#nullable enable
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NarrativeEngine.API.Data;
using NarrativeEngine.API.Models.Domain;

namespace NarrativeEngine.API.Controllers
{
    [ApiController]
    [Route("api/stories/{storyId:guid}/scenes")]
    public class ScenesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ScenesController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/stories/{storyId}/scenes/{sceneId}
        [HttpGet("{sceneId:guid}")]
        public async Task<ActionResult<Scene>> GetScene(Guid storyId, Guid sceneId, CancellationToken cancellationToken)
        {
            var scene = await _db.Scenes
                .Include(s => s.Choices)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == sceneId && s.StoryId == storyId, cancellationToken);

            if (scene == null)
                return NotFound();

           // Ensure choices are ordered by SortOrder
            scene.Choices = scene.Choices.OrderBy(c => c.SortOrder).ToList();

           return Ok(scene);
        }

        // POST: /api/stories/{storyId}/scenes
        [HttpPost]
        public async Task<ActionResult<Scene>> CreateScene(Guid storyId, [FromBody] Scene scene, CancellationToken cancellationToken)
        {
            // Ensure story exists
            var storyExists = await _db.Stories.AnyAsync(s => s.Id == storyId, cancellationToken);
            if (!storyExists)
                return NotFound();

            scene.Id = scene.Id == Guid.Empty ? Guid.NewGuid() : scene.Id;
            scene.StoryId = storyId;

           _db.Scenes.Add(scene);
            await _db.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetScene), new { storyId = storyId, sceneId = scene.Id }, scene);
        }
    }
}
