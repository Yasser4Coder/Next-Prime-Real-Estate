import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import DevelopersData from '../home/data/DevelopersData'

// RAK and Anantara are two different developers — split any combined "RAK Anantara" in stored data.
function ensureRAKAnantaraSplit(list) {
  if (!list?.length) return list
  const rak = DevelopersData.find((d) => d.name === 'RAK')
  const anantara = DevelopersData.find((d) => d.name === 'Anantara')
  const hasCombined = list.some((d) => d.name === 'RAK Anantara')
  if (!hasCombined) return list
  const maxId = Math.max(...list.map((d) => (typeof d.id === 'number' ? d.id : 0)), 0)
  return list.flatMap((d) => {
    if (d.name === 'RAK Anantara') {
      return [
        rak ? { ...rak, id: d.id, link: d.link || '' } : { id: d.id, name: 'RAK', logoUrl: '', link: d.link || '' },
        anantara ? { ...anantara, id: maxId + 1, link: d.link || '' } : { id: maxId + 1, name: 'Anantara', logoUrl: '', link: d.link || '' },
      ]
    }
    return [d]
  })
}

export default function DevelopersManage() {
  const { developers: storeDevelopers, setDevelopers } = useDashboardStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', logoUrl: '', link: '' })

  const displayList = storeDevelopers?.length ? storeDevelopers : DevelopersData

  // One-time: split "RAK Anantara" in stored list so dashboard shows RAK and Anantara separately
  useEffect(() => {
    if (!storeDevelopers?.length) return
    const fixed = ensureRAKAnantaraSplit(storeDevelopers)
    if (fixed.length !== storeDevelopers.length) setDevelopers(fixed)
  }, [storeDevelopers?.length, setDevelopers])

  const resetForm = () => {
    setForm({ name: '', logoUrl: '', link: '' })
    setEditing(null)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return
    const payload = { name, logoUrl: form.logoUrl.trim() || '', link: form.link.trim() || '' }
    const id = editing?.id ?? Math.max(0, ...displayList.map((d) => d.id)) + 1
    const full = { id, ...payload }
    if (editing) {
      setDevelopers(displayList.map((d) => (d.id === id ? full : d)))
      toast.success('Developer updated')
    } else {
      setDevelopers([...displayList, full])
      toast.success('Developer added')
    }
    resetForm()
  }

  const handleEdit = (d) => {
    setEditing(d)
    setForm({ name: d.name, logoUrl: d.logoUrl || '', link: d.link || '' })
  }

  const handleDelete = (id) => {
    if (!window.confirm('Remove this developer?')) return
    const next = displayList.filter((d) => d.id !== id)
    setDevelopers(next)
    toast.success('Developer removed')
    resetForm()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Developers & Promoters</h1>
      <p className="text-sm text-[#717171] mb-4">
        Customize the logos shown in the &quot;Developers &amp; Promoters We Partner With&quot; section on the home page. Add a logo image URL (e.g. from your CDN or image host) or leave blank to show the name only.
      </p>
      <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
        <div className="p-4 border-b border-[#e1e1e1] flex justify-between items-center">
          <p className="text-sm text-[#717171]">{displayList.length} developers</p>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer"
          >
            + Add developer
          </button>
        </div>
        <form onSubmit={handleSave} className="p-4 border-b border-[#e1e1e1] bg-[#fafafa] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name (e.g. Emaar, Damac)"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-[#e1e1e1]"
              required
            />
            <input
              type="url"
              placeholder="Logo image URL"
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-[#e1e1e1]"
            />
            <input
              type="url"
              placeholder="Link (optional)"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-[#e1e1e1]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#B8862E] text-white text-sm font-medium hover:bg-[#A67C2A] cursor-pointer"
            >
              {editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-[#e1e1e1] text-sm cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <ul className="divide-y divide-[#e1e1e1]">
          {displayList.map((d) => (
            <li key={d.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {d.logoUrl ? (
                  <img src={d.logoUrl} alt="" className="h-10 w-auto object-contain shrink-0" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="h-10 w-16 shrink-0 rounded bg-[#f0f0f0] flex items-center justify-center text-xs text-[#717171]">No logo</div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-[#262626]">{d.name}</p>
                  {d.link && <p className="text-xs text-[#717171] truncate">{d.link}</p>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => handleEdit(d)} className="text-[#B8862E] hover:underline text-sm cursor-pointer">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline text-sm cursor-pointer">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
