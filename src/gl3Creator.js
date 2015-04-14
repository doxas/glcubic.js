
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

