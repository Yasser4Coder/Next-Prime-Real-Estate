import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../assets/logo/gold_logo.webp'
import Button from './Button'
import { LOCATIONS as FALLBACK_LOCATIONS } from '../pages/home/data/SearchBarData'
import { useSiteData } from '../context/DashboardStore'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/#services', label: 'Services' },
  { path: '/about', label: 'About' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null) // 'buy' | 'rent' | null
  const buyRentRef = useRef(null)
  const location = useLocation()
  const siteData = useSiteData()
  const LOCATIONS_BUY = (siteData?.locationsListBuy?.length ? siteData.locationsListBuy : FALLBACK_LOCATIONS)
  const LOCATIONS_RENT = (siteData?.locationsListRent?.length ? siteData.locationsListRent : FALLBACK_LOCATIONS)

  const closeMenu = () => setIsMenuOpen(false)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/properties') return location.pathname === '/properties'
    if (path === '/about') return location.pathname === '/about'
    return false
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buyRentRef.current && !buyRentRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const linkBase =
    'relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#262626]'
  const linkActive =
    'text-[#C9A24D] bg-white/5'

  const linkContent = (link) => {
    const active = isActive(link.path)
    const cls = `${linkBase} ${active ? linkActive : ''}`
    if (link.path.startsWith('/#')) {
      return (
        <a
          href={link.path}
          className={cls}
          onClick={closeMenu}
        >
          {link.label}
        </a>
      )
    }
    return (
      <Link
        to={link.path}
        className={cls}
        onClick={closeMenu}
        aria-current={active ? 'page' : undefined}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <motion.header
      className="bg-[#262626] text-white sticky top-0 z-50 border-b border-white/10 shadow-sm shadow-black/20"
      role="banner"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center gap-3">
          <Link
            to="/"
            className="logo w-[72px] h-[62px] cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 rounded block"
            aria-label="Next Prime Real Estate - Dubai - Home"
          >
            <img
              src={logo}
              alt="Next Prime Real Estate Dubai - Luxury property experts"
              width={72}
              height={62}
              fetchPriority="high"
            />
          </Link>

          <nav
            ref={buyRentRef}
            className="hidden lg:flex justify-center items-center gap-1"
            aria-label="Main navigation"
          >
            {linkContent(navLinks[0])}
            {/* Buy - dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === 'buy' ? null : 'buy'))}
                className={`${linkBase} ${openDropdown === 'buy' ? linkActive : ''} flex items-center gap-1 cursor-pointer`}
                aria-expanded={openDropdown === 'buy'}
                aria-haspopup="true"
              >
                Buy
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'buy' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openDropdown === 'buy' && (
                  <motion.div
                    className="absolute left-0 top-full mt-1 min-w-[200px] py-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/30 z-50"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/properties?purpose=buy"
                      onClick={() => { setOpenDropdown(null); closeMenu() }}
                      className="block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10"
                    >
                      View all for sale
                    </Link>
                    {LOCATIONS_BUY.map((loc) => (
                      <Link
                        key={loc}
                        to={`/properties?purpose=buy&location=${encodeURIComponent(loc)}`}
                        onClick={() => { setOpenDropdown(null); closeMenu() }}
                        className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10"
                      >
                        {loc}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Rent - dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === 'rent' ? null : 'rent'))}
                className={`${linkBase} ${openDropdown === 'rent' ? linkActive : ''} flex items-center gap-1 cursor-pointer`}
                aria-expanded={openDropdown === 'rent'}
                aria-haspopup="true"
              >
                Rent
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'rent' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openDropdown === 'rent' && (
                  <motion.div
                    className="absolute left-0 top-full mt-1 min-w-[200px] py-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/30 z-50"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/properties?purpose=rent"
                      onClick={() => { setOpenDropdown(null); closeMenu() }}
                      className="block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10"
                    >
                      View all for rent
                    </Link>
                    {LOCATIONS_RENT.map((loc) => (
                      <Link
                        key={loc}
                        to={`/properties?purpose=rent&location=${encodeURIComponent(loc)}`}
                        onClick={() => { setOpenDropdown(null); closeMenu() }}
                        className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10"
                      >
                        {loc}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.slice(1).map((link) => (
              <React.Fragment key={link.path}>{linkContent(link)}</React.Fragment>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0 pl-4 border-l border-white/10">
            <a
              href={siteData?.contact?.phoneTel ? `tel:${siteData.contact.phoneTel}` : 'tel:+971527780718'}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#262626]"
              aria-label="Call us"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden xl:inline">Call</span>
            </a>
            <Button text="Contact us" to="/#contact" className="text-sm" />
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg text-white/90 cursor-pointer hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#262626]"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            className="fixed inset-0 lg:hidden z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden={!isMenuOpen}
          >
            {/* Backdrop */}
            <button
              type="button"
              className="absolute inset-0 bg-black/50 cursor-pointer"
              aria-label="Close menu"
              onClick={closeMenu}
            />

            {/* Drawer */}
            <motion.nav
              className="absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-[#262626] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
              aria-label="Mobile navigation"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center justify-between px-5 py-6 shrink-0">
                <p className="text-sm font-semibold text-white/90">Menu</p>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2 rounded-lg cursor-pointer hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E]"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 flex flex-col gap-2">
                <div className="border-b border-white/10 pb-2">
                  {linkContent(navLinks[0])}
                </div>
                <div className="border-b border-white/10 pb-2">
                  <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#C9A24D]">Buy</p>
                  <Link to="/properties?purpose=buy" onClick={closeMenu} className="block px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/5">
                    View all for sale
                  </Link>
                  {LOCATIONS_BUY.map((loc) => (
                    <Link
                      key={loc}
                      to={`/properties?purpose=buy&location=${encodeURIComponent(loc)}`}
                      onClick={closeMenu}
                      className="block px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/5"
                    >
                      {loc}
                    </Link>
                  ))}
                </div>
                <div className="border-b border-white/10 pb-2">
                  <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#C9A24D]">Rent</p>
                  <Link to="/properties?purpose=rent" onClick={closeMenu} className="block px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/5">
                    View all for rent
                  </Link>
                  {LOCATIONS_RENT.map((loc) => (
                    <Link
                      key={loc}
                      to={`/properties?purpose=rent&location=${encodeURIComponent(loc)}`}
                      onClick={closeMenu}
                      className="block px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/5"
                    >
                      {loc}
                    </Link>
                  ))}
                </div>
                {navLinks.slice(1).map((link) => (
                  <div key={link.path} className="border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                    {linkContent(link)}
                  </div>
                ))}
              </div>

              <div className="px-5 py-5 border-t border-white/10 flex flex-col gap-3 shrink-0">
                <Button text="Contact us" to="/#contact" fullWidth className="text-sm" />
                <a
                  href={siteData?.contact?.phoneTel ? `tel:${siteData.contact.phoneTel}` : 'tel:+971527780718'}
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-white/90 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                  aria-label="Call us"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call us
                </a>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
