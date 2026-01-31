import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBuilding, FaChartLine, FaHandshake } from 'react-icons/fa'
import Header from '../../components/Header'
import { hero, story, teamIntro, values, mission, teamMembers } from './AboutData'
import { setSeoMeta } from '../../utils/seo'
import { fadeIn } from '../../utils/motion'
import { viewportOnce, staggerContainer, staggerItem } from '../../utils/motion'
import starsIcon from '../../assets/icons/stars-icon.svg'

const valueIcons = { building: FaBuilding, chart: FaChartLine, handshake: FaHandshake }

const PhotoPlaceholder = ({ label = 'Photo coming soon', square = false }) => (
  <div
    className={`w-full rounded-2xl bg-[#e8e8e8] flex items-center justify-center text-[#999999] text-sm text-center px-4 ${square ? 'aspect-square' : 'aspect-3/4'}`}
    aria-hidden
  >
    {label}
  </div>
)

const About = () => {
  useEffect(() => {
    setSeoMeta({
      title: 'About Us | Next Prime Real Estate Dubai',
      description:
        'Meet the team behind Next Prime Real Estate – Abderraouf Malouadjmi (CEO & Founder) and Adel Farah (Partner). Trusted Dubai real estate experts with a focus on off-plan investment and strategic growth.',
      canonical: 'https://www.nextprimerealestate.com/about',
    })
  }, [])

  return (
    <motion.div {...fadeIn}>
      <Header />

      {/* Hero – trust statement (dark box over subtle bg) */}
      <section
        className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#262626] relative overflow-hidden"
        aria-label="About Next Prime Real Estate"
      >
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            className="rounded-2xl bg-[#262626] border border-[#B8862E]/30 px-6 sm:px-10 py-10 sm:py-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
              {hero.headline}
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              {hero.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our story – two columns: text left, image right */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4 }}
            >
              <img src={starsIcon} alt="" className="h-6 sm:h-8 w-auto" aria-hidden />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#262626] leading-tight">
                {story.heading}
              </h2>
              <p className="text-[#555] text-sm sm:text-base leading-relaxed">
                {story.body}
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl overflow-hidden bg-[#f5f5f5] min-h-[280px] sm:min-h-[340px] lg:min-h-[400px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4 }}
            >
              {story.image ? (
                <img src={story.image} alt="Next Prime Real Estate" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#999999] text-sm px-4">
                  Company / office photo coming soon
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our team, our culture – two columns: photo grid left, intro right; then full team cards */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16 lg:mb-20">
            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4 }}
            >
              {teamMembers.map((member, i) => (
                <div key={member.id} className="rounded-2xl overflow-hidden bg-white border border-[#e1e1e1] shadow-sm">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full aspect-square object-cover" />
                  ) : (
                    <PhotoPlaceholder label={`${member.name} – photo soon`} square />
                  )}
                  <div className="p-3 sm:p-4">
                    <p className="font-medium text-[#262626] text-sm sm:text-base truncate">{member.name}</p>
                    <p className="text-[#B8862E] text-xs sm:text-sm truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4 }}
            >
              <img src={starsIcon} alt="" className="h-6 sm:h-8 w-auto" aria-hidden />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#262626] leading-tight">
                {teamIntro.heading}
              </h2>
              <p className="text-[#555] text-sm sm:text-base leading-relaxed">
                {teamIntro.body}
              </p>
            </motion.div>
          </div>

          {/* Full team bios */}
          <div className="space-y-16 sm:space-y-20">
            {teamMembers.map((member, index) => (
              <motion.article
                key={member.id}
                className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full max-w-4xl mx-auto bg-white rounded-2xl border border-[#e1e1e1] p-6 sm:p-8 lg:p-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="w-full lg:w-72 shrink-0">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full aspect-3/4 rounded-2xl object-cover" />
                  ) : (
                    <PhotoPlaceholder />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-medium text-[#262626] mb-1">{member.name}</h3>
                  <p className="text-[#B8862E] font-medium text-sm sm:text-base mb-4">{member.role} – {member.company}</p>
                  <div className="space-y-4 text-[#555] text-sm sm:text-base leading-relaxed">
                    {member.bio.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  {member.expertise?.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[#e1e1e1]">
                      <p className="text-[#262626] font-medium text-sm mb-2">Expertise</p>
                      <ul className="flex flex-wrap gap-2">
                        {member.expertise.map((item, i) => (
                          <li key={i} className="px-3 py-1.5 rounded-xl bg-[#f5f5f5] text-[#555] text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Our vision – three value cards */}
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
              A responsible real estate vision
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {values.map((v) => {
              const Icon = valueIcons[v.icon] || FaBuilding
              return (
                <motion.div
                  key={v.id}
                  variants={staggerItem}
                  className="rounded-2xl border border-[#e1e1e1] bg-[#fafafa] p-6 sm:p-8 flex flex-col items-center text-center hover:border-[#B8862E]/40 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#B8862E]/10 flex items-center justify-center mb-4 text-[#B8862E]">
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-[#262626] mb-2">{v.title}</h3>
                  <p className="text-[#555] text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission CTA – dark box */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f5f5f5]">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="rounded-2xl bg-[#262626] border border-[#B8862E]/30 px-6 sm:px-10 py-10 sm:py-14 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-4">
              {mission.headline}
            </h2>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
              {mission.text}
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About
