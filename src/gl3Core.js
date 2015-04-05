'use strict';
var gl3 = gl3 || {};

// const
gl3.PI  = 3.14159265358979323846264338327950288;
gl3.PI2 = 1.57079632679489661923132169163975144;
gl3.PI4 = 0.78539816339744830961566084581987572;
gl3.BPI = 6.28318530717958647692528676655900576;

// property
gl3.ready   = false;
gl3.canvas  = null;
gl3.gl      = null;
gl3.texture = null;

// method
gl3.init = function(canvasId, options){
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

gl3.generate_program = function(vsId, fsId, attLocation, attStride, uniLocation, uniType){
	if(this.gl == null){return null;}
	var i;
	var w = new gl3.program(this.gl);
	w.vs = w.create_shader(vsId);
	w.fs = w.create_shader(fsId);
	w.prg = w.create_program(w.vs, w.fs);
	w.attL = new Array(attLocation.length);
	w.attS = new Array(attLocation.length);
	for(i = 0; i < attLocation.length; i++){
		w.attL[i] = this.gl.getAttribLocation(w.prg, attLocation[i]);
		w.attS[i] = attStride[i];
	}
	w.uniL = new Array(uniLocation.length);
	for(i = 0; i < uniLocation.length; i++){
		w.uniL[i] = this.gl.getUniformLocation(w.prg, uniLocation[i]);
	}
	w.uniT = uniType;
	return w;
};

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

gl3.prgram = function(webglContext){
	this.parent = webglContext;
};

gl3.program.prototype.gl   = null;
gl3.program.prototype.vs   = null;
gl3.program.prototype.fs   = null;
gl3.program.prototype.prg  = null;
gl3.program.prototype.attL = null;
gl3.program.prototype.attS = null;
gl3.program.prototype.uniL = null;
gl3.program.prototype.uniT = null;

gl3.program.prototype.create_shader = function(id){
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

gl3.program.prototype.create_program = function(vs, fs){
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

gl3.program.prototype.set_program = function(){
	this.gl.useProgram(this.prg);
};

gl3.program.prototype.set_attribute = function(vbo){
	for(var i in vbo){
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
		this.gl.enableVertexAttribArray(this.attL[i]);
		this.gl.vertexAttribPointer(this.attL[i], this.attS[i], this.gl.FLOAT, false, 0, 0);
	}
};

gl3.program.prototype.push_shader = function(any){
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

