namespace HealthGameCurator.Application.DTOs;

/// <summary>
/// 통합 API 응답 형식 - CLAUDE.md 코딩 표준 준수
/// </summary>
public record ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string? Error { get; init; }
    public string? Code { get; init; }

    public static ApiResponse<T> Ok(T data) => new() { Success = true, Data = data };
    public static ApiResponse<T> Fail(string error, string code = "ERROR") => new() { Success = false, Error = error, Code = code };
}
