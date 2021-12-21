import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useMemo } from 'react'
import { useMediaStream } from '../lib/contexts/MediaStreamContext'
import BoxScene from '../lib/scenes/BoxScene'
import TextScene from '../lib/scenes/TextScene'
import { useMidi } from '../lib/contexts/MidiContext'
import { useStateStorage } from '../lib/state/stateStorage'
import { SceneSelector } from '../lib/objects/utilities/SceneSelector'
import InnerTriangleScene from '../lib/scenes/InnerTrianglesScene'
import SceneDropdown from '../lib/objects/utilities/SceneDropdown'
import CircuitBoardScene from '../lib/scenes/CircuitBoardScene'
import USBScene from '../lib/scenes/usbScene'
import HexagonGridScene from '../lib/scenes/HexagonGridScene'

const handleSelection = (inputs, setSelectedInput) => event => {
  setSelectedInput(inputs.find(input => input.name === event.target.value))
}

const useFirstMidi = inputs => {
  const firstTime = useRef(true)
  const firstRenderWithMidi = firstTime.current
  if (inputs.length > 0 && firstRenderWithMidi) {
    firstTime.current = false
    return true
  }

  return false
}

export default function Home() {
  const { stream, start, stop } = useMediaStream()

  const { inputs } = useMidi()
  const selectedInput = useStateStorage(state => state.midiInput)
  const setSelectedInput = useStateStorage(state => state.setMidiInput)

  const midiSelect = useMemo(
    () =>
      inputs.length > 0 ? (
        <select
          className={styles.midiSelect}
          value={selectedInput && selectedInput.name}
          onChange={handleSelection(inputs, setSelectedInput)}>
          {inputs.map(input => (
            <option key={input.name} value={input.name}>
              {input.name}
            </option>
          ))}
        </select>
      ) : // eslint-disable-next-line react-hooks/exhaustive-deps
      null,
    [inputs, selectedInput]
  )

  const firstTimeMidi = useFirstMidi(inputs)
  if (firstTimeMidi) {
    setSelectedInput(inputs[0])
  }

  const toggleMic = () => (stream ? stop() : start())

  return (
    <>
      <div className={styles.bottomOptions}>
        <button className={styles.microphoneButton} onClick={toggleMic}>
          {stream ? 'Close Microphone' : 'Open Microphone'}
        </button>
        {midiSelect}
        <SceneDropdown />
      </div>
      <div className={styles.container}>
        <SceneSelector useOrtographic>
          <BoxScene pulseBackground />
          <HexagonGridScene pulseBackground />
          <USBScene />
          <CircuitBoardScene />
          <InnerTriangleScene useOrtographic pulseBackground />
          <TextScene quantity={40} />
        </SceneSelector>
      </div>
    </>
  )
}
