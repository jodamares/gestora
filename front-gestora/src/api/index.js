async function request(url, options = {}) {
  const token = localStorage.getItem('auth_token')
  const customHeaders = options.headers || {}
  const hasExplicitContentType =
    Object.keys(customHeaders).some((key) => key.toLowerCase() === 'content-type')

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(!hasExplicitContentType ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
  })
  const data = res.ok ? await res.json().catch(() => ({})) : null
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export { request }
