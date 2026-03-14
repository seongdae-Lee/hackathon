using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Infrastructure.Services;

/// <summary>
/// Mock 게임 데이터 제공자 - RapidAPI 실패 시 Fallback으로 사용
/// </summary>
public static class MockGameDataProvider
{
    public static List<CollectedGameDto> GetMockGames() =>
    [
        new("MyFitnessPal", "전 세계 1억 명 이상이 사용하는 칼로리 추적 및 운동 기록 앱. 음식 데이터베이스와 운동 로그로 건강 목표 달성을 지원합니다.", "Under Armour", "🏃", 4.4, 50000000, "피트니스", "https://play.google.com/store/apps/details?id=com.myfitnesspal.android", "https://apps.apple.com/app/id341232718"),
        new("7 Minute Workout", "과학적으로 설계된 7분 고강도 인터벌 트레이닝. 집에서 장비 없이 전신 운동이 가능합니다.", "Johnson & Johnson", "💪", 4.5, 10000000, "피트니스", "https://play.google.com/store/apps/details?id=com.jnj.sevenminuteworkout", null),
        new("Insight Timer", "5000만 명이 사용하는 세계 최대 명상 앱. 10만 개 이상의 무료 명상 가이드를 제공합니다.", "Insight Network", "🧘", 4.9, 50000000, "명상/스트레스 해소", "https://play.google.com/store/apps/details?id=com.spotlightsix.zentimerlite2", "https://apps.apple.com/app/id337472899"),
        new("Couch to 5K", "초보자를 위한 8주 달리기 훈련 프로그램. 걷기부터 5km 완주까지 단계별로 가이드합니다.", "Active Network", "🏃", 4.6, 5000000, "달리기", "https://play.google.com/store/apps/details?id=com.active.oms3.android.c25kfree", "https://apps.apple.com/app/id448357305"),
        new("Elevate Brain Training", "뇌 운동 앱. 집중력, 처리 속도, 기억력, 수리 능력을 훈련하는 40개 이상의 게임을 제공합니다.", "Elevate Labs", "🧠", 4.4, 10000000, "인지/두뇌훈련", "https://play.google.com/store/apps/details?id=com.elevatelabs.elevate", "https://apps.apple.com/app/id875660456"),
        new("Nike Training Club", "나이키의 무료 운동 앱. 전문 트레이너가 설계한 190개 이상의 운동 프로그램을 제공합니다.", "Nike", "💪", 4.7, 10000000, "피트니스", "https://play.google.com/store/apps/details?id=com.nike.ntc", "https://apps.apple.com/app/id301521403"),
        new("Smash Drums VR", "VR 드럼 리듬 게임. 실제 드럼을 치듯이 팔을 움직이며 운동하면서 음악을 즐깁니다.", "Smash Drums Studio", "💃", 4.3, 500000, "댄스/리듬", null, null),
        new("Wim Hof Method", "빔호프 호흡법과 냉온 노출로 면역력과 체력을 강화하는 마인드-바디 훈련 앱입니다.", "Innerfire BV", "🧘", 4.6, 1000000, "명상/스트레스 해소", "https://play.google.com/store/apps/details?id=com.wimhof.app", "https://apps.apple.com/app/id1114400811"),
        new("Brain Wars", "전 세계 플레이어와 실시간으로 두뇌 게임을 즐기는 멀티플레이어 퍼즐 게임입니다.", "TRANSLIMIT", "🧠", 4.1, 5000000, "인지/두뇌훈련", "https://play.google.com/store/apps/details?id=com.translimit.brainwars", "https://apps.apple.com/app/id887541694"),
        new("Run with Map My Run", "GPS 달리기 추적, 훈련 계획, 커뮤니티 기능을 갖춘 종합 러닝 앱입니다.", "Under Armour", "🏃", 4.2, 10000000, "달리기", "https://play.google.com/store/apps/details?id=com.mapmyfitness.android2", "https://apps.apple.com/app/id291890420"),
    ];
}
