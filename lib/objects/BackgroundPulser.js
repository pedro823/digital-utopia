import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useStateStorage } from '../state/stateStorage'

export function BackgroundPulser(props) {
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const { active, negative, decaySpeed } = props
  const backgroundIntensity = useRef(0)
  const background = useRef()

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame((clock, delta) => {
    if (!active || !background.current) {
      return
    }

    const { current: isBeatFrame } = beatFrameRef
    let { current: intensity } = backgroundIntensity
    if (isBeatFrame) {
      intensity = 255
    } else {
      intensity = Math.max(intensity - decaySpeed * delta, 0)
    }
    const backgroundColor = negative ? 255 - intensity : intensity

    background.current.args = `rgb(${backgroundColor},${backgroundColor},${backgroundColor})`
  })

  if (!active) {
    return null
  }

  return (
    <color attach="background" ref={background} args={"rgb(0,0,0)"} />
  )
}