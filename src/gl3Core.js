
import audio      from './gl3Audio.js';
import camera     from './gl3Camera.js';
import common     from './gl3Common.js';
import creator    from './gl3Creator.js';
import light      from './gl3Light.js';
import matrix     from './gl3Matrix.js';
import mesh       from './gl3Mesh.js';
import quaternion from './gl3Quaternion.js';
import util       from './gl3Util.js';
import vector     from './gl3Vector.js';

console.log('%c◆%c glCubic.js %c◆%c : version %c' + gl3.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');

export default class gl3 {
    constructor(){
        this.VERSION = '0.0.5';
        this.PI2  = 6.28318530717958647692528676655900576;
        this.PI   = 3.14159265358979323846264338327950288;
        this.PIH  = 1.57079632679489661923132169163975144;
        this.PIH2 = 0.78539816339744830961566084581987572;

        this.Audio      = audio;
        this.Camera     = camera;
        this.Common     = common;
        this.Creator    = creator;
        this.Light      = light;
        this.Matrix     = matrix;
        this.Mesh       = mesh;
        this.Quaternion = quaternion;
        this.Util       = util;
        this.Vector     = vector;
    }
}

