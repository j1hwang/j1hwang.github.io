const ITEMS_PER_PAGE = 5

function setupPagination() {
  const pageListing = document.querySelector<HTMLElement>(".page-listing")
  if (!pageListing) return

  const items = Array.from(pageListing.querySelectorAll<HTMLElement>("li.section-li"))

  // Remove existing pagination controls first
  pageListing.querySelector(".pagination-controls")?.remove()

  if (items.length <= ITEMS_PER_PAGE) return

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const params = new URLSearchParams(window.location.search)
  const currentPage = Math.min(Math.max(parseInt(params.get("page") ?? "1", 10), 1), totalPages)

  items.forEach((item, i) => {
    const page = Math.floor(i / ITEMS_PER_PAGE) + 1
    item.style.display = page === currentPage ? "" : "none"
  })

  const getPageUrl = (page: number) => {
    const newParams = new URLSearchParams(window.location.search)
    if (page === 1) {
      newParams.delete("page")
    } else {
      newParams.set("page", page.toString())
    }
    const query = newParams.toString()
    return window.location.pathname + (query ? `?${query}` : "")
  }

  const controls = document.createElement("nav")
  controls.className = "pagination-controls"

  const addBtn = (text: string, href: string | null, active = false, disabled = false) => {
    if (disabled) {
      const span = document.createElement("span")
      span.className = "pagination-btn disabled"
      span.textContent = text
      controls.appendChild(span)
    } else {
      const a = document.createElement("a")
      a.href = href!
      a.className = "pagination-btn" + (active ? " active" : "")
      a.textContent = text
      a.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        history.pushState({}, "", href!)
        setupPagination()
      })
      controls.appendChild(a)
    }
  }

  addBtn("<", getPageUrl(currentPage - 1), false, currentPage === 1)

  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  const start = Math.min(Math.max(1, currentPage - half), Math.max(1, totalPages - windowSize + 1))
  const end = Math.min(totalPages, start + windowSize - 1)

  for (let p = start; p <= end; p++) {
    addBtn(p.toString(), getPageUrl(p), p === currentPage)
  }

  addBtn(">", getPageUrl(currentPage + 1), false, currentPage === totalPages)

  pageListing.appendChild(controls)
}

document.addEventListener("nav", setupPagination)
