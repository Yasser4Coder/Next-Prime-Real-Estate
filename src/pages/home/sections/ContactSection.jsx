import React from 'react'
import { motion } from 'framer-motion'
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { useSiteData } from '../../../context/DashboardStore'
import { viewportOnce } from '../../../utils/motion'

const FALLBACK_CONTACT = {
  phoneDisplay: '+971 52 778 0718',
  phoneTel: '+971527780718',
  email: 'contact@nextprimerealestate.com',
  whatsappText: "Hi Next Prime, I'm interested in your Dubai properties.",
}

const ContactSection = () => {
  const siteData = useSiteData()
  const contact = siteData?.contact || FALLBACK_CONTACT

  return (
    <motion.section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]"
      aria-label="Contact us"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#262626] leading-tight">
            Get in touch
          </h2>
          <p className="text-[#555] text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Have a question or ready to explore properties? Reach out—we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          <a
            href={`tel:${contact.phoneTel}`}
            className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white border border-[#e1e1e1] hover:border-[#B8862E]/40 hover:shadow-md transition-all group"
          >
            <span className="w-14 h-14 rounded-2xl bg-[#B8862E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#A67C2A] transition-colors">
              <FaPhoneAlt className="w-6 h-6" aria-hidden />
            </span>
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-[#717171] uppercase tracking-wide">Call us</p>
              <p className="text-base font-semibold text-[#262626] mt-0.5">{contact.phoneDisplay}</p>
            </div>
          </a>

          <a
            href={`mailto:${contact.email}`}
            className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white border border-[#e1e1e1] hover:border-[#B8862E]/40 hover:shadow-md transition-all group"
          >
            <span className="w-14 h-14 rounded-2xl bg-[#B8862E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#A67C2A] transition-colors">
              <FaEnvelope className="w-6 h-6" aria-hidden />
            </span>
            <div className="text-center sm:text-left min-w-0">
              <p className="text-xs font-medium text-[#717171] uppercase tracking-wide">Email</p>
              <p className="text-sm font-semibold text-[#262626] mt-0.5 truncate">{contact.email}</p>
            </div>
          </a>

          <a
            href={`https://wa.me/${contact.phoneTel.replace('+', '')}?text=${encodeURIComponent(contact.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white border border-[#e1e1e1] hover:border-[#B8862E]/40 hover:shadow-md transition-all group"
          >
            <span className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:bg-[#20bd5a] transition-colors">
              <FaWhatsapp className="w-6 h-6" aria-hidden />
            </span>
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-[#717171] uppercase tracking-wide">WhatsApp</p>
              <p className="text-base font-semibold text-[#262626] mt-0.5">Chat with us</p>
            </div>
          </a>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactSection
