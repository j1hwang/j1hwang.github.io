import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.Sunlit()],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
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
          "스타렉스 자작캠핑카": "🚐 스타렉스 자작캠핑카",
          "디지털노마드": "🧳 디지털노마드",
          "뒤늦은 퇴사일기": "✍🏻 뒤늦은 퇴사일기",
          "개발자 이야기": "👨🏻‍💻 개발자 이야기",
        }
        if (node.isFolder && emojiMap[node.displayName]) {
          node.displayName = emojiMap[node.displayName]
        }
      },
      sortFn: (a, b) => {
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        if (a.isFolder && b.isFolder) {
          return b.displayName.localeCompare(a.displayName, undefined, { numeric: true, sensitivity: "base" })
        }
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        if (aDate !== bDate) return bDate - aDate
        return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
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
          "스타렉스 자작캠핑카": "🚐 스타렉스 자작캠핑카",
          "디지털노마드": "🧳 디지털노마드",
          "뒤늦은 퇴사일기": "✍🏻 뒤늦은 퇴사일기",
          "개발자 이야기": "👨🏻‍💻 개발자 이야기",
        }
        if (node.isFolder && emojiMap[node.displayName]) {
          node.displayName = emojiMap[node.displayName]
        }
      },
      sortFn: (a, b) => {
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        if (a.isFolder && b.isFolder) {
          return b.displayName.localeCompare(a.displayName, undefined, { numeric: true, sensitivity: "base" })
        }
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        if (aDate !== bDate) return bDate - aDate
        return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
      },
    }),
  ],
  right: [],
}
