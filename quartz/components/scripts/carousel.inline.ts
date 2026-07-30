document.addEventListener("nav", () => {
  document.querySelectorAll<HTMLElement>(".carousel").forEach((carousel) => {
    const imgs = Array.from(carousel.querySelectorAll<HTMLImageElement>("img"))
    if (imgs.length < 2) return

    let current = 0

    // track
    const track = document.createElement("div")
    track.className = "carousel-track"
    imgs.forEach((img) => track.appendChild(img))
    carousel.appendChild(track)


    // thumbnail strip
    const strip = document.createElement("div")
    strip.className = "carousel-strip"
    const thumbs = imgs.map((img, i) => {
      const thumb = document.createElement("img")
      thumb.src = img.src
      thumb.alt = img.alt
      thumb.className = "carousel-thumb" + (i === 0 ? " active" : "")
      strip.appendChild(thumb)
      return thumb
    })
    // caption
    const captions = imgs.map((img) => img.dataset.caption ?? "")
    const hasCaption = captions.some((c) => c !== "")
    const caption = document.createElement("div")
    caption.className = "carousel-caption"

    if (hasCaption) {
      carousel.after(caption)
      caption.after(strip)
    } else {
      carousel.after(strip)
    }

    function goTo(idx: number) {
      current = (idx + imgs.length) % imgs.length
      track.style.transform = `translateX(-${current * 100}%)`
thumbs.forEach((t, i) => t.classList.toggle("active", i === current))
      thumbs[current].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      if (hasCaption) {
        caption.textContent = captions[current]
        caption.style.visibility = captions[current] ? "visible" : "hidden"
      }
    }

    goTo(0)

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
