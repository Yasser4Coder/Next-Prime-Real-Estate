import React from 'react'
import { motion } from 'framer-motion'
import bg from '../../../assets/bgs/featuresSectionBg.png'
import FeaturesUniqueCard from '../components/FeaturesUniqueCard'
import FeaturesUniqueData from '../data/FeaturesUniqueData'
import curvedLineBig from '../../../assets/icons/curved-line-big.svg'
import { viewportOnce, staggerContainer, staggerItem } from '../../../utils/motion'

const FeaturesUnique = () => {
  return (
    <motion.section
      className="mt-14 sm:mt-20 lg:mt-[110px] pt-10 sm:pt-14 lg:pt-[56px] pb-8 sm:pb-10 lg:pb-0 relative w-full overflow-hidden px-4 sm:px-6 lg:px-8"
      aria-label="Features that make us unique - Dubai real estate"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <img
        src={bg}
        alt=""
        className="w-full h-full object-cover object-center absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      />
      <div className="container flex flex-col items-center gap-10 sm:gap-12 lg:gap-14 mx-auto relative z-10">
        <div className="text-center flex flex-col gap-3 sm:gap-4 max-w-3xl">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#C9A24D]">
            Why Next Prime
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black leading-tight">
            Features that make us <span className="text-[#B8862E]">Unique</span>
          </h2>
          <p className="text-[#717171] text-sm sm:text-base lg:text-lg leading-relaxed">
            From verified listings to end-to-end support, we’re built around what matters: your peace of mind and a smooth path to your next property in Dubai.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 xl:gap-10 w-full max-w-6xl my-4 sm:my-7 lg:my-14"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {FeaturesUniqueData.map((item) => (
            <motion.div key={item.id} variants={staggerItem}>
              <FeaturesUniqueCard
                Icon={item.Icon}
                title={item.title}
                description={item.description}
              />
            </motion.div>
          ))}
        </motion.div>
        <div className="mb-6 sm:mb-8 lg:mb-[30px] shrink-0">
          <img
            src={curvedLineBig}
            alt=""
            className="w-full max-w-sm h-auto mx-auto"
            aria-hidden
          />
        </div>
      </div>
    </motion.section>
  )
}

export default FeaturesUnique
