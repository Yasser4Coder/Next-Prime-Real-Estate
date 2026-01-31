import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import * as api from '../../api/client'

const ICON_NAMES = ['Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'Instagram', 'TikTok']
const useApi = () => !!import.meta.env.VITE_API_URL

export default function SocialManage() {
  const { socialLinks: storeSocial, setSocialLinks } = useDashboardStore()
  const [socialLinks, setSocialLinksState] = useState([])
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: 'Facebook', href: '' })
  const [saving, setSaving] = useState(false)

  const list = useApi() ? socialLinks : storeSocial

  const fetchList = async () => {
    if (!useApi()) return
    setLoading(true)
    try {
      const data = await api.getSocial()
      setSocialLinksState(Array.isArray(data) ? data : [])
    } catch (_) {
      setSocialLinksState([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useApi()) fetchList()
    else setSocialLinksState(storeSocial)
  }, [])

  useEffect(() => {
    if (!useApi()) setSocialLinksState(storeSocial)
  }, [storeSocial])

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { name: form.name, href: form.href, icon: form.name.toLowerCase() }
    if (useApi()) {
      setSaving(true)
      try {
        await api.updateSocial(payload)
        await fetchList()
        setEditing(null)
        setForm({ name: 'Facebook', href: '' })
        toast.success('Social link saved')
      } catch (err) {
        toast.error(err.message || 'Failed to save')
      } finally {
        setSaving(false)
      }
    } else {
      toast.success('Social link saved')
      if (editing !== null) {
        const next = storeSocial.map((s, i) => (i === editing ? { ...s, ...payload } : s))
        setSocialLinks(next)
      } else {
        if (storeSocial.some((s) => s.name === form.name)) {
          setSocialLinks(storeSocial.map((s) => (s.name === form.name ? { ...s, href: form.href } : s)))
        } else {
          setSocialLinks([...storeSocial, { ...payload }])
        }
      }
      setEditing(null)
      setForm({ name: 'Facebook', href: '' })
    }
  }

  const handleEdit = (index) => {
    const s = list[index]
    setEditing(index)
    setForm({ name: s.name, href: s.href || '' })
  }

  const handleRemove = async (index) => {
    const s = list[index]
    if (useApi()) {
      try {
        await api.deleteSocial(s.name)
        await fetchList()
        if (editing === index) { setEditing(null); setForm({ name: 'Facebook', href: '' }) }
        toast.success('Social link removed')
      } catch (err) {
        toast.error(err.message || 'Failed to remove')
      }
    } else {
      setSocialLinks(storeSocial.filter((_, i) => i !== index))
      if (editing === index) { setEditing(null); setForm({ name: 'Facebook', href: '' }) }
      toast.success('Social link removed')
    }
  }

  if (loading) return <div className="p-6 text-[#717171]">Loading social links…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Footer Social Media</h1>
      <p className="text-sm text-[#717171] mb-4">Links shown in the footer. Add or edit URL for each platform.</p>
      <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden max-w-xl">
        <form onSubmit={handleSave} className="p-4 border-b border-[#e1e1e1] bg-[#fafafa] flex flex-col sm:flex-row gap-4">
          <select value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-4 py-2.5 rounded-xl border border-[#e1e1e1] cursor-pointer">
            {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <input type="url" placeholder="https://..." value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e1e1e1]" />
          <button type="submit" disabled={saving} className="px-4 py-2.5 rounded-xl bg-[#B8862E] text-white font-medium hover:bg-[#A67C2A] cursor-pointer disabled:opacity-70">{editing !== null ? 'Update' : 'Add / Update'}</button>
          {editing !== null && <button type="button" onClick={() => { setEditing(null); setForm({ name: 'Facebook', href: '' }); }} className="px-4 py-2.5 rounded-xl border border-[#e1e1e1] cursor-pointer">Cancel</button>}
        </form>
        <ul className="divide-y divide-[#e1e1e1]">
          {list.map((s, i) => (
            <li key={s.name + i} className="p-4 flex justify-between items-center">
              <span className="font-medium">{s.name}</span>
              <span className="text-sm text-[#717171] truncate max-w-[200px]" title={s.href}>{s.href || '—'}</span>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => handleEdit(i)} className="text-[#B8862E] hover:underline text-sm cursor-pointer">Edit</button>
                <button type="button" onClick={() => handleRemove(i)} className="text-red-600 hover:underline text-sm cursor-pointer">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
