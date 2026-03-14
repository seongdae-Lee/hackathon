namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// 외부 소스에서 수집된 게임 데이터 DTO
/// </summary>
public record CollectedGameDto(
    string Name,
    string Description,
    string Developer,
    string IconUrl,
    double Rating,
    long DownloadCount,
    string Category,
    string? PlayStoreUrl,
    string? AppStoreUrl
);

/// <summary>
/// 데이터 수집 결과 DTO
/// </summary>
public record CollectionResult(
    bool IsSuccess,
    int CollectedCount,
    int SavedCount,
    int SkippedCount,
    string? ErrorMessage = null
);
