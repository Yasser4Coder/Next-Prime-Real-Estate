import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, Marker } from 'pigeon-maps'
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaTimes, FaPhoneAlt, FaWhatsapp, FaRegCalendarAlt, FaRegClock, FaStar } from 'react-icons/fa'
import Header from '../../components/Header'
import Button from '../../components/Button'
import allPropertiesData from './data/allPropertiesData'
import { setSeoMeta } from '../../utils/seo'
import { fadeIn } from '../../utils/motion'

const formatAed = (value) =>
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value)

const PropertyDetails = () => {
  const { id } = useParams()
  const propertyId = Number(id)

  const property = useMemo(
    () => allPropertiesData.find((p) => p.id === propertyId),
    [propertyId]
  )

  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (!property) return
    setSeoMeta({
      title: `${property.title} | Dubai Property | Next Prime Real Estate`,
      description: property.description,
      canonical: `https://www.nextprimerealestate.com/properties/${property.id}`,
    })
  }, [property])

  useEffect(() => {
    if (!isLightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') setActivePhotoIndex((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight')
        setActivePhotoIndex((i) =>
          Math.min((property?.photos?.length ?? 1) - 1, i + 1)
        )
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLightboxOpen, property])

  if (!property) {
    return (
      <motion.div className="min-h-screen bg-white" {...fadeIn}>
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/properties" className="inline-flex items-center gap-2 text-[#666] hover:text-[#B8862E] transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
          <div className="mt-10 bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-10 text-center">
            <h1 className="text-2xl font-medium text-black">Property not found</h1>
            <p className="mt-2 text-[#717171]">The property you’re looking for doesn’t exist.</p>
          </div>
        </main>
      </motion.div>
    )
  }

  const photos = property.photos?.length ? property.photos : [property.image]
  const activePhoto = photos[Math.min(activePhotoIndex, photos.length - 1)]

  const OverviewItem = ({ label, value }) => (
    <div className="bg-white border border-[#e1e1e1] rounded-xl p-3.5 sm:p-4">
      <p className="text-xs text-[#666]">{label}</p>
      <p className="text-sm sm:text-base font-medium text-black mt-1">{value}</p>
    </div>
  )

  return (
    <motion.div className="min-h-screen bg-white" {...fadeIn}>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb / Back */}
        <div className="flex flex-col gap-4 mb-6">
          <Link to="/properties" className="inline-flex items-center gap-2 text-[#666] hover:text-[#B8862E] transition-colors w-fit">
            <FaArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[#666]">
              <li>
                <Link to="/" className="hover:text-[#B8862E] transition-colors">Home</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/properties" className="hover:text-[#B8862E] transition-colors">Properties</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-[#262626] font-medium" aria-current="page">{property.title}</li>
            </ol>
          </nav>
        </div>

        {/* Title + price */}
        <motion.header
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-sm text-[#666] mb-2">
                <span className="px-3 py-1 rounded-full border border-[#e1e1e1] bg-[#FCFCFD]">
                  {property.purpose === 'rent' ? 'Rent' : 'Buy'}
                </span>
                <span className="px-3 py-1 rounded-full border border-[#e1e1e1] bg-[#FCFCFD]">
                  {property.type}
                </span>
                <span className="px-3 py-1 rounded-full border border-[#e1e1e1] bg-[#FCFCFD]">
                  {property.bedrooms} BR
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight">
                {property.title}
              </h1>
              <p className="mt-2 text-[#717171] text-sm sm:text-base">
                {property.address?.line1 ?? `${property.location}, Dubai, UAE`}
              </p>
            </div>
            <div className="bg-[#262626] text-white rounded-2xl p-4 sm:p-5 w-full lg:w-auto">
              <p className="text-sm text-white/70">Starting price</p>
              <p className="text-xl sm:text-2xl font-semibold mt-1">
                {property.purpose === 'rent' ? `${formatAed(property.price)}/year` : formatAed(property.price)}
              </p>
              <div className="mt-4">
                <Button text="Contact Agent" fullWidth className="w-full" />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Photos */}
        <section aria-label="Property photos" className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <button
                type="button"
                className="w-full cursor-pointer rounded-2xl overflow-hidden border border-[#e1e1e1] bg-[#FCFCFD]"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Open photo gallery"
              >
                <img src={activePhoto} alt={`${property.title} photo ${activePhotoIndex + 1}`} className="w-full h-[240px] sm:h-[380px] object-cover" />
              </button>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-[#666]">
                  Photo {activePhotoIndex + 1} of {photos.length}
                </p>
                <button
                  type="button"
                  className="text-sm font-medium text-[#B8862E] hover:underline cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  See all photos
                </button>
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {photos.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border cursor-pointer ${
                      i === activePhotoIndex ? 'border-[#B8862E]' : 'border-[#e1e1e1]'
                    }`}
                    onClick={() => setActivePhotoIndex(i)}
                    aria-label={`Select photo ${i + 1}`}
                  >
                    <img src={src} alt="" aria-hidden className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Overview */}
            <aside className="lg:col-span-4">
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-black">Overview</h2>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <OverviewItem label="Area" value={`${property.overview?.areaSqft ?? '—'} sqft`} />
                  <OverviewItem label="Bedrooms" value={property.bedrooms} />
                  <OverviewItem label="Bathrooms" value={property.bathrooms} />
                  <OverviewItem label="Status" value={property.overview?.status ?? '—'} />
                  <OverviewItem label="Year Built" value={property.overview?.yearBuilt ?? '—'} />
                  <OverviewItem label="Garages" value={property.overview?.garages ?? '—'} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Content + Sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            {/* Description */}
            <section aria-label="Description">
              <h2 className="text-2xl font-semibold text-black mb-3">Description</h2>
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6">
                <p className="text-[#717171] leading-relaxed">
                  {property.description}
                </p>
              </div>
            </section>

            {/* Residence Options */}
            <section aria-label="Residence Options">
              <h2 className="text-2xl font-semibold text-black mb-3">Residence Options</h2>
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6 space-y-5">
                {(property.residenceOptions ?? []).map((group) => (
                  <div key={group.label}>
                    <p className="font-semibold text-black mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((it) => (
                        <span key={it} className="px-3 py-1.5 rounded-full bg-white border border-[#e1e1e1] text-sm text-[#262626]">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section aria-label="Highlights">
              <h2 className="text-2xl font-semibold text-black mb-3">Highlights</h2>
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6">
                <ul className="space-y-2 text-[#717171]">
                  {(property.highlights ?? []).map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-[#B8862E] font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Features */}
            <section aria-label="Features">
              <h2 className="text-2xl font-semibold text-black mb-3">Features</h2>
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6 space-y-6">
                {property.features
                  ? Object.entries(property.features).map(([group, items]) => (
                      <div key={group}>
                        <p className="font-semibold text-black mb-2">{group}</p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((it) => (
                            <span key={it} className="px-3 py-1.5 rounded-full bg-white border border-[#e1e1e1] text-sm text-[#262626]">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </section>

            {/* Address + Map */}
            <section aria-label="Address and Map">
              <h2 className="text-2xl font-semibold text-black mb-3">Address</h2>
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6">
                <p className="text-[#717171]">
                  <span className="font-medium text-black">Address:</span>{' '}
                  {property.address?.line1}
                </p>
                <div className="mt-4 rounded-2xl overflow-hidden border border-[#e1e1e1]">
                  <Map
                    height={320}
                    defaultCenter={[property.address?.lat ?? 25.2048, property.address?.lng ?? 55.2708]}
                    defaultZoom={12}
                  >
                    <Marker width={40} anchor={[property.address?.lat ?? 25.2048, property.address?.lng ?? 55.2708]} />
                  </Map>
                </div>
                <a
                  className="inline-flex mt-4 text-sm font-medium text-[#B8862E] hover:underline"
                  href={`https://www.google.com/maps?q=${property.address?.lat},${property.address?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>
            </section>

            {/* Floor Plans */}
            <section aria-label="Floor Plans">
              <h2 className="text-2xl font-semibold text-black mb-3">Floor Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(property.floorPlans ?? []).map((fp) => (
                  <div key={fp.id} className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <p className="font-semibold text-black">{fp.title}</p>
                    </div>
                    <img src={fp.image} alt={`${property.title} ${fp.title}`} className="w-full h-56 object-cover" />
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section aria-label="Reviews">
              <h2 className="text-2xl font-semibold text-black mb-3">Reviews</h2>
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6">
                <p className="text-[#717171]">
                  <span className="font-medium text-black">Note:</span> You need to login in order to post a review.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button text="Login to review" className="sm:w-auto" />
                  <Button text="Create account" transparent className="sm:w-auto" />
                </div>
                <div className="mt-6 space-y-4">
                  {(property.reviews ?? []).length === 0 ? (
                    <p className="text-[#717171]">No reviews yet.</p>
                  ) : (
                    property.reviews.map((r) => (
                      <div key={r.id} className="bg-white border border-[#e1e1e1] rounded-xl p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-black">{r.name}</p>
                          <div className="flex items-center gap-1 text-[#C9A24D]" aria-label={`${r.rating} out of 5 stars`}>
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <FaStar key={i} className="w-4 h-4" aria-hidden />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#717171] mt-2">{r.text}</p>
                        <p className="text-xs text-[#999] mt-2">{r.date}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar: Contact + Schedule tour */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Contact Me */}
            <section aria-label="Contact Me" className="bg-[#262626] text-white rounded-2xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Contact Me</h2>
              <p className="text-white/70 mt-2 text-sm">
                Talk to an agent about this property and get a tailored shortlist.
              </p>
              <div className="mt-4 space-y-3">
                <a className="flex items-center gap-3 text-white hover:text-[#C9A24D] transition-colors" href={`tel:${property.agent?.phone}`}>
                  <FaPhoneAlt className="w-4 h-4" />
                  <span className="truncate">{property.agent?.phone}</span>
                </a>
                <a className="flex items-center gap-3 text-white hover:text-[#C9A24D] transition-colors" href={`https://wa.me/?text=I%20am%20interested%20in%20${encodeURIComponent(property.title)}`} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
              <div className="mt-5">
                <Button text="Request Info" fullWidth className="w-full" />
              </div>
            </section>

            {/* Schedule a tour */}
            <section aria-label="Schedule a tour" className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-black">Schedule a tour</h2>
              <p className="text-[#717171] text-sm mt-2">
                Choose a date and time. We’ll confirm availability shortly.
              </p>
              <form className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-[#666] flex items-center gap-2 mb-1">
                    <FaRegCalendarAlt className="w-4 h-4" /> Date
                  </span>
                  <input type="date" className="w-full px-3 py-2.5 bg-white border border-[#e1e1e1] rounded-xl text-sm text-black focus:border-[#B8862E] focus:outline-none cursor-pointer" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-[#666] flex items-center gap-2 mb-1">
                    <FaRegClock className="w-4 h-4" /> Time
                  </span>
                  <input type="time" className="w-full px-3 py-2.5 bg-white border border-[#e1e1e1] rounded-xl text-sm text-black focus:border-[#B8862E] focus:outline-none cursor-pointer" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-[#666] mb-1 block">Name</span>
                  <input type="text" placeholder="Your name" className="w-full px-3 py-2.5 bg-white border border-[#e1e1e1] rounded-xl text-sm text-black focus:border-[#B8862E] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-[#666] mb-1 block">Phone</span>
                  <input type="tel" placeholder="+971..." className="w-full px-3 py-2.5 bg-white border border-[#e1e1e1] rounded-xl text-sm text-black focus:border-[#B8862E] focus:outline-none" />
                </label>
                <div className="pt-2">
                  <Button text="Request Tour" fullWidth className="w-full" />
                </div>
                <p className="text-xs text-[#999]">
                  By submitting, you agree to be contacted by Next Prime Real Estate.
                </p>
              </form>
            </section>
          </aside>
        </div>
      </main>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/80 z-100 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close gallery"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="absolute left-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
            onClick={() => setActivePhotoIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous photo"
            disabled={activePhotoIndex === 0}
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="absolute right-4 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
            onClick={() => setActivePhotoIndex((i) => Math.min(photos.length - 1, i + 1))}
            aria-label="Next photo"
            disabled={activePhotoIndex >= photos.length - 1}
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
          <div className="w-full max-w-5xl">
            <img src={activePhoto} alt={`${property.title} photo ${activePhotoIndex + 1}`} className="w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default PropertyDetails

