# 프로젝트 개요

Quartz 4 기반 개인 블로그. 콘텐츠는 `content/` 디렉토리에 마크다운으로 작성.

## 개발 서버

```bash
npx quartz build --serve --port 8081
```

포트 8080은 nginx와 충돌하므로 반드시 8081 사용.

## 콘텐츠 구조

- `content/👨🏻‍💻 개발자 이야기/2024/`, `2025/`, `2026/` — 년도별로 폴더 분리
- `content/🐶 개이득 산행/` — 반려견 동반 산행 후기
- 이미지는 `quartz/static/images/<카테고리>/` 하위 폴더로 분리 저장 (예: `개발자-이야기/`, `개이득-산행/`, `구글-블로거/`)
- 마크다운에서는 `![[파일명]]` 위키링크로 참조 (Quartz가 파일명으로 자동 해석하므로 경로 불필요)

## 포스트 front matter 형식

```yaml
---
title: 제목
date: 2026-05-04
tags: [notes, ai]
description: 한 줄 설명
---
```

## 참고

커스텀 수정 사항은 [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md) 참고.
