varying float vElevation;

void main() {
  float elevation = vElevation;
  float temp = elevation + 0.4;
  gl_FragColor = vec4(temp, temp + 0.5, temp, 1.0);
}
