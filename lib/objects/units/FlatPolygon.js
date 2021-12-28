import { forwardRef } from "react";
import { DoubleSide, RingGeometry } from "three";

export default forwardRef(function FlatPolygon({ position, color, size, thickness, sides, rotation, ...props }, ref) {
  const geometry = new RingGeometry(size, size + thickness, sides, 1, rotation)

  if (!position) {
    position = [0, 0, 0]
  }

  return (
    <mesh position={position} ref={ref} geometry={geometry} {...props}>
      <meshBasicMaterial attach="material" color={color} side={DoubleSide} />
    </mesh>
  )
})