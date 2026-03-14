# Sprint 1: 프론트엔드 UI + Mock 데이터 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 게임 홈 페이지와 상세 페이지 UI를 Mock 데이터 기반으로 완성하고, 백엔드 기초 API를 구축하여 사용자가 게임 목록 탐색 및 상세 정보 확인이 가능한 상태를 만든다.

**Architecture:** Next.js 14 App Router (프론트엔드) + ASP.NET Core 8 Clean Architecture (백엔드) + SQLite (개발 DB) + Docker Compose (컨테이너 오케스트레이션). 프론트엔드는 TanStack Query로 백엔드 API를 호출하며, Phase 1에서는 Mock JSON 데이터를 DB에 시딩하여 사용한다.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind CSS, TanStack Query, Zustand, ASP.NET Core 8, C# 12, EF Core + SQLite, Serilog, FluentValidation, xUnit, Docker Compose

**기간:** 2026-03-14 ~ 2026-03-27 (2주, 10 영업일)

**스프린트 번호:** Sprint 1 (Phase 1)

---

## 스프린트 목표

| 목표 | 설명 |
|------|------|
| 프론트엔드 UI 완성 | 게임 홈 페이지 + 상세 페이지, 반응형 레이아웃 |
| 공통 컴포넌트 구축 | 게임 카드, 카테고리 필터, 정렬 드롭다운, 레이아웃 |
| 백엔드 기초 API 구축 | GET /api/games, GET /api/games/{id}, GET /api/categories |
| 인프라 셋업 | Docker Compose, EF Core + SQLite, Mock 시드 데이터 |

---

## 작업 항목 (Task Breakdown)

### Task 1-1: 프로젝트 초기 설정

**우선순위:** 최상 (모든 작업의 전제 조건)
**예상 소요:** 1.5일

**Files:**
- Create: `frontend/` (Next.js 프로젝트 루트)
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/.eslintrc.json`
- Create: `backend/HealthGameCurator.sln`
- Create: `backend/src/HealthGameCurator.Api/`
- Create: `backend/src/HealthGameCurator.Application/`
- Create: `backend/src/HealthGameCurator.Domain/`
- Create: `backend/src/HealthGameCurator.Infrastructure/`
- Create: `backend/tests/HealthGameCurator.Tests/`
- Create: `docker-compose.yml`
- Create: `docker-compose.override.yml`

**Step 1: Next.js 프로젝트 생성**

```bash
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Expected: `frontend/` 디렉토리 생성 완료

**Step 2: TypeScript strict mode 확인**

`frontend/tsconfig.json`에서 아래 설정 확인 및 추가:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Step 3: Tailwind 기본 테마 설정**

`frontend/tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 4: TanStack Query + Zustand 설치**

```bash
cd frontend
npm install @tanstack/react-query @tanstack/react-query-devtools zustand
```

Expected: `package.json`에 의존성 추가됨

**Step 5: ASP.NET Core Clean Architecture 솔루션 생성**

```bash
mkdir -p backend/src backend/tests
cd backend

dotnet new sln -n HealthGameCurator

dotnet new webapi -n HealthGameCurator.Api -o src/HealthGameCurator.Api
dotnet new classlib -n HealthGameCurator.Application -o src/HealthGameCurator.Application
dotnet new classlib -n HealthGameCurator.Domain -o src/HealthGameCurator.Domain
dotnet new classlib -n HealthGameCurator.Infrastructure -o src/HealthGameCurator.Infrastructure
dotnet new xunit -n HealthGameCurator.Tests -o tests/HealthGameCurator.Tests

dotnet sln add src/HealthGameCurator.Api
dotnet sln add src/HealthGameCurator.Application
dotnet sln add src/HealthGameCurator.Domain
dotnet sln add src/HealthGameCurator.Infrastructure
dotnet sln add tests/HealthGameCurator.Tests
```

**Step 6: 프로젝트 참조 설정**

```bash
cd backend
dotnet add src/HealthGameCurator.Api reference src/HealthGameCurator.Application
dotnet add src/HealthGameCurator.Application reference src/HealthGameCurator.Domain
dotnet add src/HealthGameCurator.Infrastructure reference src/HealthGameCurator.Application
dotnet add src/HealthGameCurator.Api reference src/HealthGameCurator.Infrastructure
dotnet add tests/HealthGameCurator.Tests reference src/HealthGameCurator.Application
dotnet add tests/HealthGameCurator.Tests reference src/HealthGameCurator.Domain
```

**Step 7: NuGet 패키지 설치**

```bash
cd backend
# Infrastructure
dotnet add src/HealthGameCurator.Infrastructure package Microsoft.EntityFrameworkCore.Sqlite
dotnet add src/HealthGameCurator.Infrastructure package Microsoft.EntityFrameworkCore.Design
dotnet add src/HealthGameCurator.Infrastructure package Serilog.AspNetCore
dotnet add src/HealthGameCurator.Infrastructure package Serilog.Sinks.Console

# Api
dotnet add src/HealthGameCurator.Api package Serilog.AspNetCore
dotnet add src/HealthGameCurator.Api package FluentValidation.AspNetCore
dotnet add src/HealthGameCurator.Api package Microsoft.EntityFrameworkCore.Design

