import { Hexagon, Square } from '../objects/units/RegularPolygon'
import { CameraShake, OrbitControls } from '@react-three/drei'
import {
  generateGrid,
  OFFSET_HEXAGONAL,
  OFFSET_SQUARE,
  SPACING_COLUMN_HEXAGONAL,
  SPACING_COLUMN_SQUARE,
  SPACING_ROW_HEXAGONAL,
  SPACING_ROW_SQUARE,
} from '../logic/generateGrid'
import { Color, Vector2, Vector3 } from 'three'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useStateStorage } from '../state/stateStorage'
import { UnrealBloomPass, GlitchPass } from 'three-stdlib'
import { useRef, useEffect, useMemo } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import slew from '../logic/slew'
import EffectPassComposer from '../objects/utilities/EffectPassComposer'
import { BackgroundPulser } from '../objects/units/BackgroundPulser'
import FlatPolygon from '../objects/units/FlatPolygon'

extend({ UnrealBloomPass, GlitchPass })

export default function HexagonGridScene() {
  const radius = 1
  // TIP: Row spacing = 3, column spacing = sqrt(3), radius = 3 on hexagon fcking rocks yo
  const grid = useMemo(() => generateGrid({
    startingPoint: new Vector3(-15, 15, 0),
    columnPointCount: 20,
    rowPointCount: 20,
    radius: radius,
    // columnSpacing: SPACING_COLUMN_SQUARE,
    // rowSpacing: SPACING_ROW_SQUARE,
    // evenOddRowOffset: OFFSET_SQUARE,
    columnSpacing: SPACING_COLUMN_HEXAGONAL,
    rowSpacing: SPACING_ROW_HEXAGONAL,
    evenOddRowOffset: OFFSET_HEXAGONAL,
  }), [])

  const { size } = useThree()
  const hexagonArrayRef = useRef([])
  const slewArrayRef = useRef([])
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const orbitControlsRef = useRef()

  useEffect(
    () =>
      useStateStorage.subscribe(
        isBeatFrame => (beatFrameRef.current = isBeatFrame),
        state => state.isBeatFrame
      ),
    []
  )

  useFrame(() => {
    const slewArray = slewArrayRef.current
    for (let index in slewArray) {
      if (beatFrameRef.current) {
        slewArray[index].target = Math.random()
      }

      const { target, slew: slewHexagon } = slewArray[index]
      const hexagon = hexagonArrayRef.current[index]
      // on unmount, hexagons may be null
      if (!hexagon) {
        continue
      }

      hexagon.material.color.setHSL(0.3527, 1.0, slewHexagon(target))
    }

    slewArrayRef.current = slewArray
  })

  const cameraShakeConfig = {
    maxYaw: 0.01, // Max amount camera can yaw in either direction
    maxPitch: 0.01, // Max amount camera can pitch in either direction
    maxRoll: 0.1, // Max amount camera can roll in either direction
    yawFrequency: 1, // Frequency of the the yaw rotation
    pitchFrequency: 1, // Frequency of the pitch rotation
    rollFrequency: 1, // Frequency of the roll rotation
    intensity: 2, // initial intensity of the shake
    decay: true, // should the intensity decay over time
    decayRate: 0.01, // if decay = true this is the rate at which intensity will reduce at
    controls: orbitControlsRef, // if using orbit controls, pass a ref here so we can update the rotation
  }

  return (
    <>
      {grid.map((center, idx) => (
        <Hexagon
          center={center}
          ref={(r) => { 
            hexagonArrayRef.current.push(r)
            slewArrayRef.current.push({ target: 1, slew: slew({ slewGoingUp: true, slewGoingDown: true, defaultValue: 0, slewFactor: 9 })})
          }}
          key={`hexagon-grid-${idx}`}
          radius={radius * 0.98}
          color="#000"
          rotation={Math.PI / 2}
          lineWidth={0.1}
        />
        // <FlatPolygon 
        //   position={center} 
        //   key={`hexagon-grid-${idx}`} 
        //   sides={6} 
        //   size={radius} 
        //   rotation={Math.PI / 2} 
        //   thickness={0.02}
        //   ref={(r) => { 
        //     hexagonArrayRef.current.push(r)
        //     slewArrayRef.current.push({ target: 1, slew: slew({ slewGoingUp: true, slewGoingDown: true, defaultValue: 0, slewFactor: 9 })})
        //   }}
        // />
      ))}
      {/* {grid.map((center, idx) => (
        <Square center={center} key={`square-grid-${idx}`} radius={radius} color="#00ff00" rotation={Math.PI / 4} />
      ))} */}
      <AutomaticBeat bpm={128} />
      {/* <directionalLight
        intensity={1.0}
        position={[0, 2, 2]}
      /> */}
      <BackgroundPulser slewFactor={1.5} intensity={0.1} />
      <OrbitControls enablePan enableZoom enableRotate ref={orbitControlsRef} />
      <CameraShake {...cameraShakeConfig} />
      {/* <EffectPassComposer>
        <unrealBloomPass args={[new Vector2(size.width, size.height), 2.4, 0.3, 0.38]} />
        <glitchPass />
      </EffectPassComposer> */}
      <EffectComposer>
        <Bloom intensity={3} />
      </EffectComposer>
    </>
  )
}
