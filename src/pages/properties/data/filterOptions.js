// Dubai real estate filter options – aligned with Property Finder / Bayut style
export const PURPOSE_OPTIONS = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'off-plan', label: 'Off Plan' },
]

export const LOCATIONS = [
  'All Areas',
  'Dubai Marina',
  'Downtown Dubai',
  'Palm Jumeirah',
  'JBR (Jumeirah Beach Residence)',
  'Business Bay',
  'Arabian Ranches',
  'Dubai Hills Estate',
  'Jumeirah Village Circle',
  'Dubai Creek Harbour',
  'Emaar Beachfront',
  'Jumeirah Lake Towers',
  'Al Barsha',
  'Dubai Silicon Oasis',
]

export const PROPERTY_TYPES = [
  'All Types',
  'Villa',
  'Apartment',
  'Townhouse',
  'Penthouse',
  'Studio',
  'Duplex',
]

export const BEDROOMS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' },
]

export const BATHROOMS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
]

export const PRICE_RANGES_BUY = [
  { value: '', label: 'No min', min: null, max: null },
  { value: '0-500000', label: 'Under 500K AED', min: 0, max: 500000 },
  { value: '500000-1000000', label: '500K - 1M AED', min: 500000, max: 1000000 },
  { value: '1000000-2000000', label: '1M - 2M AED', min: 1000000, max: 2000000 },
  { value: '2000000-5000000', label: '2M - 5M AED', min: 2000000, max: 5000000 },
  { value: '5000000-10000000', label: '5M - 10M AED', min: 5000000, max: 10000000 },
  { value: '10000000-', label: '10M+ AED', min: 10000000, max: null },
]

export const PRICE_RANGES_RENT = [
  { value: '', label: 'No min', min: null, max: null },
  { value: '0-50000', label: 'Under 50K AED/year', min: 0, max: 50000 },
  { value: '50000-100000', label: '50K - 100K AED/year', min: 50000, max: 100000 },
  { value: '100000-200000', label: '100K - 200K AED/year', min: 100000, max: 200000 },
  { value: '200000-500000', label: '200K - 500K AED/year', min: 200000, max: 500000 },
  { value: '500000-', label: '500K+ AED/year', min: 500000, max: null },
]

export const PRICE_MAX_OPTIONS_BUY = [
  { value: '', label: 'No max', min: null, max: null },
  { value: '500000', label: '500K AED', min: null, max: 500000 },
  { value: '1000000', label: '1M AED', min: null, max: 1000000 },
  { value: '2000000', label: '2M AED', min: null, max: 2000000 },
  { value: '5000000', label: '5M AED', min: null, max: 5000000 },
  { value: '10000000', label: '10M AED', min: null, max: 10000000 },
  { value: '-', label: '10M+ AED', min: null, max: null },
]

export const PRICE_MAX_OPTIONS_RENT = [
  { value: '', label: 'No max', min: null, max: null },
  { value: '50000', label: '50K AED/year', min: null, max: 50000 },
  { value: '100000', label: '100K AED/year', min: null, max: 100000 },
  { value: '200000', label: '200K AED/year', min: null, max: 200000 },
  { value: '500000', label: '500K AED/year', min: null, max: 500000 },
  { value: '-', label: '500K+ AED/year', min: null, max: null },
]

// Off-plan uses same price ranges as buy
export const PRICE_RANGES_OFF_PLAN = PRICE_RANGES_BUY
export const PRICE_MAX_OPTIONS_OFF_PLAN = PRICE_MAX_OPTIONS_BUY

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]
