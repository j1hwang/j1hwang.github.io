interface Position {
  x: number
  y: number
}

export class DiagramPanZoom {
  private isDragging = false
  private startPan: Position = { x: 0, y: 0 }
  private currentPan: Position = { x: 0, y: 0 }
  private scale = 1
  private readonly MIN_SCALE = 0.5
  private readonly MAX_SCALE = 3
  private zoomInClicks = 0

  cleanups: (() => void)[] = []

  constructor(
    private container: HTMLElement,
    private content: HTMLElement,
    private classPrefix: string = "mermaid",
    private zoomIncrement: number = 0.1,
    private maxZoomInClicks?: number,
  ) {
    this.setupEventListeners()
    this.setupNavigationControls()
    this.resetTransform()
  }

  private setupEventListeners() {
    // Mouse drag events
    const mouseDownHandler = this.onMouseDown.bind(this)
    const mouseMoveHandler = this.onMouseMove.bind(this)
    const mouseUpHandler = this.onMouseUp.bind(this)

    // Touch drag events
    const touchStartHandler = this.onTouchStart.bind(this)
    const touchMoveHandler = this.onTouchMove.bind(this)
    const touchEndHandler = this.onTouchEnd.bind(this)

    const resizeHandler = this.resetTransform.bind(this)

    this.container.addEventListener("mousedown", mouseDownHandler)
    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseup", mouseUpHandler)

    this.container.addEventListener("touchstart", touchStartHandler, { passive: false })
    document.addEventListener("touchmove", touchMoveHandler, { passive: false })
    document.addEventListener("touchend", touchEndHandler)

    window.addEventListener("resize", resizeHandler)

    this.cleanups.push(
      () => this.container.removeEventListener("mousedown", mouseDownHandler),
      () => document.removeEventListener("mousemove", mouseMoveHandler),
      () => document.removeEventListener("mouseup", mouseUpHandler),
      () => this.container.removeEventListener("touchstart", touchStartHandler),
      () => document.removeEventListener("touchmove", touchMoveHandler),
      () => document.removeEventListener("touchend", touchEndHandler),
      () => window.removeEventListener("resize", resizeHandler),
    )
  }

  cleanup() {
    for (const cleanup of this.cleanups) {
      cleanup()
    }
  }

  private zoomInButton: HTMLButtonElement | null = null
  private zoomOutButton: HTMLButtonElement | null = null

  private setupNavigationControls() {
    const controls = document.createElement("div")
    controls.className = `${this.classPrefix}-controls`

    // Zoom controls
    const zoomIn = this.createButton("+", () => this.zoom(this.zoomIncrement))
    const zoomOut = this.createButton("-", () => this.zoom(-this.zoomIncrement))
    const resetBtn = this.createButton("Reset", () => this.resetTransform())
    this.zoomInButton = zoomIn
    this.zoomOutButton = zoomOut

    controls.appendChild(zoomOut)
    controls.appendChild(resetBtn)
    controls.appendChild(zoomIn)

    this.container.appendChild(controls)
    this.updateZoomButtons()
  }

  private updateZoomButtons() {
    if (this.maxZoomInClicks === undefined) return
    if (this.zoomInButton) {
      this.zoomInButton.disabled = this.zoomInClicks >= this.maxZoomInClicks
    }
    if (this.zoomOutButton) {
      this.zoomOutButton.disabled = this.zoomInClicks <= 0
    }
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button")
    button.textContent = text
    button.className = `${this.classPrefix}-control-button`
    button.addEventListener("click", onClick)
    const stopProp = (e: Event) => e.stopPropagation()
    button.addEventListener("mousedown", stopProp)
    button.addEventListener("touchstart", stopProp)
    window.addCleanup(() => {
      button.removeEventListener("click", onClick)
      button.removeEventListener("mousedown", stopProp)
      button.removeEventListener("touchstart", stopProp)
    })
    return button
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return // Only handle left click
    this.isDragging = true
    this.startPan = { x: e.clientX - this.currentPan.x, y: e.clientY - this.currentPan.y }
    this.container.style.cursor = "grabbing"
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return
    e.preventDefault()

    this.currentPan = {
      x: e.clientX - this.startPan.x,
      y: e.clientY - this.startPan.y,
    }

    this.updateTransform()
  }

  private onMouseUp() {
    this.isDragging = false
    this.container.style.cursor = "grab"
  }

