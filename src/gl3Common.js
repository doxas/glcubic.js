'use strict';

gl3.ready   = false;
gl3.canvas  = null;
gl3.gl      = null;
gl3.texture = null;

// initialize webgl
gl3.initGL = function(canvasId, options){
	var opt = options || {};
	this.canvas = document.getElementById(canvasId);
	if(this.canvas == null){return;}
	this.gl = this.canvas.getContext('webgl', opt)
		   || this.canvas.getContext('experimental-webgl', opt);
	if(this.gl != null){
		this.ready = true;
		this.texture = new Array(this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
	}
};

// clear canvas
gl3.scene_clear = function(color, depth){
	var flg = this.gl.COLOR_BUFFER_BIT;
	this.gl.clearColor(color[0], color[1], color[2], color[3]);
	if(depth != null){
		this.gl.clearDepth(depth);
		this.gl.enable(this.gl.DEPTH_TEST);
		flg = flg | this.gl.DEPTH_BUFFER_BIT; 
	}
	this.gl.clear(flg);
};

// view setting
gl3.scene_view = function(camera, width, height){
	var w, h;
	if(width != null){
		w = width;
	}else{
		w = window.innerWidth;
	}
	if(height != null){
		h = height;
	}else{
		h = window.innerHeight;
	}
	this.canvas.width = w;
	this.canvas.height = h;
	this.gl.viewport(0, 0, w, h);
	if(camera != null){camera.aspect = w / h;}
};

// index buffer draw
gl3.draw_elements = function(indexLength){
	this.gl.drawElements(this.gl.TRIANGLES, indexLength, this.gl.UNSIGNED_SHORT, 0);
};

// texture setting
gl3.bind_texture = function(num){
	this.gl.activeTexture(33984 + num);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture[num]);
};

// program object -------------------------------------------------------------
gl3.program = {
	create: function(vsId, fsId, attLocation, attStride, uniLocation, uniType){
		if(gl3.gl == null){return null;}
		var i;
		var mng = new gl3.programManager(gl3.gl);
		mng.vs = mng.create_shader(vsId);
		mng.fs = mng.create_shader(fsId);
		mng.prg = mng.create_program(mng.vs, mng.fs);
		mng.attL = new Array(attLocation.length);
		mng.attS = new Array(attLocation.length);
		for(i = 0; i < attLocation.length; i++){
			mng.attL[i] = gl3.gl.getAttribLocation(mng.prg, attLocation[i]);
			mng.attS[i] = attStride[i];
		}
		mng.uniL = new Array(uniLocation.length);
		for(i = 0; i < uniLocation.length; i++){
			mng.uniL[i] = gl3.gl.getUniformLocation(mng.prg, uniLocation[i]);
		}
		mng.uniT = uniType;
		return mng;
	}
};

gl3.programManager = function(webglContext){
	this.gl = webglContext;
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
		if(this.attL[i] >= 0){
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
			this.gl.enableVertexAttribArray(this.attL[i]);
			this.gl.vertexAttribPointer(this.attL[i], this.attS[i], this.gl.FLOAT, false, 0, 0);
		}
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


