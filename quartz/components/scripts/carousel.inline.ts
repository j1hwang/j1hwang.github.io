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

    // arrows
    const prev = document.createElement("button")
    prev.className = "carousel-btn carousel-prev"
    prev.innerHTML = "&#10094;"
    prev.ariaLabel = "이전"

    const next = document.createElement("button")
    next.className = "carousel-btn carousel-next"
    next.innerHTML = "&#10095;"
    next.ariaLabel = "다음"

    carousel.appendChild(prev)
    carousel.appendChild(next)

    // counter badge
    const counter = document.createElement("div")
    counter.className = "carousel-counter"
    carousel.appendChild(counter)

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
    carousel.after(strip)

    function goTo(idx: number) {
      current = (idx + imgs.length) % imgs.length
      track.style.transform = `translateX(-${current * 100}%)`
      counter.textContent = `${current + 1} / ${imgs.length}`
      thumbs.forEach((t, i) => t.classList.toggle("active", i === current))
    }

    goTo(0)

    const onPrev = () => goTo(current - 1)
    const onNext = () => goTo(current + 1)
    prev.addEventListener("click", onPrev)
    next.addEventListener("click", onNext)

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
      prev.removeEventListener("click", onPrev)
      next.removeEventListener("click", onNext)
      carousel.removeEventListener("touchstart", onTouchStart)
      carousel.removeEventListener("touchend", onTouchEnd)
    })
  })
})
