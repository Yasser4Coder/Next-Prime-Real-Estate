import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import * as api from '../../api/client'

const TYPES = ['Villa', 'Apartment', 'Townhouse', 'Penthouse', 'Studio', 'Duplex']
const PURPOSES = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'off-plan', label: 'Off Plan' },
]
const useApi = () => !!import.meta.env.VITE_API_URL

export default function PropertiesManage() {
  const { properties: storeProperties, setProperties } = useDashboardStore()
  const [properties, setPropertiesState] = useState([])
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)
  const [editing, setEditing] = useState(null)
  const [showFormView, setShowFormView] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', image: '', bedrooms: '', bathrooms: '', type: 'Villa', price: '', priceDisplay: '', location: '', purpose: 'buy',
    photos: '', addressLine1: '', addressCity: 'Dubai', addressCountry: 'UAE', addressLat: '', addressLng: '',
    overviewAreaSqft: '', overviewAreaText: '', overviewStatus: '', overviewYearBuilt: '', overviewGarages: '', overviewBuildingConfiguration: '', overviewProjectType: '',
    highlights: '',
    agentName: '', agentPhone: '', agentEmail: '',
    floorPlanFile: '', brochureFile: '',
  })
  const [residenceOptionsList, setResidenceOptionsList] = useState([])
  const [featuresList, setFeaturesList] = useState([])
  const [floorPlansList, setFloorPlansList] = useState([])
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([])
  const [mainImageFile, setMainImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [mainPreview, setMainPreview] = useState(null)
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [floorPlanUpload, setFloorPlanUpload] = useState(null)
  const [brochureUpload, setBrochureUpload] = useState(null)

  const tryParseJson = (v, fallback) => {
    if (v == null) return fallback
    if (typeof v === 'string' && v.trim()) {
      try {
        const parsed = JSON.parse(v.trim())
        return parsed
      } catch {
        return fallback
      }
    }
    return v
  }

  const parseItems = (str) => (str && str.trim() ? str.split(/[,،]/).map((s) => s.trim()).filter(Boolean) : [])

  const toPhotoUrls = (photos) => {
    if (Array.isArray(photos)) return photos.filter((u) => typeof u === 'string')
    if (typeof photos === 'string' && photos.trim()) {
      try {
        const parsed = JSON.parse(photos.trim())
        return Array.isArray(parsed) ? parsed.filter((u) => typeof u === 'string') : [photos.trim()]
      } catch {
        return [photos.trim()]
      }
    }
    return []
  }

  const list = useApi() ? properties : storeProperties

  const getPropertyImage = (p) => {
    if (p.image && typeof p.image === 'string') return p.image
    if (Array.isArray(p.photos) && p.photos.length) return typeof p.photos[0] === 'string' ? p.photos[0] : null
    return null
  }

  useEffect(() => {
    if (!mainImageFile) {
      setMainPreview(null)
      return
    }
    const url = URL.createObjectURL(mainImageFile)
    setMainPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [mainImageFile])

  useEffect(() => {
    if (!galleryFiles.length) {
      setGalleryPreviews([])
      return
    }
    const urls = galleryFiles.map((f) => URL.createObjectURL(f))
    setGalleryPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [galleryFiles])

  const galleryInputRef = React.useRef(null)

  const handleGalleryChange = (e) => {
    const added = Array.from(e.target.files || [])
    if (added.length) {
      setGalleryFiles((prev) => {
        const next = [...prev, ...added].slice(0, 10)
        if (next.length >= 10) toast('Max 10 gallery images.', { icon: 'ℹ️' })
        return next
      })
    }
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const fetchList = async () => {
    if (!useApi()) return
    setLoading(true)
    try {
      const data = await api.getProperties()
      setPropertiesState(Array.isArray(data) ? data : [])
    } catch (_) {
      setPropertiesState([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useApi()) fetchList()
  }, [])

  useEffect(() => {
    if (!useApi()) setPropertiesState(storeProperties)
  }, [storeProperties])

  const resetForm = () => {
    setShowFormView(false)
    setForm({
      title: '', description: '', image: '', bedrooms: '', bathrooms: '', type: 'Villa', price: '', priceDisplay: '', location: '', purpose: 'buy',
      photos: '', addressLine1: '', addressCity: 'Dubai', addressCountry: 'UAE', addressLat: '', addressLng: '',
      overviewAreaSqft: '', overviewAreaText: '', overviewStatus: '', overviewYearBuilt: '', overviewGarages: '', overviewBuildingConfiguration: '', overviewProjectType: '',
      highlights: '',
      agentName: '', agentPhone: '', agentEmail: '',
      floorPlanFile: '', brochureFile: '',
    })
    setResidenceOptionsList([])
    setFeaturesList([])
    setFloorPlansList([])
    setExistingGalleryUrls([])
    setMainImageFile(null)
    setGalleryFiles([])
    setMainPreview(null)
    setGalleryPreviews([])
    setFloorPlanUpload(null)
    setBrochureUpload(null)
    setEditing(null)
  }

  const buildResidenceOptions = () =>
    residenceOptionsList
      .filter((r) => r.label?.trim())
      .map((r) => ({ label: r.label.trim(), items: parseItems(r.items) }))
      .filter((r) => r.items.length > 0)

  const buildFeatures = () => {
    const obj = {}
    featuresList.forEach((f) => {
      const key = f.group?.trim()
      if (!key) return
      const items = parseItems(f.items)
      if (items.length) obj[key] = items
    })
    return Object.keys(obj).length ? obj : null
  }

  const buildFloorPlans = () =>
    floorPlansList
      .filter((fp) => fp.title?.trim() && fp.image?.trim())
      .map((fp, i) => ({ id: fp.id || `fp-${i + 1}`, title: fp.title.trim(), image: fp.image.trim() }))

  const parsePhotoStr = (str) => (str && str.trim() ? str.trim().split(/\n/).map((s) => s.trim()).filter(Boolean) : [])

  const getFullPhotoList = () => {
    const main = form.image?.trim() || ''
    const fromText = parsePhotoStr(form.photos)
    if (editing) return [main, ...existingGalleryUrls, ...fromText].filter(Boolean)
    return [main, ...fromText].filter(Boolean)
  }

  const buildPayload = () => {
    const imageUrl = form.image?.trim() || '/logo-icon.PNG'
    const fullPhotoStr = getFullPhotoList().join('\n')
    const overview = {}
    if (form.overviewAreaSqft !== '') overview.areaSqft = Number(form.overviewAreaSqft)
    if (form.overviewAreaText?.trim()) overview.areaText = form.overviewAreaText.trim()
    if (form.overviewStatus.trim()) overview.status = form.overviewStatus.trim()
    if (form.overviewYearBuilt !== '') overview.yearBuilt = form.overviewYearBuilt.trim()
    if (form.overviewGarages !== '') overview.garages = form.overviewGarages.trim()
    if (form.overviewBuildingConfiguration?.trim()) overview.buildingConfiguration = form.overviewBuildingConfiguration.trim()
    if (form.overviewProjectType?.trim()) overview.projectType = form.overviewProjectType.trim()
    const agent = form.agentPhone.trim() ? { name: form.agentName.trim() || undefined, phone: form.agentPhone.trim(), email: form.agentEmail.trim() || undefined } : null
    const residenceOptions = buildResidenceOptions()
    const features = buildFeatures()
    const floorPlans = buildFloorPlans()
    return {
      title: form.title,
      description: form.description,
      image: imageUrl,
      photos: fullPhotoStr,
      floorPlanFile: form.floorPlanFile?.trim() || null,
      brochureFile: form.brochureFile?.trim() || null,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      type: form.type,
      price: form.price,
      priceDisplay: form.priceDisplay?.trim() || null,
      location: form.location,
      purpose: form.purpose,
      addressLine1: form.addressLine1,
      addressCity: form.addressCity,
      addressCountry: form.addressCountry,
      addressLat: form.addressLat,
      addressLng: form.addressLng,
      overview: Object.keys(overview).length ? overview : null,
      residenceOptions: residenceOptions.length ? residenceOptions : null,
      highlights: form.highlights.trim() ? form.highlights.trim().split(/\n/).map((s) => s.trim()).filter(Boolean) : [],
      features,
      floorPlans: floorPlans.length ? floorPlans : null,
      agent,
    }
  }

  const buildFormData = () => {
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('image', form.image?.trim() || '')
    fd.append('photos', getFullPhotoList().join('\n'))
    fd.append('location', form.location || '')
    fd.append('price', form.price ?? '')
    fd.append('priceDisplay', form.priceDisplay ?? '')
    fd.append('type', form.type || 'Villa')
    fd.append('purpose', form.purpose || 'buy')
    fd.append('bedrooms', form.bedrooms ?? '')
    fd.append('bathrooms', form.bathrooms ?? '')
    fd.append('addressLine1', form.addressLine1 || '')
    fd.append('addressCity', form.addressCity || 'Dubai')
    fd.append('addressCountry', form.addressCountry || 'UAE')
    fd.append('addressLat', form.addressLat || '')
    fd.append('addressLng', form.addressLng || '')
    fd.append('overviewAreaSqft', form.overviewAreaSqft ?? '')
    fd.append('overviewAreaText', form.overviewAreaText ?? '')
    fd.append('overviewStatus', form.overviewStatus ?? '')
    fd.append('overviewYearBuilt', form.overviewYearBuilt ?? '')
    fd.append('overviewGarages', form.overviewGarages ?? '')
    fd.append('overviewBuildingConfiguration', form.overviewBuildingConfiguration ?? '')
    fd.append('overviewProjectType', form.overviewProjectType ?? '')
    const resOpts = buildResidenceOptions()
    const feats = buildFeatures()
    const fps = buildFloorPlans()
    fd.append('residenceOptions', resOpts.length ? JSON.stringify(resOpts) : '')
    fd.append('highlights', form.highlights ?? '')
    fd.append('features', feats ? JSON.stringify(feats) : '')
    fd.append('floorPlans', fps.length ? JSON.stringify(fps) : '')
    fd.append('agentName', form.agentName ?? '')
    fd.append('agentPhone', form.agentPhone ?? '')
    fd.append('agentEmail', form.agentEmail ?? '')
    if (floorPlanUpload) fd.append('floorPlanFile', floorPlanUpload)
    else fd.append('floorPlanFile', form.floorPlanFile?.trim() ?? '')
    if (brochureUpload) fd.append('brochureFile', brochureUpload)
    else fd.append('brochureFile', form.brochureFile?.trim() ?? '')
    if (mainImageFile) {
      fd.set('image', mainImageFile)
    }
    galleryFiles.forEach((file) => fd.append('photos', file))
    return fd
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = buildPayload()
    if (useApi()) {
      setSaving(true)
      try {
        const hasFiles = mainImageFile || galleryFiles.length > 0 || floorPlanUpload || brochureUpload
        // Always send JSON for update so bedrooms/bathrooms (e.g. "Studio – 1 – 2 – 3") always reach the server
        const body = editing ? payload : (hasFiles ? buildFormData() : payload)
        if (editing) {
          const updated = await api.updateProperty(editing.id, body)
          setPropertiesState((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...updated } : p)))
        } else {
          await api.createProperty(body)
        }
        await fetchList()
        resetForm()
        setShowFormView(false)
        toast.success(editing ? 'Property updated' : 'Property added')
      } catch (err) {
        toast.error(err.message || 'Failed to save')
      } finally {
        setSaving(false)
      }
    } else {
      toast.success(editing ? 'Property updated' : 'Property added')
      const id = editing?.id ?? Math.max(0, ...list.map((p) => p.id)) + 1
      const photoUrls = payload.photos ? payload.photos.trim().split(/\n/).map((s) => s.trim()).filter(Boolean) : []
      const full = {
        id,
        ...payload,
        image: payload.image,
        photos: photoUrls.length ? photoUrls : [payload.image],
        floorPlanFile: payload.floorPlanFile || null,
        brochureFile: payload.brochureFile || null,
        bedrooms: payload.bedrooms ?? '',
        bathrooms: payload.bathrooms ?? '',
        price: Number(payload.price) || 0,
        priceDisplay: payload.priceDisplay || null,
        address: {
          line1: payload.addressLine1?.trim() || payload.location || 'Dubai',
          city: payload.addressCity?.trim() || 'Dubai',
          country: payload.addressCountry?.trim() || 'UAE',
          lat: Number(payload.addressLat) || 25.2,
          lng: Number(payload.addressLng) || 55.3,
        },
        overview: payload.overview || null,
        residenceOptions: payload.residenceOptions || null,
        highlights: Array.isArray(payload.highlights) ? payload.highlights : (payload.highlights ? [payload.highlights] : []),
        features: payload.features || null,
        floorPlans: payload.floorPlans || null,
        agent: payload.agent || null,
      }
      if (editing) setProperties(list.map((p) => (p.id === id ? full : p)))
      else setProperties([...list, full])
      resetForm()
      setShowFormView(false)
    }
  }

  const handleEdit = (p) => {
    setShowFormView(true)
    setEditing(p)
    setMainImageFile(null)
    setGalleryFiles([])
    const photoUrls = toPhotoUrls(p.photos)
    const mainImage = typeof p.image === 'string' && p.image.trim() ? p.image.trim() : (photoUrls[0] || '')
    const galleryOnly = photoUrls.filter((u) => u !== mainImage)
    setExistingGalleryUrls(galleryOnly)
    const addr = p.address && typeof p.address === 'object' ? p.address : tryParseJson(p.address, {})
    const ov = (p.overview && typeof p.overview === 'object') ? p.overview : tryParseJson(p.overview, {}) || {}
    const ag = (p.agent && typeof p.agent === 'object') ? p.agent : tryParseJson(p.agent, {})
    const highlightsArr = Array.isArray(p.highlights) ? p.highlights : (tryParseJson(p.highlights, null) || [])
    const highlightsStr = Array.isArray(highlightsArr) ? highlightsArr.join('\n') : (p.highlights || '')
    const resOpts = Array.isArray(p.residenceOptions) ? p.residenceOptions : (tryParseJson(p.residenceOptions, null) || [])
    const feats = (p.features && typeof p.features === 'object' && !Array.isArray(p.features)) ? p.features : tryParseJson(p.features, null)
    const fpList = Array.isArray(p.floorPlans) ? p.floorPlans : (tryParseJson(p.floorPlans, null) || [])
    // Support both camelCase and snake_case from API; coerce numbers to string for inputs
    const priceDisplay = p.priceDisplay ?? p.price_display ?? ''
    const bedroomsStr = p.bedrooms != null && p.bedrooms !== '' ? String(p.bedrooms) : ''
    const bathroomsStr = p.bathrooms != null && p.bathrooms !== '' ? String(p.bathrooms) : ''
    const priceStr = p.price != null && p.price !== '' ? String(p.price) : ''
    setForm({
      title: p.title ?? '',
      description: p.description || '',
      image: mainImage,
      bedrooms: bedroomsStr,
      bathrooms: bathroomsStr,
      type: p.type || 'Villa',
      price: priceStr,
      priceDisplay: typeof priceDisplay === 'string' ? priceDisplay : (priceDisplay != null ? String(priceDisplay) : ''),
      location: p.location || '',
      purpose: p.purpose || 'buy',
      photos: '',
      addressLine1: addr.line1 || '',
      addressCity: addr.city || 'Dubai',
      addressCountry: addr.country || 'UAE',
      addressLat: addr.lat ?? '',
      addressLng: addr.lng ?? '',
      overviewAreaSqft: ov.areaSqft != null && ov.areaSqft !== '' ? String(ov.areaSqft) : (ov.area_sqft != null ? String(ov.area_sqft) : ''),
      overviewAreaText: ov.areaText ?? ov.area_text ?? '',
      overviewStatus: ov.status ?? '',
      overviewYearBuilt: ov.yearBuilt != null && ov.yearBuilt !== '' ? String(ov.yearBuilt) : (ov.year_built != null ? String(ov.year_built) : ''),
      overviewGarages: ov.garages != null && ov.garages !== '' ? String(ov.garages) : (ov.garages != null ? String(ov.garages) : ''),
      overviewBuildingConfiguration: ov.buildingConfiguration ?? ov.building_configuration ?? '',
      overviewProjectType: ov.projectType ?? ov.project_type ?? '',
      highlights: highlightsStr,
      agentName: ag.name ?? '',
      agentPhone: ag.phone ?? '',
      agentEmail: ag.email ?? '',
      floorPlanFile: (p.floorPlanFile ?? p.floor_plan_file) && typeof (p.floorPlanFile ?? p.floor_plan_file) === 'string' ? (p.floorPlanFile ?? p.floor_plan_file) : '',
      brochureFile: (p.brochureFile ?? p.brochure_file) && typeof (p.brochureFile ?? p.brochure_file) === 'string' ? (p.brochureFile ?? p.brochure_file) : '',
    })
    setFloorPlanUpload(null)
    setBrochureUpload(null)
    setResidenceOptionsList(Array.isArray(resOpts) && resOpts.length
      ? resOpts.map((r) => ({ label: r.label || '', items: Array.isArray(r.items) ? r.items.join(', ') : (r.items || '') }))
      : [])
    setFeaturesList(feats && typeof feats === 'object' && !Array.isArray(feats) && Object.keys(feats).length
      ? Object.entries(feats).map(([group, items]) => ({ group, items: Array.isArray(items) ? items.join(', ') : (items || '') }))
      : [])
    setFloorPlansList(Array.isArray(fpList) && fpList.length
      ? fpList.map((fp) => ({ id: fp.id, title: fp.title || '', image: fp.image || '' }))
      : [])
  }

  const removeExistingPhoto = (index) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return
    if (useApi()) {
      try {
        await api.deleteProperty(id)
        await fetchList()
        toast.success('Property deleted')
      } catch (err) {
        toast.error(err.message || 'Failed to delete')
      }
    } else {
      setProperties(list.filter((p) => p.id !== id))
      toast.success('Property deleted')
    }
  }

  if (loading) return <div className="p-6 text-[#717171]">Loading properties…</div>

  const openAddForm = () => {
    setEditing(null)
    setForm({ title: '', description: '', image: '', bedrooms: '', bathrooms: '', type: 'Villa', price: '', priceDisplay: '', location: '', purpose: 'buy', photos: '', addressLine1: '', addressCity: 'Dubai', addressCountry: 'UAE', addressLat: '', addressLng: '', overviewAreaSqft: '', overviewAreaText: '', overviewStatus: '', overviewYearBuilt: '', overviewGarages: '', overviewBuildingConfiguration: '', overviewProjectType: '', highlights: '', agentName: '', agentPhone: '', agentEmail: '', floorPlanFile: '', brochureFile: '' })
    setResidenceOptionsList([])
    setFeaturesList([])
    setFloorPlansList([])
    setExistingGalleryUrls([])
    setMainImageFile(null)
    setGalleryFiles([])
    setMainPreview(null)
    setGalleryPreviews([])
    setFloorPlanUpload(null)
    setBrochureUpload(null)
    setShowFormView(true)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Properties</h1>

      {showFormView ? (
        <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
          <div className="p-4 border-b border-[#e1e1e1] flex justify-between items-center bg-[#fafafa]">
            <h2 className="text-lg font-semibold text-[#262626]">{editing ? 'Edit property' : 'Add property'}</h2>
            <button type="button" onClick={() => { resetForm(); setShowFormView(false) }} className="px-4 py-2 rounded-xl border border-[#e1e1e1] text-sm text-[#262626] hover:bg-white cursor-pointer">
              ← Back to list
            </button>
          </div>
          <form onSubmit={handleSave} className="p-4 bg-[#fafafa] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="sm:col-span-2 lg:col-span-3 text-xs text-[#717171] mb-2">Max 50MB per file (images and PDFs).</p>
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" required />
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#262626] mb-1">Hero image (shown first on listing)</label>
              <p className="text-xs text-[#717171] mb-2">Upload one image (max 50MB) or paste a URL below.</p>
              <input type="text" placeholder="Paste image URL (optional)" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1] mb-2" />
              <label className="flex flex-col gap-1 cursor-pointer">
                <span className="text-xs text-[#717171]">Or upload a file</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setMainImageFile(e.target.files?.[0] || null)} className="text-sm text-[#717171] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#B8862E] file:text-white file:cursor-pointer" />
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(mainPreview || (form.image?.trim() && !mainImageFile)) && (
                  <div className="relative group">
                    <img src={mainPreview || form.image} alt="Hero" className="w-20 h-20 object-cover rounded-lg border border-[#e1e1e1]" />
                    <button type="button" onClick={() => { setForm((f) => ({ ...f, image: '' })); setMainImageFile(null) }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none opacity-90 group-hover:opacity-100" aria-label="Remove hero image (deleted from Cloudinary on save)">×</button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#262626] mb-1">Additional photos (gallery)</label>
              <p className="text-xs text-[#717171] mb-2">Upload up to 10 images (max 50MB each) and/or add URLs below (one per line). All are shown in the property gallery.</p>
              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleGalleryChange} className="w-full text-sm text-[#717171] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#B8862E] file:text-white file:cursor-pointer" />
              <div className="flex flex-wrap gap-2 mt-2">
                {existingGalleryUrls.length > 0 && existingGalleryUrls.map((url, i) => (
                  <div key={`existing-${url}-${i}`} className="relative group">
                    <img src={url} alt={`Current ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-[#e1e1e1]" />
                    <button type="button" onClick={() => removeExistingPhoto(i)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none opacity-90 group-hover:opacity-100" aria-label="Remove from Cloudinary">×</button>
                  </div>
                ))}
                {galleryPreviews.length > 0 && galleryPreviews.map((url, i) => (
                  <div key={url} className="relative group">
                    <img src={url} alt={`New ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-[#e1e1e1]" />
                    <button type="button" onClick={() => removeGalleryFile(i)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none opacity-90 group-hover:opacity-100" aria-label="Remove">×</button>
                  </div>
                ))}
              </div>
              <label className="block text-xs text-[#717171] mt-2 mb-1">Or add image URLs (one per line)</label>
              <textarea placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg" value={form.photos} onChange={(e) => setForm((f) => ({ ...f, photos: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1] text-sm" rows={2} />
              {(galleryPreviews.length > 0 || galleryFiles.length > 0) && <p className="text-xs text-[#717171] mt-1">{galleryFiles.length} new image(s) will be uploaded</p>}
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#e1e1e1] pt-4">
            <div>
              <label className="block text-sm font-medium text-[#262626] mb-1">Floor plan (PDF)</label>
              <p className="text-xs text-[#717171] mb-2">Paste a direct PDF URL or upload a file (max 50MB) for users to download.</p>
              <input type="url" placeholder="https://example.com/floor-plan.pdf" value={form.floorPlanFile} onChange={(e) => setForm((f) => ({ ...f, floorPlanFile: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1] mb-2 text-sm" />
              <input type="file" accept="application/pdf" onChange={(e) => { setFloorPlanUpload(e.target.files?.[0] || null) }} className="w-full text-sm text-[#717171] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#B8862E] file:text-white file:cursor-pointer" />
              {floorPlanUpload && <p className="text-xs text-[#717171] mt-1">New file: {floorPlanUpload.name} (will replace URL above on save)</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#262626] mb-1">Brochure (PDF)</label>
              <p className="text-xs text-[#717171] mb-2">Paste a direct PDF URL or upload a file (max 50MB) for users to download.</p>
              <input type="url" placeholder="https://example.com/brochure.pdf" value={form.brochureFile} onChange={(e) => setForm((f) => ({ ...f, brochureFile: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1] mb-2 text-sm" />
              <input type="file" accept="application/pdf" onChange={(e) => { setBrochureUpload(e.target.files?.[0] || null) }} className="w-full text-sm text-[#717171] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#B8862E] file:text-white file:cursor-pointer" />
              {brochureUpload && <p className="text-xs text-[#717171] mt-1">New file: {brochureUpload.name} (will replace URL above on save)</p>}
            </div>
          </div>
          <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" placeholder="Price (AED) – number or e.g. On Request" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" placeholder="Price display (e.g. On Request) – overrides number" value={form.priceDisplay} onChange={(e) => setForm((f) => ({ ...f, priceDisplay: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1] cursor-pointer">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.purpose} onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1] cursor-pointer">
            {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <input type="text" placeholder="Bedrooms (e.g. 3 or Studio – 1 – 2 – 3)" value={form.bedrooms} onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" placeholder="Bathrooms (e.g. 2 or 1 – 3 (حسب الوحدة))" value={form.bathrooms} onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm text-[#717171] mb-1">Description</label>
            <textarea placeholder="Property description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1]" rows={2} />
          </div>
          <input type="text" placeholder="Address line" value={form.addressLine1} onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" placeholder="City" value={form.addressCity} onChange={(e) => setForm((f) => ({ ...f, addressCity: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" placeholder="Country" value={form.addressCountry} onChange={(e) => setForm((f) => ({ ...f, addressCountry: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" inputMode="decimal" placeholder="Map lat" value={form.addressLat} onChange={(e) => setForm((f) => ({ ...f, addressLat: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <input type="text" inputMode="decimal" placeholder="Map lng" value={form.addressLng} onChange={(e) => setForm((f) => ({ ...f, addressLng: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          <div className="sm:col-span-2 lg:col-span-3 border-t border-[#e1e1e1] pt-4 mt-2">
            <p className="text-sm font-medium text-[#262626] mb-2">Overview (Property Details page)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input type="number" placeholder="Area (sqft) – single value" value={form.overviewAreaSqft} onChange={(e) => setForm((f) => ({ ...f, overviewAreaSqft: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" min="0" />
              <textarea placeholder="Area (sqft) – one line per type, e.g.&#10;Studio: 400 – 473&#10;1 Bedroom: 691 – 852&#10;2 Bedrooms: 1,063 – 1,274&#10;3 Bedrooms: 1,369 – 1,932" value={form.overviewAreaText} onChange={(e) => setForm((f) => ({ ...f, overviewAreaText: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1] sm:col-span-2 lg:col-span-3" rows={5} />
              <input type="text" placeholder="Status (e.g. Ready)" value={form.overviewStatus} onChange={(e) => setForm((f) => ({ ...f, overviewStatus: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
              <input type="text" placeholder="Year built (e.g. 2024 or Under Construction)" value={form.overviewYearBuilt} onChange={(e) => setForm((f) => ({ ...f, overviewYearBuilt: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
              <input type="text" placeholder="Garages (e.g. 2 or 1–2)" value={form.overviewGarages} onChange={(e) => setForm((f) => ({ ...f, overviewGarages: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
              <input type="text" placeholder="Building configuration (e.g. 1B + G + 3P + 20 Floors)" value={form.overviewBuildingConfiguration} onChange={(e) => setForm((f) => ({ ...f, overviewBuildingConfiguration: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1] sm:col-span-2" />
              <input type="text" placeholder="Project Type (e.g. Residential)" value={form.overviewProjectType} onChange={(e) => setForm((f) => ({ ...f, overviewProjectType: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-[#262626] mb-2">Residence options</label>
            <p className="text-xs text-[#717171] mb-2">Add groups (e.g. Villas, Apartments) and list options separated by commas.</p>
            {residenceOptionsList.map((r, i) => (
              <div key={i} className="flex flex-wrap items-start gap-2 mb-3 p-3 bg-white rounded-xl border border-[#e1e1e1]">
                <input type="text" placeholder="Group label (e.g. Villas)" value={r.label} onChange={(e) => setResidenceOptionsList((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-[#e1e1e1] text-sm" />
                <input type="text" placeholder="Options: 3 Bedroom, 4 Bedroom" value={r.items} onChange={(e) => setResidenceOptionsList((prev) => prev.map((x, j) => (j === i ? { ...x, items: e.target.value } : x)))} className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-[#e1e1e1] text-sm" />
                <button type="button" onClick={() => setResidenceOptionsList((prev) => prev.filter((_, j) => j !== i))} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm cursor-pointer" aria-label="Remove">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setResidenceOptionsList((prev) => [...prev, { label: '', items: '' }])} className="px-3 py-2 rounded-xl border border-[#B8862E] text-[#B8862E] text-sm font-medium hover:bg-[#B8862E]/10 cursor-pointer">+ Add group</button>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-[#262626] mb-1">Highlights</label>
            <p className="text-xs text-[#717171] mb-1">One bullet per line.</p>
            <textarea placeholder="Prime location&#10;Spacious living&#10;Community amenities" value={form.highlights} onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1]" rows={3} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-[#262626] mb-2">Features</label>
            <p className="text-xs text-[#717171] mb-2">Add categories (e.g. Interior, Community) and list items separated by commas.</p>
            {featuresList.map((f, i) => (
              <div key={i} className="flex flex-wrap items-start gap-2 mb-3 p-3 bg-white rounded-xl border border-[#e1e1e1]">
                <input type="text" placeholder="Category (e.g. Interior)" value={f.group} onChange={(e) => setFeaturesList((prev) => prev.map((x, j) => (j === i ? { ...x, group: e.target.value } : x)))} className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-[#e1e1e1] text-sm" />
                <input type="text" placeholder="Items: A/C, Kitchen, Pool" value={f.items} onChange={(e) => setFeaturesList((prev) => prev.map((x, j) => (j === i ? { ...x, items: e.target.value } : x)))} className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-[#e1e1e1] text-sm" />
                <button type="button" onClick={() => setFeaturesList((prev) => prev.filter((_, j) => j !== i))} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm cursor-pointer" aria-label="Remove">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setFeaturesList((prev) => [...prev, { group: '', items: '' }])} className="px-3 py-2 rounded-xl border border-[#B8862E] text-[#B8862E] text-sm font-medium hover:bg-[#B8862E]/10 cursor-pointer">+ Add category</button>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-[#262626] mb-2">Floor plans</label>
            <p className="text-xs text-[#717171] mb-2">Title and image URL for each plan.</p>
            {floorPlansList.map((fp, i) => (
              <div key={i} className="flex flex-wrap items-start gap-2 mb-3 p-3 bg-white rounded-xl border border-[#e1e1e1]">
                <input type="text" placeholder="Title (e.g. Floor Plan A)" value={fp.title} onChange={(e) => setFloorPlansList((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-[#e1e1e1] text-sm" />
                <input type="text" placeholder="Image URL" value={fp.image} onChange={(e) => setFloorPlansList((prev) => prev.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))} className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-[#e1e1e1] text-sm" />
                <button type="button" onClick={() => setFloorPlansList((prev) => prev.filter((_, j) => j !== i))} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm cursor-pointer" aria-label="Remove">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setFloorPlansList((prev) => [...prev, { title: '', image: '' }])} className="px-3 py-2 rounded-xl border border-[#B8862E] text-[#B8862E] text-sm font-medium hover:bg-[#B8862E]/10 cursor-pointer">+ Add floor plan</button>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-sm font-medium text-[#262626] mb-2">Agent (Contact on details page)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Agent name" value={form.agentName} onChange={(e) => setForm((f) => ({ ...f, agentName: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
              <input type="text" placeholder="Agent phone" value={form.agentPhone} onChange={(e) => setForm((f) => ({ ...f, agentPhone: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
              <input type="text" placeholder="Agent email" value={form.agentEmail} onChange={(e) => setForm((f) => ({ ...f, agentEmail: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
            </div>
          </div>
          <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer disabled:opacity-70">{saving ? 'Saving…' : (editing ? 'Update' : 'Add')}</button>
            <button type="button" onClick={() => { resetForm(); setShowFormView(false) }} className="px-4 py-2 rounded-xl border border-[#e1e1e1] text-sm cursor-pointer">Cancel</button>
          </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
          <div className="p-4 border-b border-[#e1e1e1] flex justify-between items-center">
            <p className="text-sm text-[#717171]">{list.length} properties</p>
            <button type="button" onClick={openAddForm} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer">
              + Add property
            </button>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e1e1e1]">
                <th className="text-left p-3 font-medium w-20">Image</th>
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Purpose</th>
                <th className="p-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-[#717171]">No properties yet. Click “Add property” to create one.</td></tr>
              )}
              {list.map((p) => {
                const imgSrc = getPropertyImage(p)
                return (
                  <tr key={p.id} className="border-b border-[#e1e1e1] hover:bg-[#fafafa]">
                    <td className="p-2">
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="w-14 h-14 object-cover rounded-lg border border-[#e1e1e1]" />
                      ) : (
                        <span className="inline-flex w-14 h-14 items-center justify-center rounded-lg bg-[#f0f0f0] text-[#999] text-xs">No img</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">{p.type}</td>
                    <td className="p-3">{p.location}</td>
                    <td className="p-3">{p.priceDisplay && String(p.priceDisplay).trim() ? p.priceDisplay : (p.price != null && Number(p.price) > 0 ? `${Number(p.price).toLocaleString()} AED` : '—')}</td>
                    <td className="p-3">{p.purpose}</td>
                    <td className="p-3">
                      <button type="button" onClick={() => handleEdit(p)} className="text-[#B8862E] hover:underline mr-2 cursor-pointer">Edit</button>
                      <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
