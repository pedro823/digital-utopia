import React, { createContext, FunctionComponent, useCallback, useContext, useState, useEffect } from 'react';

// interface MediaStreamContextValue {
//   stream: MediaStream | undefined;
//   start: () => void;
//   stop: () => void;
// }

const MediaStreamContext = createContext({
  stream: undefined,
  start: () => {},
  stop: () => {},
});

export const useMediaStream = () => useContext(MediaStreamContext);

// interface Props {
//   audio: boolean;
//   video: boolean;
// }
export const MediaStreamProvider = ({ children, audio }) => {
  const [stream, setStream] = useState();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [stream]);

  const start = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio });
    setStream(mediaStream);
  }, [audio]);

  const stop = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(undefined);
    }
  }, [stream]);

  return (
    <MediaStreamContext.Provider value={{ stream, start, stop }}>
      {children}
    </MediaStreamContext.Provider>
  );
}

export default MediaStreamContext;
