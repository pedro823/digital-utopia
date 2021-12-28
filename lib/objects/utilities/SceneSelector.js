import React, { useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, useContextBridge } from '@react-three/drei'
import InputAudioContext from '../../contexts/InputAudioContext'
import MidiContext, { useMidi } from '../../contexts/MidiContext'
import AudioAnalyserContext, { useAudioAnalyser } from '../../contexts/AudioAnalyzerContext'
import MediaStreamContext, { useMediaStream } from '../../contexts/MediaStreamContext'
import { useStateStorage } from '../../state/stateStorage'
import { BackgroundPulser } from '../units/BackgroundPulser'

export function SceneSelector({ children }) {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children])
  const ContextBridge = useContextBridge(
    MidiContext,
    MediaStreamContext,
    InputAudioContext,
    AudioAnalyserContext
  )
  const sceneIndex = useStateStorage(state => state.sceneIndex)
  const setScenesAvailable = useStateStorage(state => state.setScenesAvailable)
  const scenesAvailable = useStateStorage(state => state.scenesAvailable)
  const canvasRef = useRef()

  if (scenesAvailable !== childrenArray.length) {
    setScenesAvailable(childrenArray.length)
  }

  const currentScene = childrenArray[sceneIndex]
  return (
    <Canvas gl2 concurrent orthographic={currentScene.props.useOrtographic} ref={canvasRef}>
      <ContextBridge>
        {currentScene}
        {currentScene.props.pulseBackground && (
          <BackgroundPulser
            intensity={currentScene.props.pulseIntensity ?? 1}
            negative={currentScene.props.negativeBackground}
            slewFactor={0.1}
          />
        )}
        <AdaptiveDpr pixelated />
      </ContextBridge>
    </Canvas>
  )
}
