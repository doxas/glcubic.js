
gl3.create_vbo = function(data){
	if(data == null){return;}
	var vbo = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	return vbo;
};

gl3.create_ibo = function(data){
	if(data == null){return;}
	var ibo = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	return ibo;
};

gl3.create_texture = function(source, number, callback){
	if(source == null || number == null){return;}
	var img = new Image();
	var self = this;
	var gl = this.gl;
	this.textures[number] = {texture: null, type: null, loaded: false};
	img.onload = function(){
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		self.textures[number].texture = tex;
		self.textures[number].type = gl.TEXTURE_2D;
		self.textures[number].loaded = true;
		console.log('%c◆%c texture number: %c' + number + '%c, image loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
		gl.bindTexture(gl.TEXTURE_2D, null);
		if(callback != null){callback(number);}
	};
	img.src = source;
};

gl3.create_texture_canvas = function(canvas, number){
	if(canvas == null || number == null){return;}
	var gl = this.gl;
	var tex = gl.createTexture();
	this.textures[number] = {texture: null, type: null, loaded: false};
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	this.textures[number].texture = tex;
	this.textures[number].type = gl.TEXTURE_2D;
	this.textures[number].loaded = true;
	console.log('%c◆%c texture number: %c' + number + '%c, canvas attached', 'color: crimson', '', 'color: blue', '');
	gl.bindTexture(gl.TEXTURE_2D, null);
};

gl3.create_framebuffer = function(width, height, number){
	if(width == null || height == null || number == null){return;}
	var gl = this.gl;
	this.textures[number] = {texture: null, type: null, loaded: false};
	var frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	var depthRenderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
	var fTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, fTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	this.textures[number].texture = fTexture;
	this.textures[number].type = gl.TEXTURE_2D;
	this.textures[number].loaded = true;
	console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created', 'color: crimson', '', 'color: blue', '');
	return {framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture};
};

gl3.create_framebuffer_cube = function(width, height, target, number){
	if(width == null || height == null || target == null || number == null){return;}
	var gl = this.gl;
	this.textures[number] = {texture: null, type: null, loaded: false};
	var frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	var depthRenderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
	var fTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, fTexture);
	for(var i = 0; i < target.length; i++){
		gl.texImage2D(target[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	this.textures[number].texture = fTexture;
	this.textures[number].type = gl.TEXTURE_CUBE_MAP;
	this.textures[number].loaded = true;
	console.log('%c◆%c texture number: %c' + number + '%c, framebuffer cube created', 'color: crimson', '', 'color: blue', '');
	return {framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture};
};

gl3.create_texture_cube = function(source, target, number, callback){
	if(source == null || target == null || number == null){return;}
	var cImg = [];
	var gl = this.gl;
	var self = this;
	this.textures[number] = {texture: null, type: null, loaded: false};
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
		self.textures[number].texture = tex;
		self.textures[number].type = gl.TEXTURE_CUBE_MAP;
		self.textures[number].loaded = true;
		console.log('%c◆%c texture number: %c' + number + '%c, image loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		if(callback != null){callback(number);}
	}
};

