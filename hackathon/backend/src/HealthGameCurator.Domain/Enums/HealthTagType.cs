namespace HealthGameCurator.Domain.Enums;

/// <summary>
/// 건강 효과 태그 타입 정의 - AI 분석에 사용되는 5개 태그
/// </summary>
public static class HealthTagType
{
    public const string Cardio = "#심폐기능";
    public const string Strength = "#근력강화";
    public const string StressRelief = "#스트레스해소";
    public const string Cognitive = "#인지개선";
    public const string ReactionTraining = "#반응훈련";

    public static readonly IReadOnlyList<string> AllTags = new[]
    {
        Cardio,
        Strength,
        StressRelief,
        Cognitive,
        ReactionTraining,
    };
}
