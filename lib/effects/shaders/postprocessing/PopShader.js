export const PopShader = {
  fragmentShader: /* glsl */ `
	uniform float blink;

	void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
		outputColor = vec4(max(inputColor.rgb, vec3(blink)), inputColor.a);
	}`,
}
