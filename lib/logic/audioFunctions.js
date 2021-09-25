import * as Comlink from 'comlink'

// Root-mean-square of an array.
function _RMS(arr) {
    let sum = 0
    for (var elem of arr) {
        sum += elem * elem
    }

    const mean = sum / arr.length
    return Math.sqrt(mean)
}

export const RMS = _RMS

export function rmsToDb(rms) {
    return 10 * Math.log10(rms)
}

class AudioFunctions {
    RMS(arr) {
        return _RMS(arr)
    }

    dB(arr) {
        return rmsToDb(_RMS(arr))
    }
}

Comlink.expose(AudioFunctions)