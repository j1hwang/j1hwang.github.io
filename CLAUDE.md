# 프로젝트 개요

Quartz 4 기반 개인 블로그. 콘텐츠는 `content/` 디렉토리에 마크다운으로 작성.

## 개발 서버

```bash
npx quartz build --serve --port 8081
```

포트 8080은 nginx와 충돌하므로 반드시 8081 사용.

## 콘텐츠 구조

카테고리 폴더 목록 (폴더명은 이모지 없음):

- `content/개발자 이야기/2024/`, `2025/`, `2026/` — 개발 관련 글, 년도별 폴더 분리
- `content/개이득 산행/` — 반려견 동반 산행 후기
- `content/디지털노마드/` — 워케이션/해외 원격근무 후기
- `content/아이디어/` — 단상, 생각 정리
- `content/자작캠핑카/` — 캠핑카 제작 과정 기록
- `content/뒤늦은 퇴사일기/` — 퇴사 후 기록

이미지는 `quartz/static/images/<카테고리>/` 하위 폴더로 분리 저장 (예: `개발자-이야기/`, `개이득-산행/`, `구글-블로거/`)

마크다운에서는 `![[파일명]]` 위키링크로 참조 (Quartz가 파일명으로 자동 해석하므로 경로 불필요)

### 이미지 2열 + 캡션 템플릿

이미지를 한 줄에 2개 배치하고 캡션을 붙일 때는 아래 HTML 패턴 사용:

```html
<span style="display:inline-block; width:49%; vertical-align:middle; text-align:center;">
  <img src="/static/images/뒤늦은-퇴사일기/20150114_191430_Original.jpg" alt="신입사원 연수 사진" style="width:100%; margin:0;" />
  <em>신입사원 연수 사진</em>
</span>
<span style="display:inline-block; width:49%; vertical-align:middle; text-align:center;">
  <img src="/static/images/뒤늦은-퇴사일기/IMG_1870_Original.jpg" alt="별의별 문의 중 하나" style="width:100%; margin:0;" />
  <em>별의별 문의 중 하나</em>
</span>
```

- 기본 스타일은 `width:49%` (2열) + `img width:100%`
- 높이가 다른 이미지는 `vertical-align:middle`로 중심 정렬
- 캡션은 `<em>...</em>` 사용
- `![[파일명]]`가 아닌 `<img src="/static/images/...">` 절대 경로 사용

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
