attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;
uniform   mat4 mMatrix;
uniform   mat4 mvpMatrix;
uniform   mat4 normalMatrix;
varying   vec4 vPosition;
varying   vec3 vNormal;
varying   vec4 vColor;
varying   vec2 vTexCoord;
void main(){
    vPosition = mMatrix * vec4(position, 1.0);
    vNormal = (normalMatrix * vec4(normalize(normal), 0.0)).xyz;
    vColor = color;
    vTexCoord = texCoord;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
