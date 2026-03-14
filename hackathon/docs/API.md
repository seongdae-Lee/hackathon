# API 명세 - 헬스케어 게이미피케이션 큐레이터

> **버전:** Sprint 3 (2026-03-15)
> **Base URL:** `http://localhost:5000/api`
> **Swagger UI:** `http://localhost:5000/swagger`

---

## 공통 응답 형식

모든 API 응답은 `ApiResponse<T>` 래퍼로 감싸져 반환됩니다.

### 성공 응답

```json
{
  "success": true,
  "data": { ... }
}
```

### 실패 응답

```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

---

## 엔드포인트

### `GET /api/games` - 게임 목록 조회

카테고리 필터, 정렬, 페이지네이션을 지원하는 게임 목록 반환.

#### 쿼리 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `category` | string | - | 카테고리 필터 (예: `달리기`, `명상/스트레스 해소`) |
| `sort` | string | `popular` | 정렬 기준: `popular` (인기순), `rating` (평점순), `latest` (최신순) |
| `page` | int | `1` | 페이지 번호 (1 이상) |
| `pageSize` | int | `20` | 페이지당 항목 수 (1~100, 기본 20) |

#### 응답 예시

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Zombies, Run!",
        "description": "좀비를 피해 달리는 러닝 게임",
        "developer": "Six to Start",
        "iconUrl": "https://example.com/icon.png",
        "rating": 4.5,
        "downloadCount": 5000000,
        "category": "달리기",
        "playStoreUrl": "https://play.google.com/...",
        "appStoreUrl": "https://apps.apple.com/...",
        "createdAt": "2026-03-01T00:00:00Z",
        "healthTags": [
          {
            "id": 1,
            "tag": "#심폐기능",
            "confidence": 0.95,
            "aiDescription": "달리기를 통해 심폐 기능을 향상시킵니다.",
            "isAiAnalyzed": true
          }
        ]
      }
    ],
    "total": 21,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### `GET /api/games/{id}` - 게임 상세 조회

특정 게임의 상세 정보 반환.

#### 경로 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | int | 게임 ID |

#### 응답 예시 (성공)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Zombies, Run!",
    "description": "좀비를 피해 달리는 러닝 게임",
    "developer": "Six to Start",
    "iconUrl": "https://example.com/icon.png",
    "rating": 4.5,
    "downloadCount": 5000000,
    "category": "달리기",
    "playStoreUrl": "https://play.google.com/...",
    "appStoreUrl": "https://apps.apple.com/...",
    "createdAt": "2026-03-01T00:00:00Z",
    "healthTags": [...]
  }
}
```

#### 응답 예시 (404 Not Found)

```json
{
  "success": false,
  "error": "게임을 찾을 수 없습니다.",
  "code": "GAME_NOT_FOUND"
}
```

---

### `GET /api/games/{id}/similar` - 유사 게임 추천

특정 게임과 유사한 게임 목록 반환 (같은 카테고리 기반).

#### 경로 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `id` | int | 기준 게임 ID |