# Tests
dotnet add tests/HealthGameCurator.Tests package Moq
dotnet add tests/HealthGameCurator.Tests package FluentAssertions
```

**Step 8: Docker Compose 설정**

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Data Source=/app/data/healthgame.db
    volumes:
      - backend-data:/app/data

volumes:
  backend-data:
```

**Step 9: Mock 데이터 JSON 파일 생성**

`backend/src/HealthGameCurator.Infrastructure/Data/SeedData/games.json` — 게임 20개 이상, 다음 필드 포함:
- `id`, `name`, `description`, `developer`, `iconUrl`, `rating`, `downloadCount`, `category`, `playStoreUrl`, `appStoreUrl`
- 카테고리: 달리기, 명상/스트레스해소, 팔운동, 반응훈련, 밸런스, 피트니스

`backend/src/HealthGameCurator.Infrastructure/Data/SeedData/health-tags.json` — 태그 Mock 데이터:
- `gameId`, `tag`, `confidence`, `aiDescription`

**Step 10: 빌드 확인**

```bash
cd backend && dotnet build
cd frontend && npm run build
```

Expected: 양쪽 모두 오류 없음

**Step 11: 커밋**

```bash
git add -A
git commit -m "chore: 프로젝트 초기 설정 (Next.js, ASP.NET Core, Docker Compose)"
```

---

### Task 1-2: 백엔드 Domain / Application / Infrastructure 레이어

**우선순위:** 높음 (프론트엔드와 병렬 진행 가능)
**예상 소요:** 1.5일

**Files:**
- Create: `backend/src/HealthGameCurator.Domain/Entities/Game.cs`
- Create: `backend/src/HealthGameCurator.Domain/Entities/HealthTag.cs`
- Create: `backend/src/HealthGameCurator.Application/DTOs/GameDto.cs`
- Create: `backend/src/HealthGameCurator.Application/DTOs/HealthTagDto.cs`
- Create: `backend/src/HealthGameCurator.Application/DTOs/ApiResponse.cs`
- Create: `backend/src/HealthGameCurator.Application/Interfaces/IGameRepository.cs`
- Create: `backend/src/HealthGameCurator.Application/Services/GameService.cs`
- Create: `backend/src/HealthGameCurator.Infrastructure/Data/AppDbContext.cs`
- Create: `backend/src/HealthGameCurator.Infrastructure/Repositories/GameRepository.cs`
- Create: `backend/src/HealthGameCurator.Infrastructure/Data/DbSeeder.cs`
- Test: `backend/tests/HealthGameCurator.Tests/Services/GameServiceTests.cs`

**Step 1: Domain 엔티티 정의**

`Game.cs`:
```csharp
#nullable enable
namespace HealthGameCurator.Domain.Entities;

public class Game
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Developer { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public double Rating { get; set; }
    public long DownloadCount { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? PlayStoreUrl { get; set; }
    public string? AppStoreUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<HealthTag> HealthTags { get; set; } = new List<HealthTag>();
}
```

`HealthTag.cs`:
```csharp
#nullable enable
namespace HealthGameCurator.Domain.Entities;

public class HealthTag
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public string Tag { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string AiDescription { get; set; } = string.Empty;
    public Game Game { get; set; } = null!;
}
```

**Step 2: Application DTO 정의 (record 타입)**

`GameDto.cs`:
```csharp
namespace HealthGameCurator.Application.DTOs;

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
    IReadOnlyList<HealthTagDto> HealthTags
);

public record GameSummaryDto(
    int Id,
    string Name,
    string IconUrl,
    double Rating,
    string Category,
    IReadOnlyList<HealthTagDto> HealthTags
);
```

`HealthTagDto.cs`:
```csharp
namespace HealthGameCurator.Application.DTOs;

public record HealthTagDto(
    int Id,
    string Tag,
    double Confidence,
    string AiDescription
);
```

`ApiResponse.cs`:
```csharp
namespace HealthGameCurator.Application.DTOs;

public record ApiResponse<T>(bool Success, T? Data, string? Error = null, string? Code = null)
{
    public static ApiResponse<T> Ok(T data) => new(true, data);
    public static ApiResponse<T> Fail(string error, string code = "ERROR") => new(false, default, error, code);
}
```

**Step 3: Repository 인터페이스 정의**

`IGameRepository.cs`:
```csharp
using HealthGameCurator.Domain.Entities;

namespace HealthGameCurator.Application.Interfaces;

public interface IGameRepository
{
    Task<(IReadOnlyList<Game> Items, int TotalCount)> GetGamesAsync(
        string? category, string? sort, int page, int pageSize, CancellationToken ct = default);
    Task<Game?> GetGameByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<string>> GetCategoriesAsync(CancellationToken ct = default);
}
```

**Step 4: GameService 구현**

