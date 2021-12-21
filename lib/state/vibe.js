import create from 'zustand'

const useVibe = create(set => ({
  isHype: false,
  setHype: isHype => set({ isHype }),
  isTransient: false,
  setTransient: isTransient => set({ isTransient }),
}))
