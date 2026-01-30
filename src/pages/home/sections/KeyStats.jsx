import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaRegHandshake, FaBuilding, FaUserCheck } from 'react-icons/fa'
import { viewportOnce } from '../../../utils/motion'

const stats = [
  {
    id: 'rating',
    icon: FaStar,
    value: '4.9/5',
    target: 4.9,
    suffix: '/5',
    decimals: 1,
    label: 'Average client rating',
    sub: 'Based on verified feedback',
  },
  {
    id: 'deals',
    icon: FaRegHandshake,
    value: '1,200+',
    target: 1200,
    suffix: '+',
    decimals: 0,
    label: 'Successful deals',
    sub: 'Buy, rent & investment',
  },
  {
    id: 'listings',
    icon: FaBuilding,
    value: '350+',
    target: 350,
    suffix: '+',
    decimals: 0,
    label: 'Active listings',
    sub: 'Across top Dubai areas',
  },
  {
    id: 'clients',
    icon: FaUserCheck,
    value: '900+',
    target: 900,
    suffix: '+',
    decimals: 0,
    label: 'Happy clients',
    sub: 'Local & international buyers',
  },
]

const DURATION_MS = 1800
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

function useCountUp(target, decimals, isVisible) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return

    const animate = (timestamp) => {
      if (startTimeRef.current == null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / DURATION_MS, 1)
      const eased = easeOutExpo(progress)
      const current = target * eased
      setDisplayValue(current)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible, target])

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString()
  return formatted
}

function StatCard({ stat, isVisible }) {
  const displayValue = useCountUp(stat.target, stat.decimals, isVisible)
  const Icon = stat.icon
  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="w-10 h-10 rounded-xl bg-[#B8862E] text-white flex items-center justify-center">
        <Icon className="w-4 h-4" aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold">
        {displayValue}
        {stat.suffix}
      </p>
      <p className="mt-1 text-white/90 font-medium text-sm sm:text-base">{stat.label}</p>
      <p className="mt-1 text-xs sm:text-sm text-white/70">{stat.sub}</p>
    </motion.div>
  )
}

const KeyStats = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let fired = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true
          setIsVisible(true)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      className="mt-14 sm:mt-20 lg:mt-[140px] px-4 sm:px-6 lg:px-8"
      aria-label="Key stats and social proof"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto">
        <div className="bg-[#262626] text-white rounded-3xl p-5 sm:p-8 lg:p-10 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#B8862E]/30 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-medium leading-tight">
                  Trusted by Dubai buyers, renters & investors
                </h2>
                <p className="mt-2.5 text-white/80 text-sm sm:text-base">
                  Real results, transparent process, and market expertise—built for a premium Dubai real estate experience.
                </p>
              </div>
              <div className="text-sm text-white/70">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm">
                  Social proof highlights
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {stats.map((s) => (
                <StatCard key={s.id} stat={s} isVisible={isVisible} />
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-white/70">
              <p>
                Want a personalized shortlist? Use the filters on the{' '}
                <a href="/properties" className="text-[#C9A24D] hover:underline">
                  Properties
                </a>{' '}
                page.
              </p>
              <p className="text-white/60">Dubai · UAE</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default KeyStats