`GameService.cs`:
```csharp
using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;

namespace HealthGameCurator.Application.Services;

public class GameService(IGameRepository repository)
{
    // 게임 목록 조회 (카테고리 필터, 정렬, 페이지네이션)
    public async Task<ApiResponse<PagedResult<GameSummaryDto>>> GetGamesAsync(
        string? category, string? sort, int page, int pageSize, CancellationToken ct = default)
    {
        var (items, totalCount) = await repository.GetGamesAsync(category, sort, page, pageSize, ct);
        var dtos = items.Select(MapToSummary).ToList();
        return ApiResponse<PagedResult<GameSummaryDto>>.Ok(new PagedResult<GameSummaryDto>(dtos, totalCount, page, pageSize));
    }

    // 게임 상세 조회
    public async Task<ApiResponse<GameDto>> GetGameByIdAsync(int id, CancellationToken ct = default)
    {
        var game = await repository.GetGameByIdAsync(id, ct);
        if (game is null)
            return ApiResponse<GameDto>.Fail("게임을 찾을 수 없습니다.", "GAME_NOT_FOUND");
        return ApiResponse<GameDto>.Ok(MapToDto(game));
    }

    // 카테고리 목록 조회
    public async Task<ApiResponse<IReadOnlyList<string>>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var categories = await repository.GetCategoriesAsync(ct);
        return ApiResponse<IReadOnlyList<string>>.Ok(categories);
    }

    private static GameDto MapToDto(Game game) => new(
        game.Id, game.Name, game.Description, game.Developer,
        game.IconUrl, game.Rating, game.DownloadCount, game.Category,
        game.PlayStoreUrl, game.AppStoreUrl, game.CreatedAt,
        game.HealthTags.Select(MapToTagDto).ToList());

    private static GameSummaryDto MapToSummary(Game game) => new(
        game.Id, game.Name, game.IconUrl, game.Rating, game.Category,
        game.HealthTags.Select(MapToTagDto).ToList());

    private static HealthTagDto MapToTagDto(HealthTag tag) => new(
        tag.Id, tag.Tag, tag.Confidence, tag.AiDescription);
}

public record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount, int Page, int PageSize);
```

**Step 5: 단위 테스트 작성 (TDD)**

`GameServiceTests.cs`:
```csharp
using FluentAssertions;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Domain.Entities;
using Moq;

namespace HealthGameCurator.Tests.Services;

public class GameServiceTests
{
    private readonly Mock<IGameRepository> _repositoryMock = new();
    private readonly GameService _sut;

    public GameServiceTests()
    {
        _sut = new GameService(_repositoryMock.Object);
    }

    [Fact]
    public async Task 게임_목록_조회_성공_시_PagedResult를_반환한다()
    {
        // Arrange
        var games = new List<Game> { MakeGame(1, "달리기 앱", "달리기") };
        _repositoryMock.Setup(r => r.GetGamesAsync(null, null, 1, 20, default))
            .ReturnsAsync((games.AsReadOnly(), 1));

        // Act
        var result = await _sut.GetGamesAsync(null, null, 1, 20);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.Items.Should().HaveCount(1);
        result.Data.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task 존재하지_않는_게임ID_조회_시_GAME_NOT_FOUND_에러를_반환한다()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetGameByIdAsync(999, default))
            .ReturnsAsync((Game?)null);

        // Act
        var result = await _sut.GetGameByIdAsync(999);

        // Assert
        result.Success.Should().BeFalse();
        result.Code.Should().Be("GAME_NOT_FOUND");
    }

    private static Game MakeGame(int id, string name, string category) => new()
    {
        Id = id, Name = name, Category = category,
        Description = "테스트", Developer = "테스트 개발사",
        IconUrl = "https://example.com/icon.png",
    };
}
```

**Step 6: 테스트 실행 확인**

```bash
cd backend && dotnet test
```

Expected: 2 tests passed

**Step 7: EF Core DbContext + SQLite 설정**

`AppDbContext.cs`:
```csharp
using HealthGameCurator.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HealthGameCurator.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Game> Games => Set<Game>();
    public DbSet<HealthTag> HealthTags => Set<HealthTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(e =>
        {
            e.HasKey(g => g.Id);
            e.Property(g => g.Name).HasMaxLength(200).IsRequired();
            e.Property(g => g.Category).HasMaxLength(100).IsRequired();
            e.HasMany(g => g.HealthTags)
             .WithOne(t => t.Game)
             .HasForeignKey(t => t.GameId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HealthTag>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Tag).HasMaxLength(100).IsRequired();
        });
    }
}
```

**Step 8: GameRepository 구현**

`GameRepository.cs`:
```csharp
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using HealthGameCurator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HealthGameCurator.Infrastructure.Repositories;

public class GameRepository(AppDbContext db) : IGameRepository
{
    public async Task<(IReadOnlyList<Game> Items, int TotalCount)> GetGamesAsync(
        string? category, string? sort, int page, int pageSize, CancellationToken ct = default)
    {
        var query = db.Games.Include(g => g.HealthTags).AsQueryable();

        // 카테고리 필터
        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(g => g.Category == category);

        // 정렬
        query = sort switch
        {
            "rating" => query.OrderByDescending(g => g.Rating),
            "latest" => query.OrderByDescending(g => g.CreatedAt),
            _ => query.OrderByDescending(g => g.DownloadCount) // 기본: 인기순
        };

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Game?> GetGameByIdAsync(int id, CancellationToken ct = default)
        => await db.Games.Include(g => g.HealthTags).FirstOrDefaultAsync(g => g.Id == id, ct);

    public async Task<IReadOnlyList<string>> GetCategoriesAsync(CancellationToken ct = default)
        => await db.Games.Select(g => g.Category).Distinct().OrderBy(c => c).ToListAsync(ct);
}
```

**Step 9: DbSeeder 구현**

