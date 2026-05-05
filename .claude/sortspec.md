# Custom File Explorer Sorting - sortspec 문법 정리

플러그인: SebastianMC/obsidian-custom-sort v3.1.6

## 기본 구조

```yaml
---
sorting-spec: |
  target-folder: 폴더경로
  /folders
   > a-z
  /:files
   > a-z by-metadata: date
---
```

sortspec 노트는 볼트 어디에나 둘 수 있다. 플러그인이 볼트 전체에서 `sorting-spec` frontmatter를 스캔한다.

## target-folder 경로

| 패턴 | 적용 범위 |
|---|---|
| `target-folder: path` | path 폴더 자체 |
| `target-folder: path/*` | path의 모든 하위 폴더(재귀) |
| `target-folder: path/...` | path의 직속 하위 폴더만 |
| `target-folder: .` | sortspec.md가 위치한 폴더 |
| `target-folder: ./*` | sortspec.md 기준 모든 하위 폴더 |

`/**` 는 유효하지 않다.

한글 폴더명을 target-folder 경로에 직접 쓰면 macOS NFD/NFC 인코딩 불일치로 매칭이 실패할 수 있다.
이 경우 sortspec.md를 해당 폴더 안에 두고 `.` 상대경로를 사용하면 우회된다.

## 그룹 접두사 (파일/폴더 구분)

| 접두사 | 의미 |
|---|---|
| `/folders` | 폴더만 |
| `/:files` 또는 `/:` | 파일만 |
| `/folders:files` | 전체 |

`[ folders ]` / `[ files ]` 브래킷 문법은 유효하지 않다.

## 정렬 방향

| 기호 | 의미 |
|---|---|
| `<` | 오름차순 (asc) |
| `>` | 내림차순 (desc) |

`order-asc:` / `order-desc:` 형태도 동일하게 동작한다.

## 정렬 기준 키워드

| 키워드 | 설명 |
|---|---|
| `a-z` | 파일명 알파벳순 |
| `created` | 파일시스템 생성일 |
| `modified` | 파일시스템 수정일 |
| `a-z by-metadata: 필드명` | frontmatter 메타데이터 값으로 정렬 |

**주의**: `by-metadata: 필드명`은 단독으로 쓸 수 없다. 반드시 `a-z by-metadata: 필드명` 형태로 `a-z` 또는 `true a-z`를 앞에 붙여야 한다. 그렇지 않으면 플러그인이 "Sorting by metadata requires one of alphabetical orders" 에러를 낸다.

파일시스템 날짜(created/modified)는 iCloud 복사 시 현재 날짜로 초기화되므로 신뢰할 수 없다.
frontmatter에 `date` 필드가 있으면 `a-z by-metadata: date` 사용 권장.

## frontmatter date 필드 처리

`date: 2024-09-02` 형태로 쓰면 된다. Obsidian 메타데이터 캐시가 적절히 처리하므로 따옴표 불필요.

## 그룹-정렬 연결 방식 (들여쓰기 방식만 사용)

그룹 접두사 다음 줄에 정렬 지시자를 들여쓰기(스페이스 1칸 이상)로 작성한다:

```
/folders
 > a-z

/:files
 > a-z by-metadata: date
```

인라인 방식(`/folders > a-z`)은 문서에 나오지만 동작이 불안정할 수 있으므로 들여쓰기 방식을 권장한다.

## 적용 방법

1. sortspec.md 파일 생성 (위치 무관)
2. Obsidian 리본 아이콘(Custom Sort) 토글 ON
3. 설정에서 "Automatically apply sorting on Obsidian startup" 켜두면 자동 적용
4. 메타데이터 변경 후에는 리본 아이콘을 다시 클릭해야 반영됨 (자동 갱신 안 됨)

## 현재 볼트 설정

- sortspec 위치: `j1hwang.github.io/👨🏻‍💻 개발자 이야기/sortspec.md`
- 적용 범위: `👨🏻‍💻 개발자 이야기` 폴더 및 하위 폴더 전체
- 폴더: 이름 내림차순 (`> a-z`) - 2026 > 2025 > 2024 순서
- 파일: frontmatter `date` 내림차순 (`> a-z by-metadata: date`)

```yaml
---
sorting-spec: |
  target-folder: .
  > a-z

  target-folder: ./*
  /:files
   > a-z by-metadata: date
---
```
