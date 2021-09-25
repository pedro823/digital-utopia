import React, { createContext, useContext, useEffect, useState } from 'react'

const MidiContext = createContext({
  inputs: [],
  outputs: [],
});

export const useMidi = () => useContext(MidiContext);

export const MidiProvider = ({ children }) => {
  const [access, setAccess] = useState({ inputs: undefined, outputs: undefined });

  useEffect(() => {
    const fetchNavigatorAccess = async () => {
      try {
        const navigatorAccess = await navigator.requestMIDIAccess();
        setAccess(() => navigatorAccess);
        console.log(navigatorAccess);
      } catch (ex) {
        console.error('could not fetch access to MIDI controllers. Reload the page to request again. Underlying exception:', ex);
      }
    }

    if (!access.inputs) {
      fetchNavigatorAccess();
    }
  }, [access]);

  const provision = {
    inputs: access.inputs ? [...access.inputs.values()] : [],
    outputs: access.outputs ? [...access.outputs.values()] : []
  }

  return (
    <MidiContext.Provider value={provision}>
      {children}
    </MidiContext.Provider>
  )
}

export default MidiContext;
