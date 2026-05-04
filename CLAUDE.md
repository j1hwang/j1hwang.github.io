# 프로젝트 개요

Quartz 4 기반 개인 블로그. 콘텐츠는 `content/` 디렉토리에 마크다운으로 작성.

## 개발 서버

```bash
npx quartz build --serve
```

## 콘텐츠 구조

- `content/개발자 이야기/2024/`, `2025/`, `2026/` — 년도별로 폴더 분리
- 이미지는 `quartz/static/images/`에 저장, 마크다운에서 `/static/images/파일명`으로 참조

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
