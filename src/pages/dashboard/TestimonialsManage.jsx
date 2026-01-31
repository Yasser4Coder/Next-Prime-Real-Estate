import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import * as api from '../../api/client'

const useApi = () => !!import.meta.env.VITE_API_URL

function getInitials(name) {
  return (name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function TestimonialsManage() {
  const { testimonials: storeTestimonials, setTestimonials } = useDashboardStore()
  const [testimonials, setTestimonialsState] = useState([])
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', location: '', quote: '', rating: 5 })

  const list = useApi() ? testimonials : storeTestimonials

  const fetchList = async () => {
    if (!useApi()) return
    setLoading(true)
    try {
      const data = await api.getTestimonials()
      setTestimonialsState(Array.isArray(data) ? data : [])
    } catch (_) {
      setTestimonialsState([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useApi()) fetchList()
  }, [])

  useEffect(() => {
    if (!useApi()) setTestimonialsState(storeTestimonials)
  }, [storeTestimonials])

  const resetForm = () => {
    setForm({ name: '', role: '', location: '', quote: '', rating: 5 })
    setEditing(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { name: form.name, role: form.role, location: form.location, quote: form.quote, rating: Number(form.rating) || 5 }
    if (useApi()) {
      setSaving(true)
      try {
        if (editing) {
          await api.updateTestimonial(editing.id, payload)
        } else {
          await api.createTestimonial(payload)
        }
        await fetchList()
        resetForm()
        toast.success(editing ? 'Testimonial updated' : 'Testimonial added')
      } catch (err) {
        toast.error(err.message || 'Failed to save')
      } finally {
        setSaving(false)
      }
    } else {
      toast.success(editing ? 'Testimonial updated' : 'Testimonial added')
      const id = editing?.id ?? Math.max(0, ...list.map((t) => t.id)) + 1
      const full = { id, ...payload, initials: getInitials(form.name) }
      if (editing) setTestimonials(list.map((t) => (t.id === id ? full : t)))
      else setTestimonials([...list, full])
      resetForm()
    }
  }

  const handleEdit = (t) => {
    setEditing(t)
    setForm({ name: t.name, role: t.role || '', location: t.location || '', quote: t.quote || '', rating: t.rating ?? 5 })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    if (useApi()) {
      try {
        await api.deleteTestimonial(id)
        await fetchList()
        toast.success('Testimonial deleted')
      } catch (err) {
        toast.error(err.message || 'Failed to delete')
      }
    } else {
      setTestimonials(list.filter((t) => t.id !== id))
      toast.success('Testimonial deleted')
    }
  }

  if (loading) return <div className="p-6 text-[#717171]">Loading testimonials…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Testimonials</h1>
      <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
        <div className="p-4 border-b border-[#e1e1e1] flex justify-between items-center">
          <p className="text-sm text-[#717171]">{list.length} testimonials</p>
          <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer">
            + Add testimonial
          </button>
        </div>
        <form onSubmit={handleSave} className="p-4 border-b border-[#e1e1e1] bg-[#fafafa] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" required />
            <input type="text" placeholder="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
            <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1]" />
          </div>
          <textarea placeholder="Quote" value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e1e1e1]" rows={3} required />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm text-[#717171]">Rating</span>
              <select value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="px-3 py-2 rounded-xl border border-[#e1e1e1] cursor-pointer">
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </label>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer disabled:opacity-70">{saving ? 'Saving…' : (editing ? 'Update' : 'Add')}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-[#e1e1e1] text-sm cursor-pointer">Cancel</button>
          </div>
        </form>
        <ul className="divide-y divide-[#e1e1e1]">
          {list.length === 0 && <li className="p-6 text-center text-[#717171]">No testimonials yet.</li>}
          {list.map((t) => (
            <li key={t.id} className="p-4 flex justify-between items-start gap-4">
              <div>
                <p className="font-medium text-[#262626]">{t.name}</p>
                <p className="text-sm text-[#717171]">{t.role} · {t.location}</p>
                <p className="text-sm text-[#262626] mt-1 line-clamp-2">{t.quote}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => handleEdit(t)} className="text-[#B8862E] hover:underline text-sm cursor-pointer">Edit</button>
                <button type="button" onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline text-sm cursor-pointer">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
