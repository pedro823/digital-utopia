import { useEffect, useRef } from 'react'
import { useStateStorage } from '../state/stateStorage'

export const useBeatFrame = () => {
  const beatFrameRef = useRef(useStateStorage.getState().isBeatFrame)

  useEffect(
    () =>
      useStateStorage.subscribe(
        isBeatFrame => (beatFrameRef.current = isBeatFrame),
        state => state.isBeatFrame
    )
  )

  return () => beatFrameRef.current
}