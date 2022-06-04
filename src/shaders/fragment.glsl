varying float vElevation;

uniform float uTime;

void main() {
  float elevation = vElevation;
  gl_FragColor = vec4(elevation, elevation + 0.6, elevation, 1.0);
}
