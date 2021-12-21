import create from 'zustand'

export const useStateStorage = create((set, get) => ({
  midiInput: undefined,
  midiOutput: undefined,
  setMidiInput: (midiInput) => {
    midiInput.onmidimessage = (event) => {
      const { data } = event
      if (data[0] === 248) {
        return
      }
      if ((data[0] & 0xF0) === 0x90) {
        set({ isBeatFrame: true })
        // FIXME can we guarantee that all frame rendering will be run before
        // this is toggled off again? If we need, we can use 
        // requestAnimationFrame => requestAnimationFrame => set
        requestAnimationFrame(() => set({ isBeatFrame: false }))
        return
      }
      if ((data[0] & 0xF0) === 0xC0) {
        const sceneIndex = Math.min(data[1], get().scenesAvailable - 1)
        set({ sceneIndex })
        console.log(`set scene to ${sceneIndex}`)
      }
    }

    set({ midiInput })
  },
  setMidiOutput: (midiOutput) => set({ midiOutput }),
  isBeatFrame: false,
  setBeatFrame: (isBeatFrame) => set({ isBeatFrame }),
  sceneIndex: 0,
  setScene: (sceneIndex) => set({ sceneIndex }),
  scenesAvailable: 0,
  setScenesAvailable: (scenesAvailable) => set({ scenesAvailable })
}))