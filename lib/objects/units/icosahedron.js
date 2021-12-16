import * as THREE from 'three'
import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron } from '@react-three/drei'
import { useStateStorage } from '../../state/stateStorage'
import mergeRefs from 'react-merge-refs'

export const UtopiaIcosahedron = forwardRef(function UtopiaIcosahedron(props, ref) {
  const mesh = useRef()

  const turnVelocity = useRef(0.1)
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  useFrame(() => {
    if (beatFrameRef.current) {
      turnVelocity.current = 0.5
    } else {
      turnVelocity.current = THREE.MathUtils.clamp(turnVelocity.current - 0.02, 0.05, 0.5)
    }

    mesh.current.rotation.y += turnVelocity.current

    if (beatFrameRef.current) {
      mesh.current.scale.set(2, 2, 2)
      return
    }

    const nextScale = mesh.current.scale.x - 0.2
    mesh.current.scale.set(nextScale, nextScale, nextScale).clampScalar(1, 2)
  })

  return (
    <Icosahedron
      ref={mergeRefs([mesh, ref])}
      rotation={[0, 0, 0]}
      scale={1}
      {...props}
    >
      <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
    </Icosahedron>
  )
})