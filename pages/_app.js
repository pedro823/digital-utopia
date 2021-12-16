import { AudioAnalyserProvider } from '../lib/contexts/AudioAnalyzerContext'
import { InputAudioProvider } from '../lib/contexts/InputAudioContext'
import { MediaStreamProvider } from '../lib/contexts/MediaStreamContext'
import { MidiProvider } from '../lib/contexts/MidiContext'
import Head from 'next/head';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <MidiProvider>
      <MediaStreamProvider audio={true}>
        <InputAudioProvider>
          <AudioAnalyserProvider>
            <Component {...pageProps} />
          </AudioAnalyserProvider>
        </InputAudioProvider>
      </MediaStreamProvider>
    </MidiProvider>
  )
}

export default MyApp
