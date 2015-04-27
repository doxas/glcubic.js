'use strict';

var gl3 = gl3 || {};

// const
gl3.PI  = 3.14159265358979323846264338327950288;
gl3.PI2 = 1.57079632679489661923132169163975144;
gl3.PI4 = 0.78539816339744830961566084581987572;
gl3.BPI = 6.28318530717958647692528676655900576;
gl3.TRI = new radian();

function radian(){
	this.rad = [];
	this.sin = [];
	this.cos = [];
	for(var i = 0; i < 360; i++){
		this.rad.push(i * Math.PI / 180);
		this.sin.push(Math.sin(this.rad[i]));
		this.cos.push(Math.cos(this.rad[i]));
	}
}

