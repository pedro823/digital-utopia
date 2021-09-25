import React, { useEffect, useRef } from 'react'
import Box from '../objects/box'
import UtopiaIcosahedron from '../objects/icosahedron'
import { CameraShake, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStateStorage } from '../state/stateStorage'
import { interpolate } from '../logic/interpolate'
import { EffectComposer, Bloom, ChromaticAberration, Scanline, Grid, Noise, Outline, DotScreen } from '@react-three/postprocessing'
import { BlendFunction, Resizer, KernelSize } from 'postprocessing'

export default function BoxScene() {
  const orbitControlsRef = useRef(null)
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)

  const t = useRef(0)
  const animationState = useRef({ x: -1.2, y: 0, z: 0 })
  const interpolation = interpolate(animationState.current, { x: 10, y: 0, z: 0 })

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame((state, delta) => {
    if (beatFrameRef.current) {
      t.current = Math.random()
    } else {
      t.current += 0.2 * delta
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
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} positionAnimation={animationState} />
      <UtopiaIcosahedron position={[1.2, 0, 0]} />
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
        {/* <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.02, 0.002]}
        /> */}
        {/* <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          density={1.25} // scanline density
        /> */}
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