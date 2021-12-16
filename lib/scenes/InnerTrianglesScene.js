import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function InnerTriangleScene() {
  const mesh = useRef()
  const t = useRef(0)
  const { matrix, trianglesOut, trianglesIn, geometry } = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      Math.cos(0), Math.sin(0), 0,
      // FIXME wtf??????? this is not degrees my guy
      Math.cos(Math.PI / 60), Math.sin(Math.PI / 60), 0,
      Math.cos(Math.PI / 120), Math.sin(Math.PI / 120), 0,
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
      matrix: new THREE.Matrix4()
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
        .makeScale(triangleOut.x, triangleOut.x, triangleOut.x)
        .makeTranslation(0, 0, -5)
        
      mesh.current.setMatrixAt(i, matrix)
      i++
    }
    for (let triangleIn of trianglesIn) {
      matrix
        .identity()
        .makeScale(triangleIn.x, triangleIn.x, triangleIn.x)
        .makeTranslation(0, 0, -5)

      mesh.current.setMatrixAt(i, matrix)
      i++
    }

    mesh.current.instanceMatrix.needsUpdate = true
  })

  console.log(geometry)
  return (
    <instancedMesh ref={mesh} args={[geometry, null, trianglesIn.length + trianglesOut.length]}>
      <meshBasicMaterial ></meshBasicMaterial>
      {/* <meshPhongMaterial attach="material" color="#f3f3f3" wireframe /> */}
    </instancedMesh>
  )
}

export default InnerTriangleScene