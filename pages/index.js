import styles from '../styles/Home.module.css'
import React, { useEffect, useMemo } from 'react'
import { useMediaStream } from '../lib/contexts/MediaStreamContext'
import BoxScene from '../lib/scenes/BoxScene'
import { useMidi } from '../lib/contexts/MidiContext'
import { useStateStorage } from '../lib/state/stateStorage'
import { SceneSelector } from '../lib/logic/SceneSelector'
import { InnerTriangleScene } from '../lib/scenes/InnerTrianglesScene'

const handleSelection = (inputs, setSelectedInput) => (event) => {
  setSelectedInput(inputs.find(input => input.name === event.target.value))
}

export default function Home() {
  const { stream, start, stop } = useMediaStream()

  const { inputs } = useMidi()
  const selectedInput = useStateStorage(state => state.midiInput)
  const setSelectedInput = useStateStorage(state => state.setMidiInput)

  const midiSelect = useMemo(() => inputs.length > 0 ? (
    <select className={styles.midiSelect}
      value={selectedInput && selectedInput.name}
      onChange={handleSelection(inputs, setSelectedInput)}>
      {inputs.map(input => (
        <option key={input.name} value={input.name}>{input.name}</option>
      ))}
    </select>
  ) : null, [inputs, selectedInput])

  useEffect(() => {
    console.log(selectedInput)
  }, [selectedInput])

  const toggleMic = () => stream ? stop() : start()

  return (
    <>
      <div className={styles.bottomOptions}>
        <button className={styles.microphoneButton} onClick={toggleMic}>
          {stream ? 'Close Microphone' : 'Open Microphone'}
        </button>
        {midiSelect}
      </div>
      <div className={styles.container}>
        <SceneSelector>
          <BoxScene pulseBackground></BoxScene>
          <InnerTriangleScene useOrtographic pulseBackground></InnerTriangleScene>
        </SceneSelector>
      </div>
    </>
  );
}
