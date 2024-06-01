uniform vec3 spherePosition1;
  uniform vec3 spherePosition2;
  varying float lineProgress;

  void main() {
    // Interpolate between the positions based on the vertex position
    vec3 interpolatedPosition = mix(spherePosition1, spherePosition2, position.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(interpolatedPosition, 1.0);

    // Pass progress along the line to the fragment shader
    lineProgress = position.x;
  }