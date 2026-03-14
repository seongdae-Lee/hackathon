namespace HealthGameCurator.Domain.Entities;

/// <summary>
/// 게임 엔티티 - 헬스케어 게임의 기본 정보를 담습니다
/// </summary>
public class Game
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Developer { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public double Rating { get; set; }
    public long DownloadCount { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? PlayStoreUrl { get; set; }
    public string? AppStoreUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // 연관 엔티티
    public ICollection<HealthTag> HealthTags { get; set; } = new List<HealthTag>();
}
