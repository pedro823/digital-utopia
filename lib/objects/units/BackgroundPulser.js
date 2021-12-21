import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useStateStorage } from '../../state/stateStorage'
import slew from '../../logic/slew'

export function BackgroundPulser({ negative, slewFactor }) {
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const backgroundIntensity = useRef(0)
  const background = useRef()
  const slewed = slew({ slewGoingUp: false, slewGoingDown: true, defaultValue: 0, slewFactor })

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame((state, delta) => {
    if (!background.current) {
      return
    }

    const { current: isBeatFrame } = beatFrameRef
    let { current: intensity } = backgroundIntensity

    const beatValue = isBeatFrame ? 255 : 0;
    intensity = slewed(beatValue);
    // if (isBeatFrame) {
    //   intensity = 255
    // } else {
    //   intensity = Math.max(intensity - decaySpeed * delta, 0)
    // }
    const backgroundColor = negative ? 255 - intensity : intensity

    // background.current.args = `rgb(${backgroundColor},${backgroundColor},${backgroundColor})`
    state.scene.background.r = state.scene.background.b = state.scene.background.g = backgroundColor
  })

  return (
    <color attach="background" ref={background} args={"rgb(0,0,0)"} />
  )
}