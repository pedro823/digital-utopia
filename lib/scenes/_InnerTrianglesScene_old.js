import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

export default function InnerTriangleSceneOld() {
  const mesh = useRef()
  const t = useRef(0)
  const axisOfRotation = new Vector3(0, 0, 0)

  const { matrix, trianglesOut, trianglesIn, geometry } = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      Math.cos(0),
      Math.sin(0),
      0,
      Math.cos(2 * Math.PI / 3),
      Math.sin(2 * Math.PI / 3),
      0,
      Math.cos(4 * Math.PI / 3),
      Math.sin(4 * Math.PI / 3),
      0,
    ])

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const trianglesOut = []
    const trianglesIn = []
    for (let i = 0; i < 10; i++) {
      trianglesOut.push(new THREE.Vector3(i, 0, 0))
      trianglesIn.push(new THREE.Vector3(i, 0, 0))
    }

    return {
      trianglesOut,
      trianglesIn,
      geometry,
      matrix: new THREE.Matrix4(),
    }
  }, [])

  useFrame((state, delta) => {
    if (!mesh.current) {
      return
    }

    let i = 0
    for (let triangleOut of trianglesOut) {
      matrix
        .identity()
        .makeScale(triangleOut.x * 10, triangleOut.x * 40, triangleOut.x * 20)
        .makeTranslation(0, 0, -triangleOut.x)
        // .makeRotationAxis(axisOfRotation, trianglesOut.x)

      mesh.current.setMatrixAt(i, matrix)
      i++
    }
    for (let triangleIn of trianglesIn) {
      matrix
        .identity()
        .makeScale(triangleIn.x, triangleIn.x, triangleIn.x)
        .makeTranslation(0, 0, -triangleIn.x)
        // .makeRotationAxis(axisOfRotation, trianglesOut.x)

      mesh.current.setMatrixAt(i, matrix)
      i++
    }

    mesh.current.instanceMatrix.needsUpdate = true
  })

  console.log(geometry)
  return (
    <>
      <instancedMesh ref={mesh} args={[geometry, null, trianglesIn.length + trianglesOut.length]}>
        <meshBasicMaterial wireframe></meshBasicMaterial>
        {/* <meshPhongMaterial attach="material" color="#f3f3f3" wireframe /> */}
      </instancedMesh>
      <OrbitControls />
    </>
  )
}