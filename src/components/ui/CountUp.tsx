import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'

interface CountUpProps {
  to: number
}

// Recortado a la única prop que se usa (HeroSection stats). El componente original
// venía de una librería con 10 props configurables; el resto nunca tuvo consumidor.
export default function CountUp({ to }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 40, stiffness: 50 })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const formatValue = useCallback((latest: number) => Math.round(latest).toString(), [])

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(0)
  }, [formatValue])

  useEffect(() => {
    if (isInView) motionValue.set(to)
  }, [isInView, motionValue, to])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) ref.current.textContent = formatValue(latest)
    })
    return () => unsubscribe()
  }, [springValue, formatValue])

  return <span ref={ref} />
}
