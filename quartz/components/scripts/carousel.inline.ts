document.addEventListener("nav", () => {
  document.querySelectorAll<HTMLElement>(".carousel").forEach((carousel) => {
    const items = Array.from(carousel.querySelectorAll<HTMLElement>("img, video"))
    if (items.length < 2) return

    let current = 0

    // track
    const track = document.createElement("div")
    track.className = "carousel-track"
    items.forEach((item) => track.appendChild(item))
    carousel.appendChild(track)

    // thumbnail strip
    const strip = document.createElement("div")
    strip.className = "carousel-strip"
    const thumbs = items.map((item, i) => {
      let thumb: HTMLElement
      if (item.tagName === "VIDEO") {
        const v = document.createElement("video")
        v.src = (item as HTMLVideoElement).src
        v.muted = true
        v.autoplay = true
        v.loop = true
        v.playsInline = true
        thumb = v
      } else {
        const img = document.createElement("img")
        img.src = (item as HTMLImageElement).src
        img.alt = (item as HTMLImageElement).alt
        thumb = img
      }
      thumb.className = "carousel-thumb" + (i === 0 ? " active" : "")
      strip.appendChild(thumb)
      return thumb
    })

    // caption
    const captions = items.map((item) => item.dataset.caption ?? "")
    const hasCaption = captions.some((c) => c !== "")
    const caption = document.createElement("div")
    caption.className = "carousel-caption"

    if (hasCaption) {
      carousel.after(caption)
      caption.after(strip)
    } else {
      carousel.after(strip)
    }

    function goTo(idx: number, scrollThumb = true) {
      items.forEach((item) => {
        if (item.tagName === "VIDEO") (item as HTMLVideoElement).pause()
      })
      current = (idx + items.length) % items.length
      track.style.transform = `translateX(-${current * 100}%)`
      thumbs.forEach((t, i) => t.classList.toggle("active", i === current))
      if (scrollThumb) thumbs[current].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      if (hasCaption) {
        caption.textContent = captions[current]
        caption.style.visibility = captions[current] ? "visible" : "hidden"
      }
      const activeItem = items[current]
      if (activeItem.tagName === "VIDEO") {
        (activeItem as HTMLVideoElement).play().catch(() => {})
      }
    }

    goTo(0, false)

    thumbs.forEach((thumb, i) => {
      const handler = () => goTo(i)
      thumb.addEventListener("click", handler)
      window.addCleanup(() => thumb.removeEventListener("click", handler))
    })

    // swipe
    let touchStartX = 0
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1)
    }
    carousel.addEventListener("touchstart", onTouchStart)
    carousel.addEventListener("touchend", onTouchEnd)

    window.addCleanup(() => {
      carousel.removeEventListener("touchstart", onTouchStart)
      carousel.removeEventListener("touchend", onTouchEnd)
    })
  })
})
