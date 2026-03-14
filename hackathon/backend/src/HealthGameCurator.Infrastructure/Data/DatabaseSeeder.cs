using HealthGameCurator.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HealthGameCurator.Infrastructure.Data;

/// <summary>
/// 개발용 Mock 데이터 시딩 - 20개 이상의 헬스케어 게임 샘플
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // 이미 데이터가 있으면 시딩 건너뜀
        if (await context.Games.AnyAsync()) return;

        var games = new List<Game>
        {
            new()
            {
                Name = "Zombies, Run!",
                Description = "좀비를 피해 달리는 몰입형 달리기 게임. 스토리 기반 오디오 미션으로 실제 달리기를 게임화합니다.",
                Developer = "Six to Start",
                IconUrl = "https://play-lh.googleusercontent.com/zombies-run-icon",
                Rating = 4.5,
                DownloadCount = 10000000,
                Category = "달리기",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.sixtostart.zombiesrunclient",
                AppStoreUrl = "https://apps.apple.com/app/zombies-run/id503519713",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.95, AiDescription = "지속적인 달리기 운동을 통해 심폐 지구력을 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.75, AiDescription = "스토리 몰입을 통해 운동 중 스트레스를 해소할 수 있습니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Headspace: Meditation & Sleep",
                Description = "마음 챙김과 명상을 안내하는 앱. 스트레스 해소, 수면 개선, 집중력 향상에 도움이 됩니다.",
                Developer = "Headspace Inc.",
                IconUrl = "https://play-lh.googleusercontent.com/headspace-icon",
                Rating = 4.7,
                DownloadCount = 50000000,
                Category = "명상/스트레스 해소",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.getsomeheadspace.android",
                AppStoreUrl = "https://apps.apple.com/app/headspace/id493145008",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#스트레스해소", Confidence = 0.98, AiDescription = "명상과 호흡법을 통해 코르티솔 수치를 낮추고 스트레스를 효과적으로 해소합니다.", IsAiAnalyzed = false },
                    new() { Tag = "#인지개선", Confidence = 0.82, AiDescription = "마음 챙김 연습이 집중력과 인지 기능을 향상시킵니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Ring Fit Adventure",
                Description = "닌텐도 스위치용 피트니스 RPG. 링콘을 이용한 전신 운동으로 어드벤처를 즐깁니다.",
                Developer = "Nintendo",
                IconUrl = "https://play-lh.googleusercontent.com/ringfit-icon",
                Rating = 4.8,
                DownloadCount = 3000000,
                Category = "피트니스",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.92, AiDescription = "링콘을 이용한 다양한 운동 동작으로 전신 근력을 강화합니다.", IsAiAnalyzed = false },
                    new() { Tag = "#심폐기능", Confidence = 0.88, AiDescription = "유산소 운동 미션으로 심폐 기능 향상에 기여합니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.70, AiDescription = "게임 요소가 운동의 즐거움을 높여 스트레스 해소에 도움이 됩니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Beat Saber",
                Description = "리듬에 맞춰 블록을 가르는 VR 리듬 게임. 전신 운동과 반응 훈련을 동시에 제공합니다.",
                Developer = "Beat Games",
                IconUrl = "https://play-lh.googleusercontent.com/beatsaber-icon",
                Rating = 4.9,
                DownloadCount = 5000000,
                Category = "반응훈련",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#반응훈련", Confidence = 0.96, AiDescription = "빠른 비트에 맞춰 반응해야 하는 게임 특성상 반응 속도와 협응력을 크게 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#심폐기능", Confidence = 0.80, AiDescription = "지속적인 팔 동작과 전신 움직임으로 심박수를 높여 심폐 기능 향상에 도움이 됩니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Calm",
                Description = "수면, 명상, 집중력 향상을 위한 멘탈 피트니스 앱. 가이드 명상, 수면 스토리를 제공합니다.",
                Developer = "Calm.com",
                IconUrl = "https://play-lh.googleusercontent.com/calm-icon",
                Rating = 4.6,
                DownloadCount = 100000000,
                Category = "명상/스트레스 해소",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.calm.android",
                AppStoreUrl = "https://apps.apple.com/app/calm/id571800810",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#스트레스해소", Confidence = 0.97, AiDescription = "호흡 운동과 가이드 명상을 통해 불안감과 스트레스를 낮추는 데 효과적입니다.", IsAiAnalyzed = false },
                    new() { Tag = "#인지개선", Confidence = 0.78, AiDescription = "마음 챙김 수련이 전두엽 활성화를 도와 집중력 향상에 기여합니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Lumosity",
                Description = "신경과학 연구 기반 두뇌 훈련 게임. 기억력, 주의력, 문제 해결 능력을 향상시킵니다.",
                Developer = "Lumos Labs",
                IconUrl = "https://play-lh.googleusercontent.com/lumosity-icon",
                Rating = 4.3,
                DownloadCount = 70000000,
                Category = "인지/두뇌훈련",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.lumoslabs.lumosity",
                AppStoreUrl = "https://apps.apple.com/app/lumosity/id577232024",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#인지개선", Confidence = 0.93, AiDescription = "다양한 인지 훈련 게임을 통해 기억력, 주의력, 처리 속도를 체계적으로 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#반응훈련", Confidence = 0.72, AiDescription = "반응 속도 훈련 미니게임을 통해 신경 반응 시간을 단축시킵니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Nike Run Club",
                Description = "나이키의 공식 달리기 앱. GPS 트래킹, 코칭, 도전 과제를 통해 달리기를 즐겁게 만듭니다.",
                Developer = "Nike",
                IconUrl = "https://play-lh.googleusercontent.com/nrc-icon",
                Rating = 4.5,
                DownloadCount = 50000000,
                Category = "달리기",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.nike.plusgps",
                AppStoreUrl = "https://apps.apple.com/app/nike-run-club/id387771637",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.96, AiDescription = "정기적인 달리기 훈련 프로그램으로 심폐 지구력을 체계적으로 향상시킵니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Just Dance Now",
                Description = "스마트폰을 컨트롤러로 사용하는 댄스 게임. 신나는 음악에 맞춰 전신 운동을 즐깁니다.",
                Developer = "Ubisoft",
                IconUrl = "https://play-lh.googleusercontent.com/justdance-icon",
                Rating = 4.2,
                DownloadCount = 20000000,
                Category = "댄스/리듬",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.ubisoft.dance.JustDance",
                AppStoreUrl = "https://apps.apple.com/app/just-dance-now/id833517462",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.87, AiDescription = "지속적인 댄스 동작이 심박수를 높여 유산소 운동 효과를 제공합니다.", IsAiAnalyzed = false },
                    new() { Tag = "#반응훈련", Confidence = 0.83, AiDescription = "음악에 맞춰 빠르게 동작을 따라해야 하므로 반응 속도와 협응력을 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.85, AiDescription = "음악과 댄스의 결합으로 기분 전환과 스트레스 해소에 효과적입니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Pokémon GO",
                Description = "현실 세계를 배경으로 포켓몬을 잡는 AR 게임. 걷기를 장려하여 신체 활동을 늘려줍니다.",
                Developer = "Niantic",
                IconUrl = "https://play-lh.googleusercontent.com/pokemongo-icon",
                Rating = 4.1,
                DownloadCount = 500000000,
                Category = "달리기",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo",
                AppStoreUrl = "https://apps.apple.com/app/pokemon-go/id1094591345",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.70, AiDescription = "게임을 즐기기 위해 야외를 걸어다녀야 하므로 일상적인 신체 활동량을 늘려줍니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Supernatural",
                Description = "VR 피트니스 앱. 전문 코치의 지도 하에 음악에 맞춰 전신 운동을 즐길 수 있습니다.",
                Developer = "Within Unlimited",
                IconUrl = "https://play-lh.googleusercontent.com/supernatural-icon",
                Rating = 4.8,
                DownloadCount = 1000000,
                Category = "피트니스",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.85, AiDescription = "다양한 스쿼트, 런지 동작이 포함된 운동으로 하체 근력 강화에 효과적입니다.", IsAiAnalyzed = false },
                    new() { Tag = "#심폐기능", Confidence = 0.90, AiDescription = "고강도 인터벌 트레이닝(HIIT) 방식의 운동으로 심폐 기능 향상에 탁월합니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "StretchIt",
                Description = "단계별 스트레칭 가이드 앱. 유연성 향상과 부상 예방을 위한 스트레칭 루틴을 제공합니다.",
                Developer = "StretchIt",
                IconUrl = "https://play-lh.googleusercontent.com/stretchit-icon",
                Rating = 4.6,
                DownloadCount = 5000000,
                Category = "피트니스",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.stretchit.app",
                AppStoreUrl = "https://apps.apple.com/app/stretchit/id1348715418",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.65, AiDescription = "지속적인 스트레칭이 근육의 유연성을 높이고 장기적으로 근력 향상에 도움이 됩니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.80, AiDescription = "스트레칭 후 근육 이완이 신체적 긴장을 풀어주어 스트레스 해소에 효과적입니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Wii Sports",
                Description = "닌텐도의 고전 스포츠 게임. 테니스, 볼링, 골프 등을 실제 동작으로 즐기는 게임입니다.",
                Developer = "Nintendo",
                IconUrl = "https://play-lh.googleusercontent.com/wiisports-icon",
                Rating = 4.7,
                DownloadCount = 82900000,
                Category = "피트니스",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.75, AiDescription = "팔 동작이 많은 게임 특성상 상체 근력 향상에 기여합니다.", IsAiAnalyzed = false },
                    new() { Tag = "#반응훈련", Confidence = 0.80, AiDescription = "스포츠 게임의 빠른 동작 반응이 신체 협응력 향상에 효과적입니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Duolingo",
                Description = "게임화된 언어 학습 앱. 짧은 레슨으로 다양한 언어를 배울 수 있으며 인지 능력 향상에 도움이 됩니다.",
                Developer = "Duolingo",
                IconUrl = "https://play-lh.googleusercontent.com/duolingo-icon",
                Rating = 4.5,
                DownloadCount = 500000000,
                Category = "인지/두뇌훈련",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.duolingo",
                AppStoreUrl = "https://apps.apple.com/app/duolingo/id570060128",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#인지개선", Confidence = 0.85, AiDescription = "새로운 언어 학습이 두뇌의 새로운 신경 경로를 형성하여 인지 능력 향상에 기여합니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "FitXR",
                Description = "VR 복싱 및 피트니스 앱. 실제 복싱 트레이닝을 VR로 즐기며 효과적인 유산소 운동을 할 수 있습니다.",
                Developer = "FitXR",
                IconUrl = "https://play-lh.googleusercontent.com/fitxr-icon",
                Rating = 4.4,
                DownloadCount = 500000,
                Category = "팔 운동",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.88, AiDescription = "복싱 동작을 통한 상체 근력 강화 및 코어 강화 효과가 뛰어납니다.", IsAiAnalyzed = false },
                    new() { Tag = "#심폐기능", Confidence = 0.91, AiDescription = "고강도 복싱 인터벌 운동으로 심폐 지구력을 효과적으로 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.87, AiDescription = "복싱 동작을 통한 신체적 발산이 스트레스 해소에 매우 효과적입니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Brain Age",
                Description = "닌텐도DS의 두뇌 훈련 게임. 계산, 독서, 퍼즐 등을 통해 두뇌를 활성화시킵니다.",
                Developer = "Nintendo",
                IconUrl = "https://play-lh.googleusercontent.com/brainage-icon",
                Rating = 4.2,
                DownloadCount = 20000000,
                Category = "인지/두뇌훈련",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#인지개선", Confidence = 0.90, AiDescription = "매일 다양한 두뇌 운동을 통해 처리 속도, 기억력, 계산 능력을 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#반응훈련", Confidence = 0.75, AiDescription = "빠른 계산 미션을 통해 두뇌의 정보 처리 속도를 향상시킵니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Yoga with Adriene",
                Description = "요가 유튜브 채널 기반 앱. 초보자부터 고급자까지 다양한 수준의 요가 루틴을 제공합니다.",
                Developer = "Find What Feels Good",
                IconUrl = "https://play-lh.googleusercontent.com/yoga-icon",
                Rating = 4.7,
                DownloadCount = 10000000,
                Category = "밸런스",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.adriene.yoga",
                AppStoreUrl = "https://apps.apple.com/app/yoga-with-adriene/id1373877357",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.78, AiDescription = "자체 체중을 이용한 요가 동작으로 코어와 전신 근력을 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.92, AiDescription = "요가의 호흡법과 동작이 부교감 신경을 활성화하여 스트레스를 크게 줄여줍니다.", IsAiAnalyzed = false },
                    new() { Tag = "#인지개선", Confidence = 0.65, AiDescription = "마음 챙김 요가 수련이 주의력과 집중력 향상에 도움이 됩니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Tetris Effect",
                Description = "클래식 테트리스를 아름다운 시각 효과와 함께 즐기는 게임. 집중력과 공간 인식 능력을 향상시킵니다.",
                Developer = "Enhance",
                IconUrl = "https://play-lh.googleusercontent.com/tetris-icon",
                Rating = 4.8,
                DownloadCount = 2000000,
                Category = "인지/두뇌훈련",
                PlayStoreUrl = null,
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#인지개선", Confidence = 0.85, AiDescription = "테트리스 플레이가 공간 인식 능력과 작업 기억을 향상시키는 것이 연구로 증명되었습니다.", IsAiAnalyzed = false },
                    new() { Tag = "#스트레스해소", Confidence = 0.72, AiDescription = "'테트리스 효과'로 알려진 몰입 상태가 불안감 감소에 도움이 됩니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Strava",
                Description = "달리기, 사이클링, 수영 등 다양한 운동을 트래킹하는 소셜 피트니스 앱. 커뮤니티와 함께 운동을 즐깁니다.",
                Developer = "Strava",
                IconUrl = "https://play-lh.googleusercontent.com/strava-icon",
                Rating = 4.5,
                DownloadCount = 100000000,
                Category = "달리기",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.strava",
                AppStoreUrl = "https://apps.apple.com/app/strava/id426826309",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.93, AiDescription = "체계적인 운동 트래킹과 코칭으로 심폐 지구력 향상을 효과적으로 지원합니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Balance Board Game",
                Description = "스마트폰 가속도계를 이용한 밸런스 훈련 게임. 발목과 코어 근육 강화로 균형 감각을 향상시킵니다.",
                Developer = "BalanceFit",
                IconUrl = "https://play-lh.googleusercontent.com/balanceboard-icon",
                Rating = 4.0,
                DownloadCount = 1000000,
                Category = "밸런스",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.balancefit.game",
                AppStoreUrl = null,
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.80, AiDescription = "균형 유지를 위한 코어 근육과 하체 근육이 지속적으로 활성화됩니다.", IsAiAnalyzed = false },
                    new() { Tag = "#반응훈련", Confidence = 0.85, AiDescription = "균형을 맞추는 과정에서 빠른 근육 반응 속도가 향상됩니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Arm Workout - 팔 근력 트레이닝",
                Description = "팔 근력 강화에 특화된 운동 게임. 턱걸이, 팔굽혀펴기 등 팔 운동을 게임화했습니다.",
                Developer = "FitGames",
                IconUrl = "https://play-lh.googleusercontent.com/armworkout-icon",
                Rating = 4.1,
                DownloadCount = 3000000,
                Category = "팔 운동",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.fitgames.arm",
                AppStoreUrl = "https://apps.apple.com/app/arm-workout/id1234567",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#근력강화", Confidence = 0.95, AiDescription = "팔 운동 전용 프로그램으로 이두, 삼두, 전완근 등 팔 근육을 집중적으로 강화합니다.", IsAiAnalyzed = false }
                }
            },
            new()
            {
                Name = "Reaction Time Test - 반응속도 훈련",
                Description = "반응 속도 측정과 훈련을 위한 게임. 다양한 시각/청각 자극에 대한 반응을 훈련합니다.",
                Developer = "SpeedTest Games",
                IconUrl = "https://play-lh.googleusercontent.com/reactiontest-icon",
                Rating = 4.3,
                DownloadCount = 8000000,
                Category = "반응훈련",
                PlayStoreUrl = "https://play.google.com/store/apps/details?id=com.speedtest.reaction",
                AppStoreUrl = "https://apps.apple.com/app/reaction-time/id987654321",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#반응훈련", Confidence = 0.98, AiDescription = "체계적인 반응 속도 훈련으로 신경계의 신호 전달 속도를 향상시킵니다.", IsAiAnalyzed = false },
                    new() { Tag = "#인지개선", Confidence = 0.78, AiDescription = "빠른 의사결정 훈련이 전두엽의 실행 기능 향상에 기여합니다.", IsAiAnalyzed = false }
                }
            }
        };

        await context.Games.AddRangeAsync(games);
        await context.SaveChangesAsync();
    }
}
