import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { buttonHover, buttonTap } from '../utils/motion'

const Button = ({
  text,
  transparent = false,
  fullWidth = false,
  className = '',
  to,
  ...props
}) => {
  const bgColor = transparent
    ? 'bg-transparent border border-[#B8862E]'
    : 'bg-[#B8862E]'

  const classes = `inline-flex items-center justify-center gap-2 max-w-full ${
    fullWidth ? 'w-full' : 'w-auto'
  } py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl text-white text-sm sm:text-base cursor-pointer font-normal transition-all duration-300 hover:bg-[#B8862E] hover:text-white ${bgColor} ${className}`

  if (to) {
    return (
      <motion.div
        className={fullWidth ? 'w-full' : 'inline-block'}
        whileHover={buttonHover}
        whileTap={buttonTap}
      >
        <Link to={to} className={classes} {...props}>
          <span className="truncate">{text}</span>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      className={classes}
      whileHover={buttonHover}
      whileTap={buttonTap}
      {...props}
    >
      <span className="truncate">{text}</span>
    </motion.button>
  )
}

export default Button