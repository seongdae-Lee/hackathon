namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// Claude AI 분석 요청 DTO
/// </summary>
public record AiAnalysisRequest(
    string GameName,
    string Description,
    string Category,
    string Developer
);

/// <summary>
/// AI 분석 결과 - 개별 태그 정보
/// </summary>
public record AiTagResult(
    string Tag,
    double Confidence,
    string Description
);

/// <summary>
/// Claude AI 분석 응답 DTO
/// </summary>
public record AiAnalysisResult(
    bool IsSuccess,
    List<AiTagResult> Tags,
    string? ErrorMessage = null
);

/// <summary>
/// 게임 AI 분석 트리거 응답 DTO
/// </summary>
public record AnalyzeGameResponse(
    int GameId,
    string GameName,
    bool IsAnalyzed,
    int TagsUpdated,
    string? Message = null
);
