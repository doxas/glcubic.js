
gl3.camera = function(position, centerPoint, upDirection){
	var n = gl3.vec3.create();
	n[0] = upDirection[0];
	n[1] = upDirection[1];
	n[2] = upDirection[2];
	n = gl3.vec3.normalize(n);
	this.set_position(position, centerPoint, n);
};

gl3.camera.prototype.position    = gl3.vec3.create();
gl3.camera.prototype.centerPoint = gl3.vec3.create();
gl3.camera.prototype.upDirection = gl3.vec3.create();
gl3.camera.prototype.basePosition    = gl3.vec3.create();
gl3.camera.prototype.baseCenterPoint = gl3.vec3.create();
gl3.camera.prototype.baseUpDirection = gl3.vec3.create();

gl3.camera.prototype.fovy   = 45;
gl3.camera.prototype.aspect = 1.0;
gl3.camera.prototype.near   = 0.1;
gl3.camera.prototype.far    = 1.0;

gl3.camera.prototype.set_position = function(posiiton, centerPoint, upDirection){
	this.position[0]    = this.basePosition[0]    = position[0];
	this.position[1]    = this.basePosition[1]    = position[1];
	this.position[2]    = this.basePosition[2]    = position[2];
	this.centerPoint[0] = this.baseCenterPoint[0] = centerPoint[0];
	this.centerPoint[1] = this.baseCenterPoint[1] = centerPoint[1];
	this.centerPoint[2] = this.baseCenterPoint[2] = centerPoint[2];
	this.upDirection[0] = this.baseUpDirection[0] = upDirection[0];
	this.upDirection[1] = this.baseUpDirection[1] = upDirection[1];
	this.upDirection[2] = this.baseUpDirection[2] = upDirection[2];
};

gl3.camera.prototype.set_view = function(fovy, aspect, near, far){
	this.fovy   = fovy;
	this.aspect = aspect;
	this.near   = near;
	this.far    = far;
};

gl3.camera.prototype.get_canvas_aspect = function(){
	if(!gl3.canvas){return;}
	return gl3.canvas.width / gl3.canvas.height;
};



