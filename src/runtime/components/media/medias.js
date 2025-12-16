export const mediaHeader = (header, projectId) => {
  if (!import.meta.server) {
    const headerKey = `project-id-${projectId}`
    header[headerKey] = projectId
    if (header.origin) {
      header['access-control-request-headers'] = headerKey
    }
    return header
  } else return header
}

export const showToast = (title, variant, message, options) => {
  const $nuxt = useNuxtApp()
  const toast = $nuxt.$toast

  toast?.[variant](options && Object.keys(options).length > 0 ? '🔗 ' + message : message, {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: false,
    rtl: false,
    onClick: () =>
      options && Object.keys(options).length > 0
        ? window.open(`${options.link.root}${options.link.path}`, '_blank')
        : {},
  })
}

export const parseDate = (timestamp) => {
  const timestampInMs = timestamp * 1000
  const date = new Date(timestampInMs)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const isLottieAnimation = (json) => {
  try {
    if (typeof json !== 'object' || json === null) return false

    const requiredKeys = ['v', 'fr', 'ip', 'op', 'w', 'h', 'layers']

    return requiredKeys.every((key) => key in json)
  } catch {
    return false
  }
}

export const initLottieFromHtml = (htmlElement) => {
  try {
    // Select all matching divs
    const lottieDivs = htmlElement.querySelectorAll('div[lottie-id][media-type="lottie"]')
    if (lottieDivs && lottieDivs.length > 0) {
      lottieDivs.forEach((div) => {
        const src = div.getAttribute('src')
        const lottieId = div.getAttribute('lottie-id')

        // Find the corresponding element in the real DOM
        const target = htmlElement.querySelector(
          `div[lottie-id="${lottieId}"][media-type="lottie"]`
        )
        if (!target) return

        if (target.hasChildNodes()) {
          target.innerHTML = ''
        }

        if (window.lottie) {
          window.lottie.loadAnimation({
            container: target,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            path: src,
          })
        }
      })
    }
  } catch {}
}
