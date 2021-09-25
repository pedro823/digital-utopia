import React, { createContext, FunctionComponent, useEffect, useState, useContext } from 'react';
import { useInputAudio } from './InputAudioContext';

const AudioAnalyserContext = createContext({
  analyser: undefined,
  transientDetector: undefined,
  hypeDetector: undefined,
});

const buildAudioAnalyser = (audioSource) => {
  const lowpassFilter = audioSource.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  lowpassFilter.Q.value = 90;
  lowpassFilter.frequency.value = 68;

  audioSource.connect(lowpassFilter);

  const highpassFilter = audioSource.createBiquadFilter();
  highpassFilter.type = 'highpass';
  highpassFilter.Q.value = 72;
  highpassFilter.frequency.value = 5000;

  audioSource.connect(highpassFilter);
}

export const useAudioAnalyser = () => useContext(AudioAnalyserContext);

export const AudioAnalyserProvider = ({ children }) => {
  const [analyser, setAnalyser] = useState();
  const { source } = useInputAudio();

  useEffect(() => {
    if (source) {
      const analyserNode = source.context.createAnalyser();
      analyserNode.fftSize = 256;
      analyserNode.minDecibels = -96;
      analyserNode.maxDecibels = 0;
      source.connect(analyserNode);
      setAnalyser(analyserNode);
    }
  }, [source]);

  useEffect(() => {
    if (analyser && source) {
      source.connect(analyser);
    }

    if (!source) {
      if (analyser) {
        analyser.disconnect();
        setAnalyser(undefined);
      }
    }

    return () => {
      if (analyser) {
        analyser.disconnect();
        setAnalyser(undefined);
      }
    }
  }, [analyser, source])

  return (
    <AudioAnalyserContext.Provider value={{ analyser }}>
      {children}
    </AudioAnalyserContext.Provider>
  )
}

export default AudioAnalyserContext;
