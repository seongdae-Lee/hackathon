using FluentValidation;
using HealthGameCurator.Api.Middleware;
using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Application.Validators;
using HealthGameCurator.Infrastructure.Data;
using HealthGameCurator.Infrastructure.Repositories;
using HealthGameCurator.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Serilog;

// Serilog 설정 - 구조화된 로깅
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Serilog 적용
    builder.Host.UseSerilog();

    // 컨트롤러
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // 글로벌 예외 처리
    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    // EF Core SQLite (개발 환경) - 환경변수로 PostgreSQL 전환 가능
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=healthgamecurator.db";
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString));

    // Claude API - HttpClient 등록
    builder.Services.AddHttpClient<IClaudeApiService, ClaudeApiService>();

    // 의존성 주입 등록
    builder.Services.AddScoped<IGameRepository, GameRepository>();
    builder.Services.AddScoped<IGameService, GameService>();
    builder.Services.AddScoped<IGameRecommendationService, GameRecommendationService>();
    builder.Services.AddScoped<IGameDataCollectorService, GameDataCollectorService>();
    builder.Services.AddScoped<IGameSearchService, GameSearchService>();
    builder.Services.AddScoped<IHealthGoalRecommendService, HealthGoalRecommendService>();
    builder.Services.AddScoped<IAdminService, AdminService>();

    // FluentValidation 검증기 등록
    builder.Services.AddScoped<IValidator<CreateGameRequest>, CreateGameRequestValidator>();
    builder.Services.AddScoped<IValidator<UpdateGameRequest>, UpdateGameRequestValidator>();

    // CORS - 프론트엔드 도메인 명시적 허용 (와일드카드 금지)
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:3001"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    var app = builder.Build();

    // DB 마이그레이션 및 시딩 (개발 환경)
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
        await DatabaseSeeder.SeedAsync(context);
    }

    app.UseExceptionHandler();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors("AllowFrontend");
    app.UseAuthorization();
    app.MapControllers();

    Log.Information("헬스케어 게이미피케이션 큐레이터 API 시작");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "애플리케이션 시작 실패");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
