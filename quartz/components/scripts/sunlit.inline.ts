document.addEventListener("nav", () => {
  const fadeHideClass = "sunlit-fade-content"
  const fadeInClass = "sunlit-fade-in"
  const themeTransitionMs = 1200
  const fadeInMs = 350
  let fadeTimer: number | undefined

  // Move #dappled-light to direct child of body so z-index: -1 works globally
  const el = document.getElementById("dappled-light")
  if (el && el.parentElement !== document.body) {
    document.body.appendChild(el)
  }

  const theme = document.documentElement.getAttribute("saved-theme")
  if (theme === "dark") {
    document.body.classList.add("sunlit-dark")
  } else {
    document.body.classList.remove("sunlit-dark")
  }

  const handleThemeChange = (e: Event) => {
    const newTheme = (e as CustomEvent<{ theme: string }>).detail.theme
    document.body.classList.add("sunlit-ready")

    document.body.classList.add(fadeHideClass)
    document.body.classList.remove(fadeInClass)
    if (fadeTimer !== undefined) {
      window.clearTimeout(fadeTimer)
    }
    fadeTimer = window.setTimeout(() => {
      document.body.classList.add(fadeInClass)
      window.setTimeout(() => document.body.classList.remove(fadeInClass), fadeInMs)
      document.body.classList.remove(fadeHideClass)
      fadeTimer = undefined
    }, themeTransitionMs)

    if (newTheme === "dark") {
      document.body.classList.add("sunlit-dark")
    } else {
      document.body.classList.remove("sunlit-dark")
    }
  }

  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => {
    document.removeEventListener("themechange", handleThemeChange)
    if (fadeTimer !== undefined) {
      window.clearTimeout(fadeTimer)
    }
    document.body.classList.remove(fadeHideClass, fadeInClass)
  })
})
