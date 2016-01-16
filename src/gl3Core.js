'use strict';

var gl3 = gl3 || {};

// const
gl3.VERSION = '0.0.4';
gl3.PI2  = 6.28318530717958647692528676655900576;
gl3.PI   = 3.14159265358979323846264338327950288;
gl3.PIH  = 1.57079632679489661923132169163975144;
gl3.PIH2 = 0.78539816339744830961566084581987572;
gl3.TRI = new radianPreset();

console.log('%c◆%c glCubic.js %c◆%c : version %c' + gl3.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');

function radianPreset(){
    this.rad = [];
    this.sin = [];
    this.cos = [];
    for(var i = 0; i < 360; i++){
        this.rad.push(i * Math.PI / 180);
        this.sin.push(Math.sin(this.rad[i]));
        this.cos.push(Math.cos(this.rad[i]));
    }
}

