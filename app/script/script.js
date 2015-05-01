
window.onload = function(){
	// initialize webgl
	gl3.initGL('c');
	if(!gl3.ready){
		console.log('initialize error');
		return;
	}

	// variables
	var qt, mouseX, mouseY;
	qt = gl3.qtn.identity(gl3.qtn.create());
	mouseX = mouseY = 0;

	// event init
	window.addEventListener('keydown', function(eve){
		run = (eve.keyCode !== 27);
	}, true);
	window.addEventListener('mousemove', function(eve){
		var x, y;
		x = y = 0;
		var w = window.innerWidth / 2;
		var h = window.innerHeight / 2;
		mouseX = eve.clientX / w - 1.0;
		mouseY = (2.0 - eve.clientY / h) - 1.0;
		var r = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
		if(r !== 0){
			x = mouseX / r;
			y = mouseY / r;
			gl3.qtn.identity(qt);
			gl3.qtn.rotate(r, [-y, x, 0], qt);
		}
	});

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'normal', 'color', 'texCoord'],
		[3, 3, 4, 2],
		['mvpMatrix', 'invMatrix', 'lightDirection', 'texture'],
		['matrix4fv', 'matrix4fv', '3fv', 'i1']
	);

	// mesh data
	var torusData = gl3.mesh.torus(64, 64, 0.3, 0.7);
	var torusVBO = [
		gl3.create_vbo(torusData.position),
		gl3.create_vbo(torusData.normal),
		gl3.create_vbo(torusData.color),
		gl3.create_vbo(torusData.texCoord)
	];
	var torusIBO = gl3.create_ibo(torusData.index);

	// texture
	gl3.create_texture('image/sample.png', 0);

	// camera
	var camera = gl3.camera.create(
		[0.0, 0.0, 5.0],
		[0.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		45,
		1.0,
		0.1,
		10.0
	);

	// matrix
	var mMatrix   = gl3.mat4.identity(gl3.mat4.create());
	var vMatrix   = gl3.mat4.identity(gl3.mat4.create());
	var pMatrix   = gl3.mat4.identity(gl3.mat4.create());
	var vpMatrix  = gl3.mat4.identity(gl3.mat4.create());
	var mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	var invMatrix = gl3.mat4.identity(gl3.mat4.create());

	// variable initialize
	var run = true;
	var count = 0;
	var lightDirection = [1.0, 1.0, 1.0];

	render();

	function render(){
		count++;

		var rad = (count % 360) * gl3.PI / 180;

		camera.qtn_rotate(qt);
		gl3.canvas.width = window.innerWidth;
		gl3.canvas.height = window.innerHeight;
		gl3.scene_clear([0.7, 0.7, 0.7, 1.0], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);
		gl3.bind_texture(0, 0);

		prg.set_program();
		prg.set_attribute(torusVBO, torusIBO);

		gl3.mat4.identity(mMatrix);
		gl3.mat4.rotate(mMatrix, rad, [0.0, 1.0, 1.0], mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		gl3.mat4.inverse(mMatrix, invMatrix);

		prg.push_shader([mvpMatrix, invMatrix, lightDirection, 0]);
		gl3.draw_elements(gl3.gl.TRIANGLES, torusData.index.length);

		if(run){requestAnimationFrame(render);}
	}
};

