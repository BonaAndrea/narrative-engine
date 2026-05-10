using System;
using System.Collections.Generic;
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
    [Route("api/saves")]
    public class SavesController : ControllerBase
    {
        private readonly AppDbContext _db;

        // Inject AppDbContext
        public SavesController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/saves/{userId}
        // Returns all save slots for a user ordered by UpdatedAt desc
        [HttpGet("{userId:guid}")]
        public async Task<ActionResult<List<SaveSlot>>> GetByUser(Guid userId, CancellationToken ct)
        {
            var saves = await _db.SaveSlots
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.UpdatedAt)
                .ToListAsync(ct);

            return Ok(saves);
        }

        // GET: api/saves/slot/{saveId}
        // Returns a single SaveSlot by id
        [HttpGet("slot/{saveId:guid}")]
        public async Task<ActionResult<SaveSlot>> GetSlot(Guid saveId, CancellationToken ct)
        {
            var save = await _db.SaveSlots.FindAsync(new object[] { saveId }, ct);
            if (save == null)
                return NotFound();

            return Ok(save);
        }

        // POST: api/saves
        // Creates a new save slot
        [HttpPost]
        public async Task<ActionResult<SaveSlot>> Create([FromBody] SaveSlot saveSlot, CancellationToken ct)
        {
            // Ensure new id if not provided
            if (saveSlot.Id == Guid.Empty)
                saveSlot.Id = Guid.NewGuid();

            var now = DateTime.UtcNow;
            saveSlot.CreatedAt = now;
            saveSlot.UpdatedAt = now;

            _db.SaveSlots.Add(saveSlot);
            await _db.SaveChangesAsync(ct);

            // Return 201 with location of created resource
            return CreatedAtAction(nameof(GetSlot), new { saveId = saveSlot.Id }, saveSlot);
        }

        // PUT: api/saves/{saveId}
        // Updates mutable fields of an existing save slot
        [HttpPut("{saveId:guid}")]
        public async Task<IActionResult> Update(Guid saveId, [FromBody] SaveSlot updated, CancellationToken ct)
        {
            var existing = await _db.SaveSlots.FindAsync(new object[] { saveId }, ct);
            if (existing == null)
                return NotFound();

            // Update allowed fields
            existing.Variables = updated.Variables;
            existing.Flags = updated.Flags;
            existing.ChoiceHistory = updated.ChoiceHistory;
            existing.VisitedScenes = updated.VisitedScenes;
            existing.CurrentSceneId = updated.CurrentSceneId;
            existing.SlotName = updated.SlotName;
            existing.UpdatedAt = DateTime.UtcNow;

            _db.SaveSlots.Update(existing);
            await _db.SaveChangesAsync(ct);

            return NoContent();
        }

        // DELETE: api/saves/{saveId}
        // Deletes a save slot
        [HttpDelete("{saveId:guid}")]
        public async Task<IActionResult> Delete(Guid saveId, CancellationToken ct)
        {
            var existing = await _db.SaveSlots.FindAsync(new object[] { saveId }, ct);
            if (existing == null)
                return NotFound();

            _db.SaveSlots.Remove(existing);
            await _db.SaveChangesAsync(ct);

            return NoContent();
        }
    }
}
