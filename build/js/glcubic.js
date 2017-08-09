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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjBhOWFkOTg2ZDdlOGVlYWE3NDAiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzTWF0aC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNNZXNoLmpzIiwid2VicGFjazovLy8uL2dsM1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzQ29yZS5qcyJdLCJuYW1lcyI6WyJnbDNBdWRpbyIsImJnbUdhaW5WYWx1ZSIsInNvdW5kR2FpblZhbHVlIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiY3R4IiwiY29tcCIsImNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImJnbUdhaW4iLCJjcmVhdGVHYWluIiwiZ2FpbiIsInZhbHVlIiwic291bmRHYWluIiwic3JjIiwidXJsIiwiaW5kZXgiLCJsb29wIiwiYmFja2dyb3VuZCIsImNhbGxiYWNrIiwieG1sIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsImRlY29kZUF1ZGlvRGF0YSIsInJlc3BvbnNlIiwiYnVmIiwiQXVkaW9TcmMiLCJsb2FkZWQiLCJjb25zb2xlIiwibG9nIiwiZSIsInNlbmQiLCJpIiwiZiIsImxlbmd0aCIsImF1ZGlvQnVmZmVyIiwiYnVmZmVyU291cmNlIiwiYWN0aXZlQnVmZmVyU291cmNlIiwiZmZ0TG9vcCIsInVwZGF0ZSIsIm5vZGUiLCJjcmVhdGVTY3JpcHRQcm9jZXNzb3IiLCJhbmFseXNlciIsImNyZWF0ZUFuYWx5c2VyIiwic21vb3RoaW5nVGltZUNvbnN0YW50IiwiZmZ0U2l6ZSIsIm9uRGF0YSIsIlVpbnQ4QXJyYXkiLCJmcmVxdWVuY3lCaW5Db3VudCIsImoiLCJrIiwic2VsZiIsInBsYXlub3ciLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJidWZmZXIiLCJwbGF5YmFja1JhdGUiLCJvbmVuZGVkIiwic3RvcCIsIm9uYXVkaW9wcm9jZXNzIiwiZXZlIiwib25wcm9jZXNzRXZlbnQiLCJzdGFydCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwiZ2wzTWF0aCIsIlZlYzMiLCJNYXQ0IiwiUXRuIiwiRmxvYXQzMkFycmF5IiwiZGVzdCIsIm1hdDEiLCJtYXQyIiwiYSIsImIiLCJjIiwiZCIsImciLCJoIiwibCIsIm0iLCJuIiwibyIsInAiLCJBIiwiQiIsIkMiLCJEIiwiRSIsIkYiLCJHIiwiSCIsIkkiLCJKIiwiSyIsIkwiLCJNIiwiTiIsIk8iLCJQIiwibWF0IiwidmVjIiwiYW5nbGUiLCJheGlzIiwic3EiLCJNYXRoIiwic3FydCIsInNpbiIsImNvcyIsInEiLCJyIiwicyIsInQiLCJ1IiwidiIsInciLCJ4IiwieSIsInoiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZVgiLCJleWVZIiwiZXllWiIsInVwWCIsInVwWSIsInVwWiIsImNlbnRlclgiLCJjZW50ZXJZIiwiY2VudGVyWiIsImlkZW50aXR5IiwieDAiLCJ4MSIsIngyIiwieTAiLCJ5MSIsInkyIiwiejAiLCJ6MSIsInoyIiwiZm92eSIsImFzcGVjdCIsIm5lYXIiLCJmYXIiLCJ0YW4iLCJQSSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsIml2ZCIsImNhbSIsInZtYXQiLCJwbWF0IiwibG9va0F0IiwicG9zaXRpb24iLCJjZW50ZXJQb2ludCIsInVwRGlyZWN0aW9uIiwicGVyc3BlY3RpdmUiLCJtdWx0aXBseSIsImNyZWF0ZSIsInYwIiwidjEiLCJ2MiIsInZlYzEiLCJ2ZWMyIiwibm9ybWFsaXplIiwicXRuIiwicXRuMSIsInF0bjIiLCJheCIsImF5IiwiYXoiLCJhdyIsImJ4IiwiYnkiLCJieiIsImJ3IiwicXAiLCJxcSIsInFyIiwiaW52ZXJzZSIsInh4IiwieHkiLCJ4eiIsInl5IiwieXoiLCJ6eiIsInd4Iiwid3kiLCJ3eiIsInRpbWUiLCJodCIsImhzIiwiYWJzIiwicGgiLCJhY29zIiwicHQiLCJ0MCIsInQxIiwiZ2wzTWVzaCIsIndpZHRoIiwiaGVpZ2h0IiwiY29sb3IiLCJ0YyIsInBvcyIsIm5vciIsImNvbCIsInN0IiwiaWR4Iiwibm9ybWFsIiwidGV4Q29vcmQiLCJyb3ciLCJjb2x1bW4iLCJpcmFkIiwib3JhZCIsInJyIiwicnkiLCJ0ciIsInR4IiwidHkiLCJ0eiIsInJ4IiwicnoiLCJycyIsInJ0IiwicHVzaCIsInJhZCIsInNpZGUiLCJnbDNVdGlsIiwidGgiLCJmbG9vciIsIkFycmF5IiwidHMiLCJnbDMiLCJjYW52YXMiLCJvcHRpb25zIiwiVkVSU0lPTiIsIlBJMiIsIlBJSCIsIlBJSDIiLCJURVhUVVJFX1VOSVRfQ09VTlQiLCJyZWFkeSIsImdsIiwidGV4dHVyZXMiLCJleHQiLCJBdWRpbyIsIk1lc2giLCJVdGlsIiwib3B0IiwiSFRNTENhbnZhc0VsZW1lbnQiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Q29udGV4dCIsImdldFBhcmFtZXRlciIsIk1BWF9DT01CSU5FRF9URVhUVVJFX0lNQUdFX1VOSVRTIiwiZGVwdGgiLCJzdGVuY2lsIiwiZmxnIiwiQ09MT1JfQlVGRkVSX0JJVCIsImNsZWFyQ29sb3IiLCJjbGVhckRlcHRoIiwiREVQVEhfQlVGRkVSX0JJVCIsImNsZWFyU3RlbmNpbCIsIlNURU5DSUxfQlVGRkVSX0JJVCIsImNsZWFyIiwiWCIsIlkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ2aWV3cG9ydCIsInByaW1pdGl2ZSIsInZlcnRleENvdW50IiwiZHJhd0FycmF5cyIsImluZGV4TGVuZ3RoIiwiZHJhd0VsZW1lbnRzIiwiVU5TSUdORURfU0hPUlQiLCJkYXRhIiwidmJvIiwiY3JlYXRlQnVmZmVyIiwiYmluZEJ1ZmZlciIsIkFSUkFZX0JVRkZFUiIsImJ1ZmZlckRhdGEiLCJTVEFUSUNfRFJBVyIsImlibyIsIkVMRU1FTlRfQVJSQVlfQlVGRkVSIiwiSW50MTZBcnJheSIsInNvdXJjZSIsIm51bWJlciIsImltZyIsIkltYWdlIiwidGV4dHVyZSIsInR5cGUiLCJ0ZXgiLCJjcmVhdGVUZXh0dXJlIiwiYmluZFRleHR1cmUiLCJURVhUVVJFXzJEIiwidGV4SW1hZ2UyRCIsIlJHQkEiLCJVTlNJR05FRF9CWVRFIiwiZ2VuZXJhdGVNaXBtYXAiLCJ0ZXhQYXJhbWV0ZXJpIiwiVEVYVFVSRV9NSU5fRklMVEVSIiwiTElORUFSIiwiVEVYVFVSRV9NQUdfRklMVEVSIiwiVEVYVFVSRV9XUkFQX1MiLCJSRVBFQVQiLCJURVhUVVJFX1dSQVBfVCIsImZyYW1lQnVmZmVyIiwiY3JlYXRlRnJhbWVidWZmZXIiLCJiaW5kRnJhbWVidWZmZXIiLCJGUkFNRUJVRkZFUiIsImRlcHRoUmVuZGVyQnVmZmVyIiwiY3JlYXRlUmVuZGVyYnVmZmVyIiwiYmluZFJlbmRlcmJ1ZmZlciIsIlJFTkRFUkJVRkZFUiIsInJlbmRlcmJ1ZmZlclN0b3JhZ2UiLCJERVBUSF9DT01QT05FTlQxNiIsImZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyIiwiREVQVEhfQVRUQUNITUVOVCIsImZUZXh0dXJlIiwiQ0xBTVBfVE9fRURHRSIsImZyYW1lYnVmZmVyVGV4dHVyZTJEIiwiQ09MT1JfQVRUQUNITUVOVDAiLCJmcmFtZWJ1ZmZlciIsImRlcHRoUmVuZGVyYnVmZmVyIiwidGFyZ2V0IiwiVEVYVFVSRV9DVUJFX01BUCIsImNJbWciLCJpbWFnZSIsIm1hcCIsInVuaXQiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJ2c0lkIiwiZnNJZCIsImF0dExvY2F0aW9uIiwiYXR0U3RyaWRlIiwidW5pTG9jYXRpb24iLCJ1bmlUeXBlIiwibW5nIiwiUHJvZ3JhbU1hbmFnZXIiLCJ2cyIsImNyZWF0ZVNoYWRlckZyb21JZCIsImZzIiwicHJnIiwiY3JlYXRlUHJvZ3JhbSIsImF0dEwiLCJhdHRTIiwiZ2V0QXR0cmliTG9jYXRpb24iLCJ1bmlMIiwiZ2V0VW5pZm9ybUxvY2F0aW9uIiwidW5pVCIsImxvY2F0aW9uQ2hlY2siLCJjcmVhdGVTaGFkZXJGcm9tU291cmNlIiwiVkVSVEVYX1NIQURFUiIsIkZSQUdNRU5UX1NIQURFUiIsInZzVXJsIiwiZnNVcmwiLCJ0YXJnZXRVcmwiLCJ4aHIiLCJyZXNwb25zZVRleHQiLCJsb2FkQ2hlY2siLCJpZCIsInNoYWRlciIsInNjcmlwdEVsZW1lbnQiLCJjcmVhdGVTaGFkZXIiLCJzaGFkZXJTb3VyY2UiLCJ0ZXh0IiwiY29tcGlsZVNoYWRlciIsImdldFNoYWRlclBhcmFtZXRlciIsIkNPTVBJTEVfU1RBVFVTIiwid2FybiIsImdldFNoYWRlckluZm9Mb2ciLCJwcm9ncmFtIiwiYXR0YWNoU2hhZGVyIiwibGlua1Byb2dyYW0iLCJnZXRQcm9ncmFtUGFyYW1ldGVyIiwiTElOS19TVEFUVVMiLCJ1c2VQcm9ncmFtIiwiZ2V0UHJvZ3JhbUluZm9Mb2ciLCJlbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSIsInZlcnRleEF0dHJpYlBvaW50ZXIiLCJGTE9BVCIsImFueSIsInVuaSIsInJlcGxhY2UiLCJzZWFyY2giXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBOzs7Ozs7SUFNcUJBLFE7QUFDakIsc0JBQVlDLFlBQVosRUFBMEJDLGNBQTFCLEVBQXlD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QyxVQUFQO0FBQ0EsaUJBQUk3QyxJQUFJLENBQUosRUFBTzZDLElBQUl1USxZQUFZbFQsTUFBM0IsRUFBbUNGLElBQUk2QyxDQUF2QyxFQUEwQzdDLEdBQTFDLEVBQThDO0FBQzFDLG9CQUFHLEtBQUsrVCxJQUFMLENBQVUvVCxDQUFWLEtBQWdCLElBQWhCLElBQXdCLEtBQUsrVCxJQUFMLENBQVUvVCxDQUFWLElBQWUsQ0FBMUMsRUFBNEM7QUFDeENKLDRCQUFRNFYsSUFBUixDQUFhLHNDQUFzQ3BDLFlBQVlwVCxDQUFaLENBQXRDLEdBQXVELEdBQXBFLEVBQXlFLGdCQUF6RTtBQUNIO0FBQ0o7QUFDRCxpQkFBSUEsSUFBSSxDQUFKLEVBQU82QyxJQUFJeVEsWUFBWXBULE1BQTNCLEVBQW1DRixJQUFJNkMsQ0FBdkMsRUFBMEM3QyxHQUExQyxFQUE4QztBQUMxQyxvQkFBRyxLQUFLa1UsSUFBTCxDQUFVbFUsQ0FBVixLQUFnQixJQUFoQixJQUF3QixLQUFLa1UsSUFBTCxDQUFVbFUsQ0FBVixJQUFlLENBQTFDLEVBQTRDO0FBQ3hDSiw0QkFBUTRWLElBQVIsQ0FBYSxvQ0FBb0NsQyxZQUFZdFQsQ0FBWixDQUFwQyxHQUFxRCxHQUFsRSxFQUF1RSxnQkFBdkU7QUFDSDtBQUNKO0FBQ0o7Ozs7OztBQUdMK08sT0FBT3RDLEdBQVAsR0FBYXNDLE9BQU90QyxHQUFQLElBQWMsSUFBSUEsR0FBSixFQUEzQixDIiwiZmlsZSI6ImdsY3ViaWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjBhOWFkOTg2ZDdlOGVlYWE3NDAiLCJcclxuLypcclxuICogc3RlcCAxOiBsZXQgYSA9IG5ldyBnbDNBdWRpbyhiZ21HYWluVmFsdWUsIHNvdW5kR2FpblZhbHVlKSA8LSBmbG9hdCgwIHRvIDEpXHJcbiAqIHN0ZXAgMjogYS5sb2FkKHVybCwgaW5kZXgsIGxvb3AsIGJhY2tncm91bmQpIDwtIHN0cmluZywgaW50LCBib29sZWFuLCBib29sZWFuXHJcbiAqIHN0ZXAgMzogYS5zcmNbaW5kZXhdLmxvYWRlZCB0aGVuIGEuc3JjW2luZGV4XS5wbGF5KClcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNBdWRpbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihiZ21HYWluVmFsdWUsIHNvdW5kR2FpblZhbHVlKXtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICB0eXBlb2Ygd2Via2l0QXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyB3ZWJraXRBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNvbXAgPSB0aGlzLmN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmJnbUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5nYWluLnZhbHVlID0gYmdtR2FpblZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZEdhaW4uY29ubmVjdCh0aGlzLmNvbXApO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2Fpbi5nYWluLnZhbHVlID0gc291bmRHYWluVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3JjID0gW107XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKHVybCwgaW5kZXgsIGxvb3AsIGJhY2tncm91bmQsIGNhbGxiYWNrKXtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgbGV0IGdhaW4gPSBiYWNrZ3JvdW5kID8gdGhpcy5iZ21HYWluIDogdGhpcy5zb3VuZEdhaW47XHJcbiAgICAgICAgbGV0IHNyYyA9IHRoaXMuc3JjO1xyXG4gICAgICAgIHNyY1tpbmRleF0gPSBudWxsO1xyXG4gICAgICAgIGxldCB4bWwgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4bWwub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgICAgICB4bWwub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjdHguZGVjb2RlQXVkaW9EYXRhKHhtbC5yZXNwb25zZSwgKGJ1ZikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3JjW2luZGV4XSA9IG5ldyBBdWRpb1NyYyhjdHgsIGdhaW4sIGJ1ZiwgbG9vcCwgYmFja2dyb3VuZCk7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBhdWRpbyBudW1iZXI6ICVjJyArIGluZGV4ICsgJyVjLCBhdWRpbyBsb2FkZWQ6ICVjJyArIHVybCwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSwgKGUpID0+IHtjb25zb2xlLmxvZyhlKTt9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhtbC5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICBsb2FkQ29tcGxldGUoKXtcclxuICAgICAgICBsZXQgaSwgZjtcclxuICAgICAgICBmID0gdHJ1ZTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNyYy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGYgPSBmICYmICh0aGlzLnNyY1tpXSAhPSBudWxsKSAmJiB0aGlzLnNyY1tpXS5sb2FkZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBBdWRpb1NyYyB7XHJcbiAgICBjb25zdHJ1Y3RvcihjdHgsIGdhaW4sIGF1ZGlvQnVmZmVyLCBsb29wLCBiYWNrZ3JvdW5kKXtcclxuICAgICAgICB0aGlzLmN0eCAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGN0eDtcclxuICAgICAgICB0aGlzLmdhaW4gICAgICAgICAgICAgICAgICAgICAgICAgICA9IGdhaW47XHJcbiAgICAgICAgdGhpcy5hdWRpb0J1ZmZlciAgICAgICAgICAgICAgICAgICAgPSBhdWRpb0J1ZmZlcjtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZSAgICAgICAgICAgICAgICAgICA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQnVmZmVyU291cmNlICAgICAgICAgICAgID0gMDtcclxuICAgICAgICB0aGlzLmxvb3AgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGxvb3A7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgICAgICAgICAgICAgICAgICAgICAgICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZmdExvb3AgICAgICAgICAgICAgICAgICAgICAgICA9IDE2O1xyXG4gICAgICAgIHRoaXMudXBkYXRlICAgICAgICAgICAgICAgICAgICAgICAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kICAgICAgICAgICAgICAgICAgICAgPSBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIHRoaXMubm9kZSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdGhpcy5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDEsIDEpO1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIgICAgICAgICAgICAgICAgICAgICAgID0gdGhpcy5jdHguY3JlYXRlQW5hbHlzZXIoKTtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuODtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgICAgICAgICAgICAgICA9IHRoaXMuZmZ0TG9vcCAqIDI7XHJcbiAgICAgICAgdGhpcy5vbkRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgVWludDhBcnJheSh0aGlzLmFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5KCl7XHJcbiAgICAgICAgbGV0IGksIGosIGs7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGkgPSB0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgayA9IC0xO1xyXG4gICAgICAgIGlmKGkgPiAwKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgaTsgaisrKXtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmJ1ZmZlclNvdXJjZVtqXS5wbGF5bm93KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vbal0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gajtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihrIDwgMCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGhdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICBrID0gdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVswXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICBrID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgPSBrO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXI7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ubG9vcCA9IHRoaXMubG9vcDtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5wbGF5YmFja1JhdGUudmFsdWUgPSAxLjA7XHJcbiAgICAgICAgaWYoIXRoaXMubG9vcCl7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLm9uZW5kZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5iYWNrZ3JvdW5kKXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmFuYWx5c2VyKTtcclxuICAgICAgICAgICAgdGhpcy5hbmFseXNlci5jb25uZWN0KHRoaXMubm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uYXVkaW9wcm9jZXNzID0gKGV2ZSkgPT4ge29ucHJvY2Vzc0V2ZW50KGV2ZSk7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmdhaW4pO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnN0YXJ0KDApO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnBsYXlub3cgPSB0cnVlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbnByb2Nlc3NFdmVudChldmUpe1xyXG4gICAgICAgICAgICBpZihzZWxmLnVwZGF0ZSl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShzZWxmLm9uRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCl7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2VbdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2VdLnN0b3AoMCk7XHJcbiAgICAgICAgdGhpcy5wbGF5bm93ID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM0F1ZGlvLmpzIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM01hdGgge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLlZlYzMgPSBWZWMzO1xyXG4gICAgICAgIHRoaXMuTWF0NCA9IE1hdDQ7XHJcbiAgICAgICAgdGhpcy5RdG4gID0gUXRuO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNYXQ0IHtcclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaWRlbnRpdHkoZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSAgPSAxOyBkZXN0WzFdICA9IDA7IGRlc3RbMl0gID0gMDsgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0gMDsgZGVzdFs1XSAgPSAxOyBkZXN0WzZdICA9IDA7IGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IDA7IGRlc3RbOV0gID0gMDsgZGVzdFsxMF0gPSAxOyBkZXN0WzExXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSAwOyBkZXN0WzEzXSA9IDA7IGRlc3RbMTRdID0gMDsgZGVzdFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdDEsIG1hdDIsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBhID0gbWF0MVswXSwgIGIgPSBtYXQxWzFdLCAgYyA9IG1hdDFbMl0sICBkID0gbWF0MVszXSxcclxuICAgICAgICAgICAgZSA9IG1hdDFbNF0sICBmID0gbWF0MVs1XSwgIGcgPSBtYXQxWzZdLCAgaCA9IG1hdDFbN10sXHJcbiAgICAgICAgICAgIGkgPSBtYXQxWzhdLCAgaiA9IG1hdDFbOV0sICBrID0gbWF0MVsxMF0sIGwgPSBtYXQxWzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdDFbMTJdLCBuID0gbWF0MVsxM10sIG8gPSBtYXQxWzE0XSwgcCA9IG1hdDFbMTVdLFxyXG4gICAgICAgICAgICBBID0gbWF0MlswXSwgIEIgPSBtYXQyWzFdLCAgQyA9IG1hdDJbMl0sICBEID0gbWF0MlszXSxcclxuICAgICAgICAgICAgRSA9IG1hdDJbNF0sICBGID0gbWF0Mls1XSwgIEcgPSBtYXQyWzZdLCAgSCA9IG1hdDJbN10sXHJcbiAgICAgICAgICAgIEkgPSBtYXQyWzhdLCAgSiA9IG1hdDJbOV0sICBLID0gbWF0MlsxMF0sIEwgPSBtYXQyWzExXSxcclxuICAgICAgICAgICAgTSA9IG1hdDJbMTJdLCBOID0gbWF0MlsxM10sIE8gPSBtYXQyWzE0XSwgUCA9IG1hdDJbMTVdO1xyXG4gICAgICAgIGRlc3RbMF0gID0gQSAqIGEgKyBCICogZSArIEMgKiBpICsgRCAqIG07XHJcbiAgICAgICAgZGVzdFsxXSAgPSBBICogYiArIEIgKiBmICsgQyAqIGogKyBEICogbjtcclxuICAgICAgICBkZXN0WzJdICA9IEEgKiBjICsgQiAqIGcgKyBDICogayArIEQgKiBvO1xyXG4gICAgICAgIGRlc3RbM10gID0gQSAqIGQgKyBCICogaCArIEMgKiBsICsgRCAqIHA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSBFICogYSArIEYgKiBlICsgRyAqIGkgKyBIICogbTtcclxuICAgICAgICBkZXN0WzVdICA9IEUgKiBiICsgRiAqIGYgKyBHICogaiArIEggKiBuO1xyXG4gICAgICAgIGRlc3RbNl0gID0gRSAqIGMgKyBGICogZyArIEcgKiBrICsgSCAqIG87XHJcbiAgICAgICAgZGVzdFs3XSAgPSBFICogZCArIEYgKiBoICsgRyAqIGwgKyBIICogcDtcclxuICAgICAgICBkZXN0WzhdICA9IEkgKiBhICsgSiAqIGUgKyBLICogaSArIEwgKiBtO1xyXG4gICAgICAgIGRlc3RbOV0gID0gSSAqIGIgKyBKICogZiArIEsgKiBqICsgTCAqIG47XHJcbiAgICAgICAgZGVzdFsxMF0gPSBJICogYyArIEogKiBnICsgSyAqIGsgKyBMICogbztcclxuICAgICAgICBkZXN0WzExXSA9IEkgKiBkICsgSiAqIGggKyBLICogbCArIEwgKiBwO1xyXG4gICAgICAgIGRlc3RbMTJdID0gTSAqIGEgKyBOICogZSArIE8gKiBpICsgUCAqIG07XHJcbiAgICAgICAgZGVzdFsxM10gPSBNICogYiArIE4gKiBmICsgTyAqIGogKyBQICogbjtcclxuICAgICAgICBkZXN0WzE0XSA9IE0gKiBjICsgTiAqIGcgKyBPICogayArIFAgKiBvO1xyXG4gICAgICAgIGRlc3RbMTVdID0gTSAqIGQgKyBOICogaCArIE8gKiBsICsgUCAqIHA7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUobWF0LCB2ZWMsIGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gID0gbWF0WzBdICAqIHZlY1swXTtcclxuICAgICAgICBkZXN0WzFdICA9IG1hdFsxXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgZGVzdFsyXSAgPSBtYXRbMl0gICogdmVjWzBdO1xyXG4gICAgICAgIGRlc3RbM10gID0gbWF0WzNdICAqIHZlY1swXTtcclxuICAgICAgICBkZXN0WzRdICA9IG1hdFs0XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgZGVzdFs1XSAgPSBtYXRbNV0gICogdmVjWzFdO1xyXG4gICAgICAgIGRlc3RbNl0gID0gbWF0WzZdICAqIHZlY1sxXTtcclxuICAgICAgICBkZXN0WzddICA9IG1hdFs3XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgZGVzdFs4XSAgPSBtYXRbOF0gICogdmVjWzJdO1xyXG4gICAgICAgIGRlc3RbOV0gID0gbWF0WzldICAqIHZlY1syXTtcclxuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF0gKiB2ZWNbMl07XHJcbiAgICAgICAgZGVzdFsxMV0gPSBtYXRbMTFdICogdmVjWzJdO1xyXG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzEyXTtcclxuICAgICAgICBkZXN0WzEzXSA9IG1hdFsxM107XHJcbiAgICAgICAgZGVzdFsxNF0gPSBtYXRbMTRdO1xyXG4gICAgICAgIGRlc3RbMTVdID0gbWF0WzE1XTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUobWF0LCB2ZWMsIGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gPSBtYXRbMF07IGRlc3RbMV0gPSBtYXRbMV07IGRlc3RbMl0gID0gbWF0WzJdOyAgZGVzdFszXSAgPSBtYXRbM107XHJcbiAgICAgICAgZGVzdFs0XSA9IG1hdFs0XTsgZGVzdFs1XSA9IG1hdFs1XTsgZGVzdFs2XSAgPSBtYXRbNl07ICBkZXN0WzddICA9IG1hdFs3XTtcclxuICAgICAgICBkZXN0WzhdID0gbWF0WzhdOyBkZXN0WzldID0gbWF0WzldOyBkZXN0WzEwXSA9IG1hdFsxMF07IGRlc3RbMTFdID0gbWF0WzExXTtcclxuICAgICAgICBkZXN0WzEyXSA9IG1hdFswXSAqIHZlY1swXSArIG1hdFs0XSAqIHZlY1sxXSArIG1hdFs4XSAgKiB2ZWNbMl0gKyBtYXRbMTJdO1xyXG4gICAgICAgIGRlc3RbMTNdID0gbWF0WzFdICogdmVjWzBdICsgbWF0WzVdICogdmVjWzFdICsgbWF0WzldICAqIHZlY1syXSArIG1hdFsxM107XHJcbiAgICAgICAgZGVzdFsxNF0gPSBtYXRbMl0gKiB2ZWNbMF0gKyBtYXRbNl0gKiB2ZWNbMV0gKyBtYXRbMTBdICogdmVjWzJdICsgbWF0WzE0XTtcclxuICAgICAgICBkZXN0WzE1XSA9IG1hdFszXSAqIHZlY1swXSArIG1hdFs3XSAqIHZlY1sxXSArIG1hdFsxMV0gKiB2ZWNbMl0gKyBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZShtYXQsIGFuZ2xlLCBheGlzLCBkZXN0KXtcclxuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcclxuICAgICAgICBpZighc3Epe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgYSA9IGF4aXNbMF0sIGIgPSBheGlzWzFdLCBjID0gYXhpc1syXTtcclxuICAgICAgICBpZihzcSAhPSAxKXtzcSA9IDEgLyBzcTsgYSAqPSBzcTsgYiAqPSBzcTsgYyAqPSBzcTt9XHJcbiAgICAgICAgbGV0IGQgPSBNYXRoLnNpbihhbmdsZSksIGUgPSBNYXRoLmNvcyhhbmdsZSksIGYgPSAxIC0gZSxcclxuICAgICAgICAgICAgZyA9IG1hdFswXSwgIGggPSBtYXRbMV0sIGkgPSBtYXRbMl0sICBqID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBrID0gbWF0WzRdLCAgbCA9IG1hdFs1XSwgbSA9IG1hdFs2XSwgIG4gPSBtYXRbN10sXHJcbiAgICAgICAgICAgIG8gPSBtYXRbOF0sICBwID0gbWF0WzldLCBxID0gbWF0WzEwXSwgciA9IG1hdFsxMV0sXHJcbiAgICAgICAgICAgIHMgPSBhICogYSAqIGYgKyBlLFxyXG4gICAgICAgICAgICB0ID0gYiAqIGEgKiBmICsgYyAqIGQsXHJcbiAgICAgICAgICAgIHUgPSBjICogYSAqIGYgLSBiICogZCxcclxuICAgICAgICAgICAgdiA9IGEgKiBiICogZiAtIGMgKiBkLFxyXG4gICAgICAgICAgICB3ID0gYiAqIGIgKiBmICsgZSxcclxuICAgICAgICAgICAgeCA9IGMgKiBiICogZiArIGEgKiBkLFxyXG4gICAgICAgICAgICB5ID0gYSAqIGMgKiBmICsgYiAqIGQsXHJcbiAgICAgICAgICAgIHogPSBiICogYyAqIGYgLSBhICogZCxcclxuICAgICAgICAgICAgQSA9IGMgKiBjICogZiArIGU7XHJcbiAgICAgICAgaWYoYW5nbGUpe1xyXG4gICAgICAgICAgICBpZihtYXQgIT0gZGVzdCl7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzEyXSA9IG1hdFsxMl07IGRlc3RbMTNdID0gbWF0WzEzXTtcclxuICAgICAgICAgICAgICAgIGRlc3RbMTRdID0gbWF0WzE0XTsgZGVzdFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVzdCA9IG1hdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVzdFswXSAgPSBnICogcyArIGsgKiB0ICsgbyAqIHU7XHJcbiAgICAgICAgZGVzdFsxXSAgPSBoICogcyArIGwgKiB0ICsgcCAqIHU7XHJcbiAgICAgICAgZGVzdFsyXSAgPSBpICogcyArIG0gKiB0ICsgcSAqIHU7XHJcbiAgICAgICAgZGVzdFszXSAgPSBqICogcyArIG4gKiB0ICsgciAqIHU7XHJcbiAgICAgICAgZGVzdFs0XSAgPSBnICogdiArIGsgKiB3ICsgbyAqIHg7XHJcbiAgICAgICAgZGVzdFs1XSAgPSBoICogdiArIGwgKiB3ICsgcCAqIHg7XHJcbiAgICAgICAgZGVzdFs2XSAgPSBpICogdiArIG0gKiB3ICsgcSAqIHg7XHJcbiAgICAgICAgZGVzdFs3XSAgPSBqICogdiArIG4gKiB3ICsgciAqIHg7XHJcbiAgICAgICAgZGVzdFs4XSAgPSBnICogeSArIGsgKiB6ICsgbyAqIEE7XHJcbiAgICAgICAgZGVzdFs5XSAgPSBoICogeSArIGwgKiB6ICsgcCAqIEE7XHJcbiAgICAgICAgZGVzdFsxMF0gPSBpICogeSArIG0gKiB6ICsgcSAqIEE7XHJcbiAgICAgICAgZGVzdFsxMV0gPSBqICogeSArIG4gKiB6ICsgciAqIEE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbG9va0F0KGV5ZSwgY2VudGVyLCB1cCwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGV5ZVggICAgPSBleWVbMF0sICAgIGV5ZVkgICAgPSBleWVbMV0sICAgIGV5ZVogICAgPSBleWVbMl0sXHJcbiAgICAgICAgICAgIHVwWCAgICAgPSB1cFswXSwgICAgIHVwWSAgICAgPSB1cFsxXSwgICAgIHVwWiAgICAgPSB1cFsyXSxcclxuICAgICAgICAgICAgY2VudGVyWCA9IGNlbnRlclswXSwgY2VudGVyWSA9IGNlbnRlclsxXSwgY2VudGVyWiA9IGNlbnRlclsyXTtcclxuICAgICAgICBpZihleWVYID09IGNlbnRlclggJiYgZXllWSA9PSBjZW50ZXJZICYmIGV5ZVogPT0gY2VudGVyWil7cmV0dXJuIE1hdDQuaWRlbnRpdHkoZGVzdCk7fVxyXG4gICAgICAgIGxldCB4MCwgeDEsIHgyLCB5MCwgeTEsIHkyLCB6MCwgejEsIHoyLCBsO1xyXG4gICAgICAgIHowID0gZXllWCAtIGNlbnRlclswXTsgejEgPSBleWVZIC0gY2VudGVyWzFdOyB6MiA9IGV5ZVogLSBjZW50ZXJbMl07XHJcbiAgICAgICAgbCA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcclxuICAgICAgICB6MCAqPSBsOyB6MSAqPSBsOyB6MiAqPSBsO1xyXG4gICAgICAgIHgwID0gdXBZICogejIgLSB1cFogKiB6MTtcclxuICAgICAgICB4MSA9IHVwWiAqIHowIC0gdXBYICogejI7XHJcbiAgICAgICAgeDIgPSB1cFggKiB6MSAtIHVwWSAqIHowO1xyXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcclxuICAgICAgICBpZighbCl7XHJcbiAgICAgICAgICAgIHgwID0gMDsgeDEgPSAwOyB4MiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICB4MCAqPSBsOyB4MSAqPSBsOyB4MiAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxOyB5MSA9IHoyICogeDAgLSB6MCAqIHgyOyB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xyXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeTAgKiB5MCArIHkxICogeTEgKyB5MiAqIHkyKTtcclxuICAgICAgICBpZighbCl7XHJcbiAgICAgICAgICAgIHkwID0gMDsgeTEgPSAwOyB5MiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICB5MCAqPSBsOyB5MSAqPSBsOyB5MiAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXN0WzBdID0geDA7IGRlc3RbMV0gPSB5MDsgZGVzdFsyXSAgPSB6MDsgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gPSB4MTsgZGVzdFs1XSA9IHkxOyBkZXN0WzZdICA9IHoxOyBkZXN0WzddICA9IDA7XHJcbiAgICAgICAgZGVzdFs4XSA9IHgyOyBkZXN0WzldID0geTI7IGRlc3RbMTBdID0gejI7IGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IC0oeDAgKiBleWVYICsgeDEgKiBleWVZICsgeDIgKiBleWVaKTtcclxuICAgICAgICBkZXN0WzEzXSA9IC0oeTAgKiBleWVYICsgeTEgKiBleWVZICsgeTIgKiBleWVaKTtcclxuICAgICAgICBkZXN0WzE0XSA9IC0oejAgKiBleWVYICsgejEgKiBleWVZICsgejIgKiBleWVaKTtcclxuICAgICAgICBkZXN0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIGRlc3Qpe1xyXG4gICAgICAgIGxldCB0ID0gbmVhciAqIE1hdGgudGFuKGZvdnkgKiBNYXRoLlBJIC8gMzYwKTtcclxuICAgICAgICBsZXQgciA9IHQgKiBhc3BlY3Q7XHJcbiAgICAgICAgbGV0IGEgPSByICogMiwgYiA9IHQgKiAyLCBjID0gZmFyIC0gbmVhcjtcclxuICAgICAgICBkZXN0WzBdICA9IG5lYXIgKiAyIC8gYTtcclxuICAgICAgICBkZXN0WzFdICA9IDA7XHJcbiAgICAgICAgZGVzdFsyXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbM10gID0gMDtcclxuICAgICAgICBkZXN0WzRdICA9IDA7XHJcbiAgICAgICAgZGVzdFs1XSAgPSBuZWFyICogMiAvIGI7XHJcbiAgICAgICAgZGVzdFs2XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IDA7XHJcbiAgICAgICAgZGVzdFs5XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbMTBdID0gLShmYXIgKyBuZWFyKSAvIGM7XHJcbiAgICAgICAgZGVzdFsxMV0gPSAtMTtcclxuICAgICAgICBkZXN0WzEyXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxM10gPSAwO1xyXG4gICAgICAgIGRlc3RbMTRdID0gLShmYXIgKiBuZWFyICogMikgLyBjO1xyXG4gICAgICAgIGRlc3RbMTVdID0gMDtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBvcnRobyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIG5lYXIsIGZhciwgZGVzdCkge1xyXG4gICAgICAgIGxldCBoID0gKHJpZ2h0IC0gbGVmdCk7XHJcbiAgICAgICAgbGV0IHYgPSAodG9wIC0gYm90dG9tKTtcclxuICAgICAgICBsZXQgZCA9IChmYXIgLSBuZWFyKTtcclxuICAgICAgICBkZXN0WzBdICA9IDIgLyBoO1xyXG4gICAgICAgIGRlc3RbMV0gID0gMDtcclxuICAgICAgICBkZXN0WzJdICA9IDA7XHJcbiAgICAgICAgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0gMDtcclxuICAgICAgICBkZXN0WzVdICA9IDIgLyB2O1xyXG4gICAgICAgIGRlc3RbNl0gID0gMDtcclxuICAgICAgICBkZXN0WzddICA9IDA7XHJcbiAgICAgICAgZGVzdFs4XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOV0gID0gMDtcclxuICAgICAgICBkZXN0WzEwXSA9IC0yIC8gZDtcclxuICAgICAgICBkZXN0WzExXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBoO1xyXG4gICAgICAgIGRlc3RbMTNdID0gLSh0b3AgKyBib3R0b20pIC8gdjtcclxuICAgICAgICBkZXN0WzE0XSA9IC0oZmFyICsgbmVhcikgLyBkO1xyXG4gICAgICAgIGRlc3RbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc3Bvc2UobWF0LCBkZXN0KXtcclxuICAgICAgICBkZXN0WzBdICA9IG1hdFswXTsgIGRlc3RbMV0gID0gbWF0WzRdO1xyXG4gICAgICAgIGRlc3RbMl0gID0gbWF0WzhdOyAgZGVzdFszXSAgPSBtYXRbMTJdO1xyXG4gICAgICAgIGRlc3RbNF0gID0gbWF0WzFdOyAgZGVzdFs1XSAgPSBtYXRbNV07XHJcbiAgICAgICAgZGVzdFs2XSAgPSBtYXRbOV07ICBkZXN0WzddICA9IG1hdFsxM107XHJcbiAgICAgICAgZGVzdFs4XSAgPSBtYXRbMl07ICBkZXN0WzldICA9IG1hdFs2XTtcclxuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF07IGRlc3RbMTFdID0gbWF0WzE0XTtcclxuICAgICAgICBkZXN0WzEyXSA9IG1hdFszXTsgIGRlc3RbMTNdID0gbWF0WzddO1xyXG4gICAgICAgIGRlc3RbMTRdID0gbWF0WzExXTsgZGVzdFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGludmVyc2UobWF0LCBkZXN0KXtcclxuICAgICAgICBsZXQgYSA9IG1hdFswXSwgIGIgPSBtYXRbMV0sICBjID0gbWF0WzJdLCAgZCA9IG1hdFszXSxcclxuICAgICAgICAgICAgZSA9IG1hdFs0XSwgIGYgPSBtYXRbNV0sICBnID0gbWF0WzZdLCAgaCA9IG1hdFs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgIGogPSBtYXRbOV0sICBrID0gbWF0WzEwXSwgbCA9IG1hdFsxMV0sXHJcbiAgICAgICAgICAgIG0gPSBtYXRbMTJdLCBuID0gbWF0WzEzXSwgbyA9IG1hdFsxNF0sIHAgPSBtYXRbMTVdLFxyXG4gICAgICAgICAgICBxID0gYSAqIGYgLSBiICogZSwgciA9IGEgKiBnIC0gYyAqIGUsXHJcbiAgICAgICAgICAgIHMgPSBhICogaCAtIGQgKiBlLCB0ID0gYiAqIGcgLSBjICogZixcclxuICAgICAgICAgICAgdSA9IGIgKiBoIC0gZCAqIGYsIHYgPSBjICogaCAtIGQgKiBnLFxyXG4gICAgICAgICAgICB3ID0gaSAqIG4gLSBqICogbSwgeCA9IGkgKiBvIC0gayAqIG0sXHJcbiAgICAgICAgICAgIHkgPSBpICogcCAtIGwgKiBtLCB6ID0gaiAqIG8gLSBrICogbixcclxuICAgICAgICAgICAgQSA9IGogKiBwIC0gbCAqIG4sIEIgPSBrICogcCAtIGwgKiBvLFxyXG4gICAgICAgICAgICBpdmQgPSAxIC8gKHEgKiBCIC0gciAqIEEgKyBzICogeiArIHQgKiB5IC0gdSAqIHggKyB2ICogdyk7XHJcbiAgICAgICAgZGVzdFswXSAgPSAoIGYgKiBCIC0gZyAqIEEgKyBoICogeikgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxXSAgPSAoLWIgKiBCICsgYyAqIEEgLSBkICogeikgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsyXSAgPSAoIG4gKiB2IC0gbyAqIHUgKyBwICogdCkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFszXSAgPSAoLWogKiB2ICsgayAqIHUgLSBsICogdCkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFs0XSAgPSAoLWUgKiBCICsgZyAqIHkgLSBoICogeCkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFs1XSAgPSAoIGEgKiBCIC0gYyAqIHkgKyBkICogeCkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFs2XSAgPSAoLW0gKiB2ICsgbyAqIHMgLSBwICogcikgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFs3XSAgPSAoIGkgKiB2IC0gayAqIHMgKyBsICogcikgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFs4XSAgPSAoIGUgKiBBIC0gZiAqIHkgKyBoICogdykgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFs5XSAgPSAoLWEgKiBBICsgYiAqIHkgLSBkICogdykgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxMF0gPSAoIG0gKiB1IC0gbiAqIHMgKyBwICogcSkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxMV0gPSAoLWkgKiB1ICsgaiAqIHMgLSBsICogcSkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxMl0gPSAoLWUgKiB6ICsgZiAqIHggLSBnICogdykgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxM10gPSAoIGEgKiB6IC0gYiAqIHggKyBjICogdykgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxNF0gPSAoLW0gKiB0ICsgbiAqIHIgLSBvICogcSkgKiBpdmQ7XHJcbiAgICAgICAgZGVzdFsxNV0gPSAoIGkgKiB0IC0gaiAqIHIgKyBrICogcSkgKiBpdmQ7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdnBGcm9tQ2FtZXJhKGNhbSwgdm1hdCwgcG1hdCwgZGVzdCl7XHJcbiAgICAgICAgTWF0NC5sb29rQXQoY2FtLnBvc2l0aW9uLCBjYW0uY2VudGVyUG9pbnQsIGNhbS51cERpcmVjdGlvbiwgdm1hdCk7XHJcbiAgICAgICAgTWF0NC5wZXJzcGVjdGl2ZShjYW0uZm92eSwgY2FtLmFzcGVjdCwgY2FtLm5lYXIsIGNhbS5mYXIsIHBtYXQpO1xyXG4gICAgICAgIE1hdDQubXVsdGlwbHkocG1hdCwgdm1hdCwgZGVzdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFZlYzMge1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZSh2KXtcclxuICAgICAgICBsZXQgbiA9IFZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IGwgPSBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSArIHZbMl0gKiB2WzJdKTtcclxuICAgICAgICBpZihsID4gMCl7XHJcbiAgICAgICAgICAgIGxldCBlID0gMS4wIC8gbDtcclxuICAgICAgICAgICAgblswXSA9IHZbMF0gKiBlO1xyXG4gICAgICAgICAgICBuWzFdID0gdlsxXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMl0gPSB2WzJdICogZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZG90KHYwLCB2MSl7XHJcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMF0gKyB2MFsxXSAqIHYxWzFdICsgdjBbMl0gKiB2MVsyXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjcm9zcyh2MCwgdjEpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBuWzBdID0gdjBbMV0gKiB2MVsyXSAtIHYwWzJdICogdjFbMV07XHJcbiAgICAgICAgblsxXSA9IHYwWzJdICogdjFbMF0gLSB2MFswXSAqIHYxWzJdO1xyXG4gICAgICAgIG5bMl0gPSB2MFswXSAqIHYxWzFdIC0gdjBbMV0gKiB2MVswXTtcclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIHN0YXRpYyBmYWNlTm9ybWFsKHYwLCB2MSwgdjIpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgdmVjMSA9IFt2MVswXSAtIHYwWzBdLCB2MVsxXSAtIHYwWzFdLCB2MVsyXSAtIHYwWzJdXTtcclxuICAgICAgICBsZXQgdmVjMiA9IFt2MlswXSAtIHYwWzBdLCB2MlsxXSAtIHYwWzFdLCB2MlsyXSAtIHYwWzJdXTtcclxuICAgICAgICBuWzBdID0gdmVjMVsxXSAqIHZlYzJbMl0gLSB2ZWMxWzJdICogdmVjMlsxXTtcclxuICAgICAgICBuWzFdID0gdmVjMVsyXSAqIHZlYzJbMF0gLSB2ZWMxWzBdICogdmVjMlsyXTtcclxuICAgICAgICBuWzJdID0gdmVjMVswXSAqIHZlYzJbMV0gLSB2ZWMxWzFdICogdmVjMlswXTtcclxuICAgICAgICByZXR1cm4gVmVjMy5ub3JtYWxpemUobik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFF0biB7XHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaWRlbnRpdHkoZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSA9IDA7IGRlc3RbMV0gPSAwOyBkZXN0WzJdID0gMDsgZGVzdFszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaW52ZXJzZShxdG4sIGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gPSAtcXRuWzBdO1xyXG4gICAgICAgIGRlc3RbMV0gPSAtcXRuWzFdO1xyXG4gICAgICAgIGRlc3RbMl0gPSAtcXRuWzJdO1xyXG4gICAgICAgIGRlc3RbM10gPSAgcXRuWzNdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZShkZXN0KXtcclxuICAgICAgICBsZXQgeCA9IGRlc3RbMF0sIHkgPSBkZXN0WzFdLCB6ID0gZGVzdFsyXSwgdyA9IGRlc3RbM107XHJcbiAgICAgICAgbGV0IGwgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHcpO1xyXG4gICAgICAgIGlmKGwgPT09IDApe1xyXG4gICAgICAgICAgICBkZXN0WzBdID0gMDtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IDA7XHJcbiAgICAgICAgICAgIGRlc3RbMl0gPSAwO1xyXG4gICAgICAgICAgICBkZXN0WzNdID0gMDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICBkZXN0WzBdID0geCAqIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMV0gPSB5ICogbDtcclxuICAgICAgICAgICAgZGVzdFsyXSA9IHogKiBsO1xyXG4gICAgICAgICAgICBkZXN0WzNdID0gdyAqIGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG11bHRpcGx5KHF0bjEsIHF0bjIsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBheCA9IHF0bjFbMF0sIGF5ID0gcXRuMVsxXSwgYXogPSBxdG4xWzJdLCBhdyA9IHF0bjFbM107XHJcbiAgICAgICAgbGV0IGJ4ID0gcXRuMlswXSwgYnkgPSBxdG4yWzFdLCBieiA9IHF0bjJbMl0sIGJ3ID0gcXRuMlszXTtcclxuICAgICAgICBkZXN0WzBdID0gYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieTtcclxuICAgICAgICBkZXN0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcclxuICAgICAgICBkZXN0WzJdID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieDtcclxuICAgICAgICBkZXN0WzNdID0gYXcgKiBidyAtIGF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBiejtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGUoYW5nbGUsIGF4aXMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBzcSA9IE1hdGguc3FydChheGlzWzBdICogYXhpc1swXSArIGF4aXNbMV0gKiBheGlzWzFdICsgYXhpc1syXSAqIGF4aXNbMl0pO1xyXG4gICAgICAgIGlmKCFzcSl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xyXG4gICAgICAgIGlmKHNxICE9IDEpe3NxID0gMSAvIHNxOyBhICo9IHNxOyBiICo9IHNxOyBjICo9IHNxO31cclxuICAgICAgICBsZXQgcyA9IE1hdGguc2luKGFuZ2xlICogMC41KTtcclxuICAgICAgICBkZXN0WzBdID0gYSAqIHM7XHJcbiAgICAgICAgZGVzdFsxXSA9IGIgKiBzO1xyXG4gICAgICAgIGRlc3RbMl0gPSBjICogcztcclxuICAgICAgICBkZXN0WzNdID0gTWF0aC5jb3MoYW5nbGUgKiAwLjUpO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRvVmVjSUlJKHZlYywgcXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgcXAgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IHFxID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCBxciA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBRdG4uaW52ZXJzZShxdG4sIHFyKTtcclxuICAgICAgICBxcFswXSA9IHZlY1swXTtcclxuICAgICAgICBxcFsxXSA9IHZlY1sxXTtcclxuICAgICAgICBxcFsyXSA9IHZlY1syXTtcclxuICAgICAgICBRdG4ubXVsdGlwbHkocXIsIHFwLCBxcSk7XHJcbiAgICAgICAgUXRuLm11bHRpcGx5KHFxLCBxdG4sIHFyKTtcclxuICAgICAgICBkZXN0WzBdID0gcXJbMF07XHJcbiAgICAgICAgZGVzdFsxXSA9IHFyWzFdO1xyXG4gICAgICAgIGRlc3RbMl0gPSBxclsyXTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0b01hdElWKHF0biwgZGVzdCl7XHJcbiAgICAgICAgbGV0IHggPSBxdG5bMF0sIHkgPSBxdG5bMV0sIHogPSBxdG5bMl0sIHcgPSBxdG5bM107XHJcbiAgICAgICAgbGV0IHgyID0geCArIHgsIHkyID0geSArIHksIHoyID0geiArIHo7XHJcbiAgICAgICAgbGV0IHh4ID0geCAqIHgyLCB4eSA9IHggKiB5MiwgeHogPSB4ICogejI7XHJcbiAgICAgICAgbGV0IHl5ID0geSAqIHkyLCB5eiA9IHkgKiB6MiwgenogPSB6ICogejI7XHJcbiAgICAgICAgbGV0IHd4ID0gdyAqIHgyLCB3eSA9IHcgKiB5Miwgd3ogPSB3ICogejI7XHJcbiAgICAgICAgZGVzdFswXSAgPSAxIC0gKHl5ICsgenopO1xyXG4gICAgICAgIGRlc3RbMV0gID0geHkgLSB3ejtcclxuICAgICAgICBkZXN0WzJdICA9IHh6ICsgd3k7XHJcbiAgICAgICAgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0geHkgKyB3ejtcclxuICAgICAgICBkZXN0WzVdICA9IDEgLSAoeHggKyB6eik7XHJcbiAgICAgICAgZGVzdFs2XSAgPSB5eiAtIHd4O1xyXG4gICAgICAgIGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IHh6IC0gd3k7XHJcbiAgICAgICAgZGVzdFs5XSAgPSB5eiArIHd4O1xyXG4gICAgICAgIGRlc3RbMTBdID0gMSAtICh4eCArIHl5KTtcclxuICAgICAgICBkZXN0WzExXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSAwO1xyXG4gICAgICAgIGRlc3RbMTNdID0gMDtcclxuICAgICAgICBkZXN0WzE0XSA9IDA7XHJcbiAgICAgICAgZGVzdFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNsZXJwKHF0bjEsIHF0bjIsIHRpbWUsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBodCA9IHF0bjFbMF0gKiBxdG4yWzBdICsgcXRuMVsxXSAqIHF0bjJbMV0gKyBxdG4xWzJdICogcXRuMlsyXSArIHF0bjFbM10gKiBxdG4yWzNdO1xyXG4gICAgICAgIGxldCBocyA9IDEuMCAtIGh0ICogaHQ7XHJcbiAgICAgICAgaWYoaHMgPD0gMC4wKXtcclxuICAgICAgICAgICAgZGVzdFswXSA9IHF0bjFbMF07XHJcbiAgICAgICAgICAgIGRlc3RbMV0gPSBxdG4xWzFdO1xyXG4gICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXTtcclxuICAgICAgICAgICAgZGVzdFszXSA9IHF0bjFbM107XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGhzID0gTWF0aC5zcXJ0KGhzKTtcclxuICAgICAgICAgICAgaWYoTWF0aC5hYnMoaHMpIDwgMC4wMDAxKXtcclxuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSAocXRuMVswXSAqIDAuNSArIHF0bjJbMF0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgZGVzdFsxXSA9IChxdG4xWzFdICogMC41ICsgcXRuMlsxXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzJdID0gKHF0bjFbMl0gKiAwLjUgKyBxdG4yWzJdICogMC41KTtcclxuICAgICAgICAgICAgICAgIGRlc3RbM10gPSAocXRuMVszXSAqIDAuNSArIHF0bjJbM10gKiAwLjUpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGxldCBwaCA9IE1hdGguYWNvcyhodCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHQgPSBwaCAqIHRpbWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgdDAgPSBNYXRoLnNpbihwaCAtIHB0KSAvIGhzO1xyXG4gICAgICAgICAgICAgICAgbGV0IHQxID0gTWF0aC5zaW4ocHQpIC8gaHM7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzBdID0gcXRuMVswXSAqIHQwICsgcXRuMlswXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV0gKiB0MCArIHF0bjJbMV0gKiB0MTtcclxuICAgICAgICAgICAgICAgIGRlc3RbMl0gPSBxdG4xWzJdICogdDAgKyBxdG4yWzJdICogdDE7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzNdID0gcXRuMVszXSAqIHQwICsgcXRuMlszXSAqIHQxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM01hdGguanMiLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzTWVzaCB7XHJcbiAgICBzdGF0aWMgcGxhbmUod2lkdGgsIGhlaWdodCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCB3LCBoO1xyXG4gICAgICAgIHcgPSB3aWR0aCAvIDI7XHJcbiAgICAgICAgaCA9IGhlaWdodCAvIDI7XHJcbiAgICAgICAgaWYoY29sb3Ipe1xyXG4gICAgICAgICAgICB0YyA9IGNvbG9yO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0YyA9IFsxLjAsIDEuMCwgMS4wLCAxLjBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcG9zID0gW1xyXG4gICAgICAgICAgICAtdywgIGgsICAwLjAsXHJcbiAgICAgICAgICAgICB3LCAgaCwgIDAuMCxcclxuICAgICAgICAgICAgLXcsIC1oLCAgMC4wLFxyXG4gICAgICAgICAgICAgdywgLWgsICAwLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBub3IgPSBbXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBjb2wgPSBbXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgc3QgID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCxcclxuICAgICAgICAgICAgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAxLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGlkeCA9IFtcclxuICAgICAgICAgICAgMCwgMSwgMixcclxuICAgICAgICAgICAgMiwgMSwgM1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHRvcnVzKHJvdywgY29sdW1uLCBpcmFkLCBvcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyIC8gcm93ICogaTtcclxuICAgICAgICAgICAgbGV0IHJyID0gTWF0aC5jb3Mocik7XHJcbiAgICAgICAgICAgIGxldCByeSA9IE1hdGguc2luKHIpO1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPD0gY29sdW1uOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyID0gTWF0aC5QSSAqIDIgLyBjb2x1bW4gKiBqO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR4ID0gKHJyICogaXJhZCArIG9yYWQpICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR5ID0gcnkgKiBpcmFkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR6ID0gKHJyICogaXJhZCArIG9yYWQpICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ4ID0gcnIgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnogPSByciAqIE1hdGguc2luKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCBycyA9IDEgLyBjb2x1bW4gKiBqO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ0ID0gMSAvIHJvdyAqIGkgKyAwLjU7XHJcbiAgICAgICAgICAgICAgICBpZihydCA+IDEuMCl7cnQgLT0gMS4wO31cclxuICAgICAgICAgICAgICAgIHJ0ID0gMS4wIC0gcnQ7XHJcbiAgICAgICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcclxuICAgICAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xyXG4gICAgICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgICAgICAgICAgc3QucHVzaChycywgcnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHJvdzsgaSsrKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgY29sdW1uOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAxLCByICsgMSk7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyICsgY29sdW1uICsgMSwgciArIGNvbHVtbiArIDIsIHIgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc3BoZXJlKHJvdywgY29sdW1uLCByYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAvIHJvdyAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeSA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnIgPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCB0ciA9IE1hdGguUEkgKiAyIC8gY29sdW1uICogajtcclxuICAgICAgICAgICAgICAgIGxldCB0eCA9IHJyICogcmFkICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR5ID0gcnkgKiByYWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHogPSByciAqIHJhZCAqIE1hdGguc2luKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeCA9IHJyICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ6ID0gcnIgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcclxuICAgICAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xyXG4gICAgICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgICAgICAgICAgc3QucHVzaCgxIC0gMSAvIGNvbHVtbiAqIGosIDEgLyByb3cgKiBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByID0gMDtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGNvbHVtbjsgaisrKXtcclxuICAgICAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyAxLCByICsgY29sdW1uICsgMik7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMiwgciArIGNvbHVtbiArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBjdWJlKHNpZGUsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaHMgPSBzaWRlICogMC41O1xyXG4gICAgICAgIGxldCBwb3MgPSBbXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgLWhzLCAtaHMsXHJcbiAgICAgICAgICAgIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsXHJcbiAgICAgICAgICAgICBocywgLWhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLCAgaHMsXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAtaHNcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBub3IgPSBbXHJcbiAgICAgICAgICAgIC0xLjAsIC0xLjAsICAxLjAsICAxLjAsIC0xLjAsICAxLjAsICAxLjAsICAxLjAsICAxLjAsIC0xLjAsICAxLjAsICAxLjAsXHJcbiAgICAgICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsICAxLjAsIC0xLjAsICAxLjAsICAxLjAsIC0xLjAsICAxLjAsIC0xLjAsIC0xLjAsXHJcbiAgICAgICAgICAgIC0xLjAsICAxLjAsIC0xLjAsIC0xLjAsICAxLjAsICAxLjAsICAxLjAsICAxLjAsICAxLjAsICAxLjAsICAxLjAsIC0xLjAsXHJcbiAgICAgICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsICAxLjAsIC0xLjAsIC0xLjAsICAxLjAsIC0xLjAsICAxLjAsIC0xLjAsIC0xLjAsICAxLjAsXHJcbiAgICAgICAgICAgICAxLjAsIC0xLjAsIC0xLjAsICAxLjAsICAxLjAsIC0xLjAsICAxLjAsICAxLjAsICAxLjAsICAxLjAsIC0xLjAsICAxLjAsXHJcbiAgICAgICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsICAxLjAsIC0xLjAsICAxLjAsICAxLjAsIC0xLjAsICAxLjAsIC0xLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBjb2wgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcG9zLmxlbmd0aCAvIDM7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHN0ID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgaWR4ID0gW1xyXG4gICAgICAgICAgICAgMCwgIDEsICAyLCAgMCwgIDIsICAzLFxyXG4gICAgICAgICAgICAgNCwgIDUsICA2LCAgNCwgIDYsICA3LFxyXG4gICAgICAgICAgICAgOCwgIDksIDEwLCAgOCwgMTAsIDExLFxyXG4gICAgICAgICAgICAxMiwgMTMsIDE0LCAxMiwgMTQsIDE1LFxyXG4gICAgICAgICAgICAxNiwgMTcsIDE4LCAxNiwgMTgsIDE5LFxyXG4gICAgICAgICAgICAyMCwgMjEsIDIyLCAyMCwgMjIsIDIzXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM01lc2guanMiLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzVXRpbCB7XHJcbiAgICBzdGF0aWMgaHN2YShoLCBzLCB2LCBhKXtcclxuICAgICAgICBpZihzID4gMSB8fCB2ID4gMSB8fCBhID4gMSl7cmV0dXJuO31cclxuICAgICAgICBsZXQgdGggPSBoICUgMzYwO1xyXG4gICAgICAgIGxldCBpID0gTWF0aC5mbG9vcih0aCAvIDYwKTtcclxuICAgICAgICBsZXQgZiA9IHRoIC8gNjAgLSBpO1xyXG4gICAgICAgIGxldCBtID0gdiAqICgxIC0gcyk7XHJcbiAgICAgICAgbGV0IG4gPSB2ICogKDEgLSBzICogZik7XHJcbiAgICAgICAgbGV0IGsgPSB2ICogKDEgLSBzICogKDEgLSBmKSk7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgaWYoIXMgPiAwICYmICFzIDwgMCl7XHJcbiAgICAgICAgICAgIGNvbG9yLnB1c2godiwgdiwgdiwgYSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHIgPSBuZXcgQXJyYXkodiwgbiwgbSwgbSwgaywgdik7XHJcbiAgICAgICAgICAgIGxldCBnID0gbmV3IEFycmF5KGssIHYsIHYsIG4sIG0sIG0pO1xyXG4gICAgICAgICAgICBsZXQgYiA9IG5ldyBBcnJheShtLCBtLCBrLCB2LCB2LCBuKTtcclxuICAgICAgICAgICAgY29sb3IucHVzaChyW2ldLCBnW2ldLCBiW2ldLCBhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGVhc2VMaW5lcih0KXtcclxuICAgICAgICByZXR1cm4gdCA8IDAuNSA/IDQgKiB0ICogdCAqIHQgOiAodCAtIDEpICogKDIgKiB0IC0gMikgKiAoMiAqIHQgLSAyKSArIDE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZWFzZU91dEN1YmljKHQpe1xyXG4gICAgICAgIHJldHVybiAodCA9IHQgLyAxIC0gMSkgKiB0ICogdCArIDE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZWFzZVF1aW50aWModCl7XHJcbiAgICAgICAgbGV0IHRzID0gKHQgPSB0IC8gMSkgKiB0O1xyXG4gICAgICAgIGxldCB0YyA9IHRzICogdDtcclxuICAgICAgICByZXR1cm4gKHRjICogdHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzVXRpbC5qcyIsIlxyXG5pbXBvcnQgYXVkaW8gZnJvbSAnLi9nbDNBdWRpby5qcyc7XHJcbmltcG9ydCBtYXRoICBmcm9tICcuL2dsM01hdGguanMnO1xyXG5pbXBvcnQgbWVzaCAgZnJvbSAnLi9nbDNNZXNoLmpzJztcclxuaW1wb3J0IHV0aWwgIGZyb20gJy4vZ2wzVXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDMge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBvcHRpb25zKXtcclxuICAgICAgICB0aGlzLlZFUlNJT04gPSAnMC4wLjYnO1xyXG4gICAgICAgIHRoaXMuUEkyICA9IDYuMjgzMTg1MzA3MTc5NTg2NDc2OTI1Mjg2NzY2NTU5MDA1NzY7XHJcbiAgICAgICAgdGhpcy5QSSAgID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODtcclxuICAgICAgICB0aGlzLlBJSCAgPSAxLjU3MDc5NjMyNjc5NDg5NjYxOTIzMTMyMTY5MTYzOTc1MTQ0O1xyXG4gICAgICAgIHRoaXMuUElIMiA9IDAuNzg1Mzk4MTYzMzk3NDQ4MzA5NjE1NjYwODQ1ODE5ODc1NzI7XHJcbiAgICAgICAgdGhpcy5URVhUVVJFX1VOSVRfQ09VTlQgPSBudWxsO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBnbEN1YmljLmpzICVj4peGJWMgOiB2ZXJzaW9uICVjJyArIGdsMy5WRVJTSU9OLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogcm95YWxibHVlJyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVhZHkgICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgID0gbnVsbDtcclxuICAgICAgICB0aGlzLmdsICAgICAgID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmV4dCAgICAgID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5BdWRpbyAgID0gYXVkaW87XHJcbiAgICAgICAgdGhpcy5NZXNoICAgID0gbWVzaDtcclxuICAgICAgICB0aGlzLlV0aWwgICAgPSB1dGlsO1xyXG4gICAgICAgIHRoaXMuTWF0aCAgICA9IG5ldyBtYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChjYW52YXMsIG9wdGlvbnMpe1xyXG4gICAgICAgIGxldCBvcHQgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgICBpZihjYW52YXMgPT0gbnVsbCl7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICBpZihjYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1lbHNlIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjYW52YXMpID09PSAnW29iamVjdCBTdHJpbmddJyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jYW52YXMgPT0gbnVsbCl7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCBvcHQpIHx8XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdCk7XHJcbiAgICAgICAgaWYodGhpcy5nbCAhPSBudWxsKXtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXMgPSBuZXcgQXJyYXkodGhpcy5URVhUVVJFX1VOSVRfQ09VTlQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBzY2VuZUNsZWFyKGNvbG9yLCBkZXB0aCwgc3RlbmNpbCl7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgZmxnID0gZ2wuQ09MT1JfQlVGRkVSX0JJVDtcclxuICAgICAgICBnbC5jbGVhckNvbG9yKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICBpZihkZXB0aCAhPSBudWxsKXtcclxuICAgICAgICAgICAgZ2wuY2xlYXJEZXB0aChkZXB0aCk7XHJcbiAgICAgICAgICAgIGZsZyA9IGZsZyB8IGdsLkRFUFRIX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0ZW5jaWwgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGdsLmNsZWFyU3RlbmNpbChzdGVuY2lsKTtcclxuICAgICAgICAgICAgZmxnID0gZmxnIHwgZ2wuU1RFTkNJTF9CVUZGRVJfQklUO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5jbGVhcihmbGcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNjZW5lVmlldyh4LCB5LCB3aWR0aCwgaGVpZ2h0KXtcclxuICAgICAgICBsZXQgWCA9IHggfHwgMDtcclxuICAgICAgICBsZXQgWSA9IHkgfHwgMDtcclxuICAgICAgICBsZXQgdyA9IHdpZHRoICB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBsZXQgaCA9IGhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5nbC52aWV3cG9ydChYLCBZLCB3LCBoKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3QXJyYXlzKHByaW1pdGl2ZSwgdmVydGV4Q291bnQpe1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyhwcmltaXRpdmUsIDAsIHZlcnRleENvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3RWxlbWVudHMocHJpbWl0aXZlLCBpbmRleExlbmd0aCl7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCBpbmRleExlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVmJvKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgdmJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB2Ym87XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSWJvKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgaWJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWJvKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IEludDE2QXJyYXkoZGF0YSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICByZXR1cm4gaWJvO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVRleHR1cmVGcm9tSW1hZ2Uoc291cmNlLCBudW1iZXIsIGNhbGxiYWNrKXtcclxuICAgICAgICBpZihzb3VyY2UgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1nKTtcclxuICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuUkVQRUFUKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuUkVQRUFUKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGltYWdlIGxvYWRlZDogJWMnICsgc291cmNlLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFjayAhPSBudWxsKXtjYWxsYmFjayhudW1iZXIpO31cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSBzb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGV4dHVyZUZyb21DYW52YXMoY2FudmFzLCBudW1iZXIpe1xyXG4gICAgICAgIGlmKGNhbnZhcyA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGNhbnZhcyk7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuUkVQRUFUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5SRVBFQVQpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBjYW52YXMgYXR0YWNoZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUZyYW1lYnVmZmVyKHdpZHRoLCBoZWlnaHQsIG51bWJlcil7XHJcbiAgICAgICAgaWYod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBsZXQgZnJhbWVCdWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIGxldCBkZXB0aFJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgZ2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGZUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlKTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUsIDApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGNyZWF0ZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFJlbmRlcmJ1ZmZlcjogZGVwdGhSZW5kZXJCdWZmZXIsIHRleHR1cmU6IGZUZXh0dXJlfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlckN1YmUod2lkdGgsIGhlaWdodCwgdGFyZ2V0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0W2ldLCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3ViZSBjcmVhdGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGV4dHVyZUN1YmUoc291cmNlLCB0YXJnZXQsIG51bWJlciwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHNvdXJjZSA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBjSW1nID0gW107XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNJbWdbaV0gPSB7aW1hZ2U6IG5ldyBJbWFnZSgpLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgY0ltZ1tpXS5pbWFnZS5vbmxvYWQgPSAoKGluZGV4KSA9PiB7cmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNJbWdbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZihjSW1nLmxlbmd0aCA9PT0gNil7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNJbWcubWFwKCh2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmICYmIHYubG9hZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGYgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4ID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgc291cmNlLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0W2pdLCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBjSW1nW2pdLmltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFX0NVQkVfTUFQKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBpbWFnZSBsb2FkZWQ6ICVjJyArIHNvdXJjZVswXSArICcuLi4nLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjYWxsYmFjayAhPSBudWxsKXtjYWxsYmFjayhudW1iZXIpO31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07fSkoaSk7XHJcbiAgICAgICAgICAgIGNJbWdbaV0uaW1hZ2Uuc3JjID0gc291cmNlW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiaW5kVGV4dHVyZSh1bml0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZ2wuYWN0aXZlVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkUwICsgdW5pdCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSwgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVGV4dHVyZUxvYWRlZCgpe1xyXG4gICAgICAgIGxldCBpLCBqLCBmLCBnO1xyXG4gICAgICAgIGYgPSB0cnVlOyBnID0gZmFsc2U7XHJcbiAgICAgICAgZm9yKGkgPSAwLCBqID0gdGhpcy50ZXh0dXJlcy5sZW5ndGg7IGkgPCBqOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLnRleHR1cmVzW2ldICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmID0gZiAmJiB0aGlzLnRleHR1cmVzW2ldLmxvYWRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihnKXtyZXR1cm4gZjt9ZWxzZXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tSWQodnNJZCwgZnNJZCwgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCk7XHJcbiAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21JZCh2c0lkKTtcclxuICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbUlkKGZzSWQpO1xyXG4gICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLmF0dExbaV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcudW5pTFtpXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbVNvdXJjZSh2cywgZnMsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wpO1xyXG4gICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHZzLCB0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKGZzLCB0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgbW5nLnByZyA9IG1uZy5jcmVhdGVQcm9ncmFtKG1uZy52cywgbW5nLmZzKTtcclxuICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXR0TG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcuYXR0TFtpXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICBtbmcuYXR0U1tpXSA9IGF0dFN0cmlkZVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB1bmlMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy51bmlMW2ldID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICByZXR1cm4gbW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tRmlsZSh2c1VybCwgZnNVcmwsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsKTtcclxuICAgICAgICBsZXQgc3JjID0ge1xyXG4gICAgICAgICAgICB2czoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXJsOiB2c1VybCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmczoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXJsOiBmc1VybCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIodGhpcy5nbCwgc3JjLnZzKTtcclxuICAgICAgICB4aHIodGhpcy5nbCwgc3JjLmZzKTtcclxuICAgICAgICBmdW5jdGlvbiB4aHIoZ2wsIHRhcmdldCl7XHJcbiAgICAgICAgICAgIGxldCB4bWwgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeG1sLm9wZW4oJ0dFVCcsIHRhcmdldC50YXJnZXRVcmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdDYWNoZS1Db250cm9sJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgICAgIHhtbC5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgc2hhZGVyIHNvdXJjZSBsb2FkZWQ6ICVjJyArIHRhcmdldC50YXJnZXRVcmwsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNvdXJjZSA9IHhtbC5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAgICAgICBsb2FkQ2hlY2soZ2wpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4bWwuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2FkQ2hlY2soZ2wpe1xyXG4gICAgICAgICAgICBpZihzcmMudnMuc291cmNlID09IG51bGwgfHwgc3JjLmZzLnNvdXJjZSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgICAgICBsZXQgaTtcclxuICAgICAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc3JjLnZzLnNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHNyYy5mcy5zb3VyY2UsIGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUHJvZ3JhbU1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IoZ2wpe1xyXG4gICAgICAgIHRoaXMuZ2wgICA9IGdsO1xyXG4gICAgICAgIHRoaXMudnMgICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5mcyAgID0gbnVsbDtcclxuICAgICAgICB0aGlzLnByZyAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYXR0TCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hdHRTID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVuaUwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudW5pVCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2hhZGVyRnJvbUlkKGlkKXtcclxuICAgICAgICBsZXQgc2hhZGVyO1xyXG4gICAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGlmKCFzY3JpcHRFbGVtZW50KXtyZXR1cm47fVxyXG4gICAgICAgIHN3aXRjaChzY3JpcHRFbGVtZW50LnR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlICd4LXNoYWRlci94LXZlcnRleCc6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3gtc2hhZGVyL3gtZnJhZ21lbnQnOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNjcmlwdEVsZW1lbnQudGV4dCk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGNvbXBpbGUgZmFpbGVkIG9mIHNoYWRlcjogJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShzb3VyY2UsIHR5cGUpe1xyXG4gICAgICAgIGxldCBzaGFkZXI7XHJcbiAgICAgICAgc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuVkVSVEVYX1NIQURFUjpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB0aGlzLmdsLkZSQUdNRU5UX1NIQURFUjpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpe1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZGVyO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2dyYW0odnMsIGZzKXtcclxuICAgICAgICBsZXQgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZzKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcyk7XHJcbiAgICAgICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpe1xyXG4gICAgICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9ncmFtO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBsaW5rIHByb2dyYW0gZmFpbGVkOiAnICsgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVzZVByb2dyYW0oKXtcclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5wcmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF0dHJpYnV0ZSh2Ym8sIGlibyl7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBmb3IobGV0IGkgaW4gdmJvKXtcclxuICAgICAgICAgICAgaWYodGhpcy5hdHRMW2ldID49IDApe1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZib1tpXSk7XHJcbiAgICAgICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLmF0dExbaV0pO1xyXG4gICAgICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLmF0dExbaV0sIHRoaXMuYXR0U1tpXSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpYm8gIT0gbnVsbCl7Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWJvKTt9XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaFNoYWRlcihhbnkpe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IHRoaXMudW5pVC5sZW5ndGg7IGkgPCBqOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgdW5pID0gJ3VuaWZvcm0nICsgdGhpcy51bmlUW2ldLnJlcGxhY2UoL21hdHJpeC9pLCAnTWF0cml4Jyk7XHJcbiAgICAgICAgICAgIGlmKGdsW3VuaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih1bmkuc2VhcmNoKC9NYXRyaXgvKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBmYWxzZSwgYW55W2ldKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBhbnlbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIG5vdCBzdXBwb3J0IHVuaWZvcm0gdHlwZTogJyArIHRoaXMudW5pVFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pe1xyXG4gICAgICAgIGxldCBpLCBsO1xyXG4gICAgICAgIGZvcihpID0gMCwgbCA9IGF0dExvY2F0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA9PSBudWxsIHx8IHRoaXMuYXR0TFtpXSA8IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgaW52YWxpZCBhdHRyaWJ1dGUgbG9jYXRpb246ICVjXCInICsgYXR0TG9jYXRpb25baV0gKyAnXCInLCAnY29sb3I6IGNyaW1zb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaSA9IDAsIGwgPSB1bmlMb2NhdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLnVuaUxbaV0gPT0gbnVsbCB8fCB0aGlzLnVuaUxbaV0gPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGludmFsaWQgdW5pZm9ybSBsb2NhdGlvbjogJWNcIicgKyB1bmlMb2NhdGlvbltpXSArICdcIicsICdjb2xvcjogY3JpbXNvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuZ2wzID0gd2luZG93LmdsMyB8fCBuZXcgZ2wzKCk7XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNDb3JlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==