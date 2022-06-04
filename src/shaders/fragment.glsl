varying float vElevation;

void main() {
  float elevation = vElevation;
  float temp = elevation + 0.04;
  gl_FragColor = vec4(elevation, elevation + 0.3, elevation, 1.0);
}
