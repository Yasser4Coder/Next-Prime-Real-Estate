import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDashboardStore } from '../../context/DashboardStore'
import * as api from '../../api/client'

const useApi = () => !!import.meta.env.VITE_API_URL

export default function ContactManage() {
  const { contact: storeContact, setContact } = useDashboardStore()
  const [contact, setContactState] = useState(null)
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)
  const [saving, setSaving] = useState(false)

  const displayContact = useApi() ? (contact || storeContact) : storeContact

  useEffect(() => {
    if (useApi()) {
      setLoading(true)
      api.getContact()
        .then((data) => setContactState(data))
        .catch(() => setContactState(storeContact))
        .finally(() => setLoading(false))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const payload = {
      phoneDisplay: form.phoneDisplay.value.trim(),
      phoneTel: form.phoneTel.value.trim().replace(/\s/g, ''),
      email: form.email.value.trim(),
      whatsappText: form.whatsappText.value.trim(),
    }
    if (useApi()) {
      setSaving(true)
      try {
        const updated = await api.updateContact(payload)
        setContactState(updated)
        toast.success('Contact info saved')
      } catch (err) {
        toast.error(err.message || 'Failed to save')
      } finally {
        setSaving(false)
      }
    } else {
      setContact(payload)
      toast.success('Contact info saved')
    }
  }

  if (loading || !displayContact) return <div className="p-6 text-[#717171]">Loading contact…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Contact Info</h1>
      <p className="text-sm text-[#717171] mb-4">This info is used in the contact widget and across the site.</p>
      <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden max-w-xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="phoneDisplay" className="block text-sm font-medium text-[#262626] mb-1">Phone (display)</label>
            <input id="phoneDisplay" name="phoneDisplay" type="text" defaultValue={displayContact.phoneDisplay} placeholder="+971 50 000 0000" className="w-full px-4 py-2.5 rounded-xl border border-[#e1e1e1]" />
          </div>
          <div>
            <label htmlFor="phoneTel" className="block text-sm font-medium text-[#262626] mb-1">Phone (tel link, no spaces)</label>
            <input id="phoneTel" name="phoneTel" type="text" defaultValue={displayContact.phoneTel} placeholder="+971500000000" className="w-full px-4 py-2.5 rounded-xl border border-[#e1e1e1]" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#262626] mb-1">Email</label>
            <input id="email" name="email" type="email" defaultValue={displayContact.email} className="w-full px-4 py-2.5 rounded-xl border border-[#e1e1e1]" />
          </div>
          <div>
            <label htmlFor="whatsappText" className="block text-sm font-medium text-[#262626] mb-1">WhatsApp prefill message</label>
            <textarea id="whatsappText" name="whatsappText" rows={2} defaultValue={displayContact.whatsappText} className="w-full px-4 py-2.5 rounded-xl border border-[#e1e1e1]" />
          </div>
          <button type="submit" disabled={saving} className="px-4 py-2.5 rounded-xl bg-[#B8862E] text-white font-medium hover:bg-[#A67C2A] cursor-pointer disabled:opacity-70">
            {saving ? 'Saving…' : 'Save contact info'}
          </button>
        </form>
      </div>
    </div>
  )
}
