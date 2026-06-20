import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
import style from "./styles/archive.scss"

const POSTS_PER_PAGE = 10

const categoryMap: Record<string, string> = {
  "레아아범-육견일기": "🐶 레아아범 육견일기",
  "개이득-산행": "🦮 개이득 산행",
  "아이디어": "🌿 아이디어",
  "자작캠핑카": "🚐 자작캠핑카",
  "디지털노마드": "🧳 디지털노마드",
  "뒤늦은-퇴사일기": "✍🏻 뒤늦은 퇴사일기",
  "개발자-이야기": "👨🏻‍💻 개발자 이야기",
  "여행기억-리터칭": "✈️ 여행기억 리터칭",
  "좋아하는-글들": "🔖 좋아하는 글들",
}

export default (() => {
  const Archive: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    const posts = allFiles
      .filter((f) => !f.slug?.endsWith("/index") && f.slug !== "index" && f.slug !== "archive")
      .sort(byDateAndAlphabetical(cfg))

    return (
      <div class="archive">
        <p class="archive-count">총 {posts.length}개의 글</p>
        <ul class="archive-list" id="archive-list">
          {posts.map((page, i) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const rawCategory = page.slug?.split("/")[0] ?? ""
            const category = categoryMap[rawCategory] ?? rawCategory

            return (
              <li class="archive-item" data-index={i}>
                <span class="archive-date">
                  {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                </span>
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal archive-title">
                  {title}
                </a>
                {category && <span class="archive-category">{category}</span>}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  Archive.css = style
  Archive.afterDOMLoaded = `
    (function() {
      var PER_PAGE = ${POSTS_PER_PAGE};

      function setup() {
        var items = Array.from(document.querySelectorAll('.archive-item'));
        if (!items.length) return;

        var total = items.length;
        var maxOffset = Math.max(0, total - PER_PAGE);

        var params = new URLSearchParams(window.location.search);
        var page = Math.max(parseInt(params.get('page') || '1', 10), 1);
        var offset = Math.min((page - 1) * PER_PAGE, maxOffset);

        items.forEach(function(item) {
          var idx = parseInt(item.dataset.index, 10);
          item.style.display = (idx >= offset && idx < offset + PER_PAGE) ? '' : 'none';
        });

        var existing = document.querySelector('.archive-pagination');
        if (existing) existing.remove();

        if (total <= PER_PAGE) return;

        var canBack = offset > 0;
        var canForward = offset + PER_PAGE < total;

        function getUrl(newPage) {
          var p = new URLSearchParams(window.location.search);
          if (newPage <= 1) { p.delete('page'); } else { p.set('page', newPage); }
          var q = p.toString();
          return window.location.pathname + (q ? '?' + q : '');
        }

        var nav = document.createElement('nav');
        nav.className = 'archive-pagination pagination-controls';

        function addBtn(text, href, disabled) {
          if (disabled) {
            var span = document.createElement('span');
            span.className = 'pagination-btn disabled';
            span.textContent = text;
            nav.appendChild(span);
          } else {
            var a = document.createElement('a');
            a.href = href;
            a.className = 'pagination-btn';
            a.textContent = text;
            a.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              history.pushState({}, '', href);
              setup();
            });
            nav.appendChild(a);
          }
        }

        addBtn('←', getUrl(page - 1), !canBack);

        var label = document.createElement('span');
        label.className = 'nearby-position';
        var totalPages = Math.ceil(total / PER_PAGE);

        addBtn('→', getUrl(page + 1), !canForward);

        document.querySelector('.archive').appendChild(nav);
      }

      document.addEventListener('nav', setup);
      setup();
    })();
  `

  return Archive
}) satisfies QuartzComponentConstructor
