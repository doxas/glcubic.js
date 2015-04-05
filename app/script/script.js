
// initialize
gl3.init('c');
if(!gl3.ready){alert('initialize error'); return;}

// program
var prg = gl3.generate_program(
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

// matrix
var mat = new gl3.mat();
var mMatrix = mat.identity(mat.create());
var vMatrix = mat.identity(mat.create());
var pMatrix = mat.identity(mat.create());
var vpMatrix = mat.identity(mat.create());
var mvpMatrix = mat.identity(mat.create());


// camera
var cameraPosition = [0.0, 0.0, 5.0];

var count = 0;

prg.set_program();
prg.set_attribute(torusVBO, torusIBO);

render();

function render(){
	prg.push_shader();

	requestAnimationFrame(render);
}

