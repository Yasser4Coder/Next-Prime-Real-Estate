import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import PropertieBlackCard from '../../../components/PropertieBlackCard'
import FeaturedPropertiesData from '../data/FeaturedPropertiesData'
import { useSiteData } from '../../../context/DashboardStore'
import arrowRight from '../../../assets/icons/arrow-right-white.svg'
import arrowLeft from '../../../assets/icons/arrow-left-grey.svg'
import { viewportOnce } from '../../../utils/motion'

const SWIPE_THRESHOLD = 50
const CARDS_PER_SLIDE_DESKTOP = 6

const FeaturedProperties = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)
  const siteData = useSiteData()
  const featuredList =
    siteData?.featuredPropertyIds?.length && siteData?.properties?.length
      ? siteData.featuredPropertyIds
          .map((id) => siteData.properties.find((p) => p.id === id))
          .filter(Boolean)
      : FeaturedPropertiesData
  const total = featuredList.length
  const totalSlides = Math.ceil(total / CARDS_PER_SLIDE_DESKTOP)

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? total - 1 : i - 1))
  }, [total])

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= total - 1 ? 0 : i + 1))
  }, [total])

  const goPrevSlide = useCallback(() => {
    setSlideIndex((s) => (s <= 0 ? totalSlides - 1 : s - 1))
  }, [totalSlides])

  const goNextSlide = useCallback(() => {
    setSlideIndex((s) => (s >= totalSlides - 1 ? 0 : s + 1))
  }, [totalSlides])

  const handlePrev = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      goPrev()
    } else {
      goPrevSlide()
    }
  }, [goPrev, goPrevSlide])

  const handleNext = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      goNext()
    } else {
      goNextSlide()
    }
  }, [goNext, goNextSlide])

  const onTouchStart = useCallback((e) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX == null) return
      const endX = e.changedTouches[0].clientX
      const delta = touchStartX - endX
      if (delta > SWIPE_THRESHOLD) goNext()
      else if (delta < -SWIPE_THRESHOLD) goPrev()
      setTouchStartX(null)
    },
    [touchStartX, goNext, goPrev]
  )

  const getSlideCards = (slideIdx) => {
    const start = slideIdx * CARDS_PER_SLIDE_DESKTOP
    return featuredList.slice(start, start + CARDS_PER_SLIDE_DESKTOP)
  }

  return (
    <motion.section
      id="properties"
      className="mt-16 sm:mt-24 lg:mt-[180px] px-4 sm:px-6 lg:px-8"
      aria-label="Featured properties - Dubai real estate listings"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto w-full flex flex-col gap-10 sm:gap-16">
        <SectionHeader
          title="Featured Properties"
          desc="Explore our handpicked selection of featured properties. Each listing offers a glimpse into exceptional homes and investments available through Estatein. Click 'View Details' for more information."
          buttonText="View All Properties"
          buttonTo="/properties"
        />

        {/* Mobile: carousel – one card, swipe + arrows */}
        <div
          className="md:hidden overflow-hidden w-full touch-pan-y select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured properties carousel"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredList.map((property) => (
              <div key={property.id} className="w-full shrink-0 px-0">
                <PropertieBlackCard
                  propId={property.id}
                  propTitle={property.title}
                  propDesc={property.description}
                  propPrice={property.price}
                  propImage={property.image}
                  propType={property.type}
                  propBath={property.bathrooms}
                  propBed={property.bedrooms}
                  propStatus={property.overview?.status ?? ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 6 cards per slide, arrows to change slide */}
        <div
          className="hidden md:block overflow-hidden w-full"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured properties – 6 per slide"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIdx) => (
              <div
                key={slideIdx}
                className="w-full shrink-0 grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
              >
                {getSlideCards(slideIdx).map((property) => (
                  <PropertieBlackCard
                    key={property.id}
                    propId={property.id}
                    propTitle={property.title}
                    propDesc={property.description}
                    propPrice={property.price}
                    propImage={property.image}
                    propType={property.type}
                    propBath={property.bathrooms}
                    propBed={property.bedrooms}
                    propStatus={property.overview?.status ?? ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#262626] w-full h-px shrink-0" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm sm:text-base flex items-center gap-2">
            <p className="text-[#999999]">
              <span className="md:hidden">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="hidden md:inline">
                {String(slideIndex + 1).padStart(2, '0')}
              </span>
            </p>
            <p className="text-[#666666]">of</p>
            <p className="text-[#666666]">
              <span className="md:hidden">
                {String(total).padStart(2, '0')}
              </span>
              <span className="hidden md:inline">
                {String(totalSlides).padStart(2, '0')}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="bg-transparent cursor-pointer p-3 sm:p-3.5 rounded-full border border-[#262626] hover:bg-white/5 transition-colors active:scale-95"
              aria-label="Previous properties"
            >
              <img
                src={arrowLeft}
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-[#B8862E] p-3 sm:p-3.5 cursor-pointer rounded-full border border-[#B8862E] hover:bg-[#A67A28] transition-colors active:scale-95"
              aria-label="Next properties"
            >
              <img
                src={arrowRight}
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default FeaturedProperties
