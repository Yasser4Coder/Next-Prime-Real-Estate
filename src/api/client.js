const AUTH_KEY = 'nextprime_dashboard_token'

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || ''
}

function getToken() {
  return localStorage.getItem(AUTH_KEY)
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(AUTH_KEY, token)
  else localStorage.removeItem(AUTH_KEY)
}

export function getAuthToken() {
  return getToken()
}

async function request(path, options = {}) {
  const base = getBaseUrl().replace(/\/$/, '')
  if (!base) return Promise.reject(new Error('No API URL configured'))
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const headers = { ...options.headers }
  if (!headers['Content-Type'] && typeof options.body === 'string') headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`)
  return data
}

// ——— Public (no auth) ———
export async function getSiteData() {
  return request('/api/site-data')
}

/** GET single property by id (public, for property details page) */
export async function getPropertyPublic(id) {
  return request(`/api/properties/${id}`)
}

// ——— Auth ———
export async function login(email, password) {
  const body = { email: email?.trim() || 'admin', password }
  const data = await request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  if (data.token) setAuthToken(data.token)
  return data
}

// ——— Admin: Properties ———
export async function getProperties() {
  return request('/api/admin/properties')
}

export async function getProperty(id) {
  return request(`/api/admin/properties/${id}`)
}

export async function createProperty(bodyOrFormData) {
  const base = getBaseUrl().replace(/\/$/, '')
  const token = getToken()
  const opts = { method: 'POST', headers: {} }
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (bodyOrFormData instanceof FormData) {
    opts.body = bodyOrFormData
  } else {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(bodyOrFormData)
  }
  const res = await fetch(`${base}/api/admin/properties`, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export async function updateProperty(id, bodyOrFormData) {
  const base = getBaseUrl().replace(/\/$/, '')
  const token = getToken()
  const opts = { method: 'PUT', headers: {} }
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (bodyOrFormData instanceof FormData) {
    opts.body = bodyOrFormData
  } else {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(bodyOrFormData)
  }
  const res = await fetch(`${base}/api/admin/properties/${id}`, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export async function deleteProperty(id) {
  return request(`/api/admin/properties/${id}`, { method: 'DELETE' })
}

// ——— Admin: Testimonials ———
export async function getTestimonials() {
  return request('/api/admin/testimonials')
}

export async function createTestimonial(body) {
  return request('/api/admin/testimonials', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateTestimonial(id, body) {
  return request(`/api/admin/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteTestimonial(id) {
  return request(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
}

// ——— Admin: Areas ———
export async function getAreas() {
  return request('/api/admin/areas')
}

export async function createArea(body) {
  return request('/api/admin/areas', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateArea(id, body) {
  return request(`/api/admin/areas/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteArea(id) {
  return request(`/api/admin/areas/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

// ——— Admin: Locations list (buy / rent separate) ———
export async function getLocationsList() {
  return request('/api/admin/locations-list')
}

export async function addLocation(name, purpose = 'buy') {
  return request('/api/admin/locations-list', {
    method: 'POST',
    body: JSON.stringify({ name, purpose: purpose === 'rent' ? 'rent' : 'buy' }),
  })
}

export async function removeLocation(name, purpose = 'buy') {
  const p = purpose === 'rent' ? 'rent' : 'buy'
  return request(`/api/admin/locations-list/${encodeURIComponent(name)}?purpose=${p}`, { method: 'DELETE' })
}

// ——— Admin: Contact ———
export async function getContact() {
  return request('/api/admin/contact')
}

export async function updateContact(body) {
  return request('/api/admin/contact', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// ——— Admin: Social ———
export async function getSocial() {
  return request('/api/admin/social')
}

export async function updateSocial(body) {
  return request('/api/admin/social', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteSocial(name) {
  return request(`/api/admin/social/${encodeURIComponent(name)}`, { method: 'DELETE' })
}

// ——— Admin: Featured ———
export async function getFeatured() {
  return request('/api/admin/featured')
}

export async function setFeatured(ids) {
  return request('/api/admin/featured', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  })
}

export function isUsingApi() {
  return !!getBaseUrl()
}
