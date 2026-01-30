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
      className="relative min-h-[60vh] sm:min-h-[70vh] lg:h-[calc(100vh-104px)] flex items-center justify-center bg-no-repeat bg-cover bg-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})` }}
      aria-label="Hero - Find your perfect property in Dubai"
    >
      {/* Gradient overlay for readability and focus */}
      <div
        className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60 pointer-events-none"
        aria-hidden
      />
      <div className="container mx-auto w-full relative z-10">
        <motion.div
          className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 max-w-4xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Eyebrow / context */}
          <motion.p
            className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#C9A24D]"
            variants={staggerItem}
          >
            Next Prime Real Estate
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-bold text-white leading-[1.1] tracking-tight"
            variants={staggerItem}
          >
            Find your perfect
            <br className="hidden sm:block" />
            <span className="text-[#C9A24D]">property in UAE</span>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl"
            variants={staggerItem}
          >
            Buy, rent, or sell with confidence. Full-service support from search to keys—Dubai, Abu Dhabi, Sharjah & more.
          </motion.p>
          <motion.div variants={staggerItem} className="space-y-4">
            <SearchBar />
            <p className="text-white/80 text-xs sm:text-sm">
              Or{' '}
              <Link
                to="/properties"
                className="text-[#C9A24D] font-medium hover:text-[#E5B84D] underline underline-offset-2 transition-colors"
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
