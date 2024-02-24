varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.9 - dot(vertexNormal, vec3(0,0,1.0)), 2.0);

    gl_FragColor = vec4(0.04, 0.21, 0.43, 1.0) * intensity;
}