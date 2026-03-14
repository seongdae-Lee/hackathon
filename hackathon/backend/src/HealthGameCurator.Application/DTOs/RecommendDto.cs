namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// 맞춤 추천 요청 DTO
/// </summary>
public record RecommendRequest(
    List<string> HealthGoals  // 예: ["심폐기능", "스트레스해소"]
);

/// <summary>
/// 추천 결과 항목 DTO
/// </summary>
public record RecommendResultDto(
    GameDto Game,
    double MatchScore,       // 매칭 점수 (0.0 ~ 1.0)
    string RecommendReason   // AI 생성 추천 이유 텍스트
);

/// <summary>
/// 맞춤 추천 응답 DTO
/// </summary>
public record RecommendResponse(
    List<string> SelectedGoals,
    List<RecommendResultDto> Games
);
