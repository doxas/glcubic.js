var qt = gl3.qtn.create();
gl3.qtn.identity(qt);
var source, target;

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
	source = [
		'image/cube_PX.png',
		'image/cube_PY.png',
		'image/cube_PZ.png',
		'image/cube_NX.png',
		'image/cube_NY.png',
		'image/cube_NZ.png'
	]
	target = [
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
	var bufferSize = 512;
	var fBuffer = gl3.create_framebuffer_cube(bufferSize, bufferSize, target, 1);

	// texture unit zero
	gl3.gl.activeTexture(gl3.gl.TEXTURE0);
	gl3.gl.bindTexture(gl3.gl.TEXTURE_CUBE_MAP, gl3.textures[0].texture);

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'normal', 'color'],
		[3, 3, 4],
		['mMatrix', 'mvpMatrix', 'reflection', 'eyePosition', 'texture', 'ambientColor'],
		['matrix4fv', 'matrix4fv', '1i', '3fv', '1i', '4fv']
	);

	// sphere mesh
	var sphereData = gl3.mesh.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
	var sphereVBO = [
		gl3.create_vbo(sphereData.position),
		gl3.create_vbo(sphereData.normal),
		gl3.create_vbo(sphereData.color)
	];
	var sphereIBO = gl3.create_ibo(sphereData.index);

	// torus mesh
	var torusData = gl3.mesh.torus(64, 64, 0.2, 0.6, [1.0, 1.0, 1.0, 1.0]);
	var torusVBO = [
		gl3.create_vbo(torusData.position),
		gl3.create_vbo(torusData.normal),
		gl3.create_vbo(torusData.color)
	];
	var torusIBO = gl3.create_ibo(torusData.index);

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

	// culling
	gl3.gl.enable(gl3.gl.CULL_FACE);

	// program set
	prg.set_program();

	// rendering
	var count = 0;
	render();

	function render(){
		var i, j;
		count++;

		// variable initialize
		var cameraPosition = [0.0, 0.0, 0.0];
		var centerPoint = [0.0, 0.0, 0.0];
		var cameraUpDirection = [];
		var eyeDirections = [];

		// off screen rendering
		gl3.gl.bindFramebuffer(gl3.gl.FRAMEBUFFER, fBuffer.framebuffer);
		gl3.gl.bindTexture(gl3.gl.TEXTURE_CUBE_MAP, gl3.textures[0].texture);
		for(i = 0; i < target.length; i++){
			gl3.gl.framebufferTexture2D(
				gl3.gl.FRAMEBUFFER,
				gl3.gl.COLOR_ATTACHMENT0,
				target[i],
				fBuffer.texture,
				0
			);
			gl3.scene_clear([0.3, 0.3, 0.3, 1.0], 1.0);
			switch(target[i]){
				case gl3.gl.TEXTURE_CUBE_MAP_POSITIVE_X:
					eyeDirections[i] = [ 1.0, 0.0, 0.0];
					cameraUpDirection[i] = [ 0.0, -1.0, 0.0];
					break;
				case gl3.gl.TEXTURE_CUBE_MAP_POSITIVE_Y:
					eyeDirections[i] = [ 0.0, 1.0, 0.0];
					cameraUpDirection[i] = [ 0.0, 0.0, 1.0];
					break;
				case gl3.gl.TEXTURE_CUBE_MAP_POSITIVE_Z:
					eyeDirections[i] = [ 0.0, 0.0, 1.0];
					cameraUpDirection[i] = [ 0.0, -1.0, 0.0];
					break;
				case gl3.gl.TEXTURE_CUBE_MAP_NEGATIVE_X:
					eyeDirections[i] = [-1.0, 0.0, 0.0];
					cameraUpDirection[i] = [ 0.0, -1.0, 0.0];
					break;
				case gl3.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y:
					eyeDirections[i] = [ 0.0, -1.0, 0.0];
					cameraUpDirection[i] = [ 0.0, 0.0, -1.0];
					break;
				case gl3.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z:
					eyeDirections[i] = [ 0.0, 0.0, -1.0];
					cameraUpDirection[i] = [ 0.0, -1.0, 0.0];
					break;
			}
			gl3.mat4.lookAt([0.0, 0.0, 0.0], eyeDirections[i], cameraUpDirection[i], vMatrix);
			gl3.mat4.perspective(90, 1.0, 0.1, 30.0, pMatrix);
			gl3.mat4.multiply(pMatrix, vMatrix, vpMatrix);

			// off screen cube rendering
			gl3.gl.cullFace(gl3.gl.FRONT);
			prg.set_attribute(cubeVBO, cubeIBO);
			gl3.mat4.identity(mMatrix);
			gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
			prg.push_shader([mMatrix, mvpMatrix, false, cameraPosition, 0, [1.0, 1.0, 1.0, 1.0]]);
			gl3.draw_elements(gl3.gl.TRIANGLES, cubeData.index.length);

			// off screen torus rendering
			gl3.gl.cullFace(gl3.gl.BACK);
			prg.set_attribute(torusVBO, torusIBO);
			var radius = gl3.TRI.rad[count % 360];
			var axis = [0.0, 1.0, 1.0];
			for(j = 0; j < 8; j++){
				var ambient = gl3.util.hsva(j * 45, 1.0, 1.0, 1.0);
				gl3.mat4.identity(mMatrix);
				gl3.mat4.rotate(mMatrix, gl3.TRI.rad[j * 45], [0.0, 1.0, 0.0], mMatrix);
				gl3.mat4.translate(mMatrix, [3.0, 0.0, 0.0], mMatrix);
				gl3.mat4.rotate(mMatrix, radius, axis, mMatrix);
				gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
				prg.push_shader([mMatrix, mvpMatrix, true, cameraPosition, 0, ambient]);
				gl3.draw_elements(gl3.gl.TRIANGLES, torusData.index.length);
			}
		}

		// canvas rendering
		cameraPosition = [];
		centerPoint = [0.0, 0.0, 0.0];
		cameraUpDirection = [];
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

		// framebuffer unbind and texture bind
		gl3.gl.bindFramebuffer(gl3.gl.FRAMEBUFFER, null);
		gl3.gl.bindTexture(gl3.gl.TEXTURE_CUBE_MAP, gl3.textures[0].texture);

		// cube rendering
		gl3.gl.cullFace(gl3.gl.FRONT);
		prg.set_attribute(cubeVBO, cubeIBO);
		gl3.mat4.identity(mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mMatrix, mvpMatrix, false, cameraPosition, 0, [1.0, 1.0, 1.0, 1.0]]);
		gl3.draw_elements(gl3.gl.TRIANGLES, cubeData.index.length);

		// torus rendering
		gl3.gl.cullFace(gl3.gl.BACK);
		prg.set_attribute(torusVBO, torusIBO);
		for(j = 0; j < 8; j++){
			ambient = gl3.util.hsva(j * 45, 1.0, 1.0, 1.0);
			gl3.mat4.identity(mMatrix);
			gl3.mat4.rotate(mMatrix, gl3.TRI.rad[j * 45], [0.0, 1.0, 0.0], mMatrix);
			gl3.mat4.translate(mMatrix, [3.0, 0.0, 0.0], mMatrix);
			gl3.mat4.rotate(mMatrix, radius, axis, mMatrix);
			gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
			prg.push_shader([mMatrix, mvpMatrix, true, cameraPosition, 0, ambient]);
			gl3.draw_elements(gl3.gl.TRIANGLES, torusData.index.length);
		}

		// sphere rendering
		gl3.gl.bindTexture(gl3.gl.TEXTURE_CUBE_MAP, gl3.textures[1].texture);
		prg.set_attribute(sphereVBO, sphereIBO);
		gl3.mat4.identity(mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mMatrix, mvpMatrix, true, cameraPosition, 0, [1.0, 1.0, 1.0, 1.0]]);
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
