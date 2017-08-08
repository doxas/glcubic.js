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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


gl3.create_vbo = function (data) {
    if (data == null) {
        return;
    }
    var vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    return vbo;
};

gl3.create_ibo = function (data) {
    if (data == null) {
        return;
    }
    var ibo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
};

gl3.create_texture = function (source, number, callback) {
    if (source == null || number == null) {
        return;
    }
    var img = new Image();
    var self = this;
    var gl = this.gl;
    img.onload = function () {
        self.textures[number] = { texture: null, type: null, loaded: false };
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
        if (callback != null) {
            callback(number);
        }
    };
    img.src = source;
};

gl3.create_texture_canvas = function (canvas, number) {
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
};

gl3.create_framebuffer = function (width, height, number) {
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
};

gl3.create_framebuffer_cube = function (width, height, target, number) {
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
};

gl3.create_texture_cube = function (source, target, number, callback) {
    if (source == null || target == null || number == null) {
        return;
    }
    var cImg = [];
    var gl = this.gl;
    var self = this;
    this.textures[number] = { texture: null, type: null, loaded: false };
    for (var i = 0; i < source.length; i++) {
        cImg[i] = new cubeMapImage();
        cImg[i].data.src = source[i];
    }
    function cubeMapImage() {
        this.data = new Image();
        this.data.onload = function () {
            this.imageDataLoaded = true;
            checkLoaded();
        };
    }
    function checkLoaded() {
        if (cImg[0].data.imageDataLoaded && cImg[1].data.imageDataLoaded && cImg[2].data.imageDataLoaded && cImg[3].data.imageDataLoaded && cImg[4].data.imageDataLoaded && cImg[5].data.imageDataLoaded) {
            generateCubeMap();
        }
    }
    function generateCubeMap() {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
        for (var j = 0; j < source.length; j++) {
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
        if (callback != null) {
            callback(number);
        }
    }
};

/***/ }),
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

var _gl3Creator = __webpack_require__(1);

var _gl3Creator2 = _interopRequireDefault(_gl3Creator);

var _gl3Math = __webpack_require__(2);

var _gl3Math2 = _interopRequireDefault(_gl3Math);

var _gl3Mesh = __webpack_require__(3);

var _gl3Mesh2 = _interopRequireDefault(_gl3Mesh);

var _gl3Util = __webpack_require__(4);

