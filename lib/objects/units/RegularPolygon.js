import { extend } from '@react-three/fiber'
import { BufferGeometry, Vector3 } from 'three'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'
import { useMemo } from 'react'

extend({ MeshLine, MeshLineMaterial })

const generatePolygonPoints = (sides, center, radius, rotation) => {
  const points = []
  const fraction = (2 * Math.PI) / sides

  // this yields n + 1 points so that the lines connect from end to end
  for (let i = 0; i <= sides; i++) {
    points.push(
      new Vector3(
        center.x + Math.cos(i * fraction + rotation) * radius,
        center.y + Math.sin(i * fraction + rotation) * radius,
        0
      )
    )
  }

  return points
}

export function RegularPolygon({ sides, center, radius, rotation, ref, color }) {
  const points = useMemo(
    () => generatePolygonPoints(sides, center, radius, rotation),
    [sides, center, radius, rotation]
  )
  const geometry = new BufferGeometry().setFromPoints(points)

  return (
    // <mesh raycast={MeshLineRaycast}>
    //   <meshLine attach="geometry" points={points} />
    //   <meshLineMaterial
    //     attach="material"
    //     lineWidth={2}
    //     color={color || '#fff'}
    //   />
    // </mesh>
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial
        attach="material"
        color={color || '#fff'}
        linewidth={1000}
        linecap="round"
        linejoin="round"></lineBasicMaterial>
    </line>
  )
}

export const Hexagon = props => RegularPolygon({ ...props, sides: 6 })
export const Pentagon = props => RegularPolygon({ ...props, sides: 5 })
export const Square = props => RegularPolygon({ ...props, sides: 4 })
export const Triangle = props => RegularPolygon({ ...props, sides: 3 })
