using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// Claude AI API 서비스 인터페이스
/// </summary>
public interface IClaudeApiService
{
    /// <summary>
    /// 게임 메타데이터를 분석하여 건강 효과 태그 반환
    /// </summary>
    Task<AiAnalysisResult> AnalyzeGameHealthTagsAsync(AiAnalysisRequest request);
}
