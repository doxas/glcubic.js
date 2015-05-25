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
	ctx.fillStyle = 'cyan';
	ctx.shadowColor = 'cyan';
	ctx.shadowBlur = 10;
	ctx.arc(128, 128, 70, 0, Math.PI * 2, false);
	ctx.shadowBlur = 20;
	ctx.arc(128, 128, 70, 0, Math.PI * 2, false);
	ctx.shadowBlur = 30;
	ctx.arc(128, 128, 70, 0, Math.PI * 2, false);
	ctx.fill();
	//document.body.appendChild(canvas2d);

	// texture generate
	gl3.create_texture_canvas(canvas2d, 0);
	init();
};

function init(){
	// texture unit zero
	gl3.gl.bindTexture(gl3.gl.TEXTURE_2D, gl3.textures[0].texture);

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position'],
		[3],
		['mvpMatrix', 'texture'],
		['matrix4fv', '1i']
	);

	// coil mesh generate
	var position = [];
	(function(){
		var i, j, k;
		var sin, cos;
		for(i = 0; i < 200; i++){
			j = i / 50 - 2.0;
			k = (i * 18) % 360;
			sin = gl3.TRI.sin[k] * 2.0;
			cos = gl3.TRI.cos[k] * 2.0;
			position.push(sin, j, cos);
		}
	})();
	var VBO = [gl3.create_vbo(position)];

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

	// rendering
	var count = 0;
	render();

	function render(){
		count++;

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
		gl3.scene_clear([0.3, 0.3, 0.3, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

		//  rendering
		prg.set_program();
		prg.set_attribute(VBO);
		var radian = gl3.TRI.rad[count % 360];
		var axis = [0.0, 1.0, 0.0];
		gl3.mat4.identity(mMatrix);
		gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mvpMatrix, 0]);
		gl3.draw_arrays(gl3.gl.POINTS, position.length / 3);

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