`DbSeeder.cs`:
```csharp
using System.Text.Json;
using HealthGameCurator.Domain.Entities;
using HealthGameCurator.Infrastructure.Data;

namespace HealthGameCurator.Infrastructure.Data;

public static class DbSeeder
{
    // Mock JSON 파일을 읽어 DB에 시딩 (이미 데이터 있으면 스킵)
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Games.Any()) return;

        var gamesJson = await File.ReadAllTextAsync("Data/SeedData/games.json");
        var games = JsonSerializer.Deserialize<List<Game>>(gamesJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (games is null) return;

        db.Games.AddRange(games);
        await db.SaveChangesAsync();
    }
}
```

**Step 10: 초기 마이그레이션 생성**

```bash
cd backend
dotnet ef migrations add InitialCreate \
  --project src/HealthGameCurator.Infrastructure \
  --startup-project src/HealthGameCurator.Api
dotnet ef database update \
  --project src/HealthGameCurator.Infrastructure \
  --startup-project src/HealthGameCurator.Api
```

**Step 11: 커밋**

```bash
git add -A
git commit -m "feat: 백엔드 Domain/Application/Infrastructure 레이어 구현"
```

---

### Task 1-3: 백엔드 API 컨트롤러 + 미들웨어

**우선순위:** 높음
**예상 소요:** 0.5일

**Files:**
- Create: `backend/src/HealthGameCurator.Api/Controllers/GamesController.cs`
- Create: `backend/src/HealthGameCurator.Api/Controllers/CategoriesController.cs`
- Modify: `backend/src/HealthGameCurator.Api/Program.cs`

**Step 1: GamesController 구현**

`GamesController.cs`:
```csharp
using HealthGameCurator.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController(GameService gameService) : ControllerBase
{
    // GET /api/games?category=달리기&sort=rating&page=1&pageSize=20
    [HttpGet]
    public async Task<IActionResult> GetGames(
        [FromQuery] string? category,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await gameService.GetGamesAsync(category, sort, page, pageSize, ct);
        return Ok(result);
    }

    // GET /api/games/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetGame(int id, CancellationToken ct = default)
    {
        var result = await gameService.GetGameByIdAsync(id, ct);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
```

`CategoriesController.cs`:
```csharp
using HealthGameCurator.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(GameService gameService) : ControllerBase
{
    // GET /api/categories
    [HttpGet]
    public async Task<IActionResult> GetCategories(CancellationToken ct = default)
    {
        var result = await gameService.GetCategoriesAsync(ct);
        return Ok(result);
    }
}
```

**Step 2: Program.cs 설정 (DI, CORS, Serilog)**

`Program.cs`:
```csharp
using HealthGameCurator.Application.Services;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Infrastructure.Data;
using HealthGameCurator.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .WriteTo.Console());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB 설정
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI 등록
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<GameService>();

// CORS: 프론트엔드 도메인만 허용
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// DB 마이그레이션 + 시딩 (개발 환경)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseCors();
app.MapControllers();

await app.RunAsync();
```

**Step 3: API 동작 확인**

```bash
cd backend && dotnet run --project src/HealthGameCurator.Api
curl http://localhost:5000/api/games
curl http://localhost:5000/api/categories
```

Expected: JSON 응답 반환 (success: true)

**Step 4: 커밋**

```bash
git add -A
git commit -m "feat: 백엔드 API 컨트롤러 및 미들웨어 구현"
```

---

### Task 1-4: 프론트엔드 공통 레이아웃 + 공통 컴포넌트

**우선순위:** 높음
**예상 소요:** 1.5일

**Files:**
- Create: `frontend/src/components/layout/Header.tsx`
- Create: `frontend/src/components/layout/Footer.tsx`
- Create: `frontend/src/components/layout/index.ts`
- Create: `frontend/src/components/game/GameCard.tsx`
- Create: `frontend/src/components/game/index.ts`
- Create: `frontend/src/components/filter/CategoryFilter.tsx`
- Create: `frontend/src/components/filter/SortDropdown.tsx`
- Create: `frontend/src/components/filter/index.ts`
- Create: `frontend/src/lib/api/games.ts`
- Create: `frontend/src/lib/types.ts`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/providers.tsx`

**Step 1: 공통 타입 정의**

`frontend/src/lib/types.ts`:
```ts
export interface HealthTagDto {
  id: number
  tag: string
  confidence: number
  aiDescription: string
}

export interface GameSummaryDto {
  id: number
  name: string
  iconUrl: string
  rating: number
  category: string
  healthTags: HealthTagDto[]
}

