using FluentValidation;
using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Validators;

/// <summary>
/// 게임 수정 요청 검증기
/// </summary>
public class UpdateGameRequestValidator : AbstractValidator<UpdateGameRequest>
{
    private static readonly string[] AllowedCategories =
    [
        "달리기", "명상/스트레스 해소", "팔 운동", "반응훈련", "밸런스", "피트니스",
        "근력강화", "댄스", "스트레칭", "호흡", "자전거", "수영", "격투기", "기타"
    ];

    public UpdateGameRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("게임명은 필수입니다.")
            .MaximumLength(200).WithMessage("게임명은 200자 이하여야 합니다.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("게임 설명은 필수입니다.")
            .MaximumLength(2000).WithMessage("게임 설명은 2000자 이하여야 합니다.");

        RuleFor(x => x.Developer)
            .NotEmpty().WithMessage("개발사는 필수입니다.")
            .MaximumLength(200).WithMessage("개발사명은 200자 이하여야 합니다.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("카테고리는 필수입니다.")
            .Must(c => AllowedCategories.Contains(c))
            .WithMessage($"유효하지 않은 카테고리입니다. 허용 카테고리: {string.Join(", ", AllowedCategories)}");

        RuleFor(x => x.Rating)
            .InclusiveBetween(0.0, 5.0).WithMessage("평점은 0.0에서 5.0 사이여야 합니다.");

        RuleFor(x => x.DownloadCount)
            .GreaterThanOrEqualTo(0).WithMessage("다운로드 수는 0 이상이어야 합니다.");

        RuleFor(x => x.IconUrl)
            .NotEmpty().WithMessage("아이콘 URL은 필수입니다.")
            .MaximumLength(500).WithMessage("아이콘 URL은 500자 이하여야 합니다.");

        RuleFor(x => x.PlayStoreUrl)
            .Must(url => url == null || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("유효하지 않은 Play Store URL 형식입니다.")
            .When(x => x.PlayStoreUrl != null);

        RuleFor(x => x.AppStoreUrl)
            .Must(url => url == null || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("유효하지 않은 App Store URL 형식입니다.")
            .When(x => x.AppStoreUrl != null);
    }
}
