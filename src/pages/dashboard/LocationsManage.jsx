import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import * as api from '../../api/client'

const useApi = () => !!import.meta.env.VITE_API_URL

const DEFAULT_BUY = [
  'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR (Jumeirah Beach Residence)',
  'Business Bay', 'Arabian Ranches', 'Dubai Hills Estate', 'Jumeirah Village Circle',
  'Dubai Creek Harbour', 'Emaar Beachfront',
]
const DEFAULT_RENT = [
  'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR (Jumeirah Beach Residence)',
  'Business Bay', 'Arabian Ranches', 'Dubai Hills Estate', 'Jumeirah Village Circle',
  'Dubai Creek Harbour', 'Emaar Beachfront',
]
const DEFAULT_OFF_PLAN = [
  'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR (Jumeirah Beach Residence)',
  'Business Bay', 'Arabian Ranches', 'Dubai Hills Estate', 'Jumeirah Village Circle',
  'Dubai Creek Harbour', 'Emaar Beachfront',
]

export default function LocationsManage() {
  const {
    areas: storeAreas,
    setAreas,
    locationsListBuy: storeLocationsBuy,
    locationsListRent: storeLocationsRent,
    locationsListOffPlan: storeLocationsOffPlan,
    setLocationsListBuy,
    setLocationsListRent,
    setLocationsListOffPlan,
  } = useDashboardStore()
  const [areas, setAreasState] = useState([])
  const [locationsBuy, setLocationsBuyState] = useState([])
  const [locationsRent, setLocationsRentState] = useState([])
  const [locationsOffPlan, setLocationsOffPlanState] = useState([])
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)
  const [tab, setTab] = useState('areas')
  const [listTab, setListTab] = useState('buy') // 'buy' | 'rent' | 'off-plan' under Search dropdown list
  const [editingArea, setEditingArea] = useState(null)
  const [areaForm, setAreaForm] = useState({ name: '', subtitle: '', lat: '', lng: '' })
  const [locationNameBuy, setLocationNameBuy] = useState('')
  const [locationNameRent, setLocationNameRent] = useState('')
  const [locationNameOffPlan, setLocationNameOffPlan] = useState('')
  const [saving, setSaving] = useState(false)

  const areasList = useApi() ? areas : storeAreas
  const buyList = useApi() ? locationsBuy : (storeLocationsBuy?.length ? storeLocationsBuy : DEFAULT_BUY)
  const rentList = useApi() ? locationsRent : (storeLocationsRent?.length ? storeLocationsRent : DEFAULT_RENT)
  const offPlanList = useApi() ? locationsOffPlan : (storeLocationsOffPlan?.length ? storeLocationsOffPlan : DEFAULT_OFF_PLAN)

  const fetchAreas = async () => {
    try {
      const data = await api.getAreas()
      setAreasState(Array.isArray(data) ? data : [])
    } catch (_) {
      setAreasState([])
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await api.getLocationsList()
      const buy = Array.isArray(data?.buy) ? data.buy : []
      const rent = Array.isArray(data?.rent) ? data.rent : []
      const offPlan = Array.isArray(data?.offPlan) ? data.offPlan : []
      setLocationsBuyState(buy)
      setLocationsRentState(rent)
      setLocationsOffPlanState(offPlan)
      // Update DashboardStore so Header dropdowns show correct lists (off-plan in Off Plan, not Buy)
      setLocationsListBuy(buy)
      setLocationsListRent(rent)
      setLocationsListOffPlan(offPlan)
    } catch (_) {
      setLocationsBuyState([])
      setLocationsRentState([])
      setLocationsOffPlanState([])
    }
  }

  useEffect(() => {
    if (useApi()) {
      setLoading(true)
      Promise.all([fetchAreas(), fetchLocations()]).finally(() => setLoading(false))
    } else {
      setAreasState(storeAreas)
      setLocationsBuyState(storeLocationsBuy?.length ? storeLocationsBuy : DEFAULT_BUY)
      setLocationsRentState(storeLocationsRent?.length ? storeLocationsRent : DEFAULT_RENT)
      setLocationsOffPlanState(storeLocationsOffPlan?.length ? storeLocationsOffPlan : DEFAULT_OFF_PLAN)
    }
  }, [])

  useEffect(() => {
    if (!useApi()) {
      setAreasState(storeAreas)
      setLocationsBuyState(storeLocationsBuy?.length ? storeLocationsBuy : DEFAULT_BUY)
      setLocationsRentState(storeLocationsRent?.length ? storeLocationsRent : DEFAULT_RENT)
      setLocationsOffPlanState(storeLocationsOffPlan?.length ? storeLocationsOffPlan : DEFAULT_OFF_PLAN)
    }
  }, [storeAreas, storeLocationsBuy, storeLocationsRent, storeLocationsOffPlan])

  const handleSaveArea = async (e) => {
    e.preventDefault()
    const payload = { name: areaForm.name, subtitle: areaForm.subtitle, lat: areaForm.lat, lng: areaForm.lng }
    if (useApi()) {
      setSaving(true)
      try {
        if (editingArea) {
          await api.updateArea(editingArea.id, payload)
        } else {
          await api.createArea(payload)
        }
        await fetchAreas()
        setAreaForm({ name: '', subtitle: '', lat: '', lng: '' })
        setEditingArea(null)
        toast.success(editingArea ? 'Area updated' : 'Area added')
      } catch (err) {
        toast.error(err.message || 'Failed to save')
      } finally {
        setSaving(false)
      }
    } else {
      const id = editingArea?.id ?? areaForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const full = { id, name: areaForm.name, subtitle: areaForm.subtitle, center: [Number(areaForm.lat) || 25.2, Number(areaForm.lng) || 55.3] }
      if (editingArea) setAreas(storeAreas.map((a) => (a.id === editingArea.id ? full : a)))
      else setAreas([...storeAreas, full])
      setAreaForm({ name: '', subtitle: '', lat: '', lng: '' })
      setEditingArea(null)
      toast.success(editingArea ? 'Area updated' : 'Area added')
    }
  }

  const handleEditArea = (a) => {
    setEditingArea(a)
    setAreaForm({ name: a.name, subtitle: a.subtitle || '', lat: a.center?.[0] ?? '', lng: a.center?.[1] ?? '' })
  }

  const handleDeleteArea = async (id) => {
    if (!window.confirm('Remove this area?')) return
    if (useApi()) {
      try {
        await api.deleteArea(id)
        await fetchAreas()
        toast.success('Area removed')
      } catch (err) {
        toast.error(err.message || 'Failed to delete')
      }
    } else {
      setAreas(storeAreas.filter((a) => a.id !== id))
      toast.success('Area removed')
    }
  }

  const handleAddLocation = async (e, purpose) => {
    e.preventDefault()
    const name = (purpose === 'rent' ? locationNameRent : purpose === 'off-plan' ? locationNameOffPlan : locationNameBuy).trim()
    if (!name) return
    if (useApi()) {
      setSaving(true)
      try {
        await api.addLocation(name, purpose)
        await fetchLocations()
        if (purpose === 'rent') setLocationNameRent('')
        else if (purpose === 'off-plan') setLocationNameOffPlan('')
        else setLocationNameBuy('')
        toast.success('Location added')
      } catch (err) {
        toast.error(err.message || 'Failed to add')
      } finally {
        setSaving(false)
      }
    } else {
      if (purpose === 'rent') {
        if (!rentList.includes(name)) {
          setLocationsListRent([...(storeLocationsRent?.length ? storeLocationsRent : DEFAULT_RENT), name])
          setLocationNameRent('')
          toast.success('Location added')
        }
      } else if (purpose === 'off-plan') {
        if (!offPlanList.includes(name)) {
          setLocationsListOffPlan([...(storeLocationsOffPlan?.length ? storeLocationsOffPlan : DEFAULT_OFF_PLAN), name])
          setLocationNameOffPlan('')
          toast.success('Location added')
        }
      } else {
        if (!buyList.includes(name)) {
          setLocationsListBuy([...(storeLocationsBuy?.length ? storeLocationsBuy : DEFAULT_BUY), name])
          setLocationNameBuy('')
          toast.success('Location added')
        }
      }
    }
  }

  const handleRemoveLocation = async (name, purpose) => {
    if (useApi()) {
      try {
        await api.removeLocation(name, purpose)
        await fetchLocations()
        toast.success('Location removed')
      } catch (err) {
        toast.error(err.message || 'Failed to remove')
      }
    } else {
      if (purpose === 'rent') {
        setLocationsListRent((storeLocationsRent || DEFAULT_RENT).filter((l) => l !== name))
      } else if (purpose === 'off-plan') {
        setLocationsListOffPlan((storeLocationsOffPlan || DEFAULT_OFF_PLAN).filter((l) => l !== name))
      } else {
        setLocationsListBuy((storeLocationsBuy || DEFAULT_BUY).filter((l) => l !== name))
      }
      toast.success('Location removed')
    }
  }

  if (loading) return <div className="p-6 text-[#717171]">Loading…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Locations / Areas We Serve</h1>
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setTab('areas')} className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer ${tab === 'areas' ? 'bg-[#B8862E] text-white' : 'bg-white border border-[#e1e1e1]'}`}>
          Map areas
        </button>
        <button type="button" onClick={() => setTab('list')} className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer ${tab === 'list' ? 'bg-[#B8862E] text-white' : 'bg-white border border-[#e1e1e1]'}`}>
          Search dropdown list
        </button>
      </div>

      {tab === 'areas' && (
        <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden mb-6">
          <div className="p-4 border-b border-[#e1e1e1]">Areas shown on the Locations section (with map)</div>
          <form onSubmit={handleSaveArea} className="p-4 border-b border-[#e1e1e1] bg-[#fafafa] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" placeholder="Area name" value={areaForm.name} onChange={(e) => setAreaForm((f) => ({ ...f, name: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" required />
            <input type="text" placeholder="Subtitle" value={areaForm.subtitle} onChange={(e) => setAreaForm((f) => ({ ...f, subtitle: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
            <input type="text" placeholder="Latitude" value={areaForm.lat} onChange={(e) => setAreaForm((f) => ({ ...f, lat: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
            <input type="text" placeholder="Longitude" value={areaForm.lng} onChange={(e) => setAreaForm((f) => ({ ...f, lng: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer disabled:opacity-70">{editingArea ? 'Update' : 'Add'}</button>
              {editingArea && <button type="button" onClick={() => { setEditingArea(null); setAreaForm({ name: '', subtitle: '', lat: '', lng: '' }); }} className="ml-2 px-4 py-2 rounded-xl border border-[#e1e1e1] text-sm cursor-pointer">Cancel</button>}
            </div>
          </form>
          <ul className="divide-y divide-[#e1e1e1]">
            {areasList.map((a) => (
              <li key={a.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-[#717171]">{a.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEditArea(a)} className="text-[#B8862E] hover:underline text-sm cursor-pointer">Edit</button>
                  <button type="button" onClick={() => handleDeleteArea(a.id)} className="text-red-600 hover:underline text-sm cursor-pointer">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'list' && (
        <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
          <div className="p-4 border-b border-[#e1e1e1]">Locations in hero search & header dropdown — separate for Buy and Rent</div>
          <div className="flex gap-2 p-4 border-b border-[#e1e1e1] bg-[#fafafa]">
            <button type="button" onClick={() => setListTab('buy')} className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer ${listTab === 'buy' ? 'bg-[#B8862E] text-white' : 'bg-white border border-[#e1e1e1]'}`}>
              Locations for Buy
            </button>
            <button type="button" onClick={() => setListTab('rent')} className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer ${listTab === 'rent' ? 'bg-[#B8862E] text-white' : 'bg-white border border-[#e1e1e1]'}`}>
              Locations for Rent
            </button>
            <button type="button" onClick={() => setListTab('off-plan')} className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer ${listTab === 'off-plan' ? 'bg-[#B8862E] text-white' : 'bg-white border border-[#e1e1e1]'}`}>
              Locations for Off Plan
            </button>
          </div>
          {listTab === 'buy' && (
            <>
              <form onSubmit={(e) => handleAddLocation(e, 'buy')} className="p-4 border-b border-[#e1e1e1] flex gap-2">
                <input type="text" placeholder="Add location for Buy" value={locationNameBuy} onChange={(e) => setLocationNameBuy(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-[#e1e1e1]" />
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium cursor-pointer">Add</button>
              </form>
              <ul className="p-4 flex flex-wrap gap-2">
                {buyList.map((name) => (
                  <li key={name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f5f5f5] text-sm">
                    {name}
                    <button type="button" onClick={() => handleRemoveLocation(name, 'buy')} className="text-red-600 hover:underline cursor-pointer">×</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {listTab === 'rent' && (
            <>
              <form onSubmit={(e) => handleAddLocation(e, 'rent')} className="p-4 border-b border-[#e1e1e1] flex gap-2">
                <input type="text" placeholder="Add location for Rent" value={locationNameRent} onChange={(e) => setLocationNameRent(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-[#e1e1e1]" />
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium cursor-pointer">Add</button>
              </form>
              <ul className="p-4 flex flex-wrap gap-2">
                {rentList.map((name) => (
                  <li key={name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f5f5f5] text-sm">
                    {name}
                    <button type="button" onClick={() => handleRemoveLocation(name, 'rent')} className="text-red-600 hover:underline cursor-pointer">×</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {listTab === 'off-plan' && (
            <>
              <form onSubmit={(e) => handleAddLocation(e, 'off-plan')} className="p-4 border-b border-[#e1e1e1] flex gap-2">
                <input type="text" placeholder="Add location for Off Plan" value={locationNameOffPlan} onChange={(e) => setLocationNameOffPlan(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-[#e1e1e1]" />
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium cursor-pointer">Add</button>
              </form>
              <ul className="p-4 flex flex-wrap gap-2">
                {offPlanList.map((name) => (
                  <li key={name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f5f5f5] text-sm">
                    {name}
                    <button type="button" onClick={() => handleRemoveLocation(name, 'off-plan')} className="text-red-600 hover:underline cursor-pointer">×</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
