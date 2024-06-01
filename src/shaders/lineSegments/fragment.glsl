varying float lineProgress;
  uniform float u_time;

  void main() {
    // Use time uniform to animate the line drawing
    if (lineProgress > u_time) {
      discard;
    }
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // white color
  }