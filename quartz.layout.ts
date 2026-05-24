import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.NearbyPosts(), Component.Sunlit()],
  footer: Component.Footer(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      defaultOpenFolders: ["개발자 이야기/2026"],
      mapFn: (node) => {
        const emojiMap: Record<string, string> = {
          "개이득 산행": "🐶 개이득 산행",
          "아이디어": "🌿 아이디어",
          "자작캠핑카": "🚐 자작캠핑카",
          "디지털노마드": "🧳 디지털노마드",
          "뒤늦은 퇴사일기": "✍🏻 뒤늦은 퇴사일기",
          "개발자 이야기": "👨🏻‍💻 개발자 이야기",
          "여행기억 리터칭": "✈️ 여행기억 리터칭",
          "좋아하는 글들": "🔖 좋아하는 글들",
        }
        if (node.isFolder && emojiMap[node.displayName]) {
          node.displayName = emojiMap[node.displayName]
        }
      },
      sortFn: (a, b) => {
        const ARCHIVED = ["디지털노마드", "뒤늦은-퇴사일기"]
        const FOLDER_ORDER = ["아이디어", "개발자-이야기", "여행기억-리터칭", "자작캠핑카", "개이득-산행", "좋아하는-글들"]
        const aArchived = a.isFolder && ARCHIVED.includes(a.slugSegment)
        const bArchived = b.isFolder && ARCHIVED.includes(b.slugSegment)
        if (aArchived && !bArchived) return 1
        if (!aArchived && bArchived) return -1
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        if (a.isFolder && b.isFolder) {
          if (aArchived && bArchived) return ARCHIVED.indexOf(a.slugSegment) - ARCHIVED.indexOf(b.slugSegment)
          const aIdx = FOLDER_ORDER.indexOf(a.slugSegment)
          const bIdx = FOLDER_ORDER.indexOf(b.slugSegment)
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
          if (aIdx !== -1) return -1
          if (bIdx !== -1) return 1
          return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
        }
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        if (aDate !== bDate) return bDate - aDate
        return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
      },
    }),
    Component.DesktopOnly(Component.RecentNotes({
      limit: 3,
      filter: (f) => !f.slug?.endsWith("/index") && f.slug !== "index",
      showTags: false,
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
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.MobileOnly(Component.RecentNotes({
      limit: 3,
      filter: (f) => !f.slug?.endsWith("/index") && f.slug !== "index",
      showTags: false,
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
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      defaultOpenFolders: ["개발자 이야기/2026"],
      mapFn: (node) => {
        const emojiMap: Record<string, string> = {
          "개이득 산행": "🐶 개이득 산행",
          "아이디어": "🌿 아이디어",
          "자작캠핑카": "🚐 자작캠핑카",
          "디지털노마드": "🧳 디지털노마드",
          "뒤늦은 퇴사일기": "✍🏻 뒤늦은 퇴사일기",
          "개발자 이야기": "👨🏻‍💻 개발자 이야기",
          "여행기억 리터칭": "✈️ 여행기억 리터칭",
          "좋아하는 글들": "🔖 좋아하는 글들",
        }
        if (node.isFolder && emojiMap[node.displayName]) {
          node.displayName = emojiMap[node.displayName]
        }
      },
      sortFn: (a, b) => {
        const ARCHIVED = ["디지털노마드", "뒤늦은-퇴사일기"]
        const FOLDER_ORDER = ["아이디어", "개발자-이야기", "여행기억-리터칭", "자작캠핑카", "개이득-산행", "좋아하는-글들"]
        const aArchived = a.isFolder && ARCHIVED.includes(a.slugSegment)
        const bArchived = b.isFolder && ARCHIVED.includes(b.slugSegment)
        if (aArchived && !bArchived) return 1
        if (!aArchived && bArchived) return -1
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        if (a.isFolder && b.isFolder) {
          if (aArchived && bArchived) return ARCHIVED.indexOf(a.slugSegment) - ARCHIVED.indexOf(b.slugSegment)
          const aIdx = FOLDER_ORDER.indexOf(a.slugSegment)
          const bIdx = FOLDER_ORDER.indexOf(b.slugSegment)
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
          if (aIdx !== -1) return -1
          if (bIdx !== -1) return 1
          return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
        }
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        if (aDate !== bDate) return bDate - aDate
        return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
      },
    }),
    Component.DesktopOnly(Component.RecentNotes({
      limit: 3,
      filter: (f) => !f.slug?.endsWith("/index") && f.slug !== "index",
      showTags: false,
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
  ],
  right: [
    Component.MobileOnly(Component.RecentNotes({
      limit: 3,
      filter: (f) => !f.slug?.endsWith("/index") && f.slug !== "index",
      showTags: false,
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
  ],
}
