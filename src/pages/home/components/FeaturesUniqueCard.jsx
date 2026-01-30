import React from 'react'
import { motion } from 'framer-motion'
import iconContainer from '../../../assets/icons/icon-container2.svg'
import curvedLineSm from '../../../assets/icons/curved-line-sm.svg'
import { motionTransition } from '../../../utils/motion'

const FeaturesUniqueCard = ({ Icon, title, description }) => {
  return (
    <motion.article
      className="group flex flex-col gap-3 sm:gap-4 text-center sm:text-left p-5 sm:p-6 rounded-2xl bg-white/80 sm:bg-white/60 hover:bg-white border border-transparent hover:border-[#e8e0d0] hover:shadow-lg hover:shadow-[#B8862E]/8 transition-all duration-300"
      whileHover={{ y: -4 }}
      transition={motionTransition}
    >
      <div className="w-14 h-14 sm:w-[65px] sm:h-[65px] relative flex items-center justify-center mx-auto sm:mx-0 shrink-0 group-hover:scale-105 transition-transform duration-300">
        <img
          src={iconContainer}
          alt=""
          className="w-full h-full absolute top-0 left-0"
          aria-hidden
        />
        <span className="relative z-10 flex items-center justify-center text-[#C9A24D] group-hover:text-[#B8862E] transition-colors">
          {Icon ? (
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden />
          ) : null}
        </span>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-black leading-tight">
        {title}
      </h3>
      <img
        src={curvedLineSm}
        alt=""
        className="w-12 sm:w-[61px] h-auto mx-auto sm:mx-0 shrink-0 opacity-80"
        aria-hidden
      />
      <p className="text-[#717171] text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </motion.article>
  )
}

export default FeaturesUniqueCard
