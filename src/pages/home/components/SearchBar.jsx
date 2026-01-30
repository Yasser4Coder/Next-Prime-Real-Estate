import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import searchIcon from '../../../assets/icons/search-icon.svg'
import locationIcon from '../../../assets/icons/location-icon.svg'
import arrowDownIcon from '../../../assets/icons/arrow-down-icon.svg'
import {
  LOCATIONS,
  PROPERTY_TYPES,
  PRICE_RANGES_BUY,
  PRICE_RANGES_RENT,
} from '../data/SearchBarData'

const LISTING_TYPES = [
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
  { key: 'sell', label: 'Sell' },
]

const SearchBar = () => {
  const navigate = useNavigate()
  const [listingType, setListingType] = useState('rent')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  const containerRef = useRef(null)

  const priceRanges = listingType === 'rent' ? PRICE_RANGES_RENT : PRICE_RANGES_BUY

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
    const purpose = listingType === 'sell' ? 'buy' : listingType
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
    if (purpose === 'buy') {
      const map = { '0-500000': '500000', '500000-1000000': '1000000', '1000000-2000000': '2000000', '2000000-5000000': '5000000', '5000000-': '-' }
      return map[rangeValue] ?? ''
    }
    return ''
  }

  return (
    <div className="w-full max-w-3xl" ref={containerRef}>
      <div className="flex gap-2 sm:gap-3 items-center text-white text-xs sm:text-sm">
        {LISTING_TYPES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setListingType(key)}
            className={`cursor-pointer px-3 sm:px-5 rounded-t-2xl py-2 transition-colors ${
              listingType === key
                ? 'bg-white text-black'
                : 'bg-transparent hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-5 bg-[#ffffffdb] px-4 sm:px-5 py-3.5 sm:py-4 rounded-b-2xl rounded-tr-2xl md:max-w-full">
        {/* Location */}
        <div className="flex-1 min-w-0 md:pr-6 md:border-r border-[#ffffff] relative">
          <h2 className="text-sm sm:text-base font-semibold text-black">
            Location
          </h2>
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) => (prev === 'location' ? null : 'location'))
            }
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
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
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
              aria-hidden
            />
          </button>
          {openDropdown === 'location' && (
            <ul
              className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e1e1e1] rounded-xl shadow-lg max-h-48 overflow-y-auto z-20 py-1"
              role="listbox"
            >
              <li role="option" aria-selected={!location}>
                <button
                  type="button"
                  onClick={() => {
                    setLocation('')
                    closeDropdown()
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#8F90A6] hover:bg-[#f5f5f5] cursor-pointer"
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
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f5f5f5] ${
                      location === loc ? 'text-[#B8862E] font-medium' : 'text-black'
                    } cursor-pointer`}
                  >
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Property Type */}
        <div className="flex-1 min-w-0 md:pr-6 md:border-r border-[#ffffff] relative">
          <h2 className="text-sm sm:text-base font-semibold text-black">
            Property Type
          </h2>
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'propertyType' ? null : 'propertyType'
              )
            }
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
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
            <ul
              className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e1e1e1] rounded-xl shadow-lg max-h-48 overflow-y-auto z-20 py-1"
              role="listbox"
            >
              <li role="option" aria-selected={!propertyType}>
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType('')
                    closeDropdown()
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#8F90A6] hover:bg-[#f5f5f5] cursor-pointer"
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
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f5f5f5] ${
                      propertyType === type
                        ? 'text-[#B8862E] font-medium'
                        : 'text-black'
                    } cursor-pointer`}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Range */}
        <div className="flex-1 min-w-0 relative">
          <h2 className="text-sm sm:text-base font-semibold text-black">
            Price Range
          </h2>
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'priceRange' ? null : 'priceRange'
              )
            }
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
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
            <ul
              className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e1e1e1] rounded-xl shadow-lg max-h-48 overflow-y-auto z-20 py-1"
              role="listbox"
            >
              {priceRanges.map(({ label, value }) => (
                <li key={value || 'any'} role="option" aria-selected={priceRange === value}>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceRange(value)
                      closeDropdown()
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f5f5f5] ${
                      priceRange === value
                        ? 'text-[#B8862E] font-medium'
                        : value
                          ? 'text-black'
                          : 'text-[#8F90A6]'
                    } cursor-pointer`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="p-3.5 sm:p-4 rounded-2xl cursor-pointer bg-[#C9A24D] hover:bg-[#B8862E] transition-colors shrink-0 self-center md:self-auto active:scale-95"
          aria-label="Search properties"
        >
          <img
            src={searchIcon}
            alt=""
            className="w-5 h-5"
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}

export default SearchBar
