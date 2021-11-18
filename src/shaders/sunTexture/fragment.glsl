uniform float uTime;
varying vec2 vUv;
uniform samplerCube uPerlin;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
const float PI = 3.14159265359;


//RGB Channel brightness to color
vec3 brightnessToColor (float b){
  b *=0.25;
  return (vec3(b, b*b, b*b*b*b)/0.25)*0.7;
}

//Combined layers rotate on xyz
float supersun(){
  float sum = 0.0;
  sum +=textureCube(uPerlin,vLayer0).r;
  sum +=textureCube(uPerlin,vLayer1).r;
  sum +=textureCube(uPerlin,vLayer2).r;
  sum *=0.40;
  return sum;
}

//Fresnel calculation
float Fresnel(vec3 eyeVector,vec3 worldNormal){
    return pow(1.3 + dot(eyeVector,worldNormal),4.0);
}


void main()

{
  
  gl_FragColor = textureCube(uPerlin,vPosition); //vec4 textureCube(samplerCube sampler, vec3 coord)  
  
  //color and rotated textures
  float brightness = supersun();
  brightness = brightness*4.0+1.0;
  
  
  //fresnel
  float fres = Fresnel(eyeVector,vNormal);
  brightness += fres;

  vec3 color = brightnessToColor(brightness); 

 // gl_FragColor = vec4(supersun());
   
  gl_FragColor = vec4(color,1.0);
  //gl_FragColor = vec4(fres);



}