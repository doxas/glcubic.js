
// initialize
gl3.init('c');
if(!gl3.ready){alert('initialize error'); return;}

// program
var prg = gl3.create_program(
	'vs',
	'fs',
	['position', 'normal', 'color', 'texCoord'],
	[3, 3, 4, 2],
	['mvpMatrix', 'texture'],
	['matrix4fv', 'i1']
);

// mesh data
// new でインスタンスを生成してVBOやIBOをプロパティとして持つ状態にする。これをprgに食わせるだけでいいようにする
var torusData = gl3.mesh.torus(16, 16, 0.25, 0.75);
var torusVBO = [
	gl3.create_vbo(torusData.position),
	gl3.create_vbo(torusData.normal),
	gl3.create_vbo(torusData.color),
	gl3.create_vbo(torusData.texCoord)
];
var torusIBO = gl3.create_ibo(torusData.index);

// matrix
var mMatrix   = gl3.mat4.identity(gl3.mat4.create());
var vMatrix   = gl3.mat4.identity(gl3.mat4.create());
var pMatrix   = gl3.mat4.identity(gl3.mat4.create());
var vpMatrix  = gl3.mat4.identity(gl3.mat4.create());
var mvpMatrix = gl3.mat4.identity(gl3.mat4.create());


// camera
// シーンオブジェクトを作って、それにカメラを食わせる仕様にする
var cameraPosition    = [0.0, 0.0, 5.0];
var cameraCenter      = [0.0, 0.0, 0.0];
var cameraUpDirection = [0.0, 1.0, 0.0];
var camera = new gl3.camera(cameraPosition, cameraCenter, cameraUpDirection);

var count = 0;

prg.set_program();
prg.set_attribute(torusVBO, torusIBO);

render();

function render(){
	prg.push_shader();

	requestAnimationFrame(render);
}