var _gl3Util2 = _interopRequireDefault(_gl3Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl3 = function () {
    function gl3() {
        _classCallCheck(this, gl3);

        this.VERSION = '0.0.5';
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
        this.Creator = _gl3Creator2.default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzJjMDk4ODA3NWYzMGZjNmI1YWEiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzQ3JlYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9nbDNNYXRoLmpzIiwid2VicGFjazovLy8uL2dsM01lc2guanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzVXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNDb3JlLmpzIl0sIm5hbWVzIjpbIkF1ZGlvQ3RyIiwiYmdtR2FpblZhbHVlIiwic291bmRHYWluVmFsdWUiLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJjdHgiLCJjb21wIiwiY3JlYXRlRHluYW1pY3NDb21wcmVzc29yIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiYmdtR2FpbiIsImNyZWF0ZUdhaW4iLCJnYWluIiwidmFsdWUiLCJzb3VuZEdhaW4iLCJzcmMiLCJ1cmwiLCJpbmRleCIsImxvb3AiLCJiYWNrZ3JvdW5kIiwiY2FsbGJhY2siLCJ4bWwiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwiZGVjb2RlQXVkaW9EYXRhIiwicmVzcG9uc2UiLCJidWYiLCJBdWRpb1NyYyIsImxvYWRlZCIsImNvbnNvbGUiLCJsb2ciLCJlIiwic2VuZCIsImkiLCJmIiwibGVuZ3RoIiwiYXVkaW9CdWZmZXIiLCJidWZmZXJTb3VyY2UiLCJhY3RpdmVCdWZmZXJTb3VyY2UiLCJmZnRMb29wIiwidXBkYXRlIiwibm9kZSIsImNyZWF0ZVNjcmlwdFByb2Nlc3NvciIsImFuYWx5c2VyIiwiY3JlYXRlQW5hbHlzZXIiLCJzbW9vdGhpbmdUaW1lQ29uc3RhbnQiLCJmZnRTaXplIiwib25EYXRhIiwiVWludDhBcnJheSIsImZyZXF1ZW5jeUJpbkNvdW50IiwiaiIsImsiLCJzZWxmIiwicGxheW5vdyIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImJ1ZmZlciIsInBsYXliYWNrUmF0ZSIsIm9uZW5kZWQiLCJzdG9wIiwib25hdWRpb3Byb2Nlc3MiLCJldmUiLCJvbnByb2Nlc3NFdmVudCIsInN0YXJ0IiwiZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLCJnbDMiLCJjcmVhdGVfdmJvIiwiZGF0YSIsInZibyIsImdsIiwiY3JlYXRlQnVmZmVyIiwiYmluZEJ1ZmZlciIsIkFSUkFZX0JVRkZFUiIsImJ1ZmZlckRhdGEiLCJGbG9hdDMyQXJyYXkiLCJTVEFUSUNfRFJBVyIsImNyZWF0ZV9pYm8iLCJpYm8iLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsIkludDE2QXJyYXkiLCJjcmVhdGVfdGV4dHVyZSIsInNvdXJjZSIsIm51bWJlciIsImltZyIsIkltYWdlIiwidGV4dHVyZXMiLCJ0ZXh0dXJlIiwidHlwZSIsInRleCIsImNyZWF0ZVRleHR1cmUiLCJiaW5kVGV4dHVyZSIsIlRFWFRVUkVfMkQiLCJ0ZXhJbWFnZTJEIiwiUkdCQSIsIlVOU0lHTkVEX0JZVEUiLCJnZW5lcmF0ZU1pcG1hcCIsInRleFBhcmFtZXRlcmkiLCJURVhUVVJFX01JTl9GSUxURVIiLCJMSU5FQVIiLCJURVhUVVJFX01BR19GSUxURVIiLCJURVhUVVJFX1dSQVBfUyIsIlJFUEVBVCIsIlRFWFRVUkVfV1JBUF9UIiwiY3JlYXRlX3RleHR1cmVfY2FudmFzIiwiY2FudmFzIiwiY3JlYXRlX2ZyYW1lYnVmZmVyIiwid2lkdGgiLCJoZWlnaHQiLCJmcmFtZUJ1ZmZlciIsImNyZWF0ZUZyYW1lYnVmZmVyIiwiYmluZEZyYW1lYnVmZmVyIiwiRlJBTUVCVUZGRVIiLCJkZXB0aFJlbmRlckJ1ZmZlciIsImNyZWF0ZVJlbmRlcmJ1ZmZlciIsImJpbmRSZW5kZXJidWZmZXIiLCJSRU5ERVJCVUZGRVIiLCJyZW5kZXJidWZmZXJTdG9yYWdlIiwiREVQVEhfQ09NUE9ORU5UMTYiLCJmcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlciIsIkRFUFRIX0FUVEFDSE1FTlQiLCJmVGV4dHVyZSIsIkNMQU1QX1RPX0VER0UiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkNPTE9SX0FUVEFDSE1FTlQwIiwiZnJhbWVidWZmZXIiLCJkZXB0aFJlbmRlcmJ1ZmZlciIsImNyZWF0ZV9mcmFtZWJ1ZmZlcl9jdWJlIiwidGFyZ2V0IiwiVEVYVFVSRV9DVUJFX01BUCIsImNyZWF0ZV90ZXh0dXJlX2N1YmUiLCJjSW1nIiwiY3ViZU1hcEltYWdlIiwiaW1hZ2VEYXRhTG9hZGVkIiwiY2hlY2tMb2FkZWQiLCJnZW5lcmF0ZUN1YmVNYXAiLCJnbDNNYXRoIiwidmVjMyIsIm1hdDQiLCJxdG4iLCJNYXQ0IiwiZGVzdCIsIm1hdDEiLCJtYXQyIiwiYSIsImIiLCJjIiwiZCIsImciLCJoIiwibCIsIm0iLCJuIiwibyIsInAiLCJBIiwiQiIsIkMiLCJEIiwiRSIsIkYiLCJHIiwiSCIsIkkiLCJKIiwiSyIsIkwiLCJNIiwiTiIsIk8iLCJQIiwibWF0IiwidmVjIiwiYW5nbGUiLCJheGlzIiwic3EiLCJNYXRoIiwic3FydCIsInNpbiIsImNvcyIsInEiLCJyIiwicyIsInQiLCJ1IiwidiIsInciLCJ4IiwieSIsInoiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZVgiLCJleWVZIiwiZXllWiIsInVwWCIsInVwWSIsInVwWiIsImNlbnRlclgiLCJjZW50ZXJZIiwiY2VudGVyWiIsImlkZW50aXR5IiwieDAiLCJ4MSIsIngyIiwieTAiLCJ5MSIsInkyIiwiejAiLCJ6MSIsInoyIiwiZm92eSIsImFzcGVjdCIsIm5lYXIiLCJmYXIiLCJ0YW4iLCJQSSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsIml2ZCIsImNhbSIsInZtYXQiLCJwbWF0IiwibG9va0F0IiwicG9zaXRpb24iLCJjZW50ZXJQb2ludCIsInVwRGlyZWN0aW9uIiwicGVyc3BlY3RpdmUiLCJtdWx0aXBseSIsIlZlYzMiLCJjcmVhdGUiLCJ2MCIsInYxIiwidjIiLCJ2ZWMxIiwidmVjMiIsIm5vcm1hbGl6ZSIsIlF0biIsInF0bjEiLCJxdG4yIiwiYXgiLCJheSIsImF6IiwiYXciLCJieCIsImJ5IiwiYnoiLCJidyIsInFwIiwicXEiLCJxciIsImludmVyc2UiLCJ4eCIsInh5IiwieHoiLCJ5eSIsInl6IiwienoiLCJ3eCIsInd5Iiwid3oiLCJ0aW1lIiwiaHQiLCJocyIsImFicyIsInBoIiwiYWNvcyIsInB0IiwidDAiLCJ0MSIsImdsM01lc2giLCJjb2xvciIsInRjIiwicG9zIiwibm9yIiwiY29sIiwic3QiLCJpZHgiLCJub3JtYWwiLCJ0ZXhDb29yZCIsInJvdyIsImNvbHVtbiIsImlyYWQiLCJvcmFkIiwicnIiLCJyeSIsInRyIiwidHgiLCJ0eSIsInR6IiwicngiLCJyeiIsInJzIiwicnQiLCJwdXNoIiwicmFkIiwic2lkZSIsImdsM1V0aWwiLCJ0aCIsImZsb29yIiwiQXJyYXkiLCJ0cyIsIlZFUlNJT04iLCJQSTIiLCJQSUgiLCJQSUgyIiwiVEVYVFVSRV9VTklUX0NPVU5UIiwicmVhZHkiLCJleHQiLCJBdWRpbyIsIkNyZWF0b3IiLCJNZXNoIiwiVXRpbCIsIm9wdGlvbnMiLCJvcHQiLCJIVE1MQ2FudmFzRWxlbWVudCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRDb250ZXh0IiwiZ2V0UGFyYW1ldGVyIiwiTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMiLCJkZXB0aCIsInN0ZW5jaWwiLCJmbGciLCJDT0xPUl9CVUZGRVJfQklUIiwiY2xlYXJDb2xvciIsImNsZWFyRGVwdGgiLCJERVBUSF9CVUZGRVJfQklUIiwiY2xlYXJTdGVuY2lsIiwiU1RFTkNJTF9CVUZGRVJfQklUIiwiY2xlYXIiLCJjYW1lcmEiLCJYIiwiWSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInZpZXdwb3J0IiwicHJpbWl0aXZlIiwidmVydGV4Q291bnQiLCJkcmF3QXJyYXlzIiwiaW5kZXhMZW5ndGgiLCJkcmF3RWxlbWVudHMiLCJVTlNJR05FRF9TSE9SVCIsInVuaXQiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJ2c0lkIiwiZnNJZCIsImF0dExvY2F0aW9uIiwiYXR0U3RyaWRlIiwidW5pTG9jYXRpb24iLCJ1bmlUeXBlIiwibW5nIiwiUHJvZ3JhbU1hbmFnZXIiLCJ2cyIsImNyZWF0ZVNoYWRlckZyb21JZCIsImZzIiwicHJnIiwiY3JlYXRlUHJvZ3JhbSIsImF0dEwiLCJhdHRTIiwiZ2V0QXR0cmliTG9jYXRpb24iLCJ1bmlMIiwiZ2V0VW5pZm9ybUxvY2F0aW9uIiwidW5pVCIsImxvY2F0aW9uQ2hlY2siLCJjcmVhdGVTaGFkZXJGcm9tU291cmNlIiwiVkVSVEVYX1NIQURFUiIsIkZSQUdNRU5UX1NIQURFUiIsInZzVXJsIiwiZnNVcmwiLCJ0YXJnZXRVcmwiLCJ4aHIiLCJyZXNwb25zZVRleHQiLCJsb2FkQ2hlY2siLCJpZCIsInNoYWRlciIsInNjcmlwdEVsZW1lbnQiLCJjcmVhdGVTaGFkZXIiLCJzaGFkZXJTb3VyY2UiLCJ0ZXh0IiwiY29tcGlsZVNoYWRlciIsImdldFNoYWRlclBhcmFtZXRlciIsIkNPTVBJTEVfU1RBVFVTIiwid2FybiIsImdldFNoYWRlckluZm9Mb2ciLCJwcm9ncmFtIiwiYXR0YWNoU2hhZGVyIiwibGlua1Byb2dyYW0iLCJnZXRQcm9ncmFtUGFyYW1ldGVyIiwiTElOS19TVEFUVVMiLCJ1c2VQcm9ncmFtIiwiZ2V0UHJvZ3JhbUluZm9Mb2ciLCJlbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSIsInZlcnRleEF0dHJpYlBvaW50ZXIiLCJGTE9BVCIsImFueSIsInVuaSIsInJlcGxhY2UiLCJzZWFyY2giXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FB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SUFBSW1ILENBQXZDLEVBQTBDbkgsR0FBMUMsRUFBOEM7QUFDMUMsb0JBQUcsS0FBSytVLElBQUwsQ0FBVS9VLENBQVYsS0FBZ0IsSUFBaEIsSUFBd0IsS0FBSytVLElBQUwsQ0FBVS9VLENBQVYsSUFBZSxDQUExQyxFQUE0QztBQUN4Q0osNEJBQVF5VyxJQUFSLENBQWEsb0NBQW9DbEMsWUFBWW5VLENBQVosQ0FBcEMsR0FBcUQsR0FBbEUsRUFBdUUsZ0JBQXZFO0FBQ0g7QUFDSjtBQUNKIiwiZmlsZSI6ImdsY3ViaWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzJjMDk4ODA3NWYzMGZjNmI1YWEiLCJcclxuLypcclxuICogc3RlcCAxOiBsZXQgYSA9IG5ldyBBdWRpb0N0cihiZ21HYWluVmFsdWUsIHNvdW5kR2FpblZhbHVlKSA8LSBmbG9hdCgwIHRvIDEpXHJcbiAqIHN0ZXAgMjogYS5sb2FkKHVybCwgaW5kZXgsIGxvb3AsIGJhY2tncm91bmQpIDwtIHN0cmluZywgaW50LCBib29sZWFuLCBib29sZWFuXHJcbiAqIHN0ZXAgMzogYS5zcmNbaW5kZXhdLmxvYWRlZCB0aGVuIGEuc3JjW2luZGV4XS5wbGF5KClcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb0N0ciB7XHJcbiAgICBjb25zdHJ1Y3RvcihiZ21HYWluVmFsdWUsIHNvdW5kR2FpblZhbHVlKXtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICB0eXBlb2Ygd2Via2l0QXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyB3ZWJraXRBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNvbXAgPSB0aGlzLmN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmJnbUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5nYWluLnZhbHVlID0gYmdtR2FpblZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZEdhaW4uY29ubmVjdCh0aGlzLmNvbXApO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2Fpbi5nYWluLnZhbHVlID0gc291bmRHYWluVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3JjID0gW107XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkKHVybCwgaW5kZXgsIGxvb3AsIGJhY2tncm91bmQsIGNhbGxiYWNrKXtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgbGV0IGdhaW4gPSBiYWNrZ3JvdW5kID8gdGhpcy5iZ21HYWluIDogdGhpcy5zb3VuZEdhaW47XHJcbiAgICAgICAgbGV0IHNyYyA9IHRoaXMuc3JjO1xyXG4gICAgICAgIHNyY1tpbmRleF0gPSBudWxsO1xyXG4gICAgICAgIGxldCB4bWwgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4bWwub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgICAgICB4bWwub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjdHguZGVjb2RlQXVkaW9EYXRhKHhtbC5yZXNwb25zZSwgKGJ1ZikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3JjW2luZGV4XSA9IG5ldyBBdWRpb1NyYyhjdHgsIGdhaW4sIGJ1ZiwgbG9vcCwgYmFja2dyb3VuZCk7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBhdWRpbyBudW1iZXI6ICVjJyArIGluZGV4ICsgJyVjLCBhdWRpbyBsb2FkZWQ6ICVjJyArIHVybCwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSwgKGUpID0+IHtjb25zb2xlLmxvZyhlKTt9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhtbC5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICBsb2FkQ29tcGxldGUoKXtcclxuICAgICAgICBsZXQgaSwgZjtcclxuICAgICAgICBmID0gdHJ1ZTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNyYy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGYgPSBmICYmICh0aGlzLnNyY1tpXSAhPSBudWxsKSAmJiB0aGlzLnNyY1tpXS5sb2FkZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBBdWRpb1NyYyB7XHJcbiAgICBjb25zdHJ1Y3RvcihjdHgsIGdhaW4sIGF1ZGlvQnVmZmVyLCBsb29wLCBiYWNrZ3JvdW5kKXtcclxuICAgICAgICB0aGlzLmN0eCAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGN0eDtcclxuICAgICAgICB0aGlzLmdhaW4gICAgICAgICAgICAgICAgICAgICAgICAgICA9IGdhaW47XHJcbiAgICAgICAgdGhpcy5hdWRpb0J1ZmZlciAgICAgICAgICAgICAgICAgICAgPSBhdWRpb0J1ZmZlcjtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZSAgICAgICAgICAgICAgICAgICA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQnVmZmVyU291cmNlICAgICAgICAgICAgID0gMDtcclxuICAgICAgICB0aGlzLmxvb3AgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGxvb3A7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgICAgICAgICAgICAgICAgICAgICAgICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZmdExvb3AgICAgICAgICAgICAgICAgICAgICAgICA9IDE2O1xyXG4gICAgICAgIHRoaXMudXBkYXRlICAgICAgICAgICAgICAgICAgICAgICAgID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kICAgICAgICAgICAgICAgICAgICAgPSBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIHRoaXMubm9kZSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdGhpcy5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKDIwNDgsIDEsIDEpO1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIgICAgICAgICAgICAgICAgICAgICAgID0gdGhpcy5jdHguY3JlYXRlQW5hbHlzZXIoKTtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuODtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgICAgICAgICAgICAgICA9IHRoaXMuZmZ0TG9vcCAqIDI7XHJcbiAgICAgICAgdGhpcy5vbkRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgVWludDhBcnJheSh0aGlzLmFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5KCl7XHJcbiAgICAgICAgbGV0IGksIGosIGs7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGkgPSB0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgayA9IC0xO1xyXG4gICAgICAgIGlmKGkgPiAwKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgaTsgaisrKXtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmJ1ZmZlclNvdXJjZVtqXS5wbGF5bm93KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vbal0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gajtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihrIDwgMCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGhdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICBrID0gdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVswXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICBrID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgPSBrO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXI7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ubG9vcCA9IHRoaXMubG9vcDtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5wbGF5YmFja1JhdGUudmFsdWUgPSAxLjA7XHJcbiAgICAgICAgaWYoIXRoaXMubG9vcCl7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLm9uZW5kZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5iYWNrZ3JvdW5kKXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmFuYWx5c2VyKTtcclxuICAgICAgICAgICAgdGhpcy5hbmFseXNlci5jb25uZWN0KHRoaXMubm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uYXVkaW9wcm9jZXNzID0gKGV2ZSkgPT4ge29ucHJvY2Vzc0V2ZW50KGV2ZSk7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmdhaW4pO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnN0YXJ0KDApO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnBsYXlub3cgPSB0cnVlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbnByb2Nlc3NFdmVudChldmUpe1xyXG4gICAgICAgICAgICBpZihzZWxmLnVwZGF0ZSl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShzZWxmLm9uRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCl7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2VbdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2VdLnN0b3AoMCk7XHJcbiAgICAgICAgdGhpcy5wbGF5bm93ID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM0F1ZGlvLmpzIiwiXHJcbmdsMy5jcmVhdGVfdmJvID0gZnVuY3Rpb24oZGF0YSl7XHJcbiAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICB2YXIgdmJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmJvKTtcclxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgcmV0dXJuIHZibztcclxufTtcclxuXHJcbmdsMy5jcmVhdGVfaWJvID0gZnVuY3Rpb24oZGF0YSl7XHJcbiAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICB2YXIgaWJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO1xyXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgIHJldHVybiBpYm87XHJcbn07XHJcblxyXG5nbDMuY3JlYXRlX3RleHR1cmUgPSBmdW5jdGlvbihzb3VyY2UsIG51bWJlciwgY2FsbGJhY2spe1xyXG4gICAgaWYoc291cmNlID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc2VsZi50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIHZhciB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltZyk7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuUkVQRUFUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5SRVBFQVQpO1xyXG4gICAgICAgIHNlbGYudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgIHNlbGYudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICBzZWxmLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBpbWFnZSBsb2FkZWQ6ICVjJyArIHNvdXJjZSwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgIGlmKGNhbGxiYWNrICE9IG51bGwpe2NhbGxiYWNrKG51bWJlcik7fVxyXG4gICAgfTtcclxuICAgIGltZy5zcmMgPSBzb3VyY2U7XHJcbn07XHJcblxyXG5nbDMuY3JlYXRlX3RleHR1cmVfY2FudmFzID0gZnVuY3Rpb24oY2FudmFzLCBudW1iZXIpe1xyXG4gICAgaWYoY2FudmFzID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgdmFyIHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGNhbnZhcyk7XHJcbiAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5SRVBFQVQpO1xyXG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuUkVQRUFUKTtcclxuICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBjYW52YXMgYXR0YWNoZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcblxyXG5nbDMuY3JlYXRlX2ZyYW1lYnVmZmVyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgbnVtYmVyKXtcclxuICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgdmFyIGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgdmFyIGRlcHRoUmVuZGVyQnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XHJcbiAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgZ2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgIHZhciBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlKTtcclxuICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUsIDApO1xyXG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3JlYXRlZCcsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbn07XHJcblxyXG5nbDMuY3JlYXRlX2ZyYW1lYnVmZmVyX2N1YmUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCB0YXJnZXQsIG51bWJlcil7XHJcbiAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgIHZhciBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgIHZhciBkZXB0aFJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG4gICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICB2YXIgZlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBmVGV4dHVyZSk7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKHRhcmdldFtpXSwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xyXG4gICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG4gICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGN1YmUgY3JlYXRlZCcsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbn07XHJcblxyXG5nbDMuY3JlYXRlX3RleHR1cmVfY3ViZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBudW1iZXIsIGNhbGxiYWNrKXtcclxuICAgIGlmKHNvdXJjZSA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgdmFyIGNJbWcgPSBbXTtcclxuICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBjSW1nW2ldID0gbmV3IGN1YmVNYXBJbWFnZSgpO1xyXG4gICAgICAgIGNJbWdbaV0uZGF0YS5zcmMgPSBzb3VyY2VbaV07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjdWJlTWFwSW1hZ2UoKXtcclxuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICB0aGlzLmRhdGEub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZURhdGFMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjaGVja0xvYWRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGVja0xvYWRlZCgpe1xyXG4gICAgICAgIGlmKCBjSW1nWzBdLmRhdGEuaW1hZ2VEYXRhTG9hZGVkICYmXHJcbiAgICAgICAgICAgIGNJbWdbMV0uZGF0YS5pbWFnZURhdGFMb2FkZWQgJiZcclxuICAgICAgICAgICAgY0ltZ1syXS5kYXRhLmltYWdlRGF0YUxvYWRlZCAmJlxyXG4gICAgICAgICAgICBjSW1nWzNdLmRhdGEuaW1hZ2VEYXRhTG9hZGVkICYmXHJcbiAgICAgICAgICAgIGNJbWdbNF0uZGF0YS5pbWFnZURhdGFMb2FkZWQgJiZcclxuICAgICAgICAgICAgY0ltZ1s1XS5kYXRhLmltYWdlRGF0YUxvYWRlZCl7Z2VuZXJhdGVDdWJlTWFwKCk7fVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDdWJlTWFwKCl7XHJcbiAgICAgICAgdmFyIHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0ZXgpO1xyXG4gICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBzb3VyY2UubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKHRhcmdldFtqXSwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgY0ltZ1tqXS5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgc2VsZi50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgc2VsZi50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFX0NVQkVfTUFQO1xyXG4gICAgICAgIHNlbGYudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGltYWdlIGxvYWRlZDogJWMnICsgc291cmNlWzBdICsgJy4uLicsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcclxuICAgICAgICBpZihjYWxsYmFjayAhPSBudWxsKXtjYWxsYmFjayhudW1iZXIpO31cclxuICAgIH1cclxufTtcclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM0NyZWF0b3IuanMiLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzTWF0aCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMudmVjMyA9IHZlYzM7XHJcbiAgICAgICAgdGhpcy5tYXQ0ID0gbWF0NDtcclxuICAgICAgICB0aGlzLnF0biAgPSBxdG47XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1hdDQge1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpZGVudGl0eShkZXN0KXtcclxuICAgICAgICBkZXN0WzBdICA9IDE7IGRlc3RbMV0gID0gMDsgZGVzdFsyXSAgPSAwOyBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSAwOyBkZXN0WzVdICA9IDE7IGRlc3RbNl0gID0gMDsgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gMDsgZGVzdFs5XSAgPSAwOyBkZXN0WzEwXSA9IDE7IGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IDA7IGRlc3RbMTNdID0gMDsgZGVzdFsxNF0gPSAwOyBkZXN0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0MSwgbWF0MiwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGEgPSBtYXQxWzBdLCAgYiA9IG1hdDFbMV0sICBjID0gbWF0MVsyXSwgIGQgPSBtYXQxWzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0MVs0XSwgIGYgPSBtYXQxWzVdLCAgZyA9IG1hdDFbNl0sICBoID0gbWF0MVs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdDFbOF0sICBqID0gbWF0MVs5XSwgIGsgPSBtYXQxWzEwXSwgbCA9IG1hdDFbMTFdLFxyXG4gICAgICAgICAgICBtID0gbWF0MVsxMl0sIG4gPSBtYXQxWzEzXSwgbyA9IG1hdDFbMTRdLCBwID0gbWF0MVsxNV0sXHJcbiAgICAgICAgICAgIEEgPSBtYXQyWzBdLCAgQiA9IG1hdDJbMV0sICBDID0gbWF0MlsyXSwgIEQgPSBtYXQyWzNdLFxyXG4gICAgICAgICAgICBFID0gbWF0Mls0XSwgIEYgPSBtYXQyWzVdLCAgRyA9IG1hdDJbNl0sICBIID0gbWF0Mls3XSxcclxuICAgICAgICAgICAgSSA9IG1hdDJbOF0sICBKID0gbWF0Mls5XSwgIEsgPSBtYXQyWzEwXSwgTCA9IG1hdDJbMTFdLFxyXG4gICAgICAgICAgICBNID0gbWF0MlsxMl0sIE4gPSBtYXQyWzEzXSwgTyA9IG1hdDJbMTRdLCBQID0gbWF0MlsxNV07XHJcbiAgICAgICAgZGVzdFswXSAgPSBBICogYSArIEIgKiBlICsgQyAqIGkgKyBEICogbTtcclxuICAgICAgICBkZXN0WzFdICA9IEEgKiBiICsgQiAqIGYgKyBDICogaiArIEQgKiBuO1xyXG4gICAgICAgIGRlc3RbMl0gID0gQSAqIGMgKyBCICogZyArIEMgKiBrICsgRCAqIG87XHJcbiAgICAgICAgZGVzdFszXSAgPSBBICogZCArIEIgKiBoICsgQyAqIGwgKyBEICogcDtcclxuICAgICAgICBkZXN0WzRdICA9IEUgKiBhICsgRiAqIGUgKyBHICogaSArIEggKiBtO1xyXG4gICAgICAgIGRlc3RbNV0gID0gRSAqIGIgKyBGICogZiArIEcgKiBqICsgSCAqIG47XHJcbiAgICAgICAgZGVzdFs2XSAgPSBFICogYyArIEYgKiBnICsgRyAqIGsgKyBIICogbztcclxuICAgICAgICBkZXN0WzddICA9IEUgKiBkICsgRiAqIGggKyBHICogbCArIEggKiBwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gSSAqIGEgKyBKICogZSArIEsgKiBpICsgTCAqIG07XHJcbiAgICAgICAgZGVzdFs5XSAgPSBJICogYiArIEogKiBmICsgSyAqIGogKyBMICogbjtcclxuICAgICAgICBkZXN0WzEwXSA9IEkgKiBjICsgSiAqIGcgKyBLICogayArIEwgKiBvO1xyXG4gICAgICAgIGRlc3RbMTFdID0gSSAqIGQgKyBKICogaCArIEsgKiBsICsgTCAqIHA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSBNICogYSArIE4gKiBlICsgTyAqIGkgKyBQICogbTtcclxuICAgICAgICBkZXN0WzEzXSA9IE0gKiBiICsgTiAqIGYgKyBPICogaiArIFAgKiBuO1xyXG4gICAgICAgIGRlc3RbMTRdID0gTSAqIGMgKyBOICogZyArIE8gKiBrICsgUCAqIG87XHJcbiAgICAgICAgZGVzdFsxNV0gPSBNICogZCArIE4gKiBoICsgTyAqIGwgKyBQICogcDtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2FsZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSAgPSBtYXRbMF0gICogdmVjWzBdO1xyXG4gICAgICAgIGRlc3RbMV0gID0gbWF0WzFdICAqIHZlY1swXTtcclxuICAgICAgICBkZXN0WzJdICA9IG1hdFsyXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgZGVzdFszXSAgPSBtYXRbM10gICogdmVjWzBdO1xyXG4gICAgICAgIGRlc3RbNF0gID0gbWF0WzRdICAqIHZlY1sxXTtcclxuICAgICAgICBkZXN0WzVdICA9IG1hdFs1XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgZGVzdFs2XSAgPSBtYXRbNl0gICogdmVjWzFdO1xyXG4gICAgICAgIGRlc3RbN10gID0gbWF0WzddICAqIHZlY1sxXTtcclxuICAgICAgICBkZXN0WzhdICA9IG1hdFs4XSAgKiB2ZWNbMl07XHJcbiAgICAgICAgZGVzdFs5XSAgPSBtYXRbOV0gICogdmVjWzJdO1xyXG4gICAgICAgIGRlc3RbMTBdID0gbWF0WzEwXSAqIHZlY1syXTtcclxuICAgICAgICBkZXN0WzExXSA9IG1hdFsxMV0gKiB2ZWNbMl07XHJcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xyXG4gICAgICAgIGRlc3RbMTNdID0gbWF0WzEzXTtcclxuICAgICAgICBkZXN0WzE0XSA9IG1hdFsxNF07XHJcbiAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTsgZGVzdFsxXSA9IG1hdFsxXTsgZGVzdFsyXSAgPSBtYXRbMl07ICBkZXN0WzNdICA9IG1hdFszXTtcclxuICAgICAgICBkZXN0WzRdID0gbWF0WzRdOyBkZXN0WzVdID0gbWF0WzVdOyBkZXN0WzZdICA9IG1hdFs2XTsgIGRlc3RbN10gID0gbWF0WzddO1xyXG4gICAgICAgIGRlc3RbOF0gPSBtYXRbOF07IGRlc3RbOV0gPSBtYXRbOV07IGRlc3RbMTBdID0gbWF0WzEwXTsgZGVzdFsxMV0gPSBtYXRbMTFdO1xyXG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICAqIHZlY1syXSArIG1hdFsxMl07XHJcbiAgICAgICAgZGVzdFsxM10gPSBtYXRbMV0gKiB2ZWNbMF0gKyBtYXRbNV0gKiB2ZWNbMV0gKyBtYXRbOV0gICogdmVjWzJdICsgbWF0WzEzXTtcclxuICAgICAgICBkZXN0WzE0XSA9IG1hdFsyXSAqIHZlY1swXSArIG1hdFs2XSAqIHZlY1sxXSArIG1hdFsxMF0gKiB2ZWNbMl0gKyBtYXRbMTRdO1xyXG4gICAgICAgIGRlc3RbMTVdID0gbWF0WzNdICogdmVjWzBdICsgbWF0WzddICogdmVjWzFdICsgbWF0WzExXSAqIHZlY1syXSArIG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlKG1hdCwgYW5nbGUsIGF4aXMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBzcSA9IE1hdGguc3FydChheGlzWzBdICogYXhpc1swXSArIGF4aXNbMV0gKiBheGlzWzFdICsgYXhpc1syXSAqIGF4aXNbMl0pO1xyXG4gICAgICAgIGlmKCFzcSl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xyXG4gICAgICAgIGlmKHNxICE9IDEpe3NxID0gMSAvIHNxOyBhICo9IHNxOyBiICo9IHNxOyBjICo9IHNxO31cclxuICAgICAgICBsZXQgZCA9IE1hdGguc2luKGFuZ2xlKSwgZSA9IE1hdGguY29zKGFuZ2xlKSwgZiA9IDEgLSBlLFxyXG4gICAgICAgICAgICBnID0gbWF0WzBdLCAgaCA9IG1hdFsxXSwgaSA9IG1hdFsyXSwgIGogPSBtYXRbM10sXHJcbiAgICAgICAgICAgIGsgPSBtYXRbNF0sICBsID0gbWF0WzVdLCBtID0gbWF0WzZdLCAgbiA9IG1hdFs3XSxcclxuICAgICAgICAgICAgbyA9IG1hdFs4XSwgIHAgPSBtYXRbOV0sIHEgPSBtYXRbMTBdLCByID0gbWF0WzExXSxcclxuICAgICAgICAgICAgcyA9IGEgKiBhICogZiArIGUsXHJcbiAgICAgICAgICAgIHQgPSBiICogYSAqIGYgKyBjICogZCxcclxuICAgICAgICAgICAgdSA9IGMgKiBhICogZiAtIGIgKiBkLFxyXG4gICAgICAgICAgICB2ID0gYSAqIGIgKiBmIC0gYyAqIGQsXHJcbiAgICAgICAgICAgIHcgPSBiICogYiAqIGYgKyBlLFxyXG4gICAgICAgICAgICB4ID0gYyAqIGIgKiBmICsgYSAqIGQsXHJcbiAgICAgICAgICAgIHkgPSBhICogYyAqIGYgKyBiICogZCxcclxuICAgICAgICAgICAgeiA9IGIgKiBjICogZiAtIGEgKiBkLFxyXG4gICAgICAgICAgICBBID0gYyAqIGMgKiBmICsgZTtcclxuICAgICAgICBpZihhbmdsZSl7XHJcbiAgICAgICAgICAgIGlmKG1hdCAhPSBkZXN0KXtcclxuICAgICAgICAgICAgICAgIGRlc3RbMTJdID0gbWF0WzEyXTsgZGVzdFsxM10gPSBtYXRbMTNdO1xyXG4gICAgICAgICAgICAgICAgZGVzdFsxNF0gPSBtYXRbMTRdOyBkZXN0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZXN0ID0gbWF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXN0WzBdICA9IGcgKiBzICsgayAqIHQgKyBvICogdTtcclxuICAgICAgICBkZXN0WzFdICA9IGggKiBzICsgbCAqIHQgKyBwICogdTtcclxuICAgICAgICBkZXN0WzJdICA9IGkgKiBzICsgbSAqIHQgKyBxICogdTtcclxuICAgICAgICBkZXN0WzNdICA9IGogKiBzICsgbiAqIHQgKyByICogdTtcclxuICAgICAgICBkZXN0WzRdICA9IGcgKiB2ICsgayAqIHcgKyBvICogeDtcclxuICAgICAgICBkZXN0WzVdICA9IGggKiB2ICsgbCAqIHcgKyBwICogeDtcclxuICAgICAgICBkZXN0WzZdICA9IGkgKiB2ICsgbSAqIHcgKyBxICogeDtcclxuICAgICAgICBkZXN0WzddICA9IGogKiB2ICsgbiAqIHcgKyByICogeDtcclxuICAgICAgICBkZXN0WzhdICA9IGcgKiB5ICsgayAqIHogKyBvICogQTtcclxuICAgICAgICBkZXN0WzldICA9IGggKiB5ICsgbCAqIHogKyBwICogQTtcclxuICAgICAgICBkZXN0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcclxuICAgICAgICBkZXN0WzExXSA9IGogKiB5ICsgbiAqIHogKyByICogQTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBsb29rQXQoZXllLCBjZW50ZXIsIHVwLCBkZXN0KXtcclxuICAgICAgICBsZXQgZXllWCAgICA9IGV5ZVswXSwgICAgZXllWSAgICA9IGV5ZVsxXSwgICAgZXllWiAgICA9IGV5ZVsyXSxcclxuICAgICAgICAgICAgdXBYICAgICA9IHVwWzBdLCAgICAgdXBZICAgICA9IHVwWzFdLCAgICAgdXBaICAgICA9IHVwWzJdLFxyXG4gICAgICAgICAgICBjZW50ZXJYID0gY2VudGVyWzBdLCBjZW50ZXJZID0gY2VudGVyWzFdLCBjZW50ZXJaID0gY2VudGVyWzJdO1xyXG4gICAgICAgIGlmKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKXtyZXR1cm4gTWF0NC5pZGVudGl0eShkZXN0KTt9XHJcbiAgICAgICAgbGV0IHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGw7XHJcbiAgICAgICAgejAgPSBleWVYIC0gY2VudGVyWzBdOyB6MSA9IGV5ZVkgLSBjZW50ZXJbMV07IHoyID0gZXllWiAtIGNlbnRlclsyXTtcclxuICAgICAgICBsID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xyXG4gICAgICAgIHowICo9IGw7IHoxICo9IGw7IHoyICo9IGw7XHJcbiAgICAgICAgeDAgPSB1cFkgKiB6MiAtIHVwWiAqIHoxO1xyXG4gICAgICAgIHgxID0gdXBaICogejAgLSB1cFggKiB6MjtcclxuICAgICAgICB4MiA9IHVwWCAqIHoxIC0gdXBZICogejA7XHJcbiAgICAgICAgbCA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xyXG4gICAgICAgIGlmKCFsKXtcclxuICAgICAgICAgICAgeDAgPSAwOyB4MSA9IDA7IHgyID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIHgwICo9IGw7IHgxICo9IGw7IHgyICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHkwID0gejEgKiB4MiAtIHoyICogeDE7IHkxID0gejIgKiB4MCAtIHowICogeDI7IHkyID0gejAgKiB4MSAtIHoxICogeDA7XHJcbiAgICAgICAgbCA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xyXG4gICAgICAgIGlmKCFsKXtcclxuICAgICAgICAgICAgeTAgPSAwOyB5MSA9IDA7IHkyID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIHkwICo9IGw7IHkxICo9IGw7IHkyICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlc3RbMF0gPSB4MDsgZGVzdFsxXSA9IHkwOyBkZXN0WzJdICA9IHowOyBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSA9IHgxOyBkZXN0WzVdID0geTE7IGRlc3RbNl0gID0gejE7IGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdID0geDI7IGRlc3RbOV0gPSB5MjsgZGVzdFsxMF0gPSB6MjsgZGVzdFsxMV0gPSAwO1xyXG4gICAgICAgIGRlc3RbMTJdID0gLSh4MCAqIGV5ZVggKyB4MSAqIGV5ZVkgKyB4MiAqIGV5ZVopO1xyXG4gICAgICAgIGRlc3RbMTNdID0gLSh5MCAqIGV5ZVggKyB5MSAqIGV5ZVkgKyB5MiAqIGV5ZVopO1xyXG4gICAgICAgIGRlc3RbMTRdID0gLSh6MCAqIGV5ZVggKyB6MSAqIGV5ZVkgKyB6MiAqIGV5ZVopO1xyXG4gICAgICAgIGRlc3RbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgZGVzdCl7XHJcbiAgICAgICAgbGV0IHQgPSBuZWFyICogTWF0aC50YW4oZm92eSAqIE1hdGguUEkgLyAzNjApO1xyXG4gICAgICAgIGxldCByID0gdCAqIGFzcGVjdDtcclxuICAgICAgICBsZXQgYSA9IHIgKiAyLCBiID0gdCAqIDIsIGMgPSBmYXIgLSBuZWFyO1xyXG4gICAgICAgIGRlc3RbMF0gID0gbmVhciAqIDIgLyBhO1xyXG4gICAgICAgIGRlc3RbMV0gID0gMDtcclxuICAgICAgICBkZXN0WzJdICA9IDA7XHJcbiAgICAgICAgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0gMDtcclxuICAgICAgICBkZXN0WzVdICA9IG5lYXIgKiAyIC8gYjtcclxuICAgICAgICBkZXN0WzZdICA9IDA7XHJcbiAgICAgICAgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gMDtcclxuICAgICAgICBkZXN0WzldICA9IDA7XHJcbiAgICAgICAgZGVzdFsxMF0gPSAtKGZhciArIG5lYXIpIC8gYztcclxuICAgICAgICBkZXN0WzExXSA9IC0xO1xyXG4gICAgICAgIGRlc3RbMTJdID0gMDtcclxuICAgICAgICBkZXN0WzEzXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxNF0gPSAtKGZhciAqIG5lYXIgKiAyKSAvIGM7XHJcbiAgICAgICAgZGVzdFsxNV0gPSAwO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9ydGhvKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyLCBkZXN0KSB7XHJcbiAgICAgICAgbGV0IGggPSAocmlnaHQgLSBsZWZ0KTtcclxuICAgICAgICBsZXQgdiA9ICh0b3AgLSBib3R0b20pO1xyXG4gICAgICAgIGxldCBkID0gKGZhciAtIG5lYXIpO1xyXG4gICAgICAgIGRlc3RbMF0gID0gMiAvIGg7XHJcbiAgICAgICAgZGVzdFsxXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbMl0gID0gMDtcclxuICAgICAgICBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNV0gID0gMiAvIHY7XHJcbiAgICAgICAgZGVzdFs2XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IDA7XHJcbiAgICAgICAgZGVzdFs5XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbMTBdID0gLTIgLyBkO1xyXG4gICAgICAgIGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIGg7XHJcbiAgICAgICAgZGVzdFsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB2O1xyXG4gICAgICAgIGRlc3RbMTRdID0gLShmYXIgKyBuZWFyKSAvIGQ7XHJcbiAgICAgICAgZGVzdFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zcG9zZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gID0gbWF0WzBdOyAgZGVzdFsxXSAgPSBtYXRbNF07XHJcbiAgICAgICAgZGVzdFsyXSAgPSBtYXRbOF07ICBkZXN0WzNdICA9IG1hdFsxMl07XHJcbiAgICAgICAgZGVzdFs0XSAgPSBtYXRbMV07ICBkZXN0WzVdICA9IG1hdFs1XTtcclxuICAgICAgICBkZXN0WzZdICA9IG1hdFs5XTsgIGRlc3RbN10gID0gbWF0WzEzXTtcclxuICAgICAgICBkZXN0WzhdICA9IG1hdFsyXTsgIGRlc3RbOV0gID0gbWF0WzZdO1xyXG4gICAgICAgIGRlc3RbMTBdID0gbWF0WzEwXTsgZGVzdFsxMV0gPSBtYXRbMTRdO1xyXG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzNdOyAgZGVzdFsxM10gPSBtYXRbN107XHJcbiAgICAgICAgZGVzdFsxNF0gPSBtYXRbMTFdOyBkZXN0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaW52ZXJzZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBhID0gbWF0WzBdLCAgYiA9IG1hdFsxXSwgIGMgPSBtYXRbMl0sICBkID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0WzRdLCAgZiA9IG1hdFs1XSwgIGcgPSBtYXRbNl0sICBoID0gbWF0WzddLFxyXG4gICAgICAgICAgICBpID0gbWF0WzhdLCAgaiA9IG1hdFs5XSwgIGsgPSBtYXRbMTBdLCBsID0gbWF0WzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV0sXHJcbiAgICAgICAgICAgIHEgPSBhICogZiAtIGIgKiBlLCByID0gYSAqIGcgLSBjICogZSxcclxuICAgICAgICAgICAgcyA9IGEgKiBoIC0gZCAqIGUsIHQgPSBiICogZyAtIGMgKiBmLFxyXG4gICAgICAgICAgICB1ID0gYiAqIGggLSBkICogZiwgdiA9IGMgKiBoIC0gZCAqIGcsXHJcbiAgICAgICAgICAgIHcgPSBpICogbiAtIGogKiBtLCB4ID0gaSAqIG8gLSBrICogbSxcclxuICAgICAgICAgICAgeSA9IGkgKiBwIC0gbCAqIG0sIHogPSBqICogbyAtIGsgKiBuLFxyXG4gICAgICAgICAgICBBID0gaiAqIHAgLSBsICogbiwgQiA9IGsgKiBwIC0gbCAqIG8sXHJcbiAgICAgICAgICAgIGl2ZCA9IDEgLyAocSAqIEIgLSByICogQSArIHMgKiB6ICsgdCAqIHkgLSB1ICogeCArIHYgKiB3KTtcclxuICAgICAgICBkZXN0WzBdICA9ICggZiAqIEIgLSBnICogQSArIGggKiB6KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzFdICA9ICgtYiAqIEIgKyBjICogQSAtIGQgKiB6KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzJdICA9ICggbiAqIHYgLSBvICogdSArIHAgKiB0KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzNdICA9ICgtaiAqIHYgKyBrICogdSAtIGwgKiB0KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzRdICA9ICgtZSAqIEIgKyBnICogeSAtIGggKiB4KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzVdICA9ICggYSAqIEIgLSBjICogeSArIGQgKiB4KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzZdICA9ICgtbSAqIHYgKyBvICogcyAtIHAgKiByKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzddICA9ICggaSAqIHYgLSBrICogcyArIGwgKiByKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzhdICA9ICggZSAqIEEgLSBmICogeSArIGggKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzldICA9ICgtYSAqIEEgKyBiICogeSAtIGQgKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzEwXSA9ICggbSAqIHUgLSBuICogcyArIHAgKiBxKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzExXSA9ICgtaSAqIHUgKyBqICogcyAtIGwgKiBxKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzEyXSA9ICgtZSAqIHogKyBmICogeCAtIGcgKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzEzXSA9ICggYSAqIHogLSBiICogeCArIGMgKiB3KSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzE0XSA9ICgtbSAqIHQgKyBuICogciAtIG8gKiBxKSAqIGl2ZDtcclxuICAgICAgICBkZXN0WzE1XSA9ICggaSAqIHQgLSBqICogciArIGsgKiBxKSAqIGl2ZDtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyB2cEZyb21DYW1lcmEoY2FtLCB2bWF0LCBwbWF0LCBkZXN0KXtcclxuICAgICAgICBNYXQ0Lmxvb2tBdChjYW0ucG9zaXRpb24sIGNhbS5jZW50ZXJQb2ludCwgY2FtLnVwRGlyZWN0aW9uLCB2bWF0KTtcclxuICAgICAgICBNYXQ0LnBlcnNwZWN0aXZlKGNhbS5mb3Z5LCBjYW0uYXNwZWN0LCBjYW0ubmVhciwgY2FtLmZhciwgcG1hdCk7XHJcbiAgICAgICAgTWF0NC5tdWx0aXBseShwbWF0LCB2bWF0LCBkZXN0KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVmVjMyB7XHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKHYpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh2WzBdICogdlswXSArIHZbMV0gKiB2WzFdICsgdlsyXSAqIHZbMl0pO1xyXG4gICAgICAgIGlmKGwgPiAwKXtcclxuICAgICAgICAgICAgbGV0IGUgPSAxLjAgLyBsO1xyXG4gICAgICAgICAgICBuWzBdID0gdlswXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMV0gPSB2WzFdICogZTtcclxuICAgICAgICAgICAgblsyXSA9IHZbMl0gKiBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIHN0YXRpYyBkb3QodjAsIHYxKXtcclxuICAgICAgICByZXR1cm4gdjBbMF0gKiB2MVswXSArIHYwWzFdICogdjFbMV0gKyB2MFsyXSAqIHYxWzJdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNyb3NzKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIG5bMF0gPSB2MFsxXSAqIHYxWzJdIC0gdjBbMl0gKiB2MVsxXTtcclxuICAgICAgICBuWzFdID0gdjBbMl0gKiB2MVswXSAtIHYwWzBdICogdjFbMl07XHJcbiAgICAgICAgblsyXSA9IHYwWzBdICogdjFbMV0gLSB2MFsxXSAqIHYxWzBdO1xyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGZhY2VOb3JtYWwodjAsIHYxLCB2Mil7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCB2ZWMxID0gW3YxWzBdIC0gdjBbMF0sIHYxWzFdIC0gdjBbMV0sIHYxWzJdIC0gdjBbMl1dO1xyXG4gICAgICAgIGxldCB2ZWMyID0gW3YyWzBdIC0gdjBbMF0sIHYyWzFdIC0gdjBbMV0sIHYyWzJdIC0gdjBbMl1dO1xyXG4gICAgICAgIG5bMF0gPSB2ZWMxWzFdICogdmVjMlsyXSAtIHZlYzFbMl0gKiB2ZWMyWzFdO1xyXG4gICAgICAgIG5bMV0gPSB2ZWMxWzJdICogdmVjMlswXSAtIHZlYzFbMF0gKiB2ZWMyWzJdO1xyXG4gICAgICAgIG5bMl0gPSB2ZWMxWzBdICogdmVjMlsxXSAtIHZlYzFbMV0gKiB2ZWMyWzBdO1xyXG4gICAgICAgIHJldHVybiBWZWMzLm5vcm1hbGl6ZShuKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXRuIHtcclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpZGVudGl0eShkZXN0KXtcclxuICAgICAgICBkZXN0WzBdID0gMDsgZGVzdFsxXSA9IDA7IGRlc3RbMl0gPSAwOyBkZXN0WzNdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpbnZlcnNlKHF0biwgZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSA9IC1xdG5bMF07XHJcbiAgICAgICAgZGVzdFsxXSA9IC1xdG5bMV07XHJcbiAgICAgICAgZGVzdFsyXSA9IC1xdG5bMl07XHJcbiAgICAgICAgZGVzdFszXSA9ICBxdG5bM107XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKGRlc3Qpe1xyXG4gICAgICAgIGxldCB4ID0gZGVzdFswXSwgeSA9IGRlc3RbMV0sIHogPSBkZXN0WzJdLCB3ID0gZGVzdFszXTtcclxuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XHJcbiAgICAgICAgaWYobCA9PT0gMCl7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSAwO1xyXG4gICAgICAgICAgICBkZXN0WzFdID0gMDtcclxuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XHJcbiAgICAgICAgICAgIGRlc3RbM10gPSAwO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSB4ICogbDtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IHkgKiBsO1xyXG4gICAgICAgICAgICBkZXN0WzJdID0geiAqIGw7XHJcbiAgICAgICAgICAgIGRlc3RbM10gPSB3ICogbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkocXRuMSwgcXRuMiwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGF4ID0gcXRuMVswXSwgYXkgPSBxdG4xWzFdLCBheiA9IHF0bjFbMl0sIGF3ID0gcXRuMVszXTtcclxuICAgICAgICBsZXQgYnggPSBxdG4yWzBdLCBieSA9IHF0bjJbMV0sIGJ6ID0gcXRuMlsyXSwgYncgPSBxdG4yWzNdO1xyXG4gICAgICAgIGRlc3RbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xyXG4gICAgICAgIGRlc3RbMV0gPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6O1xyXG4gICAgICAgIGRlc3RbMl0gPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4O1xyXG4gICAgICAgIGRlc3RbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZShhbmdsZSwgYXhpcywgZGVzdCl7XHJcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XHJcbiAgICAgICAgaWYoIXNxKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XHJcbiAgICAgICAgaWYoc3EgIT0gMSl7c3EgPSAxIC8gc3E7IGEgKj0gc3E7IGIgKj0gc3E7IGMgKj0gc3E7fVxyXG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4oYW5nbGUgKiAwLjUpO1xyXG4gICAgICAgIGRlc3RbMF0gPSBhICogcztcclxuICAgICAgICBkZXN0WzFdID0gYiAqIHM7XHJcbiAgICAgICAgZGVzdFsyXSA9IGMgKiBzO1xyXG4gICAgICAgIGRlc3RbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdG9WZWNJSUkodmVjLCBxdG4sIGRlc3Qpe1xyXG4gICAgICAgIGxldCBxcCA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgcXEgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IHFyID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIFF0bi5pbnZlcnNlKHF0biwgcXIpO1xyXG4gICAgICAgIHFwWzBdID0gdmVjWzBdO1xyXG4gICAgICAgIHFwWzFdID0gdmVjWzFdO1xyXG4gICAgICAgIHFwWzJdID0gdmVjWzJdO1xyXG4gICAgICAgIFF0bi5tdWx0aXBseShxciwgcXAsIHFxKTtcclxuICAgICAgICBRdG4ubXVsdGlwbHkocXEsIHF0biwgcXIpO1xyXG4gICAgICAgIGRlc3RbMF0gPSBxclswXTtcclxuICAgICAgICBkZXN0WzFdID0gcXJbMV07XHJcbiAgICAgICAgZGVzdFsyXSA9IHFyWzJdO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRvTWF0SVYocXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgeCA9IHF0blswXSwgeSA9IHF0blsxXSwgeiA9IHF0blsyXSwgdyA9IHF0blszXTtcclxuICAgICAgICBsZXQgeDIgPSB4ICsgeCwgeTIgPSB5ICsgeSwgejIgPSB6ICsgejtcclxuICAgICAgICBsZXQgeHggPSB4ICogeDIsIHh5ID0geCAqIHkyLCB4eiA9IHggKiB6MjtcclxuICAgICAgICBsZXQgeXkgPSB5ICogeTIsIHl6ID0geSAqIHoyLCB6eiA9IHogKiB6MjtcclxuICAgICAgICBsZXQgd3ggPSB3ICogeDIsIHd5ID0gdyAqIHkyLCB3eiA9IHcgKiB6MjtcclxuICAgICAgICBkZXN0WzBdICA9IDEgLSAoeXkgKyB6eik7XHJcbiAgICAgICAgZGVzdFsxXSAgPSB4eSAtIHd6O1xyXG4gICAgICAgIGRlc3RbMl0gID0geHogKyB3eTtcclxuICAgICAgICBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSB4eSArIHd6O1xyXG4gICAgICAgIGRlc3RbNV0gID0gMSAtICh4eCArIHp6KTtcclxuICAgICAgICBkZXN0WzZdICA9IHl6IC0gd3g7XHJcbiAgICAgICAgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0geHogLSB3eTtcclxuICAgICAgICBkZXN0WzldICA9IHl6ICsgd3g7XHJcbiAgICAgICAgZGVzdFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xyXG4gICAgICAgIGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxM10gPSAwO1xyXG4gICAgICAgIGRlc3RbMTRdID0gMDtcclxuICAgICAgICBkZXN0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2xlcnAocXRuMSwgcXRuMiwgdGltZSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGh0ID0gcXRuMVswXSAqIHF0bjJbMF0gKyBxdG4xWzFdICogcXRuMlsxXSArIHF0bjFbMl0gKiBxdG4yWzJdICsgcXRuMVszXSAqIHF0bjJbM107XHJcbiAgICAgICAgbGV0IGhzID0gMS4wIC0gaHQgKiBodDtcclxuICAgICAgICBpZihocyA8PSAwLjApe1xyXG4gICAgICAgICAgICBkZXN0WzBdID0gcXRuMVswXTtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV07XHJcbiAgICAgICAgICAgIGRlc3RbMl0gPSBxdG4xWzJdO1xyXG4gICAgICAgICAgICBkZXN0WzNdID0gcXRuMVszXTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xyXG4gICAgICAgICAgICBpZihNYXRoLmFicyhocykgPCAwLjAwMDEpe1xyXG4gICAgICAgICAgICAgICAgZGVzdFswXSA9IChxdG4xWzBdICogMC41ICsgcXRuMlswXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzFdID0gKHF0bjFbMV0gKiAwLjUgKyBxdG4yWzFdICogMC41KTtcclxuICAgICAgICAgICAgICAgIGRlc3RbMl0gPSAocXRuMVsyXSAqIDAuNSArIHF0bjJbMl0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgZGVzdFszXSA9IChxdG4xWzNdICogMC41ICsgcXRuMlszXSAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbGV0IHBoID0gTWF0aC5hY29zKGh0KTtcclxuICAgICAgICAgICAgICAgIGxldCBwdCA9IHBoICogdGltZTtcclxuICAgICAgICAgICAgICAgIGxldCB0MCA9IE1hdGguc2luKHBoIC0gcHQpIC8gaHM7XHJcbiAgICAgICAgICAgICAgICBsZXQgdDEgPSBNYXRoLnNpbihwdCkgLyBocztcclxuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdICogdDAgKyBxdG4yWzBdICogdDE7XHJcbiAgICAgICAgICAgICAgICBkZXN0WzFdID0gcXRuMVsxXSAqIHQwICsgcXRuMlsxXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgZGVzdFsyXSA9IHF0bjFbMl0gKiB0MCArIHF0bjJbMl0gKiB0MTtcclxuICAgICAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdICogdDAgKyBxdG4yWzNdICogdDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzTWF0aC5qcyIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNNZXNoIHtcclxuICAgIHN0YXRpYyBwbGFuZSh3aWR0aCwgaGVpZ2h0LCBjb2xvcil7XHJcbiAgICAgICAgbGV0IHcsIGg7XHJcbiAgICAgICAgdyA9IHdpZHRoIC8gMjtcclxuICAgICAgICBoID0gaGVpZ2h0IC8gMjtcclxuICAgICAgICBpZihjb2xvcil7XHJcbiAgICAgICAgICAgIHRjID0gY29sb3I7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRjID0gWzEuMCwgMS4wLCAxLjAsIDEuMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwb3MgPSBbXHJcbiAgICAgICAgICAgIC13LCAgaCwgIDAuMCxcclxuICAgICAgICAgICAgIHcsICBoLCAgMC4wLFxyXG4gICAgICAgICAgICAtdywgLWgsICAwLjAsXHJcbiAgICAgICAgICAgICB3LCAtaCwgIDAuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IG5vciA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGNvbCA9IFtcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBzdCAgPSBbXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLFxyXG4gICAgICAgICAgICAxLjAsIDAuMCxcclxuICAgICAgICAgICAgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDEuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgaWR4ID0gW1xyXG4gICAgICAgICAgICAwLCAxLCAyLFxyXG4gICAgICAgICAgICAyLCAxLCAzXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdG9ydXMocm93LCBjb2x1bW4sIGlyYWQsIG9yYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnIgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ5ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcclxuICAgICAgICAgICAgICAgIGlmKHJ0ID4gMS4wKXtydCAtPSAxLjA7fVxyXG4gICAgICAgICAgICAgICAgcnQgPSAxLjAgLSBydDtcclxuICAgICAgICAgICAgICAgIHBvcy5wdXNoKHR4LCB0eSwgdHopO1xyXG4gICAgICAgICAgICAgICAgbm9yLnB1c2gocngsIHJ5LCByeik7XHJcbiAgICAgICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgICAgICAgICBzdC5wdXNoKHJzLCBydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICByID0gKGNvbHVtbiArIDEpICogaSArIGo7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMSwgciArIDEpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociArIGNvbHVtbiArIDEsIHIgKyBjb2x1bW4gKyAyLCByICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHNwaGVyZShyb3csIGNvbHVtbiwgcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJyID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XHJcbiAgICAgICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcclxuICAgICAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgciA9IDA7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICByID0gKGNvbHVtbiArIDEpICogaSArIGo7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgMSwgciArIGNvbHVtbiArIDIpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIGNvbHVtbiArIDIsIHIgKyBjb2x1bW4gKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY3ViZShzaWRlLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGhzID0gc2lkZSAqIDAuNTtcclxuICAgICAgICBsZXQgcG9zID0gW1xyXG4gICAgICAgICAgICAtaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsIC1ocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsICBocywgLWhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAgaHMsIC1ocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgLWhzXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbm9yID0gW1xyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAtMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLFxyXG4gICAgICAgICAgICAgMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLFxyXG4gICAgICAgICAgICAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAtMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAgMS4wLCAtMS4wLCAgMS4wLCAtMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgY29sID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHBvcy5sZW5ndGggLyAzOyBpKyspe1xyXG4gICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzdCA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGlkeCA9IFtcclxuICAgICAgICAgICAgIDAsICAxLCAgMiwgIDAsICAyLCAgMyxcclxuICAgICAgICAgICAgIDQsICA1LCAgNiwgIDQsICA2LCAgNyxcclxuICAgICAgICAgICAgIDgsICA5LCAxMCwgIDgsIDEwLCAxMSxcclxuICAgICAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSxcclxuICAgICAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSxcclxuICAgICAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyM1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNNZXNoLmpzIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM1V0aWwge1xyXG4gICAgc3RhdGljIGhzdmEoaCwgcywgdiwgYSl7XHJcbiAgICAgICAgaWYocyA+IDEgfHwgdiA+IDEgfHwgYSA+IDEpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IHRoID0gaCAlIDM2MDtcclxuICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IodGggLyA2MCk7XHJcbiAgICAgICAgbGV0IGYgPSB0aCAvIDYwIC0gaTtcclxuICAgICAgICBsZXQgbSA9IHYgKiAoMSAtIHMpO1xyXG4gICAgICAgIGxldCBuID0gdiAqICgxIC0gcyAqIGYpO1xyXG4gICAgICAgIGxldCBrID0gdiAqICgxIC0gcyAqICgxIC0gZikpO1xyXG4gICAgICAgIGxldCBjb2xvciA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIGlmKCFzID4gMCAmJiAhcyA8IDApe1xyXG4gICAgICAgICAgICBjb2xvci5wdXNoKHYsIHYsIHYsIGEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByID0gbmV3IEFycmF5KHYsIG4sIG0sIG0sIGssIHYpO1xyXG4gICAgICAgICAgICBsZXQgZyA9IG5ldyBBcnJheShrLCB2LCB2LCBuLCBtLCBtKTtcclxuICAgICAgICAgICAgbGV0IGIgPSBuZXcgQXJyYXkobSwgbSwgaywgdiwgdiwgbik7XHJcbiAgICAgICAgICAgIGNvbG9yLnB1c2gocltpXSwgZ1tpXSwgYltpXSwgYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgIH1cclxuICAgIHN0YXRpYyBlYXNlTGluZXIodCl7XHJcbiAgICAgICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGVhc2VPdXRDdWJpYyh0KXtcclxuICAgICAgICByZXR1cm4gKHQgPSB0IC8gMSAtIDEpICogdCAqIHQgKyAxO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGVhc2VRdWludGljKHQpe1xyXG4gICAgICAgIGxldCB0cyA9ICh0ID0gdCAvIDEpICogdDtcclxuICAgICAgICBsZXQgdGMgPSB0cyAqIHQ7XHJcbiAgICAgICAgcmV0dXJuICh0YyAqIHRzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM1V0aWwuanMiLCJcclxuaW1wb3J0IGF1ZGlvICAgZnJvbSAnLi9nbDNBdWRpby5qcyc7XHJcbmltcG9ydCBjcmVhdG9yIGZyb20gJy4vZ2wzQ3JlYXRvci5qcyc7XHJcbmltcG9ydCBtYXRoICAgIGZyb20gJy4vZ2wzTWF0aC5qcyc7XHJcbmltcG9ydCBtZXNoICAgIGZyb20gJy4vZ2wzTWVzaC5qcyc7XHJcbmltcG9ydCB1dGlsICAgIGZyb20gJy4vZ2wzVXRpbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDMge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLlZFUlNJT04gPSAnMC4wLjUnO1xyXG4gICAgICAgIHRoaXMuUEkyICA9IDYuMjgzMTg1MzA3MTc5NTg2NDc2OTI1Mjg2NzY2NTU5MDA1NzY7XHJcbiAgICAgICAgdGhpcy5QSSAgID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODtcclxuICAgICAgICB0aGlzLlBJSCAgPSAxLjU3MDc5NjMyNjc5NDg5NjYxOTIzMTMyMTY5MTYzOTc1MTQ0O1xyXG4gICAgICAgIHRoaXMuUElIMiA9IDAuNzg1Mzk4MTYzMzk3NDQ4MzA5NjE1NjYwODQ1ODE5ODc1NzI7XHJcbiAgICAgICAgdGhpcy5URVhUVVJFX1VOSVRfQ09VTlQgPSBudWxsO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBnbEN1YmljLmpzICVj4peGJWMgOiB2ZXJzaW9uICVjJyArIGdsMy5WRVJTSU9OLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogcm95YWxibHVlJyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVhZHkgICAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgID0gbnVsbDtcclxuICAgICAgICB0aGlzLmdsICAgICAgID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmV4dCAgICAgID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5BdWRpbyAgID0gYXVkaW87XHJcbiAgICAgICAgdGhpcy5DcmVhdG9yID0gY3JlYXRvcjtcclxuICAgICAgICB0aGlzLk1hdGggICAgPSBtYXRoO1xyXG4gICAgICAgIHRoaXMuTWVzaCAgICA9IG1lc2g7XHJcbiAgICAgICAgdGhpcy5VdGlsICAgID0gdXRpbDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KGNhbnZhcywgb3B0aW9ucyl7XHJcbiAgICAgICAgbGV0IG9wdCA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIGlmKGNhbnZhcyA9PSBudWxsKXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIGlmKGNhbnZhcyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfWVsc2UgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGNhbnZhcykgPT09ICdbb2JqZWN0IFN0cmluZ10nKXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmNhbnZhcyA9PSBudWxsKXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdCkgfHxcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJywgb3B0KTtcclxuICAgICAgICBpZih0aGlzLmdsICE9IG51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5URVhUVVJFX1VOSVRfQ09VTlQgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLk1BWF9DT01CSU5FRF9URVhUVVJFX0lNQUdFX1VOSVRTKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlcyA9IG5ldyBBcnJheSh0aGlzLlRFWFRVUkVfVU5JVF9DT1VOVCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIHNjZW5lQ2xlYXIoY29sb3IsIGRlcHRoLCBzdGVuY2lsKXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCBmbGcgPSBnbC5DT0xPUl9CVUZGRVJfQklUO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIGlmKGRlcHRoICE9IG51bGwpe1xyXG4gICAgICAgICAgICBnbC5jbGVhckRlcHRoKGRlcHRoKTtcclxuICAgICAgICAgICAgZmxnID0gZmxnIHwgZ2wuREVQVEhfQlVGRkVSX0JJVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3RlbmNpbCAhPSBudWxsKXtcclxuICAgICAgICAgICAgZ2wuY2xlYXJTdGVuY2lsKHN0ZW5jaWwpO1xyXG4gICAgICAgICAgICBmbGcgPSBmbGcgfCBnbC5TVEVOQ0lMX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLmNsZWFyKGZsZyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2NlbmVWaWV3KGNhbWVyYSwgeCwgeSwgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgICAgbGV0IFggPSB4IHx8IDA7XHJcbiAgICAgICAgbGV0IFkgPSB5IHx8IDA7XHJcbiAgICAgICAgbGV0IHcgPSB3aWR0aCAgfHwgd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSBoZWlnaHQgfHwgd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2wudmlld3BvcnQoWCwgWSwgdywgaCk7XHJcbiAgICAgICAgaWYoY2FtZXJhICE9IG51bGwpe2NhbWVyYS5hc3BlY3QgPSB3IC8gaDt9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0FycmF5cyhwcmltaXRpdmUsIHZlcnRleENvdW50KXtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXMocHJpbWl0aXZlLCAwLCB2ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgpe1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRUZXh0dXJlKHVuaXQsIG51bWJlcil7XHJcbiAgICAgICAgaWYodGhpcy50ZXh0dXJlc1tudW1iZXJdID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5hY3RpdmVUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRTAgKyB1bml0KTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlLCB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUZXh0dXJlTG9hZGVkKCl7XHJcbiAgICAgICAgbGV0IGksIGosIGYsIGc7XHJcbiAgICAgICAgZiA9IHRydWU7IGcgPSBmYWxzZTtcclxuICAgICAgICBmb3IoaSA9IDAsIGogPSB0aGlzLnRleHR1cmVzLmxlbmd0aDsgaSA8IGo7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGV4dHVyZXNbaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGYgPSBmICYmIHRoaXMudGV4dHVyZXNbaV0ubG9hZGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGcpe3JldHVybiBmO31lbHNle3JldHVybiBmYWxzZTt9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvZ3JhbUZyb21JZCh2c0lkLCBmc0lkLCBhdHRMb2NhdGlvbiwgYXR0U3RyaWRlLCB1bmlMb2NhdGlvbiwgdW5pVHlwZSl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsKTtcclxuICAgICAgICBtbmcudnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbUlkKHZzSWQpO1xyXG4gICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tSWQoZnNJZCk7XHJcbiAgICAgICAgbW5nLnByZyA9IG1uZy5jcmVhdGVQcm9ncmFtKG1uZy52cywgbW5nLmZzKTtcclxuICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXR0TG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcuYXR0TFtpXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICBtbmcuYXR0U1tpXSA9IGF0dFN0cmlkZVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB1bmlMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy51bmlMW2ldID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICByZXR1cm4gbW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tU291cmNlKHZzLCBmcywgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCk7XHJcbiAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2UodnMsIHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2UoZnMsIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgbW5nLmF0dFMgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihtbmcucHJnLCBhdHRMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pTCA9IG5ldyBBcnJheSh1bmlMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihtbmcucHJnLCB1bmlMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICBtbmcubG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pO1xyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvZ3JhbUZyb21GaWxlKHZzVXJsLCBmc1VybCwgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUsIGNhbGxiYWNrKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wpO1xyXG4gICAgICAgIGxldCBzcmMgPSB7XHJcbiAgICAgICAgICAgIHZzOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRVcmw6IHZzVXJsLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZzOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRVcmw6IGZzVXJsLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMudnMpO1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMuZnMpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHhocihnbCwgdGFyZ2V0KXtcclxuICAgICAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4bWwub3BlbignR0VUJywgdGFyZ2V0LnRhcmdldFVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBzaGFkZXIgc291cmNlIGxvYWRlZDogJWMnICsgdGFyZ2V0LnRhcmdldFVybCwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuc291cmNlID0geG1sLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgIGxvYWRDaGVjayhnbCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhtbC5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRDaGVjayhnbCl7XHJcbiAgICAgICAgICAgIGlmKHNyYy52cy5zb3VyY2UgPT0gbnVsbCB8fCBzcmMuZnMuc291cmNlID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgICAgIGxldCBpO1xyXG4gICAgICAgICAgICBtbmcudnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShzcmMudnMuc291cmNlLCBnbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc3JjLmZzLnNvdXJjZSwgZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgbW5nLnByZyA9IG1uZy5jcmVhdGVQcm9ncmFtKG1uZy52cywgbW5nLmZzKTtcclxuICAgICAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgbW5nLmF0dFMgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXR0TG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbW5nLmF0dExbaV0gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihtbmcucHJnLCBhdHRMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgICAgICBtbmcuYXR0U1tpXSA9IGF0dFN0cmlkZVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtbmcudW5pTCA9IG5ldyBBcnJheSh1bmlMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB1bmlMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBtbmcudW5pTFtpXSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihtbmcucHJnLCB1bmlMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgICAgICBtbmcubG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pO1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW5nO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQcm9ncmFtTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihnbCl7XHJcbiAgICAgICAgdGhpcy5nbCAgID0gZ2w7XHJcbiAgICAgICAgdGhpcy52cyAgID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZzICAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucHJnICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hdHRMID0gbnVsbDtcclxuICAgICAgICB0aGlzLmF0dFMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudW5pTCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51bmlUID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTaGFkZXJGcm9tSWQoaWQpe1xyXG4gICAgICAgIGxldCBzaGFkZXI7XHJcbiAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgaWYoIXNjcmlwdEVsZW1lbnQpe3JldHVybjt9XHJcbiAgICAgICAgc3dpdGNoKHNjcmlwdEVsZW1lbnQudHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ3gtc2hhZGVyL3gtdmVydGV4JzpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAneC1zaGFkZXIveC1mcmFnbWVudCc6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2NyaXB0RWxlbWVudC50ZXh0KTtcclxuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY29tcGlsZSBmYWlsZWQgb2Ygc2hhZGVyOiAnICsgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTaGFkZXJGcm9tU291cmNlKHNvdXJjZSwgdHlwZSl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgdGhpcy5nbC5WRVJURVhfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGNvbXBpbGUgZmFpbGVkIG9mIHNoYWRlcjogJyArIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvZ3JhbSh2cywgZnMpe1xyXG4gICAgICAgIGxldCBwcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdnMpO1xyXG4gICAgICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZzKTtcclxuICAgICAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2dyYW07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGxpbmsgcHJvZ3JhbSBmYWlsZWQ6ICcgKyB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVzZVByb2dyYW0oKXtcclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5wcmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF0dHJpYnV0ZSh2Ym8sIGlibyl7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBmb3IobGV0IGkgaW4gdmJvKXtcclxuICAgICAgICAgICAgaWYodGhpcy5hdHRMW2ldID49IDApe1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZib1tpXSk7XHJcbiAgICAgICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLmF0dExbaV0pO1xyXG4gICAgICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLmF0dExbaV0sIHRoaXMuYXR0U1tpXSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpYm8gIT0gbnVsbCl7Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWJvKTt9XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaFNoYWRlcihhbnkpe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IHRoaXMudW5pVC5sZW5ndGg7IGkgPCBqOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgdW5pID0gJ3VuaWZvcm0nICsgdGhpcy51bmlUW2ldLnJlcGxhY2UoL21hdHJpeC9pLCAnTWF0cml4Jyk7XHJcbiAgICAgICAgICAgIGlmKGdsW3VuaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih1bmkuc2VhcmNoKC9NYXRyaXgvKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBmYWxzZSwgYW55W2ldKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBhbnlbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIG5vdCBzdXBwb3J0IHVuaWZvcm0gdHlwZTogJyArIHRoaXMudW5pVFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pe1xyXG4gICAgICAgIGxldCBpLCBsO1xyXG4gICAgICAgIGZvcihpID0gMCwgbCA9IGF0dExvY2F0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA9PSBudWxsIHx8IHRoaXMuYXR0TFtpXSA8IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgaW52YWxpZCBhdHRyaWJ1dGUgbG9jYXRpb246ICVjXCInICsgYXR0TG9jYXRpb25baV0gKyAnXCInLCAnY29sb3I6IGNyaW1zb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaSA9IDAsIGwgPSB1bmlMb2NhdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLnVuaUxbaV0gPT0gbnVsbCB8fCB0aGlzLnVuaUxbaV0gPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGludmFsaWQgdW5pZm9ybSBsb2NhdGlvbjogJWNcIicgKyB1bmlMb2NhdGlvbltpXSArICdcIicsICdjb2xvcjogY3JpbXNvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNDb3JlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==