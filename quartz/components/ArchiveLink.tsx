import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

const ArchiveLink: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  return (
    <div class="archive-link">
      <a href={resolveRelative(fileData.slug!, "archive")} class="internal">
        전체 글 목록
      </a>
    </div>
  )
}

ArchiveLink.css = `
.archive-link {
  margin-top: -1.2rem;
  margin-bottom: -1.2rem;
  text-align: right;

  a {
    font-size: 0.65rem;
    color: var(--secondary);
    text-decoration: none;
    background-color: transparent !important;
    opacity: 0 !important;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1 !important;
    }
  }
}
`

export default (() => ArchiveLink) satisfies QuartzComponentConstructor
