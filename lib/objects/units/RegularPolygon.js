import { extend, useThree } from '@react-three/fiber'
import { BufferGeometry, Vector2, Vector3 } from 'three'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'
import { useMemo, forwardRef } from 'react'

extend({ MeshLine, MeshLineMaterial })

const generatePolygonPoints = (sides, center, radius, rotation) => {
  const points = []
  const fraction = (2 * Math.PI) / sides

  // this yields n + 2 points so that the lines connect from end to end without 
  for (let i = 0; i < sides + 1; i++) {
    points.push(
      center.x + Math.cos(i * fraction + rotation) * radius,
      center.y + Math.sin(i * fraction + rotation) * radius,
      0
    )
  }

  return points
}

export function RegularPolygon({ sides, center, radius, rotation, ref, color, lineWidth }) {
  const points = useMemo(
    () => generatePolygonPoints(sides, center, radius, rotation),
    [sides, center, radius, rotation]
  )

  const { size } = useThree()

  const mat = new MeshLineMaterial({
    lineWidth: lineWidth ?? 0.2,
    color: color || '#ccc',
    resolution: new Vector2(size.width, size.height)
  })

  return (
    <mesh ref={ref} material={mat}>
      <meshLine attach="geometry" points={points} />
      {/* <meshLineMaterial
        attach="material"
        color={'#fff'}
        resolution={}
        near={1}
        far={1000}
        sizeAttenuation={1}
      /> */}
    </mesh>
    // <line ref={ref} geometry={geometry}>
    //   <lineBasicMaterial
    //     attach="material"
    //     color={color || '#fff'}
    //     linewidth={1000}
    //     linecap="round"
    //     linejoin="round"></lineBasicMaterial>
    // </line>
  )
}

export const Triangle = forwardRef(function Triangle(props, ref) { return RegularPolygon({ ...props, ref, sides: 3 }) })
export const Square = forwardRef(function Square(props, ref) { return RegularPolygon({ ...props, ref, sides: 4 }) })
export const Pentagon = forwardRef(function Pentagon(props, ref) { return RegularPolygon({ ...props, ref, sides: 5 }) })
export const Hexagon = forwardRef(function Hexagon(props, ref) { return RegularPolygon({ ...props, ref, sides: 6 }) })
