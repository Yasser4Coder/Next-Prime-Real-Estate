import React from 'react'
import { motion } from 'framer-motion'
import iconConatiner from '../../../assets/icons/icon-container.svg'
import arrowUpRightIcon from '../../../assets/icons/arrow-up-right-icon.svg'
import { motionTransition } from '../../../utils/motion'

const OurSolutionsCards = ({ text, icon }) => {
  return (
    <motion.div
      className="bg-[#1A1A1A] relative w-full min-h-[150px] sm:min-h-[180px] h-full rounded-xl flex flex-col gap-3 items-center justify-center text-white text-sm sm:text-base font-semibold px-4 py-5"
      whileHover={{ y: -3 }}
      transition={motionTransition}
    >
      <img
        src={arrowUpRightIcon}
        className="absolute top-[10%] right-[5%] w-5 h-5 sm:w-auto sm:h-auto"
        alt=""
        aria-hidden
      />
      <div className="bg-no-repeat bg-cover bg-center w-[56px] h-[56px] sm:w-[70px] sm:h-[70px] relative shrink-0">
        <img
          src={iconConatiner}
          alt=""
          className="w-full h-full absolute top-0 left-0"
          aria-hidden
        />
        <div className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <img src={icon} alt="" className="max-w-full max-h-full" aria-hidden />
        </div>
      </div>
      <h2 className="text-center leading-tight">
        {text}
      </h2>
    </motion.div>
  )
}

export default OurSolutionsCards