export interface GameDto extends GameSummaryDto {
  description: string
  developer: string
  downloadCount: number
  playStoreUrl: string | null
  appStoreUrl: string | null
  createdAt: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
  code?: string
}
```

**Step 2: API 클라이언트 함수**

`frontend/src/lib/api/games.ts`:
```ts
import { ApiResponse, GameDto, GameSummaryDto, PagedResult } from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export async function fetchGames(params: {
  category?: string
  sort?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PagedResult<GameSummaryDto>>> {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', String(params.page))
  if (params.pageSize) query.set('pageSize', String(params.pageSize))

  const res = await fetch(`${API_BASE}/api/games?${query}`)
  if (!res.ok) throw new Error('게임 목록 조회 실패')
  return res.json()
}

export async function fetchGameById(id: number): Promise<ApiResponse<GameDto>> {
  const res = await fetch(`${API_BASE}/api/games/${id}`)
  if (!res.ok) throw new Error('게임 상세 조회 실패')
  return res.json()
}

export async function fetchCategories(): Promise<ApiResponse<string[]>> {
  const res = await fetch(`${API_BASE}/api/categories`)
  if (!res.ok) throw new Error('카테고리 조회 실패')
  return res.json()
}
```

**Step 3: TanStack Query Provider 설정**

`frontend/src/app/providers.tsx`:
```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000 },
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Step 4: Header 컴포넌트**

`frontend/src/components/layout/Header.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-primary">
            헬스게임 큐레이터
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              게임 탐색
            </Link>
          </nav>

          {/* 모바일 햄버거 메뉴 */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
            <Link
              href="/"
              className="block px-2 py-2 text-gray-600 hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              게임 탐색
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
```

**Step 5: Footer 컴포넌트**

`frontend/src/components/layout/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>헬스게임 큐레이터 — 건강 목표를 이루는 게임을 AI로 큐레이션</p>
      </div>
    </footer>
  )
}
```

**Step 6: GameCard 컴포넌트**

`frontend/src/components/game/GameCard.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'
import { GameSummaryDto } from '@/lib/types'

interface Props {
  game: GameSummaryDto
}

// 태그별 배지 색상 매핑
const TAG_COLORS: Record<string, string> = {
  '#심폐기능': 'bg-red-100 text-red-700',
  '#근력강화': 'bg-orange-100 text-orange-700',
  '#스트레스해소': 'bg-green-100 text-green-700',
  '#인지개선': 'bg-blue-100 text-blue-700',
  '#반응훈련': 'bg-purple-100 text-purple-700',
  '#밸런스': 'bg-yellow-100 text-yellow-700',
}

export function GameCard({ game }: Props) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-4 flex flex-col gap-3 cursor-pointer">
        {/* 아이콘 + 기본 정보 */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={game.iconUrl}
              alt={`${game.name} 아이콘`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{game.name}</h3>
            <p className="text-sm text-gray-500">{game.category}</p>
            {/* 별점 */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-sm font-medium text-gray-700">{game.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* 건강 효과 태그 배지 */}
        {game.healthTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.healthTags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[tag.tag] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {tag.tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

**Step 7: CategoryFilter 컴포넌트**

`frontend/src/components/filter/CategoryFilter.tsx`:
```tsx
'use client'

interface Props {
  categories: string[]
  selected: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
```

**Step 8: SortDropdown 컴포넌트**

`frontend/src/components/filter/SortDropdown.tsx`:
```tsx
'use client'

const SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
  { value: 'latest', label: '최신순' },
]

interface Props {
  value: string
  onChange: (sort: string) => void
}

export function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="정렬 기준 선택"
    >
      {SORT_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
```

**Step 9: barrel export 파일 생성**

`frontend/src/components/layout/index.ts`:
```ts
export { Header } from './Header'
export { Footer } from './Footer'
```

`frontend/src/components/game/index.ts`:
```ts
export { GameCard } from './GameCard'
```

`frontend/src/components/filter/index.ts`:
```ts
export { CategoryFilter } from './CategoryFilter'
export { SortDropdown } from './SortDropdown'
```

**Step 10: 루트 레이아웃 수정**

`frontend/src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'

export const metadata: Metadata = {
  title: '헬스게임 큐레이터',
  description: '건강 목표를 이루는 게임을 AI로 큐레이션',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
```

**Step 11: next.config.js 외부 이미지 도메인 허용**

`frontend/next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
      { protocol: 'https', hostname: 'is1-ssl.mzstatic.com' },
      { protocol: 'https', hostname: 'example.com' }, // Mock 데이터용
    ],
  },
}

module.exports = nextConfig
```

**Step 12: 빌드 확인**

```bash
cd frontend && npm run build
```

Expected: 오류 없음

**Step 13: 커밋**

```bash
git add -A
git commit -m "feat: 프론트엔드 공통 레이아웃 및 공통 컴포넌트 구현"
```

---

### Task 1-5: 게임 홈 페이지

**우선순위:** 높음
**예상 소요:** 1일

**Files:**
- Modify: `frontend/src/app/page.tsx`
- Create: `frontend/src/app/loading.tsx`
- Create: `frontend/src/components/game/GameGrid.tsx`
- Create: `frontend/src/components/game/PopularSection.tsx`
- Create: `frontend/src/hooks/useGames.ts`
- Create: `frontend/src/hooks/useCategories.ts`

**Step 1: 커스텀 훅 정의**

`frontend/src/hooks/useGames.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { fetchGames } from '@/lib/api/games'

export function useGames(params: {
  category?: string | null
  sort?: string
  page?: number
}) {
  return useQuery({
    queryKey: ['games', { category: params.category, sort: params.sort, page: params.page }],
    queryFn: () => fetchGames({
      category: params.category ?? undefined,
      sort: params.sort,
      page: params.page ?? 1,
      pageSize: 20,
    }),
  })
}
```

`frontend/src/hooks/useCategories.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/lib/api/games'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  })
}
```

**Step 2: GameGrid 컴포넌트**

`frontend/src/components/game/GameGrid.tsx`:
```tsx
import { GameSummaryDto } from '@/lib/types'
import { GameCard } from './GameCard'

