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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
 * step 1: let a = new gl3Audio(bgmGainValue, soundGainValue) <- float(0 to 1)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

var gl3Audio = function () {
    function gl3Audio(bgmGainValue, soundGainValue) {
        _classCallCheck(this, gl3Audio);

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

    _createClass(gl3Audio, [{
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

    return gl3Audio;
}();

exports.default = gl3Audio;

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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl3Math = function gl3Math() {
    _classCallCheck(this, gl3Math);

    this.Vec3 = Vec3;
    this.Mat4 = Mat4;
    this.Qtn = Qtn;
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
/* 2 */
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
                    var _r2 = (column + 1) * i + j;
                    idx.push(_r2, _r2 + column + 1, _r2 + 1);
                    idx.push(_r2 + column + 1, _r2 + column + 2, _r2 + 1);
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
                var _r3 = Math.PI / row * i;
                var ry = Math.cos(_r3);
                var rr = Math.sin(_r3);
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
                    var _r4 = (column + 1) * i + j;
                    idx.push(_r4, _r4 + 1, _r4 + column + 2);
                    idx.push(_r4, _r4 + column + 2, _r4 + column + 1);
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gl3Audio = __webpack_require__(0);

var _gl3Audio2 = _interopRequireDefault(_gl3Audio);

var _gl3Math = __webpack_require__(1);

var _gl3Math2 = _interopRequireDefault(_gl3Math);

var _gl3Mesh = __webpack_require__(2);

var _gl3Mesh2 = _interopRequireDefault(_gl3Mesh);

var _gl3Util = __webpack_require__(3);

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
        this.Mesh = _gl3Mesh2.default;
        this.Util = _gl3Util2.default;
        this.Math = new _gl3Math2.default();
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
            this.ext = {
                elementIndexUint: this.gl.getExtension('OES_element_index_uint'),
                textureFloat: this.gl.getExtension('OES_texture_float'),
                drawBuffers: this.gl.getExtension('WEBGL_draw_buffers')
            };
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
        value: function sceneView(x, y, width, height) {
            var X = x || 0;
            var Y = y || 0;
            var w = width || window.innerWidth;
            var h = height || window.innerHeight;
            this.gl.viewport(X, Y, w, h);
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
        key: 'drawElementsInt',
        value: function drawElementsInt(primitive, indexLength) {
            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_INT, 0);
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
        key: 'createIboInt',
        value: function createIboInt(data) {
            if (data == null) {
                return;
            }
            var ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }
    }, {
        key: 'createTextureFromImage',
        value: function createTextureFromImage(source, number, callback) {
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
        key: 'createTextureFromCanvas',
        value: function createTextureFromCanvas(canvas, number) {
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
        key: 'createFramebufferFloat',
        value: function createFramebufferFloat(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var fTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer float created', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthRenderbuffer: null, texture: fTexture };
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

window.gl3 = window.gl3 || new gl3();

/***/ })
/******/ ]);