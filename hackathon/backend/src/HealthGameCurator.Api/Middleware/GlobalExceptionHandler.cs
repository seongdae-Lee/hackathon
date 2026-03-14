using HealthGameCurator.Application.DTOs;
using Microsoft.AspNetCore.Diagnostics;

namespace HealthGameCurator.Api.Middleware;

/// <summary>
/// 글로벌 예외 처리 미들웨어 - 모든 미처리 예외를 통합 API 응답 형식으로 반환
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "처리되지 않은 예외가 발생했습니다: {Message}", exception.Message);

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/json";

        var response = ApiResponse<object>.Fail("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", "INTERNAL_SERVER_ERROR");
        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}