interface Props {
  games: GameSummaryDto[]
  emptyMessage?: string
}

export function GameGrid({ games, emptyMessage = '해당 카테고리에 게임이 없습니다.' }: Props) {
  if (games.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map(game => <GameCard key={game.id} game={game} />)}
    </div>
  )
}
```

**Step 3: 인기 게임 섹션**

`frontend/src/components/game/PopularSection.tsx`:
```tsx
import { GameSummaryDto } from '@/lib/types'
import { GameCard } from './GameCard'

interface Props {
  games: GameSummaryDto[]
}

export function PopularSection({ games }: Props) {
  const top5 = games.slice(0, 5)
  if (top5.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">인기 게임</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {top5.map(game => <GameCard key={game.id} game={game} />)}
      </div>
    </section>
  )
}
```

**Step 4: 홈 페이지 구현**

`frontend/src/app/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useGames } from '@/hooks/useGames'
import { useCategories } from '@/hooks/useCategories'
import { CategoryFilter } from '@/components/filter'
import { SortDropdown } from '@/components/filter'
import { GameGrid } from '@/components/game/GameGrid'
import { PopularSection } from '@/components/game/PopularSection'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sort, setSort] = useState('popular')

  const { data: gamesResponse, isLoading: gamesLoading } = useGames({
    category: selectedCategory,
    sort,
    page: 1,
  })
  const { data: categoriesResponse } = useCategories()

  const games = gamesResponse?.data?.items ?? []
  const categories = categoriesResponse?.data ?? []
  const popularGames = [...games].sort((a, b) => b.rating - a.rating)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 인기 게임 섹션 (카테고리 필터 없을 때만 표시) */}
      {!selectedCategory && <PopularSection games={popularGames} />}

      {/* 필터 + 정렬 영역 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* 게임 그리드 */}
      {gamesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  )
}
```

**Step 5: 빌드 및 로컬 실행 확인**

```bash
cd frontend && npm run dev
# http://localhost:3000 접속하여 게임 목록 표시 확인
```

**Step 6: 커밋**

```bash
git add -A
git commit -m "feat: 게임 홈 페이지 구현 (카테고리 필터, 정렬, 인기 게임 섹션)"
```

---

### Task 1-6: 게임 상세 페이지

**우선순위:** 높음
**예상 소요:** 1일

**Files:**
- Create: `frontend/src/app/games/[id]/page.tsx`
- Create: `frontend/src/app/games/[id]/loading.tsx`
- Create: `frontend/src/components/game/HealthTagBadge.tsx`
- Create: `frontend/src/components/game/ConfidenceBar.tsx`
- Create: `frontend/src/components/game/StoreLinkButtons.tsx`
- Create: `frontend/src/components/game/SimilarGames.tsx`
- Create: `frontend/src/hooks/useGame.ts`

**Step 1: useGame 훅**

`frontend/src/hooks/useGame.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { fetchGameById } from '@/lib/api/games'

export function useGame(id: number) {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => fetchGameById(id),
    enabled: id > 0,
  })
}
```

**Step 2: HealthTagBadge + ConfidenceBar 컴포넌트**

`frontend/src/components/game/HealthTagBadge.tsx`:
```tsx
import { HealthTagDto } from '@/lib/types'

const TAG_COLORS: Record<string, string> = {
  '#심폐기능': 'bg-red-100 text-red-700 border-red-200',
  '#근력강화': 'bg-orange-100 text-orange-700 border-orange-200',
  '#스트레스해소': 'bg-green-100 text-green-700 border-green-200',
  '#인지개선': 'bg-blue-100 text-blue-700 border-blue-200',
  '#반응훈련': 'bg-purple-100 text-purple-700 border-purple-200',
  '#밸런스': 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

interface Props {
  tag: HealthTagDto
}

export function HealthTagBadge({ tag }: Props) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${TAG_COLORS[tag.tag] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {tag.tag}
    </span>
  )
}
```

`frontend/src/components/game/ConfidenceBar.tsx`:
```tsx
interface Props {
  confidence: number
  label: string
}

export function ConfidenceBar({ confidence, label }: Props) {
  const percent = Math.round(confidence * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
          aria-label={`신뢰도 ${percent}%`}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-10 text-right">{percent}%</span>
    </div>
  )
}
```

**Step 3: StoreLinkButtons 컴포넌트**

`frontend/src/components/game/StoreLinkButtons.tsx`:
```tsx
interface Props {
  playStoreUrl: string | null
  appStoreUrl: string | null
}

export function StoreLinkButtons({ playStoreUrl, appStoreUrl }: Props) {
  if (!playStoreUrl && !appStoreUrl) return null

  return (
    <div className="flex gap-3">
      {playStoreUrl && (
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l16 8.5-16 8.5c-.5.33-1.5.33-1.5-.5z"/>
          </svg>
          Google Play
        </a>
      )}
      {appStoreUrl && (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          App Store
        </a>
      )}
    </div>
  )
}
```

**Step 4: SimilarGames 컴포넌트 (Mock 기반)**

`frontend/src/components/game/SimilarGames.tsx`:
```tsx
import { GameSummaryDto } from '@/lib/types'
import { GameCard } from './GameCard'

interface Props {
  games: GameSummaryDto[]
}

