import { BlendFunction, Effect } from 'postprocessing';
import { Uniform } from "three";
import { forwardRef, useMemo } from 'react';
import { BrightnessShader } from './shaders/postprocessing/BrightnessShader';

class BrightnessEffect extends Effect {
  constructor() {
		super('BrightnessEffect', BrightnessShader.fragmentShader, {
      blendFunction: BlendFunction.Normal,
			uniforms: new Map([
				['brightness', new Uniform(1.0)]
			])
		});
	}
  get brightness() {
    return this.uniforms.get('brightness').value;
  }
  set brightness(value) {
    this.uniforms.get('brightness').value = value;
  }
}

export default BrightnessEffect;

export const Brightness = forwardRef(function Brightness(props, ref) {
  const effect = useMemo(() => new BrightnessEffect(), []);
  return <primitive ref={ref} object={effect} dispose={null} />
});