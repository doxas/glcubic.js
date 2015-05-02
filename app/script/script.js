window.onload = function(){
	// initialize
	gl3.initGL('canvas');
	if(!gl3.ready){console.log('initialize error'); return;}

	// canvas size
	var canvasSize = Math.min(window.innerWidth, window.innerHeight);
	gl3.canvas.width  = canvasSize;
	gl3.canvas.height = canvasSize;

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'color'],
		[3, 4],
		['mvpMatrix'],
		['matrix4fv']
	);

	// mesh data
	var position = [
		 0.0,  0.5,  0.0,
		 0.5, -0.5,  0.0,
		-0.5, -0.5,  0.0,
		 0.0, -0.5,  0.0,
		 0.5,  0.5,  0.0,
		-0.5,  0.5,  0.0
	];
	var color = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	];

	// vertex buffer object
	var VBO = [
		gl3.create_vbo(position),
		gl3.create_vbo(color)
	];

	// index buffer object
	var index = [
		0, 1, 2,
		3, 4, 5
	];
	var IBO = gl3.create_ibo(index);

	// matrix
	mMatrix = gl3.mat4.identity(gl3.mat4.create());
	vMatrix = gl3.mat4.identity(gl3.mat4.create());
	pMatrix = gl3.mat4.identity(gl3.mat4.create());
	vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	gl3.mat4.lookAt([0.0, 0.0, 2.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);
	gl3.mat4.perspective(60, 1.0, 0.1, 5.0, pMatrix);

	// rendering
	render();

	function render(){
		gl3.scene_clear([0.7, 0.7, 0.7, 1.0], 1.0);
		gl3.scene_view(null, 0, 0, gl3.canvas.width, gl3.canvas.height);

		prg.set_program();
		prg.set_attribute(VBO, IBO);

		var offset = [0.5, 0.5, 0.0];
		gl3.mat4.translate(mMatrix, offset, mMatrix);
		gl3.mat4.multiply(pMatrix, vMatrix, vpMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		prg.push_shader([mvpMatrix]);

		gl3.draw_elements(gl3.gl.TRIANGLES, index.length);
	}
};

