'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TechButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
}

export default function TechButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
}: TechButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold tracking-wide text-sm uppercase overflow-hidden group transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'

  const layeredGlow =
    "before:absolute before:inset-[1px] before:rounded-[inherit] before:bg-[#0f172a] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] group-hover:before:opacity-30 after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-r after:from-cyan-400/30 after:via-transparent after:to-purple-500/30 after:opacity-0 after:transition-opacity after:duration-300 after:content-[''] group-hover:after:opacity-60"

  const variants: Record<NonNullable<TechButtonProps['variant']>, string> = {
    primary:
      'text-white shadow-[0_15px_35px_rgba(14,165,233,0.35)] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:shadow-[0_20px_45px_rgba(14,165,233,0.4)]',
    secondary:
      'text-white shadow-[0_15px_35px_rgba(236,72,153,0.35)] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:shadow-[0_20px_45px_rgba(236,72,153,0.45)]',
    outline:
      'text-cyan-300 border border-cyan-400/60 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent hover:bg-cyan-400/10 shadow-[0_10px_25px_rgba(6,182,212,0.2)]',
  }

  const buttonContent = (
    <span className="relative z-10 flex items-center gap-2">
      <span className="text-base normal-case tracking-normal">{children}</span>
      <motion.span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg"
        whileHover={{ x: 4 }}
        whileTap={{ x: 8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        →
      </motion.span>
    </span>
  )

  const buttonClasses = `${baseStyles} ${layeredGlow} ${variants[variant]} ${className}`.trim()

  const buttonMotionProps = {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  }

  if (href) {
    return (
      <motion.div {...buttonMotionProps}>
        <Link href={href} className={buttonClasses}>
          {buttonContent}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button type="button" onClick={onClick} className={buttonClasses} {...buttonMotionProps}>
      {buttonContent}
    </motion.button>
  )
}

