import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroSection from './sections/HeroSection'
import Header from '../../components/Header'
import OurSolutions from './sections/OurSolutions'
import FeaturedProperties from './sections/FeaturedProperties'
import LocationsWeServe from './sections/LocationsWeServe'
import OurDevelopers from './sections/OurDevelopers'
import FeaturesUnique from './sections/FeaturesUnique'
import WhatOurClientsSay from './sections/WhatOurClientsSay'
import KeyStats from './sections/KeyStats'
import { setSeoMeta } from '../../utils/seo'
import { fadeIn } from '../../utils/motion'
import CtaSection from './sections/CtaSection'

const Home = () => {
  useEffect(() => {
    setSeoMeta({
      title: 'Next Prime Real Estate Dubai | Luxury Properties & Investment',
      description:
        'Next Prime Real Estate Dubai – Find luxury villas, apartments & off-plan properties in Dubai. Expert agents for buying, selling & renting. Your trusted Dubai real estate partner.',
      canonical: 'https://www.nextprimerealestate.com/',
    })
  }, [])

  return (
    <motion.div {...fadeIn}>
      <Header />
      <HeroSection />
      <OurSolutions />
      <FeaturedProperties />
      <LocationsWeServe />
      <OurDevelopers />
      <FeaturesUnique />
      <WhatOurClientsSay />
      <KeyStats />
      <CtaSection />
    </motion.div>
  )
}

export default Home