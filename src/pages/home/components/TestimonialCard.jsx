import React from 'react'
import { FaStar } from 'react-icons/fa'

const TestimonialCard = ({ name, role, location, quote, rating, initials }) => {
  return (
    <article className="bg-[#FCFCFD] border border-[#e1e1e187] shadow-lg rounded-xl p-4 sm:p-5 lg:p-6 flex flex-col h-full transition-shadow hover:shadow-xl">
      <div className="flex flex-col gap-4 sm:gap-5 flex-1 min-h-0">
        <div
          className="flex items-center gap-1 text-[#C9A24D]"
          aria-label={`${rating} out of 5 stars`}
        >
          {Array.from({ length: rating }).map((_, i) => (
            <FaStar key={i} className="w-4 h-4 shrink-0" aria-hidden />
          ))}
        </div>
        <blockquote className="text-[#262626] text-sm sm:text-base leading-relaxed flex-1">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <footer className="flex items-center gap-3 sm:gap-4 pt-2 border-t border-[#e1e1e1]">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#262626] text-white flex items-center justify-center shrink-0 font-semibold text-sm"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-black text-sm sm:text-base truncate">
              {name}
            </p>
            <p className="text-[#717171] text-xs sm:text-sm truncate">
              {role}
              {location && (
                <span className="text-[#999999]"> · {location}</span>
              )}
            </p>
          </div>
        </footer>
      </div>
    </article>
  )
}

export default TestimonialCard
