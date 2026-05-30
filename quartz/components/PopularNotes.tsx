import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, simplifySlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import style from "./styles/recentNotes.scss"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  categoryMap: Record<string, string>
  filter: (f: QuartzPluginData) => boolean
}

const defaultOptions: Options = {
  title: "Popular Notes",
  limit: 3,
  categoryMap: {},
  filter: () => true,
}

export default ((userOpts?: Partial<Options>) => {
  const PopularNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    // 각 글의 백링크 수 계산
    const backlinkCount = new Map<string, number>()
    for (const file of allFiles) {
      for (const link of file.links ?? []) {
        backlinkCount.set(link, (backlinkCount.get(link) ?? 0) + 1)
      }
    }

    const pages = allFiles
      .filter(opts.filter)
      .filter((f) => {
        const slug = simplifySlug(f.slug!)
        return (backlinkCount.get(slug) ?? 0) > 0
      })
      .sort((a, b) => {
        const aCount = backlinkCount.get(simplifySlug(a.slug!)) ?? 0
        const bCount = backlinkCount.get(simplifySlug(b.slug!)) ?? 0
        return bCount - aCount
      })
      .slice(0, opts.limit)

    if (pages.length === 0) return null

    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h3>{opts.title}</h3>
        <ul class="recent-ul">
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? page.slug ?? ""
            const rawCategory = page.slug?.split("/")[0] ?? ""
            const category = opts.categoryMap[rawCategory] ?? rawCategory
            const count = backlinkCount.get(simplifySlug(page.slug!)) ?? 0

            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                        {title}
                      </a>
                    </h3>
                  </div>
                  <p class="meta">
                    {category && <span>{category}</span>}
                    {category && <span> · </span>}
                    <span>링크 {count}개</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  PopularNotes.css = style
  return PopularNotes
}) satisfies QuartzComponentConstructor
