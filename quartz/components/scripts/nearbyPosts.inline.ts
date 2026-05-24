const NEARBY_PER_PAGE = 5

function setupNearbyPosts() {
  const container = document.querySelector<HTMLElement>(".nearby-posts")
  if (!container) return

  const items = Array.from(container.querySelectorAll<HTMLElement>("li.nearby-item"))
  container.querySelector(".nearby-pagination")?.remove()

  if (items.length <= NEARBY_PER_PAGE) return

  const currentItem = container.querySelector<HTMLElement>("li.nearby-item.current")
  const currentIdx = currentItem ? items.indexOf(currentItem) : 0

  // center the current item in the 5-item window
  const maxOffset = Math.max(0, items.length - NEARBY_PER_PAGE)
  const defaultOffset = Math.max(0, Math.min(currentIdx - Math.floor(NEARBY_PER_PAGE / 2), maxOffset))

  const params = new URLSearchParams(window.location.search)
  const rawOffset = parseInt(params.get("noff") ?? String(defaultOffset), 10)
  const offset = Math.min(Math.max(rawOffset, 0), maxOffset)

  items.forEach((item, i) => {
    item.style.display = i >= offset && i < offset + NEARBY_PER_PAGE ? "" : "none"
  })

  const canGoBack = offset > 0
  const canGoForward = offset + NEARBY_PER_PAGE < items.length

  const getUrl = (newOffset: number) => {
    const clamped = Math.min(Math.max(newOffset, 0), maxOffset)
    const newParams = new URLSearchParams(window.location.search)
    if (clamped === defaultOffset) {
      newParams.delete("noff")
    } else {
      newParams.set("noff", clamped.toString())
    }
    const query = newParams.toString()
    return window.location.pathname + (query ? `?${query}` : "")
  }

  const nav = document.createElement("nav")
  nav.className = "nearby-pagination pagination-controls"

  const addBtn = (text: string, href: string | null, disabled = false) => {
    if (disabled) {
      const span = document.createElement("span")
      span.className = "pagination-btn disabled"
      span.textContent = text
      nav.appendChild(span)
    } else {
      const a = document.createElement("a")
      a.href = href!
      a.className = "pagination-btn"
      a.textContent = text
      a.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        history.pushState({}, "", href!)
        setupNearbyPosts()
      })
      nav.appendChild(a)
    }
  }

  addBtn("←", getUrl(offset - NEARBY_PER_PAGE), !canGoBack)

  const label = document.createElement("span")
  label.className = "nearby-position"
  label.textContent = `${offset + 1}–${Math.min(offset + NEARBY_PER_PAGE, items.length)} / ${items.length}`
  nav.appendChild(label)

  addBtn("→", getUrl(offset + NEARBY_PER_PAGE), !canGoForward)

  container.appendChild(nav)
}

document.addEventListener("nav", setupNearbyPosts)