#### 응답 예시 (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Nike Run Club",
      ...
    }
  ]
}
```

#### 응답 예시 (404 Not Found)

```json
{
  "success": false,
  "error": "게임을 찾을 수 없습니다.",
  "code": "GAME_NOT_FOUND"
}
```

---

---

## Admin 엔드포인트

### `POST /api/admin/analyze/{gameId}` - 단일 게임 AI 분석

특정 게임에 대해 Claude AI 건강 효과 분석을 트리거합니다.
이미 분석된 게임(`isAiAnalyzed=true`)은 재분석을 Skip합니다.

#### 경로 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `gameId` | int | 분석할 게임 ID |

#### 응답 예시 (성공)

```json
{
  "success": true,
  "data": {
    "gameId": 1,
    "gameName": "Zombies, Run!",
    "isAnalyzed": true,
    "tagsUpdated": 2,
    "message": null
  }
}
```

---

### `POST /api/admin/analyze/all` - 전체 미분석 게임 일괄 AI 분석

아직 AI 분석되지 않은 모든 게임에 대해 일괄 분석을 수행합니다.

#### 응답 예시

```json
{
  "success": true,
  "data": [
    { "gameId": 1, "gameName": "게임A", "isAnalyzed": true, "tagsUpdated": 2 },
    { "gameId": 2, "gameName": "게임B", "isAnalyzed": true, "tagsUpdated": 1 }
  ]
}
```

---

### `POST /api/admin/collect` - 게임 데이터 수집

외부 소스에서 게임 데이터를 수집하여 DB에 저장합니다.
RapidAPI 연동 실패 시 Mock 데이터로 자동 Fallback합니다.

#### 쿼리 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `maxCount` | int | `10` | 최대 수집 게임 수 (1~100) |

#### 응답 예시

```json
{
  "success": true,
  "data": {
    "isSuccess": true,
    "collectedCount": 10,
    "savedCount": 8,
    "skippedCount": 2,
    "errorMessage": null
  }
}
```

---

### `GET /api/categories` - 카테고리 목록 조회

게임에 사용된 카테고리 목록 반환.

#### 응답 예시

```json
{
  "success": true,
  "data": [
    "달리기",
    "명상/스트레스 해소",
    "팔 운동",
    "반응훈련",
    "밸런스",
    "피트니스"
  ]
}
```

---

### `GET /api/games/search` - 게임 키워드 검색

게임명, 카테고리, 건강 효과 태그에서 키워드 검색.
2글자 미만 키워드는 빈 배열 반환.

#### 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `q` | string | 검색 키워드 (2글자 이상) |

#### 응답 예시

```json
{
  "success": true,
  "data": [
    {
      "game": { ...GameDto },
      "matchedFields": ["name", "category"],
      "matchedKeyword": "달리기"
    }
  ]
}
```

---

### `POST /api/recommend` - 건강 목표 기반 맞춤 추천

선택한 건강 목표에 맞는 게임을 추천하고, Claude AI 추천 이유 텍스트를 생성합니다.

#### 요청 Body

```json
{
  "healthGoals": ["심폐기능", "스트레스해소"]
}
```

유효한 목표값: `심폐기능`, `근력강화`, `스트레스해소`, `인지개선`, `반응훈련`

#### 응답 예시

```json
{
  "success": true,
  "data": {
    "selectedGoals": ["심폐기능", "스트레스해소"],
    "games": [
      {
        "game": { ...GameDto },
        "matchScore": 0.85,
        "recommendReason": "이 게임은 달리기 동작으로 심폐 기능을 강화하며..."
      }
    ]
  }
}
```

---

## 데이터 모델

### `GameDto`

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | int | 게임 고유 ID |
| `name` | string | 게임명 |
| `description` | string | 게임 설명 |
| `developer` | string | 개발사 |
| `iconUrl` | string | 아이콘 이미지 URL |
| `rating` | double | 평점 (0.0 ~ 5.0) |
| `downloadCount` | long | 다운로드 수 |
| `category` | string | 카테고리 |
| `playStoreUrl` | string? | Google Play 스토어 링크 (없을 수 있음) |
| `appStoreUrl` | string? | App Store 링크 (없을 수 있음) |
| `createdAt` | DateTime | 등록일시 (UTC) |
| `healthTags` | HealthTagDto[] | 건강 효과 태그 목록 |

### `HealthTagDto`

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | int | 태그 고유 ID |
| `tag` | string | 건강 효과 태그명 (예: `#심폐기능`) |
| `confidence` | double | AI 신뢰도 (0.0 ~ 1.0) |
| `aiDescription` | string | AI 분석 근거 설명 |
| `isAiAnalyzed` | bool | AI 분석 완료 여부 |

### `PagedResult<T>`

| 필드 | 타입 | 설명 |
|------|------|------|
| `items` | T[] | 현재 페이지 항목 목록 |
| `total` | int | 전체 항목 수 |
| `page` | int | 현재 페이지 번호 |
| `pageSize` | int | 페이지당 항목 수 |
