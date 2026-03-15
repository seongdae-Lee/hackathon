---
name: no_remote_repo
description: 이 프로젝트는 원격 저장소(origin)가 설정되어 있지 않아 git push 및 PR 생성 불가
type: project
---

`git remote -v` 결과가 비어 있습니다. GitHub 원격 저장소가 설정되지 않았습니다.

**Why:** 로컬 전용 개발 환경 또는 GitHub 저장소 미생성 상태

**How to apply:** PR 생성이 필요한 경우 사용자에게 먼저 `git remote add origin <url>` 설정을 요청해야 합니다. `gh pr create` 명령은 원격 저장소 없이는 실행 불가합니다.
