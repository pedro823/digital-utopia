import { RMS } from './audioFunctions'

const arraySlice = (startIndex, length) => {
  return {
    get: (target, prop) => {
      if (prop === 'length') {
        return length
      }

      const i = parseInt(prop)

      if (i >= length) {
        return undefined
      }

      return target[startIndex + i]
    },
  }
}

class BufferedRmsFetcher {
  constructor(analyserContext) {
    this.binCount = analyserContext.frequencyBinCount
    this.buffer = new Float32Array(this.binCount)
  }
}

export default class TransientDetector {
  constructor(audioSource) {}
}
