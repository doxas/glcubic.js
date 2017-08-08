/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * step 1: let a = new AudioCtr(bgmGainValue, soundGainValue) <- float(0 to 1)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

var AudioCtr = function () {
    function AudioCtr(bgmGainValue, soundGainValue) {
        _classCallCheck(this, AudioCtr);

        if (typeof AudioContext != 'undefined' || typeof webkitAudioContext != 'undefined') {
            if (typeof AudioContext != 'undefined') {
                this.ctx = new AudioContext();
            } else {
                this.ctx = new webkitAudioContext();
            }
            this.comp = this.ctx.createDynamicsCompressor();
            this.comp.connect(this.ctx.destination);
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.connect(this.comp);
            this.bgmGain.gain.value = bgmGainValue;
            this.soundGain = this.ctx.createGain();
            this.soundGain.connect(this.comp);
            this.soundGain.gain.value = soundGainValue;
            this.src = [];
        } else {
            return null;
        }
    }

    _createClass(AudioCtr, [{
        key: 'load',
        value: function load(url, index, loop, background, callback) {
            var ctx = this.ctx;
            var gain = background ? this.bgmGain : this.soundGain;
            var src = this.src;
            src[index] = null;
            var xml = new XMLHttpRequest();
            xml.open('GET', url, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.responseType = 'arraybuffer';
            xml.onload = function () {
                ctx.decodeAudioData(xml.response, function (buf) {
                    src[index] = new AudioSrc(ctx, gain, buf, loop, background);
                    src[index].loaded = true;
                    console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + url, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                    callback();
                }, function (e) {
                    console.log(e);
                });
            };
            xml.send();
        }
    }, {
        key: 'loadComplete',
        value: function loadComplete() {
            var i = void 0,
                f = void 0;
            f = true;
            for (i = 0; i < this.src.length; i++) {
                f = f && this.src[i] != null && this.src[i].loaded;
            }
            return f;
        }
    }]);

    return AudioCtr;
}();

exports.default = AudioCtr;

var AudioSrc = function () {
    function AudioSrc(ctx, gain, audioBuffer, loop, background) {
        _classCallCheck(this, AudioSrc);

        this.ctx = ctx;
        this.gain = gain;
        this.audioBuffer = audioBuffer;
        this.bufferSource = [];
        this.activeBufferSource = 0;
        this.loop = loop;
        this.loaded = false;
        this.fftLoop = 16;
        this.update = false;
        this.background = background;
        this.node = this.ctx.createScriptProcessor(2048, 1, 1);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.fftSize = this.fftLoop * 2;
        this.onData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    _createClass(AudioSrc, [{
        key: 'play',
        value: function play() {
            var _this = this;

            var i = void 0,
                j = void 0,
                k = void 0;
            var self = this;
            i = this.bufferSource.length;
            k = -1;
            if (i > 0) {
                for (j = 0; j < i; j++) {
                    if (!this.bufferSource[j].playnow) {
                        this.bufferSource[j] = null;
                        this.bufferSource[j] = this.ctx.createBufferSource();
                        k = j;
                        break;
                    }
                }
                if (k < 0) {
                    this.bufferSource[this.bufferSource.length] = this.ctx.createBufferSource();
                    k = this.bufferSource.length - 1;
                }
            } else {
                this.bufferSource[0] = this.ctx.createBufferSource();
                k = 0;
            }
            this.activeBufferSource = k;
            this.bufferSource[k].buffer = this.audioBuffer;
            this.bufferSource[k].loop = this.loop;
            this.bufferSource[k].playbackRate.value = 1.0;
            if (!this.loop) {
                this.bufferSource[k].onended = function () {
                    _this.stop(0);
                    _this.playnow = false;
                };
            }
            if (this.background) {
                this.bufferSource[k].connect(this.analyser);
                this.analyser.connect(this.node);
                this.node.connect(this.ctx.destination);
                this.node.onaudioprocess = function (eve) {
                    onprocessEvent(eve);
                };
            }
            this.bufferSource[k].connect(this.gain);
            this.bufferSource[k].start(0);
            this.bufferSource[k].playnow = true;

            function onprocessEvent(eve) {
                if (self.update) {
                    self.update = false;
                    self.analyser.getByteFrequencyData(self.onData);
                }
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.bufferSource[this.activeBufferSource].stop(0);
            this.playnow = false;
        }
    }]);

    return AudioSrc;
}();

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl3Math = function gl3Math() {
    _classCallCheck(this, gl3Math);

    this.vec3 = vec3;
    this.mat4 = mat4;
    this.qtn = qtn;
};

exports.default = gl3Math;

var Mat4 = function () {
    function Mat4() {
        _classCallCheck(this, Mat4);
    }

    _createClass(Mat4, null, [{
        key: "create",
        value: function create() {
            return new Float32Array(16);
        }
    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 1;dest[1] = 0;dest[2] = 0;dest[3] = 0;
            dest[4] = 0;dest[5] = 1;dest[6] = 0;dest[7] = 0;
            dest[8] = 0;dest[9] = 0;dest[10] = 1;dest[11] = 0;
            dest[12] = 0;dest[13] = 0;dest[14] = 0;dest[15] = 1;
            return dest;
        }
    }, {
        key: "multiply",
        value: function multiply(mat1, mat2, dest) {
            var a = mat1[0],
                b = mat1[1],
                c = mat1[2],
                d = mat1[3],
                e = mat1[4],
                f = mat1[5],
                g = mat1[6],
                h = mat1[7],
                i = mat1[8],
                j = mat1[9],
                k = mat1[10],
                l = mat1[11],
                m = mat1[12],
                n = mat1[13],
                o = mat1[14],
                p = mat1[15],
                A = mat2[0],
                B = mat2[1],
                C = mat2[2],
                D = mat2[3],
                E = mat2[4],
                F = mat2[5],
                G = mat2[6],
                H = mat2[7],
                I = mat2[8],
                J = mat2[9],
                K = mat2[10],
                L = mat2[11],
                M = mat2[12],
                N = mat2[13],
                O = mat2[14],
                P = mat2[15];
            dest[0] = A * a + B * e + C * i + D * m;
            dest[1] = A * b + B * f + C * j + D * n;
            dest[2] = A * c + B * g + C * k + D * o;
            dest[3] = A * d + B * h + C * l + D * p;
            dest[4] = E * a + F * e + G * i + H * m;
            dest[5] = E * b + F * f + G * j + H * n;
            dest[6] = E * c + F * g + G * k + H * o;
            dest[7] = E * d + F * h + G * l + H * p;
            dest[8] = I * a + J * e + K * i + L * m;
            dest[9] = I * b + J * f + K * j + L * n;
            dest[10] = I * c + J * g + K * k + L * o;
            dest[11] = I * d + J * h + K * l + L * p;
            dest[12] = M * a + N * e + O * i + P * m;
            dest[13] = M * b + N * f + O * j + P * n;
            dest[14] = M * c + N * g + O * k + P * o;
            dest[15] = M * d + N * h + O * l + P * p;
            return dest;
        }
    }, {
        key: "scale",
        value: function scale(mat, vec, dest) {
            dest[0] = mat[0] * vec[0];
            dest[1] = mat[1] * vec[0];
            dest[2] = mat[2] * vec[0];
            dest[3] = mat[3] * vec[0];
            dest[4] = mat[4] * vec[1];
            dest[5] = mat[5] * vec[1];
            dest[6] = mat[6] * vec[1];
            dest[7] = mat[7] * vec[1];
            dest[8] = mat[8] * vec[2];
            dest[9] = mat[9] * vec[2];
            dest[10] = mat[10] * vec[2];
            dest[11] = mat[11] * vec[2];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
            return dest;
        }
    }, {
        key: "translate",
        value: function translate(mat, vec, dest) {
            dest[0] = mat[0];dest[1] = mat[1];dest[2] = mat[2];dest[3] = mat[3];
            dest[4] = mat[4];dest[5] = mat[5];dest[6] = mat[6];dest[7] = mat[7];
            dest[8] = mat[8];dest[9] = mat[9];dest[10] = mat[10];dest[11] = mat[11];
            dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
            dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
            dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
            dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
            return dest;
        }
    }, {
        key: "rotate",
        value: function rotate(mat, angle, axis, dest) {
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (!sq) {
                return null;
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            if (sq != 1) {
                sq = 1 / sq;a *= sq;b *= sq;c *= sq;
            }
            var d = Math.sin(angle),
                e = Math.cos(angle),
                f = 1 - e,
                g = mat[0],
                h = mat[1],
                i = mat[2],
                j = mat[3],
                k = mat[4],
                l = mat[5],
                m = mat[6],
                n = mat[7],
                o = mat[8],
                p = mat[9],
                q = mat[10],
                r = mat[11],
                s = a * a * f + e,
                t = b * a * f + c * d,
                u = c * a * f - b * d,
                v = a * b * f - c * d,
                w = b * b * f + e,
                x = c * b * f + a * d,
                y = a * c * f + b * d,
                z = b * c * f - a * d,
                A = c * c * f + e;
            if (angle) {
                if (mat != dest) {
                    dest[12] = mat[12];dest[13] = mat[13];
                    dest[14] = mat[14];dest[15] = mat[15];
                }
            } else {
                dest = mat;
            }
            dest[0] = g * s + k * t + o * u;
            dest[1] = h * s + l * t + p * u;
            dest[2] = i * s + m * t + q * u;
            dest[3] = j * s + n * t + r * u;
            dest[4] = g * v + k * w + o * x;
            dest[5] = h * v + l * w + p * x;
            dest[6] = i * v + m * w + q * x;
            dest[7] = j * v + n * w + r * x;
            dest[8] = g * y + k * z + o * A;
            dest[9] = h * y + l * z + p * A;
            dest[10] = i * y + m * z + q * A;
            dest[11] = j * y + n * z + r * A;
            return dest;
        }
    }, {
        key: "lookAt",
        value: function lookAt(eye, center, up, dest) {
            var eyeX = eye[0],
                eyeY = eye[1],
                eyeZ = eye[2],
                upX = up[0],
                upY = up[1],
                upZ = up[2],
                centerX = center[0],
                centerY = center[1],
                centerZ = center[2];
            if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
                return Mat4.identity(dest);
            }
            var x0 = void 0,
                x1 = void 0,
                x2 = void 0,
                y0 = void 0,
                y1 = void 0,
                y2 = void 0,
                z0 = void 0,
                z1 = void 0,
                z2 = void 0,
                l = void 0;
            z0 = eyeX - center[0];z1 = eyeY - center[1];z2 = eyeZ - center[2];
            l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= l;z1 *= l;z2 *= l;
            x0 = upY * z2 - upZ * z1;
            x1 = upZ * z0 - upX * z2;
            x2 = upX * z1 - upY * z0;
            l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!l) {
                x0 = 0;x1 = 0;x2 = 0;
            } else {
                l = 1 / l;
                x0 *= l;x1 *= l;x2 *= l;
            }
            y0 = z1 * x2 - z2 * x1;y1 = z2 * x0 - z0 * x2;y2 = z0 * x1 - z1 * x0;
            l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!l) {
                y0 = 0;y1 = 0;y2 = 0;
            } else {
                l = 1 / l;
                y0 *= l;y1 *= l;y2 *= l;
            }
            dest[0] = x0;dest[1] = y0;dest[2] = z0;dest[3] = 0;
            dest[4] = x1;dest[5] = y1;dest[6] = z1;dest[7] = 0;
            dest[8] = x2;dest[9] = y2;dest[10] = z2;dest[11] = 0;
            dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
            dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
            dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "perspective",
        value: function perspective(fovy, aspect, near, far, dest) {
            var t = near * Math.tan(fovy * Math.PI / 360);
            var r = t * aspect;
            var a = r * 2,
                b = t * 2,
                c = far - near;
            dest[0] = near * 2 / a;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = near * 2 / b;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = 0;
            dest[9] = 0;
            dest[10] = -(far + near) / c;
            dest[11] = -1;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = -(far * near * 2) / c;
            dest[15] = 0;
            return dest;
        }
    }, {
        key: "ortho",
        value: function ortho(left, right, top, bottom, near, far, dest) {
            var h = right - left;
            var v = top - bottom;
            var d = far - near;
            dest[0] = 2 / h;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = 2 / v;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = 0;
            dest[9] = 0;
            dest[10] = -2 / d;
            dest[11] = 0;
            dest[12] = -(left + right) / h;
            dest[13] = -(top + bottom) / v;
            dest[14] = -(far + near) / d;
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "transpose",
        value: function transpose(mat, dest) {
            dest[0] = mat[0];dest[1] = mat[4];
            dest[2] = mat[8];dest[3] = mat[12];
            dest[4] = mat[1];dest[5] = mat[5];
            dest[6] = mat[9];dest[7] = mat[13];
            dest[8] = mat[2];dest[9] = mat[6];
            dest[10] = mat[10];dest[11] = mat[14];
            dest[12] = mat[3];dest[13] = mat[7];
            dest[14] = mat[11];dest[15] = mat[15];
            return dest;
        }
    }, {
        key: "inverse",
        value: function inverse(mat, dest) {
            var a = mat[0],
                b = mat[1],
                c = mat[2],
                d = mat[3],
                e = mat[4],
                f = mat[5],
                g = mat[6],
                h = mat[7],
                i = mat[8],
                j = mat[9],
                k = mat[10],
                l = mat[11],
                m = mat[12],
                n = mat[13],
                o = mat[14],
                p = mat[15],
                q = a * f - b * e,
                r = a * g - c * e,
                s = a * h - d * e,
                t = b * g - c * f,
                u = b * h - d * f,
                v = c * h - d * g,
                w = i * n - j * m,
                x = i * o - k * m,
                y = i * p - l * m,
                z = j * o - k * n,
                A = j * p - l * n,
                B = k * p - l * o,
                ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
            dest[0] = (f * B - g * A + h * z) * ivd;
            dest[1] = (-b * B + c * A - d * z) * ivd;
            dest[2] = (n * v - o * u + p * t) * ivd;
            dest[3] = (-j * v + k * u - l * t) * ivd;
            dest[4] = (-e * B + g * y - h * x) * ivd;
            dest[5] = (a * B - c * y + d * x) * ivd;
            dest[6] = (-m * v + o * s - p * r) * ivd;
            dest[7] = (i * v - k * s + l * r) * ivd;
            dest[8] = (e * A - f * y + h * w) * ivd;
            dest[9] = (-a * A + b * y - d * w) * ivd;
            dest[10] = (m * u - n * s + p * q) * ivd;
            dest[11] = (-i * u + j * s - l * q) * ivd;
            dest[12] = (-e * z + f * x - g * w) * ivd;
            dest[13] = (a * z - b * x + c * w) * ivd;
            dest[14] = (-m * t + n * r - o * q) * ivd;
            dest[15] = (i * t - j * r + k * q) * ivd;
            return dest;
        }
    }, {
        key: "vpFromCamera",
        value: function vpFromCamera(cam, vmat, pmat, dest) {
            Mat4.lookAt(cam.position, cam.centerPoint, cam.upDirection, vmat);
            Mat4.perspective(cam.fovy, cam.aspect, cam.near, cam.far, pmat);
            Mat4.multiply(pmat, vmat, dest);
        }
    }]);

    return Mat4;
}();

var Vec3 = function () {
    function Vec3() {
        _classCallCheck(this, Vec3);
    }

    _createClass(Vec3, null, [{
        key: "create",
        value: function create() {
            return new Float32Array(3);
        }
    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec3.create();
            var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
                n[2] = v[2] * e;
            }
            return n;
        }
    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        }
    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec3.create();
            n[0] = v0[1] * v1[2] - v0[2] * v1[1];
            n[1] = v0[2] * v1[0] - v0[0] * v1[2];
            n[2] = v0[0] * v1[1] - v0[1] * v1[0];
            return n;
        }
    }, {
        key: "faceNormal",
        value: function faceNormal(v0, v1, v2) {
            var n = Vec3.create();
            var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
            var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
            n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
            n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
            n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
            return Vec3.normalize(n);
        }
    }]);

    return Vec3;
}();

