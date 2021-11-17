uniform float uTime;
varying vec3 vPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

//Layer Texture Rotation
mat2 rotate(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
} 

void main()
{
//Additional texture layers TODO
/*     float t = uTime * 0.5;
    mat2 rot = rotate(t);

    vec3 p0 = position;
    p0.yz = rot * p0.yz;
    vLayer0 = p0;

    vec3 p1 = position;
    p1.xz = rot * p1.xz;
    vLayer1 = p1;

    vec3 p2 = position;
    p2.xy = rot * p2.xy;
    vLayer2 = p2; */

    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}