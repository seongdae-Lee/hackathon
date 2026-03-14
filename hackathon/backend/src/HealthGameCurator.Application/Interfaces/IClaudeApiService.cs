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

    /// <summary>
    /// 선택한 건강 목표와 게임 정보를 바탕으로 추천 이유 텍스트 생성
    /// API 실패 시 기본 텍스트 반환 (Graceful degradation)
    /// </summary>
    Task<string> GenerateRecommendReasonAsync(string gameName, string description, string category, IEnumerable<string> selectedGoals);
}
