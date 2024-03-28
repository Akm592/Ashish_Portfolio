const vertexShader = `
// Vertex Shader
uniform float uTime;
uniform float uRadius;

varying float vDistance;

vec3 spiralOnSphere(float angle, float distance) {
  float a = angle * 2.0;
  float thicknessFactor = 0.5 + 0.5 * sin(angle * 5.0);
  float x = distance * thicknessFactor * cos(a);
  float y = distance * thicknessFactor * sin(a);
  float z = distance * 0.1 * sin(angle * 2.0);
  float r = sqrt(x * x + y * y + z * z);
  return normalize(vec3(x, y, z)) * uRadius;
}

void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float size = distanceFactor * 10.0 + 10.0;

  vec3 particlePosition = spiralOnSphere(uTime * 0.3 * distanceFactor, distance(position, vec3(0.0)));

  vDistance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = size;
  gl_PointSize *= (1.0 / - viewPosition.z);
}

// Fragment Shader
varying float vDistance;

void main() {
  vec3 color = mix(vec3(0.2, 0.5, 0.8), vec3(0.0, 0.8, 0.2), vDistance * 0.5);

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 3.0);

  color = mix(vec3(0.0), color, strength);
  gl_FragColor = vec4(color, strength);
}

`;

export default vertexShader;
