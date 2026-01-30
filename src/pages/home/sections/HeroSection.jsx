import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import heroBg from '../../../assets/bgs/hero-bg.webp'
import SearchBar from '../components/SearchBar'
import { staggerContainer, staggerItem } from '../../../utils/motion'

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-[70vh] sm:min-h-[72vh] lg:h-[calc(100vh-104px)] flex items-center justify-center bg-no-repeat bg-cover bg-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-0 overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})` }}
      aria-label="Hero - Find your perfect property in Dubai"
    >
      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65 pointer-events-none"
        aria-hidden
      />
      <div className="container mx-auto w-full relative z-10 flex justify-center sm:justify-start">
        <motion.div
          className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-4xl w-full text-center sm:text-left items-center sm:items-start"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Eyebrow */}
          <motion.p
            className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#C9A24D]"
            variants={staggerItem}
          >
            Dubai Real Estate
          </motion.p>
          <motion.h1
            className="text-2xl min-[480px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-bold text-white leading-[1.15] sm:leading-[1.1] tracking-tight"
            variants={staggerItem}
          >
            Find your perfect
            <br />
            <span className="text-[#C9A24D]">property in Dubai</span>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl"
            variants={staggerItem}
          >
            Buy, rent, or sell with confidence. Full-service support from search to keys—Marina, Downtown, Palm & more.
          </motion.p>
          <motion.div variants={staggerItem} className="space-y-3 sm:space-y-4 w-full flex flex-col items-center sm:items-start">
            <SearchBar />
            <p className="text-white/85 text-xs sm:text-sm">
              Or{' '}
              <Link
                to="/properties"
                className="text-[#C9A24D] font-semibold hover:text-[#E5B84D] underline underline-offset-2 transition-colors py-1 -my-1"
              >
                browse all properties
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
