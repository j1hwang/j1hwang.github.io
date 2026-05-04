document.addEventListener("nav", () => {
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
    if (newTheme === "dark") {
      document.body.classList.add("sunlit-dark")
    } else {
      document.body.classList.remove("sunlit-dark")
    }
  }

  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => document.removeEventListener("themechange", handleThemeChange))
})
