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
	var sphereData = gl3.mesh.sphere(16, 16, 1.0);

	// vertex buffer object
	var VBO = [
		gl3.create_vbo(sphereData.position),
		gl3.create_vbo(sphereData.color)
	];

	// index buffer object
	var IBO = gl3.create_ibo(sphereData.index);

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

		var camera = gl3.camera.create(
			[0.0, 0.0, 5.0],
			[0.0, 0.0, 0.0],
			[0.0, 1.0, 0.0],
			45, 1.0, 0.1, 10.0
		);
		gl3.scene_clear([0.7, 0.7, 0.7, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

		prg.set_program();
		prg.set_attribute(VBO, IBO);

		var radian = gl3.TRI.rad[count % 360];
		var axis = [1.0, 1.0, 0.0];
		gl3.mat4.identity(mMatrix);
		gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);

		prg.push_shader([mvpMatrix]);

		gl3.draw_elements(gl3.gl.TRIANGLES, sphereData.index.length);

		requestAnimationFrame(render);
	}
};

