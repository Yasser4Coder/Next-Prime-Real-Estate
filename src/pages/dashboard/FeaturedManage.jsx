import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import * as api from '../../api/client'

const useApi = () => !!import.meta.env.VITE_API_URL

export default function FeaturedManage() {
  const { properties: storeProperties, featuredPropertyIds: storeFeatured, setFeaturedPropertyIds } = useDashboardStore()
  const [properties, setPropertiesState] = useState([])
  const [featuredPropertyIds, setFeaturedState] = useState([])
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)
  const [saving, setSaving] = useState(false)

  const propertiesList = useApi() ? properties : storeProperties
  const featured = useApi() ? featuredPropertyIds : storeFeatured

  const fetchData = async () => {
    if (!useApi()) return
    setLoading(true)
    try {
      const [props, ids] = await Promise.all([api.getProperties(), api.getFeatured()])
      setPropertiesState(Array.isArray(props) ? props : [])
      setFeaturedState(Array.isArray(ids) ? ids : [])
    } catch (_) {
      setPropertiesState([])
      setFeaturedState([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useApi()) fetchData()
    else {
      setPropertiesState(storeProperties)
      setFeaturedState(storeFeatured)
    }
  }, [])

  useEffect(() => {
    if (!useApi()) {
      setPropertiesState(storeProperties)
      setFeaturedState(storeFeatured)
    }
  }, [storeProperties, storeFeatured])

  const toggle = async (id) => {
    const numId = Number(id)
    const next = featured.includes(numId)
      ? featured.filter((i) => i !== numId)
      : [...featured, numId].sort((a, b) => a - b)

    if (useApi()) {
      setSaving(true)
      try {
        await api.setFeatured(next)
        setFeaturedState(next)
        toast.success('Featured properties updated')
      } catch (err) {
        toast.error(err.message || 'Failed to update')
      } finally {
        setSaving(false)
      }
    } else {
      setFeaturedPropertyIds(next)
      toast.success('Featured properties updated')
    }
  }

  if (loading) return <div className="p-6 text-[#717171]">Loading…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Featured Properties</h1>
      <p className="text-sm text-[#717171] mb-4">Select which properties appear in the Featured section on the home page. If none are selected, the section can fall back to the first properties in the list.</p>
      <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
        <div className="p-4 border-b border-[#e1e1e1]">
          {featured.length} selected {saving && '(saving…)'}
        </div>
        {propertiesList.length === 0 ? (
          <div className="p-6 text-center text-[#717171]">Add properties first in the Properties section.</div>
        ) : (
          <ul className="divide-y divide-[#e1e1e1]">
            {propertiesList.map((p) => {
              const isFeatured = featured.includes(p.id)
              return (
                <li key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#262626]">{p.title}</p>
                    <p className="text-sm text-[#717171]">{p.type} · {p.location} · {p.price?.toLocaleString?.() ?? p.price} AED</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isFeatured} onChange={() => toggle(p.id)} disabled={saving} className="rounded border-[#e1e1e1] text-[#B8862E] focus:ring-[#B8862E]" />
                    <span className="text-sm">Featured</span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
