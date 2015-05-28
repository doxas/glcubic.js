var qt = gl3.qtn.create();
gl3.qtn.identity(qt);

window.onload = function(){
	// initialize
	gl3.initGL('canvas');
	if(!gl3.ready){console.log('initialize error'); return;}

	// canvas size
	var canvasSize = Math.min(window.innerWidth, window.innerHeight);
	gl3.canvas.width  = canvasSize;
	gl3.canvas.height = canvasSize;

	// event
	gl3.canvas.addEventListener('mousemove', mouseMove, true);

	// cube texture load
	var source = [
		'image/cube_PX.png',
		'image/cube_PY.png',
		'image/cube_PZ.png',
		'image/cube_NX.png',
		'image/cube_NY.png',
		'image/cube_NZ.png'
	]
	var target = [
		gl3.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
		gl3.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
		gl3.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
		gl3.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
		gl3.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
		gl3.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
	]
	gl3.create_texture_cube(source, target, 0, init);
};

function init(){
	// texture unit zero
	gl3.gl.activeTexture(gl3.gl.TEXTURE0);
	gl3.gl.bindTexture(gl3.gl.TEXTURE_CUBE_MAP, gl3.textures[0].texture);

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'normal', 'color'],
		[3, 3, 4],
		['mMatrix', 'mvpMatrix', 'reflection', 'eyePosition', 'texture'],
		['matrix4fv', 'matrix4fv', '1i', '3fv', '1i']
	);

	// sphere mesh
	var sphereData = gl3.mesh.sphere(32, 32, 1.0, [1.0, 1.0, 1.0, 1.0]);
	var sphereVBO = [
		gl3.create_vbo(sphereData.position),
		gl3.create_vbo(sphereData.normal),
		gl3.create_vbo(sphereData.color)
	];
	var sphereIBO = gl3.create_ibo(sphereData.index);

	// cube mesh
	var cubeData = gl3.mesh.cube(20.0, [1.0, 1.0, 1.0, 1.0]);
	var cubeVBO = [
		gl3.create_vbo(cubeData.position),
		gl3.create_vbo(cubeData.normal),
		gl3.create_vbo(cubeData.color)
	];
	var cubeIBO = gl3.create_ibo(cubeData.index);

	// matrix
	mMatrix = gl3.mat4.identity(gl3.mat4.create());
	vMatrix = gl3.mat4.identity(gl3.mat4.create());
	pMatrix = gl3.mat4.identity(gl3.mat4.create());
	vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	invMatrix = gl3.mat4.identity(gl3.mat4.create());

	// depth test
	gl3.gl.enable(gl3.gl.DEPTH_TEST);
	gl3.gl.depthFunc(gl3.gl.LEQUAL);
	gl3.gl.clearDepth(1.0);

	// culling
	gl3.gl.enable(gl3.gl.CULL_FACE);

	// rendering
	var count = 0;
	render();

	function render(){
		count++;

		var cameraPosition = [];
		var centerPoint = [0.0, 0.0, 0.0];
		var cameraUpDirection = [];
		gl3.qtn.toVecIII([0.0, 0.0, 7.0], qt, cameraPosition);
		gl3.qtn.toVecIII([0.0, 1.0, 0.0], qt, cameraUpDirection);
		var camera = gl3.camera.create(
			cameraPosition,
			centerPoint,
			cameraUpDirection,
			45, 1.0, 0.1, 30.0
		);
		gl3.scene_clear([0.3, 0.3, 0.3, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

		// cube rendering
		gl3.gl.cullFace(gl3.gl.FRONT);
		prg.set_program();
		prg.set_attribute(cubeVBO, cubeIBO);
		gl3.mat4.identity(mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mMatrix, mvpMatrix, false, cameraPosition, 0]);
		gl3.draw_elements(gl3.gl.TRIANGLES, cubeData.index.length);

		// sphere rendering
		gl3.gl.cullFace(gl3.gl.BACK);
		prg.set_attribute(sphereVBO, sphereIBO);
		gl3.mat4.identity(mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mMatrix, mvpMatrix, true, cameraPosition, 0]);
		gl3.draw_elements(gl3.gl.TRIANGLES, sphereData.index.length);

		requestAnimationFrame(render);
	}
}

function mouseMove(eve) {
	var cw = gl3.canvas.width;
	var ch = gl3.canvas.height;
	var wh = 1 / Math.sqrt(cw * cw + ch * ch);
	var x = eve.clientX - gl3.canvas.offsetLeft - cw * 0.5;
	var y = eve.clientY - gl3.canvas.offsetTop - ch * 0.5;
	var sq = Math.sqrt(x * x + y * y);
	var r = sq * 2.0 * Math.PI * wh;
	if (sq != 1) {
		sq = 1 / sq;
		x *= sq;
		y *= sq;
	}
	gl3.qtn.rotate(r, [y, x, 0.0], qt);
}
