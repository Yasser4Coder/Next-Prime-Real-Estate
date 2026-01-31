import React from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import DevelopersData from '../data/DevelopersData'
import { useSiteData } from '../../../context/DashboardStore'
import { viewportOnce } from '../../../utils/motion'

// Normalize: "RAK Anantara" is two different developers — split into RAK and Anantara.
function normalizeDevelopers(list) {
  const rak = DevelopersData.find((d) => d.name === 'RAK')
  const anantara = DevelopersData.find((d) => d.name === 'Anantara')
  return list.flatMap((dev) => {
    if (dev.name === 'RAK Anantara') {
      return [rak ? { ...rak, id: dev.id } : { id: dev.id, name: 'RAK', logoUrl: '', link: dev.link || '' }, anantara ? { ...anantara, id: `${dev.id}-anantara` } : { id: `${dev.id}-anantara`, name: 'Anantara', logoUrl: '', link: dev.link || '' }]
    }
    return [dev]
  })
}

const OurDevelopers = () => {
  const siteData = useSiteData()
  const raw = siteData?.developers?.length ? siteData.developers : DevelopersData
  const normalized = normalizeDevelopers(raw)
  const developers = normalized.map((dev) => {
    if (dev.logoUrl) return dev
    const fallback = DevelopersData.find((d) => d.name === dev.name)
    return { ...dev, logoUrl: fallback?.logoUrl || '' }
  })

  return (
    <motion.section
      id="developers"
      className="mt-16 sm:mt-24 lg:mt-[180px] px-4 sm:px-6 lg:px-8"
      aria-label="Developers and promoters we work with"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto w-full flex flex-col gap-10 sm:gap-16">
        <SectionHeader
          title="Developers & Promoters We Partner With"
          desc="Trusted names in Dubai real estate. We work with leading developers and promoters to bring you the best off-plan and ready properties."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {developers.map((dev, i) => (
            <motion.div
              key={typeof dev.id === 'string' ? dev.id : `dev-${dev.id}`}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-[#e1e1e1] bg-white hover:border-[#B8862E]/40 hover:shadow-md transition-all min-h-[100px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              {dev.logoUrl ? (
                <a
                  href={dev.link || undefined}
                  target={dev.link ? '_blank' : undefined}
                  rel={dev.link ? 'noopener noreferrer' : undefined}
                  className="w-full h-12 sm:h-14 flex items-center justify-center"
                >
                  <img
                    src={dev.logoUrl}
                    alt={dev.name}
                    className="max-h-12 sm:max-h-14 w-auto max-w-full object-contain"
                  />
                </a>
              ) : (
                <span className="text-sm sm:text-base font-medium text-[#262626] text-center">
                  {dev.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default OurDevelopers
