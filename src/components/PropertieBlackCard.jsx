import React from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import { motionTransition } from '../utils/motion'

const PropertieBlackCard = ({
  propId,
  propTitle,
  propDesc,
  propBed,
  propBath,
  propType,
  propPrice,
  propImage,
}) => {
  return (
    <motion.article
      className="bg-[#FCFCFD] border border-[#e1e1e187] shadow-xl w-full max-w-[480px] min-h-0 h-full mx-auto md:mx-0 cursor-pointer rounded-xl p-4 sm:p-5 lg:p-6 flex flex-col"
      whileHover={{ y: -4 }}
      transition={motionTransition}
    >
      <div className="w-full flex flex-col gap-4 sm:gap-6 flex-1 min-h-0">
        <div className="w-full aspect-4/3 sm:aspect-512/346 rounded-xl overflow-hidden shrink-0">
          <img
            src={propImage}
            alt={`${propTitle} - Dubai property`}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
        </div>
        <div className="w-full flex-1 flex flex-col gap-6 sm:gap-10 min-h-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-medium text-black leading-tight">
              {propTitle}
            </h2>
            <p className="text-[#717171] text-sm sm:text-base leading-relaxed">
              {propDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="bg-[#1A1A1A] border text-white text-xs sm:text-sm border-[#262626] rounded-full py-1.5 px-3 inline-flex items-center gap-1">
              {propBed} Bedroom
            </span>
            <span className="bg-[#1A1A1A] border text-white text-xs sm:text-sm border-[#262626] rounded-full py-1.5 px-3 inline-flex items-center gap-1">
              {propBath} Bathroom
            </span>
            <span className="bg-[#1A1A1A] border text-white text-xs sm:text-sm border-[#262626] rounded-full py-1.5 px-3 inline-flex items-center gap-1">
              {propType}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto pt-2">
            <div>
              <p className="text-[#717171] text-sm sm:text-base">Price</p>
              <p className="text-black text-lg sm:text-xl font-medium">${propPrice.toLocaleString()}</p>
            </div>
            <div className="w-full sm:w-auto">
              <Button
                text="View Property Details"
                to={propId ? `/properties/${propId}` : undefined}
                fullWidth
                className="sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default PropertieBlackCard
