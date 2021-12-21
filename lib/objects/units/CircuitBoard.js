import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useStateStorage } from '../../state/stateStorage'
import mergeRefs from 'react-merge-refs'
import { useTexture } from '@react-three/drei'

export const CircuitBoard = forwardRef(function CircuitBoard(props, ref) {
  const mesh = useRef()
  const beatFrameRef = useRef()

  // const maps = useTexture({
  //   map: '../../data/maps/not-dotgrid/color.png',
  //   normalMap: '../../data/maps/not-dotgrid/normal.png',
  //   displacementMap: '../../data/maps/not-dotgrid/height.png'
  // })
  const maps = {}

  // useEffect(() => useStateStorage.subscribe(
  //   isBeatFrame => (beatFrameRef.current = isBeatFrame),
  //   state => state.isBeatFrame
  // ), [])

  // useFrame((state, delta) => {
  //   mesh.current.rotation.x += 0.01
  //   const currentPosition = positionAnimation && positionAnimation.current
  //   if (currentPosition) {
  //     mesh.current.position.set(currentPosition.x, currentPosition.y, currentPosition.z)
  //   }
  //   const { current: isBeatFrame } = beatFrameRef
  //   mesh.current.wireframe = !isBeatFrame
  //   // TODO requires indicating update to mesh
  // })

  return (
    <mesh {...props} ref={mergeRefs([mesh, ref])} scale={1}>
      <boxGeometry args={[10, 10, 10]} />
      {/* <meshStandardMaterial
        attach="material"
        displacementScale={0.2}
        color="#f3f3f3"
        {...maps}
      /> */}
      <meshBasicMaterial color="#fff" />
    </mesh>
  )
})
