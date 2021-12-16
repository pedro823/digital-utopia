import { useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import { useStateStorage } from "../../state/stateStorage"

export function AutomaticBeat({ bpm }) {
  const timeBetweenBeats = 1 / (bpm / 60)
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)
  const setBeatFrame = useStateStorage.getState().setBeatFrame
  const totalDelta = useRef(0) 

  useEffect(() => useStateStorage.subscribe(
    isBeatFrame => (beatFrameRef.current = isBeatFrame),
    state => state.isBeatFrame
  ), [])

  // TODO do the maths properly
  useFrame((state, delta) => {
    if (beatFrameRef.current) {
      setBeatFrame(false)
      totalDelta.current = 0
    }
    if (totalDelta.current > timeBetweenBeats) {
      setBeatFrame(true)
    }
    totalDelta.current += delta
  })

  return null
}