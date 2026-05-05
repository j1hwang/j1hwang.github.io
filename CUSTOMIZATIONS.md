# 커스텀 수정 사항

## Explorer 정렬 (`quartz.layout.ts`)

폴더 우선, 그 다음 날짜 내림차순 정렬:

```ts
sortFn: (a, b) => {
  if (a.isFolder && !b.isFolder) return -1
  if (!a.isFolder && b.isFolder) return 1
  const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
  const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
  if (aDate !== bDate) return bDate - aDate
  return a.displayName.localeCompare(b.displayName, ...)
}
```

## Explorer 기본 펼침 폴더 (`quartz.layout.ts`)

`defaultOpenFolders` 옵션으로 특정 폴더만 기본으로 펼쳐둠:

```ts
Component.Explorer({
  defaultOpenFolders: ["👨🏻‍💻 개발자 이야기/2026"],
  ...
})
```

Quartz 기본 제공이 아니라 직접 추가한 기능:
- `quartz/components/Explorer.tsx` — `Options` 인터페이스에 `defaultOpenFolders: string[]` 추가, `data-defaultopen` 속성으로 전달
- `quartz/components/scripts/explorer.inline.ts` — `ParsedOptions`에 필드 추가, 초기 상태 계산 시 해당 경로는 `collapsed: false`로 처리 (`path.endsWith(f)` 매칭)

## Jekyll 마이그레이션 변환 규칙

소스: `~/jekyll-archive/_posts/`

- `date`: 시간/타임존 제거, `YYYY-MM-DD`만 유지
- `tags`: Jekyll의 `categories`와 `tags`를 하나로 병합
- 이미지 경로: `/assets/img/` → `/static/images/`
- 파일명: 날짜 prefix(`YYYY-MM-DD-`) 제거
