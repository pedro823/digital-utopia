import React, { useEffect, useRef } from 'react'
import Box from '../objects/units/box'
import { UtopiaIcosahedron } from '../objects/units/icosahedron'
import { CameraShake, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStateStorage } from '../state/stateStorage'
import { interpolate } from '../logic/interpolate'
import { EffectComposer, Bloom, ChromaticAberration, Scanline, Grid, Noise, Outline, DotScreen } from '@react-three/postprocessing'
import { BlendFunction, Resizer, KernelSize } from 'postprocessing'
import { BeatPop } from '../effects/BeatPopEffect'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'
import { RadialBreathing } from '../objects/units/RadialBreathing'

export default function BoxScene() {
  const orbitControlsRef = useRef(null)
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const beatPopRef = useRef()
  const chromaticAberrationRef = useRef()

  const t = useRef(0)
  const animationState = useRef({ x: -1.2, y: 0, z: 0 })
  const interpolation = interpolate(animationState.current, { x: 10, y: 0, z: 0 })

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame((state, delta) => {
    if (beatFrameRef.current) {
      t.current = Math.random();
      beatPopRef.current.blink = 0.8;
      chromaticAberrationRef.current.offset.x = 0.03
      chromaticAberrationRef.current.offset.y = -0.03
    } else {
      t.current += Math.sin(state.clock.elapsedTime) * delta * 0.05;
      beatPopRef.current.blink = Math.max(0.0, beatPopRef.current.blink - 0.1);
      const chromaticAberrationAmount = Math.max(0.002, chromaticAberrationRef.current.offset.x - 0.004)
      chromaticAberrationRef.current.offset.x = chromaticAberrationAmount
      chromaticAberrationRef.current.offset.y = -chromaticAberrationAmount

    }
    animationState.current = interpolation(t.current)
  })

  const cameraShakeConfig = {
    maxYaw: 0.01, // Max amount camera can yaw in either direction
    maxPitch: 0.01, // Max amount camera can pitch in either direction
    maxRoll: 0.1, // Max amount camera can roll in either direction
    yawFrequency: 12, // Frequency of the the yaw rotation
    pitchFrequency: 12, // Frequency of the pitch rotation
    rollFrequency: 1, // Frequency of the roll rotation
    intensity: 2, // initial intensity of the shake
    decay: true, // should the intensity decay over time
    decayRate: 0.01, // if decay = true this is the rate at which intensity will reduce at
    controls: orbitControlsRef, // if using orbit controls, pass a ref here so we can update the rotation
  }

  return (
    <>
      {/* <AutomaticBeat bpm={128} /> */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <Box position={[-1.2, 0, 0]} positionAnimation={animationState} /> */}
      <RadialBreathing
        position={[0, 0, 0]}
        layers={4}
        spacingBetweenLayers={2}
        offsetZPerLayer={4}
        spinSpeed={0.3}
      />
      <UtopiaIcosahedron position={[0, 0, 0]} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        ref={orbitControlsRef} />
      <CameraShake {...cameraShakeConfig} />
      <EffectComposer>
        {/* <Noise
          premultiply // enables or disables noise premultiplication
          blendFunction={BlendFunction.ADD} // blend mode
        /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={2.3} height={150} /> */}
        <BeatPop ref={beatPopRef} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
          ref={chromaticAberrationRef}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          density={4} // scanline density
        />
        {/* <Grid
          blendFunction={BlendFunction.OVERLAY} // blend mode
          scale={1.0} // grid pattern scale
          lineWidth={0.0} // grid pattern line width
          size={{ width: 300, height: 300 }} // overrides the default pass width and height
        /> */}
        {/* <Outline xray
          blendFunction={BlendFunction.COLOR_BURN}
          width={720}
          height={480}
          visibleEdgeColor={0xfefefe}
          hiddenEdgeColor={0x663437} /> */}
      </EffectComposer>
    </>
  )
}