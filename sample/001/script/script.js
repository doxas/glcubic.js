window.onload = function(){
	// initialize
	gl3.initGL('canvas');
	if(!gl3.ready){
		console.log('initialize error');
		return;
	}

	// canvas size
	var canvasSize = Math.min(window.innerWidth, window.innerHeight);
	gl3.canvas.width  = canvasSize;
	gl3.canvas.height = canvasSize;

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position'],
		[3],
		[],
		[]
	);

	// mesh data
	var position = [
		 0.0,  0.5,  0.0,
		 0.5, -0.5,  0.0,
		-0.5, -0.5,  0.0
	];

	// vertex buffer object
	var VBO = [
		gl3.create_vbo(position)
	];

	// rendering
	render();

	function render(){
		gl3.scene_clear([0.7, 0.7, 0.7, 1.0], 1.0);
		gl3.scene_view(null, 0, 0, gl3.canvas.width, gl3.canvas.height);

		prg.set_program();
		prg.set_attribute(VBO);

		gl3.draw_arrays(gl3.gl.TRIANGLES, 3);
	}
};

