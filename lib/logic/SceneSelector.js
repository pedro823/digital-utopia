import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, useContextBridge } from '@react-three/drei'
import InputAudioContext from '../../lib/contexts/InputAudioContext'
import MidiContext, { useMidi } from '../../lib/contexts/MidiContext'
import AudioAnalyserContext, { useAudioAnalyser } from '../../lib/contexts/AudioAnalyzerContext'
import MediaStreamContext, { useMediaStream } from '../../lib/contexts/MediaStreamContext'
import { useStateStorage } from '../state/stateStorage'
import { BackgroundPulser } from '../objects/BackgroundPulser'

export function SceneSelector({ children }) {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children])
  const sceneIndex = useStateStorage(state => state.sceneIndex)

  const ContextBridge = useContextBridge(MidiContext, MediaStreamContext, InputAudioContext, AudioAnalyserContext)
  const setScenesAvailable = useStateStorage(state => state.setScenesAvailable)
  setScenesAvailable(childrenArray.length)

  const currentScene = childrenArray[sceneIndex]
  console.log('being re-rendered')
  return (
    <Canvas gl2 concurrent orthographic={currentScene.props.useOrtographic}>
      <ContextBridge>
        {currentScene}
        <BackgroundPulser active={currentScene.props.pulseBackground} negative={currentScene.props.negativeBackground} decaySpeed={10} />
        <AdaptiveDpr pixelated />
      </ContextBridge>
    </Canvas>
  )
}