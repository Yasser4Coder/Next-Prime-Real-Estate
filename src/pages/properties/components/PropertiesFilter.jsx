import React, { useState, useEffect } from 'react'
import { FaSearch, FaSlidersH } from 'react-icons/fa'
import {
  PURPOSE_OPTIONS,
  LOCATIONS,
  PROPERTY_TYPES,
  BEDROOMS_OPTIONS,
  BATHROOMS_OPTIONS,
  PRICE_RANGES_BUY,
  PRICE_RANGES_RENT,
  PRICE_MAX_OPTIONS_BUY,
  PRICE_MAX_OPTIONS_RENT,
  SORT_OPTIONS,
} from '../data/filterOptions'

const PropertiesFilter = ({
  purpose,
  setPurpose,
  location,
  setLocation,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  sort,
  setSort,
  onApply,
  resultCount,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const panelRef = React.useRef(null)
  const priceRanges = purpose === 'rent' ? PRICE_RANGES_RENT : PRICE_RANGES_BUY
  const priceMaxOptions =
    purpose === 'rent' ? PRICE_MAX_OPTIONS_RENT : PRICE_MAX_OPTIONS_BUY

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectClass =
    'w-full px-3 py-2 bg-white border border-[#e1e1e1] rounded-xl text-sm text-black cursor-pointer focus:border-[#B8862E] focus:outline-none appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23666\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_0.5rem_center] bg-no-repeat pr-9'

  return (
    <div ref={panelRef} className="bg-[#FCFCFD] border border-[#e1e1e1] rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Purpose tabs */}
      <div className="flex gap-2 mb-4">
        {PURPOSE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setPurpose(value)
              setPriceMin('')
              setPriceMax('')
            }}
            className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              purpose === value
                ? 'bg-[#B8862E] text-white'
                : 'bg-[#e8e8e8] text-[#666] hover:bg-[#ddd]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Desktop: full filter row */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#666] mb-1">
            Location
          </label>
          <select
            value={location === 'All Areas' ? '' : location}
            onChange={(e) => setLocation(e.target.value || 'All Areas')}
            className={selectClass}
            aria-label="Select location"
          >
            <option value="">All Areas</option>
            {LOCATIONS.filter((l) => l !== 'All Areas').map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#666] mb-1">
            Property Type
          </label>
          <select
            value={propertyType === 'All Types' ? '' : propertyType}
            onChange={(e) => setPropertyType(e.target.value || 'All Types')}
            className={selectClass}
            aria-label="Select property type"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.filter((t) => t !== 'All Types').map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#666] mb-1">
            Bedrooms
          </label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={selectClass}
            aria-label="Select bedrooms"
          >
            {BEDROOMS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#666] mb-1">
            Bathrooms
          </label>
          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className={selectClass}
            aria-label="Select bathrooms"
          >
            {BATHROOMS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#666] mb-1">
            Min Price
          </label>
          <select
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className={selectClass}
            aria-label="Select minimum price"
          >
            {priceRanges.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#666] mb-1">
            Max Price
          </label>
          <select
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className={selectClass}
            aria-label="Select maximum price"
          >
            {priceMaxOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile: Filters toggle + panel */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFilterOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-[#262626] text-white rounded-xl text-sm font-medium cursor-pointer"
          >
            <FaSlidersH className="w-4 h-4" />
            Filters
          </button>
          {resultCount != null && (
            <span className="text-sm text-[#666]">
              {resultCount} {resultCount === 1 ? 'property' : 'properties'}
            </span>
          )}
        </div>
        {isFilterOpen && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e1e1e1]">
            <div>
              <label className="block text-xs font-medium text-[#666] mb-1">
                Location
              </label>
              <select
                value={location === 'All Areas' ? '' : location}
                onChange={(e) => setLocation(e.target.value || 'All Areas')}
                className={selectClass}
              >
                <option value="">All Areas</option>
                {LOCATIONS.filter((l) => l !== 'All Areas').map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666] mb-1">
                Type
              </label>
              <select
                value={propertyType === 'All Types' ? '' : propertyType}
                onChange={(e) => setPropertyType(e.target.value || 'All Types')}
                className={selectClass}
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.filter((t) => t !== 'All Types').map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666] mb-1">
                Beds
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={selectClass}
              >
                {BEDROOMS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666] mb-1">
                Baths
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className={selectClass}
              >
                {BATHROOMS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#666] mb-1">
                Min Price
              </label>
              <select
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className={selectClass}
              >
                {priceRanges.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#666] mb-1">
                Max Price
              </label>
              <select
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className={selectClass}
              >
                {priceMaxOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Sort + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-[#e1e1e1]">
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-[#666] shrink-0">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-white border border-[#e1e1e1] rounded-xl text-sm sm:text-base text-black focus:border-[#B8862E] focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#B8862E] text-white rounded-xl font-medium hover:bg-[#A67A28] transition-colors shrink-0 cursor-pointer"
        >
          <FaSearch className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  )
}

export default PropertiesFilter
