
// initialize
gl3.initGL('c');
if(!gl3.ready){alert('initialize error'); return;}

// program
var prg = gl3.program.create(
	'vs',
	'fs',
	['position', 'normal', 'color', 'texCoord'],
	[3, 3, 4, 2],
	['mvpMatrix', 'texture'],
	['matrix4fv', 'i1']
);

// mesh data
var torusData = gl3.mesh.torus(16, 16, 0.25, 0.75);
var torusVBO = [
	gl3.create_vbo(torusData.position),
	gl3.create_vbo(torusData.normal),
	gl3.create_vbo(torusData.color),
	gl3.create_vbo(torusData.texCoord)
];
var torusIBO = gl3.create_ibo(torusData.index);

// camera
var cameraPosition    = [0.0, 0.0, 5.0];
var cameraCenter      = [0.0, 0.0, 0.0];
var cameraUpDirection = [0.0, 1.0, 0.0];
var cameraFovy   = 45;
var cameraAspect = 1.0;
var cameraNear   = 0.1;
var cameraFar    = 1.0;
var camera = gl3.camera.create(
	cameraPosition,
	cameraCenter,
	cameraUpDirection,
	cameraFovy,
	cameraAspect,
	cameraNear,
	cameraFar
);

// matrix
var mMatrix   = gl3.mat4.identity(gl3.mat4.create());
var vMatrix   = gl3.mat4.identity(gl3.mat4.create());
var pMatrix   = gl3.mat4.identity(gl3.mat4.create());
var vpMatrix  = gl3.mat4.identity(gl3.mat4.create());
var mvpMatrix = gl3.mat4.identity(gl3.mat4.create());

// variable initialize
var count = 0;

render();

function render(){
	count++;

	var rad = (count % 360) * gl3.PI / 180;

	gl3.clearGL([0.0, 0.0, 0.0, 1.0], 1.0);
	gl3.fullCanvas(camera);

	prg.set_program();
	prg.set_attribute(torusVBO, torusIBO);

	gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);
	gl3.mat4.identity(mMatrix);
	gl3.mat4.rotate(mMatrix, rad, [0.0, 1.0, 1.0], mMatrix);
	gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);

	prg.push_shader([mvpMatrix, 0]);

	requestAnimationFrame(render);
}

