import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaBuilding,
  FaHome,
  FaChartLine,
  FaBullhorn,
  FaHandshake,
  FaCog,
  FaChevronRight,
} from 'react-icons/fa'
import Header from '../../components/Header'
import Button from '../../components/Button'
import { hero, services, process, differentiators } from './ServicesData'
import { setSeoMeta } from '../../utils/seo'
import { fadeIn } from '../../utils/motion'
import { viewportOnce, staggerContainer, staggerItem } from '../../utils/motion'
import starsIcon from '../../assets/icons/stars-icon.svg'
import aboutHeroBg from '../../assets/about/bg.jpg'

const iconMap = {
  building: FaBuilding,
  home: FaHome,
  chart: FaChartLine,
  megaphone: FaBullhorn,
  handshake: FaHandshake,
  cog: FaCog,
}

const Services = () => {
  useEffect(() => {
    setSeoMeta({
      title: 'Our Services | Next Prime Real Estate Dubai',
      description:
        'Full-service real estate in Dubai: off-plan investment, buy & sell, valuation, marketing, negotiation, and property management. From search to keys—we handle every step.',
      canonical: 'https://www.nextprimerealestate.com/services',
    })
  }, [])

  return (
    <motion.div {...fadeIn}>
      <Header />

      {/* Hero */}
      <section
        className="pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutHeroBg})` }}
        aria-label="Our Services"
      >
        <div className="absolute inset-0 bg-[#262626]/85 z-0" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-[#262626]/60 via-transparent to-[#262626]/80 z-0" aria-hidden />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-5">
              {hero.headline}
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              {hero.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
          >
            <img src={starsIcon} alt="" className="h-6 sm:h-8 w-auto mx-auto mb-4" aria-hidden />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#262626] leading-tight">
              What we offer
            </h2>
            <p className="text-[#555] text-sm sm:text-base mt-3 max-w-xl mx-auto">
              End-to-end support tailored to investors and homebuyers in Dubai.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {services.map((s) => {
              const Icon = iconMap[s.icon] || FaBuilding
              return (
                <motion.article
                  key={s.id}
                  variants={staggerItem}
                  className={`group relative rounded-2xl border p-6 sm:p-7 flex flex-col transition-all duration-300 overflow-hidden ${
                    s.highlight
                      ? 'border-[#B8862E]/50 bg-gradient-to-br from-[#B8862E]/5 to-transparent hover:border-[#B8862E] hover:shadow-lg hover:shadow-[#B8862E]/10'
                      : 'border-[#e1e1e1] bg-[#FCFCFD] hover:border-[#B8862E]/40 hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shrink-0 transition-colors ${
                      s.highlight ? 'bg-[#B8862E] text-white' : 'bg-[#262626] text-white group-hover:bg-[#B8862E]'
                    }`}
                  >
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#262626] mb-2">{s.title}</h3>
                  <p className="text-[#555] text-sm leading-relaxed flex-1">{s.desc}</p>
                  <Link
                    to="/#contact"
                    className="mt-4 inline-flex items-center gap-2 text-[#B8862E] font-medium text-sm hover:gap-3 transition-all"
                  >
                    Get in touch
                    <FaChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* How we work – process steps */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
          >
            <img src={starsIcon} alt="" className="h-6 sm:h-8 w-auto mx-auto mb-4" aria-hidden />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#262626] leading-tight">
              How we work
            </h2>
            <p className="text-[#555] text-sm sm:text-base mt-3 max-w-xl mx-auto">
              A clear path from first contact to keys in hand.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {process.map((p) => (
              <motion.div
                key={p.step}
                variants={staggerItem}
                className="rounded-2xl bg-white border border-[#e1e1e1] p-6 sm:p-7 hover:border-[#B8862E]/40 hover:shadow-md transition-all"
              >
                <span className="inline-flex w-11 h-11 rounded-xl bg-[#B8862E] text-white items-center justify-center font-semibold text-sm mb-4">
                  {p.step}
                </span>
                <h3 className="text-lg font-semibold text-[#262626] mb-2">{p.title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
          >
            <img src={starsIcon} alt="" className="h-6 sm:h-8 w-auto mx-auto mb-4" aria-hidden />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#262626] leading-tight">
              Why Next Prime
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {differentiators.map((d) => (
              <motion.div
                key={d.title}
                variants={staggerItem}
                className="rounded-2xl border border-[#e1e1e1] bg-[#FCFCFD] p-6 sm:p-8 text-center hover:border-[#B8862E]/40 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-[#262626] mb-2">{d.title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#262626]">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-8 max-w-xl mx-auto">
              Whether you're buying, selling, or investing—we're here to guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button text="Get in touch" to="/#contact" className="sm:w-auto" />
              <Button text="Browse properties" to="/properties" transparent className="sm:w-auto text-white border-white hover:bg-white hover:text-[#262626]" />
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Services
