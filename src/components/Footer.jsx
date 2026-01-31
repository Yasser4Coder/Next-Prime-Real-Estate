import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo/gold_logo.webp'
import { useSiteData } from '../context/DashboardStore'

const footerColumns = [
  {
    title: 'Home',
    links: [
      { to: '/#home', label: 'Hero Section' },
      { to: '/#areas', label: 'Features' },
      { to: '/#properties', label: 'Properties' },
      { to: '/#testimonials', label: 'Testimonials' },
      { to: '/#faq', label: "FAQ's" },
    ],
  },
  {
    title: 'About Us',
    links: [
      { to: '/#about', label: 'Our Story' },
      { to: '/#about', label: 'Our Works' },
      { to: '/#about', label: 'How It Works' },
      { to: '/#about', label: 'Our Team' },
      { to: '/#about', label: 'Our Clients' },
    ],
  },
  {
    title: 'Properties',
    links: [
      { to: '/properties', label: 'Portfolio' },
      { to: '/properties', label: 'Categories' },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/#services', label: 'Valuation Mastery' },
      { to: '/#services', label: 'Strategic Marketing' },
      { to: '/#services', label: 'Negotiation Wizardry' },
      { to: '/#services', label: 'Closing Success' },
      { to: '/#services', label: 'Property Management' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { to: '/#contact', label: 'Contact Form' },
      { to: '/#contact', label: 'Our Offices' },
    ],
  },
]

const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'Twitter', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'YouTube', href: '#', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'Instagram', href: 'https://www.instagram.com/nextprimerealestate/', icon: 'instagram' },
]

const SOCIAL_ICONS = {
  Facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  Twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  YouTube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  TikTok: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
}

const Footer = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const siteData = useSiteData()
  const socialLinksToShow = (siteData?.socialLinks?.length ? siteData.socialLinks : socialLinks).map((s) => ({
    ...s,
    iconPath: typeof s.icon === 'string' && s.icon.length > 20 ? s.icon : SOCIAL_ICONS[s.name] || socialLinks.find((f) => f.name === s.name)?.icon || SOCIAL_ICONS.Facebook,
  }))

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setEmail('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <footer className="bg-white text-[#262626]" role="contentinfo">
      {/* Upper section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 xl:gap-20">
          {/* Left: Logo + Newsletter */}
          <div className="lg:max-w-[340px] xl:max-w-[380px] shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-3 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 rounded-lg"
              aria-label="Next Prime Real Estate - Home"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#262626] flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-[#262626]/10">
                <img
                  src={logo}
                  alt=""
                  className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-[#262626] text-sm font-bold tracking-wide">NEXT PRIME</p>
                <p className="text-[#717171] text-xs font-medium">REAL ESTATE</p>
              </div>
            </Link>
            <p className="text-sm text-[#717171] mb-3">Subscribe for market updates and new listings.</p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-stretch rounded-xl overflow-hidden bg-[#262626] focus-within:ring-2 focus-within:ring-[#B8862E] focus-within:ring-offset-2 focus-within:ring-offset-white transition-shadow"
            >
              <span className="flex items-center justify-center pl-4 text-white/60" aria-hidden>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 py-3.5 px-3 text-sm text-white placeholder:text-white/60 bg-transparent border-0 focus:outline-none focus:ring-0"
                aria-label="Email for newsletter"
                aria-invalid="false"
              />
              <button
                type="submit"
                className="p-3.5 text-white hover:bg-[#B8862E] active:bg-[#A67C2A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-inset cursor-pointer"
                aria-label="Subscribe to newsletter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </button>
            </form>
            {submitted && (
              <p className="mt-2 text-sm text-[#B8862E] font-medium" role="status">
                Thanks for subscribing.
              </p>
            )}
          </div>

          {/* Link columns - responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-6 xl:gap-10 flex-1">
            {footerColumns.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="text-sm font-bold text-black mb-4 pb-2 border-b border-[#e1e1e1] w-fit">
                  {col.title}
                </h3>
                <ul className="space-y-1 mt-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-[#717171] hover:text-[#B8862E] transition-colors py-1.5 block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 w-fit"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower bar */}
      <div className="bg-[#262626] border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-white/80">
              <span>©{new Date().getFullYear()} Next Prime Real Estate. All Rights Reserved.</span>
              <span className="hidden sm:inline text-white/40" aria-hidden>|</span>
              <Link
                to=""
                className="hover:text-[#C9A24D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#262626] rounded px-1"
              >
                Terms & Conditions
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinksToShow.map((social) => (
                <a
                  key={social.name}
                  href={social.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#B8862E] hover:text-white active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#262626]"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d={social.iconPath || social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