  private onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return
    this.isDragging = true
    const touch = e.touches[0]
    this.startPan = { x: touch.clientX - this.currentPan.x, y: touch.clientY - this.currentPan.y }
  }

  private onTouchMove(e: TouchEvent) {
    if (!this.isDragging || e.touches.length !== 1) return
    e.preventDefault() // Prevent scrolling

    const touch = e.touches[0]
    this.currentPan = {
      x: touch.clientX - this.startPan.x,
      y: touch.clientY - this.startPan.y,
    }

    this.updateTransform()
  }

  private onTouchEnd() {
    this.isDragging = false
  }

  private zoom(delta: number) {
    if (this.maxZoomInClicks !== undefined) {
      if (delta > 0) {
        if (this.zoomInClicks >= this.maxZoomInClicks) return
        this.zoomInClicks++
      } else if (delta < 0) {
        this.zoomInClicks = Math.max(0, this.zoomInClicks - 1)
      }
    }

    const newScale = Math.min(Math.max(this.scale + delta, this.MIN_SCALE), this.MAX_SCALE)

    // Zoom around center of the container (viewport), not the scaled content
    const centerX = this.container.clientWidth / 2
    const centerY = this.container.clientHeight / 2

    const scaleDiff = newScale - this.scale
    this.currentPan.x -= centerX * scaleDiff
    this.currentPan.y -= centerY * scaleDiff

    this.scale = newScale
    this.updateTransform()
    this.updateZoomButtons()
  }

  private updateTransform() {
    this.content.style.transform = `translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`
  }

  private resetTransform() {
    this.content.style.transform = "translate(0px, 0px) scale(1)"
    const target = this.content.firstElementChild as HTMLElement | SVGElement
    // Use offsetWidth/offsetHeight instead of getBoundingClientRect() to avoid
    // reading stale scaled dimensions while the CSS transition is still running
    const width = (target as HTMLElement).offsetWidth
    const height = (target as HTMLElement).offsetHeight

    this.zoomInClicks = 0
    this.scale = 1
    this.currentPan = {
      x: (this.container.clientWidth - width) / 2,
      y: (this.container.clientHeight - height) / 2,
    }
    this.updateTransform()
    this.updateZoomButtons()
  }
}

export function registerEscapeHandler(outsideContainer: HTMLElement | null, cb: () => void) {
  if (!outsideContainer) return
  function click(this: HTMLElement, e: HTMLElementEventMap["click"]) {
    if (e.target !== this) return
    e.preventDefault()
    e.stopPropagation()
    cb()
  }

  // Some mobile browsers don't reliably synthesize a "click" after a tap on a
  // fixed-position overlay, so close on tap as well.
  function touchend(this: HTMLElement, e: HTMLElementEventMap["touchend"]) {
    if (e.target !== this) return
    e.preventDefault()
    e.stopPropagation()
    cb()
  }

  function esc(e: HTMLElementEventMap["keydown"]) {
    if (!e.key.startsWith("Esc")) return
    e.preventDefault()
    cb()
  }

  outsideContainer?.addEventListener("click", click)
  window.addCleanup(() => outsideContainer?.removeEventListener("click", click))
  outsideContainer?.addEventListener("touchend", touchend)
  window.addCleanup(() => outsideContainer?.removeEventListener("touchend", touchend))
  document.addEventListener("keydown", esc)
  window.addCleanup(() => document.removeEventListener("keydown", esc))
}

export function removeAllChildren(node: HTMLElement) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

// AliasRedirect emits HTML redirects which also have the link[rel="canonical"]
// containing the URL it's redirecting to.
// Extracting it here with regex is _probably_ faster than parsing the entire HTML
// with a DOMParser effectively twice (here and later in the SPA code), even if
// way less robust - we only care about our own generated redirects after all.
const canonicalRegex = /<link rel="canonical" href="([^"]*)">/

export async function fetchCanonical(url: URL): Promise<Response> {
  const res = await fetch(`${url}`)
  if (!res.headers.get("content-type")?.startsWith("text/html")) {
    return res
  }

  // reading the body can only be done once, so we need to clone the response
  // to allow the caller to read it if it's was not a redirect
  const text = await res.clone().text()
  const [_, redirect] = text.match(canonicalRegex) ?? []
  return redirect ? fetch(`${new URL(redirect, url)}`) : res
}
