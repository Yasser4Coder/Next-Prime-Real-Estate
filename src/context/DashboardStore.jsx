import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import { getSiteData } from '../api/client.js'

const STORAGE_KEY = 'nextprime_cms'
const AUTH_KEY = 'nextprime_dashboard_token'

const useApi = () => !!import.meta.env.VITE_API_URL

const defaultContact = {
  phoneDisplay: '+971 52 778 0718',
  phoneTel: '+971527780718',
  email: 'contact@nextprimerealestate.com',
  whatsappText: "Hi Next Prime, I'm interested in your Dubai properties.",
}

const defaultSocial = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  { name: 'Twitter', href: '#', icon: 'twitter' },
  { name: 'YouTube', href: '#', icon: 'youtube' },
  { name: 'Instagram', href: 'https://www.instagram.com/nextprimerealestate/', icon: 'instagram' },
]

const defaultAreas = [
  { id: 'dubai-marina', name: 'Dubai Marina', subtitle: 'Waterfront lifestyle & high-demand rentals', center: [25.0807, 55.1403] },
  { id: 'downtown', name: 'Downtown Dubai', subtitle: 'Prime CBD living near Burj Khalifa', center: [25.1972, 55.2744] },
  { id: 'palm-jumeirah', name: 'Palm Jumeirah', subtitle: 'Ultra-luxury beachfront residences', center: [25.1124, 55.1389] },
  { id: 'business-bay', name: 'Business Bay', subtitle: 'Modern towers & investment opportunities', center: [25.1864, 55.2727] },
  { id: 'jvc', name: 'Jumeirah Village Circle (JVC)', subtitle: 'Value-focused homes with strong ROI', center: [25.0606, 55.2056] },
  { id: 'dubai-hills', name: 'Dubai Hills Estate', subtitle: 'Green communities & family-friendly villas', center: [25.0669, 55.2343] },
]

const defaultLocationsListBuy = [
  'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR (Jumeirah Beach Residence)',
  'Business Bay', 'Arabian Ranches', 'Dubai Hills Estate', 'Jumeirah Village Circle',
  'Dubai Creek Harbour', 'Emaar Beachfront',
]
const defaultLocationsListRent = [
  'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR (Jumeirah Beach Residence)',
  'Business Bay', 'Arabian Ranches', 'Dubai Hills Estate', 'Jumeirah Village Circle',
  'Dubai Creek Harbour', 'Emaar Beachfront',
]

const defaultDevelopers = [
  { id: 1, name: 'Damac', logoUrl: '', link: '' },
  { id: 2, name: 'Sobha', logoUrl: '', link: '' },
  { id: 3, name: 'Ellington', logoUrl: '', link: '' },
  { id: 4, name: 'Reef', logoUrl: '', link: '' },
  { id: 5, name: 'Imtiaz', logoUrl: '', link: '' },
  { id: 6, name: 'Wadan', logoUrl: '', link: '' },
  { id: 7, name: 'Emaar', logoUrl: '', link: '' },
  { id: 8, name: 'RAK', logoUrl: '', link: '' },
  { id: 9, name: 'Anantara', logoUrl: '', link: '' },
  { id: 10, name: 'Peace Home', logoUrl: '', link: '' },
  { id: 11, name: 'Samana', logoUrl: '', link: '' },
  { id: 12, name: 'Aldar', logoUrl: '', link: '' },
  { id: 13, name: 'Meraas', logoUrl: '', link: '' },
  { id: 14, name: 'Nakheel', logoUrl: '', link: '' },
]

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (_) {}
}

const getDefaultState = () => ({
  properties: [],
  testimonials: [],
  areas: defaultAreas,
  locationsListBuy: defaultLocationsListBuy,
  locationsListRent: defaultLocationsListRent,
  featuredPropertyIds: [],
  contact: defaultContact,
  socialLinks: defaultSocial,
  developers: [...defaultDevelopers],
})

const DashboardStoreContext = createContext(null)

export function DashboardStoreProvider({ children }) {
  const [state, setState] = useState(() => {
    if (useApi()) return getDefaultState()
    const stored = loadFromStorage()
    if (stored) return { ...getDefaultState(), ...stored }
    return getDefaultState()
  })

  useEffect(() => {
    if (useApi()) {
      getSiteData()
        .then((data) => {
          setState((prev) => ({
            ...prev,
            properties: data.properties ?? prev.properties,
            testimonials: data.testimonials ?? prev.testimonials,
            areas: data.areas ?? prev.areas,
            locationsListBuy: data.locationsBuy ?? prev.locationsListBuy,
            locationsListRent: data.locationsRent ?? prev.locationsListRent,
            contact: data.contact ?? prev.contact,
            socialLinks: data.socialLinks ?? prev.socialLinks,
            featuredPropertyIds: data.featuredPropertyIds ?? prev.featuredPropertyIds,
            developers: data.developers ?? prev.developers,
          }))
        })
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!useApi()) saveToStorage(state)
  }, [state])

  const update = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setProperties = useCallback((list) => update('properties', list), [update])
  const setTestimonials = useCallback((list) => update('testimonials', list), [update])
  const setAreas = useCallback((list) => update('areas', list), [update])
  const setLocationsListBuy = useCallback((list) => update('locationsListBuy', list), [update])
  const setLocationsListRent = useCallback((list) => update('locationsListRent', list), [update])
  const setFeaturedPropertyIds = useCallback((ids) => update('featuredPropertyIds', ids), [update])
  const setContact = useCallback((data) => update('contact', data), [update])
  const setSocialLinks = useCallback((list) => update('socialLinks', list), [update])
  const setDevelopers = useCallback((list) => update('developers', list), [update])

  const resetToDefaults = useCallback(() => {
    setState(getDefaultState())
  }, [])

  const value = useMemo(() => ({
    ...state,
    setProperties,
    setTestimonials,
    setAreas,
    setLocationsListBuy,
    setLocationsListRent,
    setFeaturedPropertyIds,
    setContact,
    setSocialLinks,
    setDevelopers,
    resetToDefaults,
    update,
  }), [state, setProperties, setTestimonials, setAreas, setLocationsListBuy, setLocationsListRent, setFeaturedPropertyIds, setContact, setSocialLinks, setDevelopers, resetToDefaults, update])

  return (
    <DashboardStoreContext.Provider value={value}>
      {children}
    </DashboardStoreContext.Provider>
  )
}

export function useDashboardStore() {
  const ctx = useContext(DashboardStoreContext)
  if (!ctx) throw new Error('useDashboardStore must be used within DashboardStoreProvider')
  return ctx
}

/** Use in main site: returns CMS data when available, never throws. */
export function useSiteData() {
  const ctx = useContext(DashboardStoreContext)
  return ctx || null
}

export function getStoredCMS() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (_) {
    return null
  }
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(AUTH_KEY, token)
  else localStorage.removeItem(AUTH_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_KEY)
}

export function isAuthenticated() {
  return !!getAuthToken()
}
