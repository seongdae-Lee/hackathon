namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// 관리자 로그인 요청 DTO
/// </summary>
public record LoginRequest(string Username, string Password);

/// <summary>
/// 관리자 로그인 응답 DTO - JWT 토큰 + 만료 시각 반환
/// </summary>
public record LoginResponse(string Token, DateTime ExpiresAt);

/// <summary>
/// 관리자 대시보드 통계 DTO
/// </summary>
public record AdminStatsDto(
    int TotalGames,
    int AnalyzedGames,
    int UnanalyzedGames
);

/// <summary>
/// 게임 추가 요청 DTO
/// </summary>
public record CreateGameRequest(
    string Name,
    string Description,
    string Developer,
    string Category,
    double Rating,
    long DownloadCount,
    string IconUrl,
    string? PlayStoreUrl,
    string? AppStoreUrl
);

/// <summary>
/// 게임 수정 요청 DTO
/// </summary>
public record UpdateGameRequest(
    string Name,
    string Description,
    string Developer,
    string Category,
    double Rating,
    long DownloadCount,
    string IconUrl,
    string? PlayStoreUrl,
    string? AppStoreUrl
);

/// <summary>
/// 관리자 게임 목록 DTO (등록일 포함 전체 정보)
/// </summary>
public record AdminGameDto(
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
    bool IsAiAnalyzed,
    List<HealthTagDto> HealthTags
);
