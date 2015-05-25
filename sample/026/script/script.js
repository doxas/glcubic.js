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

	// canvas2d rendering
	var canvas2d = document.createElement('canvas');
	canvas2d.width = 256;
	canvas2d.height = 256;
	var ctx = canvas2d.getContext('2d');
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, 256, 256);
	ctx.fillStyle = 'crimson';
	ctx.shadowColor = 'crimson';
	ctx.shadowBlur = 10;
	ctx.arc(128, 128, 70, 0, Math.PI * 2, false);
	ctx.shadowBlur = 20;
	ctx.arc(128, 128, 70, 0, Math.PI * 2, false);
	ctx.shadowBlur = 30;
	ctx.arc(128, 128, 70, 0, Math.PI * 2, false);
	ctx.fill();
	//document.body.appendChild(canvas2d);

	// texture load
	gl3.create_texture('image/sample.png',  0, init);
	gl3.create_texture_canvas(canvas2d, 1);
};

function init(){
	// texture unit zero
	gl3.gl.activeTexture(gl3.gl.TEXTURE0);
	gl3.gl.bindTexture(gl3.gl.TEXTURE_2D, gl3.textures[0].texture);

	// texture unit one
	gl3.gl.activeTexture(gl3.gl.TEXTURE1);
	gl3.gl.bindTexture(gl3.gl.TEXTURE_2D, gl3.textures[1].texture);

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'color', 'texCoord'],
		[3, 4, 2],
		['mvpMatrix', 'textureUnit', 'texture', 'texture2'],
		['matrix4fv', '1i', '1i', '1i']
	);

	// plane mesh
	var planeData = gl3.mesh.plane(0.5, 0.5, [1.0, 1.0, 1.0, 0.5]);
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

	// depth test
	gl3.gl.enable(gl3.gl.DEPTH_TEST);
	gl3.gl.depthFunc(gl3.gl.LEQUAL);
	gl3.gl.clearDepth(1.0);

	// blend
	gl3.gl.enable(gl3.gl.BLEND);
	gl3.gl.blendFuncSeparate(
		gl3.gl.ONE,
		gl3.gl.ONE,
		gl3.gl.ONE,
		gl3.gl.ONE
	);
	gl3.gl.blendEquationSeparate(
		gl3.gl.ADD,
		gl3.gl.ADD
	);

	// rendering
	var count = 0;
	render();

	function render(){
		count++;

		var cameraPosition = [];
		var centerPoint = [0.0, 0.0, 0.0];
		var cameraUpDirection = [];
		gl3.qtn.toVecIII([0.0, 0.0, 5.0], qt, cameraPosition);
		gl3.qtn.toVecIII([0.0, 1.0, 0.0], qt, cameraUpDirection);
		var camera = gl3.camera.create(
			cameraPosition,
			centerPoint,
			cameraUpDirection,
			45, 1.0, 0.1, 10.0
		);
		gl3.scene_clear([0.1, 0.1, 0.1, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

		// plane rendering
		prg.set_program();
		prg.set_attribute(planeVBO, planeIBO);

		for(var i = 0; i < 8; i++){
			var angle = i * 45;
			var sin = gl3.TRI.sin[angle];
			var cos = gl3.TRI.cos[angle];
			var offset = [cos, 0.0, sin];
			gl3.mat4.identity(mMatrix);
			gl3.mat4.translate(mMatrix, offset, mMatrix);
			gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
			var j = i % 2;
			prg.push_shader([mvpMatrix, j, 0, 1]);
			gl3.draw_elements(gl3.gl.TRIANGLES, planeData.index.length);
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
	var r = sq * 3.0 * Math.PI * wh;
	if (sq != 1) {
		sq = 1 / sq;
		x *= sq;
		y *= sq;
	}
	gl3.qtn.rotate(r, [y, x, 0.0], qt);
}
