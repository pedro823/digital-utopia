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
import { CircuitBoard } from '../objects/units/CircuitBoard'

export default function CircuitBoardScene() {
  const circuitBoardRef = useRef()

  return (
    <>
      <directionalLight
        shadow-mapSize-height={128}
        shadow-mapSize-width={128}
        castShadow
        position={[0, 2, 2]}
      />
      <pointLight position={[10, 10, 10]} />
      <CircuitBoard ref={circuitBoardRef} position={[0, 0, 0]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      {/* <EffectComposer>
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
        <Bloom luminanceThreshold={0} luminanceSmoothing={3.5} height={100} />
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
      </EffectComposer> */}
    </>
  )
}
