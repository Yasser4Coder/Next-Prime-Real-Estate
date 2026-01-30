import React from 'react'
import { motion } from 'framer-motion'
import OurSolutionsCards from '../components/OurSolutionsCards'
import findDreamIcon from '../../../assets/icons/find-dream-icon.svg'
import unlockPropertyIcon from '../../../assets/icons/unlock-property-icon.svg'
import effortlessPropertyIcon from '../../../assets/icons/effortless-property-icon.svg'
import smartInvestmentsIcon from '../../../assets/icons/smart-investments-icon.svg'
import { viewportOnce, staggerContainer, staggerItem } from '../../../utils/motion'

const cards = [
  { text: 'Find Your Dream Home', icon: findDreamIcon },
  { text: 'Unlock Property Value', icon: unlockPropertyIcon },
  { text: 'Effortless Property Management', icon: effortlessPropertyIcon },
  { text: 'Smart Investments, Informed Decisions', icon: smartInvestmentsIcon },
]

const OurSolutions = () => {
  return (
    <motion.section
      id="services"
      className="my-6 sm:my-8 px-4 sm:px-6 lg:px-8"
      aria-label="Our solutions - Find your dream home, unlock property value, property management, smart investments"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mx-auto w-full">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {cards.map((item) => (
            <motion.div key={item.text} variants={staggerItem}>
              <OurSolutionsCards text={item.text} icon={item.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default OurSolutions
