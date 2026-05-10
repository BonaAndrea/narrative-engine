using Microsoft.EntityFrameworkCore;
using NarrativeEngine.API.Models.Domain;

namespace NarrativeEngine.API.Data
{
    // Minimal EF Core DbContext for NarrativeEngine
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Domain DbSet<T> properties
        public DbSet<Story> Stories { get; set; } = null!;
        public DbSet<Scene> Scenes { get; set; } = null!;
        public DbSet<Choice> Choices { get; set; } = null!;
        public DbSet<SaveSlot> SaveSlots { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Story -> Scenes (cascade delete)
            modelBuilder.Entity<Story>()
                .HasMany(s => s.Scenes)
                .WithOne(sc => sc.Story)
                .HasForeignKey(sc => sc.StoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Scene -> Choices (cascade delete)
            modelBuilder.Entity<Scene>()
                .HasMany(s => s.Choices)
                .WithOne(c => c.Scene)
                .HasForeignKey(c => c.SceneId)
                .OnDelete(DeleteBehavior.Cascade);

            // User unique indexes on Email and Username
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Additional model configuration can be added here
        }
    }
}