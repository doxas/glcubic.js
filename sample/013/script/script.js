var qt = gl3.qtn.create();
gl3.qtn.identity(qt);

window.onload = function(){
	var size = 256;
	var c = document.createElement('canvas');
	c.width = size;
	c.height = size;
	var cx = c.getContext('2d');
	var img = new Image();
	img.onload = function(){
		cx.drawImage(img, 0, 0, size, size);
		init(cx.getImageData(0, 0, size, size));
	}
	img.src = 'image/sample.png';
};

function init(data){
	// initialize
	gl3.initGL('canvas');
	if(!gl3.ready){console.log('initialize error'); return;}

	// canvas size
	var canvasSize = Math.min(window.innerWidth, window.innerHeight);
	gl3.canvas.width  = canvasSize;
	gl3.canvas.height = canvasSize;

	// event
	gl3.canvas.addEventListener('mousemove', mouseMove, true);

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'color'],
		[3, 4],
		['mvpMatrix'],
		['matrix4fv']
	);

	// mesh data from imageData
	var position = [];
	var color = [];
	(function(){
		var i, j, k, l, m;
		var x, y, z;
		var size = 1 / 256;
		var w = data.width;
		var h = data.height;
		var d = data.data;
		for(i = 0; i < h; i++){
			y = 0.5 - i * size;
			for(j = 0; j < w; j++){
				x = j * size - 0.5;
				k = (i * w + j) * 4;
				z = (d[k] + d[k + 1] + d[k + 2]) / (255 * 3);
				position.push(x, y, z);
				color.push(1.0, 1.0, 1.0, 1.0);
			}
		}
	})();

	// vertex buffer object
	var VBO = [
		gl3.create_vbo(position),
		gl3.create_vbo(color)
	];

	// matrix
	mMatrix = gl3.mat4.identity(gl3.mat4.create());
	vMatrix = gl3.mat4.identity(gl3.mat4.create());
	pMatrix = gl3.mat4.identity(gl3.mat4.create());
	vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	mvpMatrix = gl3.mat4.identity(gl3.mat4.create());

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
		var cameraUpDirection = [];
		gl3.qtn.toVecIII([0.0, 0.0, 5.0], qt, cameraPosition);
		gl3.qtn.toVecIII([0.0, 1.0, 0.0], qt, cameraUpDirection);
		var camera = gl3.camera.create(
			cameraPosition,
			[0.0, 0.0, 0.0],
			cameraUpDirection,
			45, 1.0, 0.1, 10.0
		);
		gl3.scene_clear([0.3, 0.3, 0.3, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

		prg.set_program();
		prg.set_attribute(VBO);

		var radian = gl3.TRI.rad[count % 360];
		var axis = [0.0, 1.0, 0.0];
		gl3.mat4.identity(mMatrix);
		gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);

		prg.push_shader([mvpMatrix]);

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
