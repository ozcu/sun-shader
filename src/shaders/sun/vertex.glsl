
varying vec2 vUv;
varying vec3 vPosition;
//const float PI = 3.14159265359; 



void main()
{

    vUv = uv;
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}