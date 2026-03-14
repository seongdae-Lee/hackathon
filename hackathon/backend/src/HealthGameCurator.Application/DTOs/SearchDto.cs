namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// 게임 검색 결과 DTO - 매칭 필드 정보 포함 (하이라이팅용)
/// </summary>
public record SearchResultDto(
    GameDto Game,
    List<string> MatchedFields,  // "name", "category", "tag" 중 매칭된 필드
    string MatchedKeyword
);
