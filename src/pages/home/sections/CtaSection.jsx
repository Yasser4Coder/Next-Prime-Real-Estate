import React from 'react'
import Button from '../../../components/Button'
import ctaImageLeft from '../../../assets/icons/cta-left.svg'
import ctaImageRight from '../../../assets/icons/cta-right.svg'

const CtaSection = () => {
  return (
    <div id="cta" className='py-12 md:py-20 lg:py-25 mt-12 md:mt-20 lg:mt-25 border-t border-b border-[#262626] relative overflow-hidden px-4 sm:px-6'>
        <div className='container relative z-2 mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-4 text-center lg:text-left'>
            <div className='max-w-6xl flex flex-col gap-3 md:gap-4'>
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold'>Start Your Real Estate Journey Today</h2>
              <p className='text-base sm:text-lg text-[#999999]'>Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Next Prime Real Estate is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.</p>
            </div>
            <div className='w-full sm:w-auto shrink-0'>
              <Button text='Explore Properties' to='/properties'/>
            </div>
        </div>
        <img src={ctaImageLeft} alt="CTA Image Left" className='absolute left-0 top-0 w-1/2 md:w-2/5 lg:w-1/3 z-1 opacity-60 md:opacity-80 lg:opacity-100 pointer-events-none hidden md:block' />
        <img src={ctaImageRight} alt="CTA Image Right" className='absolute right-0 bottom-0 w-1/2 md:w-2/5 lg:w-1/3 z-1 opacity-60 md:opacity-80 lg:opacity-100 pointer-events-none' />
    </div>
  )
}

export default CtaSection