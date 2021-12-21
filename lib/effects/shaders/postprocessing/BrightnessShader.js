export const BrightnessShader = {
	fragmentShader: /* glsl */`
	uniform float brightness;

	void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
		outputColor = vec4(inputColor.rgb * vec3(brightness), inputColor.a);
	}`
};
