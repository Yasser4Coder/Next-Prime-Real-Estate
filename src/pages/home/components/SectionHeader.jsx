import React from 'react'
import { motion } from 'framer-motion'
import starsIcon from '../../../assets/icons/stars-icon.svg'
import Button from '../../../components/Button'
import { staggerContainer, staggerItem } from '../../../utils/motion'

const SectionHeader = ({ buttonText, buttonTo, title, desc }) => {
  return (
    <motion.div
      className="flex flex-col gap-4 sm:gap-6 w-full"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={staggerItem}>
        <img src={starsIcon} alt="" className="h-6 sm:h-[30px] w-auto" aria-hidden />
      </motion.div>
      <div className="flex flex-col gap-4">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight"
          variants={staggerItem}
        >
          {title}
        </motion.h2>
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={staggerItem}
        >
          <p className="flex-1 text-[#999999] text-sm sm:text-base max-w-full sm:max-w-[70%]">
            {desc}
          </p>
          {buttonText ? (
            <div className="shrink-0">
              <Button text={buttonText} to={buttonTo} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SectionHeader
