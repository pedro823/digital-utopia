import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStateStorage } from '../state/stateStorage'

export default function Box(props) {
  const mesh = useRef()
  const beatFrameRef = useRef()

  const [active, setActive] = useState(false)
  const { positionAnimation } = props

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame((state, delta) => {
    mesh.current.rotation.x += 0.01
    const currentPosition = positionAnimation && positionAnimation.current
    if (currentPosition) {
      mesh.current.position.set(currentPosition.x, currentPosition.y, currentPosition.z)
    }
    const { current: isBeatFrame } = beatFrameRef
    mesh.current.wireframe = !isBeatFrame
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
    </mesh>
  )
}