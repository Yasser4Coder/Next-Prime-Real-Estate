import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../../components/Header'
import PropertieBlackCard from '../../components/PropertieBlackCard'
import PropertiesFilter from './components/PropertiesFilter'
import allPropertiesData from './data/allPropertiesData'
import { useSiteData } from '../../context/DashboardStore'
import {
  LOCATIONS as FILTER_LOCATIONS,
  PRICE_RANGES_BUY,
  PRICE_RANGES_RENT,
  PRICE_MAX_OPTIONS_BUY,
  PRICE_MAX_OPTIONS_RENT,
} from './data/filterOptions'
import { setSeoMeta } from '../../utils/seo'
import { fadeIn } from '../../utils/motion'

const PER_PAGE = 12

const Properties = () => {
  const [searchParams] = useSearchParams()
  const siteData = useSiteData()
  const allProperties = siteData?.properties?.length ? siteData.properties : allPropertiesData
  const [purpose, setPurpose] = useState('buy')
  const [location, setLocation] = useState('All Areas')
  const [propertyType, setPropertyType] = useState('All Types')
  const locationOptions = useMemo(() => {
    const list = purpose === 'rent'
      ? (siteData?.locationsListRent?.length ? siteData.locationsListRent : FILTER_LOCATIONS.filter((l) => l !== 'All Areas'))
      : (siteData?.locationsListBuy?.length ? siteData.locationsListBuy : FILTER_LOCATIONS.filter((l) => l !== 'All Areas'))
    return ['All Areas', ...list]
  }, [purpose, siteData?.locationsListBuy, siteData?.locationsListRent])
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  // Sync filter state from URL whenever search params change (e.g. from header or hero search)
  useEffect(() => {
    const purposeParam = searchParams.get('purpose')
    const locationParam = searchParams.get('location')
    const typeParam = searchParams.get('type')
    const priceMinParam = searchParams.get('priceMin')
    const priceMaxParam = searchParams.get('priceMax')
    if (purposeParam === 'rent' || purposeParam === 'buy') setPurpose(purposeParam)
    if (locationParam != null && locationParam !== '') setLocation(locationParam)
    if (typeParam != null && typeParam !== '') setPropertyType(typeParam)
    if (priceMinParam != null) setPriceMin(priceMinParam)
    if (priceMaxParam !== null && priceMaxParam !== undefined) setPriceMax(priceMaxParam)
    setPage(1)
  }, [searchParams])

  const priceRanges = purpose === 'rent' ? PRICE_RANGES_RENT : PRICE_RANGES_BUY
  const priceMaxOpts = purpose === 'rent' ? PRICE_MAX_OPTIONS_RENT : PRICE_MAX_OPTIONS_BUY

  const filteredAndSorted = useMemo(() => {
    let list = allProperties.filter((p) => p.purpose === purpose)

    if (location && location !== 'All Areas') {
      const locNorm = location.trim().toLowerCase()
      list = list.filter((p) => {
        const pLoc = (p.location || '').toString().trim().toLowerCase()
        return pLoc === locNorm
      })
    }
    if (propertyType && propertyType !== 'All Types') {
      list = list.filter((p) => p.type === propertyType)
    }
    if (bedrooms) {
      const num = bedrooms === '5' ? 5 : parseInt(bedrooms, 10)
      list = list.filter((p) => p.bedrooms >= num)
    }
    if (bathrooms) {
      const num = bathrooms === '4' ? 4 : parseInt(bathrooms, 10)
      list = list.filter((p) => p.bathrooms >= num)
    }
    if (priceMin) {
      const range = priceRanges.find((r) => r.value === priceMin)
      if (range?.min != null) list = list.filter((p) => p.price >= range.min)
    }
    if (priceMax) {
      const opt = priceMaxOpts.find((r) => r.value === priceMax)
      if (opt?.max != null) list = list.filter((p) => p.price <= opt.max)
    }

    const sorted = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return b.id - a.id
    })
    return sorted
  }, [
    allProperties,
    purpose,
    location,
    propertyType,
    bedrooms,
    bathrooms,
    priceMin,
    priceMax,
    sort,
    priceRanges,
    priceMaxOpts,
  ])

  const totalPages = Math.ceil(filteredAndSorted.length / PER_PAGE) || 1
  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filteredAndSorted.slice(start, start + PER_PAGE)
  }, [filteredAndSorted, page])

  const onApply = useCallback(() => {
    setPage(1)
  }, [])

  const goToPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  useEffect(() => {
    setSeoMeta({
      title: 'Properties for Sale & Rent in Dubai | Next Prime Real Estate',
      description:
        'Browse properties for sale and rent in Dubai. Villas, apartments, townhouses & more in Dubai Marina, Downtown, Palm Jumeirah. Find your next home with Next Prime Real Estate.',
      canonical: 'https://www.nextprimerealestate.com/properties',
    })
  }, [])

  return (
    <motion.div className="min-h-screen bg-white" {...fadeIn}>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[#666]">
              <li>
                <Link to="/" className="hover:text-[#B8862E] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-[#262626] font-medium" aria-current="page">
                Properties
              </li>
            </ol>
          </nav>

          <header className="mb-7 sm:mb-9">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight">
              Properties in Dubai
            </h1>
            <p className="mt-2 text-[#717171] text-sm sm:text-base max-w-2xl">
              Find your perfect property for sale or rent across Dubai Marina, Downtown, Palm Jumeirah and more.
            </p>
          </header>

          {/* Filter */}
          <section aria-label="Property filters" className="mb-7 sm:mb-9">
            <PropertiesFilter
              purpose={purpose}
              setPurpose={setPurpose}
              location={location}
              setLocation={setLocation}
              locationOptions={locationOptions}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              bedrooms={bedrooms}
              setBedrooms={setBedrooms}
              bathrooms={bathrooms}
              setBathrooms={setBathrooms}
              priceMin={priceMin}
              setPriceMin={setPriceMin}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              sort={sort}
              setSort={setSort}
              onApply={onApply}
              resultCount={filteredAndSorted.length}
            />
          </section>

          {/* Results */}
          <section aria-label="Property listings">
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-[#666] text-sm">
                Showing {paginated.length} of {filteredAndSorted.length}{' '}
                {filteredAndSorted.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            {paginated.length === 0 ? (
              <div className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-12 text-center">
                <p className="text-[#717171] text-lg">
                  No properties match your filters. Try adjusting your search.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                  },
                }}
              >
                {paginated.map((property) => (
                  <motion.div
                    key={property.id}
                    variants={{
                      initial: { opacity: 0, y: 12 },
                      animate: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <PropertieBlackCard
                      propId={property.id}
                      propTitle={property.title}
                      propDesc={property.description}
                      propPrice={property.price}
                      propImage={property.image}
                      propType={property.type}
                      propBath={property.bathrooms}
                      propBed={property.bedrooms}
                      propStatus={property.overview?.status ?? ''}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10 pt-8 border-t border-[#e1e1e1]">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="p-3 rounded-full border border-[#262626] hover:bg-[#f5f5f5] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    className={`min-w-10 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      page === p
                        ? 'bg-[#B8862E] text-white'
                        : 'bg-white border border-[#e1e1e1] text-black hover:border-[#B8862E]'
                    } cursor-pointer`}
                    aria-label={`Page ${p}`}
                    aria-current={page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-3 rounded-full border border-[#262626] hover:bg-[#f5f5f5] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </section>
      </main>
    </motion.div>
  )
}

export default Properties
