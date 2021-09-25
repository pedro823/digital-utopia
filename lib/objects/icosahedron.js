import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron } from '@react-three/drei'
import { useAudioAnalyser } from '../contexts/AudioAnalyzerContext';

export default function UtopiaIcosahedron(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  const audioBuffer = useRef();
  const { analyser } = useAudioAnalyser();
  
  console.log({ analyser, props });
  useEffect(() => {
    if (!analyser) {
      return
    }

    audioBuffer.current = new Float32Array(analyser.fftSize);
    return () => {
      audioBuffer.current = null;
    }
  }, [analyser])

  useFrame((state, delta) => {
    mesh.current.rotation.y += 0.01

    if (!analyser || !audioBuffer.current) {
      mesh.current.scale.clampScalar(1, 1)
      return
    }

    analyser.getFloatTimeDomainData(audioBuffer.current)
    console.log(audioBuffer.current)
    const twentyFiveHz = audioBuffer.current[24]
    const ratio = 1 + (twentyFiveHz / 256) * 2
    // const ratio = (twentyHz / 54) + 64
    // const ratio = mesh.current.scale >= 2 ? 1 : (mesh.current.scale + 0.02)
    // console.log(ratio)
    mesh.current.scale.set(ratio, ratio, ratio).clampScalar(1, 2)
    console.log(mesh.current.scale)
    // console.log(mesh.current.scale)
    // mesh.current.scale.multiplyScalar(Math.random() * 2).clampScalar(1, 2)
    // mesh.current.scale.;
  })

  return (
    <Icosahedron
      {...props}
      ref={mesh}
      rotation={[0.2, 0, 0]}
      scale={1}
    >
      <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
    </Icosahedron>
  )
}