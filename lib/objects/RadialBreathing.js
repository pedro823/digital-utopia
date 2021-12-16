import { useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef } from "react";
import { Box } from "./units/box";

const PHI = 1.618281828

const circlePosition = (itemIndex, maxItems, layerOffsetTheta) => {
  const fraction = (itemIndex + 1) / maxItems
  const theta = fraction * Math.PI * 2

  return { theta: theta + layerOffsetTheta, position: [Math.cos(theta + layerOffsetTheta), Math.sin(theta + layerOffsetTheta)] }
}

const fibonacciNumber = (n) => {
  let a = 0, b = 1
  while (n--) {
    [a, b] = [b, a + b]
  }
  return a
}

export const RadialBreathing = forwardRef(function RadialBreathing({
  position = [0, 0, 0],
  offsetZPerLayer = 0,
  firstLayerFibNumber = 5,
  initialRadius = 0.5,
  spacingBetweenLayers = 0.5,
  layers,
  spinSpeed,
  children
}, ref) {
  const [posX, posY, posZ] = position

  const childrenRefs = useRef([])
  const createdChildren = useMemo(() => new Array(layers).fill().flatMap((_, layerNumber) => {
    const radius = initialRadius + (layerNumber + 1) * spacingBetweenLayers
    // TODO optimize O(n) calls to fibonacciNumber
    const amountOfChildren = fibonacciNumber(firstLayerFibNumber + layerNumber)

    const layerOffsetTheta = PHI * layerNumber
    const layerOffsetZ = posZ + offsetZPerLayer * layerNumber
    const shapes = []
    for (let i = 0; i < amountOfChildren; i++) {
      const { theta, position: [offsetX, offsetY] } = circlePosition(i, amountOfChildren, layerOffsetTheta)
      const shapePosition = [posX + offsetX * radius, posY + offsetY * radius, layerOffsetZ]
      // TODO figure out how to instantiate one children
      shapes.push(
        <Box
          key={`${layerNumber}-${i}`}
          ref={(element) => {
            childrenRefs.current.push({ layerNumber, element, theta })
          }}
          position={shapePosition}
        />
      )
    }

    return shapes
  }), [])

  useFrame((_, delta) => {
    // const spinIncrement = [Math.cos(spinSide * spinSpeed), Math.sin(spinSide * spinSpeed), 0]
    const spinIncrement = 2 * Math.PI * spinSpeed * delta
    childrenRefs.current.forEach((child) => {
      //{ layerNumber, element, theta }
      const radius = initialRadius + (child.layerNumber + 1) * spacingBetweenLayers
      const spinSide = child.layerNumber % 2 === 0 ? 1 : -1
      child.theta += spinIncrement * spinSide
      child.element.position.set(Math.cos(child.theta) * radius, Math.sin(child.theta) * radius, child.element.position.z)
    })
  })

  // console.log({ ...getChildren()[0].childObject, test: 1 })

  return (
    <>
      {createdChildren}
    </>
  )
})