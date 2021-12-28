import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'
import { forwardRef, useMemo } from 'react'
import { PopShader } from './shaders/postprocessing/PopShader'

class BeatPopEffect extends Effect {
  constructor() {
    super('BeatPopEffect', PopShader.fragmentShader, {
      blendFunction: BlendFunction.Normal,
      uniforms: new Map([['blink', new Uniform(0.0)]]),
    })
  }
  get blink() {
    return this.uniforms.get('blink').value
  }
  set blink(value) {
    this.uniforms.get('blink').value = value
  }
}

export default BeatPopEffect

export const BeatPop = forwardRef(function BeatPop(props, ref) {
  // todo this may not be disposing correctly from memory
  const effect = useMemo(() => new BeatPopEffect(), [])
  return <primitive ref={ref} object={effect} dispose={null} />
})
