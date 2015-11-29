precision mediump float;

uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 eyePosition;
uniform vec3 centerPoint;

varying vec3 vNormal;
varying vec4 vColor;

void main(){
	vec3 invLight = normalize(invMatrix * vec4(lightDirection, 1.0)).xyz;
	vec3 invEye   = normalize(invMatrix * vec4(eyePosition - centerPoint, 1.0)).xyz;
	vec3 halfVec  = normalize(invLight + invEye);
	float diff = clamp(dot(invLight, vNormal), 0.0, 1.0);
	float spec = clamp(dot(halfVec, vNormal), 0.0, 1.0);
	spec = pow(spec, 10.0);
	gl_FragColor = vec4(vec3(diff), 1.0) * vColor + vec4(vec3(spec), 1.0);
}
