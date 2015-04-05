
gl3.ready   = false;
gl3.canvas  = null;
gl3.gl      = null;
gl3.texture = null;

gl3.initGL = function(canvasId, options){
	var opt = options || {};
	this.canvas = document.getElementById(id);
	if(this.canvas == null){return;}
	this.gl = this.canvas.getContext('webgl', opt)
		   || this.canvas.getContext('experimental-webgl', opt);
	if(this.gl != null){
		this.ready = true;
		this.texture = new Array(this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
	}
};

gl3.clearGL = function(color, depth){
	this.gl.clearColor(color[0], color[1], color[2], color[3]);
	this.gl.clearDepth(depth);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

gl3.fullCanvas = function(camera){
	var w = window.innerWidth;
	var h = window.innerHeight;
	this.canvas.width = w;
	this.canvas.height = h;
	this.gl.viewport(0, 0, w, h);
	if(camera != null){camera.aspect = w / h;}
};

// creaters
gl3.create_vbo = function(data){
	var vbo = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	return vbo;
};

gl3.create_ibo = function(data){
	var ibo = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	return ibo;
};

gl3.create_texture = function(source, number){
	var img = new Image();
	var w = this;
	var gl = this.gl;
	img.onload = function(){
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		w.texture[number] = tex;
		gl.bindTexture(gl.TEXTURE_2D, null);
	};
	img.src = source;
};

gl3.create_texture_canvas = function(canvas, number){
	var tex = this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);
	this.gl.generateMipmap(this.gl.TEXTURE_2D);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
	this.texture[number] = tex;
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

gl3.create_framebuffer = function(width, height){
	var frameBuffer = this.gl.createFramebuffer();
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
	var depthRenderBuffer = this.gl.createRenderbuffer();
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer);
	this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
	this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer);
	var fTexture = this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D, fTexture);
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
	this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, fTexture, 0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
};


gl3.create_framebuffer_cube = function(width, height, target){
	var frameBuffer = this.gl.createFramebuffer();
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
	var depthRenderBuffer = this.gl.createRenderbuffer();
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer);
	this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
	this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer);
	var fTexture = this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, fTexture);
	for(var i = 0; i < target.length; i++){
		this.gl.texImage2D(target[i], 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
	}
	this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
	this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
};

gl3.create_cube_texture = function(source, target, number){
	var cImg = new Array();
	var gl = this.gl;
	for(var i = 0; i < source.length; i++){
		cImg[i] = new cubeMapImage();
		cImg[i].data.src = source[i];
	}
	function cubeMapImage(){
		this.data = new Image();
		this.data.onload = function(){
			this.imageDataLoaded = true;
			checkLoaded();
		};
	}
	function checkLoaded(){
		if( cImg[0].data.imageDataLoaded &&
			cImg[1].data.imageDataLoaded &&
			cImg[2].data.imageDataLoaded &&
			cImg[3].data.imageDataLoaded &&
			cImg[4].data.imageDataLoaded &&
			cImg[5].data.imageDataLoaded){generateCubeMap();}
	}
	function generateCubeMap(){
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
		for(var j = 0; j < source.length; j++){
			gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cImg[j].data);
		}
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		this.texture[number] = tex;
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}
};

gl3.program = {
	create: function(vsId, fsId, attLocation, attStride, uniLocation, uniType){
		if(this.gl == null){return null;}
		var i;
		var mng = new gl3.programManager(this.gl);
		mng.vs = mng.create_shader(vsId);
		mng.fs = mng.create_shader(fsId);
		mng.prg = mng.create_program(mng.vs, mng.fs);
		mng.attL = new Array(attLocation.length);
		mng.attS = new Array(attLocation.length);
		for(i = 0; i < attLocation.length; i++){
			mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
			mng.attS[i] = attStride[i];
		}
		mng.uniL = new Array(uniLocation.length);
		for(i = 0; i < uniLocation.length; i++){
			mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
		}
		mng.uniT = uniType;
		return mng;
	}
};

gl3.programManager = function(webglContext){
	this.parent = webglContext;
};

gl3.programManager.prototype.gl   = null;
gl3.programManager.prototype.vs   = null;
gl3.programManager.prototype.fs   = null;
gl3.programManager.prototype.prg  = null;
gl3.programManager.prototype.attL = null;
gl3.programManager.prototype.attS = null;
gl3.programManager.prototype.uniL = null;
gl3.programManager.prototype.uniT = null;

gl3.programManager.prototype.create_shader = function(id){
	var shader;
	var scriptElement = document.getElementById(id);
	if(!scriptElement){return;}
	switch(scriptElement.type){
		case 'x-shader/x-vertex':
			shader = this.gl.createShader(this.gl.VERTEX_SHADER);
			break;
		case 'x-shader/x-fragment':
			shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
			break;
		default :
			return;
	}
	this.gl.shaderSource(shader, scriptElement.text);
	this.gl.compileShader(shader);
	if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
		return shader;
	}else{
		alert(this.gl.getShaderInfoLog(shader));
	}
};

gl3.programManager.prototype.create_program = function(vs, fs){
	var program = this.gl.createProgram();
	this.gl.attachShader(program, vs);
	this.gl.attachShader(program, fs);
	this.gl.linkProgram(program);
	if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
		this.gl.useProgram(program);
		return program;
	}else{
		alert(this.gl.getProgramInfoLog(program));
	}
};

gl3.programManager.prototype.set_program = function(){
	this.gl.useProgram(this.prg);
};

gl3.programManager.prototype.set_attribute = function(vbo, ibo){
	for(var i in vbo){
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
		this.gl.enableVertexAttribArray(this.attL[i]);
		this.gl.vertexAttribPointer(this.attL[i], this.attS[i], this.gl.FLOAT, false, 0, 0);
	}
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
};

gl3.programManager.prototype.push_shader = function(any){
	for(var i = 0, l = this.uniT.length; i < l; i++){
		switch(this.uniT[i]){
			case 'matrix4fv':
				this.gl.uniformMatrix4fv(this.uniL[i], false, any[i]);
				break;
			case '4fv':
				this.gl.uniform4fv(this.uniL[i], any[i]);
				break;
			case '3fv':
				this.gl.uniform3fv(this.uniL[i], any[i]);
				break;
			case '2fv':
				this.gl.uniform2fv(this.uniL[i], any[i]);
				break;
			case '1fv':
				this.gl.uniform1fv(this.uniL[i], any[i]);
				break;
			case '1f':
				this.gl.uniform1f(this.uniL[i], any[i]);
				break;
			case '1iv':
				this.gl.uniform1iv(this.uniL[i], any[i]);
				break;
			case '1i':
				this.gl.uniform1i(this.uniL[i], any[i]);
				break;
			default :
				break;
		}
	}
};


