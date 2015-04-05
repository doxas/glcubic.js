
gl3.v3 = function(){};

gl3.v3.prototype.create = function(){
	return new Float32Array(3);
};

gl3.v3.prototype.normalize = function(v){
	var n = this.create();
	var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	if(l > 0){
		var e = 1.0 / l;
		n[0] = v[0] * e;
		n[1] = v[1] * e;
		n[2] = v[2] * e;
	}
	return n;
};

gl3.v3.prototype.dot = function(v0, v1){
	return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]; 
};

gl3.v3.prototype.cross = function(v0, v1){
	var n = this.create();
	n[0] = v0[1] * v1[2] - v0[2] * v1[1];
	n[1] = v0[2] * v1[0] - v0[0] * v1[2];
	n[2] = v0[0] * v1[1] - v0[1] * v1[0];
	return n;
};

gl3.v3.prototype.faceNormal = function(v0, v1, v2){
	var n = this.create();
	var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
	var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
	n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
	n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
	n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
	return this.normalize(n);
};

gl3.vec3 = new gl3.v3();