// Phase 1에서는 같은 카테고리의 게임을 유사 게임으로 표시 (Mock)
export function SimilarGames({ games }: Props) {
  if (games.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">유사 게임 추천</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games.slice(0, 4).map(game => <GameCard key={game.id} game={game} />)}
      </div>
    </section>
  )
}
```

**Step 5: 게임 상세 페이지 구현**

`frontend/src/app/games/[id]/page.tsx`:
```tsx
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGame } from '@/hooks/useGame'
import { useGames } from '@/hooks/useGames'
import { HealthTagBadge } from '@/components/game/HealthTagBadge'
import { ConfidenceBar } from '@/components/game/ConfidenceBar'
import { StoreLinkButtons } from '@/components/game/StoreLinkButtons'
import { SimilarGames } from '@/components/game/SimilarGames'

interface Props {
  params: Promise<{ id: string }>
}

export default function GameDetailPage({ params }: Props) {
  const { id } = use(params)
  const gameId = parseInt(id, 10)
  const router = useRouter()

  const { data: gameResponse, isLoading, isError } = useGame(gameId)
  const game = gameResponse?.data

  // 유사 게임: 같은 카테고리에서 현재 게임 제외 (Phase 1 Mock)
  const { data: similarResponse } = useGames({
    category: game?.category ?? undefined,
    sort: 'rating',
  })
  const similarGames = (similarResponse?.data?.items ?? []).filter(g => g.id !== gameId)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (isError || !game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">게임 정보를 불러올 수 없습니다.</p>
        <button onClick={() => router.back()} className="mt-4 text-primary underline">
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        뒤로가기
      </button>

      {/* 게임 기본 정보 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={game.iconUrl}
              alt={`${game.name} 아이콘`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{game.name}</h1>
            <p className="text-gray-500 mt-1">{game.developer}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-yellow-500">
                ★ <span className="text-gray-700 font-medium">{game.rating.toFixed(1)}</span>
              </span>
              <span className="text-gray-500 text-sm">{game.category}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed">{game.description}</p>

        {/* 스토어 링크 버튼 */}
        <div className="mt-4">
          <StoreLinkButtons playStoreUrl={game.playStoreUrl} appStoreUrl={game.appStoreUrl} />
        </div>
      </div>

      {/* AI 건강 효과 태그 */}
      {game.healthTags.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">AI 건강 효과 분석</h2>

          {/* 태그 배지 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {game.healthTags.map(tag => (
              <HealthTagBadge key={tag.id} tag={tag} />
            ))}
          </div>

          {/* 신뢰도 바 */}
          <div className="space-y-3">
            {game.healthTags.map(tag => (
              <div key={tag.id}>
                <ConfidenceBar confidence={tag.confidence} label={tag.tag} />
                {tag.aiDescription && (
                  <p className="text-xs text-gray-500 mt-1 ml-24">{tag.aiDescription}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 유사 게임 추천 */}
      <SimilarGames games={similarGames} />
    </div>
  )
}
```

**Step 6: 빌드 + 실행 확인**

```bash
cd frontend && npm run build && npm run dev
# http://localhost:3000 → 게임 카드 클릭 → 상세 페이지 이동 확인
```

**Step 7: 커밋**

```bash
git add -A
git commit -m "feat: 게임 상세 페이지 구현 (건강 효과 태그, 신뢰도 바, 스토어 링크, 유사 게임)"
```

---

## 일별 작업 계획 (Day 1~10)

| Day | 날짜 | 주요 작업 | 담당 Task |
|-----|------|-----------|-----------|
| Day 1 | 03-14 (토) | Next.js 프로젝트 생성, TypeScript/Tailwind 설정, TanStack Query 설치 | Task 1-1 (Step 1~4) |
| Day 2 | 03-16 (월) | ASP.NET Core Clean Architecture 솔루션 생성, NuGet 패키지 설치, Docker Compose 설정, Mock JSON 데이터 20개 작성 | Task 1-1 (Step 5~11) |
| Day 3 | 03-17 (화) | Domain 엔티티, DTO, Repository 인터페이스 정의, GameService 구현, 단위 테스트 작성 | Task 1-2 (Step 1~6) |
| Day 4 | 03-18 (수) | EF Core DbContext, GameRepository, DbSeeder 구현, 초기 마이그레이션 생성 | Task 1-2 (Step 7~11) |
| Day 5 | 03-19 (목) | GamesController, CategoriesController, Program.cs (DI/CORS/Serilog) 구현, API 동작 확인 | Task 1-3 |
| Day 6 | 03-20 (금) | 공통 타입/API 클라이언트 정의, TanStack Query Provider 설정, Header/Footer 컴포넌트 | Task 1-4 (Step 1~5) |
| Day 7 | 03-23 (월) | GameCard, CategoryFilter, SortDropdown 컴포넌트, barrel export, 루트 레이아웃, next.config.js | Task 1-4 (Step 6~13) |
| Day 8 | 03-24 (화) | useGames/useCategories 훅, GameGrid, PopularSection, 홈 페이지 구현 | Task 1-5 |
| Day 9 | 03-25 (수) | useGame 훅, HealthTagBadge, ConfidenceBar, StoreLinkButtons, SimilarGames 컴포넌트 | Task 1-6 (Step 1~4) |
| Day 10 | 03-26 (목) | 게임 상세 페이지 완성, 전체 통합 테스트, 반응형 레이아웃 검증, 빌드 오류 수정, 최종 커밋 | Task 1-6 (Step 5~7) + QA |

---

## 완료 기준 (Definition of Done)

- ✅ 게임 홈 페이지에서 카테고리 필터 클릭 시 해당 카테고리 게임만 표시된다
- ✅ 정렬 드롭다운에서 인기순/평점순/최신순 변경이 동작한다
- ✅ 게임 카드 클릭 시 `/games/[id]` 상세 페이지로 이동한다
- ✅ 상세 페이지에서 게임 이름, 설명, 개발사, 평점, 건강 효과 태그, 신뢰도 바, 스토어 링크가 표시된다
- ✅ 상세 페이지 하단에 유사 게임 추천 섹션이 표시된다
- ✅ 뒤로가기 버튼 클릭 시 홈 페이지로 복귀한다
- ✅ 모바일(375px): 1열 레이아웃 + 햄버거 메뉴가 동작한다
- ✅ 태블릿(768px): 2열 레이아웃이 표시된다
- ✅ 데스크톱(1440px): 3~4열 레이아웃이 표시된다
- ✅ `GET /api/games`, `GET /api/games/{id}`, `GET /api/categories` API가 정상 응답을 반환한다
- ✅ `dotnet build` 오류 없음
- ✅ `npm run build` 오류 없음
- ✅ `dotnet test` — GameService 단위 테스트 통과
- ✅ 브라우저 콘솔에 에러/경고 없음

---

## 의존성 및 리스크

### 의존성

```
Task 1-1 (프로젝트 초기 설정)
  ├── Task 1-2 (백엔드 Domain/Application/Infrastructure)
  │     └── Task 1-3 (백엔드 API 컨트롤러)
  └── Task 1-4 (프론트엔드 공통 컴포넌트)
        ├── Task 1-5 (게임 홈 페이지)
        └── Task 1-6 (게임 상세 페이지)
```

### 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Mock JSON 이미지 URL 접근 불가 | 이미지 깨짐 | next.config.js에 도메인 추가, 대체 이미지(placeholder) 적용 |
| EF Core SQLite 마이그레이션 오류 | 백엔드 시동 실패 | `dotnet ef database drop --force` 후 재마이그레이션 |
| TanStack Query queryKey 설계 오류 | 캐시 무효화 미동작 | `['games', { category, sort, page }]` 패턴 일관 적용 |
| CORS 설정 누락으로 API 호출 실패 | 프론트엔드 API 연동 불가 | Program.cs CORS 정책에 `http://localhost:3000` 명시 확인 |

---

## 예상 산출물

- `frontend/` — Next.js 14 앱 (홈 페이지 + 상세 페이지 + 공통 컴포넌트)
- `backend/` — ASP.NET Core 8 Clean Architecture API (3개 엔드포인트)
- `docker-compose.yml` — 로컬 개발 환경 컨테이너 구성
- `backend/src/HealthGameCurator.Infrastructure/Data/SeedData/games.json` — Mock 게임 데이터 20개 이상
- `backend/tests/` — GameService 단위 테스트 (xUnit)
- 초기 EF Core 마이그레이션 파일

---

## Playwright MCP 검증 시나리오 (Sprint Close 시점)

스프린트 종료 시 `sprint-close` 에이전트가 아래 시나리오를 순서대로 실행하여 `docs/sprint/sprint1/playwright-report.md`에 결과를 저장합니다.

**사전 조건:** `npm run dev` (포트 3000) + 백엔드 `dotnet run` (포트 5000) 실행 중

**게임 홈 페이지 검증:**
1. `browser_navigate` → `http://localhost:3000`
2. `browser_snapshot` → 게임 카드 그리드 렌더링 확인
3. `browser_click` → 카테고리 필터 "반응훈련" 클릭
4. `browser_snapshot` → 필터된 게임 목록 표시 확인
5. `browser_select_option` → 정렬 드롭다운 "평점순" 선택
6. `browser_snapshot` → 정렬 변경 확인
7. `browser_console_messages(level: "error")` → 에러 없음 확인

**게임 상세 페이지 검증:**
1. `browser_navigate` → `http://localhost:3000`
2. `browser_click` → 첫 번째 게임 카드 클릭
3. `browser_wait_for` → 상세 페이지 로딩 대기
4. `browser_snapshot` → 게임명, 설명, 평점, 건강 효과 태그, 스토어 링크 확인
5. `browser_snapshot` → 유사 게임 추천 섹션 확인
6. `browser_click` → 뒤로가기 버튼 클릭
7. `browser_snapshot` → 홈 페이지 복귀 확인

**반응형 레이아웃 검증:**
1. `browser_resize(width: 375, height: 812)` → 모바일 뷰포트
2. `browser_snapshot` → 1열 레이아웃 + 햄버거 메뉴 확인
3. `browser_resize(width: 768, height: 1024)` → 태블릿 뷰포트
4. `browser_snapshot` → 2열 레이아웃 확인
5. `browser_resize(width: 1440, height: 900)` → 데스크톱 뷰포트
6. `browser_snapshot` → 3~4열 레이아웃 확인

**API 연동 검증:**
- `browser_network_requests` → `/api/games`, `/api/categories` 모두 200 응답 확인
- `browser_console_messages(level: "error")` → 콘솔 에러 없음 확인
