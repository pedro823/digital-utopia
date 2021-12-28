import { OrbitControls, Stats } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, ChromaticAberration, Scanline } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef } from 'react'
import { Matrix4 } from 'three'
import { useBeatFrame } from '../hooks/useBeatFrame'
import slew from '../logic/slew'
import { BackgroundPulser } from '../objects/units/BackgroundPulser'
import FlatPolygon from '../objects/units/FlatPolygon'
import { Pentagon } from '../objects/units/RegularPolygon'
import { BlendFunction } from 'postprocessing'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'

export default function RotatingTrianglesScence() {
  const trianglesRef = useRef([])
  const beatWave = useRef(-1)
  const oddFrame = useRef(false)
  const matrix = new Matrix4()
  const beatFrame = useBeatFrame()

  const triangles = Array(30)
    .fill()
    .map((_, index) => (
      <FlatPolygon
        position={[0, 0, index * 1.5]}
        color={'#ccc'}
        key={`flatPoly-${Math.random()}`}
        sides={3}
        rotation={0}
        size={(index + 1) * (index + 1) + index}
        thickness={0.1 + 0.15 * (index + 1)}
        ref={ref => trianglesRef.current.push(ref)}
      />
    ))

  const slews = Array(30)
    .fill()
    .map(() =>
      slew({
        slewGoingUp: false,
        slewGoingDown: true,
        defaultValue: 0.6,
        slewFactor: 5,
      })
    )

  useFrame((state, delta) => {
    const triangles = trianglesRef.current
    const sin = Math.sin(state.clock.elapsedTime / 3)
    if (beatFrame()) {
      beatWave.current = 0
    }

    for (let index in triangles) {
      const triangle = triangles[index]
      const s = slews[index]
      if (!triangle || !s) {
        continue
      }

      const desiredBrightness = index == beatWave.current ? 14 : 0.8

      const brightness = s(desiredBrightness)

      matrix.identity().makeRotationZ(0.3e-3 * (index + 3))

      triangle.applyMatrix4(matrix)
      // triangle.scale.x = triangle.scale.y = triangle.z = brightness / 10
      triangle.material?.color.setScalar(brightness)
    }

    state.camera.position.z = -6 + (sin - 1) * 60
    // todo optimize
    state.camera.position.y = -10
    oddFrame.current = !oddFrame.current
    beatWave.current =
      beatWave.current >= triangles.length || beatWave.current === -1 ? -1 : beatWave.current + oddFrame.current
  })

  return (
    <>
      {/* <Pentagon center={{ x: 0, y: 0, z: -10 }} radius={2} rotation={Math.PI / 2} lineWidth={1} /> */}
      {triangles}
      {/* <FlatPolygon 
        position={[0, 0, 0]} 
        sides={3} 
        rotation={0} 
        size={10} 
        thickness={0.1} 
        ref={(ref) => trianglesRef.current.push(ref)} 
      /> */}
      <pointLight position={[2, 2, 2]} />
      <OrbitControls />
      <AutomaticBeat bpm={128} />
      <EffectComposer>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          density={4} // scanline density
        />
        <Bloom intensity={3} />
      </EffectComposer>
    </>
  )
}
