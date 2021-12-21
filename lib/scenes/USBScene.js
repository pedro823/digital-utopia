import { Vector3 } from 'three'
import LineField from '../objects/units/LineField'
import { useStateStorage } from '../state/stateStorage'
import { useRef, useEffect } from 'react'
import { EffectComposer } from '@react-three/postprocessing'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { BeatPop } from '../effects/BeatPopEffect'
import { randomBetween } from '../logic/random'

export default function USBScene() {
  const tRef = useRef(0)
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const beatPopRef = useRef()
  const startingTRef = useRef(0)
  const frozenClockRef = useRef(0)

  useEffect(
    () =>
      useStateStorage.subscribe(
        isBeatFrame => (beatFrameRef.current = isBeatFrame),
        state => state.isBeatFrame
      ),
    []
  )

  const points = [
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0.5),
    new Vector3(0.5, 1.5, 0.8),
    new Vector3(0.8, 3, -0.2),
  ]

  useFrame(state => {
    if (beatFrameRef.current) {
      startingTRef.current = randomBetween(-Math.PI, Math.PI)
      frozenClockRef.current = state.clock.elapsedTime
      beatPopRef.current.blink = 1
    } else {
      beatPopRef.current.blink = Math.max(0.0, beatPopRef.current.blink - 0.1)
    }
    tRef.current =
      Math.sin(state.clock.elapsedTime + startingTRef.current - frozenClockRef.current) / 2 + 0.5
  })

  return (
    <>
      <LineField interpolations={1000} tRef={tRef} points={points} color="#bbb" />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <EffectComposer>
        <BeatPop ref={beatPopRef}></BeatPop>
      </EffectComposer>
    </>
  )
}
