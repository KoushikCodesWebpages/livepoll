let loader = null

export function setLoader(impl) {
  loader = impl
}

export function showLoader() {
  loader?.show()
}

export function hideLoader() {
  loader?.hide()
}
