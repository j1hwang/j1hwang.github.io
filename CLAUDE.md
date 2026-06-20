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
- `content/레아아범 육견일기/` — 반려견 레아 일상 기록
- `content/개이득 산행/` — 반려견 동반 산행 후기
- `content/디지털노마드/` — 워케이션/해외 원격근무 후기
- `content/아이디어/` — 단상, 생각 정리
- `content/자작캠핑카/` — 캠핑카 제작 과정 기록
- `content/뒤늦은 퇴사일기/` — 퇴사 후 기록
- `content/여행기억 리터칭/` — 지난 여행 기억 기록
- `content/좋아하는 글들/` — 읽고 두고두고 생각나는 글 모음

이미지는 `quartz/static/images/<카테고리>/` 하위에 저장. 폴더명은 공백 그대로 사용 (하이픈 불필요). 카테고리마다 구조가 다름 (아래 표 참고)

이미지 파일명 규칙은 카테고리마다 다름:

| 카테고리 | 구조 | 파일명 규칙 | 예시 |
|---|---|---|---|
| 개발자 이야기 | 카테고리 루트에 평탄하게 | `YYYYMMDD_설명.확장자` | `20241022_captcha_example_1.png` |
| 레아아범 육견일기 | 카테고리 루트에 평탄하게 | `YYYYMMDD_설명.jpg` (frontmatter date 기준) | `20260605_leah_first_meet.jpg` |
| 뒤늦은 퇴사일기 | 카테고리 루트에 평탄하게 | `YYYYMMDD_포스트제목_번호.jpg` | `20180921_왜 남미였나_1.jpg` |
| 아이디어 | 카테고리 루트에 평탄하게 | `YYYYMMDD_포스트제목_번호.확장자` | `20260524_인생은 선택의 연속_1.PNG` |
| 여행기억 리터칭 | 카테고리 루트에 평탄하게 | `YYYYMMDD_포스트제목_번호.확장자` | `20130624_베네치아에서 찍은 사진들_1.jpg` |
| 개이득 산행 | 카테고리 루트에 평탄하게 | `YYYYMMDD_산이름_번호.jpg` | `20240519_검단산_1.jpg` |
| 디지털노마드 | 카테고리 루트에 평탄하게 | `YYYYMMDD_IMG_XXXX.확장자` (날짜 prefix + 원본 파일명) | `20190529_IMG_1211.jpeg` |
| 자작캠핑카 | 포스트별 서브폴더 | 아이폰 원본 파일명 그대로 | `방청, 방수, 방진 작업/IMG_5832.jpg` |

Explorer 이모지 매핑은 `quartz.layout.ts`의 `emojiMap` 객체에서 관리 (좌/우 레이아웃 두 곳 모두 동일하게 추가 필요)

Explorer 카테고리 순서 및 archived 구분선은 `quartz.layout.ts`의 `sortFn` 내 두 배열로 관리:
- `FOLDER_ORDER` — 상단 카테고리 표시 순서 (현재: 아이디어 → 개발자 이야기 → 여행기억 리터칭 → 자작캠핑카 → 개이득 산행 → 레아아범 육견일기 → 좋아하는 글들)
- `ARCHIVED` — 구분선 아래 archived 카테고리 순서 (현재: 디지털노마드 → 뒤늦은 퇴사일기)
- slug 형식 사용 (공백 → 하이픈): 예: `개발자-이야기`, `뒤늦은-퇴사일기`
- `explorer.inline.ts`의 `ARCHIVED_FOLDERS` 배열도 동일하게 유지 필요 (CSS 클래스 부여용)

카테고리 추가/수정/삭제 요청이 오면 아래 항목을 빠짐없이 함께 수정할 것:
1. `quartz.layout.ts` — `emojiMap`, `FOLDER_ORDER`, `ARCHIVED` (좌/우 레이아웃 두 곳), `RecentNotes` `categoryMap` (좌/우 두 곳)
2. `quartz/components/scripts/explorer.inline.ts` — `ARCHIVED_FOLDERS`
3. `quartz/components/Archive.tsx` — `categoryMap`
4. `CLAUDE.md` — 카테고리 폴더 목록, 이미지 파일명 규칙 표, `FOLDER_ORDER` 현재 순서 주석

마크다운에서는 `![[파일명]]` 위키링크로 참조. Quartz가 `quartz/static/` 하위 전체를 파일명으로 검색하므로 서브폴더에 있어도 경로 불필요. `![[서브폴더/파일명]]` 형식은 동작하지 않음.

### 카테고리 index.md

각 카테고리 폴더 최상위에 `index.md`를 두어 카테고리 소개 페이지로 사용. `> [!info]` callout으로 카테고리 설명을 작성:

```markdown
> [!info]
> **카테고리에 대한 한 줄 설명**
```

### 이미지 단일 + 캡션

```markdown
![[파일명.jpg]]
_캡션 텍스트_
```

- 캡션은 이미지 바로 아래 `*이탤릭*` 마크다운 사용 (HTML 태그 금지)

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

### Quartz slug 변환 규칙

Quartz의 `sluggify`는 폴더명·파일명의 **공백을 하이픈으로 변환**한다.
예: `개발자 이야기` → `개발자-이야기`
`categoryMap` 등 slug 기반 키 매핑 시 반드시 하이픈 형식 사용.

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
