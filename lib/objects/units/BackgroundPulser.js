import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useStateStorage } from '../../state/stateStorage'
import slew from '../../logic/slew'

export function BackgroundPulser({ negative, slewFactor, intensity: maxIntensity }) {
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const backgroundIntensity = useRef(0)
  const background = useRef()
  const slewed = slew({ slewGoingUp: false, slewGoingDown: true, defaultValue: 0, slewFactor })

  useEffect(
    () =>
      useStateStorage.subscribe(
        isBeatFrame => (beatFrameRef.current = isBeatFrame),
        state => state.isBeatFrame
      ),
    []
  )

  useFrame((state, delta) => {
    if (!background.current) {
      return
    }

    const { current: isBeatFrame } = beatFrameRef
    let { current: intensity } = backgroundIntensity

    const beatValue = isBeatFrame ? maxIntensity : 0
    intensity = slewed(beatValue)
    const backgroundColor = negative ? 1 - intensity : intensity

    background.current.r = background.current.g = background.current.b = backgroundColor
  })

  return <color attach="background" ref={background} args={['rgb(0,0,0)']} />
}
