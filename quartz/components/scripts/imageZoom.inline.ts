import { DiagramPanZoom, registerEscapeHandler, removeAllChildren } from "./util"

document.addEventListener("nav", () => {
  const container = document.createElement("div")
  container.id = "image-zoom-container"

  const space = document.createElement("div")
  space.className = "image-zoom-space"
  container.appendChild(space)

  const content = document.createElement("div")
  content.className = "image-zoom-content"
  space.appendChild(content)

  const img = document.createElement("img")
  content.appendChild(img)

  document.body.appendChild(container)

  let panZoom: DiagramPanZoom | null = null

  function fitImage() {
    const maxWidth = window.innerWidth * 0.9
    const maxHeight = window.innerHeight * 0.9
    const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight)
    const width = `${img.naturalWidth * scale}px`
    const height = `${img.naturalHeight * scale}px`
    img.style.width = width
    img.style.height = height
    // keep the pannable viewport exactly the size of the image, so there's no
    // dead space around it that would swallow a "close by tapping background" click
    space.style.width = width
    space.style.height = height
  }

  function show(src: string, alt: string) {
    img.alt = alt
    container.classList.add("active")
    space.style.cursor = "grab"

    const open = () => {
      fitImage()
      panZoom = new DiagramPanZoom(space, content, "image-zoom", 0.2, 5)
    }

    img.src = src
    // if the image is already cached, "complete" may already be true by the
    // time we get here, and "load" may never fire (or may have already fired
    // before this handler was attached) — check directly instead of relying
    // solely on the load event.
    if (img.complete && img.naturalWidth > 0) {
      open()
    } else {
      img.onload = open
    }
  }

  function hide() {
    container.classList.remove("active")
    panZoom?.cleanup()
    panZoom = null
  }

  registerEscapeHandler(container, hide)

  const targets = document.querySelectorAll(
    "article img:not(.carousel-thumb)",
  ) as NodeListOf<HTMLImageElement>

  for (const target of targets) {
    const handler = () => show(target.src, target.alt)
    target.addEventListener("click", handler)
    window.addCleanup(() => target.removeEventListener("click", handler))
  }

  window.addCleanup(() => {
    panZoom?.cleanup()
    removeAllChildren(container)
    container.remove()
  })
})
