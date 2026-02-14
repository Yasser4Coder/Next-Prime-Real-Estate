import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import searchIcon from '../../../assets/icons/search-icon.svg'
import locationIcon from '../../../assets/icons/location-icon.svg'
import arrowDownIcon from '../../../assets/icons/arrow-down-icon.svg'
import {
  LOCATIONS as FALLBACK_LOCATIONS,
  PROPERTY_TYPES,
  PRICE_RANGES_BUY,
  PRICE_RANGES_RENT,
} from '../data/SearchBarData'
import { useSiteData } from '../../../context/DashboardStore'

const LISTING_TYPES = [
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
  { key: 'sell', label: 'Sell' },
  { key: 'off-plan', label: 'Off Plan' },
]

const SearchBar = () => {
  const navigate = useNavigate()
  const siteData = useSiteData()
  const [listingType, setListingType] = useState('rent')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  const containerRef = useRef(null)

  const LOCATIONS_BUY = (siteData?.locationsListBuy?.length ? siteData.locationsListBuy : FALLBACK_LOCATIONS)
  const LOCATIONS_RENT = (siteData?.locationsListRent?.length ? siteData.locationsListRent : FALLBACK_LOCATIONS)
  const LOCATIONS_OFF_PLAN = (siteData?.locationsListOffPlan?.length ? siteData.locationsListOffPlan : FALLBACK_LOCATIONS)
  const LOCATIONS = listingType === 'rent' ? LOCATIONS_RENT : listingType === 'off-plan' ? LOCATIONS_OFF_PLAN : LOCATIONS_BUY
  const priceRanges = listingType === 'rent' ? PRICE_RANGES_RENT : (listingType === 'off-plan' || listingType === 'sell') ? PRICE_RANGES_BUY : PRICE_RANGES_BUY

  useEffect(() => {
    setPriceRange('')
  }, [listingType])

  const locationLabel = location || 'Select Your City'
  const propertyTypeLabel = propertyType || 'Select Type'
  const priceRangeLabel =
    priceRanges.find((r) => r.value === priceRange)?.label || 'Select Range'

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeDropdown = () => setOpenDropdown(null)

  const handleSearch = () => {
    const purpose = listingType === 'sell' ? 'buy' : listingType === 'off-plan' ? 'off-plan' : listingType
    const searchParams = new URLSearchParams()
    searchParams.set('purpose', purpose)
    if (location) searchParams.set('location', location)
    if (propertyType) searchParams.set('type', propertyType)
    if (priceRange) {
      searchParams.set('priceMin', priceRange)
      const maxFromRange = getPriceMaxForRange(purpose, priceRange)
      if (maxFromRange) searchParams.set('priceMax', maxFromRange)
    }
    navigate(`/properties?${searchParams.toString()}`)
  }

  function getPriceMaxForRange(purpose, rangeValue) {
    if (!rangeValue) return ''
    if (purpose === 'rent') {
      const map = { '0-50000': '50000', '50000-100000': '100000', '100000-200000': '200000', '200000-500000': '500000', '500000-': '-' }
      return map[rangeValue] ?? ''
    }
    if (purpose === 'buy' || purpose === 'off-plan') {
      const map = { '0-500000': '500000', '500000-1000000': '1000000', '1000000-2000000': '2000000', '2000000-5000000': '5000000', '5000000-': '-' }
      return map[rangeValue] ?? ''
    }
    return ''
  }

  const dropdownListClass =
    'absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#e1e1e1] rounded-xl shadow-xl max-h-[min(16rem,60vh)] sm:max-h-48 overflow-y-auto overflow-x-hidden z-20 py-1 overscroll-contain'
  const dropdownItemClass =
    'w-full text-left px-4 py-3 sm:py-2 text-sm min-h-[44px] sm:min-h-0 flex items-center hover:bg-[#f5f5f5] active:bg-[#eee] cursor-pointer transition-colors'

  return (
    <div className="w-full max-w-3xl" ref={containerRef}>
      {/* Rent / Buy / Sell tabs - larger touch targets on mobile */}
      <div className="flex gap-1 sm:gap-3 items-stretch text-white text-xs sm:text-sm">
        {LISTING_TYPES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setListingType(key)}
            className={`flex-1 sm:flex-none cursor-pointer px-4 sm:px-5 rounded-t-2xl py-3 sm:py-2 min-h-[44px] sm:min-h-0 flex items-center justify-center transition-colors touch-manipulation ${
              listingType === key
                ? 'bg-white text-black font-semibold'
                : 'bg-white/20 hover:bg-white/25 active:bg-white/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-5 bg-[#ffffffeb] sm:bg-[#ffffffdb] px-4 sm:px-5 py-4 sm:py-4 rounded-b-2xl md:rounded-tr-2xl md:max-w-full shadow-lg md:shadow-none">
        {/* Location */}
        <div className="flex-1 min-w-0 py-3 sm:py-0 md:pr-6 md:border-r border-b md:border-b-0 border-[#e8e8e8] md:border-[#ffffff] relative first:pt-0">
          <h2 className="text-xs sm:text-base font-semibold text-black mb-1 sm:mb-0">
            Location
          </h2>
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) => (prev === 'location' ? null : 'location'))
            }
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer py-2 sm:py-0 -mx-1 px-1 min-h-[44px] sm:min-h-0 touch-manipulation"
            aria-expanded={openDropdown === 'location'}
            aria-haspopup="listbox"
            aria-label="Select city"
          >
            <p
              className={`text-sm sm:text-base truncate ${
                location ? 'text-black font-medium' : 'text-[#8F90A6] font-normal'
              }`}
            >
              {locationLabel}
            </p>
            <img
              src={locationIcon}
              alt=""
              className="w-5 h-5 shrink-0"
              aria-hidden
            />
          </button>
          {openDropdown === 'location' && (
            <ul className={dropdownListClass} role="listbox">
              <li role="option" aria-selected={!location}>
                <button
                  type="button"
                  onClick={() => {
                    setLocation('')
                    closeDropdown()
                  }}
                  className={`${dropdownItemClass} text-[#8F90A6]`}
                >
                  Select Your City
                </button>
              </li>
              {LOCATIONS.map((loc) => (
                <li key={loc} role="option" aria-selected={location === loc}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocation(loc)
                      closeDropdown()
                    }}
                    className={`${dropdownItemClass} ${
                      location === loc ? 'text-[#B8862E] font-medium' : 'text-black'
                    }`}
                  >
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Property Type */}
        <div className="flex-1 min-w-0 py-3 sm:py-0 md:pr-6 md:border-r border-b md:border-b-0 border-[#e8e8e8] md:border-[#ffffff] relative">
          <h2 className="text-xs sm:text-base font-semibold text-black mb-1 sm:mb-0">
            Property Type
          </h2>
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'propertyType' ? null : 'propertyType'
              )
            }
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer py-2 sm:py-0 -mx-1 px-1 min-h-[44px] sm:min-h-0 touch-manipulation"
            aria-expanded={openDropdown === 'propertyType'}
            aria-haspopup="listbox"
            aria-label="Select property type"
          >
            <p
              className={`text-sm sm:text-base truncate ${
                propertyType
                  ? 'text-black font-medium'
                  : 'text-[#8F90A6] font-normal'
              }`}
            >
              {propertyTypeLabel}
            </p>
            <img
              src={arrowDownIcon}
              alt=""
              className={`w-5 h-5 shrink-0 transition-transform ${
                openDropdown === 'propertyType' ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </button>
          {openDropdown === 'propertyType' && (
            <ul className={dropdownListClass} role="listbox">
              <li role="option" aria-selected={!propertyType}>
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType('')
                    closeDropdown()
                  }}
                  className={`${dropdownItemClass} text-[#8F90A6]`}
                >
                  Select Type
                </button>
              </li>
              {PROPERTY_TYPES.map((type) => (
                <li key={type} role="option" aria-selected={propertyType === type}>
                  <button
                    type="button"
                    onClick={() => {
                      setPropertyType(type)
                      closeDropdown()
                    }}
                    className={`${dropdownItemClass} ${
                      propertyType === type
                        ? 'text-[#B8862E] font-medium'
                        : 'text-black'
                    }`}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Range */}
        <div className="flex-1 min-w-0 py-3 sm:py-0 relative">
          <h2 className="text-xs sm:text-base font-semibold text-black mb-1 sm:mb-0">
            Price Range
          </h2>
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'priceRange' ? null : 'priceRange'
              )
            }
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer py-2 sm:py-0 -mx-1 px-1 min-h-[44px] sm:min-h-0 touch-manipulation"
            aria-expanded={openDropdown === 'priceRange'}
            aria-haspopup="listbox"
            aria-label="Select price range"
          >
            <p
              className={`text-sm sm:text-base truncate ${
                priceRange ? 'text-black font-medium' : 'text-[#8F90A6] font-normal'
              }`}
            >
              {priceRangeLabel}
            </p>
            <img
              src={arrowDownIcon}
              alt=""
              className={`w-5 h-5 shrink-0 transition-transform ${
                openDropdown === 'priceRange' ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </button>
          {openDropdown === 'priceRange' && (
            <ul className={dropdownListClass} role="listbox">
              {priceRanges.map(({ label, value }) => (
                <li key={value || 'any'} role="option" aria-selected={priceRange === value}>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceRange(value)
                      closeDropdown()
                    }}
                    className={`${dropdownItemClass} ${
                      priceRange === value
                        ? 'text-[#B8862E] font-medium'
                        : value
                          ? 'text-black'
                          : 'text-[#8F90A6]'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search button - full width on mobile, prominent CTA */}
        <button
          type="button"
          onClick={handleSearch}
          className="w-full md:w-auto py-4 sm:py-4 px-6 rounded-2xl cursor-pointer bg-[#B8862E] hover:bg-[#A67C2A] text-white font-semibold text-base sm:text-inherit sm:font-normal flex items-center justify-center gap-2 shrink-0 mt-2 md:mt-0 active:scale-[0.98] touch-manipulation min-h-[48px]"
          aria-label="Search properties"
        >
          <img
            src={searchIcon}
            alt=""
            className="w-5 h-5 shrink-0"
            aria-hidden
          />
          <span className="md:sr-only">Search</span>
        </button>
      </div>
    </div>
  )
}

export default SearchBar
