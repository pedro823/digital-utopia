import * as Comlink from 'comlink'

// Root-mean-square of an array.
function _RMS(arr, startIndex, endIndex) {
  if (endIndex == undefined) {
    endIndex = arr.length - 1
  }

  if (startIndex == undefined) {
    startIndex = 0
  }

  let sum = 0

  for (let i = startIndex; i < endIndex; i++) {
    const elem = arr[i]
    sum += elem * elem
  }

  const mean = sum / (endIndex - startIndex + 1)
  return Math.sqrt(mean)
}

export const RMS = _RMS

class AudioFunctions {
  RMS(arr) {
    return _RMS(arr)
  }
}

Comlink.expose(AudioFunctions)
