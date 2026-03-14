using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

/// <summary>
/// 건강 목표 기반 맞춤 추천 컨트롤러
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RecommendController : ControllerBase
{
    private readonly IHealthGoalRecommendService _recommendService;

    public RecommendController(IHealthGoalRecommendService recommendService)
    {
        _recommendService = recommendService;
    }

    /// <summary>
    /// 건강 목표 선택 후 맞춤 게임 추천
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<RecommendResponse>>> Recommend(
        [FromBody] RecommendRequest request)
    {
        if (request.HealthGoals is null || request.HealthGoals.Count == 0)
            return BadRequest(ApiResponse<RecommendResponse>.Fail(
                "건강 목표를 하나 이상 선택해주세요.", "INVALID_GOALS"));

        var result = await _recommendService.RecommendGamesAsync(request);
        return Ok(ApiResponse<RecommendResponse>.Ok(result));
    }
}
