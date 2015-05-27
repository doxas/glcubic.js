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
		['mvpMatrix', 'texture'],
		['matrix4fv', '1i']
	);

	// ortho program
	var oPrg = gl3.program.create(
		'ortho_vs',
		'ortho_fs',
		['position', 'texCoord'],
		[3, 2],
		['orthoMatrix', 'texture'],
		['matrix4fv', '1i']
	);

	// plane mesh
	var planeData = gl3.mesh.plane(5.0, 5.0, [1.0, 1.0, 1.0, 1.0]);
	var planeVBO = [
		gl3.create_vbo(planeData.position),
		gl3.create_vbo(planeData.color),
		gl3.create_vbo(planeData.texCoord)
	];
	var planeIBO = gl3.create_ibo(planeData.index);

	// ortho plane mesh
	planeData = gl3.mesh.plane(2.0, 2.0);
	var orthoVBO = [
		gl3.create_vbo(planeData.position),
		gl3.create_vbo(planeData.texCoord)
	];
	var orthoIBO = gl3.create_ibo(planeData.index);

	// matrix
	mMatrix = gl3.mat4.identity(gl3.mat4.create());
	vMatrix = gl3.mat4.identity(gl3.mat4.create());
	pMatrix = gl3.mat4.identity(gl3.mat4.create());
	vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	invMatrix = gl3.mat4.identity(gl3.mat4.create());
	orthoMatrix = gl3.mat4.identity(gl3.mat4.create());

	// depth test
	gl3.gl.enable(gl3.gl.DEPTH_TEST);
	gl3.gl.depthFunc(gl3.gl.LEQUAL);
	gl3.gl.clearDepth(1.0);

	// frame buffer
	var bufferSize = 512;
	var fBuffer = gl3.create_framebuffer(bufferSize, bufferSize, 1);

	// texture unit zero
	gl3.gl.activeTexture(gl3.gl.TEXTURE0);

	// rendering
	var count = 0;
	render();

	function render(){
		count++;

		// perspective projection
		var cameraPosition = [];
		var centerPoint = [0.0, 0.0, 0.0];
		var cameraUpDirection = [];
		gl3.qtn.toVecIII([0.0, 0.0, 10.0], qt, cameraPosition);
		gl3.qtn.toVecIII([0.0, 1.0, 0.0], qt, cameraUpDirection);
		var camera = gl3.camera.create(
			cameraPosition,
			centerPoint,
			cameraUpDirection,
			45, 1.0, 0.1, 20.0
		);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

		// ortho projection
		var oCameraPosition = [0.0, 0.0, 0.5];
		var oCenterPoint = [0.0, 0.0, 0.0];
		var oCameraUpDirection = [0.0, 1.0, 0.0];
		gl3.mat4.lookAt(oCameraPosition, oCenterPoint, oCameraUpDirection, vMatrix);
		gl3.mat4.ortho(-1.0, 1.0, 1.0, -1.0, 0.1, 1.0, pMatrix);
		gl3.mat4.multiply(pMatrix, vMatrix, orthoMatrix);

		// plane
		prg.set_program();
		prg.set_attribute(planeVBO, planeIBO);

		// render to frame buffer
		gl3.gl.bindTexture(gl3.gl.TEXTURE_2D, gl3.textures[0].texture);
		gl3.gl.bindFramebuffer(gl3.gl.FRAMEBUFFER, fBuffer.framebuffer);
		gl3.scene_clear([0.3, 1.0, 1.0, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, bufferSize, bufferSize);

		// off screen
		var radian = gl3.TRI.rad[count % 360];
		var axis = [0.0, 1.0, 0.0];
		gl3.mat4.identity(mMatrix);
		gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mvpMatrix, 0]);
		gl3.draw_elements(gl3.gl.TRIANGLES, planeData.index.length);

		// ortho plane
		oPrg.set_program();
		oPrg.set_attribute(orthoVBO, orthoIBO);

		// render to canvas
		gl3.gl.bindTexture(gl3.gl.TEXTURE_2D, gl3.textures[1].texture);
		gl3.gl.bindFramebuffer(gl3.gl.FRAMEBUFFER, null);
		gl3.scene_clear([0.3, 0.3, 0.3, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);

		// canvas
		oPrg.push_shader([orthoMatrix, 0]);
		gl3.draw_elements(gl3.gl.TRIANGLES, planeData.index.length);

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
