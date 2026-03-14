namespace HealthGameCurator.Domain.Entities;

/// <summary>
/// 건강 효과 태그 엔티티 - AI가 분석한 게임의 건강 효과 정보를 담습니다
/// </summary>
public class HealthTag
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public string Tag { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string AiDescription { get; set; } = string.Empty;
    public bool IsAiAnalyzed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // 연관 엔티티
    public Game Game { get; set; } = null!;
}
