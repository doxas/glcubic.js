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

	// texture load
	gl3.create_texture('image/sample.png', 0, init);
};

function init(){
	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'color', 'texCoord'],
		[3, 4, 2],
		['mMatrix', 'mvpMatrix', 'tMatrix', 'texture'],
		['matrix4fv', 'matrix4fv', 'matrix4fv', '1i']
	);

	// torus mesh
	var torusData = gl3.mesh.torus(32, 32, 0.2, 0.6, [1.0, 1.0, 1.0, 1.0]);
	var torusVBO = [
		gl3.create_vbo(torusData.position),
		gl3.create_vbo(torusData.color),
		gl3.create_vbo(torusData.texCoord)
	];
	var torusIBO = gl3.create_ibo(torusData.index);

	// plane mesh
	var planeData = gl3.mesh.plane(10.0, 10.0, [1.0, 1.0, 1.0, 1.0]);
	var planeVBO = [
		gl3.create_vbo(planeData.position),
		gl3.create_vbo(planeData.color),
		gl3.create_vbo(planeData.texCoord)
	];
	var planeIBO = gl3.create_ibo(planeData.index);

	// matrix
	mMatrix = gl3.mat4.identity(gl3.mat4.create());
	vMatrix = gl3.mat4.identity(gl3.mat4.create());
	pMatrix = gl3.mat4.identity(gl3.mat4.create());
	vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	invMatrix = gl3.mat4.identity(gl3.mat4.create());
	
	// texture matrix
	tMatrix = gl3.mat4.identity(gl3.mat4.create());
	tpMatrix = gl3.mat4.identity(gl3.mat4.create());
	tvMatrix = gl3.mat4.identity(gl3.mat4.create());
	ttpMatrix = gl3.mat4.identity(gl3.mat4.create());
	tvpMatrix = gl3.mat4.identity(gl3.mat4.create());

	tMatrix[0]  =  0.5; tMatrix[1]  =  0.0; tMatrix[2]  =  0.0; tMatrix[3]  =  0.0;
	tMatrix[4]  =  0.0; tMatrix[5]  = -0.5; tMatrix[6]  =  0.0; tMatrix[7]  =  0.0;
	tMatrix[8]  =  0.0; tMatrix[9]  =  0.0; tMatrix[10] =  1.0; tMatrix[11] =  0.0;
	tMatrix[12] =  0.5; tMatrix[13] =  0.5; tMatrix[14] =  0.0; tMatrix[15] =  1.0;

	// texture view
	var tPosition = [0.0, 5.0, 0.0];
	var tCenter = [0.0, 0.0, 0.0];
	var tUpDirection = [0.0, 0.0, -1.0];
	gl3.mat4.lookAt(tPosition, tCenter, tUpDirection, tvMatrix);

	// texture projection
	var tFov = 90;
	var tAspect = 1.0;
	var tNear = 0.1;
	var tFar = 10.0;
	gl3.mat4.perspective(tFov, tAspect, tNear, tFar, tpMatrix);

	// texture matrix
	gl3.mat4.multiply(tMatrix, tpMatrix, ttpMatrix);
	gl3.mat4.multiply(ttpMatrix, tvMatrix, tvpMatrix);

	// depth test
	gl3.gl.enable(gl3.gl.DEPTH_TEST);
	gl3.gl.depthFunc(gl3.gl.LEQUAL);
	gl3.gl.clearDepth(1.0);

	// texture
	gl3.gl.bindTexture(gl3.gl.TEXTURE_2D, gl3.textures[0].texture);

	// rendering
	var count = 0;
	render();

	function render(){
		var i, j, s, c;
		count++;

		var cameraPosition = [];
		var centerPoint = [0.0, 0.0, 0.0];
		var cameraUpDirection = [];
		gl3.qtn.toVecIII([0.0, 0.0, 15.0], qt, cameraPosition);
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

		// plane rendering
		prg.set_program();
		prg.set_attribute(planeVBO, planeIBO);
		gl3.mat4.identity(mMatrix);
		gl3.mat4.translate(mMatrix, [0.0, -1.0, 0.0], mMatrix);
		gl3.mat4.rotate(mMatrix, Math.PI / 2, [1.0, 0.0, 0.0], mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mMatrix, mvpMatrix, tvpMatrix, 0]);
		gl3.draw_elements(gl3.gl.TRIANGLES, planeData.index.length);

		// torus rendering
		prg.set_attribute(torusVBO, torusIBO);
		var radius = gl3.TRI.rad[count % 360];
		var axis = [0.0, 1.0, 1.0];
		for(i = 0; i < 8; i++){
			j = i * 45;
			s = gl3.TRI.sin[j] * 3.5;
			c = gl3.TRI.cos[j] * 3.5;
			var offset = [c, 0.0, s];
			gl3.mat4.identity(mMatrix);
			gl3.mat4.translate(mMatrix, offset,  mMatrix);
			gl3.mat4.rotate(mMatrix, radius, axis, mMatrix);
			gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
			prg.push_shader([mMatrix, mvpMatrix, tvpMatrix, 0]);
			gl3.draw_elements(gl3.gl.TRIANGLES, torusData.index.length);
		}

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
