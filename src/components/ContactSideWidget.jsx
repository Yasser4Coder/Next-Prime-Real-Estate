import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaTimes } from 'react-icons/fa'
import { useSiteData } from '../context/DashboardStore'

const CONTACT = {
  phoneDisplay: '+971 50 000 0000',
  phoneTel: '+971500000000',
  email: 'info@nextprimerealestate.com',
  whatsappText: 'Hi Next Prime, I’m interested in your Dubai properties.',
}

const FALLBACK_CONTACT = {
  phoneDisplay: '+971 52 778 0718',
  phoneTel: '+971527780718',
  email: 'contact@nextprimerealestate.com',
  whatsappText: "Hi Next Prime, I'm interested in your Dubai properties.",
}

const ContactSideWidget = () => {
  const [open, setOpen] = useState(false)
  const siteData = useSiteData()
  const CONTACT = siteData?.contact || FALLBACK_CONTACT

  return (
    <motion.div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden sm:block"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center">
        {open && (
          <div className="mr-3 w-64 bg-[#262626] text-white border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="font-semibold">Contact Next Prime</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                aria-label="Close contact panel"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer transition-all hover:bg-white/5 hover:ring-1 hover:ring-white/20 hover:shadow-lg hover:shadow-black/20"
              >
                <span className="w-10 h-10 rounded-xl bg-[#B8862E] flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="w-4 h-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-white/70">Call</p>
                  <p className="text-sm font-semibold truncate">{CONTACT.phoneDisplay}</p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer transition-all hover:bg-white/5 hover:ring-1 hover:ring-white/20 hover:shadow-lg hover:shadow-black/20"
              >
                <span className="w-10 h-10 rounded-xl bg-[#B8862E] flex items-center justify-center shrink-0">
                  <FaEnvelope className="w-4 h-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-white/70">Email</p>
                  <p className="text-sm font-semibold truncate">{CONTACT.email}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${CONTACT.phoneTel.replace('+', '')}?text=${encodeURIComponent(CONTACT.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer transition-all hover:bg-white/5 hover:ring-1 hover:ring-white/20 hover:shadow-lg hover:shadow-black/20"
              >
                <span className="w-10 h-10 rounded-xl bg-[#B8862E] flex items-center justify-center shrink-0">
                  <FaWhatsapp className="w-4 h-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-white/70">WhatsApp</p>
                  <p className="text-sm font-semibold truncate">Chat with us</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Vertical buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-12 h-12 rounded-2xl bg-[#B8862E] text-white shadow-lg cursor-pointer flex items-center justify-center transition-all hover:brightness-95 hover:shadow-xl hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={open ? 'Close contact panel' : 'Open contact panel'}
          >
            {open ? <FaTimes className="w-5 h-5" /> : <FaPhoneAlt className="w-5 h-5" />}
          </button>

          <a
            href={`https://wa.me/${CONTACT.phoneTel.replace('+', '')}?text=${encodeURIComponent(CONTACT.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-2xl bg-[#262626] text-white border border-white/10 shadow-lg cursor-pointer flex items-center justify-center transition-all hover:border-[#B8862E]/60 hover:shadow-xl hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="WhatsApp Next Prime"
          >
            <FaWhatsapp className="w-5 h-5" aria-hidden />
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            className="w-12 h-12 rounded-2xl bg-[#262626] text-white border border-white/10 shadow-lg cursor-pointer flex items-center justify-center transition-all hover:border-[#B8862E]/60 hover:shadow-xl hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Email Next Prime"
          >
            <FaEnvelope className="w-5 h-5" aria-hidden />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactSideWidget

