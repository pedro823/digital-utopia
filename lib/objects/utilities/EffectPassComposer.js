import { useThree, extend } from "@react-three/fiber"
import { EffectComposer } from "three-stdlib"
import { useEffect, useRef } from "react"
import React from 'react'

extend({ EffectComposer })

export default function EffectPassComposer({ children }) {
  const composer = useRef()

  const { gl, size, scene, camera } = useThree()
  useEffect(() => composer.current.setSize(size.width, size.height), [size])
  const attachedChildren = React.Children.map(children, child => React.cloneElement(child, {attachArray: 'passes'}))

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {attachedChildren}
    </effectComposer>
  )
}