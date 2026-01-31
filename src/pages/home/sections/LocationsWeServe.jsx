import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Marker } from 'pigeon-maps'
import { FaMapMarkerAlt } from 'react-icons/fa'
import SectionHeader from '../components/SectionHeader'
import { viewportOnce } from '../../../utils/motion'
import { useSiteData } from '../../../context/DashboardStore'

const DEFAULT_AREAS = [
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    subtitle: 'Waterfront lifestyle & high-demand rentals',
    center: [25.0807, 55.1403],
  },
  {
    id: 'downtown',
    name: 'Downtown Dubai',
    subtitle: 'Prime CBD living near Burj Khalifa',
    center: [25.1972, 55.2744],
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    subtitle: 'Ultra-luxury beachfront residences',
    center: [25.1124, 55.1389],
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    subtitle: 'Modern towers & investment opportunities',
    center: [25.1864, 55.2727],
  },
  {
    id: 'jvc',
    name: 'Jumeirah Village Circle (JVC)',
    subtitle: 'Value-focused homes with strong ROI',
    center: [25.0606, 55.2056],
  },
  {
    id: 'dubai-hills',
    name: 'Dubai Hills Estate',
    subtitle: 'Green communities & family-friendly villas',
    center: [25.0669, 55.2343],
  },
]

const LocationsWeServe = () => {
  const siteData = useSiteData()
  const AREAS = siteData?.areas?.length ? siteData.areas : DEFAULT_AREAS
  const [activeId, setActiveId] = useState(AREAS[0]?.id)

  const activeArea = useMemo(
    () => AREAS.find((a) => a.id === activeId) ?? AREAS[0],
    [AREAS, activeId]
  )

  return (
    <motion.section
      id="areas"
      className="mt-14 sm:mt-20 lg:mt-[120px] px-4 sm:px-6 lg:px-8"
      aria-label="Locations and areas we serve in Dubai"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <SectionHeader
          title="Locations / Areas We Serve"
          desc="We focus on Dubai’s most sought-after communities—so you get accurate pricing, better shortlists, and smoother viewings."
          buttonText="Browse Properties"
          buttonTo="/properties"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Area list */}
          <div className="lg:col-span-5">
            <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-4 sm:p-5">
              <p className="text-sm font-medium text-[#262626]">
                Select an area to preview it on the map
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {AREAS.map((a) => {
                  const isActive = a.id === activeId
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActiveId(a.id)}
                      className={`w-full text-left cursor-pointer rounded-xl border p-3 transition-all ${
                        isActive
                          ? 'border-[#B8862E] bg-[#B8862E]/10'
                          : 'border-[#e1e1e1] bg-white hover:border-[#B8862E]/60'
                      }`}
                      aria-pressed={isActive}
                      aria-label={`Show ${a.name} on the map`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-[#B8862E] text-white' : 'bg-[#262626] text-white'
                          }`}
                          aria-hidden
                        >
                          <FaMapMarkerAlt className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black truncate">
                            {a.name}
                          </p>
                          <p className="text-xs text-[#717171] leading-relaxed">
                            {a.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-[#717171]">
                Looking for a specific community? We can source options across Dubai on request.
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-7">
            <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-[#e1e1e1] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-black truncate">
                    {activeArea?.name}
                  </p>
                  <p className="text-xs text-[#717171] truncate">
                    {activeArea?.subtitle}
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dubai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#B8862E] hover:underline whitespace-nowrap"
                >
                  Open in Maps
                </a>
              </div>

              <div className="w-full">
                <Map
                  height={320}
                  center={activeArea?.center ?? [25.2048, 55.2708]}
                  zoom={11}
                >
                  {AREAS.map((a) => (
                    <Marker key={a.id} width={32} anchor={a.center} />
                  ))}
                  {activeArea?.center ? (
                    <Marker width={44} anchor={activeArea.center} />
                  ) : null}
                </Map>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default LocationsWeServe

