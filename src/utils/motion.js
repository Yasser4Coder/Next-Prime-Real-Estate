/**
 * Shared Framer Motion config for professional, subtle animations.
 * Use across the site for consistency.
 */

export const motionTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
}

export const motionTransitionFast = {
  duration: 0.25,
  ease: [0.25, 0.46, 0.45, 0.94],
}

export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: motionTransition,
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: motionTransitionFast,
}

export const viewportOnce = {
  once: true,
  amount: 0.15,
  margin: '0px 0px -40px 0px',
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: motionTransition,
}

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1, y: -4 },
  tap: { scale: 0.99 },
}

export const buttonHover = {
  scale: 1.02,
  transition: motionTransitionFast,
}

export const buttonTap = {
  scale: 0.98,
  transition: motionTransitionFast,
}
