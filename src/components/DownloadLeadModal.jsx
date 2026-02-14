import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { submitDownloadLead } from '../api/client'

const useApi = () => !!import.meta.env.VITE_API_URL

const DownloadLeadModal = ({
  isOpen,
  onClose,
  projectName,
  documentType,
  downloadUrl,
}) => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (!useApi()) {
      window.open(downloadUrl, '_blank')
      onClose()
      return
    }
    setSubmitting(true)
    try {
      await submitDownloadLead({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        project: projectName,
        message: message.trim() || null,
        documentType,
      })
      window.open(downloadUrl, '_blank')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) onClose()
  }

  if (!isOpen) return null

  const docLabel = documentType === 'brochure' ? 'Brochure' : 'Floor Plan'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#e1e1e1]">
          <h2 id="download-modal-title" className="text-xl font-semibold text-black">
            Download {docLabel}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="p-2 rounded-lg hover:bg-[#f5f5f5] cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5 text-[#666]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-[#717171]">
            Please fill in your details to download the {docLabel.toLowerCase()} for <strong>{projectName}</strong>.
          </p>
          <div>
            <label htmlFor="dl-fullName" className="block text-sm font-medium text-[#262626] mb-1">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="dl-fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1e1e1] focus:border-[#B8862E] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="dl-phone" className="block text-sm font-medium text-[#262626] mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="dl-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971 50 123 4567"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1e1e1] focus:border-[#B8862E] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="dl-email" className="block text-sm font-medium text-[#262626] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="dl-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1e1e1] focus:border-[#B8862E] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="dl-project" className="block text-sm font-medium text-[#262626] mb-1">
              Project
            </label>
            <input
              id="dl-project"
              type="text"
              value={projectName}
              readOnly
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1e1e1] bg-[#f5f5f5] text-[#666]"
            />
          </div>
          <div>
            <label htmlFor="dl-message" className="block text-sm font-medium text-[#262626] mb-1">
              Message <span className="text-[#999]">(optional)</span>
            </label>
            <textarea
              id="dl-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any questions or comments?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1e1e1] focus:border-[#B8862E] focus:outline-none resize-none"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e1e1e1] text-[#666] font-medium hover:bg-[#f5f5f5] cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#B8862E] text-white font-medium hover:bg-[#A67C2A] cursor-pointer disabled:opacity-70"
            >
              {submitting ? 'Submitting…' : 'Download'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DownloadLeadModal