var Qtn = function () {
    function Qtn() {
        _classCallCheck(this, Qtn);
    }

    _createClass(Qtn, null, [{
        key: "create",
        value: function create() {
            return new Float32Array(4);
        }
    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 0;dest[1] = 0;dest[2] = 0;dest[3] = 1;
            return dest;
        }
    }, {
        key: "inverse",
        value: function inverse(qtn, dest) {
            dest[0] = -qtn[0];
            dest[1] = -qtn[1];
            dest[2] = -qtn[2];
            dest[3] = qtn[3];
            return dest;
        }
    }, {
        key: "normalize",
        value: function normalize(dest) {
            var x = dest[0],
                y = dest[1],
                z = dest[2],
                w = dest[3];
            var l = Math.sqrt(x * x + y * y + z * z + w * w);
            if (l === 0) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
                dest[3] = 0;
            } else {
                l = 1 / l;
                dest[0] = x * l;
                dest[1] = y * l;
                dest[2] = z * l;
                dest[3] = w * l;
            }
            return dest;
        }
    }, {
        key: "multiply",
        value: function multiply(qtn1, qtn2, dest) {
            var ax = qtn1[0],
                ay = qtn1[1],
                az = qtn1[2],
                aw = qtn1[3];
            var bx = qtn2[0],
                by = qtn2[1],
                bz = qtn2[2],
                bw = qtn2[3];
            dest[0] = ax * bw + aw * bx + ay * bz - az * by;
            dest[1] = ay * bw + aw * by + az * bx - ax * bz;
            dest[2] = az * bw + aw * bz + ax * by - ay * bx;
            dest[3] = aw * bw - ax * bx - ay * by - az * bz;
            return dest;
        }
    }, {
        key: "rotate",
        value: function rotate(angle, axis, dest) {
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (!sq) {
                return null;
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            if (sq != 1) {
                sq = 1 / sq;a *= sq;b *= sq;c *= sq;
            }
            var s = Math.sin(angle * 0.5);
            dest[0] = a * s;
            dest[1] = b * s;
            dest[2] = c * s;
            dest[3] = Math.cos(angle * 0.5);
            return dest;
        }
    }, {
        key: "toVecIII",
        value: function toVecIII(vec, qtn, dest) {
            var qp = Qtn.create();
            var qq = Qtn.create();
            var qr = Qtn.create();
            Qtn.inverse(qtn, qr);
            qp[0] = vec[0];
            qp[1] = vec[1];
            qp[2] = vec[2];
            Qtn.multiply(qr, qp, qq);
            Qtn.multiply(qq, qtn, qr);
            dest[0] = qr[0];
            dest[1] = qr[1];
            dest[2] = qr[2];
            return dest;
        }
    }, {
        key: "toMatIV",
        value: function toMatIV(qtn, dest) {
            var x = qtn[0],
                y = qtn[1],
                z = qtn[2],
                w = qtn[3];
            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;
            var xx = x * x2,
                xy = x * y2,
                xz = x * z2;
            var yy = y * y2,
                yz = y * z2,
                zz = z * z2;
            var wx = w * x2,
                wy = w * y2,
                wz = w * z2;
            dest[0] = 1 - (yy + zz);
            dest[1] = xy - wz;
            dest[2] = xz + wy;
            dest[3] = 0;
            dest[4] = xy + wz;
            dest[5] = 1 - (xx + zz);
            dest[6] = yz - wx;
            dest[7] = 0;
            dest[8] = xz - wy;
            dest[9] = yz + wx;
            dest[10] = 1 - (xx + yy);
            dest[11] = 0;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = 0;
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "slerp",
        value: function slerp(qtn1, qtn2, time, dest) {
            var ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
            var hs = 1.0 - ht * ht;
            if (hs <= 0.0) {
                dest[0] = qtn1[0];
                dest[1] = qtn1[1];
                dest[2] = qtn1[2];
                dest[3] = qtn1[3];
            } else {
                hs = Math.sqrt(hs);
                if (Math.abs(hs) < 0.0001) {
                    dest[0] = qtn1[0] * 0.5 + qtn2[0] * 0.5;
                    dest[1] = qtn1[1] * 0.5 + qtn2[1] * 0.5;
                    dest[2] = qtn1[2] * 0.5 + qtn2[2] * 0.5;
                    dest[3] = qtn1[3] * 0.5 + qtn2[3] * 0.5;
                } else {
                    var ph = Math.acos(ht);
                    var pt = ph * time;
                    var t0 = Math.sin(ph - pt) / hs;
                    var t1 = Math.sin(pt) / hs;
                    dest[0] = qtn1[0] * t0 + qtn2[0] * t1;
                    dest[1] = qtn1[1] * t0 + qtn2[1] * t1;
                    dest[2] = qtn1[2] * t0 + qtn2[2] * t1;
                    dest[3] = qtn1[3] * t0 + qtn2[3] * t1;
                }
            }
            return dest;
        }
    }]);

    return Qtn;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl3Mesh = function () {
    function gl3Mesh() {
        _classCallCheck(this, gl3Mesh);
    }

    _createClass(gl3Mesh, null, [{
        key: "plane",
        value: function plane(width, height, color) {
            var w = void 0,
                h = void 0;
            w = width / 2;
            h = height / 2;
            if (color) {
                tc = color;
            } else {
                tc = [1.0, 1.0, 1.0, 1.0];
            }
            var pos = [-w, h, 0.0, w, h, 0.0, -w, -h, 0.0, w, -h, 0.0];
            var nor = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
            var col = [color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]];
            var st = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
            var idx = [0, 1, 2, 2, 1, 3];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }
    }, {
        key: "torus",
        value: function torus(row, column, irad, orad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            for (i = 0; i <= row; i++) {
                var _r = Math.PI * 2 / row * i;
                var rr = Math.cos(_r);
                var ry = Math.sin(_r);
                for (j = 0; j <= column; j++) {
                    var tr = Math.PI * 2 / column * j;
                    var tx = (rr * irad + orad) * Math.cos(tr);
                    var ty = ry * irad;
                    var tz = (rr * irad + orad) * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    var rs = 1 / column * j;
                    var rt = 1 / row * i + 0.5;
                    if (rt > 1.0) {
                        rt -= 1.0;
                    }
                    rt = 1.0 - rt;
                    pos.push(tx, ty, tz);
                    nor.push(rx, ry, rz);
                    col.push(color[0], color[1], color[2], color[3]);
                    st.push(rs, rt);
                }
            }
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    r = (column + 1) * i + j;
                    idx.push(r, r + column + 1, r + 1);
                    idx.push(r + column + 1, r + column + 2, r + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }
    }, {
        key: "sphere",
        value: function sphere(row, column, rad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            for (i = 0; i <= row; i++) {
                var _r2 = Math.PI / row * i;
                var ry = Math.cos(_r2);
                var rr = Math.sin(_r2);
                for (j = 0; j <= column; j++) {
                    var tr = Math.PI * 2 / column * j;
                    var tx = rr * rad * Math.cos(tr);
                    var ty = ry * rad;
                    var tz = rr * rad * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    pos.push(tx, ty, tz);
                    nor.push(rx, ry, rz);
                    col.push(color[0], color[1], color[2], color[3]);
                    st.push(1 - 1 / column * j, 1 / row * i);
                }
            }
            r = 0;
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    r = (column + 1) * i + j;
                    idx.push(r, r + 1, r + column + 2);
                    idx.push(r, r + column + 2, r + column + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }
    }, {
        key: "cube",
        value: function cube(side, color) {
            var hs = side * 0.5;
            var pos = [-hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs, -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs, hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs];
            var nor = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];
            var col = [];
            for (var i = 0; i < pos.length / 3; i++) {
                col.push(color[0], color[1], color[2], color[3]);
            }
            var st = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
            var idx = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }
    }]);

    return gl3Mesh;
}();

exports.default = gl3Mesh;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl3Util = function () {
    function gl3Util() {
        _classCallCheck(this, gl3Util);
    }

    _createClass(gl3Util, null, [{
        key: "hsva",
        value: function hsva(h, s, v, a) {
            if (s > 1 || v > 1 || a > 1) {
                return;
            }
            var th = h % 360;
            var i = Math.floor(th / 60);
            var f = th / 60 - i;
            var m = v * (1 - s);
            var n = v * (1 - s * f);
            var k = v * (1 - s * (1 - f));
            var color = new Array();
            if (!s > 0 && !s < 0) {
                color.push(v, v, v, a);
            } else {
                var r = new Array(v, n, m, m, k, v);
                var g = new Array(k, v, v, n, m, m);
                var b = new Array(m, m, k, v, v, n);
                color.push(r[i], g[i], b[i], a);
            }
            return color;
        }
    }, {
        key: "easeLiner",
        value: function easeLiner(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
    }, {
        key: "easeOutCubic",
        value: function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }
    }, {
        key: "easeQuintic",
        value: function easeQuintic(t) {
            var ts = (t = t / 1) * t;
            var tc = ts * t;
            return tc * ts;
        }
    }]);

    return gl3Util;
}();

exports.default = gl3Util;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gl3Audio = __webpack_require__(0);

var _gl3Audio2 = _interopRequireDefault(_gl3Audio);

var _gl3Math = __webpack_require__(2);

var _gl3Math2 = _interopRequireDefault(_gl3Math);

var _gl3Mesh = __webpack_require__(3);

var _gl3Mesh2 = _interopRequireDefault(_gl3Mesh);

var _gl3Util = __webpack_require__(4);

var _gl3Util2 = _interopRequireDefault(_gl3Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl3 = function () {
    function gl3(canvas, options) {
        _classCallCheck(this, gl3);

        this.VERSION = '0.0.6';
        this.PI2 = 6.28318530717958647692528676655900576;
        this.PI = 3.14159265358979323846264338327950288;
        this.PIH = 1.57079632679489661923132169163975144;
        this.PIH2 = 0.78539816339744830961566084581987572;
        this.TEXTURE_UNIT_COUNT = null;

        console.log('%c◆%c glCubic.js %c◆%c : version %c' + gl3.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');

        this.ready = false;
        this.canvas = null;
        this.gl = null;
        this.textures = null;
        this.ext = null;

        this.Audio = _gl3Audio2.default;
        this.Creator = creator;
        this.Math = _gl3Math2.default;
        this.Mesh = _gl3Mesh2.default;
        this.Util = _gl3Util2.default;
    }

    _createClass(gl3, [{
        key: 'init',
        value: function init(canvas, options) {
            var opt = options || {};
            this.ready = false;
            if (canvas == null) {
                return false;
            }
            if (canvas instanceof HTMLCanvasElement) {
                this.canvas = canvas;
            } else if (Object.prototype.toString.call(canvas) === '[object String]') {
                this.canvas = document.getElementById(canvas);
            }
            if (this.canvas == null) {
                return false;
            }
            this.gl = this.canvas.getContext('webgl', opt) || this.canvas.getContext('experimental-webgl', opt);
            if (this.gl != null) {
                this.ready = true;
                this.TEXTURE_UNIT_COUNT = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                this.textures = new Array(this.TEXTURE_UNIT_COUNT);
            }
            return this.ready;
        }
    }, {
        key: 'sceneClear',
        value: function sceneClear(color, depth, stencil) {
            var gl = this.gl;
            var flg = gl.COLOR_BUFFER_BIT;
            gl.clearColor(color[0], color[1], color[2], color[3]);
            if (depth != null) {
                gl.clearDepth(depth);
                flg = flg | gl.DEPTH_BUFFER_BIT;
            }
            if (stencil != null) {
                gl.clearStencil(stencil);
                flg = flg | gl.STENCIL_BUFFER_BIT;
            }
            gl.clear(flg);
        }
    }, {
        key: 'sceneView',
        value: function sceneView(camera, x, y, width, height) {
            var X = x || 0;
            var Y = y || 0;
            var w = width || window.innerWidth;
            var h = height || window.innerHeight;
            this.gl.viewport(X, Y, w, h);
            if (camera != null) {
                camera.aspect = w / h;
            }
        }
    }, {
        key: 'drawArrays',
        value: function drawArrays(primitive, vertexCount) {
            this.gl.drawArrays(primitive, 0, vertexCount);
        }
    }, {
        key: 'drawElements',
        value: function drawElements(primitive, indexLength) {
            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, 0);
        }
    }, {
        key: 'createVbo',
        value: function createVbo(data) {
            if (data == null) {
                return;
            }
            var vbo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            return vbo;
        }
    }, {
        key: 'createIbo',
        value: function createIbo(data) {
            if (data == null) {
                return;
            }
            var ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }
    }, {
        key: 'createTexture',
        value: function createTexture(source, number, callback) {
            var _this = this;

            if (source == null || number == null) {
                return;
            }
            var img = new Image();
            var gl = this.gl;
            img.onload = function () {
                _this.textures[number] = { texture: null, type: null, loaded: false };
                var tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                _this.textures[number].texture = tex;
                _this.textures[number].type = gl.TEXTURE_2D;
                _this.textures[number].loaded = true;
                console.log('%c◆%c texture number: %c' + number + '%c, image loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                gl.bindTexture(gl.TEXTURE_2D, null);
                if (callback != null) {
                    callback(number);
                }
            };
            img.src = source;
        }
    }, {
        key: 'createTextureCanvas',
        value: function createTextureCanvas(canvas, number) {
            if (canvas == null || number == null) {
                return;
            }
            var gl = this.gl;
            var tex = gl.createTexture();
            this.textures[number] = { texture: null, type: null, loaded: false };
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
        }
    }, {
        key: 'createFramebuffer',
        value: function createFramebuffer(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
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
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }
    }, {
        key: 'createFramebufferCube',
        value: function createFramebufferCube(width, height, target, number) {
            if (width == null || height == null || target == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            var fTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, fTexture);
            for (var i = 0; i < target.length; i++) {
                gl.texImage2D(target[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_CUBE_MAP;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer cube created', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }
    }, {
        key: 'createTextureCube',
        value: function createTextureCube(source, target, number, callback) {
            var _this2 = this;

            if (source == null || target == null || number == null) {
                return;
            }
            var cImg = [];
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            for (var i = 0; i < source.length; i++) {
                cImg[i] = { image: new Image(), loaded: false };
                cImg[i].image.onload = function (index) {
                    return function () {
                        cImg[index].loaded = true;
                        if (cImg.length === 6) {
                            var f = true;
                            cImg.map(function (v) {
                                f = f && v.loaded;
                            });
                            if (f === true) {
                                var tex = gl.createTexture();
                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
                                for (var j = 0; j < source.length; j++) {
                                    gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cImg[j].image);
                                }
                                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                _this2.textures[number].texture = tex;
                                _this2.textures[number].type = gl.TEXTURE_CUBE_MAP;
                                _this2.textures[number].loaded = true;
                                console.log('%c◆%c texture number: %c' + number + '%c, image loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                                if (callback != null) {
                                    callback(number);
                                }
                            }
                        }
                    };
                }(i);
                cImg[i].image.src = source[i];
            }
        }
    }, {
        key: 'bindTexture',
        value: function bindTexture(unit, number) {
            if (this.textures[number] == null) {
                return;
            }
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
        }
    }, {
        key: 'isTextureLoaded',
        value: function isTextureLoaded() {
            var i = void 0,
                j = void 0,
                f = void 0,
                g = void 0;
            f = true;g = false;
            for (i = 0, j = this.textures.length; i < j; i++) {
                if (this.textures[i] != null) {
                    g = true;
                    f = f && this.textures[i].loaded;
                }
            }
            if (g) {
                return f;
            } else {
                return false;
            }
        }
    }, {
        key: 'createProgramFromId',
        value: function createProgramFromId(vsId, fsId, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl);
            mng.vs = mng.createShaderFromId(vsId);
            mng.fs = mng.createShaderFromId(fsId);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for (i = 0; i < attLocation.length; i++) {
                mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for (i = 0; i < uniLocation.length; i++) {
                mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            return mng;
        }
    }, {
        key: 'createProgramFromSource',
        value: function createProgramFromSource(vs, fs, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl);
            mng.vs = mng.createShaderFromSource(vs, this.gl.VERTEX_SHADER);
            mng.fs = mng.createShaderFromSource(fs, this.gl.FRAGMENT_SHADER);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for (i = 0; i < attLocation.length; i++) {
                mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for (i = 0; i < uniLocation.length; i++) {
                mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            return mng;
        }
    }, {
        key: 'createProgramFromFile',
        value: function createProgramFromFile(vsUrl, fsUrl, attLocation, attStride, uniLocation, uniType, callback) {
            if (this.gl == null) {
                return null;
            }
            var mng = new ProgramManager(this.gl);
            var src = {
                vs: {
                    targetUrl: vsUrl,
                    source: null
                },
                fs: {
                    targetUrl: fsUrl,
                    source: null
                }
            };
            xhr(this.gl, src.vs);
            xhr(this.gl, src.fs);
            function xhr(gl, target) {
                var xml = new XMLHttpRequest();
                xml.open('GET', target.targetUrl, true);
                xml.setRequestHeader('Pragma', 'no-cache');
                xml.setRequestHeader('Cache-Control', 'no-cache');
                xml.onload = function () {
                    console.log('%c◆%c shader source loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                    target.source = xml.responseText;
                    loadCheck(gl);
                };
                xml.send();
            }
            function loadCheck(gl) {
                if (src.vs.source == null || src.fs.source == null) {
                    return;
                }
                var i = void 0;
                mng.vs = mng.createShaderFromSource(src.vs.source, gl.VERTEX_SHADER);
                mng.fs = mng.createShaderFromSource(src.fs.source, gl.FRAGMENT_SHADER);
                mng.prg = mng.createProgram(mng.vs, mng.fs);
                mng.attL = new Array(attLocation.length);
                mng.attS = new Array(attLocation.length);
                for (i = 0; i < attLocation.length; i++) {
                    mng.attL[i] = gl.getAttribLocation(mng.prg, attLocation[i]);
                    mng.attS[i] = attStride[i];
                }
                mng.uniL = new Array(uniLocation.length);
                for (i = 0; i < uniLocation.length; i++) {
                    mng.uniL[i] = gl.getUniformLocation(mng.prg, uniLocation[i]);
                }
                mng.uniT = uniType;
                mng.locationCheck(attLocation, uniLocation);
                callback();
            }
            return mng;
        }
    }]);

    return gl3;
}();

exports.default = gl3;

var ProgramManager = function () {
    function ProgramManager(gl) {
        _classCallCheck(this, ProgramManager);

        this.gl = gl;
        this.vs = null;
        this.fs = null;
        this.prg = null;
        this.attL = null;
        this.attS = null;
        this.uniL = null;
        this.uniT = null;
    }

    _createClass(ProgramManager, [{
        key: 'createShaderFromId',
        value: function createShaderFromId(id) {
            var shader = void 0;
            var scriptElement = document.getElementById(id);
            if (!scriptElement) {
                return;
            }
            switch (scriptElement.type) {
                case 'x-shader/x-vertex':
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                case 'x-shader/x-fragment':
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                default:
                    return;
            }
            this.gl.shaderSource(shader, scriptElement.text);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                console.warn('◆ compile failed of shader: ' + this.gl.getShaderInfoLog(shader));
            }
        }
    }, {
        key: 'createShaderFromSource',
        value: function createShaderFromSource(source, type) {
            var shader = void 0;
            switch (type) {
                case this.gl.VERTEX_SHADER:
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                case this.gl.FRAGMENT_SHADER:
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                default:
                    return;
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                console.warn('◆ compile failed of shader: ' + this.gl.getShaderInfoLog(shader));
            }
        }
    }, {
        key: 'createProgram',
        value: function createProgram(vs, fs) {
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vs);
            this.gl.attachShader(program, fs);
            this.gl.linkProgram(program);
            if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                this.gl.useProgram(program);
                return program;
            } else {
                console.warn('◆ link program failed: ' + this.gl.getProgramInfoLog(program));
            }
        }
    }, {
        key: 'useProgram',
        value: function useProgram() {
            this.gl.useProgram(this.prg);
        }
    }, {
        key: 'setAttribute',
        value: function setAttribute(vbo, ibo) {
            var gl = this.gl;
            for (var i in vbo) {
                if (this.attL[i] >= 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
                    gl.enableVertexAttribArray(this.attL[i]);
                    gl.vertexAttribPointer(this.attL[i], this.attS[i], gl.FLOAT, false, 0, 0);
                }
            }
            if (ibo != null) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            }
        }
    }, {
        key: 'pushShader',
        value: function pushShader(any) {
            var gl = this.gl;
            for (var i = 0, j = this.uniT.length; i < j; i++) {
                var uni = 'uniform' + this.uniT[i].replace(/matrix/i, 'Matrix');
                if (gl[uni] != null) {
                    if (uni.search(/Matrix/) !== -1) {
                        gl[uni](this.uniL[i], false, any[i]);
                    } else {
                        gl[uni](this.uniL[i], any[i]);
                    }
                } else {
                    console.warn('◆ not support uniform type: ' + this.uniT[i]);
                }
            }
        }
    }, {
        key: 'locationCheck',
        value: function locationCheck(attLocation, uniLocation) {
            var i = void 0,
                l = void 0;
            for (i = 0, l = attLocation.length; i < l; i++) {
                if (this.attL[i] == null || this.attL[i] < 0) {
                    console.warn('◆ invalid attribute location: %c"' + attLocation[i] + '"', 'color: crimson');
                }
            }
            for (i = 0, l = uniLocation.length; i < l; i++) {
                if (this.uniL[i] == null || this.uniL[i] < 0) {
                    console.warn('◆ invalid uniform location: %c"' + uniLocation[i] + '"', 'color: crimson');
                }
            }
        }
    }]);

    return ProgramManager;
}();

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWNlNTA5ZTIzMGJhYzc4MzljOGUiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzTWF0aC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNNZXNoLmpzIiwid2VicGFjazovLy8uL2dsM1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzQ29yZS5qcyJdLCJuYW1lcyI6WyJBdWRpb0N0ciIsImJnbUdhaW5WYWx1ZSIsInNvdW5kR2FpblZhbHVlIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiY3R4IiwiY29tcCIsImNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImJnbUdhaW4iLCJjcmVhdGVHYWluIiwiZ2FpbiIsInZhbHVlIiwic291bmRHYWluIiwic3JjIiwidXJsIiwiaW5kZXgiLCJsb29wIiwiYmFja2dyb3VuZCIsImNhbGxiYWNrIiwieG1sIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsImRlY29kZUF1ZGlvRGF0YSIsInJlc3BvbnNlIiwiYnVmIiwiQXVkaW9TcmMiLCJsb2FkZWQiLCJjb25zb2xlIiwibG9nIiwiZSIsInNlbmQiLCJpIiwiZiIsImxlbmd0aCIsImF1ZGlvQnVmZmVyIiwiYnVmZmVyU291cmNlIiwiYWN0aXZlQnVmZmVyU291cmNlIiwiZmZ0TG9vcCIsInVwZGF0ZSIsIm5vZGUiLCJjcmVhdGVTY3JpcHRQcm9jZXNzb3IiLCJhbmFseXNlciIsImNyZWF0ZUFuYWx5c2VyIiwic21vb3RoaW5nVGltZUNvbnN0YW50IiwiZmZ0U2l6ZSIsIm9uRGF0YSIsIlVpbnQ4QXJyYXkiLCJmcmVxdWVuY3lCaW5Db3VudCIsImoiLCJrIiwic2VsZiIsInBsYXlub3ciLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJidWZmZXIiLCJwbGF5YmFja1JhdGUiLCJvbmVuZGVkIiwic3RvcCIsIm9uYXVkaW9wcm9jZXNzIiwiZXZlIiwib25wcm9jZXNzRXZlbnQiLCJzdGFydCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwiZ2wzTWF0aCIsInZlYzMiLCJtYXQ0IiwicXRuIiwiTWF0NCIsIkZsb2F0MzJBcnJheSIsImRlc3QiLCJtYXQxIiwibWF0MiIsImEiLCJiIiwiYyIsImQiLCJnIiwiaCIsImwiLCJtIiwibiIsIm8iLCJwIiwiQSIsIkIiLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkgiLCJJIiwiSiIsIksiLCJMIiwiTSIsIk4iLCJPIiwiUCIsIm1hdCIsInZlYyIsImFuZ2xlIiwiYXhpcyIsInNxIiwiTWF0aCIsInNxcnQiLCJzaW4iLCJjb3MiLCJxIiwiciIsInMiLCJ0IiwidSIsInYiLCJ3IiwieCIsInkiLCJ6IiwiZXllIiwiY2VudGVyIiwidXAiLCJleWVYIiwiZXllWSIsImV5ZVoiLCJ1cFgiLCJ1cFkiLCJ1cFoiLCJjZW50ZXJYIiwiY2VudGVyWSIsImNlbnRlcloiLCJpZGVudGl0eSIsIngwIiwieDEiLCJ4MiIsInkwIiwieTEiLCJ5MiIsInowIiwiejEiLCJ6MiIsImZvdnkiLCJhc3BlY3QiLCJuZWFyIiwiZmFyIiwidGFuIiwiUEkiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJpdmQiLCJjYW0iLCJ2bWF0IiwicG1hdCIsImxvb2tBdCIsInBvc2l0aW9uIiwiY2VudGVyUG9pbnQiLCJ1cERpcmVjdGlvbiIsInBlcnNwZWN0aXZlIiwibXVsdGlwbHkiLCJWZWMzIiwiY3JlYXRlIiwidjAiLCJ2MSIsInYyIiwidmVjMSIsInZlYzIiLCJub3JtYWxpemUiLCJRdG4iLCJxdG4xIiwicXRuMiIsImF4IiwiYXkiLCJheiIsImF3IiwiYngiLCJieSIsImJ6IiwiYnciLCJxcCIsInFxIiwicXIiLCJpbnZlcnNlIiwieHgiLCJ4eSIsInh6IiwieXkiLCJ5eiIsInp6Iiwid3giLCJ3eSIsInd6IiwidGltZSIsImh0IiwiaHMiLCJhYnMiLCJwaCIsImFjb3MiLCJwdCIsInQwIiwidDEiLCJnbDNNZXNoIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xvciIsInRjIiwicG9zIiwibm9yIiwiY29sIiwic3QiLCJpZHgiLCJub3JtYWwiLCJ0ZXhDb29yZCIsInJvdyIsImNvbHVtbiIsImlyYWQiLCJvcmFkIiwicnIiLCJyeSIsInRyIiwidHgiLCJ0eSIsInR6IiwicngiLCJyeiIsInJzIiwicnQiLCJwdXNoIiwicmFkIiwic2lkZSIsImdsM1V0aWwiLCJ0aCIsImZsb29yIiwiQXJyYXkiLCJ0cyIsImdsMyIsImNhbnZhcyIsIm9wdGlvbnMiLCJWRVJTSU9OIiwiUEkyIiwiUElIIiwiUElIMiIsIlRFWFRVUkVfVU5JVF9DT1VOVCIsInJlYWR5IiwiZ2wiLCJ0ZXh0dXJlcyIsImV4dCIsIkF1ZGlvIiwiQ3JlYXRvciIsImNyZWF0b3IiLCJNZXNoIiwiVXRpbCIsIm9wdCIsIkhUTUxDYW52YXNFbGVtZW50IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImdldENvbnRleHQiLCJnZXRQYXJhbWV0ZXIiLCJNQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyIsImRlcHRoIiwic3RlbmNpbCIsImZsZyIsIkNPTE9SX0JVRkZFUl9CSVQiLCJjbGVhckNvbG9yIiwiY2xlYXJEZXB0aCIsIkRFUFRIX0JVRkZFUl9CSVQiLCJjbGVhclN0ZW5jaWwiLCJTVEVOQ0lMX0JVRkZFUl9CSVQiLCJjbGVhciIsImNhbWVyYSIsIlgiLCJZIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0Iiwidmlld3BvcnQiLCJwcmltaXRpdmUiLCJ2ZXJ0ZXhDb3VudCIsImRyYXdBcnJheXMiLCJpbmRleExlbmd0aCIsImRyYXdFbGVtZW50cyIsIlVOU0lHTkVEX1NIT1JUIiwiZGF0YSIsInZibyIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiU1RBVElDX0RSQVciLCJpYm8iLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsIkludDE2QXJyYXkiLCJzb3VyY2UiLCJudW1iZXIiLCJpbWciLCJJbWFnZSIsInRleHR1cmUiLCJ0eXBlIiwidGV4IiwiY3JlYXRlVGV4dHVyZSIsImJpbmRUZXh0dXJlIiwiVEVYVFVSRV8yRCIsInRleEltYWdlMkQiLCJSR0JBIiwiVU5TSUdORURfQllURSIsImdlbmVyYXRlTWlwbWFwIiwidGV4UGFyYW1ldGVyaSIsIlRFWFRVUkVfTUlOX0ZJTFRFUiIsIkxJTkVBUiIsIlRFWFRVUkVfTUFHX0ZJTFRFUiIsIlRFWFRVUkVfV1JBUF9TIiwiUkVQRUFUIiwiVEVYVFVSRV9XUkFQX1QiLCJmcmFtZUJ1ZmZlciIsImNyZWF0ZUZyYW1lYnVmZmVyIiwiYmluZEZyYW1lYnVmZmVyIiwiRlJBTUVCVUZGRVIiLCJkZXB0aFJlbmRlckJ1ZmZlciIsImNyZWF0ZVJlbmRlcmJ1ZmZlciIsImJpbmRSZW5kZXJidWZmZXIiLCJSRU5ERVJCVUZGRVIiLCJyZW5kZXJidWZmZXJTdG9yYWdlIiwiREVQVEhfQ09NUE9ORU5UMTYiLCJmcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlciIsIkRFUFRIX0FUVEFDSE1FTlQiLCJmVGV4dHVyZSIsIkNMQU1QX1RPX0VER0UiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkNPTE9SX0FUVEFDSE1FTlQwIiwiZnJhbWVidWZmZXIiLCJkZXB0aFJlbmRlcmJ1ZmZlciIsInRhcmdldCIsIlRFWFRVUkVfQ1VCRV9NQVAiLCJjSW1nIiwiaW1hZ2UiLCJtYXAiLCJ1bml0IiwiYWN0aXZlVGV4dHVyZSIsIlRFWFRVUkUwIiwidnNJZCIsImZzSWQiLCJhdHRMb2NhdGlvbiIsImF0dFN0cmlkZSIsInVuaUxvY2F0aW9uIiwidW5pVHlwZSIsIm1uZyIsIlByb2dyYW1NYW5hZ2VyIiwidnMiLCJjcmVhdGVTaGFkZXJGcm9tSWQiLCJmcyIsInByZyIsImNyZWF0ZVByb2dyYW0iLCJhdHRMIiwiYXR0UyIsImdldEF0dHJpYkxvY2F0aW9uIiwidW5pTCIsImdldFVuaWZvcm1Mb2NhdGlvbiIsInVuaVQiLCJsb2NhdGlvbkNoZWNrIiwiY3JlYXRlU2hhZGVyRnJvbVNvdXJjZSIsIlZFUlRFWF9TSEFERVIiLCJGUkFHTUVOVF9TSEFERVIiLCJ2c1VybCIsImZzVXJsIiwidGFyZ2V0VXJsIiwieGhyIiwicmVzcG9uc2VUZXh0IiwibG9hZENoZWNrIiwiaWQiLCJzaGFkZXIiLCJzY3JpcHRFbGVtZW50IiwiY3JlYXRlU2hhZGVyIiwic2hhZGVyU291cmNlIiwidGV4dCIsImNvbXBpbGVTaGFkZXIiLCJnZXRTaGFkZXJQYXJhbWV0ZXIiLCJDT01QSUxFX1NUQVRVUyIsIndhcm4iLCJnZXRTaGFkZXJJbmZvTG9nIiwicHJvZ3JhbSIsImF0dGFjaFNoYWRlciIsImxpbmtQcm9ncmFtIiwiZ2V0UHJvZ3JhbVBhcmFtZXRlciIsIkxJTktfU1RBVFVTIiwidXNlUHJvZ3JhbSIsImdldFByb2dyYW1JbmZvTG9nIiwiZW5hYmxlVmVydGV4QXR0cmliQXJyYXkiLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwiRkxPQVQiLCJhbnkiLCJ1bmkiLCJyZXBsYWNlIiwic2VhcmNoIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9EQTs7Ozs7O0lB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LDRCQUFRaVcsSUFBUixDQUFhLGlDQUFpQyxLQUFLcEIsSUFBTCxDQUFVelUsQ0FBVixDQUE5QztBQUNIO0FBQ0o7QUFDSjs7O3NDQUVheVQsVyxFQUFhRSxXLEVBQVk7QUFDbkMsZ0JBQUkzVCxVQUFKO0FBQUEsZ0JBQU84QyxVQUFQO0FBQ0EsaUJBQUk5QyxJQUFJLENBQUosRUFBTzhDLElBQUkyUSxZQUFZdlQsTUFBM0IsRUFBbUNGLElBQUk4QyxDQUF2QyxFQUEwQzlDLEdBQTFDLEVBQThDO0FBQzFDLG9CQUFHLEtBQUtvVSxJQUFMLENBQVVwVSxDQUFWLEtBQWdCLElBQWhCLElBQXdCLEtBQUtvVSxJQUFMLENBQVVwVSxDQUFWLElBQWUsQ0FBMUMsRUFBNEM7QUFDeENKLDRCQUFRaVcsSUFBUixDQUFhLHNDQUFzQ3BDLFlBQVl6VCxDQUFaLENBQXRDLEdBQXVELEdBQXBFLEVBQXlFLGdCQUF6RTtBQUNIO0FBQ0o7QUFDRCxpQkFBSUEsSUFBSSxDQUFKLEVBQU84QyxJQUFJNlEsWUFBWXpULE1BQTNCLEVBQW1DRixJQUFJOEMsQ0FBdkMsRUFBMEM5QyxHQUExQyxFQUE4QztBQUMxQyxvQkFBRyxLQUFLdVUsSUFBTCxDQUFVdlUsQ0FBVixLQUFnQixJQUFoQixJQUF3QixLQUFLdVUsSUFBTCxDQUFVdlUsQ0FBVixJQUFlLENBQTFDLEVBQTRDO0FBQ3hDSiw0QkFBUWlXLElBQVIsQ0FBYSxvQ0FBb0NsQyxZQUFZM1QsQ0FBWixDQUFwQyxHQUFxRCxHQUFsRSxFQUF1RSxnQkFBdkU7QUFDSDtBQUNKO0FBQ0oiLCJmaWxlIjoiZ2xjdWJpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhY2U1MDllMjMwYmFjNzgzOWM4ZSIsIlxyXG4vKlxyXG4gKiBzdGVwIDE6IGxldCBhID0gbmV3IEF1ZGlvQ3RyKGJnbUdhaW5WYWx1ZSwgc291bmRHYWluVmFsdWUpIDwtIGZsb2F0KDAgdG8gMSlcclxuICogc3RlcCAyOiBhLmxvYWQodXJsLCBpbmRleCwgbG9vcCwgYmFja2dyb3VuZCkgPC0gc3RyaW5nLCBpbnQsIGJvb2xlYW4sIGJvb2xlYW5cclxuICogc3RlcCAzOiBhLnNyY1tpbmRleF0ubG9hZGVkIHRoZW4gYS5zcmNbaW5kZXhdLnBsYXkoKVxyXG4gKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvQ3RyIHtcclxuICAgIGNvbnN0cnVjdG9yKGJnbUdhaW5WYWx1ZSwgc291bmRHYWluVmFsdWUpe1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0eXBlb2YgQXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiB3ZWJraXRBdWRpb0NvbnRleHQgIT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICApe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgQXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4ID0gbmV3IHdlYmtpdEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29tcCA9IHRoaXMuY3R4LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXAuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5iZ21HYWluLmNvbm5lY3QodGhpcy5jb21wKTtcclxuICAgICAgICAgICAgdGhpcy5iZ21HYWluLmdhaW4udmFsdWUgPSBiZ21HYWluVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluLmdhaW4udmFsdWUgPSBzb3VuZEdhaW5WYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zcmMgPSBbXTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQodXJsLCBpbmRleCwgbG9vcCwgYmFja2dyb3VuZCwgY2FsbGJhY2spe1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZ2FpbiA9IGJhY2tncm91bmQgPyB0aGlzLmJnbUdhaW4gOiB0aGlzLnNvdW5kR2FpbjtcclxuICAgICAgICBsZXQgc3JjID0gdGhpcy5zcmM7XHJcbiAgICAgICAgc3JjW2luZGV4XSA9IG51bGw7XHJcbiAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhtbC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICduby1jYWNoZScpO1xyXG4gICAgICAgIHhtbC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gICAgICAgIHhtbC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5kZWNvZGVBdWRpb0RhdGEoeG1sLnJlc3BvbnNlLCAoYnVmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdID0gbmV3IEF1ZGlvU3JjKGN0eCwgZ2FpbiwgYnVmLCBsb29wLCBiYWNrZ3JvdW5kKTtcclxuICAgICAgICAgICAgICAgIHNyY1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIGF1ZGlvIG51bWJlcjogJWMnICsgaW5kZXggKyAnJWMsIGF1ZGlvIGxvYWRlZDogJWMnICsgdXJsLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9LCAoZSkgPT4ge2NvbnNvbGUubG9nKGUpO30pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeG1sLnNlbmQoKTtcclxuICAgIH1cclxuICAgIGxvYWRDb21wbGV0ZSgpe1xyXG4gICAgICAgIGxldCBpLCBmO1xyXG4gICAgICAgIGYgPSB0cnVlO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuc3JjLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgZiA9IGYgJiYgKHRoaXMuc3JjW2ldICE9IG51bGwpICYmIHRoaXMuc3JjW2ldLmxvYWRlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGY7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEF1ZGlvU3JjIHtcclxuICAgIGNvbnN0cnVjdG9yKGN0eCwgZ2FpbiwgYXVkaW9CdWZmZXIsIGxvb3AsIGJhY2tncm91bmQpe1xyXG4gICAgICAgIHRoaXMuY3R4ICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gY3R4O1xyXG4gICAgICAgIHRoaXMuZ2FpbiAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZ2FpbjtcclxuICAgICAgICB0aGlzLmF1ZGlvQnVmZmVyICAgICAgICAgICAgICAgICAgICA9IGF1ZGlvQnVmZmVyO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlICAgICAgICAgICAgICAgICAgID0gW107XHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgICAgICAgICAgICAgPSAwO1xyXG4gICAgICAgIHRoaXMubG9vcCAgICAgICAgICAgICAgICAgICAgICAgICAgID0gbG9vcDtcclxuICAgICAgICB0aGlzLmxvYWRlZCAgICAgICAgICAgICAgICAgICAgICAgICA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmZ0TG9vcCAgICAgICAgICAgICAgICAgICAgICAgID0gMTY7XHJcbiAgICAgICAgdGhpcy51cGRhdGUgICAgICAgICAgICAgICAgICAgICAgICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgICAgICAgICAgICAgICAgICAgICA9IGJhY2tncm91bmQ7XHJcbiAgICAgICAgdGhpcy5ub2RlICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB0aGlzLmN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMjA0OCwgMSwgMSk7XHJcbiAgICAgICAgdGhpcy5hbmFseXNlciAgICAgICAgICAgICAgICAgICAgICAgPSB0aGlzLmN0eC5jcmVhdGVBbmFseXNlcigpO1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44O1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIuZmZ0U2l6ZSAgICAgICAgICAgICAgID0gdGhpcy5mZnRMb29wICogMjtcclxuICAgICAgICB0aGlzLm9uRGF0YSAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBVaW50OEFycmF5KHRoaXMuYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkoKXtcclxuICAgICAgICBsZXQgaSwgaiwgaztcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaSA9IHRoaXMuYnVmZmVyU291cmNlLmxlbmd0aDtcclxuICAgICAgICBrID0gLTE7XHJcbiAgICAgICAgaWYoaSA+IDApe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBpOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuYnVmZmVyU291cmNlW2pdLnBsYXlub3cpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2pdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtqXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBqO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGsgPCAwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW3RoaXMuYnVmZmVyU291cmNlLmxlbmd0aF0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgICAgIGsgPSB0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlWzBdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgIGsgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFjdGl2ZUJ1ZmZlclNvdXJjZSA9IGs7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uYnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlcjtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5sb29wID0gdGhpcy5sb29wO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnBsYXliYWNrUmF0ZS52YWx1ZSA9IDEuMDtcclxuICAgICAgICBpZighdGhpcy5sb29wKXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ub25lbmRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheW5vdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmJhY2tncm91bmQpe1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5jb25uZWN0KHRoaXMuYW5hbHlzZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VyLmNvbm5lY3QodGhpcy5ub2RlKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub25hdWRpb3Byb2Nlc3MgPSAoZXZlKSA9PiB7b25wcm9jZXNzRXZlbnQoZXZlKTt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5jb25uZWN0KHRoaXMuZ2Fpbik7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uc3RhcnQoMCk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ucGxheW5vdyA9IHRydWU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9ucHJvY2Vzc0V2ZW50KGV2ZSl7XHJcbiAgICAgICAgICAgIGlmKHNlbGYudXBkYXRlKXtcclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKHNlbGYub25EYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0b3AoKXtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmFjdGl2ZUJ1ZmZlclNvdXJjZV0uc3RvcCgwKTtcclxuICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzQXVkaW8uanMiLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzTWF0aCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMudmVjMyA9IHZlYzM7XHJcbiAgICAgICAgdGhpcy5tYXQ0ID0gbWF0NDtcclxuICAgICAgICB0aGlzLnF0biAgPSBxdG47XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1hdDQge1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpZGVudGl0eShkZXN0KXtcclxuICAgICAgICBkZXN0WzBdICA9IDE7IGRlc3RbMV0gID0gMDsgZGVzdFsyXSAgPSAwOyBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSAwOyBkZXN0WzVdICA9IDE7IGRlc3RbNl0gID0gMDsgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gMDsgZGVzdFs5XSAgPSAwOyBkZXN0WzEwXSA9IDE7IGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IDA7IGRlc3RbMTNdID0gMDsgZGVzdFsxNF0gPSAwOyBkZXN0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0MSwgbWF0MiwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGEgPSBtYXQxWzBdLCAgYiA9IG1hdDFbMV0sICBjID0gbWF0MVsyXSwgIGQgPSBtYXQxWzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0MVs0XSwgIGYgPSBtYXQxWzVdLCAgZyA9IG1hdDFbNl0sICBoID0gbWF0MVs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdDFbOF0sICBqID0gbWF0MVs5XSwgIGsgPSBtYXQxWzEwXSwgbCA9IG1hdDFbMTFdLFxyXG4gICAgICAgICAgICBtID0gbWF0MVsxMl0sIG4gPSBtYXQxWzEzXSwgbyA9IG1hdDFbMTRdLCBwID0gbWF0MVsxNV0sXHJcbiAgICAgICAgICAgIEEgPSBtYXQyWzBdLCAgQiA9IG1hdDJbMV0sICBDID0gbWF0MlsyXSwgIEQgPSBtYXQyWzNdLFxyXG4gICAgICAgICAgICBFID0gbWF0Mls0XSwgIEYgPSBtYXQyWzVdLCAgRyA9IG1hdDJbNl0sICBIID0gbWF0Mls3XSxcclxuICAgICAgICAgICAgSSA9IG1hdDJbOF0sICBKID0gbWF0Mls5XSwgIEsgPSBtYXQyWzEwXSwgTCA9IG1hdDJbMTFdLFxyXG4gICAgICAgICAgICBNID0gbWF0MlsxMl0sIE4gPSBtYXQyWzEzXSwgTyA9IG1hdDJbMTRdLCBQID0gbWF0MlsxNV07XHJcbiAgICAgICAgZGVzdFswXSAgPSBBICogYSArIEIgKiBlICsgQyAqIGkgKyBEICogbTtcclxuICAgICAgICBkZXN0WzFdICA9IEEgKiBiICsgQiAqIGYgKyBDICogaiArIEQgKiBuO1xyXG4gICAgICAgIGRlc3RbMl0gID0gQSAqIGMgKyBCICogZyArIEMgKiBrICsgRCAqIG87XHJcbiAgICAgICAgZGVzdFszXSAgPSBBICogZCArIEIgKiBoICsgQyAqIGwgKyBEICogcDtcclxuICAgICAgICBkZXN0WzRdICA9IEUgKiBhICsgRiAqIGUgKyBHICogaSArIEggKiBtO1xyXG4gICAgICAgIGRlc3RbNV0gID0gRSAqIGIgKyBGICogZiArIEcgKiBqICsgSCAqIG47XHJcbiAgICAgICAgZGVzdFs2XSAgPSBFICogYyArIEYgKiBnICsgRyAqIGsgKyBIICogbztcclxuICAgICAgICBkZXN0WzddICA9IEUgKiBkICsgRiAqIGggKyBHICogbCArIEggKiBwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gSSAqIGEgKyBKICogZSArIEsgKiBpICsgTCAqIG07XHJcbiAgICAgICAgZGVzdFs5XSAgPSBJICogYiArIEogKiBmICsgSyAqIGogKyBMICogbjtcclxuICAgICAgICBkZXN0WzEwXSA9IEkgKiBjICsgSiAqIGcgKyBLICogayArIEwgKiBvO1xyXG4gICAgICAgIGRlc3RbMTFdID0gSSAqIGQgKyBKICogaCArIEsgKiBsICsgTCAqIHA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSBNICogYSArIE4gKiBlICsgTyAqIGkgKyBQICogbTtcclxuICAgICAgICBkZXN0WzEzXSA9IE0gKiBiICsgTiAqIGYgKyBPICogaiArIFAgKiBuO1xyXG4gICAgICAgIGRlc3RbMTRdID0gTSAqIGMgKyBOICogZyArIE8gKiBrICsgUCAqIG87XHJcbiAgICAgICAgZGVzdFsxNV0gPSBNICogZCArIE4gKiBoICsgTyAqIGwgKyBQICogcDtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2FsZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSAgPSBtYXRbMF0gICogdmVjWzBdO1xyXG4gICAgICAgIGRlc3RbMV0gID0gbWF0WzFdICAqIHZlY1swXTtcclxuICAgICAgICBkZXN0WzJdICA9IG1hdFsyXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgZGVzdFszXSAgPSBtYXRbM10gICogdmVjWzBdO1xyXG4gICAgICAgIGRlc3RbNF0gID0gbWF0WzRdICAqIHZlY1sxXTtcclxuICAgICAgICBkZXN0WzVdICA9IG1hdFs1XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgZGVzdFs2XSAgPSBtYXRbNl0gICogdmVjWzFdO1xyXG4gICAgICAgIGRlc3RbN10gID0gbWF0WzddICAqIHZlY1sxXTtcclxuICAgICAgICBkZXN0WzhdICA9IG1hdFs4XSAgKiB2ZWNbMl07XHJcbiAgICAgICAgZGVzdFs5XSAgPSBtYXRbOV0gICogdmVjWzJdO1xyXG4gICAgICAgIGRlc3RbMTBdID0gbWF0WzEwXSAqIHZlY1syXTtcclxuICAgICAgICBkZXN0WzExXSA9IG1hdFsxMV0gKiB2ZWNbMl07XHJcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xyXG4gICAgICAgIGRlc3RbMTNdID0gbWF0WzEzXTtcclxuICAgICAgICBkZXN0WzE0XSA9IG1hdFsxNF07XHJcbiAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTsgZGVzdFsxXSA9IG1hdFsxXTsgZGVzdFsyXSAgPSBtYXRbMl07ICBkZXN0WzNdICA9IG1hdFszXTtcclxuICAgICAgICBkZXN0WzRdID0gbWF0WzRdOyBkZXN0WzVdID0gbWF0WzVdOyBkZXN0WzZdICA9IG1hdFs2XTsgIGRlc3RbN10gID0gbWF0WzddO1xyXG4gICAgICAgIGRlc3RbOF0gPSBtYXRbOF07IGRlc3RbOV0gPSBtYXRbOV07IGRlc3RbMTBdID0gbWF0WzEwXTsgZGVzdFsxMV0gPSBtYXRbMTFdO1xyXG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICAqIHZlY1syXSArIG1hdFsxMl07XHJcbiAgICAgICAgZGVzdFsxM10gPSBtYXRbMV0gKiB2ZWNbMF0gKyBtYXRbNV0gKiB2ZWNbMV0gKyBtYXRbOV0gICogdmVjWzJdICsgbWF0WzEzXTtcclxuICAgICAgICBkZXN0WzE0XSA9IG1hdFsyXSAqIHZlY1swXSArIG1hdFs2XSAqIHZlY1sxXSArIG1hdFsxMF0gKiB2ZWNbMl0gKyBtYXRbMTRdO1xyXG4gICAgICAgIGRlc3RbMTVdID0gbWF0WzNdICogdmVjWzBdICsgbWF0WzddICogdmVjWzFdICsgbWF0WzExXSAqIHZlY1syXSArIG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlKG1hdCwgYW5nbGUsIGF4aXMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBzcSA9IE1hdGguc3FydChheGlzWzBdICogYXhpc1swXSArIGF4aXNbMV0gKiBheGlzWzFdICsgYXhpc1syXSAqIGF4aXNbMl0pO1xyXG4gICAgICAgIGlmKCFzcSl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xyXG4gICAgICAgIGlmKHNxICE9IDEpe3NxID0gMSAvIHNxOyBhICo9IHNxOyBiICo9IHNxOyBjICo9IHNxO31cclxuICAgICAgICBsZXQgZCA9IE1hdGguc2luKGFuZ2xlKSwgZSA9IE1hdGguY29zKGFuZ2xlKSwgZiA9IDEgLSBlLFxyXG4gICAgICAgICAgICBnID0gbWF0WzBdLCAgaCA9IG1hdFsxXSwgaSA9IG1hdFsyXSwgIGogPSBtYXRbM10sXHJcbiAgICAgICAgICAgIGsgPSBtYXRbNF0sICBsID0gbWF0WzVdLCBtID0gbWF0WzZdLCAgbiA9IG1hdFs3XSxcclxuICAgICAgICAgICAgbyA9IG1hdFs4XSwgIHAgPSBtYXRbOV0sIHEgPSBtYXRbMTBdLCByID0gbWF0WzExXSxcclxuICAgICAgICAgICAgcyA9IGEgKiBhICogZiArIGUsXHJcbiAgICAgICAgICAgIHQgPSBiICogYSAqIGYgKyBjICogZCxcclxuICAgICAgICAgICAgdSA9IGMgKiBhICogZiAtIGIgKiBkLFxyXG4gICAgICAgICAgICB2ID0gYSAqIGIgKiBmIC0gYyAqIGQsXHJcbiAgICAgICAgICAgIHcgPSBiICogYiAqIGYgKyBlLFxyXG4gICAgICAgICAgICB4ID0gYyAqIGIgKiBmICsgYSAqIGQsXHJcbiAgICAgICAgICAgIHkgPSBhICogYyAqIGYgKyBiICogZCxcclxuICAgICAgICAgICAgeiA9IGIgKiBjICogZiAtIGEgKiBkLFxyXG4gICAgICAgICAgICBBID0gYyAqIGMgKiBmICsgZTtcclxuICAgICAgICBpZihhbmdsZSl7XHJcbiAgICAgICAgICAgIGlmKG1hdCAhPSBkZXN0KXtcclxuICAgICAgICAgICAgICAgIGRlc3RbMTJdID0gbWF0WzEyXTsgZGVzdFsxM10gPSBtYXRbMTNdO1xyXG4gICAgICAgICAgICAgICAgZGVzdFsxNF0gPSBtYXRbMTRdOyBkZXN0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZXN0ID0gbWF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXN0WzBdICA9IGcgKiBzICsgayAqIHQgKyBvICogdTtcclxuICAgICAgICBkZXN0WzFdICA9IGggKiBzICsgbCAqIHQgKyBwICogdTtcclxuICAgICAgICBkZXN0WzJdICA9IGkgKiBzICsgbSAqIHQgKyBxICogdTtcclxuICAgICAgICBkZXN0WzNdICA9IGogKiBzICsgbiAqIHQgKyByICogdTtcclxuICAgICAgICBkZXN0WzRdICA9IGcgKiB2ICsgayAqIHcgKyBvICogeDtcclxuICAgICAgICBkZXN0WzVdICA9IGggKiB2ICsgbCAqIHcgKyBwICogeDtcclxuICAgICAgICBkZXN0WzZdICA9IGkgKiB2ICsgbSAqIHcgKyBxICogeDtcclxuICAgICAgICBkZXN0WzddICA9IGogKiB2ICsgbiAqIHcgKyByICogeDtcclxuICAgICAgICBkZXN0WzhdICA9IGcgKiB5ICsgayAqIHogKyBvICogQTtcclxuICAgICAgICBkZXN0WzldICA9IGggKiB5ICsgbCAqIHogKyBwICogQTtcclxuICAgICAgICBkZXN0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcclxuICAgICAgICBkZXN0WzExXSA9IGogKiB5ICsgbiAqIHogKyByICogQTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBsb29rQXQoZXllLCBjZW50ZXIsIHVwLCBkZXN0KXtcclxuICAgICAgICBsZXQgZXllWCAgICA9IGV5ZVswXSwgICAgZXllWSAgICA9IGV5ZVsxXSwgICAgZXllWiAgICA9IGV5ZVsyXSxcclxuICAgICAgICAgICAgdXBYICAgICA9IHVwWzBdLCAgICAgdXBZICAgICA9IHVwWzFdLCAgICAgdXBaICAgICA9IHVwWzJdLFxyXG4gICAgICAgICAgICBjZW50ZXJYID0gY2VudGVyWzBdLCBjZW50ZXJZID0gY2VudGVyWzFdLCBjZW50ZXJaID0gY2VudGVyWzJdO1xyXG4gICAgICAgIGlmKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKXtyZXR1cm4gTWF0NC5pZGVudGl0eShkZXN0KTt9XHJcbiAgICAgICAgbGV0IHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGw7XHJcbiAgICAgICAgejAgPSBleWVYIC0gY2VudGVyWzBdOyB6MSA9IGV5ZVkgLSBjZW50ZXJbMV07IHoyID0gZXllWiAtIGNlbnRlclsyXTtcclxuICAgICAgICBsID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xyXG4gICAgICAgIHowICo9IGw7IHoxICo9IGw7IHoyICo9IGw7XHJcbiAgICAgICAgeDAgPSB1cFkgKiB6MiAtIHVwWiAqIHoxO1xyXG4gICAgICAgIHgxID0gdXBaICogejAgLSB1cFggKiB6MjtcclxuICAgICAgICB4MiA9IHVwWCAqIHoxIC0gdXBZICogejA7XHJcbiAgICAgICAgbCA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xyXG4gICAgICAgIGlmKCFsKXtcclxuICAgICAgICAgICAgeDAgPSAwOyB4MSA9IDA7IHgyID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIHgwICo9IGw7IHgxICo9IGw7IHgyICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHkwID0gejEgKiB4MiAtIHoyICogeDE7IHkxID0gejIgKiB4MCAtIHowICogeDI7IHkyID0gejAgKiB4MSAtIHoxICogeDA7XHJcbiAgICAgICAgbCA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xyXG4gICAgICAgIGlmKCFsKXtcclxuICAgICAgICAgICAgeTAgPSAwOyB5MSA9IDA7IHkyID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIHkwICo9IGw7IHkxICo9IGw7IHkyICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlc3RbMF0gPSB4MDsgZGVzdFsxXSA9IHkwOyBkZXN0WzJdICA9IHowOyBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSA9IHgxOyBkZXN0WzVdID0geTE7IGRlc3RbNl0gID0gejE7IGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdID0geDI7IGRlc3RbOV0gPSB5MjsgZGVzdFsxMF0gPSB6MjsgZGVzdFsxMV0gPSAwO1xyXG4gICAgICAgIGRlc3RbMTJdID0gLSh4MCAqIGV5ZVggKyB4MSAqIGV5ZVkgKyB4MiAqIGV5ZVopO1xyXG4gICAgICAgIGRlc3RbMTNdID0gLSh5MCAqIGV5ZVggKyB5MSAqIGV5ZVkgKyB5MiAqIGV5ZVopO1xyXG4gICAgICAgIGRlc3RbMTRdID0gLSh6MCAqIGV5ZVggKyB6MSAqIGV5ZVkgKyB6MiAqIGV5ZVopO1xyXG4gICAgICAgIGRlc3RbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgZGVzdCl7XHJcbiAgICAgICAgbGV0IHQgPSBuZWFyICogTWF0aC50YW4oZm92eSAqIE1hdGguUEkgLyAzNjApO1xyXG4gICAgICAgIGxldCByID0gdCAqIGFzcGVjdDtcclxuICAgICAgICBsZXQgYSA9IHIgKiAyLCBiID0gdCAqIDIsIGMgPSBmYXIgLSBuZWFyO1xyXG4gICAgICAgIGRlc3RbMF0gID0gbmVhciAqIDIgLyBhO1xyXG4gICAgICAgIGRlc3RbMV0gID0gMDtcclxuICAgICAgICBkZXN0WzJdICA9IDA7XHJcbiAgICAgICAgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0gMDtcclxuICAgICAgICBkZXN0WzVdICA9IG5lYXIgKiAyIC8gYjtcclxuICAgICAgICBkZXN0WzZdICA9IDA7XHJcbiAgICAgICAgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gMDtcclxuICAgICAgICBkZXN0WzldICA9IDA7XHJcbiAgICAgICAgZGVzdFsxMF0gPSAtKGZhciArIG5lYXIpIC8gYztcclxuICAgICAgICBkZXN0WzExXSA9IC0xO1xyXG4gICAgICAgIGRlc3RbMTJdID0gMDtcclxuICAgICAgICBkZXN0WzEzXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxNF0gPSAtKGZhciAqIG5lYXIgKiAyKSAvIGM7XHJcbiAgICAgICAgZGVzdFsxNV0gPSAwO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9ydGhvKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyLCBkZXN0KSB7XHJcbiAgICAgICAgbGV0IGggPSAocmlnaHQgLSBsZWZ0KTtcclxuICAgICAgICBsZXQgdiA9ICh0b3AgLSBib3R0b20pO1xyXG4gICAgICAgIGxldCBkID0gKGZhciAtIG5lYXIpO1xyXG4gICAgICAgIGRlc3RbMF0gID0gMiAvIGg7XHJcbiAgICAgICAgZGVzdFsxXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbMl0gID0gMDtcclxuICAgICAgICBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNV0gID0gMiAvIHY7XHJcbiAgICAgICAgZGVzdFs2XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IDA7XHJcbiAgICAgICAgZGVzdFs5XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbMTBdID0gLTIgLyBkO1xyXG4gICAgICAgIGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIGg7XHJcbiAgICAgICAgZGVzdFsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB2O1xyXG4gICAgICAgIGRlc3RbMTRdID0gLShmYXIgKyBuZWFyKSAvIGQ7XHJcbiAgICAgICAgZGVzdFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zcG9zZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gID0gbWF0WzBdOyAgZGVzdFsxXSAgPSBtYXRbNF07XHJcbiAgICAgICAgZGVzdFsyXSAgPSBtYXRbOF07ICBkZXN0WzNdICA9IG1hdFsxMl07XHJcbiAgICAgICAgZGVzdFs0XSAgPSBtYXRbMV07ICBkZXN0WzVdICA9IG1hdFs1XTtcclxuICAgICAgICBkZXN0WzZdICA9IG1hdFs5XTsgIGRlc3RbN10gID0gbWF0WzEzXTtcclxuICAgICAgICBkZXN0WzhdICA9IG1hdFsyXTsgIGRlc3RbOV0gID0gbWF0WzZdO1xyXG4gICAgICAgIGRlc3RbMTBdID0gbWF0WzEwXTsgZGVzdFsxMV0gPSBtYXRbMTRdO1xyXG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzNdOyAgZGVzdFsxM10gPSBtYXRbN107XHJcbiAgICAgICAgZGVzdFsxNF0gPSBtYXRbMTFdOyBkZXN0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaW52ZXJzZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBhID0gbWF0WzBdLCAgYiA9IG1hdFsxXSwgIGMgPSBtYXRbMl0sICBkID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0WzRdLCAgZiA9IG1hdFs1XSwgIGcgPSBtYXRbNl0sICBoID0gbWF0WzddLFxyXG4gICAgICAgICAgICBpID0gbWF0WzhdLCAgaiA9IG1hdFs5XSwgIGsgPSBtYXRbMTBdLCBsID0gbWF0WzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV0sXHJcbiAgICAgICAgICAgIHEgPSBhICogZiAtIGIgKiBlLCByID0gYSAqIGcgLSBjICogZSxcclxuICAgICAgICAgICAgcyA9IGEgKiBoIC0gZCAqIGUsIHQgPSBiICogZyAtIGMgKiBmLFxyXG4gICAgICAgICAgICB1ID0gYiAqIGggLSBkICogZiwgdiA9IGMgKiBoIC0gZCAqIGcsXHJcbiAgICAgICAgICAgIHcgPSBpICogbiAtIGogKiBtLCB4ID0gaSAqIG8gLSBrICogbSxcclxuICAgICAgICAgICAgeSA9IGkgKiBwIC0gbCAqIG0sIHogPSBqICogbyAtIGsgKiBuLFxyXG4gICAgICAgICAgICBBID0gaiAqIHAgLSBsICogbiwgQiA9IGsgKiBwIC0gbCAqIG8sXHJcbiAgICAgICAgICAgIGl2ZCA9IDEgLyAocSAqIEIgLSByICogQSArIHMgKiB6ICsgdCAqIHkgLSB1ICogeCArIHYgKiB3KTtcclxuICAgICAgICBkZXN0WzBdICA9ICggZiAqIEIgLSBnICogQSArIGggKiB6KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzFdICA9ICgtYiAqIEIgKyBjICogQSAtIGQgKiB6KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzJdICA9ICggbiAqIHYgLSBvICogdSArIHAgKiB0KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzNdICA9ICgtaiAqIHYgKyBrICogdSAtIGwgKiB0KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzRdICA9ICgtZSAqIEIgKyBnICogeSAtIGggKiB4KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzVdICA9ICggYSAqIEIgLSBjICogeSArIGQgKiB4KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzZdICA9ICgtbSAqIHYgKyBvICogcyAtIHAgKiByKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzddICA9ICggaSAqIHYgLSBrICogcyArIGwgKiByKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzhdICA9ICggZSAqIEEgLSBmICogeSArIGggKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzldICA9ICgtYSAqIEEgKyBiICogeSAtIGQgKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzEwXSA9ICggbSAqIHUgLSBuICogcyArIHAgKiBxKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzExXSA9ICgtaSAqIHUgKyBqICogcyAtIGwgKiBxKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzEyXSA9ICgtZSAqIHogKyBmICogeCAtIGcgKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzEzXSA9ICggYSAqIHogLSBiICogeCArIGMgKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzE0XSA9ICgtbSAqIHQgKyBuICogciAtIG8gKiBxKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzE1XSA9ICggaSAqIHQgLSBqICogciArIGsgKiBxKSAqIGl2ZDtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyB2cEZyb21DYW1lcmEoY2FtLCB2bWF0LCBwbWF0LCBkZXN0KXtcclxuICAgICAgICBNYXQ0Lmxvb2tBdChjYW0ucG9zaXRpb24sIGNhbS5jZW50ZXJQb2ludCwgY2FtLnVwRGlyZWN0aW9uLCB2bWF0KTtcclxuICAgICAgICBNYXQ0LnBlcnNwZWN0aXZlKGNhbS5mb3Z5LCBjYW0uYXNwZWN0LCBjYW0ubmVhciwgY2FtLmZhciwgcG1hdCk7XHJcbiAgICAgICAgTWF0NC5tdWx0aXBseShwbWF0LCB2bWF0LCBkZXN0KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVmVjMyB7XHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKHYpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh2WzBdICogdlswXSArIHZbMV0gKiB2WzFdICsgdlsyXSAqIHZbMl0pO1xyXG4gICAgICAgIGlmKGwgPiAwKXtcclxuICAgICAgICAgICAgbGV0IGUgPSAxLjAgLyBsO1xyXG4gICAgICAgICAgICBuWzBdID0gdlswXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMV0gPSB2WzFdICogZTtcclxuICAgICAgICAgICAgblsyXSA9IHZbMl0gKiBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIHN0YXRpYyBkb3QodjAsIHYxKXtcclxuICAgICAgICByZXR1cm4gdjBbMF0gKiB2MVswXSArIHYwWzFdICogdjFbMV0gKyB2MFsyXSAqIHYxWzJdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNyb3NzKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIG5bMF0gPSB2MFsxXSAqIHYxWzJdIC0gdjBbMl0gKiB2MVsxXTtcclxuICAgICAgICBuWzFdID0gdjBbMl0gKiB2MVswXSAtIHYwWzBdICogdjFbMl07XHJcbiAgICAgICAgblsyXSA9IHYwWzBdICogdjFbMV0gLSB2MFsxXSAqIHYxWzBdO1xyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGZhY2VOb3JtYWwodjAsIHYxLCB2Mil7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCB2ZWMxID0gW3YxWzBdIC0gdjBbMF0sIHYxWzFdIC0gdjBbMV0sIHYxWzJdIC0gdjBbMl1dO1xyXG4gICAgICAgIGxldCB2ZWMyID0gW3YyWzBdIC0gdjBbMF0sIHYyWzFdIC0gdjBbMV0sIHYyWzJdIC0gdjBbMl1dO1xyXG4gICAgICAgIG5bMF0gPSB2ZWMxWzFdICogdmVjMlsyXSAtIHZlYzFbMl0gKiB2ZWMyWzFdO1xyXG4gICAgICAgIG5bMV0gPSB2ZWMxWzJdICogdmVjMlswXSAtIHZlYzFbMF0gKiB2ZWMyWzJdO1xyXG4gICAgICAgIG5bMl0gPSB2ZWMxWzBdICogdmVjMlsxXSAtIHZlYzFbMV0gKiB2ZWMyWzBdO1xyXG4gICAgICAgIHJldHVybiBWZWMzLm5vcm1hbGl6ZShuKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXRuIHtcclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpZGVudGl0eShkZXN0KXtcclxuICAgICAgICBkZXN0WzBdID0gMDsgZGVzdFsxXSA9IDA7IGRlc3RbMl0gPSAwOyBkZXN0WzNdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpbnZlcnNlKHF0biwgZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSA9IC1xdG5bMF07XHJcbiAgICAgICAgZGVzdFsxXSA9IC1xdG5bMV07XHJcbiAgICAgICAgZGVzdFsyXSA9IC1xdG5bMl07XHJcbiAgICAgICAgZGVzdFszXSA9ICBxdG5bM107XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKGRlc3Qpe1xyXG4gICAgICAgIGxldCB4ID0gZGVzdFswXSwgeSA9IGRlc3RbMV0sIHogPSBkZXN0WzJdLCB3ID0gZGVzdFszXTtcclxuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XHJcbiAgICAgICAgaWYobCA9PT0gMCl7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSAwO1xyXG4gICAgICAgICAgICBkZXN0WzFdID0gMDtcclxuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XHJcbiAgICAgICAgICAgIGRlc3RbM10gPSAwO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSB4ICogbDtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IHkgKiBsO1xyXG4gICAgICAgICAgICBkZXN0WzJdID0geiAqIGw7XHJcbiAgICAgICAgICAgIGRlc3RbM10gPSB3ICogbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkocXRuMSwgcXRuMiwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGF4ID0gcXRuMVswXSwgYXkgPSBxdG4xWzFdLCBheiA9IHF0bjFbMl0sIGF3ID0gcXRuMVszXTtcclxuICAgICAgICBsZXQgYnggPSBxdG4yWzBdLCBieSA9IHF0bjJbMV0sIGJ6ID0gcXRuMlsyXSwgYncgPSBxdG4yWzNdO1xyXG4gICAgICAgIGRlc3RbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xyXG4gICAgICAgIGRlc3RbMV0gPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6O1xyXG4gICAgICAgIGRlc3RbMl0gPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4O1xyXG4gICAgICAgIGRlc3RbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZShhbmdsZSwgYXhpcywgZGVzdCl7XHJcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XHJcbiAgICAgICAgaWYoIXNxKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XHJcbiAgICAgICAgaWYoc3EgIT0gMSl7c3EgPSAxIC8gc3E7IGEgKj0gc3E7IGIgKj0gc3E7IGMgKj0gc3E7fVxyXG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4oYW5nbGUgKiAwLjUpO1xyXG4gICAgICAgIGRlc3RbMF0gPSBhICogcztcclxuICAgICAgICBkZXN0WzFdID0gYiAqIHM7XHJcbiAgICAgICAgZGVzdFsyXSA9IGMgKiBzO1xyXG4gICAgICAgIGRlc3RbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdG9WZWNJSUkodmVjLCBxdG4sIGRlc3Qpe1xyXG4gICAgICAgIGxldCBxcCA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgcXEgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IHFyID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIFF0bi5pbnZlcnNlKHF0biwgcXIpO1xyXG4gICAgICAgIHFwWzBdID0gdmVjWzBdO1xyXG4gICAgICAgIHFwWzFdID0gdmVjWzFdO1xyXG4gICAgICAgIHFwWzJdID0gdmVjWzJdO1xyXG4gICAgICAgIFF0bi5tdWx0aXBseShxciwgcXAsIHFxKTtcclxuICAgICAgICBRdG4ubXVsdGlwbHkocXEsIHF0biwgcXIpO1xyXG4gICAgICAgIGRlc3RbMF0gPSBxclswXTtcclxuICAgICAgICBkZXN0WzFdID0gcXJbMV07XHJcbiAgICAgICAgZGVzdFsyXSA9IHFyWzJdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRvTWF0SVYocXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgeCA9IHF0blswXSwgeSA9IHF0blsxXSwgeiA9IHF0blsyXSwgdyA9IHF0blszXTtcclxuICAgICAgICBsZXQgeDIgPSB4ICsgeCwgeTIgPSB5ICsgeSwgejIgPSB6ICsgejtcclxuICAgICAgICBsZXQgeHggPSB4ICogeDIsIHh5ID0geCAqIHkyLCB4eiA9IHggKiB6MjtcclxuICAgICAgICBsZXQgeXkgPSB5ICogeTIsIHl6ID0geSAqIHoyLCB6eiA9IHogKiB6MjtcclxuICAgICAgICBsZXQgd3ggPSB3ICogeDIsIHd5ID0gdyAqIHkyLCB3eiA9IHcgKiB6MjtcclxuICAgICAgICBkZXN0WzBdICA9IDEgLSAoeXkgKyB6eik7XHJcbiAgICAgICAgZGVzdFsxXSAgPSB4eSAtIHd6O1xyXG4gICAgICAgIGRlc3RbMl0gID0geHogKyB3eTtcclxuICAgICAgICBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSB4eSArIHd6O1xyXG4gICAgICAgIGRlc3RbNV0gID0gMSAtICh4eCArIHp6KTtcclxuICAgICAgICBkZXN0WzZdICA9IHl6IC0gd3g7XHJcbiAgICAgICAgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0geHogLSB3eTtcclxuICAgICAgICBkZXN0WzldICA9IHl6ICsgd3g7XHJcbiAgICAgICAgZGVzdFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xyXG4gICAgICAgIGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxM10gPSAwO1xyXG4gICAgICAgIGRlc3RbMTRdID0gMDtcclxuICAgICAgICBkZXN0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2xlcnAocXRuMSwgcXRuMiwgdGltZSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGh0ID0gcXRuMVswXSAqIHF0bjJbMF0gKyBxdG4xWzFdICogcXRuMlsxXSArIHF0bjFbMl0gKiBxdG4yWzJdICsgcXRuMVszXSAqIHF0bjJbM107XHJcbiAgICAgICAgbGV0IGhzID0gMS4wIC0gaHQgKiBodDtcclxuICAgICAgICBpZihocyA8PSAwLjApe1xyXG4gICAgICAgICAgICBkZXN0WzBdID0gcXRuMVswXTtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV07XHJcbiAgICAgICAgICAgIGRlc3RbMl0gPSBxdG4xWzJdO1xyXG4gICAgICAgICAgICBkZXN0WzNdID0gcXRuMVszXTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xyXG4gICAgICAgICAgICBpZihNYXRoLmFicyhocykgPCAwLjAwMDEpe1xyXG4gICAgICAgICAgICAgICAgZGVzdFswXSA9IChxdG4xWzBdICogMC41ICsgcXRuMlswXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzFdID0gKHF0bjFbMV0gKiAwLjUgKyBxdG4yWzFdICogMC41KTtcclxuICAgICAgICAgICAgICAgIGRlc3RbMl0gPSAocXRuMVsyXSAqIDAuNSArIHF0bjJbMl0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgZGVzdFszXSA9IChxdG4xWzNdICogMC41ICsgcXRuMlszXSAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbGV0IHBoID0gTWF0aC5hY29zKGh0KTtcclxuICAgICAgICAgICAgICAgIGxldCBwdCA9IHBoICogdGltZTtcclxuICAgICAgICAgICAgICAgIGxldCB0MCA9IE1hdGguc2luKHBoIC0gcHQpIC8gaHM7XHJcbiAgICAgICAgICAgICAgICBsZXQgdDEgPSBNYXRoLnNpbihwdCkgLyBocztcclxuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdICogdDAgKyBxdG4yWzBdICogdDE7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzFdID0gcXRuMVsxXSAqIHQwICsgcXRuMlsxXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgZGVzdFsyXSA9IHF0bjFbMl0gKiB0MCArIHF0bjJbMl0gKiB0MTtcclxuICAgICAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdICogdDAgKyBxdG4yWzNdICogdDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzTWF0aC5qcyIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNNZXNoIHtcclxuICAgIHN0YXRpYyBwbGFuZSh3aWR0aCwgaGVpZ2h0LCBjb2xvcil7XHJcbiAgICAgICAgbGV0IHcsIGg7XHJcbiAgICAgICAgdyA9IHdpZHRoIC8gMjtcclxuICAgICAgICBoID0gaGVpZ2h0IC8gMjtcclxuICAgICAgICBpZihjb2xvcil7XHJcbiAgICAgICAgICAgIHRjID0gY29sb3I7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRjID0gWzEuMCwgMS4wLCAxLjAsIDEuMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwb3MgPSBbXHJcbiAgICAgICAgICAgIC13LCAgaCwgIDAuMCxcclxuICAgICAgICAgICAgIHcsICBoLCAgMC4wLFxyXG4gICAgICAgICAgICAtdywgLWgsICAwLjAsXHJcbiAgICAgICAgICAgICB3LCAtaCwgIDAuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IG5vciA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGNvbCA9IFtcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBzdCAgPSBbXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLFxyXG4gICAgICAgICAgICAxLjAsIDAuMCxcclxuICAgICAgICAgICAgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDEuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgaWR4ID0gW1xyXG4gICAgICAgICAgICAwLCAxLCAyLFxyXG4gICAgICAgICAgICAyLCAxLCAzXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdG9ydXMocm93LCBjb2x1bW4sIGlyYWQsIG9yYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnIgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ5ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcclxuICAgICAgICAgICAgICAgIGlmKHJ0ID4gMS4wKXtydCAtPSAxLjA7fVxyXG4gICAgICAgICAgICAgICAgcnQgPSAxLjAgLSBydDtcclxuICAgICAgICAgICAgICAgIHBvcy5wdXNoKHR4LCB0eSwgdHopO1xyXG4gICAgICAgICAgICAgICAgbm9yLnB1c2gocngsIHJ5LCByeik7XHJcbiAgICAgICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgICAgICAgICBzdC5wdXNoKHJzLCBydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICByID0gKGNvbHVtbiArIDEpICogaSArIGo7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMSwgciArIDEpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociArIGNvbHVtbiArIDEsIHIgKyBjb2x1bW4gKyAyLCByICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHNwaGVyZShyb3csIGNvbHVtbiwgcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJyID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XHJcbiAgICAgICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcclxuICAgICAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgciA9IDA7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICByID0gKGNvbHVtbiArIDEpICogaSArIGo7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgMSwgciArIGNvbHVtbiArIDIpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIGNvbHVtbiArIDIsIHIgKyBjb2x1bW4gKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY3ViZShzaWRlLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGhzID0gc2lkZSAqIDAuNTtcclxuICAgICAgICBsZXQgcG9zID0gW1xyXG4gICAgICAgICAgICAtaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsIC1ocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsICBocywgLWhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAgaHMsIC1ocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgLWhzXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbm9yID0gW1xyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAtMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLFxyXG4gICAgICAgICAgICAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAtMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgY29sID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHBvcy5sZW5ndGggLyAzOyBpKyspe1xyXG4gICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzdCA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGlkeCA9IFtcclxuICAgICAgICAgICAgIDAsICAxLCAgMiwgIDAsICAyLCAgMyxcclxuICAgICAgICAgICAgIDQsICA1LCAgNiwgIDQsICA2LCAgNyxcclxuICAgICAgICAgICAgIDgsICA5LCAxMCwgIDgsIDEwLCAxMSxcclxuICAgICAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSxcclxuICAgICAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSxcclxuICAgICAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyM1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNNZXNoLmpzIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM1V0aWwge1xyXG4gICAgc3RhdGljIGhzdmEoaCwgcywgdiwgYSl7XHJcbiAgICAgICAgaWYocyA+IDEgfHwgdiA+IDEgfHwgYSA+IDEpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IHRoID0gaCAlIDM2MDtcclxuICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IodGggLyA2MCk7XHJcbiAgICAgICAgbGV0IGYgPSB0aCAvIDYwIC0gaTtcclxuICAgICAgICBsZXQgbSA9IHYgKiAoMSAtIHMpO1xyXG4gICAgICAgIGxldCBuID0gdiAqICgxIC0gcyAqIGYpO1xyXG4gICAgICAgIGxldCBrID0gdiAqICgxIC0gcyAqICgxIC0gZikpO1xyXG4gICAgICAgIGxldCBjb2xvciA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIGlmKCFzID4gMCAmJiAhcyA8IDApe1xyXG4gICAgICAgICAgICBjb2xvci5wdXNoKHYsIHYsIHYsIGEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByID0gbmV3IEFycmF5KHYsIG4sIG0sIG0sIGssIHYpO1xyXG4gICAgICAgICAgICBsZXQgZyA9IG5ldyBBcnJheShrLCB2LCB2LCBuLCBtLCBtKTtcclxuICAgICAgICAgICAgbGV0IGIgPSBuZXcgQXJyYXkobSwgbSwgaywgdiwgdiwgbik7XHJcbiAgICAgICAgICAgIGNvbG9yLnB1c2gocltpXSwgZ1tpXSwgYltpXSwgYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgIH1cclxuICAgIHN0YXRpYyBlYXNlTGluZXIodCl7XHJcbiAgICAgICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGVhc2VPdXRDdWJpYyh0KXtcclxuICAgICAgICByZXR1cm4gKHQgPSB0IC8gMSAtIDEpICogdCAqIHQgKyAxO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGVhc2VRdWludGljKHQpe1xyXG4gICAgICAgIGxldCB0cyA9ICh0ID0gdCAvIDEpICogdDtcclxuICAgICAgICBsZXQgdGMgPSB0cyAqIHQ7XHJcbiAgICAgICAgcmV0dXJuICh0YyAqIHRzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM1V0aWwuanMiLCJcclxuaW1wb3J0IGF1ZGlvIGZyb20gJy4vZ2wzQXVkaW8uanMnO1xyXG5pbXBvcnQgbWF0aCAgZnJvbSAnLi9nbDNNYXRoLmpzJztcclxuaW1wb3J0IG1lc2ggIGZyb20gJy4vZ2wzTWVzaC5qcyc7XHJcbmltcG9ydCB1dGlsICBmcm9tICcuL2dsM1V0aWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgb3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5WRVJTSU9OID0gJzAuMC42JztcclxuICAgICAgICB0aGlzLlBJMiAgPSA2LjI4MzE4NTMwNzE3OTU4NjQ3NjkyNTI4Njc2NjU1OTAwNTc2O1xyXG4gICAgICAgIHRoaXMuUEkgICA9IDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg7XHJcbiAgICAgICAgdGhpcy5QSUggID0gMS41NzA3OTYzMjY3OTQ4OTY2MTkyMzEzMjE2OTE2Mzk3NTE0NDtcclxuICAgICAgICB0aGlzLlBJSDIgPSAwLjc4NTM5ODE2MzM5NzQ0ODMwOTYxNTY2MDg0NTgxOTg3NTcyO1xyXG4gICAgICAgIHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UID0gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgZ2xDdWJpYy5qcyAlY+KXhiVjIDogdmVyc2lvbiAlYycgKyBnbDMuVkVSU0lPTiwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IHJveWFsYmx1ZScpO1xyXG5cclxuICAgICAgICB0aGlzLnJlYWR5ICAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5nbCAgICAgICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5leHQgICAgICA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuQXVkaW8gICA9IGF1ZGlvO1xyXG4gICAgICAgIHRoaXMuQ3JlYXRvciA9IGNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5NYXRoICAgID0gbWF0aDtcclxuICAgICAgICB0aGlzLk1lc2ggICAgPSBtZXNoO1xyXG4gICAgICAgIHRoaXMuVXRpbCAgICA9IHV0aWw7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChjYW52YXMsIG9wdGlvbnMpe1xyXG4gICAgICAgIGxldCBvcHQgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgICBpZihjYW52YXMgPT0gbnVsbCl7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICBpZihjYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1lbHNlIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjYW52YXMpID09PSAnW29iamVjdCBTdHJpbmddJyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jYW52YXMgPT0gbnVsbCl7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCBvcHQpIHx8XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdCk7XHJcbiAgICAgICAgaWYodGhpcy5nbCAhPSBudWxsKXtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXMgPSBuZXcgQXJyYXkodGhpcy5URVhUVVJFX1VOSVRfQ09VTlQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBzY2VuZUNsZWFyKGNvbG9yLCBkZXB0aCwgc3RlbmNpbCl7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgZmxnID0gZ2wuQ09MT1JfQlVGRkVSX0JJVDtcclxuICAgICAgICBnbC5jbGVhckNvbG9yKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICBpZihkZXB0aCAhPSBudWxsKXtcclxuICAgICAgICAgICAgZ2wuY2xlYXJEZXB0aChkZXB0aCk7XHJcbiAgICAgICAgICAgIGZsZyA9IGZsZyB8IGdsLkRFUFRIX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0ZW5jaWwgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGdsLmNsZWFyU3RlbmNpbChzdGVuY2lsKTtcclxuICAgICAgICAgICAgZmxnID0gZmxnIHwgZ2wuU1RFTkNJTF9CVUZGRVJfQklUO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5jbGVhcihmbGcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNjZW5lVmlldyhjYW1lcmEsIHgsIHksIHdpZHRoLCBoZWlnaHQpe1xyXG4gICAgICAgIGxldCBYID0geCB8fCAwO1xyXG4gICAgICAgIGxldCBZID0geSB8fCAwO1xyXG4gICAgICAgIGxldCB3ID0gd2lkdGggIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIGxldCBoID0gaGVpZ2h0IHx8IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICB0aGlzLmdsLnZpZXdwb3J0KFgsIFksIHcsIGgpO1xyXG4gICAgICAgIGlmKGNhbWVyYSAhPSBudWxsKXtjYW1lcmEuYXNwZWN0ID0gdyAvIGg7fVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBcnJheXMocHJpbWl0aXZlLCB2ZXJ0ZXhDb3VudCl7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHByaW1pdGl2ZSwgMCwgdmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoKXtcclxuICAgICAgICB0aGlzLmdsLmRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVWYm8oZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCB2Ym8gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmJvKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIHZibztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJYm8oZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBpYm8gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgSW50MTZBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiBpYm87XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGV4dHVyZShzb3VyY2UsIG51bWJlciwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHNvdXJjZSA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcclxuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWcpO1xyXG4gICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5SRVBFQVQpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5SRVBFQVQpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgaW1hZ2UgbG9hZGVkOiAlYycgKyBzb3VyY2UsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrICE9IG51bGwpe2NhbGxiYWNrKG51bWJlcik7fVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW1nLnNyYyA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVUZXh0dXJlQ2FudmFzKGNhbnZhcywgbnVtYmVyKXtcclxuICAgICAgICBpZihjYW52YXMgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBjYW52YXMpO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLlJFUEVBVCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuUkVQRUFUKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgY2FudmFzIGF0dGFjaGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlcih3aWR0aCwgaGVpZ2h0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjcmVhdGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRnJhbWVidWZmZXJDdWJlKHdpZHRoLCBoZWlnaHQsIHRhcmdldCwgbnVtYmVyKXtcclxuICAgICAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGxldCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGRlcHRoUmVuZGVyQnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBsZXQgZlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZlRleHR1cmUpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKHRhcmdldFtpXSwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFX0NVQkVfTUFQO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGN1YmUgY3JlYXRlZCcsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICAgICAgcmV0dXJuIHtmcmFtZWJ1ZmZlcjogZnJhbWVCdWZmZXIsIGRlcHRoUmVuZGVyYnVmZmVyOiBkZXB0aFJlbmRlckJ1ZmZlciwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVRleHR1cmVDdWJlKHNvdXJjZSwgdGFyZ2V0LCBudW1iZXIsIGNhbGxiYWNrKXtcclxuICAgICAgICBpZihzb3VyY2UgPT0gbnVsbCB8fCB0YXJnZXQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgY0ltZyA9IFtdO1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjSW1nW2ldID0ge2ltYWdlOiBuZXcgSW1hZ2UoKSwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgICAgIGNJbWdbaV0uaW1hZ2Uub25sb2FkID0gKChpbmRleCkgPT4ge3JldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjSW1nW2luZGV4XS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYoY0ltZy5sZW5ndGggPT09IDYpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjSW1nLm1hcCgodikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gZiAmJiB2LmxvYWRlZDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZihmID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHNvdXJjZS5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKHRhcmdldFtqXSwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgY0ltZ1tqXS5pbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFX0NVQkVfTUFQO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgaW1hZ2UgbG9hZGVkOiAlYycgKyBzb3VyY2VbMF0gKyAnLi4uJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2FsbGJhY2sgIT0gbnVsbCl7Y2FsbGJhY2sobnVtYmVyKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O30pKGkpO1xyXG4gICAgICAgICAgICBjSW1nW2ldLmltYWdlLnNyYyA9IHNvdXJjZVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmluZFRleHR1cmUodW5pdCwgbnVtYmVyKXtcclxuICAgICAgICBpZih0aGlzLnRleHR1cmVzW251bWJlcl0gPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmFjdGl2ZVRleHR1cmUodGhpcy5nbC5URVhUVVJFMCArIHVuaXQpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUsIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBpc1RleHR1cmVMb2FkZWQoKXtcclxuICAgICAgICBsZXQgaSwgaiwgZiwgZztcclxuICAgICAgICBmID0gdHJ1ZTsgZyA9IGZhbHNlO1xyXG4gICAgICAgIGZvcihpID0gMCwgaiA9IHRoaXMudGV4dHVyZXMubGVuZ3RoOyBpIDwgajsgaSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy50ZXh0dXJlc1tpXSAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIGcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZiA9IGYgJiYgdGhpcy50ZXh0dXJlc1tpXS5sb2FkZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZyl7cmV0dXJuIGY7fWVsc2V7cmV0dXJuIGZhbHNlO31cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUlkKHZzSWQsIGZzSWQsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wpO1xyXG4gICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tSWQodnNJZCk7XHJcbiAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21JZChmc0lkKTtcclxuICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgbW5nLmF0dFMgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihtbmcucHJnLCBhdHRMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pTCA9IG5ldyBBcnJheSh1bmlMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihtbmcucHJnLCB1bmlMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICBtbmcubG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pO1xyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvZ3JhbUZyb21Tb3VyY2UodnMsIGZzLCBhdHRMb2NhdGlvbiwgYXR0U3RyaWRlLCB1bmlMb2NhdGlvbiwgdW5pVHlwZSl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsKTtcclxuICAgICAgICBtbmcudnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZSh2cywgdGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShmcywgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLmF0dExbaV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcudW5pTFtpXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUZpbGUodnNVcmwsIGZzVXJsLCBhdHRMb2NhdGlvbiwgYXR0U3RyaWRlLCB1bmlMb2NhdGlvbiwgdW5pVHlwZSwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCk7XHJcbiAgICAgICAgbGV0IHNyYyA9IHtcclxuICAgICAgICAgICAgdnM6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFVybDogdnNVcmwsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnM6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFVybDogZnNVcmwsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyKHRoaXMuZ2wsIHNyYy52cyk7XHJcbiAgICAgICAgeGhyKHRoaXMuZ2wsIHNyYy5mcyk7XHJcbiAgICAgICAgZnVuY3Rpb24geGhyKGdsLCB0YXJnZXQpe1xyXG4gICAgICAgICAgICBsZXQgeG1sID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhtbC5vcGVuKCdHRVQnLCB0YXJnZXQudGFyZ2V0VXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ1ByYWdtYScsICduby1jYWNoZScpO1xyXG4gICAgICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICduby1jYWNoZScpO1xyXG4gICAgICAgICAgICB4bWwub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHNoYWRlciBzb3VyY2UgbG9hZGVkOiAlYycgKyB0YXJnZXQudGFyZ2V0VXJsLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zb3VyY2UgPSB4bWwucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgbG9hZENoZWNrKGdsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeG1sLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZENoZWNrKGdsKXtcclxuICAgICAgICAgICAgaWYoc3JjLnZzLnNvdXJjZSA9PSBudWxsIHx8IHNyYy5mcy5zb3VyY2UgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHNyYy52cy5zb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShzcmMuZnMuc291cmNlLCBnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBtbmcuYXR0TFtpXSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIG1uZy51bmlMW2ldID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFByb2dyYW1NYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGdsKXtcclxuICAgICAgICB0aGlzLmdsICAgPSBnbDtcclxuICAgICAgICB0aGlzLnZzICAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZnMgICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmcgID0gbnVsbDtcclxuICAgICAgICB0aGlzLmF0dEwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYXR0UyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51bmlMID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVuaVQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNoYWRlckZyb21JZChpZCl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZighc2NyaXB0RWxlbWVudCl7cmV0dXJuO31cclxuICAgICAgICBzd2l0Y2goc2NyaXB0RWxlbWVudC50eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAneC1zaGFkZXIveC12ZXJ0ZXgnOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd4LXNoYWRlci94LWZyYWdtZW50JzpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzY3JpcHRFbGVtZW50LnRleHQpO1xyXG4gICAgICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpe1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZGVyO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc291cmNlLCB0eXBlKXtcclxuICAgICAgICBsZXQgc2hhZGVyO1xyXG4gICAgICAgIHN3aXRjaCh0eXBlKXtcclxuICAgICAgICAgICAgY2FzZSB0aGlzLmdsLlZFUlRFWF9TSEFERVI6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVI6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY29tcGlsZSBmYWlsZWQgb2Ygc2hhZGVyOiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQcm9ncmFtKHZzLCBmcyl7XHJcbiAgICAgICAgbGV0IHByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2cyk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnMpO1xyXG4gICAgICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpKXtcclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvZ3JhbTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgbGluayBwcm9ncmFtIGZhaWxlZDogJyArIHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1c2VQcm9ncmFtKCl7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJnKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyaWJ1dGUodmJvLCBpYm8pe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpIGluIHZibyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA+PSAwKXtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2Ym9baV0pO1xyXG4gICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5hdHRMW2ldKTtcclxuICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5hdHRMW2ldLCB0aGlzLmF0dFNbaV0sIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaWJvICE9IG51bGwpe2dsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7fVxyXG4gICAgfVxyXG5cclxuICAgIHB1c2hTaGFkZXIoYW55KXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSB0aGlzLnVuaVQubGVuZ3RoOyBpIDwgajsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHVuaSA9ICd1bmlmb3JtJyArIHRoaXMudW5pVFtpXS5yZXBsYWNlKC9tYXRyaXgvaSwgJ01hdHJpeCcpO1xyXG4gICAgICAgICAgICBpZihnbFt1bmldICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYodW5pLnNlYXJjaCgvTWF0cml4LykgIT09IC0xKXtcclxuICAgICAgICAgICAgICAgICAgICBnbFt1bmldKHRoaXMudW5pTFtpXSwgZmFsc2UsIGFueVtpXSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBnbFt1bmldKHRoaXMudW5pTFtpXSwgYW55W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBub3Qgc3VwcG9ydCB1bmlmb3JtIHR5cGU6ICcgKyB0aGlzLnVuaVRbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKXtcclxuICAgICAgICBsZXQgaSwgbDtcclxuICAgICAgICBmb3IoaSA9IDAsIGwgPSBhdHRMb2NhdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmF0dExbaV0gPT0gbnVsbCB8fCB0aGlzLmF0dExbaV0gPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGludmFsaWQgYXR0cmlidXRlIGxvY2F0aW9uOiAlY1wiJyArIGF0dExvY2F0aW9uW2ldICsgJ1wiJywgJ2NvbG9yOiBjcmltc29uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwLCBsID0gdW5pTG9jYXRpb24ubGVuZ3RoOyBpIDwgbDsgaSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy51bmlMW2ldID09IG51bGwgfHwgdGhpcy51bmlMW2ldIDwgMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBpbnZhbGlkIHVuaWZvcm0gbG9jYXRpb246ICVjXCInICsgdW5pTG9jYXRpb25baV0gKyAnXCInLCAnY29sb3I6IGNyaW1zb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzQ29yZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=