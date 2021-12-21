import { EffectComposer } from "@react-three/postprocessing";
import { Brightness } from "../../effects/BrightnessEffect";

const generateRandomBrightnessCurve = (pointCount) => {
  
}

export default function BrightnessRandomizer({ tRef, children }) {
  const brightnessRef = useRef()

  return (
    <>
      {...children}
      <EffectComposer>
        <Brightness ref={brightnessRef} />
      </EffectComposer>
    </>
  )
}