'use client'

import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import InitialReveal from '@/components/InitialReveal'
import PageTransition from '@/components/PageTransition'
import ScrollToTop from '@/components/ScrollToTop'

type IntroState = 'pending' | 'play' | 'skip'

export default function AppShell({ children }: { children: ReactNode }) {
  const [introState, setIntroState] = useState<IntroState>('pending')
  const [ready, setReady] = useState(false)

  const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const hasPlayed = sessionStorage.getItem('initial-reveal-played')
    if (hasPlayed) {
      setReady(true)
      setIntroState('skip')
      return
    }

    setIntroState('play')
  }, [])

  const handleIntroFinish = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initial-reveal-played', 'true')
    }
    setReady(true)
    setIntroState('skip')
  }

  const shouldHideContent = !ready && introState !== 'skip'

  return (
    <>
      {introState === 'play' && <InitialReveal onFinish={handleIntroFinish} />}
      <div
        className={`app-shell transition-opacity duration-500 ${
          shouldHideContent ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'
        }`}
      >
        <PageTransition>{children}</PageTransition>
        <ScrollToTop />
      </div>
    </>
  )
}


