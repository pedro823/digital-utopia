import { Hexagon, Square } from '../objects/units/RegularPolygon'
import { OrbitControls } from '@react-three/drei'
import {
  generateGrid,
  OFFSET_HEXAGONAL,
  OFFSET_SQUARE,
  SPACING_COLUMN_HEXAGONAL,
  SPACING_COLUMN_SQUARE,
  SPACING_ROW_HEXAGONAL,
  SPACING_ROW_SQUARE,
} from '../logic/generateGrid'
import { Vector3 } from 'three'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'

export default function HexagonGridScene() {
  const radius = 1
  // TIP: Row spacing = 3, column spacing = sqrt(3), radius = 3 on hexagon fcking rocks yo
  const grid = generateGrid({
    startingPoint: new Vector3(-15, 15, 0),
    columnPointCount: 20,
    rowPointCount: 20,
    radius: radius,
    columnSpacing: SPACING_COLUMN_SQUARE,
    rowSpacing: SPACING_ROW_SQUARE,
    evenOddRowOffset: OFFSET_SQUARE,
  })

  return (
    <>
      {grid.map((center, idx) => (
        <Hexagon
          center={center}
          key={`hexagon-grid-${idx}`}
          radius={radius * 3}
          color="#00ff00"
          rotation={Math.PI / 2}
        />
      ))}
      {/* {grid.map((center, idx) => (
        <Square center={center} key={`square-grid-${idx}`} radius={radius} color="#00ff00" rotation={Math.PI / 4} />
      ))} */}
      <AutomaticBeat bpm={128} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}
