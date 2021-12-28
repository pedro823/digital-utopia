import React, { useEffect, useMemo, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStateStorage } from '../state/stateStorage'
import { BlendFunction, GlitchMode } from 'postprocessing'
import {
  EffectComposer,
  Bloom,
  Scanline,
  Grid,
  Glitch,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { BeatPop } from '../effects/BeatPopEffect'
import HackerText from '../objects/units/HackerText'
import { randomBetween } from '../logic/random'
import { UnrealBloomPass } from 'three-stdlib'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'

const createDirection = () => [randomBetween(-1, 1), randomBetween(-1, 1), -8]

const rotatePositions = (hackerText, delta, invertFlow) => {
  let { position: pos, direction } = hackerText
  let flowCurrent = invertFlow ? -2 : 1
  if (pos.z < -40) {
    pos.z = randomBetween(10, 15)
    direction = createDirection()
  } else if (pos.z > 16) {
    pos.z = randomBetween(-40, -30)
    direction = createDirection()
  } else {
    const [x, y, z] = direction
    pos.x += x * delta * flowCurrent
    pos.y += y * delta * flowCurrent
    pos.z += z * delta * flowCurrent
  }
  hackerText.position.x = pos.x
  hackerText.position.y = pos.y
  hackerText.position.z = pos.z
  hackerText.direction = direction
}

export default function TextScene({ quantity }) {
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const beatPopRef = useRef()
  const hackerTextRefs = useRef([])
  const invertFlow = useRef(false)
  const textArray = useMemo(() => {
    const array = []
    hackerTextRefs.current = []
    for (let i = 0; i < quantity; i++) {
      array.push(
        <HackerText
          wordCount={5}
          key={`hackertext-${i}`}
          useBeat
          refreshInterval={0.1}
          scale={[5, 5, 5]}
          ref={element => hackerTextRefs.current.push(element)}
          position={[randomBetween(-5, 5), randomBetween(-5, 5), randomBetween(-40, 10)]}
          direction={createDirection()}
        />
      )
    }
    return array
  }, [quantity])

  useEffect(
    () =>
      useStateStorage.subscribe(
        isBeatFrame => (beatFrameRef.current = isBeatFrame),
        state => state.isBeatFrame
      ),
    []
  )

  useFrame((_, delta) => {
    if (beatFrameRef.current) {
      beatPopRef.current.blink = 1.0
      invertFlow.current = Math.random() < 0.2
    } else {
      beatPopRef.current.blink = Math.max(0.0, beatPopRef.current.blink - 0.12)
    }
    for (let hackerText of hackerTextRefs.current) {
      rotatePositions(hackerText, delta, invertFlow.current)
    }
  })

  return (
    <>
      <AutomaticBeat bpm={128} />
      <pointLight position={[10, 10, 10]} />
      {textArray}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={3.5} height={100} />
        <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          density={1.25} // scanline density
        />
        <Grid
          blendFunction={BlendFunction.OVERLAY} // blend mode
          scale={2.0} // grid pattern scale
          lineWidth={2.0} // grid pattern line width
          size={{ width: 150, height: 150 }} // overrides the default pass width and height
        />
        <Glitch
          delay={[0.0, 3.5]} // min and max glitch delay
          duration={[0.3, 1.1]} // min and max glitch duration
          strength={[0.3, 1.0]} // min and max glitch strength
          mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        />
        <BeatPop ref={beatPopRef} />
        <BrightnessContrast contrast={0.6} />
      </EffectComposer>
    </>
  )
}
