import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
// @ts-ignore
import style from "./styles/nearbyPosts.scss"
// @ts-ignore
import script from "./scripts/nearbyPosts.inline"

const NearbyPosts: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  const slug = fileData.slug!

  if (slug === "index" || slug.endsWith("/index")) return null

  const slugParts = slug.split("/")
  slugParts.pop()
  const parentFolder = slugParts.join("/")

  const siblings = allFiles.filter((f) => {
    if (!f.slug || f.slug === slug) return false
    if (f.slug.endsWith("/index")) return false
    const fParts = f.slug.split("/")
    fParts.pop()
    return fParts.join("/") === parentFolder
  })

  if (siblings.length === 0) return null

  const sorter = byDateAndAlphabetical(cfg)
  const sorted = [...siblings, fileData].sort(sorter)

  return (
    <div class="nearby-posts-wrapper">
      <div class="nearby-posts">
        <h3 class="nearby-header">다른 글 보기</h3>
        <ul class="nearby-list">
          {sorted.map((page) => {
            const isCurrent = page.slug === slug
            const title = page.frontmatter?.title ?? "Untitled"
            return (
              <li class={`nearby-item${isCurrent ? " current" : ""}`}>
                <span class="nearby-date">
                  {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                </span>
                <span class="nearby-title">
                  {isCurrent ? (
                    <span>{title}</span>
                  ) : (
                    <a href={resolveRelative(slug, page.slug!)} class="internal">
                      {title}
                    </a>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

NearbyPosts.css = style
NearbyPosts.afterDOMLoaded = script
export default (() => NearbyPosts) satisfies QuartzComponentConstructor
