;(() => {
  const container = document.querySelector('.vp-theme-container')
  const sidebarButton = document.querySelector('.vp-toggle-sidebar-button')
  const sidebarMask = document.querySelector('.vp-sidebar-mask')

  function setSidebarState(open) {
    if (!container || !sidebarButton) {
      return
    }

    container.classList.toggle('sidebar-open', open)
    sidebarButton.setAttribute('aria-expanded', open ? 'true' : 'false')
  }

  function closeSidebar() {
    setSidebarState(false)
  }

  function toggleSidebar() {
    if (!container) {
      return
    }

    const willOpen = !container.classList.contains('sidebar-open')
    setSidebarState(willOpen)
  }

  if (sidebarButton) {
    sidebarButton.addEventListener('click', toggleSidebar)
    sidebarButton.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleSidebar()
      }
    })
  }

  if (sidebarMask) {
    sidebarMask.addEventListener('click', closeSidebar)
  }

  const wrappers = document.querySelectorAll('.vp-navbar-dropdown-wrapper')

  function closeAllDropdowns(exceptWrapper) {
    wrappers.forEach(wrapper => {
      if (exceptWrapper && wrapper === exceptWrapper) {
        return
      }

      wrapper.classList.remove('open')
    })
  }

  wrappers.forEach(wrapper => {
    const desktopButton = wrapper.querySelector('.vp-navbar-dropdown-title')
    const mobileButton = wrapper.querySelector(
      '.vp-navbar-dropdown-title-mobile'
    )

    function toggleDropdown() {
      const willOpen = !wrapper.classList.contains('open')
      closeAllDropdowns(willOpen ? wrapper : null)
      wrapper.classList.toggle('open', willOpen)
    }

    if (desktopButton) {
      desktopButton.addEventListener('click', event => {
        event.preventDefault()
        toggleDropdown()
      })
    }

    if (mobileButton) {
      mobileButton.addEventListener('click', event => {
        event.preventDefault()
        toggleDropdown()
      })
    }
  })

  document.addEventListener('click', event => {
    const target = event.target
    if (!(target instanceof Node)) {
      return
    }

    const insideDropdown = Array.from(wrappers).some(wrapper =>
      wrapper.contains(target)
    )

    if (!insideDropdown) {
      closeAllDropdowns(null)
    }
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeSidebar()
      closeAllDropdowns(null)
    }
  })
})()
