namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// 게임 목록 응답 DTO
/// </summary>
public record GameDto(
    int Id,
    string Name,
    string Description,
    string Developer,
    string IconUrl,
    double Rating,
    long DownloadCount,
    string Category,
    string? PlayStoreUrl,
    string? AppStoreUrl,
    DateTime CreatedAt,
    List<HealthTagDto> HealthTags
);

/// <summary>
/// 건강 효과 태그 DTO
/// </summary>
public record HealthTagDto(
    int Id,
    string Tag,
    double Confidence,
    string AiDescription,
    bool IsAiAnalyzed
);

/// <summary>
/// 게임 목록 쿼리 파라미터
/// </summary>
public record GameListQuery(
    string? Category = null,
    string? Sort = "popular",  // popular, rating, latest
    int Page = 1,
    int PageSize = 20
);

/// <summary>
/// 페이지네이션 응답
/// </summary>
public record PagedResult<T>(
    List<T> Items,
    int Total,
    int Page,
    int PageSize
);
