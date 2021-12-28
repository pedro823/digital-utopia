### Digital Utopia

Digital Utopia is a project aimed on creating high-quality
visuals that react to the beat and/or energy of a song. It is aimed
to be used in parties, clubs and raves, and to be controllable via MIDI.

![An example of visuals](video-example.webp)

⚠️ Very early work in progress!

Currently, the only browser that will be aimed for full support is chrome/chromium.
This is because it is the only one that implements webMIDI fully.

### To develop

with `npm` installed, run

```bash
npm run dev
```

and access port 3000 on your computer.

This project heavily relies on [r3f](https://github.com/pmndrs/react-three-fiber)'s ecosystem, 
so you could look there for help.

the `index.js` contains a `SceneSelector`, in which you can plug your own scenes.

An example scene that reacts to the beat looks like this:

```js
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBeatFrame } from '../hooks/useBeatFrame'
import slew from '../logic/slew'
import { AutomaticBeat } from '../objects/utilities/AutomaticBeat'
import { OrbitControls } from '@react-three/drei'

export default function ExampleScene() {
  const boxRef = useRef()
  const beatFrame = useBeatFrame()
  const slewerContext = slew({
    slewGoingUp: false,
    slewGoingDown: true,
    defaultValue: 1,
    slewFactor: 3
  })

  useFrame(() => {
    const desiredScale = beatFrame() ? 3 : 1
    const actualScale = slewerContext(desiredScale)
    const { current: box } = boxRef

    box.scale.x = box.scale.y = box.scale.z = actualScale
  })

  // Note: the AutomaticBeat is only there so that 
  // something generates the beat signal. In a live context,
  // other things could generate a beat signal, such as a MIDI clock (WIP)
  // or a transient detector on the sound (not implemented yet)
  return (
    <>
      <mesh
        ref={boxRef} 
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" color="#f3f3f3" wireframe />
      </mesh>
      <OrbitControls />
      <AutomaticBeat bpm={110} />
    </>
  )
}
```