using HealthGameCurator.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HealthGameCurator.Infrastructure.Data;

/// <summary>
/// EF Core DbContext - SQLite (개발) / PostgreSQL (운영)
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Game> Games => Set<Game>();
    public DbSet<HealthTag> HealthTags => Set<HealthTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Game 엔티티 설정
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Developer).HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Rating).HasPrecision(3, 1);
        });

        // HealthTag 엔티티 설정
        modelBuilder.Entity<HealthTag>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Tag).IsRequired().HasMaxLength(100);
            entity.Property(e => e.AiDescription).HasMaxLength(1000);
            entity.Property(e => e.Confidence).HasPrecision(5, 4);

            // Game - HealthTag 관계 (1:N)
            entity.HasOne(e => e.Game)
                  .WithMany(g => g.HealthTags)
                  .HasForeignKey(e => e.GameId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
