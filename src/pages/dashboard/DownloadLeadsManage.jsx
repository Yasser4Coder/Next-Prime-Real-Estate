import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../api/client'

const useApi = () => !!import.meta.env.VITE_API_URL

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DownloadLeadsManage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(!!import.meta.env.VITE_API_URL)

  const fetchLeads = async () => {
    if (!useApi()) return
    setLoading(true)
    try {
      const data = await api.getDownloadLeads()
      setLeads(Array.isArray(data) ? data : [])
    } catch (_) {
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useApi()) fetchLeads()
  }, [])

  const handleToggleContacted = async (lead) => {
    if (!useApi()) return
    try {
      await api.updateDownloadLead(lead.id, { contacted: !lead.contacted })
      await fetchLeads()
      toast.success(lead.contacted ? 'Marked as not contacted' : 'Marked as contacted')
    } catch (err) {
      toast.error(err.message || 'Failed to update')
    }
  }

  const handleDelete = async (lead) => {
    if (!window.confirm(`Delete lead from ${lead.fullName}?`)) return
    if (!useApi()) return
    try {
      await api.deleteDownloadLead(lead.id)
      await fetchLeads()
      toast.success('Lead deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  if (loading) return <div className="p-6 text-[#717171]">Loading download leads…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#262626] mb-6">Download Leads</h1>
      <p className="text-[#717171] mb-6">
        Leads captured when users request brochure or floor plan downloads on property details pages.
      </p>
      {!useApi() ? (
        <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-8 text-center text-[#717171]">
          Connect to the API to view download leads.
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-8 text-center text-[#717171]">
          No download leads yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e1e1e1] bg-[#fafafa]">
                  <th className="p-3 text-sm font-semibold text-[#262626] w-12">Contacted</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Date</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Name</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Phone</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Email</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Project</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Document</th>
                  <th className="p-3 text-sm font-semibold text-[#262626]">Message</th>
                  <th className="p-3 text-sm font-semibold text-[#262626] w-20"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className={`border-b border-[#e1e1e1] hover:bg-[#fafafa] ${lead.contacted ? 'bg-[#f0fdf4]' : ''}`}>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleContacted(lead)}
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors ${
                          lead.contacted
                            ? 'bg-[#22c55e] border-[#22c55e] text-white'
                            : 'border-[#e1e1e1] hover:border-[#B8862E]'
                        }`}
                        title={lead.contacted ? 'Mark as not contacted' : 'I contacted this client'}
                        aria-label={lead.contacted ? 'Mark as not contacted' : 'Mark as contacted'}
                      >
                        {lead.contacted && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-sm text-[#666]">{formatDate(lead.createdAt)}</td>
                    <td className="p-3 text-sm font-medium text-black">{lead.fullName}</td>
                    <td className="p-3 text-sm text-[#666]">
                      <a href={`tel:${lead.phone}`} className="hover:text-[#B8862E]">{lead.phone}</a>
                    </td>
                    <td className="p-3 text-sm text-[#666]">
                      <a href={`mailto:${lead.email}`} className="hover:text-[#B8862E]">{lead.email}</a>
                    </td>
                    <td className="p-3 text-sm text-[#666]">{lead.project}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.documentType === 'brochure'
                          ? 'bg-[#262626]/10 text-[#262626]'
                          : 'bg-[#B8862E]/15 text-[#B8862E]'
                      }`}>
                        {lead.documentType === 'brochure' ? 'Brochure' : 'Floor Plan'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-[#666] max-w-[200px] truncate" title={lead.message || ''}>
                      {lead.message || '—'}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(lead)}
                        className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete lead"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
