#pragma glslify: cnoise3 = require('glsl-noise/simplex/3d')

varying float vElevation;
uniform float uTime;
uniform float uElevation;
uniform float uElevationValleyFrequency;
uniform float uElevationGeneral;
uniform float uElevationGeneralFrequency;

uniform float opacity;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float getElevation(vec2 _position) {

    float elevation = 0.0;

    vec2 position = _position;
    
    position += uTime * 50.5;

    elevation += cnoise3(vec3(
        (position * .75) * .005,
        0.0
    )) * .6;

    // elevation += cnoise3(vec3(
    //     (position * 7.0) * 0.09,
    //     0.0
    // )) * 0.75;

    // elevation += cnoise3(vec3(
    //     (position * 25.5) * 0.09,
    //     0.0
    // )) * .15;

    elevation -= uElevation;

    return elevation;
}

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getElevation(modelPosition.xz);

    modelPosition -= elevation;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vElevation = elevation;
}