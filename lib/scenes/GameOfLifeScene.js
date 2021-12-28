import { OrbitControls, Stats } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { useRef } from 'react'
import { useBeatFrame } from '../hooks/useBeatFrame'
import FlatPolygon from '../objects/units/FlatPolygon'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Noise, Bloom, ChromaticAberration, Scanline } from '@react-three/postprocessing'

const createGameGrid = ({ width, height }) => {
  const grid = []

  for (let i = 0; i < height; i++) {
    grid[i] = []
    for (let j = 0; j < width; j++) {
      grid[i].push(false)
    }
  }

  populateGameGrid(grid, { width, height })

  return grid
}

const populateGameGrid = (grid, { width, height }) => {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      grid[i][j] = Math.random() < 0.2 ? 1 : 0
    }
  }
}

const countAliveNeighbors = (grid, i, j, width, height) => {
  const rowBefore = (i - 1 + height) % height
  const rowAfter = (i + 1) % height

  const columnBefore = (j - 1 + width) % width
  const columnAfter = (j + 1) % width

  let count = 0

  count += grid[rowBefore][columnBefore]
  count += grid[rowBefore][j]
  count += grid[rowBefore][columnAfter]

  count += grid[i][columnBefore]
  count += grid[i][columnAfter]

  count += grid[rowAfter][columnBefore]
  count += grid[rowAfter][j]
  count += grid[rowAfter][columnAfter]

  return count
}

const runStep = (grid, newGrid) => {
  const height = grid.length
  const width = grid[0].length

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const neighborCount = countAliveNeighbors(grid, i, j, width, height)

      if (neighborCount === 2) {
        newGrid[i][j] = grid[i][j]
      } else if (neighborCount === 3) {
        newGrid[i][j] = 1
      } else {
        newGrid[i][j] = 0
      }
    }
  }

  return newGrid
}

const getGrids = (gridsRef, correctGridRef) => {
  const grids = gridsRef.current
  const useRightGrid = correctGridRef.current

  if (useRightGrid) {
    return [grids[1], grids[0]]
  }

  return grids
}

export default function GameOfLifeScene() {
  const width = 80
  const height = 60

  // we need two grids so that we don't compute in-place.
  // one has the correct game info, the other is a helper grid.
  // they swap roles at every step of the game.
  const gridsRef = useRef([
    createGameGrid({ width, height }),
    Array(height)
      .fill()
      .map(() =>
        Array(width)
          .fill()
          .map(() => 0)
      ),
  ])
  const correctGridRef = useRef(0)
  const frameCounter = useRef(0)
  const beatFrame = useBeatFrame()

  const squaresRef = useRef([])
  const squareComponents = gridsRef.current[0]
    .map((row, i) => {
      return row.map((squareValue, j) => (
        <FlatPolygon
          sides={4}
          position={[j - width / 2, -i + height / 2, 0]}
          color={squareValue ? '#fff' : '#000'}
          size={0.6}
          thickness={0.1}
          key={Math.random()}
          rotation={Math.PI / 4}
          ref={ref => squaresRef.current.push(ref)}
        />
      ))
    })
    .flat()

  useFrame((_, delta) => {
    const isBeat = beatFrame()

    if (frameCounter.current < 0.15 && !isBeat) {
      frameCounter.current += delta
      return
    }
    frameCounter.current = 0

    let [oldGrid, newGrid] = getGrids(gridsRef, correctGridRef)

    if (isBeat) {
      populateGameGrid(newGrid, { width, height })
    } else {
      newGrid = runStep(oldGrid, newGrid)
    }

    const squares = squaresRef.current
    for (let i = 0; i < squares.length; i++) {
      const square = squares[i]
      if (!square) {
        continue
      }

      square.material?.color.setScalar(newGrid[Math.floor(i / width)]?.[i % width])
    }

    correctGridRef.current = !correctGridRef.current
  })

  return (
    <>
      <pointLight position={(0, 0, 2)} />
      {squareComponents}
      <AutomaticBeat bpm={80} />
      <OrbitControls />
      <EffectComposer>
        <Noise
          premultiply // enables or disables noise premultiplication
          blendFunction={BlendFunction.ADD} // blend mode
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={2.3} height={150} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          density={4} // scanline density
        />
      </EffectComposer>
    </>
  )
}
