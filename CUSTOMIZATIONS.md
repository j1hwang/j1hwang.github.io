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

## Explorer 이모지 표시 (`quartz.layout.ts`)

폴더명 자체에는 이모지가 없고, `mapFn`으로 Explorer 표시 시에만 이모지를 붙임:

```ts
Component.Explorer({
  mapFn: (node) => {
    const emojiMap: Record<string, string> = {
      "개이득 산행": "🐶 개이득 산행",
      "아이디어": "🌿 아이디어",
      // ...
    }
    if (node.isFolder && emojiMap[node.displayName]) {
      node.displayName = emojiMap[node.displayName]
    }
  },
})
```

## Explorer 기본 펼침 폴더 (`quartz.layout.ts`)

`defaultOpenFolders` 옵션으로 특정 폴더만 기본으로 펼쳐둠:

```ts
Component.Explorer({
  defaultOpenFolders: ["개발자 이야기/2026"],
  ...
})
```

Quartz 기본 제공이 아니라 직접 추가한 기능:
- `quartz/components/Explorer.tsx` — `Options` 인터페이스에 `defaultOpenFolders: string[]` 추가, `data-defaultopen` 속성으로 전달
- `quartz/components/scripts/explorer.inline.ts` — `ParsedOptions`에 필드 추가, 초기 상태 계산 시 해당 경로는 `collapsed: false`로 처리 (`path.endsWith(f)` 매칭)

## 각주 되돌아가기 기호 숨김 (`quartz/styles/base.scss`)

각주 렌더링 시 자동으로 붙는 ↩ 기호(`a[data-footnote-backref]`)를 숨김:

```scss
.footnotes {
  a[data-footnote-backref] {
    display: none;
  }
}
```

## PopularNotes 컴포넌트 (비활성)

백링크 수 기준으로 인기 글 상위 N개를 표시하는 커스텀 컴포넌트.
파일: `quartz/components/PopularNotes.tsx`
등록: `quartz/components/index.ts`에 이미 export됨

사용 시 `quartz.layout.ts`의 `right` 배열에 아래 추가:

```ts
Component.DesktopOnly(Component.PopularNotes({
  limit: 3,
  filter: (f) => !f.slug?.endsWith("/index") && f.slug !== "index",
  categoryMap: {
    "개이득-산행": "🐶 개이득 산행",
    "아이디어": "🌿 아이디어",
    "자작캠핑카": "🚐 자작캠핑카",
    "디지털노마드": "🧳 디지털노마드",
    "뒤늦은-퇴사일기": "✍🏻 뒤늦은 퇴사일기",
    "개발자-이야기": "👨🏻‍💻 개발자 이야기",
    "여행기억-리터칭": "✈️ 여행기억 리터칭",
    "좋아하는-글들": "🔖 좋아하는 글들",
  },
})),
```

동작 방식: 모든 파일의 `links` 배열을 순회해 피링크 수를 집계 → 내림차순 정렬 → 상위 N개 표시.
`title` 옵션으로 헤더 텍스트 변경 가능 (기본값: "Popular Notes").

## Jekyll 마이그레이션 변환 규칙

소스: `~/jekyll-archive/_posts/`

- `date`: 시간/타임존 제거, `YYYY-MM-DD`만 유지
- `tags`: Jekyll의 `categories`와 `tags`를 하나로 병합
- 이미지 경로: `/assets/img/` → `/static/images/`
- 파일명: 날짜 prefix(`YYYY-MM-DD-`) 제거

## 이미지 최적화

원본(iPhone 등)을 그대로 올리면 한 장당 2~3MB. 본문 너비가 ~750px이라
가로 1280px까지만 있어도 Retina 환경에서 충분하다.

폴더 단위 일괄 다운스케일 + 압축 (ImageMagick 필요). zsh는 글로브가
case-sensitive라 `find -iname`으로 처리:

```bash
find quartz/static/images/<카테고리> -maxdepth 1 -type f \
  \( -iname "*.jpg" -o -iname "*.jpeg" \) \
  -exec magick mogrify -auto-orient -resize '1280x1280>' -quality 80 -strip {} +
```

- `-resize '1280x1280>'`: 긴 변이 1280px 초과인 이미지만 축소 (작은 건 건드리지 않음)
- `-quality 80`: JPEG 품질 80 (시각적 차이 거의 없음, 80%+ 절감)
- `-strip`: EXIF 메타데이터 제거 (추가 절감)
- `-auto-orient`: EXIF 회전 정보를 픽셀에 반영 후 제거 (회전 깨짐 방지)

PNG(스크린샷 등)는 화질 손상 위험으로 위 명령에서 제외. 큰 PNG는 `pngquant`나
JPG 변환을 별도 검토. HEIC는 브라우저 미지원이라 JPG로 변환 후 마크다운 참조도 같이 수정 필요.
