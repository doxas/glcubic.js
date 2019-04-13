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

/**
 * @example
 * step 1: let a = new gl3Audio(bgmGainValue, soundGainValue) <- float(0.0 to 1.0)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

/**
 * gl3Audio
 * @class gl3Audio
 */
var gl3Audio = function () {
    /**
     * @constructor
     * @param {number} bgmGainValue - BGM の再生音量
     * @param {number} soundGainValue - 効果音の再生音量
     */
    function gl3Audio(bgmGainValue, soundGainValue) {
        _classCallCheck(this, gl3Audio);

        /**
         * オーディオコンテキスト
         * @type {AudioContext}
         */
        this.ctx = null;
        /**
         * ダイナミックコンプレッサーノード
         * @type {DynamicsCompressorNode}
         */
        this.comp = null;
        /**
         * BGM 用のゲインノード
         * @type {GainNode}
         */
        this.bgmGain = null;
        /**
         * 効果音用のゲインノード
         * @type {GainNode}
         */
        this.soundGain = null;
        /**
         * オーディオソースをラップしたクラスの配列
         * @type {Array.<AudioSrc>}
         */
        this.src = null;
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
            this.bgmGain.gain.setValueAtTime(bgmGainValue, 0);
            this.soundGain = this.ctx.createGain();
            this.soundGain.connect(this.comp);
            this.soundGain.gain.setValueAtTime(soundGainValue, 0);
            this.src = [];
        } else {
            throw new Error('not found AudioContext');
        }
    }

    /**
     * ファイルをロードする
     * @param {string} path - オーディオファイルのパス
     * @param {number} index - 内部プロパティの配列に格納するインデックス
     * @param {boolean} loop - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     * @param {function} callback - 読み込みと初期化が完了したあと呼ばれるコールバック
     */


    _createClass(gl3Audio, [{
        key: 'load',
        value: function load(path, index, loop, background, callback) {
            var ctx = this.ctx;
            var gain = background ? this.bgmGain : this.soundGain;
            var src = this.src;
            src[index] = null;
            var xml = new XMLHttpRequest();
            xml.open('GET', path, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.responseType = 'arraybuffer';
            xml.onload = function () {
                ctx.decodeAudioData(xml.response, function (buf) {
                    src[index] = new AudioSrc(ctx, gain, buf, loop, background);
                    src[index].loaded = true;
                    console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + path, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                    callback();
                }, function (e) {
                    console.log(e);
                });
            };
            xml.send();
        }

        /**
         * ロードの完了をチェックする
         * @return {boolean} ロードが完了しているかどうか
         */

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

/**
 * オーディオやソースファイルを管理するためのクラス
 * @class AudioSrc
 */


exports.default = gl3Audio;

var AudioSrc = function () {
    /**
     * @constructor
     * @param {AudioContext} ctx - 対象となるオーディオコンテキスト
     * @param {GainNode} gain - 対象となるゲインノード
     * @param {ArrayBuffer} audioBuffer - バイナリのオーディオソース
     * @param {boolean} bool - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     */
    function AudioSrc(ctx, gain, audioBuffer, loop, background) {
        _classCallCheck(this, AudioSrc);

        /**
         * 対象となるオーディオコンテキスト
         * @type {AudioContext}
         */
        this.ctx = ctx;
        /**
         * 対象となるゲインノード
         * @type {GainNode}
         */
        this.gain = gain;
        /**
         * ソースファイルのバイナリデータ
         * @type {ArrayBuffer}
         */
        this.audioBuffer = audioBuffer;
        /**
         * オーディオバッファソースノードを格納する配列
         * @type {Array.<AudioBufferSourceNode>}
         */
        this.bufferSource = [];
        /**
         * アクティブなバッファソースのインデックス
         * @type {number}
         */
        this.activeBufferSource = 0;
        /**
         * ループするかどうかのフラグ
         * @type {boolean}
         */
        this.loop = loop;
        /**
         * ロード済みかどうかを示すフラグ
         * @type {boolean}
         */
        this.loaded = false;
        /**
         * FFT サイズ
         * @type {number}
         */
        this.fftLoop = 16;
        /**
         * このフラグが立っている場合再生中のデータを一度取得する
         * @type {boolean}
         */
        this.update = false;
        /**
         * BGM かどうかを示すフラグ
         * @type {boolean}
         */
        this.background = background;
        /**
         * スクリプトプロセッサーノード
         * @type {ScriptProcessorNode}
         */
        this.node = this.ctx.createScriptProcessor(2048, 1, 1);
        /**
         * アナライザノード
         * @type {AnalyserNode}
         */
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.fftSize = this.fftLoop * 2;
        /**
         * データを取得する際に利用する型付き配列
         * @type {Uint8Array}
         */
        this.onData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    /**
     * オーディオを再生する
     */


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

        /**
         * オーディオの再生を止める
         */

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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @example
 * let wrapper = new gl3.Gui.Wrapper();
 * document.body.appendChild(wrapper.getElement());
 *
 * let slider = new gl3.Gui.Slider('test', 50, 0, 100, 1);
 * slider.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(slider.getElement());
 *
 * let check = new gl3.Gui.Checkbox('hoge', false);
 * check.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(check.getElement());
 *
 * let radio = new gl3.Gui.Radio('hoge', null, false);
 * radio.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(radio.getElement());
 *
 * let select = new gl3.Gui.Select('fuga', ['foo', 'baa'], 0);
 * select.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(select.getElement());
 *
 * let spin = new gl3.Gui.Spin('hoge', 0.0, -1.0, 1.0, 0.1);
 * spin.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(spin.getElement());
 *
 * let color = new gl3.Gui.Color('fuga', '#ff0000');
 * color.add('change', (eve, self) => {console.log(self.getValue(), self.getFloatValue());});
 * wrapper.append(color.getElement());
 */

/**
 * gl3Gui
 * @class gl3Gui
 */
var gl3Gui = function () {
  _createClass(gl3Gui, null, [{
    key: 'WIDTH',
    get: function get() {
      return 400;
    }
    /**
     * @constructor
     */

  }]);

  function gl3Gui() {
    _classCallCheck(this, gl3Gui);

    /**
     * GUIWrapper
     * @type {GUIWrapper}
     */
    this.Wrapper = GUIWrapper;
    /**
     * GUIElement
     * @type {GUIElement}
     */
    this.Element = GUIElement;
    /**
     * GUISlider
     * @type {GUISlider}
     */
    this.Slider = GUISlider;
    /**
     * GUICheckbox
     * @type {GUICheckbox}
     */
    this.Checkbox = GUICheckbox;
    /**
     * GUIRadio
     * @type {GUIRadio}
     */
    this.Radio = GUIRadio;
    /**
     * GUISelect
     * @type {GUISelect}
     */
    this.Select = GUISelect;
    /**
     * GUISpin
     * @type {GUISpin}
     */
    this.Spin = GUISpin;
    /**
     * GUIColor
     * @type {GUIColor}
     */
    this.Color = GUIColor;
  }

  return gl3Gui;
}();

/**
 * GUIWrapper
 * @class GUIWrapper
 */


exports.default = gl3Gui;

var GUIWrapper = function () {
  /**
   * @constructor
   */
  function GUIWrapper() {
    var _this = this;

    _classCallCheck(this, GUIWrapper);

    /**
     * GUI 全体を包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.top = '0px';
    this.element.style.right = '0px';
    this.element.style.width = gl3Gui.WIDTH + 'px';
    this.element.style.height = '100%';
    this.element.style.transition = 'right 0.8s cubic-bezier(0, 0, 0, 1.0)';
    /**
     * GUI パーツを包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.wrapper = document.createElement('div');
    this.wrapper.style.backgroundColor = 'rgba(64, 64, 64, 0.5)';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'auto';
    /**
     * GUI 折りたたみトグル
     * @type {HTMLDivElement}
     */
    this.toggle = document.createElement('div');
    this.toggle.className = 'visible';
    this.toggle.textContent = '▶';
    this.toggle.style.fontSize = '18px';
    this.toggle.style.lineHeight = '32px';
    this.toggle.style.color = 'rgba(240, 240, 240, 0.5)';
    this.toggle.style.backgroundColor = 'rgba(32, 32, 32, 0.5)';
    this.toggle.style.position = 'absolute';
    this.toggle.style.top = '0px';
    this.toggle.style.right = gl3Gui.WIDTH + 'px';
    this.toggle.style.width = '32px';
    this.toggle.style.height = '32px';
    this.toggle.style.cursor = 'pointer';
    this.toggle.style.transform = 'rotate(0deg)';
    this.toggle.style.transition = 'transform 0.5s cubic-bezier(0, 0, 0, 1.0)';

    this.element.appendChild(this.toggle);
    this.element.appendChild(this.wrapper);

    this.toggle.addEventListener('click', function () {
      _this.toggle.classList.toggle('visible');
      if (_this.toggle.classList.contains('visible')) {
        _this.element.style.right = '0px';
        _this.toggle.style.transform = 'rotate(0deg)';
      } else {
        _this.element.style.right = '-' + gl3Gui.WIDTH + 'px';
        _this.toggle.style.transform = 'rotate(-180deg)';
      }
    });
  }
  /**
   * エレメントを返す
   * @return {HTMLDivElement}
   */


  _createClass(GUIWrapper, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
    /**
     * 子要素をアペンドする
     * @param {HTMLElement} element - アペンドする要素
     */

  }, {
    key: 'append',
    value: function append(element) {
      this.wrapper.appendChild(element);
    }
  }]);

  return GUIWrapper;
}();

/**
 * GUIElement
 * @class GUIElement
 */


var GUIElement = function () {
  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   */
  function GUIElement() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, GUIElement);

    /**
     * エレメントラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.fontSize = 'small';
    this.element.style.textAlign = 'center';
    this.element.style.width = gl3Gui.WIDTH + 'px';
    this.element.style.height = '30px';
    this.element.style.lineHeight = '30px';
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'row';
    this.element.style.justifyContent = 'flex-start';
    /**
     * ラベル用エレメント DOM
     * @type {HTMLSpanElement}
     */
    this.label = document.createElement('span');
    this.label.textContent = text;
    this.label.style.color = '#222';
    this.label.style.textShadow = '0px 0px 5px white';
    this.label.style.display = 'inline-block';
    this.label.style.margin = 'auto 5px';
    this.label.style.width = '120px';
    this.label.style.overflow = 'hidden';
    this.element.appendChild(this.label);
    /**
     * 値表示用 DOM
     * @type {HTMLSpanElement}
     */
    this.value = document.createElement('span');
    this.value.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
    this.value.style.color = 'whitesmoke';
    this.value.style.fontSize = 'x-small';
    this.value.style.textShadow = '0px 0px 5px black';
    this.value.style.display = 'inline-block';
    this.value.style.margin = 'auto 5px';
    this.value.style.width = '80px';
    this.value.style.overflow = 'hidden';
    this.element.appendChild(this.value);
    /**
     * コントロール DOM
     * @type {HTMLElement}
     */
    this.control = null;
    /**
     * ラベルに設定するテキスト
     * @type {string}
     */
    this.text = text;
    /**
     * イベントリスナ
     * @type {object}
     */
    this.listeners = {};
  }
  /**
   * イベントリスナを登録する
   * @param {string} type - イベントタイプ
   * @param {function} func - 登録する関数
   */


  _createClass(GUIElement, [{
    key: 'add',
    value: function add(type, func) {
      if (this.control == null || type == null || func == null) {
        return;
      }
      if (Object.prototype.toString.call(type) !== '[object String]') {
        return;
      }
      if (Object.prototype.toString.call(func) !== '[object Function]') {
        return;
      }
      this.listeners[type] = func;
    }
    /**
     * イベントを発火する
     * @param {string} type - 発火するイベントタイプ
     * @param {Event} eve - Event オブジェクト
     */

  }, {
    key: 'emit',
    value: function emit(type, eve) {
      if (this.control == null || !this.listeners.hasOwnProperty(type)) {
        return;
      }
      this.listeners[type](eve, this);
    }
    /**
     * イベントリスナを登録解除する
     */

  }, {
    key: 'remove',
    value: function remove() {
      if (this.control == null || !this.listeners.hasOwnProperty(type)) {
        return;
      }
      this.listeners[type] = null;
      delete this.listeners[type];
    }
    /**
     * ラベルテキストとコントロールの値を更新する
     * @param {mixed} value - 設定する値
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value.textContent = value;
      this.control.value = value;
    }
    /**
     * コントロールに設定されている値を返す
     * @return {mixed} コントロールに設定されている値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.value;
    }
    /**
     * コントロールエレメントを返す
     * @return {HTMLElement}
     */

  }, {
    key: 'getControl',
    value: function getControl() {
      return this.control;
    }
    /**
     * ラベルに設定されているテキストを返す
     * @return {string} ラベルに設定されている値
     */

  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }
    /**
     * エレメントを返す
     * @return {HTMLDivElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return GUIElement;
}();

/**
 * GUISlider
 * @class GUISlider
 */


var GUISlider = function (_GUIElement) {
  _inherits(GUISlider, _GUIElement);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {number} [value=0] - コントロールに設定する値
   * @param {number} [min=0] - スライダーの最小値
   * @param {number} [max=100] - スライダーの最大値
   * @param {number} [step=1] - スライダーのステップ数
   */
  function GUISlider() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    _classCallCheck(this, GUISlider);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this2 = _possibleConstructorReturn(this, (GUISlider.__proto__ || Object.getPrototypeOf(GUISlider)).call(this, text));

    _this2.control = document.createElement('input');
    _this2.control.setAttribute('type', 'range');
    _this2.control.setAttribute('min', min);
    _this2.control.setAttribute('max', max);
    _this2.control.setAttribute('step', step);
    _this2.control.value = value;
    _this2.control.style.margin = 'auto';
    _this2.control.style.verticalAlign = 'middle';
    _this2.element.appendChild(_this2.control);

    // set
    _this2.setValue(_this2.control.value);

    // event
    _this2.control.addEventListener('input', function (eve) {
      _this2.emit('input', eve);
      _this2.setValue(_this2.control.value);
    }, false);
    return _this2;
  }
  /**
   * スライダーの最小値をセットする
   * @param {number} min - 最小値に設定する値
   */


  _createClass(GUISlider, [{
    key: 'setMin',
    value: function setMin(min) {
      this.control.setAttribute('min', min);
    }
    /**
     * スライダーの最大値をセットする
     * @param {number} max - 最大値に設定する値
     */

  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.control.setAttribute('max', max);
    }
    /**
     * スライダーのステップ数をセットする
     * @param {number} step - ステップ数に設定する値
     */

  }, {
    key: 'setStep',
    value: function setStep(step) {
      this.control.setAttribute('step', step);
    }
  }]);

  return GUISlider;
}(GUIElement);

/**
 * GUICheckbox
 * @class GUICheckbox
 */


var GUICheckbox = function (_GUIElement2) {
  _inherits(GUICheckbox, _GUIElement2);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {boolean} [checked=false] - コントロールに設定する値
   */
  function GUICheckbox() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, GUICheckbox);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this3 = _possibleConstructorReturn(this, (GUICheckbox.__proto__ || Object.getPrototypeOf(GUICheckbox)).call(this, text));

    _this3.control = document.createElement('input');
    _this3.control.setAttribute('type', 'checkbox');
    _this3.control.checked = checked;
    _this3.control.style.margin = 'auto';
    _this3.control.style.verticalAlign = 'middle';
    _this3.element.appendChild(_this3.control);

    // set
    _this3.setValue(_this3.control.checked);

    // event
    _this3.control.addEventListener('change', function (eve) {
      _this3.emit('change', eve);
      _this3.setValue(_this3.control.checked);
    }, false);
    return _this3;
  }
  /**
   * コントロールに値を設定する
   * @param {boolean} checked - コントロールに設定する値
   */


  _createClass(GUICheckbox, [{
    key: 'setValue',
    value: function setValue(checked) {
      this.value.textContent = checked;
      this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.checked;
    }
  }]);

  return GUICheckbox;
}(GUIElement);

/**
 * GUIRadio
 * @class GUIRadio
 */


var GUIRadio = function (_GUIElement3) {
  _inherits(GUIRadio, _GUIElement3);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {string} [name='gl3radio'] - エレメントに設定する名前
   * @param {boolean} [checked=false] - コントロールに設定する値
   */
  function GUIRadio() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'gl3radio';
    var checked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, GUIRadio);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this4 = _possibleConstructorReturn(this, (GUIRadio.__proto__ || Object.getPrototypeOf(GUIRadio)).call(this, text));

    _this4.control = document.createElement('input');
    _this4.control.setAttribute('type', 'radio');
    _this4.control.setAttribute('name', name);
    _this4.control.checked = checked;
    _this4.control.style.margin = 'auto';
    _this4.control.style.verticalAlign = 'middle';
    _this4.element.appendChild(_this4.control);

    // set
    _this4.setValue(_this4.control.checked);

    // event
    _this4.control.addEventListener('change', function (eve) {
      _this4.emit('change', eve);
      _this4.setValue(_this4.control.checked);
    }, false);
    return _this4;
  }
  /**
   * コントロールに値を設定する
   * @param {boolean} checked - コントロールに設定する値
   */


  _createClass(GUIRadio, [{
    key: 'setValue',
    value: function setValue(checked) {
      this.value.textContent = '---';
      this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.checked;
    }
  }]);

  return GUIRadio;
}(GUIElement);

/**
 * GUISelect
 * @class GUISelect
 */


var GUISelect = function (_GUIElement4) {
  _inherits(GUISelect, _GUIElement4);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {Array.<string>} [list=[]] - リストに登録するアイテムを指定する文字列の配列
   * @param {number} [selectedIndex=0] - コントロールで選択するインデックス
   */
  function GUISelect() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var selectedIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, GUISelect);

    /**
     * コントロールエレメント
     * @type {HTMLSelectElement}
     */
    var _this5 = _possibleConstructorReturn(this, (GUISelect.__proto__ || Object.getPrototypeOf(GUISelect)).call(this, text));

    _this5.control = document.createElement('select');
    list.map(function (v) {
      var opt = new Option(v, v);
      _this5.control.add(opt);
    });
    _this5.control.selectedIndex = selectedIndex;
    _this5.control.style.width = '130px';
    _this5.control.style.margin = 'auto';
    _this5.control.style.verticalAlign = 'middle';
    _this5.element.appendChild(_this5.control);

    // set
    _this5.setValue(_this5.control.value);

    // event
    _this5.control.addEventListener('change', function (eve) {
      _this5.emit('change', eve);
      _this5.setValue(_this5.control.value);
    }, false);
    return _this5;
  }
  /**
   * コントロールで選択するインデックスを指定する
   * @param {number} index - 指定するインデックス
   */


  _createClass(GUISelect, [{
    key: 'setSelectedIndex',
    value: function setSelectedIndex(index) {
      this.control.selectedIndex = index;
    }
    /**
     * コントロールが現在選択しているインデックスを返す
     * @return {number} 現在選択しているインデックス
     */

  }, {
    key: 'getSelectedIndex',
    value: function getSelectedIndex() {
      return this.control.selectedIndex;
    }
  }]);

  return GUISelect;
}(GUIElement);

/**
 * GUISpin
 * @class GUISpin
 */


var GUISpin = function (_GUIElement5) {
  _inherits(GUISpin, _GUIElement5);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {number} [value=0.0] - コントロールに設定する値
   * @param {number} [min=-1.0] - スピンする際の最小値
   * @param {number} [max=1.0] - スピンする際の最大値
   * @param {number} [step=0.1] - スピンするステップ数
   */
  function GUISpin() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
    var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;

    _classCallCheck(this, GUISpin);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this6 = _possibleConstructorReturn(this, (GUISpin.__proto__ || Object.getPrototypeOf(GUISpin)).call(this, text));

    _this6.control = document.createElement('input');
    _this6.control.setAttribute('type', 'number');
    _this6.control.setAttribute('min', min);
    _this6.control.setAttribute('max', max);
    _this6.control.setAttribute('step', step);
    _this6.control.value = value;
    _this6.control.style.margin = 'auto';
    _this6.control.style.verticalAlign = 'middle';
    _this6.element.appendChild(_this6.control);

    // set
    _this6.setValue(_this6.control.value);

    // event
    _this6.control.addEventListener('input', function (eve) {
      _this6.emit('input', eve);
      _this6.setValue(_this6.control.value);
    }, false);
    return _this6;
  }
  /**
   * スピンの最小値を設定する
   * @param {number} min - 設定する最小値
   */


  _createClass(GUISpin, [{
    key: 'setMin',
    value: function setMin(min) {
      this.control.setAttribute('min', min);
    }
    /**
     * スピンの最大値を設定する
     * @param {number} max - 設定する最大値
     */

  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.control.setAttribute('max', max);
    }
    /**
     * スピンのステップ数を設定する
     * @param {number} step - 設定するステップ数
     */

  }, {
    key: 'setStep',
    value: function setStep(step) {
      this.control.setAttribute('step', step);
    }
  }]);

  return GUISpin;
}(GUIElement);

/**
 * GUIColor
 * @class GUIColor
 */


var GUIColor = function (_GUIElement6) {
  _inherits(GUIColor, _GUIElement6);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {string} [value='#000000'] - コントロールに設定する値
   */
  function GUIColor() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#000000';

    _classCallCheck(this, GUIColor);

    /**
     * コントロールを包むコンテナエレメント
     * @type {HTMLDivElement}
     */
    var _this7 = _possibleConstructorReturn(this, (GUIColor.__proto__ || Object.getPrototypeOf(GUIColor)).call(this, text));

    _this7.container = document.createElement('div');
    _this7.container.style.lineHeight = '0';
    _this7.container.style.margin = '2px auto';
    _this7.container.style.width = '100px';
    /**
     * 余白兼選択カラー表示エレメント
     * @type {HTMLDivElement}
     */
    _this7.label = document.createElement('div');
    _this7.label.style.margin = '0px';
    _this7.label.style.width = 'calc(100% - 2px)';
    _this7.label.style.height = '24px';
    _this7.label.style.border = '1px solid whitesmoke';
    _this7.label.style.boxShadow = '0px 0px 0px 1px #222';
    /**
     * コントロールエレメントの役割を担う canvas
     * @type {HTMLCanvasElement}
     */
    _this7.control = document.createElement('canvas');
    _this7.control.style.margin = '0px';
    _this7.control.style.display = 'none';
    _this7.control.width = 100;
    _this7.control.height = 100;

    // append
    _this7.element.appendChild(_this7.container);
    _this7.container.appendChild(_this7.label);
    _this7.container.appendChild(_this7.control);

    /**
     * コントロール用 canvas の 2d コンテキスト
     * @type {CanvasRenderingContext2D}
     */
    _this7.ctx = _this7.control.getContext('2d');
    var grad = _this7.ctx.createLinearGradient(0, 0, _this7.control.width, 0);
    var arr = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'];
    for (var i = 0, j = arr.length; i < j; ++i) {
      grad.addColorStop(i / (j - 1), arr[i]);
    }
    _this7.ctx.fillStyle = grad;
    _this7.ctx.fillRect(0, 0, _this7.control.width, _this7.control.height);
    grad = _this7.ctx.createLinearGradient(0, 0, 0, _this7.control.height);
    arr = ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 1.0)'];
    for (var _i = 0, _j = arr.length; _i < _j; ++_i) {
      grad.addColorStop(_i / (_j - 1), arr[_i]);
    }
    _this7.ctx.fillStyle = grad;
    _this7.ctx.fillRect(0, 0, _this7.control.width, _this7.control.height);

    /**
     * 自身に設定されている色を表す文字列の値
     * @type {string}
     */
    _this7.colorValue = value;
    /**
     * クリック時にのみ colorValue を更新するための一時キャッシュ変数
     * @type {string}
     */
    _this7.tempColorValue = null;

    // set
    _this7.setValue(value);

    // event
    _this7.container.addEventListener('mouseover', function () {
      _this7.control.style.display = 'block';
      _this7.tempColorValue = _this7.colorValue;
    });
    _this7.container.addEventListener('mouseout', function () {
      _this7.control.style.display = 'none';
      if (_this7.tempColorValue != null) {
        _this7.setValue(_this7.tempColorValue);
        _this7.tempColorValue = null;
      }
    });
    _this7.control.addEventListener('mousemove', function (eve) {
      var imageData = _this7.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      var color = _this7.getColor8bitString(imageData.data);
      _this7.setValue(color);
    });

    _this7.control.addEventListener('click', function (eve) {
      var imageData = _this7.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      eve.currentTarget.value = _this7.getColor8bitString(imageData.data);
      _this7.tempColorValue = null;
      _this7.control.style.display = 'none';
      _this7.emit('change', eve);
    }, false);
    return _this7;
  }
  /**
   * 自身のプロパティに色を設定する
   * @param {string} value - CSS 色表現のうち 16 進数表記のもの
   */


  _createClass(GUIColor, [{
    key: 'setValue',
    value: function setValue(value) {
      this.value.textContent = value;
      this.colorValue = value;
      this.container.style.backgroundColor = this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を返す
     * @return {string} 16 進数表記の色を表す文字列
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を 0.0 から 1.0 の値に変換し配列で返す
     * @return {Array.<number>} 浮動小数で表現した色の値の配列
     */

  }, {
    key: 'getFloatValue',
    value: function getFloatValue() {
      return this.getColorFloatArray(this.colorValue);
    }
    /**
     * canvas.imageData から取得する数値の配列を元に 16 進数表記文字列を生成して返す
     * @param {Array.<number>} color - 最低でも 3 つの要素を持つ数値の配列
     * @return {string} 16 進数表記の色の値の文字列
     */

  }, {
    key: 'getColor8bitString',
    value: function getColor8bitString(color) {
      var r = this.zeroPadding(color[0].toString(16), 2);
      var g = this.zeroPadding(color[1].toString(16), 2);
      var b = this.zeroPadding(color[2].toString(16), 2);
      return '#' + r + g + b;
    }
    /**
     * 16 進数表記の色表現文字列を元に 0.0 から 1.0 の値に変換した配列を生成し返す
     * @param {string} color - 16 進数表記の色の値の文字列
     * @return {Array.<number>} RGB の 3 つの値を 0.0 から 1.0 に変換した値の配列
     */

  }, {
    key: 'getColorFloatArray',
    value: function getColorFloatArray(color) {
      if (color == null || Object.prototype.toString.call(color) !== '[object String]') {
        return null;
      }
      if (color.search(/^#+[\d|a-f|A-F]+$/) === -1) {
        return null;
      }
      var s = color.replace('#', '');
      if (s.length !== 3 && s.length !== 6) {
        return null;
      }
      var t = s.length / 3;
      return [parseInt(color.substr(1, t), 16) / 255, parseInt(color.substr(1 + t, t), 16) / 255, parseInt(color.substr(1 + t * 2, t), 16) / 255];
    }
    /**
     * 数値を指定された桁数に整形した文字列を返す
     * @param {number} number - 整形したい数値
     * @param {number} count - 整形する桁数
     * @return {string} 16 進数表記の色の値の文字列
     */

  }, {
    key: 'zeroPadding',
    value: function zeroPadding(number, count) {
      var a = new Array(count).join('0');
      return (a + number).slice(-count);
    }
  }]);

  return GUIColor;
}(GUIElement);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Math
 * @class gl3Math
 */
var gl3Math =
/**
 * @constructor
 */
function gl3Math() {
    _classCallCheck(this, gl3Math);

    /**
     * Mat4
     * @type {Mat4}
     */
    this.Mat4 = Mat4;
    /**
     * Vec3
     * @type {Vec3}
     */
    this.Vec3 = Vec3;
    /**
     * Vec2
     * @type {Vec2}
     */
    this.Vec2 = Vec2;
    /**
     * Qtn
     * @type {Qtn}
     */
    this.Qtn = Qtn;
};

/**
 * Mat4
 * @class Mat4
 */


exports.default = gl3Math;

var Mat4 = function () {
    function Mat4() {
        _classCallCheck(this, Mat4);
    }

    _createClass(Mat4, null, [{
        key: "create",

        /**
         * 4x4 の正方行列を生成する
         * @return {Float32Array} 行列格納用の配列
         */
        value: function create() {
            return new Float32Array(16);
        }
        /**
         * 行列を単位化する（参照に注意）
         * @param {Float32Array.<Mat4>} dest - 単位化する行列
         * @return {Float32Array.<Mat4>} 単位化した行列
         */

    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 1;dest[1] = 0;dest[2] = 0;dest[3] = 0;
            dest[4] = 0;dest[5] = 1;dest[6] = 0;dest[7] = 0;
            dest[8] = 0;dest[9] = 0;dest[10] = 1;dest[11] = 0;
            dest[12] = 0;dest[13] = 0;dest[14] = 0;dest[15] = 1;
            return dest;
        }
        /**
         * 行列を乗算する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat0 - 乗算される行列
         * @param {Float32Array.<Mat4>} mat1 - 乗算する行列
         * @param {Float32Array.<Mat4>} [dest] - 乗算結果を格納する行列
         * @return {Float32Array.<Mat4>} 乗算結果の行列
         */

    }, {
        key: "multiply",
        value: function multiply(mat0, mat1, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var a = mat0[0],
                b = mat0[1],
                c = mat0[2],
                d = mat0[3],
                e = mat0[4],
                f = mat0[5],
                g = mat0[6],
                h = mat0[7],
                i = mat0[8],
                j = mat0[9],
                k = mat0[10],
                l = mat0[11],
                m = mat0[12],
                n = mat0[13],
                o = mat0[14],
                p = mat0[15],
                A = mat1[0],
                B = mat1[1],
                C = mat1[2],
                D = mat1[3],
                E = mat1[4],
                F = mat1[5],
                G = mat1[6],
                H = mat1[7],
                I = mat1[8],
                J = mat1[9],
                K = mat1[10],
                L = mat1[11],
                M = mat1[12],
                N = mat1[13],
                O = mat1[14],
                P = mat1[15];
            out[0] = A * a + B * e + C * i + D * m;
            out[1] = A * b + B * f + C * j + D * n;
            out[2] = A * c + B * g + C * k + D * o;
            out[3] = A * d + B * h + C * l + D * p;
            out[4] = E * a + F * e + G * i + H * m;
            out[5] = E * b + F * f + G * j + H * n;
            out[6] = E * c + F * g + G * k + H * o;
            out[7] = E * d + F * h + G * l + H * p;
            out[8] = I * a + J * e + K * i + L * m;
            out[9] = I * b + J * f + K * j + L * n;
            out[10] = I * c + J * g + K * k + L * o;
            out[11] = I * d + J * h + K * l + L * p;
            out[12] = M * a + N * e + O * i + P * m;
            out[13] = M * b + N * f + O * j + P * n;
            out[14] = M * c + N * g + O * k + P * o;
            out[15] = M * d + N * h + O * l + P * p;
            return out;
        }
        /**
         * 行列に拡大縮小を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {Float32Array.<Vec3>} vec - XYZ の各軸に対して拡縮を適用する値の行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "scale",
        value: function scale(mat, vec, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0] * vec[0];
            out[1] = mat[1] * vec[0];
            out[2] = mat[2] * vec[0];
            out[3] = mat[3] * vec[0];
            out[4] = mat[4] * vec[1];
            out[5] = mat[5] * vec[1];
            out[6] = mat[6] * vec[1];
            out[7] = mat[7] * vec[1];
            out[8] = mat[8] * vec[2];
            out[9] = mat[9] * vec[2];
            out[10] = mat[10] * vec[2];
            out[11] = mat[11] * vec[2];
            out[12] = mat[12];
            out[13] = mat[13];
            out[14] = mat[14];
            out[15] = mat[15];
            return out;
        }
        /**
         * 行列に平行移動を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {Float32Array.<Vec3>} vec - XYZ の各軸に対して平行移動を適用する値の行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "translate",
        value: function translate(mat, vec, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0];out[1] = mat[1];out[2] = mat[2];out[3] = mat[3];
            out[4] = mat[4];out[5] = mat[5];out[6] = mat[6];out[7] = mat[7];
            out[8] = mat[8];out[9] = mat[9];out[10] = mat[10];out[11] = mat[11];
            out[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
            out[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
            out[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
            out[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
            return out;
        }
        /**
         * 行列に回転を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {number} angle - 回転量を表す値（ラジアン）
         * @param {Float32Array.<Vec3>} axis - 回転の軸
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "rotate",
        value: function rotate(mat, angle, axis, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
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
                if (mat != out) {
                    out[12] = mat[12];out[13] = mat[13];
                    out[14] = mat[14];out[15] = mat[15];
                }
            } else {
                out = mat;
            }
            out[0] = g * s + k * t + o * u;
            out[1] = h * s + l * t + p * u;
            out[2] = i * s + m * t + q * u;
            out[3] = j * s + n * t + r * u;
            out[4] = g * v + k * w + o * x;
            out[5] = h * v + l * w + p * x;
            out[6] = i * v + m * w + q * x;
            out[7] = j * v + n * w + r * x;
            out[8] = g * y + k * z + o * A;
            out[9] = h * y + l * z + p * A;
            out[10] = i * y + m * z + q * A;
            out[11] = j * y + n * z + r * A;
            return out;
        }
        /**
         * ビュー座標変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Vec3>} eye - 視点位置
         * @param {Float32Array.<Vec3>} center - 注視点
         * @param {Float32Array.<Vec3>} up - 上方向を示すベクトル
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "lookAt",
        value: function lookAt(eye, center, up, dest) {
            var eyeX = eye[0],
                eyeY = eye[1],
                eyeZ = eye[2],
                centerX = center[0],
                centerY = center[1],
                centerZ = center[2],
                upX = up[0],
                upY = up[1],
                upZ = up[2];
            if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
                return Mat4.identity(dest);
            }
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
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
            out[0] = x0;out[1] = y0;out[2] = z0;out[3] = 0;
            out[4] = x1;out[5] = y1;out[6] = z1;out[7] = 0;
            out[8] = x2;out[9] = y2;out[10] = z2;out[11] = 0;
            out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
            out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
            out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
            out[15] = 1;
            return out;
        }
        /**
         * 透視投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {number} fovy - 視野角（度数法）
         * @param {number} aspect - アスペクト比（幅 / 高さ）
         * @param {number} near - ニアクリップ面までの距離
         * @param {number} far - ファークリップ面までの距離
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "perspective",
        value: function perspective(fovy, aspect, near, far, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var t = near * Math.tan(fovy * Math.PI / 360);
            var r = t * aspect;
            var a = r * 2,
                b = t * 2,
                c = far - near;
            out[0] = near * 2 / a;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = near * 2 / b;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = -(far + near) / c;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = -(far * near * 2) / c;
            out[15] = 0;
            return out;
        }
        /**
         * 正射影投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {number} left - 左端
         * @param {number} right - 右端
         * @param {number} top - 上端
         * @param {number} bottom - 下端
         * @param {number} near - ニアクリップ面までの距離
         * @param {number} far - ファークリップ面までの距離
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "ortho",
        value: function ortho(left, right, top, bottom, near, far, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var h = right - left;
            var v = top - bottom;
            var d = far - near;
            out[0] = 2 / h;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 2 / v;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = -2 / d;
            out[11] = 0;
            out[12] = -(left + right) / h;
            out[13] = -(top + bottom) / v;
            out[14] = -(far + near) / d;
            out[15] = 1;
            return out;
        }
        /**
         * 転置行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "transpose",
        value: function transpose(mat, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0];out[1] = mat[4];
            out[2] = mat[8];out[3] = mat[12];
            out[4] = mat[1];out[5] = mat[5];
            out[6] = mat[9];out[7] = mat[13];
            out[8] = mat[2];out[9] = mat[6];
            out[10] = mat[10];out[11] = mat[14];
            out[12] = mat[3];out[13] = mat[7];
            out[14] = mat[11];out[15] = mat[15];
            return out;
        }
        /**
         * 逆行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "inverse",
        value: function inverse(mat, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
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
            out[0] = (f * B - g * A + h * z) * ivd;
            out[1] = (-b * B + c * A - d * z) * ivd;
            out[2] = (n * v - o * u + p * t) * ivd;
            out[3] = (-j * v + k * u - l * t) * ivd;
            out[4] = (-e * B + g * y - h * x) * ivd;
            out[5] = (a * B - c * y + d * x) * ivd;
            out[6] = (-m * v + o * s - p * r) * ivd;
            out[7] = (i * v - k * s + l * r) * ivd;
            out[8] = (e * A - f * y + h * w) * ivd;
            out[9] = (-a * A + b * y - d * w) * ivd;
            out[10] = (m * u - n * s + p * q) * ivd;
            out[11] = (-i * u + j * s - l * q) * ivd;
            out[12] = (-e * z + f * x - g * w) * ivd;
            out[13] = (a * z - b * x + c * w) * ivd;
            out[14] = (-m * t + n * r - o * q) * ivd;
            out[15] = (i * t - j * r + k * q) * ivd;
            return out;
        }
        /**
         * 行列にベクトルを乗算する（ベクトルに行列を適用する）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Array.<number>} vec - 乗算するベクトル（4 つの要素を持つ配列）
         * @return {Float32Array} 結果のベクトル
         */

    }, {
        key: "toVecIV",
        value: function toVecIV(mat, vec) {
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
                p = mat[15];
            var x = vec[0],
                y = vec[1],
                z = vec[2],
                w = vec[3];
            var out = [];
            out[0] = x * a + y * e + z * i + w * m;
            out[1] = x * b + y * f + z * j + w * n;
            out[2] = x * c + y * g + z * k + w * o;
            out[3] = x * d + y * h + z * l + w * p;
            vec = out;
            return out;
        }
        /**
         * カメラのプロパティに相当する情報を受け取り行列を生成する
         * @param {Float32Array.<Vec3>} position - カメラの座標
         * @param {Float32Array.<Vec3>} centerPoint - カメラの注視点
         * @param {Float32Array.<Vec3>} upDirection - カメラの上方向
         * @param {number} fovy - 視野角
         * @param {number} aspect - アスペクト比
         * @param {number} near - ニアクリップ面
         * @param {number} far - ファークリップ面
         * @param {Float32Array.<Mat4>} vmat - ビュー座標変換行列の結果を格納する行列
         * @param {Float32Array.<Mat4>} pmat - 透視投影座標変換行列の結果を格納する行列
         * @param {Float32Array.<Mat4>} dest - ビュー x 透視投影変換行列の結果を格納する行列
         */

    }, {
        key: "vpFromCameraProperty",
        value: function vpFromCameraProperty(position, centerPoint, upDirection, fovy, aspect, near, far, vmat, pmat, dest) {
            Mat4.lookAt(position, centerPoint, upDirection, vmat);
            Mat4.perspective(fovy, aspect, near, far, pmat);
            Mat4.multiply(pmat, vmat, dest);
        }
        /**
         * MVP 行列に相当する行列を受け取りベクトルを変換して返す
         * @param {Float32Array.<Mat4>} mat - MVP 行列
         * @param {Array.<number>} vec - MVP 行列と乗算するベクトル
         * @param {number} width - ビューポートの幅
         * @param {number} height - ビューポートの高さ
         * @return {Array.<number>} 結果のベクトル（2 つの要素を持つベクトル）
         */

    }, {
        key: "screenPositionFromMvp",
        value: function screenPositionFromMvp(mat, vec, width, height) {
            var halfWidth = width * 0.5;
            var halfHeight = height * 0.5;
            var v = Mat4.toVecIV(mat, [vec[0], vec[1], vec[2], 1.0]);
            if (v[3] <= 0.0) {
                return [NaN, NaN];
            }
            v[0] /= v[3];v[1] /= v[3];v[2] /= v[3];
            return [halfWidth + v[0] * halfWidth, halfHeight - v[1] * halfHeight];
        }
    }]);

    return Mat4;
}();

/**
 * Vec3
 * @class Vec3
 */


var Vec3 = function () {
    function Vec3() {
        _classCallCheck(this, Vec3);
    }

    _createClass(Vec3, null, [{
        key: "create",

        /**
         * 3 つの要素を持つベクトルを生成する
         * @return {Float32Array} ベクトル格納用の配列
         */
        value: function create() {
            return new Float32Array(3);
        }
        /**
         * ベクトルの長さ（大きさ）を返す
         * @param {Float32Array.<Vec3>} v - 3 つの要素を持つベクトル
         * @return {number} ベクトルの長さ（大きさ）
         */

    }, {
        key: "len",
        value: function len(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        }
        /**
         * 2 つの座標（始点・終点）を結ぶベクトルを返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つ始点座標
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つ終点座標
         * @return {Float32Array.<Vec3>} 視点と終点を結ぶベクトル
         */

    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec3.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            n[2] = v1[2] - v0[2];
            return n;
        }
        /**
         * ベクトルを正規化した結果を返す
         * @param {Float32Array.<Vec3>} v - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 正規化したベクトル
         */

    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec3.create();
            var l = Vec3.len(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
                n[2] = v[2] * e;
            } else {
                n[0] = 0.0;
                n[1] = 0.0;
                n[2] = 0.0;
            }
            return n;
        }
        /**
         * 2 つのベクトルの内積の結果を返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @return {number} 内積の結果
         */

    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        }
        /**
         * 2 つのベクトルの外積の結果を返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 外積の結果
         */

    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec3.create();
            n[0] = v0[1] * v1[2] - v0[2] * v1[1];
            n[1] = v0[2] * v1[0] - v0[0] * v1[2];
            n[2] = v0[0] * v1[1] - v0[1] * v1[0];
            return n;
        }
        /**
         * 3 つのベクトルから面法線を求めて返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v2 - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 面法線ベクトル
         */

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

/**
 * Vec2
 * @class Vec2
 */


var Vec2 = function () {
    function Vec2() {
        _classCallCheck(this, Vec2);
    }

    _createClass(Vec2, null, [{
        key: "create",

        /**
         * 2 つの要素を持つベクトルを生成する
         * @return {Float32Array} ベクトル格納用の配列
         */
        value: function create() {
            return new Float32Array(2);
        }
        /**
         * ベクトルの長さ（大きさ）を返す
         * @param {Float32Array.<Vec2>} v - 2 つの要素を持つベクトル
         * @return {number} ベクトルの長さ（大きさ）
         */

    }, {
        key: "len",
        value: function len(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }
        /**
         * 2 つの座標（始点・終点）を結ぶベクトルを返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つ始点座標
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つ終点座標
         * @return {Float32Array.<Vec2>} 視点と終点を結ぶベクトル
         */

    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec2.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            return n;
        }
        /**
         * ベクトルを正規化した結果を返す
         * @param {Float32Array.<Vec2>} v - 2 つの要素を持つベクトル
         * @return {Float32Array.<Vec2>} 正規化したベクトル
         */

    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec2.create();
            var l = Vec2.len(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
            }
            return n;
        }
        /**
         * 2 つのベクトルの内積の結果を返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つベクトル
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つベクトル
         * @return {number} 内積の結果
         */

    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1];
        }
        /**
         * 2 つのベクトルの外積の結果を返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つベクトル
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つベクトル
         * @return {Float32Array.<Vec2>} 外積の結果
         */

    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec2.create();
            return v0[0] * v1[1] - v0[1] * v1[0];
        }
    }]);

    return Vec2;
}();

/**
 * Qtn
 * @class Qtn
 */


var Qtn = function () {
    function Qtn() {
        _classCallCheck(this, Qtn);
    }

    _createClass(Qtn, null, [{
        key: "create",

        /**
         * 4 つの要素からなるクォータニオンのデータ構造を生成する（虚部 x, y, z, 実部 w の順序で定義）
         * @return {Float32Array} クォータニオンデータ格納用の配列
         */
        value: function create() {
            return new Float32Array(4);
        }
        /**
         * クォータニオンを初期化する（参照に注意）
         * @param {Float32Array.<Qtn>} dest - 初期化するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 0;dest[1] = 0;dest[2] = 0;dest[3] = 1;
            return dest;
        }
        /**
         * 共役四元数を生成して返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn - 元となるクォータニオン
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "inverse",
        value: function inverse(qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            out[0] = -qtn[0];
            out[1] = -qtn[1];
            out[2] = -qtn[2];
            out[3] = qtn[3];
            return out;
        }
        /**
         * 虚部を正規化して返す（参照に注意）
         * @param {Float32Array.<Qtn>} qtn - 元となるクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "normalize",
        value: function normalize(dest) {
            var x = dest[0],
                y = dest[1],
                z = dest[2];
            var l = Math.sqrt(x * x + y * y + z * z);
            if (l === 0) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
            } else {
                l = 1 / l;
                dest[0] = x * l;
                dest[1] = y * l;
                dest[2] = z * l;
            }
            return dest;
        }
        /**
         * クォータニオンを乗算した結果を返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn0 - 乗算されるクォータニオン
         * @param {Float32Array.<Qtn>} qtn1 - 乗算するクォータニオン
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "multiply",
        value: function multiply(qtn0, qtn1, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var ax = qtn0[0],
                ay = qtn0[1],
                az = qtn0[2],
                aw = qtn0[3];
            var bx = qtn1[0],
                by = qtn1[1],
                bz = qtn1[2],
                bw = qtn1[3];
            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
        }
        /**
         * クォータニオンに回転を適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {number} angle - 回転する量（ラジアン）
         * @param {Array.<number>} axis - 3 つの要素を持つ軸ベクトル
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "rotate",
        value: function rotate(angle, axis, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (sq !== 0) {
                var l = 1 / sq;
                a *= l;
                b *= l;
                c *= l;
            }
            var s = Math.sin(angle * 0.5);
            out[0] = a * s;
            out[1] = b * s;
            out[2] = c * s;
            out[3] = Math.cos(angle * 0.5);
            return out;
        }
        /**
         * ベクトルにクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {Array.<number>} vec - 3 つの要素を持つベクトル
         * @param {Float32Array.<Qtn>} qtn - クォータニオン
         * @param {Array.<number>} [dest] - 3 つの要素を持つベクトル
         * @return {Array.<number>} 結果のベクトル
         */

    }, {
        key: "toVecIII",
        value: function toVecIII(vec, qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = [0.0, 0.0, 0.0];
            }
            var qp = Qtn.create();
            var qq = Qtn.create();
            var qr = Qtn.create();
            Qtn.inverse(qtn, qr);
            qp[0] = vec[0];
            qp[1] = vec[1];
            qp[2] = vec[2];
            Qtn.multiply(qr, qp, qq);
            Qtn.multiply(qq, qtn, qr);
            out[0] = qr[0];
            out[1] = qr[1];
            out[2] = qr[2];
            return out;
        }
        /**
         * 4x4 行列にクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn - クォータニオン
         * @param {Float32Array.<Mat4>} [dest] - 4x4 行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "toMatIV",
        value: function toMatIV(qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
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
            out[0] = 1 - (yy + zz);
            out[1] = xy - wz;
            out[2] = xz + wy;
            out[3] = 0;
            out[4] = xy + wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz - wx;
            out[7] = 0;
            out[8] = xz - wy;
            out[9] = yz + wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        /**
         * 2 つのクォータニオンの球面線形補間を行った結果を返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn0 - クォータニオン
         * @param {Float32Array.<Qtn>} qtn1 - クォータニオン
         * @param {number} time - 補間係数（0.0 から 1.0 で指定）
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "slerp",
        value: function slerp(qtn0, qtn1, time, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var ht = qtn0[0] * qtn1[0] + qtn0[1] * qtn1[1] + qtn0[2] * qtn1[2] + qtn0[3] * qtn1[3];
            var hs = 1.0 - ht * ht;
            if (hs <= 0.0) {
                out[0] = qtn0[0];
                out[1] = qtn0[1];
                out[2] = qtn0[2];
                out[3] = qtn0[3];
            } else {
                hs = Math.sqrt(hs);
                if (Math.abs(hs) < 0.0001) {
                    out[0] = qtn0[0] * 0.5 + qtn1[0] * 0.5;
                    out[1] = qtn0[1] * 0.5 + qtn1[1] * 0.5;
                    out[2] = qtn0[2] * 0.5 + qtn1[2] * 0.5;
                    out[3] = qtn0[3] * 0.5 + qtn1[3] * 0.5;
                } else {
                    var ph = Math.acos(ht);
                    var pt = ph * time;
                    var t0 = Math.sin(ph - pt) / hs;
                    var t1 = Math.sin(pt) / hs;
                    out[0] = qtn0[0] * t0 + qtn1[0] * t1;
                    out[1] = qtn0[1] * t0 + qtn1[1] * t1;
                    out[2] = qtn0[2] * t0 + qtn1[2] * t1;
                    out[3] = qtn0[3] * t0 + qtn1[3] * t1;
                }
            }
            return out;
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

/**
 * gl3Mesh
 * @class
 */
var gl3Mesh = function () {
    function gl3Mesh() {
        _classCallCheck(this, gl3Mesh);
    }

    _createClass(gl3Mesh, null, [{
        key: "plane",

        /**
         * 板ポリゴンの頂点情報を生成する
         * @param {number} width - 板ポリゴンの一辺の幅
         * @param {number} height - 板ポリゴンの一辺の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let planeData = gl3.Mesh.plane(2.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */
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

        /**
         * 円（XY 平面展開）の頂点情報を生成する
         * @param {number} split - 円の円周の分割数
         * @param {number} rad - 円の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let circleData = gl3.Mesh.circle(64, 1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "circle",
        value: function circle(split, rad, color) {
            var i = void 0,
                j = 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, 0.0, 0.0);
            nor.push(0.0, 0.0, 1.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            for (i = 0; i < split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var ry = Math.sin(r);
                pos.push(rx * rad, ry * rad, 0.0);
                nor.push(0.0, 0.0, 1.0);
                col.push(color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (ry + 1.0) * 0.5);
                if (i === split - 1) {
                    idx.push(0, j + 1, 1);
                } else {
                    idx.push(0, j + 1, j + 2);
                }
                ++j;
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * キューブの頂点情報を生成する
         * @param {number} side - 正立方体の一辺の長さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let cubeData = gl3.Mesh.cube(2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cube",
        value: function cube(side, color) {
            var hs = side * 0.5;
            var pos = [-hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs, -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs, hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs];
            var v = 1.0 / Math.sqrt(3.0);
            var nor = [-v, -v, v, v, -v, v, v, v, v, -v, v, v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v, -v, -v, v, -v, -v, v, v, v, v, v, v, v, -v, -v, -v, -v, v, -v, -v, v, -v, v, -v, -v, v, v, -v, -v, v, v, -v, v, v, v, v, -v, v, -v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v];
            var col = [];
            for (var i = 0; i < pos.length / 3; i++) {
                col.push(color[0], color[1], color[2], color[3]);
            }
            var st = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
            var idx = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 三角錐の頂点情報を生成する
         * @param {number} split - 底面円の円周の分割数
         * @param {number} rad - 底面円の半径
         * @param {number} height - 三角錐の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let coneData = gl3.Mesh.cone(64, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cone",
        value: function cone(split, rad, height, color) {
            var i = void 0,
                j = 0;
            var h = height / 2.0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, -h, 0.0);
            nor.push(0.0, -1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            for (i = 0; i <= split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var rz = Math.sin(r);
                pos.push(rx * rad, -h, rz * rad, rx * rad, -h, rz * rad);
                nor.push(0.0, -1.0, 0.0, rx, 0.0, rz);
                col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
                if (i !== split) {
                    idx.push(0, j + 1, j + 3);
                    idx.push(j + 4, j + 2, split * 2 + 3);
                }
                j += 2;
            }
            pos.push(0.0, h, 0.0);
            nor.push(0.0, 1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 円柱の頂点情報を生成する
         * @param {number} split - 円柱の円周の分割数
         * @param {number} topRad - 円柱の天面の半径
         * @param {number} bottomRad - 円柱の底面の半径
         * @param {number} height - 円柱の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let cylinderData = gl3.Mesh.cylinder(64, 0.5, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cylinder",
        value: function cylinder(split, topRad, bottomRad, height, color) {
            var i = void 0,
                j = 2;
            var h = height / 2.0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, h, 0.0, 0.0, -h, 0.0);
            nor.push(0.0, 1.0, 0.0, 0.0, -1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5, 0.5, 0.5);
            for (i = 0; i <= split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var rz = Math.sin(r);
                pos.push(rx * topRad, h, rz * topRad, rx * topRad, h, rz * topRad, rx * bottomRad, -h, rz * bottomRad, rx * bottomRad, -h, rz * bottomRad);
                nor.push(0.0, 1.0, 0.0, rx, 0.0, rz, 0.0, -1.0, 0.0, rx, 0.0, rz);
                col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, 1.0 - i / split, 0.0, (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, 1.0 - i / split, 1.0);
                if (i !== split) {
                    idx.push(0, j + 4, j, 1, j + 2, j + 6, j + 5, j + 7, j + 1, j + 1, j + 7, j + 3);
                }
                j += 4;
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 球体の頂点情報を生成する
         * @param {number} row - 球の縦方向（緯度方向）の分割数
         * @param {number} column - 球の横方向（経度方向）の分割数
         * @param {number} rad - 球の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let sphereData = gl3.Mesh.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
         */

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
                var r = Math.PI / row * i;
                var ry = Math.cos(r);
                var rr = Math.sin(r);
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
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    var _r = (column + 1) * i + j;
                    idx.push(_r, _r + 1, _r + column + 2);
                    idx.push(_r, _r + column + 2, _r + column + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * トーラスの頂点情報を生成する
         * @param {number} row - 輪の分割数
         * @param {number} column - パイプ断面の分割数
         * @param {number} irad - パイプ断面の半径
         * @param {number} orad - パイプ全体の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let torusData = gl3.Mesh.torus(64, 64, 0.25, 0.75, [1.0, 1.0, 1.0, 1.0]);
         */

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
                var r = Math.PI * 2 / row * i;
                var rr = Math.cos(r);
                var ry = Math.sin(r);
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

        /**
         * 正二十面体の頂点情報を生成する
         * @param {number} rad - サイズ（黄金比に対する比率）
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let icosaData = gl3.Mesh.icosahedron(1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "icosahedron",
        value: function icosahedron(rad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            var c = (1.0 + Math.sqrt(5.0)) / 2.0;
            var t = c * rad;
            var l = Math.sqrt(1.0 + c * c);
            var r = [1.0 / l, c / l];
            pos = [-rad, t, 0.0, rad, t, 0.0, -rad, -t, 0.0, rad, -t, 0.0, 0.0, -rad, t, 0.0, rad, t, 0.0, -rad, -t, 0.0, rad, -t, t, 0.0, -rad, t, 0.0, rad, -t, 0.0, -rad, -t, 0.0, rad];
            nor = [-r[0], r[1], 0.0, r[0], r[1], 0.0, -r[0], -r[1], 0.0, r[0], -r[1], 0.0, 0.0, -r[0], r[1], 0.0, r[0], r[1], 0.0, -r[0], -r[1], 0.0, r[0], -r[1], r[1], 0.0, -r[0], r[1], 0.0, r[0], -r[1], 0.0, -r[0], -r[1], 0.0, r[0]];
            col = [color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]];
            for (var _i = 0, _j = nor.length; _i < _j; _i += 3) {
                var u = (Math.atan2(nor[_i + 2], -nor[_i]) + Math.PI) / (Math.PI * 2.0);
                var v = 1.0 - (nor[_i + 1] + 1.0) / 2.0;
                st.push(u, v);
            }
            idx = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
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

/**
 * gl3Util
 * @class gl3Util
 */
var gl3Util = function () {
    function gl3Util() {
        _classCallCheck(this, gl3Util);
    }

    _createClass(gl3Util, null, [{
        key: "hsva",

        /**
         * HSV カラーを生成して配列で返す
         * @param {number} h - 色相
         * @param {number} s - 彩度
         * @param {number} v - 明度
         * @param {number} a - アルファ
         * @return {Array.<number>} RGBA を 0.0 から 1.0 の範囲に正規化した色の配列
         */
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

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeLiner",
        value: function easeLiner(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeOutCubic",
        value: function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeQuintic",
        value: function easeQuintic(t) {
            var ts = (t = t / 1) * t;
            var tc = ts * t;
            return tc * ts;
        }

        /**
         * 度数法の角度から弧度法の値へ変換する
         * @param {number} deg - 度数法の角度
         * @return {number} 弧度法の値
         */

    }, {
        key: "degToRad",
        value: function degToRad(deg) {
            return deg % 360 * Math.PI / 180;
        }

        /**
         * 赤道半径（km）
         * @type {number}
         */

    }, {
        key: "lonToMer",


        /**
         * 経度を元にメルカトル座標を返す
         * @param {number} lon - 経度
         * @return {number} メルカトル座標系における X
         */
        value: function lonToMer(lon) {
            return gl3Util.EARTH_RADIUS * gl3Util.degToRad(lon);
        }

        /**
         * 緯度を元にメルカトル座標を返す
         * @param {number} lat - 緯度
         * @param {number} [flatten=0] - 扁平率
         * @return {number} メルカトル座標系における Y
         */

    }, {
        key: "latToMer",
        value: function latToMer(lat) {
            var flatten = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var flattening = flatten;
            if (isNaN(parseFloat(flatten))) {
                flattening = 0;
            }
            var clamp = 0.0001;
            if (lat >= 90 - clamp) {
                lat = 90 - clamp;
            }
            if (lat <= -90 + clamp) {
                lat = -90 + clamp;
            }
            var temp = 1 - flattening;
            var es = 1.0 - temp * temp;
            var eccent = Math.sqrt(es);
            var phi = gl3Util.degToRad(lat);
            var sinphi = Math.sin(phi);
            var con = eccent * sinphi;
            var com = 0.5 * eccent;
            con = Math.pow((1.0 - con) / (1.0 + con), com);
            var ts = Math.tan(0.5 * (Math.PI * 0.5 - phi)) / con;
            return gl3Util.EARTH_RADIUS * Math.log(ts);
        }

        /**
         * 緯度経度をメルカトル座標系に変換して返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} [flatten=0] - 扁平率
         * @return {obj}
         * @property {number} x - メルカトル座標系における X 座標
         * @property {number} y - メルカトル座標系における Y 座標
         */

    }, {
        key: "lonLatToMer",
        value: function lonLatToMer(lon, lat) {
            var flatten = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            return {
                x: gl3Util.lonToMer(lon),
                y: gl3Util.latToMer(lat, flattening)
            };
        }

        /**
         * メルカトル座標を緯度経度に変換して返す
         * @param {number} x - メルカトル座標系における X 座標
         * @param {number} y - メルカトル座標系における Y 座標
         * @return {obj}
         * @property {number} lon - 経度
         * @property {number} lat - 緯度
         */

    }, {
        key: "merToLonLat",
        value: function merToLonLat(x, y) {
            var lon = x / gl3Util.EARTH_HALF_CIRCUM * 180;
            var lat = y / gl3Util.EARTH_HALF_CIRCUM * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return {
                lon: lon,
                lat: lat
            };
        }

        /**
         * 経度からタイルインデックスを求めて返す
         * @param {number} lon - 経度
         * @param {number} zoom - ズームレベル
         * @return {number} 経度方向のタイルインデックス
         */

    }, {
        key: "lonToTile",
        value: function lonToTile(lon, zoom) {
            return Math.floor((lon / 180 + 1) * Math.pow(2, zoom) / 2);
        }

        /**
         * 緯度からタイルインデックスを求めて返す
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {number} 緯度方向のタイルインデックス
         */

    }, {
        key: "latToTile",
        value: function latToTile(lat, zoom) {
            return Math.floor((-Math.log(Math.tan((45 + lat / 2) * Math.PI / 180)) + Math.PI) * Math.pow(2, zoom) / (2 * Math.PI));
        }

        /**
         * 緯度経度をタイルインデックスに変換して返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {obj}
         * @property {number} lon - 経度方向のタイルインデックス
         * @property {number} lat - 緯度方向のタイルインデックス
         */

    }, {
        key: "lonLatToTile",
        value: function lonLatToTile(lon, lat, zoom) {
            return {
                lon: gl3Util.lonToTile(lon, zoom),
                lat: gl3Util.latToTile(lat, zoom)
            };
        }

        /**
         * タイルインデックスから経度を求めて返す
         * @param {number} lon - 経度方向のタイルインデックス
         * @param {number} zoom - ズームレベル
         * @return {number} 経度
         */

    }, {
        key: "tileToLon",
        value: function tileToLon(lon, zoom) {
            return lon / Math.pow(2, zoom) * 360 - 180;
        }

        /**
         * タイルインデックスから緯度を求めて返す
         * @param {number} lat - 緯度方向のタイルインデックス
         * @param {number} zoom - ズームレベル
         * @return {number} 緯度
         */

    }, {
        key: "tileToLat",
        value: function tileToLat(lat, zoom) {
            var y = lat / Math.pow(2, zoom) * 2 * Math.PI - Math.PI;
            return 2 * Math.atan(Math.pow(Math.E, -y)) * 180 / Math.PI - 90;
        }

        /**
         * タイルインデックスから緯度経度を求めて返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {obj}
         * @property {number} lon - 経度方向のタイルインデックス
         * @property {number} lat - 緯度方向のタイルインデックス
         */

    }, {
        key: "tileToLonLat",
        value: function tileToLonLat(lon, lat, zoom) {
            return {
                lon: gl3Util.tileToLon(lon, zoom),
                lat: gl3Util.tileToLat(lat, zoom)
            };
        }
    }, {
        key: "EARTH_RADIUS",
        get: function get() {
            return 6378.137;
        }

        /**
         * 赤道円周（km）
         * @type {number}
         */

    }, {
        key: "EARTH_CIRCUM",
        get: function get() {
            return gl3Util.EARTH_RADIUS * Math.PI * 2.0;
        }

        /**
         * 赤道円周の半分（km）
         * @type {number}
         */

    }, {
        key: "EARTH_HALF_CIRCUM",
        get: function get() {
            return gl3Util.EARTH_RADIUS * Math.PI;
        }

        /**
         * メルカトル座標系における最大緯度
         * @type {number}
         */

    }, {
        key: "EARTH_MAX_LAT",
        get: function get() {
            return 85.05112878;
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

var _gl3Gui = __webpack_require__(1);

var _gl3Gui2 = _interopRequireDefault(_gl3Gui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * glcubic
 * @class gl3
 */
var gl3 = function () {
    /**
     * @constructor
     */
    function gl3() {
        _classCallCheck(this, gl3);

        /**
         * version
         * @const
         * @type {string}
         */
        this.VERSION = '0.2.2';
        /**
         * pi * 2
         * @const
         * @type {number}
         */
        this.PI2 = 6.28318530717958647692528676655900576;
        /**
         * pi
         * @const
         * @type {number}
         */
        this.PI = 3.14159265358979323846264338327950288;
        /**
         * pi / 2
         * @const
         * @type {number}
         */
        this.PIH = 1.57079632679489661923132169163975144;
        /**
         * pi / 4
         * @const
         * @type {number}
         */
        this.PIH2 = 0.78539816339744830961566084581987572;
        /**
         * gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS を利用して得られるテクスチャユニットの最大利用可能数
         * @const
         * @type {number}
         */
        this.TEXTURE_UNIT_COUNT = null;

        /**
         * glcubic が正しく初期化されたどうかのフラグ
         * @type {boolean}
         */
        this.ready = false;
        /**
         * glcubic と紐付いている canvas element
         * @type {HTMLCanvasElement}
         */
        this.canvas = null;
        /**
         * glcubic と紐付いている canvas から取得した WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = null;
        /**
         * WebGL2RenderingContext として初期化したかどうかを表す真偽値
         * @type {bool}
         */
        this.isWebGL2 = false;
        /**
         * cubic としてのログ出力をするかどうか
         * @type {bool}
         */
        this.isConsoleOutput = true;
        /**
         * glcubic が内部的に持っているテクスチャ格納用の配列
         * @type {Array.<WebGLTexture>}
         */
        this.textures = null;
        /**
         * WebGL の拡張機能を格納するオブジェクト
         * @type {Object}
         */
        this.ext = null;

        /**
         * gl3Audio クラスのインスタンス
         * @type {gl3Audio}
         */
        this.Audio = _gl3Audio2.default;
        /**
         * gl3Mesh クラスのインスタンス
         * @type {gl3Mesh}
         */
        this.Mesh = _gl3Mesh2.default;
        /**
         * gl3Util クラスのインスタンス
         * @type {gl3Util}
         */
        this.Util = _gl3Util2.default;
        /**
         * gl3Gui クラスのインスタンス
         * @type {gl3Gui}
         */
        this.Gui = new _gl3Gui2.default();
        /**
         * gl3Math クラスのインスタンス
         * @type {gl3Math}
         */
        this.Math = new _gl3Math2.default();
    }

    /**
     * glcubic を初期化する
     * @param {HTMLCanvasElement|string} canvas - canvas element か canvas に付与されている ID 文字列
     * @param {Object} initOptions - canvas.getContext で第二引数に渡す初期化時オプション
     * @param {Object} cubicOptions
     * @property {bool} webgl2Mode - webgl2 を有効化する場合 true
     * @property {bool} consoleMessage - console に cubic のログを出力するかどうか
     * @return {boolean} 初期化が正しく行われたかどうかを表す真偽値
     */


    _createClass(gl3, [{
        key: 'init',
        value: function init(canvas, initOptions, cubicOptions) {
            var opt = initOptions || {};
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
            if (cubicOptions != null) {
                if (cubicOptions.hasOwnProperty('webgl2Mode') === true && cubicOptions.webgl2Mode === true) {
                    this.gl = this.canvas.getContext('webgl2', opt);
                    this.isWebGL2 = true;
                }
                if (cubicOptions.hasOwnProperty('consoleMessage') === true && cubicOptions.consoleMessage !== true) {
                    this.isConsoleOutput = false;
                }
            }
            if (this.gl == null) {
                this.gl = this.canvas.getContext('webgl', opt) || this.canvas.getContext('experimental-webgl', opt);
            }
            if (this.gl != null) {
                this.ready = true;
                this.TEXTURE_UNIT_COUNT = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                this.textures = new Array(this.TEXTURE_UNIT_COUNT);
                this.ext = {
                    elementIndexUint: this.gl.getExtension('OES_element_index_uint'),
                    textureFloat: this.gl.getExtension('OES_texture_float'),
                    textureHalfFloat: this.gl.getExtension('OES_texture_half_float'),
                    drawBuffers: this.gl.getExtension('WEBGL_draw_buffers')
                };
                if (this.isConsoleOutput === true) {
                    console.log('%c◆%c glcubic.js %c◆%c : version %c' + this.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');
                }
            }
            return this.ready;
        }

        /**
         * フレームバッファをクリアする
         * @param {Array.<number>} color - クリアする色（0.0 ~ 1.0）
         * @param {number} [depth] - クリアする深度
         * @param {number} [stencil] - クリアするステンシル値
         */

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

        /**
         * ビューポートを設定する
         * @param {number} [x] - x（左端原点）
         * @param {number} [y] - y（下端原点）
         * @param {number} [width] - 横の幅
         * @param {number} [height] - 縦の高さ
         */

    }, {
        key: 'sceneView',
        value: function sceneView(x, y, width, height) {
            var X = x || 0;
            var Y = y || 0;
            var w = width || window.innerWidth;
            var h = height || window.innerHeight;
            this.gl.viewport(X, Y, w, h);
        }

        /**
         * gl.drawArrays をコールするラッパー
         * @param {number} primitive - プリミティブタイプ
         * @param {number} vertexCount - 描画する頂点の個数
         * @param {number} [offset=0] - 描画する頂点の開始オフセット
         */

    }, {
        key: 'drawArrays',
        value: function drawArrays(primitive, vertexCount) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawArrays(primitive, offset, vertexCount);
        }

        /**
         * gl.drawElements をコールするラッパー
         * @param {number} primitive - プリミティブタイプ
         * @param {number} indexLength - 描画するインデックスの個数
         * @param {number} [offset=0] - 描画するインデックスの開始オフセット
         */

    }, {
        key: 'drawElements',
        value: function drawElements(primitive, indexLength) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, offset);
        }

        /**
         * gl.drawElements をコールするラッパー（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
         * @param {number} primitive - プリミティブタイプ
         * @param {number} indexLength - 描画するインデックスの個数
         * @param {number} [offset=0] - 描画するインデックスの開始オフセット
         */

    }, {
        key: 'drawElementsInt',
        value: function drawElementsInt(primitive, indexLength) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_INT, offset);
        }

        /**
         * VBO（Vertex Buffer Object）を生成して返す
         * @param {Array.<number>} data - 頂点情報を格納した配列
         * @return {WebGLBuffer} 生成した頂点バッファ
         */

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

        /**
         * IBO（Index Buffer Object）を生成して返す
         * @param {Array.<number>} data - インデックス情報を格納した配列
         * @return {WebGLBuffer} 生成したインデックスバッファ
         */

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

        /**
         * IBO（Index Buffer Object）を生成して返す（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
         * @param {Array.<number>} data - インデックス情報を格納した配列
         * @return {WebGLBuffer} 生成したインデックスバッファ
         */

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

        /**
         * ファイルを元にテクスチャを生成して返す
         * @param {string} source - ファイルパス
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @param {function} callback - 画像のロードが完了しテクスチャを生成した後に呼ばれるコールバック
         */

    }, {
        key: 'createTextureFromFile',
        value: function createTextureFromFile(source, number, callback) {
            var _this = this;

            if (source == null || number == null) {
                return;
            }
            var img = new Image();
            var gl = this.gl;
            img.onload = function () {
                _this.textures[number] = { texture: null, type: null, loaded: false };
                var tex = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0 + number);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                _this.textures[number].texture = tex;
                _this.textures[number].type = gl.TEXTURE_2D;
                _this.textures[number].loaded = true;
                if (_this.isConsoleOutput === true) {
                    console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                }
                gl.bindTexture(gl.TEXTURE_2D, null);
                if (callback != null) {
                    callback(number);
                }
            };
            img.src = source;
        }

        /**
         * オブジェクトを元にテクスチャを生成して返す
         * @param {object} object - ロード済みの Image オブジェクトや Canvas オブジェクト
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         */

    }, {
        key: 'createTextureFromObject',
        value: function createTextureFromObject(object, number) {
            if (object == null || number == null) {
                return;
            }
            var gl = this.gl;
            var tex = gl.createTexture();
            this.textures[number] = { texture: null, type: null, loaded: false };
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, object);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.textures[number].texture = tex;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, object attached', 'color: crimson', '', 'color: blue', '');
            }
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        /**
         * 画像を元にキューブマップテクスチャを生成する
         * @param {Array.<string>} source - ファイルパスを格納した配列
         * @param {Array.<number>} target - キューブマップテクスチャに設定するターゲットの配列
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @param {function} callback - 画像のロードが完了しテクスチャを生成した後に呼ばれるコールバック
         */

    }, {
        key: 'createTextureCubeFromFile',
        value: function createTextureCubeFromFile(source, target, number, callback) {
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
                                gl.activeTexture(gl.TEXTURE0 + number);
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
                                if (_this2.isConsoleOutput === true) {
                                    console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                                }
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

        /**
         * glcubic が持つ配列のインデックスとテクスチャユニットを指定してテクスチャをバインドする
         * @param {number} unit - テクスチャユニット
         * @param {number} number - glcubic が持つ配列のインデックス
         */

    }, {
        key: 'bindTexture',
        value: function bindTexture(unit, number) {
            if (this.textures[number] == null) {
                return;
            }
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
        }

        /**
         * glcubic が持つ配列内のテクスチャ用画像が全てロード済みかどうか確認する
         * @return {boolean} ロードが完了しているかどうかのフラグ
         */

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

        /**
         * フレームバッファを生成しカラーバッファにテクスチャを設定してオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

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
            gl.activeTexture(gl.TEXTURE0 + number);
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
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファにテクスチャを設定、ステンシル有効でオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthStencilRenderbuffer - 深度バッファ兼ステンシルバッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferStencil',
        value: function createFramebufferStencil(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthStencilRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
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
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable stencil)', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthStencilRenderbuffer: depthStencilRenderBuffer, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファに浮動小数点テクスチャを設定してオブジェクトとして返す ※要拡張機能（WebGL 1.0）
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferFloat',
        value: function createFramebufferFloat(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            if (this.ext == null || this.ext.textureFloat == null && this.ext.textureHalfFloat == null) {
                console.log('float texture not support');
                return;
            }
            var gl = this.gl;
            var flg = this.ext.textureFloat != null ? gl.FLOAT : this.ext.textureHalfFloat.HALF_FLOAT_OES;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, flg, null);
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
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable float)', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthRenderbuffer: null, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファにキューブテクスチャを設定してオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {Array.<number>} target - キューブマップテクスチャに設定するターゲットの配列
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

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
            gl.activeTexture(gl.TEXTURE0 + number);
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
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer cube created', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }

        /**
         * HTML 内に存在する ID 文字列から script タグを参照しプログラムオブジェクトを生成する
         * @param {string} vsId - 頂点シェーダのソースが記述された script タグの ID 文字列
         * @param {string} fsId - フラグメントシェーダのソースが記述された script タグの ID 文字列
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス
         */

    }, {
        key: 'createProgramFromId',
        value: function createProgramFromId(vsId, fsId, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            mng.vs = mng.createShaderFromId(vsId);
            mng.fs = mng.createShaderFromId(fsId);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            if (mng.prg == null) {
                return mng;
            }
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

        /**
         * シェーダのソースコード文字列からプログラムオブジェクトを生成する
         * @param {string} vs - 頂点シェーダのソース
         * @param {string} fs - フラグメントシェーダのソース
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス
         */

    }, {
        key: 'createProgramFromSource',
        value: function createProgramFromSource(vs, fs, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            mng.vs = mng.createShaderFromSource(vs, this.gl.VERTEX_SHADER);
            mng.fs = mng.createShaderFromSource(fs, this.gl.FRAGMENT_SHADER);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            if (mng.prg == null) {
                return mng;
            }
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

        /**
         * ファイルからシェーダのソースコードを取得しプログラムオブジェクトを生成する
         * @param {string} vsPath - 頂点シェーダのソースが記述されたファイルのパス
         * @param {string} fsPath - フラグメントシェーダのソースが記述されたファイルのパス
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @param {function} callback - ソースコードのロードが完了しプログラムオブジェクトを生成した後に呼ばれるコールバック
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス ※ロード前にインスタンスは戻り値として返却される
         */

    }, {
        key: 'createProgramFromFile',
        value: function createProgramFromFile(vsPath, fsPath, attLocation, attStride, uniLocation, uniType, callback) {
            if (this.gl == null) {
                return null;
            }
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            var src = {
                vs: {
                    targetUrl: vsPath,
                    source: null
                },
                fs: {
                    targetUrl: fsPath,
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
                    if (this.isConsoleOutput === true) {
                        console.log('%c◆%c shader file loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                    }
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
                if (mng.prg == null) {
                    return mng;
                }
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
                callback(mng);
            }
            return mng;
        }

        /**
         * バッファオブジェクトを削除する
         * @param {WebGLBuffer} buffer - 削除するバッファオブジェクト
         */

    }, {
        key: 'deleteBuffer',
        value: function deleteBuffer(buffer) {
            if (this.gl.isBuffer(buffer) !== true) {
                return;
            }
            this.gl.deleteBuffer(buffer);
            buffer = null;
        }

        /**
         * テクスチャオブジェクトを削除する
         * @param {WebGLTexture} texture - 削除するテクスチャオブジェクト
         */

    }, {
        key: 'deleteTexture',
        value: function deleteTexture(texture) {
            if (this.gl.isTexture(texture) !== true) {
                return;
            }
            this.gl.deleteTexture(texture);
            texture = null;
        }

        /**
         * フレームバッファやレンダーバッファを削除する
         * @param {object} obj - フレームバッファ生成メソッドが返すオブジェクト
         */

    }, {
        key: 'deleteFramebuffer',
        value: function deleteFramebuffer(obj) {
            if (obj == null) {
                return;
            }
            for (var v in obj) {
                if (obj[v] instanceof WebGLFramebuffer && this.gl.isFramebuffer(obj[v]) === true) {
                    this.gl.deleteFramebuffer(obj[v]);
                    obj[v] = null;
                    continue;
                }
                if (obj[v] instanceof WebGLRenderbuffer && this.gl.isRenderbuffer(obj[v]) === true) {
                    this.gl.deleteRenderbuffer(obj[v]);
                    obj[v] = null;
                    continue;
                }
                if (obj[v] instanceof WebGLTexture && this.gl.isTexture(obj[v]) === true) {
                    this.gl.deleteTexture(obj[v]);
                    obj[v] = null;
                }
            }
            obj = null;
        }

        /**
         * シェーダオブジェクトを削除する
         * @param {WebGLShader} shader - シェーダオブジェクト
         */

    }, {
        key: 'deleteShader',
        value: function deleteShader(shader) {
            if (this.gl.isShader(shader) !== true) {
                return;
            }
            this.gl.deleteShader(shader);
            shader = null;
        }

        /**
         * プログラムオブジェクトを削除する
         * @param {WebGLProgram} program - プログラムオブジェクト
         */

    }, {
        key: 'deleteProgram',
        value: function deleteProgram(program) {
            if (this.gl.isProgram(program) !== true) {
                return;
            }
            this.gl.deleteProgram(program);
            program = null;
        }

        /**
         * ProgramManager クラスを内部プロパティごと削除する
         * @param {ProgramManager} prg - ProgramManager クラスのインスタンス
         */

    }, {
        key: 'deleteProgramManager',
        value: function deleteProgramManager(prg) {
            if (prg == null || !(prg instanceof ProgramManager)) {
                return;
            }
            this.deleteShader(prg.vs);
            this.deleteShader(prg.fs);
            this.deleteProgram(prg.prg);
            prg.attL = null;
            prg.attS = null;
            prg.uniL = null;
            prg.uniT = null;
            prg = null;
        }
    }]);

    return gl3;
}();

/**
 * プログラムオブジェクトやシェーダを管理するマネージャ
 * @class ProgramManager
 */


exports.default = gl3;

var ProgramManager = function () {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - 自身が属する WebGL Rendering Context
     * @param {bool} [webgl2Mode=false] - webgl2 を有効化したかどうか
     */
    function ProgramManager(gl) {
        var webgl2Mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, ProgramManager);

        /**
         * 自身が属する WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;
        /**
         * WebGL2RenderingContext として初期化したかどうかを表す真偽値
         * @type {bool}
         */
        this.isWebGL2 = webgl2Mode;
        /**
         * 頂点シェーダのシェーダオブジェクト
         * @type {WebGLShader}
         */
        this.vs = null;
        /**
         * フラグメントシェーダのシェーダオブジェクト
         * @type {WebGLShader}
         */
        this.fs = null;
        /**
         * プログラムオブジェクト
         * @type {WebGLProgram}
         */
        this.prg = null;
        /**
         * アトリビュートロケーションの配列
         * @type {Array.<number>}
         */
        this.attL = null;
        /**
         * アトリビュート変数のストライドの配列
         * @type {Array.<number>}
         */
        this.attS = null;
        /**
         * ユニフォームロケーションの配列
         * @type {Array.<WebGLUniformLocation>}
         */
        this.uniL = null;
        /**
         * ユニフォーム変数のタイプの配列
         * @type {Array.<string>}
         */
        this.uniT = null;
        /**
         * エラー関連情報を格納する
         * @type {object}
         * @property {string} vs - 頂点シェーダのコンパイルエラー
         * @property {string} fs - フラグメントシェーダのコンパイルエラー
         * @property {string} prg - プログラムオブジェクトのリンクエラー
         */
        this.error = { vs: null, fs: null, prg: null };
    }

    /**
     * script タグの ID を元にソースコードを取得しシェーダオブジェクトを生成する
     * @param {string} id - script タグに付加された ID 文字列
     * @return {WebGLShader} 生成したシェーダオブジェクト
     */


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
            var source = scriptElement.text;
            if (this.isWebGL2 !== true) {
                if (source.search(/^#version 300 es/) > -1) {
                    console.warn('◆ can not use glsl es 3.0');
                    return;
                }
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                var err = this.gl.getShaderInfoLog(shader);
                if (scriptElement.type === 'x-shader/x-vertex') {
                    this.error.vs = err;
                } else {
                    this.error.fs = err;
                }
                console.warn('◆ compile failed of shader: ' + err);
            }
        }

        /**
         * シェーダのソースコードを文字列で引数から取得しシェーダオブジェクトを生成する
         * @param {string} source - シェーダのソースコード
         * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
         * @return {WebGLShader} 生成したシェーダオブジェクト
         */

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
            if (this.isWebGL2 !== true) {
                if (source.search(/^#version 300 es/) > -1) {
                    console.warn('◆ can not use glsl es 3.0');
                    return;
                }
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                var err = this.gl.getShaderInfoLog(shader);
                if (type === this.gl.VERTEX_SHADER) {
                    this.error.vs = err;
                } else {
                    this.error.fs = err;
                }
                console.warn('◆ compile failed of shader: ' + err);
            }
        }

        /**
         * シェーダオブジェクトを引数から取得しプログラムオブジェクトを生成する
         * @param {WebGLShader} vs - 頂点シェーダのシェーダオブジェクト
         * @param {WebGLShader} fs - フラグメントシェーダのシェーダオブジェクト
         * @return {WebGLProgram} 生成したプログラムオブジェクト
         */

    }, {
        key: 'createProgram',
        value: function createProgram(vs, fs) {
            if (vs == null || fs == null) {
                return null;
            }
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vs);
            this.gl.attachShader(program, fs);
            this.gl.linkProgram(program);
            if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                this.gl.useProgram(program);
                return program;
            } else {
                var err = this.gl.getProgramInfoLog(program);
                this.error.prg = err;
                console.warn('◆ link program failed: ' + err);
            }
        }

        /**
         * 自身の内部プロパティとして存在するプログラムオブジェクトを設定する
         */

    }, {
        key: 'useProgram',
        value: function useProgram() {
            this.gl.useProgram(this.prg);
        }

        /**
         * VBO と IBO をバインドして有効化する
         * @param {Array.<WebGLBuffer>} vbo - VBO を格納した配列
         * @param {WebGLBuffer} [ibo] - IBO
         */

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

        /**
         * シェーダにユニフォーム変数に設定する値をプッシュする
         * @param {Array.<mixed>} mixed - ユニフォーム変数に設定する値を格納した配列
         */

    }, {
        key: 'pushShader',
        value: function pushShader(mixed) {
            var gl = this.gl;
            for (var i = 0, j = this.uniT.length; i < j; i++) {
                var uni = 'uniform' + this.uniT[i].replace(/matrix/i, 'Matrix');
                if (gl[uni] != null) {
                    if (uni.search(/Matrix/) !== -1) {
                        gl[uni](this.uniL[i], false, mixed[i]);
                    } else {
                        gl[uni](this.uniL[i], mixed[i]);
                    }
                } else {
                    console.warn('◆ not support uniform type: ' + this.uniT[i]);
                }
            }
        }

        /**
         * アトリビュートロケーションとユニフォームロケーションが正しく取得できたかチェックする
         * @param {Array.<number>} attLocation - 取得したアトリビュートロケーションの配列
         * @param {Array.<WebGLUniformLocation>} uniLocation - 取得したユニフォームロケーションの配列
         */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTg3NmE1NDE1MjdlMTFiODkxYWIiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzR3VpLmpzIiwid2VicGFjazovLy8uL2dsM01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzTWVzaC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNVdGlsLmpzIiwid2VicGFjazovLy8uL2dsM0NvcmUuanMiXSwibmFtZXMiOlsiZ2wzQXVkaW8iLCJiZ21HYWluVmFsdWUiLCJzb3VuZEdhaW5WYWx1ZSIsImN0eCIsImNvbXAiLCJiZ21HYWluIiwic291bmRHYWluIiwic3JjIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiY3JlYXRlRHluYW1pY3NDb21wcmVzc29yIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJzZXRWYWx1ZUF0VGltZSIsIkVycm9yIiwicGF0aCIsImluZGV4IiwibG9vcCIsImJhY2tncm91bmQiLCJjYWxsYmFjayIsInhtbCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJyZXNwb25zZVR5cGUiLCJvbmxvYWQiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImJ1ZiIsIkF1ZGlvU3JjIiwibG9hZGVkIiwiY29uc29sZSIsImxvZyIsImUiLCJzZW5kIiwiaSIsImYiLCJsZW5ndGgiLCJhdWRpb0J1ZmZlciIsImJ1ZmZlclNvdXJjZSIsImFjdGl2ZUJ1ZmZlclNvdXJjZSIsImZmdExvb3AiLCJ1cGRhdGUiLCJub2RlIiwiY3JlYXRlU2NyaXB0UHJvY2Vzc29yIiwiYW5hbHlzZXIiLCJjcmVhdGVBbmFseXNlciIsInNtb290aGluZ1RpbWVDb25zdGFudCIsImZmdFNpemUiLCJvbkRhdGEiLCJVaW50OEFycmF5IiwiZnJlcXVlbmN5QmluQ291bnQiLCJqIiwiayIsInNlbGYiLCJwbGF5bm93IiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYnVmZmVyIiwicGxheWJhY2tSYXRlIiwidmFsdWUiLCJvbmVuZGVkIiwic3RvcCIsIm9uYXVkaW9wcm9jZXNzIiwiZXZlIiwib25wcm9jZXNzRXZlbnQiLCJzdGFydCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwiZ2wzR3VpIiwiV3JhcHBlciIsIkdVSVdyYXBwZXIiLCJFbGVtZW50IiwiR1VJRWxlbWVudCIsIlNsaWRlciIsIkdVSVNsaWRlciIsIkNoZWNrYm94IiwiR1VJQ2hlY2tib3giLCJSYWRpbyIsIkdVSVJhZGlvIiwiU2VsZWN0IiwiR1VJU2VsZWN0IiwiU3BpbiIsIkdVSVNwaW4iLCJDb2xvciIsIkdVSUNvbG9yIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsIndpZHRoIiwiV0lEVEgiLCJoZWlnaHQiLCJ0cmFuc2l0aW9uIiwid3JhcHBlciIsImJhY2tncm91bmRDb2xvciIsIm92ZXJmbG93IiwidG9nZ2xlIiwiY2xhc3NOYW1lIiwidGV4dENvbnRlbnQiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJjb2xvciIsImN1cnNvciIsInRyYW5zZm9ybSIsImFwcGVuZENoaWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwidGV4dCIsInRleHRBbGlnbiIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJsYWJlbCIsInRleHRTaGFkb3ciLCJtYXJnaW4iLCJjb250cm9sIiwibGlzdGVuZXJzIiwidHlwZSIsImZ1bmMiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJoYXNPd25Qcm9wZXJ0eSIsIm1pbiIsIm1heCIsInN0ZXAiLCJzZXRBdHRyaWJ1dGUiLCJ2ZXJ0aWNhbEFsaWduIiwic2V0VmFsdWUiLCJlbWl0IiwiY2hlY2tlZCIsIm5hbWUiLCJsaXN0Iiwic2VsZWN0ZWRJbmRleCIsIm1hcCIsInYiLCJvcHQiLCJPcHRpb24iLCJhZGQiLCJjb250YWluZXIiLCJib3JkZXIiLCJib3hTaGFkb3ciLCJnZXRDb250ZXh0IiwiZ3JhZCIsImNyZWF0ZUxpbmVhckdyYWRpZW50IiwiYXJyIiwiYWRkQ29sb3JTdG9wIiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJjb2xvclZhbHVlIiwidGVtcENvbG9yVmFsdWUiLCJpbWFnZURhdGEiLCJnZXRJbWFnZURhdGEiLCJvZmZzZXRYIiwib2Zmc2V0WSIsImdldENvbG9yOGJpdFN0cmluZyIsImRhdGEiLCJjdXJyZW50VGFyZ2V0IiwiZ2V0Q29sb3JGbG9hdEFycmF5IiwiciIsInplcm9QYWRkaW5nIiwiZyIsImIiLCJzZWFyY2giLCJzIiwicmVwbGFjZSIsInQiLCJwYXJzZUludCIsInN1YnN0ciIsIm51bWJlciIsImNvdW50IiwiYSIsIkFycmF5Iiwiam9pbiIsInNsaWNlIiwiZ2wzTWF0aCIsIk1hdDQiLCJWZWMzIiwiVmVjMiIsIlF0biIsIkZsb2F0MzJBcnJheSIsImRlc3QiLCJtYXQwIiwibWF0MSIsIm91dCIsImNyZWF0ZSIsImMiLCJkIiwiaCIsImwiLCJtIiwibiIsIm8iLCJwIiwiQSIsIkIiLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkgiLCJJIiwiSiIsIksiLCJMIiwiTSIsIk4iLCJPIiwiUCIsIm1hdCIsInZlYyIsImFuZ2xlIiwiYXhpcyIsInNxIiwiTWF0aCIsInNxcnQiLCJzaW4iLCJjb3MiLCJxIiwidSIsInciLCJ4IiwieSIsInoiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZVgiLCJleWVZIiwiZXllWiIsImNlbnRlclgiLCJjZW50ZXJZIiwiY2VudGVyWiIsInVwWCIsInVwWSIsInVwWiIsImlkZW50aXR5IiwieDAiLCJ4MSIsIngyIiwieTAiLCJ5MSIsInkyIiwiejAiLCJ6MSIsInoyIiwiZm92eSIsImFzcGVjdCIsIm5lYXIiLCJmYXIiLCJ0YW4iLCJQSSIsImxlZnQiLCJib3R0b20iLCJpdmQiLCJjZW50ZXJQb2ludCIsInVwRGlyZWN0aW9uIiwidm1hdCIsInBtYXQiLCJsb29rQXQiLCJwZXJzcGVjdGl2ZSIsIm11bHRpcGx5IiwiaGFsZldpZHRoIiwiaGFsZkhlaWdodCIsInRvVmVjSVYiLCJOYU4iLCJ2MCIsInYxIiwibGVuIiwidjIiLCJ2ZWMxIiwidmVjMiIsIm5vcm1hbGl6ZSIsInF0biIsInF0bjAiLCJxdG4xIiwiYXgiLCJheSIsImF6IiwiYXciLCJieCIsImJ5IiwiYnoiLCJidyIsInFwIiwicXEiLCJxciIsImludmVyc2UiLCJ4eCIsInh5IiwieHoiLCJ5eSIsInl6IiwienoiLCJ3eCIsInd5Iiwid3oiLCJ0aW1lIiwiaHQiLCJocyIsImFicyIsInBoIiwiYWNvcyIsInB0IiwidDAiLCJ0MSIsImdsM01lc2giLCJ0YyIsInBvcyIsIm5vciIsImNvbCIsInN0IiwiaWR4Iiwibm9ybWFsIiwidGV4Q29vcmQiLCJzcGxpdCIsInJhZCIsInB1c2giLCJyeCIsInJ5Iiwic2lkZSIsInJ6IiwidG9wUmFkIiwiYm90dG9tUmFkIiwicm93IiwiY29sdW1uIiwicnIiLCJ0ciIsInR4IiwidHkiLCJ0eiIsImlyYWQiLCJvcmFkIiwicnMiLCJydCIsImF0YW4yIiwiZ2wzVXRpbCIsInRoIiwiZmxvb3IiLCJ0cyIsImRlZyIsImxvbiIsIkVBUlRIX1JBRElVUyIsImRlZ1RvUmFkIiwibGF0IiwiZmxhdHRlbiIsImZsYXR0ZW5pbmciLCJpc05hTiIsInBhcnNlRmxvYXQiLCJjbGFtcCIsInRlbXAiLCJlcyIsImVjY2VudCIsInBoaSIsInNpbnBoaSIsImNvbiIsImNvbSIsInBvdyIsImxvblRvTWVyIiwibGF0VG9NZXIiLCJFQVJUSF9IQUxGX0NJUkNVTSIsImF0YW4iLCJleHAiLCJ6b29tIiwibG9uVG9UaWxlIiwibGF0VG9UaWxlIiwidGlsZVRvTG9uIiwidGlsZVRvTGF0IiwiZ2wzIiwiVkVSU0lPTiIsIlBJMiIsIlBJSCIsIlBJSDIiLCJURVhUVVJFX1VOSVRfQ09VTlQiLCJyZWFkeSIsImNhbnZhcyIsImdsIiwiaXNXZWJHTDIiLCJpc0NvbnNvbGVPdXRwdXQiLCJ0ZXh0dXJlcyIsImV4dCIsIkF1ZGlvIiwiTWVzaCIsIlV0aWwiLCJHdWkiLCJpbml0T3B0aW9ucyIsImN1YmljT3B0aW9ucyIsIkhUTUxDYW52YXNFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3ZWJnbDJNb2RlIiwiY29uc29sZU1lc3NhZ2UiLCJnZXRQYXJhbWV0ZXIiLCJNQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyIsImVsZW1lbnRJbmRleFVpbnQiLCJnZXRFeHRlbnNpb24iLCJ0ZXh0dXJlRmxvYXQiLCJ0ZXh0dXJlSGFsZkZsb2F0IiwiZHJhd0J1ZmZlcnMiLCJkZXB0aCIsInN0ZW5jaWwiLCJmbGciLCJDT0xPUl9CVUZGRVJfQklUIiwiY2xlYXJDb2xvciIsImNsZWFyRGVwdGgiLCJERVBUSF9CVUZGRVJfQklUIiwiY2xlYXJTdGVuY2lsIiwiU1RFTkNJTF9CVUZGRVJfQklUIiwiY2xlYXIiLCJYIiwiWSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInZpZXdwb3J0IiwicHJpbWl0aXZlIiwidmVydGV4Q291bnQiLCJvZmZzZXQiLCJkcmF3QXJyYXlzIiwiaW5kZXhMZW5ndGgiLCJkcmF3RWxlbWVudHMiLCJVTlNJR05FRF9TSE9SVCIsIlVOU0lHTkVEX0lOVCIsInZibyIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiU1RBVElDX0RSQVciLCJpYm8iLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsIkludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsInNvdXJjZSIsImltZyIsIkltYWdlIiwidGV4dHVyZSIsInRleCIsImNyZWF0ZVRleHR1cmUiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJiaW5kVGV4dHVyZSIsIlRFWFRVUkVfMkQiLCJ0ZXhJbWFnZTJEIiwiUkdCQSIsIlVOU0lHTkVEX0JZVEUiLCJnZW5lcmF0ZU1pcG1hcCIsInRleFBhcmFtZXRlcmkiLCJURVhUVVJFX01JTl9GSUxURVIiLCJMSU5FQVIiLCJURVhUVVJFX01BR19GSUxURVIiLCJURVhUVVJFX1dSQVBfUyIsIkNMQU1QX1RPX0VER0UiLCJURVhUVVJFX1dSQVBfVCIsIm9iamVjdCIsInRhcmdldCIsImNJbWciLCJpbWFnZSIsIlRFWFRVUkVfQ1VCRV9NQVAiLCJ1bml0IiwiZnJhbWVCdWZmZXIiLCJjcmVhdGVGcmFtZWJ1ZmZlciIsImJpbmRGcmFtZWJ1ZmZlciIsIkZSQU1FQlVGRkVSIiwiZGVwdGhSZW5kZXJCdWZmZXIiLCJjcmVhdGVSZW5kZXJidWZmZXIiLCJiaW5kUmVuZGVyYnVmZmVyIiwiUkVOREVSQlVGRkVSIiwicmVuZGVyYnVmZmVyU3RvcmFnZSIsIkRFUFRIX0NPTVBPTkVOVDE2IiwiZnJhbWVidWZmZXJSZW5kZXJidWZmZXIiLCJERVBUSF9BVFRBQ0hNRU5UIiwiZlRleHR1cmUiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkNPTE9SX0FUVEFDSE1FTlQwIiwiZnJhbWVidWZmZXIiLCJkZXB0aFJlbmRlcmJ1ZmZlciIsImRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlciIsIkRFUFRIX1NURU5DSUwiLCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQiLCJkZXB0aFN0ZW5jaWxSZW5kZXJidWZmZXIiLCJGTE9BVCIsIkhBTEZfRkxPQVRfT0VTIiwiTkVBUkVTVCIsInZzSWQiLCJmc0lkIiwiYXR0TG9jYXRpb24iLCJhdHRTdHJpZGUiLCJ1bmlMb2NhdGlvbiIsInVuaVR5cGUiLCJtbmciLCJQcm9ncmFtTWFuYWdlciIsInZzIiwiY3JlYXRlU2hhZGVyRnJvbUlkIiwiZnMiLCJwcmciLCJjcmVhdGVQcm9ncmFtIiwiYXR0TCIsImF0dFMiLCJnZXRBdHRyaWJMb2NhdGlvbiIsInVuaUwiLCJnZXRVbmlmb3JtTG9jYXRpb24iLCJ1bmlUIiwibG9jYXRpb25DaGVjayIsImNyZWF0ZVNoYWRlckZyb21Tb3VyY2UiLCJWRVJURVhfU0hBREVSIiwiRlJBR01FTlRfU0hBREVSIiwidnNQYXRoIiwiZnNQYXRoIiwidGFyZ2V0VXJsIiwieGhyIiwicmVzcG9uc2VUZXh0IiwibG9hZENoZWNrIiwiaXNCdWZmZXIiLCJkZWxldGVCdWZmZXIiLCJpc1RleHR1cmUiLCJkZWxldGVUZXh0dXJlIiwib2JqIiwiV2ViR0xGcmFtZWJ1ZmZlciIsImlzRnJhbWVidWZmZXIiLCJkZWxldGVGcmFtZWJ1ZmZlciIsIldlYkdMUmVuZGVyYnVmZmVyIiwiaXNSZW5kZXJidWZmZXIiLCJkZWxldGVSZW5kZXJidWZmZXIiLCJXZWJHTFRleHR1cmUiLCJzaGFkZXIiLCJpc1NoYWRlciIsImRlbGV0ZVNoYWRlciIsInByb2dyYW0iLCJpc1Byb2dyYW0iLCJkZWxldGVQcm9ncmFtIiwiZXJyb3IiLCJpZCIsInNjcmlwdEVsZW1lbnQiLCJjcmVhdGVTaGFkZXIiLCJ3YXJuIiwic2hhZGVyU291cmNlIiwiY29tcGlsZVNoYWRlciIsImdldFNoYWRlclBhcmFtZXRlciIsIkNPTVBJTEVfU1RBVFVTIiwiZXJyIiwiZ2V0U2hhZGVySW5mb0xvZyIsImF0dGFjaFNoYWRlciIsImxpbmtQcm9ncmFtIiwiZ2V0UHJvZ3JhbVBhcmFtZXRlciIsIkxJTktfU1RBVFVTIiwidXNlUHJvZ3JhbSIsImdldFByb2dyYW1JbmZvTG9nIiwiZW5hYmxlVmVydGV4QXR0cmliQXJyYXkiLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwibWl4ZWQiLCJ1bmkiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZE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YyxDQUFaLENBQXRDLEdBQXVELEdBQXBFLEVBQXlFLGdCQUF6RTtBQUNIO0FBQ0o7QUFDRCxpQkFBSUEsSUFBSSxDQUFKLEVBQU84SixJQUFJMlMsWUFBWXZjLE1BQTNCLEVBQW1DRixJQUFJOEosQ0FBdkMsRUFBMEM5SixHQUExQyxFQUE4QztBQUMxQyxvQkFBRyxLQUFLcWQsSUFBTCxDQUFVcmQsQ0FBVixLQUFnQixJQUFoQixJQUF3QixLQUFLcWQsSUFBTCxDQUFVcmQsQ0FBVixJQUFlLENBQTFDLEVBQTRDO0FBQ3hDSiw0QkFBUTRmLElBQVIsQ0FBYSxvQ0FBb0MvQyxZQUFZemMsQ0FBWixDQUFwQyxHQUFxRCxHQUFsRSxFQUF1RSxnQkFBdkU7QUFDSDtBQUNKO0FBQ0o7Ozs7OztBQUdMNFgsT0FBTzFDLEdBQVAsR0FBYTBDLE9BQU8xQyxHQUFQLElBQWMsSUFBSUEsR0FBSixFQUEzQixDIiwiZmlsZSI6ImdsY3ViaWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTg3NmE1NDE1MjdlMTFiODkxYWIiLCJcclxuLyoqXHJcbiAqIEBleGFtcGxlXHJcbiAqIHN0ZXAgMTogbGV0IGEgPSBuZXcgZ2wzQXVkaW8oYmdtR2FpblZhbHVlLCBzb3VuZEdhaW5WYWx1ZSkgPC0gZmxvYXQoMC4wIHRvIDEuMClcclxuICogc3RlcCAyOiBhLmxvYWQodXJsLCBpbmRleCwgbG9vcCwgYmFja2dyb3VuZCkgPC0gc3RyaW5nLCBpbnQsIGJvb2xlYW4sIGJvb2xlYW5cclxuICogc3RlcCAzOiBhLnNyY1tpbmRleF0ubG9hZGVkIHRoZW4gYS5zcmNbaW5kZXhdLnBsYXkoKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBnbDNBdWRpb1xyXG4gKiBAY2xhc3MgZ2wzQXVkaW9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM0F1ZGlvIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmdtR2FpblZhbHVlIC0gQkdNIOOBruWGjeeUn+mfs+mHj1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNvdW5kR2FpblZhbHVlIC0g5Yq55p6c6Z+z44Gu5YaN55Sf6Z+z6YePXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGJnbUdhaW5WYWx1ZSwgc291bmRHYWluVmFsdWUpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCquODvOODh+OCo+OCquOCs+ODs+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jdHggPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODgOOCpOODiuODn+ODg+OCr+OCs+ODs+ODl+ODrOODg+OCteODvOODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtEeW5hbWljc0NvbXByZXNzb3JOb2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29tcCA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQkdNIOeUqOOBruOCsuOCpOODs+ODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtHYWluTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJnbUdhaW4gPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWKueaenOmfs+eUqOOBruOCsuOCpOODs+ODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtHYWluTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNvdW5kR2FpbiA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kq44O844OH44Kj44Kq44K944O844K544KS44Op44OD44OX44GX44Gf44Kv44Op44K544Gu6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5LjxBdWRpb1NyYz59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zcmMgPSBudWxsO1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0eXBlb2YgQXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiB3ZWJraXRBdWRpb0NvbnRleHQgIT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICApe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgQXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4ID0gbmV3IHdlYmtpdEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29tcCA9IHRoaXMuY3R4LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXAuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5iZ21HYWluLmNvbm5lY3QodGhpcy5jb21wKTtcclxuICAgICAgICAgICAgdGhpcy5iZ21HYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoYmdtR2FpblZhbHVlLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZEdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluLmNvbm5lY3QodGhpcy5jb21wKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZEdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShzb3VuZEdhaW5WYWx1ZSwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3JjID0gW107XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGZvdW5kIEF1ZGlvQ29udGV4dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleOCoeOCpOODq+OCkuODreODvOODieOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSDjgqrjg7zjg4fjgqPjgqrjg5XjgqHjgqTjg6vjga7jg5HjgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIOWGhemDqOODl+ODreODkeODhuOCo+OBrumFjeWIl+OBq+agvOe0jeOBmeOCi+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBsb29wIC0g44Or44O844OX5YaN55Sf44KS6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJhY2tncm91bmQgLSBCR00g44Go44GX44Gm6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIOiqreOBv+i+vOOBv+OBqOWIneacn+WMluOBjOWujOS6huOBl+OBn+OBguOBqOWRvOOBsOOCjOOCi+OCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICovXHJcbiAgICBsb2FkKHBhdGgsIGluZGV4LCBsb29wLCBiYWNrZ3JvdW5kLCBjYWxsYmFjayl7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4O1xyXG4gICAgICAgIGxldCBnYWluID0gYmFja2dyb3VuZCA/IHRoaXMuYmdtR2FpbiA6IHRoaXMuc291bmRHYWluO1xyXG4gICAgICAgIGxldCBzcmMgPSB0aGlzLnNyYztcclxuICAgICAgICBzcmNbaW5kZXhdID0gbnVsbDtcclxuICAgICAgICBsZXQgeG1sID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeG1sLm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xyXG4gICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICduby1jYWNoZScpO1xyXG4gICAgICAgIHhtbC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gICAgICAgIHhtbC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5kZWNvZGVBdWRpb0RhdGEoeG1sLnJlc3BvbnNlLCAoYnVmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdID0gbmV3IEF1ZGlvU3JjKGN0eCwgZ2FpbiwgYnVmLCBsb29wLCBiYWNrZ3JvdW5kKTtcclxuICAgICAgICAgICAgICAgIHNyY1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIGF1ZGlvIG51bWJlcjogJWMnICsgaW5kZXggKyAnJWMsIGF1ZGlvIGxvYWRlZDogJWMnICsgcGF0aCwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSwgKGUpID0+IHtjb25zb2xlLmxvZyhlKTt9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhtbC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjg4njga7lrozkuobjgpLjg4Hjgqfjg4Pjgq/jgZnjgotcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOODreODvOODieOBjOWujOS6huOBl+OBpuOBhOOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICovXHJcbiAgICBsb2FkQ29tcGxldGUoKXtcclxuICAgICAgICBsZXQgaSwgZjtcclxuICAgICAgICBmID0gdHJ1ZTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNyYy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGYgPSBmICYmICh0aGlzLnNyY1tpXSAhPSBudWxsKSAmJiB0aGlzLnNyY1tpXS5sb2FkZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog44Kq44O844OH44Kj44Kq44KE44K944O844K544OV44Kh44Kk44Or44KS566h55CG44GZ44KL44Gf44KB44Gu44Kv44Op44K5XHJcbiAqIEBjbGFzcyBBdWRpb1NyY1xyXG4gKi9cclxuY2xhc3MgQXVkaW9TcmMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBjdHggLSDlr77osaHjgajjgarjgovjgqrjg7zjg4fjgqPjgqrjgrPjg7Pjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7R2Fpbk5vZGV9IGdhaW4gLSDlr77osaHjgajjgarjgovjgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGF1ZGlvQnVmZmVyIC0g44OQ44Kk44OK44Oq44Gu44Kq44O844OH44Kj44Kq44K944O844K5XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2wgLSDjg6vjg7zjg5flho3nlJ/jgpLoqK3lrprjgZnjgovjgYvjganjgYbjgYtcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmFja2dyb3VuZCAtIEJHTSDjgajjgZfjgaboqK3lrprjgZnjgovjgYvjganjgYbjgYtcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoY3R4LCBnYWluLCBhdWRpb0J1ZmZlciwgbG9vcCwgYmFja2dyb3VuZCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a++6LGh44Go44Gq44KL44Kq44O844OH44Kj44Kq44Kz44Oz44OG44Kt44K544OIXHJcbiAgICAgICAgICogQHR5cGUge0F1ZGlvQ29udGV4dH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlr77osaHjgajjgarjgovjgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7R2Fpbk5vZGV9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nYWluID0gZ2FpbjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgr3jg7zjgrnjg5XjgqHjgqTjg6vjga7jg5DjgqTjg4rjg6rjg4fjg7zjgr9cclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXlCdWZmZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdWRpb0J1ZmZlciA9IGF1ZGlvQnVmZmVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCquODvOODh+OCo+OCquODkOODg+ODleOCoeOCveODvOOCueODjuODvOODieOCkuagvOe0jeOBmeOCi+mFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48QXVkaW9CdWZmZXJTb3VyY2VOb2RlPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZSA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCouOCr+ODhuOCo+ODluOBquODkOODg+ODleOCoeOCveODvOOCueOBruOCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgPSAwO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODq+ODvOODl+OBmeOCi+OBi+OBqeOBhuOBi+OBruODleODqeOCsFxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubG9vcCA9IGxvb3A7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ot44O844OJ5riI44G/44GL44Gp44GG44GL44KS56S644GZ44OV44Op44KwXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGRlQg44K144Kk44K6XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmZmdExvb3AgPSAxNjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgZPjga7jg5Xjg6njgrDjgYznq4vjgaPjgabjgYTjgovloLTlkIjlho3nlJ/kuK3jga7jg4fjg7zjgr/jgpLkuIDluqblj5blvpfjgZnjgotcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJHTSDjgYvjganjgYbjgYvjgpLnpLrjgZnjg5Xjg6njgrBcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODquODl+ODiOODl+ODreOCu+ODg+OCteODvOODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtTY3JpcHRQcm9jZXNzb3JOb2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4LCAxLCAxKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4rjg6njgqTjgrbjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7QW5hbHlzZXJOb2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIgPSB0aGlzLmN0eC5jcmVhdGVBbmFseXNlcigpO1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44O1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIuZmZ0U2l6ZSA9IHRoaXMuZmZ0TG9vcCAqIDI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OH44O844K/44KS5Y+W5b6X44GZ44KL6Zqb44Gr5Yip55So44GZ44KL5Z6L5LuY44GN6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge1VpbnQ4QXJyYXl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5vbkRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLmFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCquODvOODh+OCo+OCquOCkuWGjeeUn+OBmeOCi1xyXG4gICAgICovXHJcbiAgICBwbGF5KCl7XHJcbiAgICAgICAgbGV0IGksIGosIGs7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGkgPSB0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgayA9IC0xO1xyXG4gICAgICAgIGlmKGkgPiAwKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgaTsgaisrKXtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmJ1ZmZlclNvdXJjZVtqXS5wbGF5bm93KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vbal0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gajtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihrIDwgMCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGhdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICBrID0gdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVswXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICBrID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgPSBrO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXI7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ubG9vcCA9IHRoaXMubG9vcDtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5wbGF5YmFja1JhdGUudmFsdWUgPSAxLjA7XHJcbiAgICAgICAgaWYoIXRoaXMubG9vcCl7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLm9uZW5kZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5iYWNrZ3JvdW5kKXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmFuYWx5c2VyKTtcclxuICAgICAgICAgICAgdGhpcy5hbmFseXNlci5jb25uZWN0KHRoaXMubm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uYXVkaW9wcm9jZXNzID0gKGV2ZSkgPT4ge29ucHJvY2Vzc0V2ZW50KGV2ZSk7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmdhaW4pO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnN0YXJ0KDApO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnBsYXlub3cgPSB0cnVlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbnByb2Nlc3NFdmVudChldmUpe1xyXG4gICAgICAgICAgICBpZihzZWxmLnVwZGF0ZSl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShzZWxmLm9uRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqrjg7zjg4fjgqPjgqrjga7lho3nlJ/jgpLmraLjgoHjgotcclxuICAgICAqL1xyXG4gICAgc3RvcCgpe1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW3RoaXMuYWN0aXZlQnVmZmVyU291cmNlXS5zdG9wKDApO1xyXG4gICAgICAgIHRoaXMucGxheW5vdyA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNBdWRpby5qcyIsIlxyXG4vKipcclxuICogQGV4YW1wbGVcclxuICogbGV0IHdyYXBwZXIgPSBuZXcgZ2wzLkd1aS5XcmFwcGVyKCk7XHJcbiAqIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlci5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgc2xpZGVyID0gbmV3IGdsMy5HdWkuU2xpZGVyKCd0ZXN0JywgNTAsIDAsIDEwMCwgMSk7XHJcbiAqIHNsaWRlci5hZGQoJ2lucHV0JywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKHNsaWRlci5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgY2hlY2sgPSBuZXcgZ2wzLkd1aS5DaGVja2JveCgnaG9nZScsIGZhbHNlKTtcclxuICogY2hlY2suYWRkKCdjaGFuZ2UnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpKTt9KTtcclxuICogd3JhcHBlci5hcHBlbmQoY2hlY2suZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IHJhZGlvID0gbmV3IGdsMy5HdWkuUmFkaW8oJ2hvZ2UnLCBudWxsLCBmYWxzZSk7XHJcbiAqIHJhZGlvLmFkZCgnY2hhbmdlJywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKHJhZGlvLmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCBzZWxlY3QgPSBuZXcgZ2wzLkd1aS5TZWxlY3QoJ2Z1Z2EnLCBbJ2ZvbycsICdiYWEnXSwgMCk7XHJcbiAqIHNlbGVjdC5hZGQoJ2NoYW5nZScsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChzZWxlY3QuZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IHNwaW4gPSBuZXcgZ2wzLkd1aS5TcGluKCdob2dlJywgMC4wLCAtMS4wLCAxLjAsIDAuMSk7XHJcbiAqIHNwaW4uYWRkKCdpbnB1dCcsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChzcGluLmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCBjb2xvciA9IG5ldyBnbDMuR3VpLkNvbG9yKCdmdWdhJywgJyNmZjAwMDAnKTtcclxuICogY29sb3IuYWRkKCdjaGFuZ2UnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpLCBzZWxmLmdldEZsb2F0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKGNvbG9yLmdldEVsZW1lbnQoKSk7XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIGdsM0d1aVxyXG4gKiBAY2xhc3MgZ2wzR3VpXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNHdWkge1xyXG4gICAgc3RhdGljIGdldCBXSURUSCgpe3JldHVybiA0MDA7fVxyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlXcmFwcGVyXHJcbiAgICAgICAgICogQHR5cGUge0dVSVdyYXBwZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5XcmFwcGVyID0gR1VJV3JhcHBlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlFbGVtZW50XHJcbiAgICAgICAgICogQHR5cGUge0dVSUVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5FbGVtZW50ID0gR1VJRWxlbWVudDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlTbGlkZXJcclxuICAgICAgICAgKiBAdHlwZSB7R1VJU2xpZGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuU2xpZGVyID0gR1VJU2xpZGVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSUNoZWNrYm94XHJcbiAgICAgICAgICogQHR5cGUge0dVSUNoZWNrYm94fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuQ2hlY2tib3ggPSBHVUlDaGVja2JveDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlSYWRpb1xyXG4gICAgICAgICAqIEB0eXBlIHtHVUlSYWRpb31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlJhZGlvID0gR1VJUmFkaW87XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJU2VsZWN0XHJcbiAgICAgICAgICogQHR5cGUge0dVSVNlbGVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlNlbGVjdCA9IEdVSVNlbGVjdDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlTcGluXHJcbiAgICAgICAgICogQHR5cGUge0dVSVNwaW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5TcGluID0gR1VJU3BpbjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlDb2xvclxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlDb2xvcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLkNvbG9yID0gR1VJQ29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlXcmFwcGVyXHJcbiAqIEBjbGFzcyBHVUlXcmFwcGVyXHJcbiAqL1xyXG5jbGFzcyBHVUlXcmFwcGVyIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJIOWFqOS9k+OCkuWMheOCgOODqeODg+ODkeODvCBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gYCR7Z2wzR3VpLldJRFRIfXB4YDtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ3JpZ2h0IDAuOHMgY3ViaWMtYmV6aWVyKDAsIDAsIDAsIDEuMCknO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSSDjg5Hjg7zjg4TjgpLljIXjgoDjg6njg4Pjg5Hjg7wgRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSg2NCwgNjQsIDY0LCAwLjUpJztcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUkg5oqY44KK44Gf44Gf44G/44OI44Kw44OrXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuY2xhc3NOYW1lID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnRleHRDb250ZW50ID0gJ+KWtic7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuZm9udFNpemUgPSAnMThweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUubGluZUhlaWdodCA9ICczMnB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5jb2xvciA9ICdyZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNSknO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDMyLCAzMiwgMzIsIDAuNSknO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50b3AgPSAnMHB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5yaWdodCA9IGAke2dsM0d1aS5XSURUSH1weGA7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUud2lkdGggPSAnMzJweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuaGVpZ2h0ID0gJzMycHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDBkZWcpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50cmFuc2l0aW9uID0gJ3RyYW5zZm9ybSAwLjVzIGN1YmljLWJlemllcigwLCAwLCAwLCAxLjApJztcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudG9nZ2xlKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy50b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ3Zpc2libGUnKTtcclxuICAgICAgICAgICAgaWYodGhpcy50b2dnbGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJykpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDBkZWcpJztcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmlnaHQgPSBgLSR7Z2wzR3VpLldJRFRIfXB4YDtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoLTE4MGRlZyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCqOODrOODoeODs+ODiOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIGdldEVsZW1lbnQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlrZDopoHntKDjgpLjgqLjg5rjg7Pjg4njgZnjgotcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSDjgqLjg5rjg7Pjg4njgZnjgovopoHntKBcclxuICAgICAqL1xyXG4gICAgYXBwZW5kKGVsZW1lbnQpe1xyXG4gICAgICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSUVsZW1lbnRcclxuICogQGNsYXNzIEdVSUVsZW1lbnRcclxuICovXHJcbmNsYXNzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqjjg6zjg6Hjg7Pjg4jjg6njg4Pjg5Hjg7wgRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U2l6ZSA9ICdzbWFsbCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke2dsM0d1aS5XSURUSH1weGA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICczMHB4JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGluZUhlaWdodCA9ICczMHB4JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdyb3cnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdmbGV4LXN0YXJ0JztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6njg5njg6vnlKjjgqjjg6zjg6Hjg7Pjg4ggRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxTcGFuRWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHRoaXMubGFiZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUuY29sb3IgPSAnIzIyMic7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS50ZXh0U2hhZG93ID0gJzBweCAwcHggNXB4IHdoaXRlJztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLm1hcmdpbiA9ICdhdXRvIDVweCc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS53aWR0aCA9ICcxMjBweCc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlgKTooajnpLrnlKggRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxTcGFuRWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC4yNSknO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUuY29sb3IgPSAnd2hpdGVzbW9rZSc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS5mb250U2l6ZSA9ICd4LXNtYWxsJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLnRleHRTaGFkb3cgPSAnMHB4IDBweCA1cHggYmxhY2snO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUubWFyZ2luID0gJ2F1dG8gNXB4JztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLndpZHRoID0gJzgwcHgnO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844OrIERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODqeODmeODq+OBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jjg6rjgrnjg4pcclxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCpOODmeODs+ODiOODquOCueODiuOCkueZu+mMsuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSDjgqTjg5njg7Pjg4jjgr/jgqTjg5dcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgLSDnmbvpjLLjgZnjgovplqLmlbBcclxuICAgICAqL1xyXG4gICAgYWRkKHR5cGUsIGZ1bmMpe1xyXG4gICAgICAgIGlmKHRoaXMuY29udHJvbCA9PSBudWxsIHx8IHR5cGUgPT0gbnVsbCB8fCBmdW5jID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHR5cGUpICE9PSAnW29iamVjdCBTdHJpbmddJyl7cmV0dXJuO31cclxuICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgIT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBmdW5jO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg5njg7Pjg4jjgpLnmbrngavjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g55m654Gr44GZ44KL44Kk44OZ44Oz44OI44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmUgLSBFdmVudCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZW1pdCh0eXBlLCBldmUpe1xyXG4gICAgICAgIGlmKHRoaXMuY29udHJvbCA9PSBudWxsIHx8ICF0aGlzLmxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXShldmUsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg5njg7Pjg4jjg6rjgrnjg4rjgpLnmbvpjLLop6PpmaTjgZnjgotcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgaWYodGhpcy5jb250cm9sID09IG51bGwgfHwgIXRoaXMubGlzdGVuZXJzLmhhc093blByb3BlcnR5KHR5cGUpKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gbnVsbDtcclxuICAgICAgICBkZWxldGUgdGhpcy5saXN0ZW5lcnNbdHlwZV07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODqeODmeODq+ODhuOCreOCueODiOOBqOOCs+ODs+ODiOODreODvOODq+OBruWApOOCkuabtOaWsOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHttaXhlZH0gdmFsdWUgLSDoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0VmFsdWUodmFsdWUpe1xyXG4gICAgICAgIHRoaXMudmFsdWUudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GV44KM44Gm44GE44KL5YCk44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHttaXhlZH0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GV44KM44Gm44GE44KL5YCkXHJcbiAgICAgKi9cclxuICAgIGdldFZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbC52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OI44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgZ2V0Q29udHJvbCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2w7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODqeODmeODq+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+ODhuOCreOCueODiOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSDjg6njg5njg6vjgavoqK3lrprjgZXjgozjgabjgYTjgovlgKRcclxuICAgICAqL1xyXG4gICAgZ2V0VGV4dCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCqOODrOODoeODs+ODiOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIGdldEVsZW1lbnQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJU2xpZGVyXHJcbiAqIEBjbGFzcyBHVUlTbGlkZXJcclxuICovXHJcbmNsYXNzIEdVSVNsaWRlciBleHRlbmRzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdmFsdWU9MF0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWluPTBdIC0g44K544Op44Kk44OA44O844Gu5pyA5bCP5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21heD0xMDBdIC0g44K544Op44Kk44OA44O844Gu5pyA5aSn5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gLSDjgrnjg6njgqTjg4Djg7zjga7jgrnjg4bjg4Pjg5fmlbBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCB2YWx1ZSA9IDAsIG1pbiA9IDAsIG1heCA9IDEwMCwgc3RlcCA9IDEpe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgndHlwZScsICdyYW5nZScpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21pbicsIG1pbik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWF4JywgbWF4KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdzdGVwJywgc3RlcCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUudmVydGljYWxBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC52YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2lucHV0JywgZXZlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544Op44Kk44OA44O844Gu5pyA5bCP5YCk44KS44K744OD44OI44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluIC0g5pyA5bCP5YCk44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldE1pbihtaW4pe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21pbicsIG1pbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODqeOCpOODgOODvOOBruacgOWkp+WApOOCkuOCu+ODg+ODiOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIOacgOWkp+WApOOBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRNYXgobWF4KXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtYXgnLCBtYXgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg6njgqTjg4Djg7zjga7jgrnjg4bjg4Pjg5fmlbDjgpLjgrvjg4Pjg4jjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwIC0g44K544OG44OD44OX5pWw44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldFN0ZXAoc3RlcCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHN0ZXApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJQ2hlY2tib3hcclxuICogQGNsYXNzIEdVSUNoZWNrYm94XHJcbiAqL1xyXG5jbGFzcyBHVUlDaGVja2JveCBleHRlbmRzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NoZWNrZWQ9ZmFsc2VdIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgY2hlY2tlZCA9IGZhbHNlKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuY2hlY2tlZCA9IGNoZWNrZWQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUudmVydGljYWxBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLmNoZWNrZWQpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gr5YCk44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0VmFsdWUoY2hlY2tlZCl7XHJcbiAgICAgICAgdGhpcy52YWx1ZS50ZXh0Q29udGVudCA9IGNoZWNrZWQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmNoZWNrZWQgPSBjaGVja2VkO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKTjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOOCs+ODs+ODiOODreODvOODq+OBruWApFxyXG4gICAgICovXHJcbiAgICBnZXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wuY2hlY2tlZDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSVJhZGlvXHJcbiAqIEBjbGFzcyBHVUlSYWRpb1xyXG4gKi9cclxuY2xhc3MgR1VJUmFkaW8gZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW25hbWU9J2dsM3JhZGlvJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovlkI3liY1cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NoZWNrZWQ9ZmFsc2VdIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgbmFtZSA9ICdnbDNyYWRpbycsIGNoZWNrZWQgPSBmYWxzZSl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3JhZGlvJyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbmFtZScsIG5hbWUpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5jaGVja2VkID0gY2hlY2tlZDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLmNoZWNrZWQpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgZXZlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wuY2hlY2tlZCk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgavlgKTjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZCAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRWYWx1ZShjaGVja2VkKXtcclxuICAgICAgICB0aGlzLnZhbHVlLnRleHRDb250ZW50ID0gJy0tLSc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmNoZWNrZWQgPSBjaGVja2VkO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKTjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOOCs+ODs+ODiOODreODvOODq+OBruWApFxyXG4gICAgICovXHJcbiAgICBnZXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wuY2hlY2tlZDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSVNlbGVjdFxyXG4gKiBAY2xhc3MgR1VJU2VsZWN0XHJcbiAqL1xyXG5jbGFzcyBHVUlTZWxlY3QgZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBbbGlzdD1bXV0gLSDjg6rjgrnjg4jjgavnmbvpjLLjgZnjgovjgqLjgqTjg4bjg6DjgpLmjIflrprjgZnjgovmloflrZfliJfjga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc2VsZWN0ZWRJbmRleD0wXSAtIOOCs+ODs+ODiOODreODvOODq+OBp+mBuOaKnuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIGxpc3QgPSBbXSwgc2VsZWN0ZWRJbmRleCA9IDApe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MU2VsZWN0RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcclxuICAgICAgICBsaXN0Lm1hcCgodikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb3B0ID0gbmV3IE9wdGlvbih2LCB2KTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sLmFkZChvcHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUud2lkdGggPSAnMTMwcHgnO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgZXZlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gn6YG45oqe44GZ44KL44Kk44Oz44OH44OD44Kv44K544KS5oyH5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSDmjIflrprjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgc2V0U2VsZWN0ZWRJbmRleChpbmRleCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44GM54++5Zyo6YG45oqe44GX44Gm44GE44KL44Kk44Oz44OH44OD44Kv44K544KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOePvuWcqOmBuOaKnuOBl+OBpuOBhOOCi+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBnZXRTZWxlY3RlZEluZGV4KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbC5zZWxlY3RlZEluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJU3BpblxyXG4gKiBAY2xhc3MgR1VJU3BpblxyXG4gKi9cclxuY2xhc3MgR1VJU3BpbiBleHRlbmRzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdmFsdWU9MC4wXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttaW49LTEuMF0gLSDjgrnjg5Tjg7PjgZnjgovpmpvjga7mnIDlsI/lgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWF4PTEuMF0gLSDjgrnjg5Tjg7PjgZnjgovpmpvjga7mnIDlpKflgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0wLjFdIC0g44K544OU44Oz44GZ44KL44K544OG44OD44OX5pWwXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgdmFsdWUgPSAwLjAsIG1pbiA9IC0xLjAsIG1heCA9IDEuMCwgc3RlcCA9IDAuMSl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCd0eXBlJywgJ251bWJlcicpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21pbicsIG1pbik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWF4JywgbWF4KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdzdGVwJywgc3RlcCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUudmVydGljYWxBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC52YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2lucHV0JywgZXZlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544OU44Oz44Gu5pyA5bCP5YCk44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluIC0g6Kit5a6a44GZ44KL5pyA5bCP5YCkXHJcbiAgICAgKi9cclxuICAgIHNldE1pbihtaW4pe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21pbicsIG1pbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODlOODs+OBruacgOWkp+WApOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIOioreWumuOBmeOCi+acgOWkp+WApFxyXG4gICAgICovXHJcbiAgICBzZXRNYXgobWF4KXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtYXgnLCBtYXgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg5Tjg7Pjga7jgrnjg4bjg4Pjg5fmlbDjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwIC0g6Kit5a6a44GZ44KL44K544OG44OD44OX5pWwXHJcbiAgICAgKi9cclxuICAgIHNldFN0ZXAoc3RlcCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHN0ZXApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJQ29sb3JcclxuICogQGNsYXNzIEdVSUNvbG9yXHJcbiAqL1xyXG5jbGFzcyBHVUlDb2xvciBleHRlbmRzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWU9JyMwMDAwMDAnXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIHZhbHVlID0gJyMwMDAwMDAnKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgpLljIXjgoDjgrPjg7Pjg4bjg4rjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5saW5lSGVpZ2h0ID0gJzAnO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLm1hcmdpbiA9ICcycHggYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOS9meeZveWFvOmBuOaKnuOCq+ODqeODvOihqOekuuOCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5tYXJnaW4gPSAnMHB4JztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLndpZHRoID0gJ2NhbGMoMTAwJSAtIDJweCknO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUuaGVpZ2h0ID0gJzI0cHgnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCB3aGl0ZXNtb2tlJztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmJveFNoYWRvdyA9ICcwcHggMHB4IDBweCAxcHggIzIyMic7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OI44Gu5b255Ymy44KS5ouF44GGIGNhbnZhc1xyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MQ2FudmFzRWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLndpZHRoID0gMTAwO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5oZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIC8vIGFwcGVuZFxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or55SoIGNhbnZhcyDjga4gMmQg44Kz44Oz44OG44Kt44K544OIXHJcbiAgICAgICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY29udHJvbC5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGxldCBncmFkID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgdGhpcy5jb250cm9sLndpZHRoLCAwKTtcclxuICAgICAgICBsZXQgYXJyID0gWycjZmYwMDAwJywgJyNmZmZmMDAnLCAnIzAwZmYwMCcsICcjMDBmZmZmJywgJyMwMDAwZmYnLCAnI2ZmMDBmZicsICcjZmYwMDAwJ107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IGFyci5sZW5ndGg7IGkgPCBqOyArK2kpe1xyXG4gICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcChpIC8gKGogLSAxKSwgYXJyW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZDtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNvbnRyb2wud2lkdGgsIHRoaXMuY29udHJvbC5oZWlnaHQpO1xyXG4gICAgICAgIGdyYWQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCB0aGlzLmNvbnRyb2wuaGVpZ2h0KTtcclxuICAgICAgICBhcnIgPSBbJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMS4wKScsICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMCknLCAncmdiYSgwLCAwLCAwLCAwLjApJywgJ3JnYmEoMCwgMCwgMCwgMS4wKSddO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSBhcnIubGVuZ3RoOyBpIDwgajsgKytpKXtcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoaSAvIChqIC0gMSksIGFycltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jb250cm9sLndpZHRoLCB0aGlzLmNvbnRyb2wuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Ieq6Lqr44Gr6Kit5a6a44GV44KM44Gm44GE44KL6Imy44KS6KGo44GZ5paH5a2X5YiX44Gu5YCkXHJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbG9yVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgq/jg6rjg4Pjgq/mmYLjgavjga7jgb8gY29sb3JWYWx1ZSDjgpLmm7TmlrDjgZnjgovjgZ/jgoHjga7kuIDmmYLjgq3jg6Pjg4Pjgrfjg6XlpInmlbBcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgdGhpcy50ZW1wQ29sb3JWYWx1ZSA9IHRoaXMuY29sb3JWYWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGVtcENvbG9yVmFsdWUgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMudGVtcENvbG9yVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wQ29sb3JWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKGV2ZS5vZmZzZXRYLCBldmUub2Zmc2V0WSwgMSwgMSk7XHJcbiAgICAgICAgICAgIGxldCBjb2xvciA9IHRoaXMuZ2V0Q29sb3I4Yml0U3RyaW5nKGltYWdlRGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShjb2xvcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YShldmUub2Zmc2V0WCwgZXZlLm9mZnNldFksIDEsIDEpO1xyXG4gICAgICAgICAgICBldmUuY3VycmVudFRhcmdldC52YWx1ZSA9IHRoaXMuZ2V0Q29sb3I4Yml0U3RyaW5nKGltYWdlRGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy50ZW1wQ29sb3JWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIGV2ZSk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rouqvjga7jg5fjg63jg5Hjg4bjgqPjgavoibLjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIENTUyDoibLooajnj77jga7jgYbjgaEgMTYg6YCy5pWw6KGo6KiY44Gu44KC44GuXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKHZhbHVlKXtcclxuICAgICAgICB0aGlzLnZhbHVlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb2xvclZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvclZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rouqvjgavoqK3lrprjgZXjgozjgabjgYTjgovoibLjgpLooajjgZnmloflrZfliJfjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gMTYg6YCy5pWw6KGo6KiY44Gu6Imy44KS6KGo44GZ5paH5a2X5YiXXHJcbiAgICAgKi9cclxuICAgIGdldFZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sb3JWYWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Ieq6Lqr44Gr6Kit5a6a44GV44KM44Gm44GE44KL6Imy44KS6KGo44GZ5paH5a2X5YiX44KSIDAuMCDjgYvjgokgMS4wIOOBruWApOOBq+WkieaPm+OBl+mFjeWIl+OBp+i/lOOBmVxyXG4gICAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IOa1ruWLleWwj+aVsOOBp+ihqOePvuOBl+OBn+iJsuOBruWApOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBnZXRGbG9hdFZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29sb3JGbG9hdEFycmF5KHRoaXMuY29sb3JWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNhbnZhcy5pbWFnZURhdGEg44GL44KJ5Y+W5b6X44GZ44KL5pWw5YCk44Gu6YWN5YiX44KS5YWD44GrIDE2IOmAsuaVsOihqOiomOaWh+Wtl+WIl+OCkueUn+aIkOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDmnIDkvY7jgafjgoIgMyDjgaTjga7opoHntKDjgpLmjIHjgaTmlbDlgKTjga7phY3liJdcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gMTYg6YCy5pWw6KGo6KiY44Gu6Imy44Gu5YCk44Gu5paH5a2X5YiXXHJcbiAgICAgKi9cclxuICAgIGdldENvbG9yOGJpdFN0cmluZyhjb2xvcil7XHJcbiAgICAgICAgbGV0IHIgPSB0aGlzLnplcm9QYWRkaW5nKGNvbG9yWzBdLnRvU3RyaW5nKDE2KSwgMik7XHJcbiAgICAgICAgbGV0IGcgPSB0aGlzLnplcm9QYWRkaW5nKGNvbG9yWzFdLnRvU3RyaW5nKDE2KSwgMik7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnplcm9QYWRkaW5nKGNvbG9yWzJdLnRvU3RyaW5nKDE2KSwgMik7XHJcbiAgICAgICAgcmV0dXJuICcjJyArIHIgKyBnICsgYjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMTYg6YCy5pWw6KGo6KiY44Gu6Imy6KGo54++5paH5a2X5YiX44KS5YWD44GrIDAuMCDjgYvjgokgMS4wIOOBruWApOOBq+WkieaPm+OBl+OBn+mFjeWIl+OCkueUn+aIkOOBl+i/lOOBmVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gMTYg6YCy5pWw6KGo6KiY44Gu6Imy44Gu5YCk44Gu5paH5a2X5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gUkdCIOOBriAzIOOBpOOBruWApOOCkiAwLjAg44GL44KJIDEuMCDjgavlpInmj5vjgZfjgZ/lgKTjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgZ2V0Q29sb3JGbG9hdEFycmF5KGNvbG9yKXtcclxuICAgICAgICBpZihjb2xvciA9PSBudWxsIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjb2xvcikgIT09ICdbb2JqZWN0IFN0cmluZ10nKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgaWYoY29sb3Iuc2VhcmNoKC9eIytbXFxkfGEtZnxBLUZdKyQvKSA9PT0gLTEpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgcyA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgaWYocy5sZW5ndGggIT09IDMgJiYgcy5sZW5ndGggIT09IDYpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgdCA9IHMubGVuZ3RoIC8gMztcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBwYXJzZUludChjb2xvci5zdWJzdHIoMSwgdCksIDE2KSAvIDI1NSxcclxuICAgICAgICAgICAgcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDEgKyB0LCB0KSwgMTYpIC8gMjU1LFxyXG4gICAgICAgICAgICBwYXJzZUludChjb2xvci5zdWJzdHIoMSArIHQgKiAyLCB0KSwgMTYpIC8gMjU1XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5pWw5YCk44KS5oyH5a6a44GV44KM44Gf5qGB5pWw44Gr5pW05b2i44GX44Gf5paH5a2X5YiX44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0g5pW05b2i44GX44Gf44GE5pWw5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgLSDmlbTlvaLjgZnjgovmoYHmlbBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gMTYg6YCy5pWw6KGo6KiY44Gu6Imy44Gu5YCk44Gu5paH5a2X5YiXXHJcbiAgICAgKi9cclxuICAgIHplcm9QYWRkaW5nKG51bWJlciwgY291bnQpe1xyXG4gICAgICAgIGxldCBhID0gbmV3IEFycmF5KGNvdW50KS5qb2luKCcwJyk7XHJcbiAgICAgICAgcmV0dXJuIChhICsgbnVtYmVyKS5zbGljZSgtY291bnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNHdWkuanMiLCJcclxuLyoqXHJcbiAqIGdsM01hdGhcclxuICogQGNsYXNzIGdsM01hdGhcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM01hdGgge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXQ0XHJcbiAgICAgICAgICogQHR5cGUge01hdDR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5NYXQ0ID0gTWF0NDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBWZWMzXHJcbiAgICAgICAgICogQHR5cGUge1ZlYzN9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5WZWMzID0gVmVjMztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBWZWMyXHJcbiAgICAgICAgICogQHR5cGUge1ZlYzJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5WZWMyID0gVmVjMjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBRdG5cclxuICAgICAgICAgKiBAdHlwZSB7UXRufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuUXRuICA9IFF0bjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1hdDRcclxuICogQGNsYXNzIE1hdDRcclxuICovXHJcbmNsYXNzIE1hdDQge1xyXG4gICAgLyoqXHJcbiAgICAgKiA0eDQg44Gu5q2j5pa56KGM5YiX44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IOihjOWIl+agvOe0jeeUqOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgpLljZjkvY3ljJbjgZnjgovvvIjlj4Lnhafjgavms6jmhI/vvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gZGVzdCAtIOWNmOS9jeWMluOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g5Y2Y5L2N5YyW44GX44Gf6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpZGVudGl0eShkZXN0KXtcclxuICAgICAgICBkZXN0WzBdICA9IDE7IGRlc3RbMV0gID0gMDsgZGVzdFsyXSAgPSAwOyBkZXN0WzNdICA9IDA7XHJcbiAgICAgICAgZGVzdFs0XSAgPSAwOyBkZXN0WzVdICA9IDE7IGRlc3RbNl0gID0gMDsgZGVzdFs3XSAgPSAwO1xyXG4gICAgICAgIGRlc3RbOF0gID0gMDsgZGVzdFs5XSAgPSAwOyBkZXN0WzEwXSA9IDE7IGRlc3RbMTFdID0gMDtcclxuICAgICAgICBkZXN0WzEyXSA9IDA7IGRlc3RbMTNdID0gMDsgZGVzdFsxNF0gPSAwOyBkZXN0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OCkuS5l+eul+OBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQwIC0g5LmX566X44GV44KM44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdDEgLSDkuZfnrpfjgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g5LmX566X57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDkuZfnrpfntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdDAsIG1hdDEsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgYSA9IG1hdDBbMF0sICBiID0gbWF0MFsxXSwgIGMgPSBtYXQwWzJdLCAgZCA9IG1hdDBbM10sXHJcbiAgICAgICAgICAgIGUgPSBtYXQwWzRdLCAgZiA9IG1hdDBbNV0sICBnID0gbWF0MFs2XSwgIGggPSBtYXQwWzddLFxyXG4gICAgICAgICAgICBpID0gbWF0MFs4XSwgIGogPSBtYXQwWzldLCAgayA9IG1hdDBbMTBdLCBsID0gbWF0MFsxMV0sXHJcbiAgICAgICAgICAgIG0gPSBtYXQwWzEyXSwgbiA9IG1hdDBbMTNdLCBvID0gbWF0MFsxNF0sIHAgPSBtYXQwWzE1XSxcclxuICAgICAgICAgICAgQSA9IG1hdDFbMF0sICBCID0gbWF0MVsxXSwgIEMgPSBtYXQxWzJdLCAgRCA9IG1hdDFbM10sXHJcbiAgICAgICAgICAgIEUgPSBtYXQxWzRdLCAgRiA9IG1hdDFbNV0sICBHID0gbWF0MVs2XSwgIEggPSBtYXQxWzddLFxyXG4gICAgICAgICAgICBJID0gbWF0MVs4XSwgIEogPSBtYXQxWzldLCAgSyA9IG1hdDFbMTBdLCBMID0gbWF0MVsxMV0sXHJcbiAgICAgICAgICAgIE0gPSBtYXQxWzEyXSwgTiA9IG1hdDFbMTNdLCBPID0gbWF0MVsxNF0sIFAgPSBtYXQxWzE1XTtcclxuICAgICAgICBvdXRbMF0gID0gQSAqIGEgKyBCICogZSArIEMgKiBpICsgRCAqIG07XHJcbiAgICAgICAgb3V0WzFdICA9IEEgKiBiICsgQiAqIGYgKyBDICogaiArIEQgKiBuO1xyXG4gICAgICAgIG91dFsyXSAgPSBBICogYyArIEIgKiBnICsgQyAqIGsgKyBEICogbztcclxuICAgICAgICBvdXRbM10gID0gQSAqIGQgKyBCICogaCArIEMgKiBsICsgRCAqIHA7XHJcbiAgICAgICAgb3V0WzRdICA9IEUgKiBhICsgRiAqIGUgKyBHICogaSArIEggKiBtO1xyXG4gICAgICAgIG91dFs1XSAgPSBFICogYiArIEYgKiBmICsgRyAqIGogKyBIICogbjtcclxuICAgICAgICBvdXRbNl0gID0gRSAqIGMgKyBGICogZyArIEcgKiBrICsgSCAqIG87XHJcbiAgICAgICAgb3V0WzddICA9IEUgKiBkICsgRiAqIGggKyBHICogbCArIEggKiBwO1xyXG4gICAgICAgIG91dFs4XSAgPSBJICogYSArIEogKiBlICsgSyAqIGkgKyBMICogbTtcclxuICAgICAgICBvdXRbOV0gID0gSSAqIGIgKyBKICogZiArIEsgKiBqICsgTCAqIG47XHJcbiAgICAgICAgb3V0WzEwXSA9IEkgKiBjICsgSiAqIGcgKyBLICogayArIEwgKiBvO1xyXG4gICAgICAgIG91dFsxMV0gPSBJICogZCArIEogKiBoICsgSyAqIGwgKyBMICogcDtcclxuICAgICAgICBvdXRbMTJdID0gTSAqIGEgKyBOICogZSArIE8gKiBpICsgUCAqIG07XHJcbiAgICAgICAgb3V0WzEzXSA9IE0gKiBiICsgTiAqIGYgKyBPICogaiArIFAgKiBuO1xyXG4gICAgICAgIG91dFsxNF0gPSBNICogYyArIE4gKiBnICsgTyAqIGsgKyBQICogbztcclxuICAgICAgICBvdXRbMTVdID0gTSAqIGQgKyBOICogaCArIE8gKiBsICsgUCAqIHA7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44Gr5ouh5aSn57iu5bCP44KS6YGp55So44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOCkuWPl+OBkeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2ZWMgLSBYWVog44Gu5ZCE6Lu444Gr5a++44GX44Gm5ouh57iu44KS6YGp55So44GZ44KL5YCk44Gu6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY2FsZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIG91dFswXSAgPSBtYXRbMF0gICogdmVjWzBdO1xyXG4gICAgICAgIG91dFsxXSAgPSBtYXRbMV0gICogdmVjWzBdO1xyXG4gICAgICAgIG91dFsyXSAgPSBtYXRbMl0gICogdmVjWzBdO1xyXG4gICAgICAgIG91dFszXSAgPSBtYXRbM10gICogdmVjWzBdO1xyXG4gICAgICAgIG91dFs0XSAgPSBtYXRbNF0gICogdmVjWzFdO1xyXG4gICAgICAgIG91dFs1XSAgPSBtYXRbNV0gICogdmVjWzFdO1xyXG4gICAgICAgIG91dFs2XSAgPSBtYXRbNl0gICogdmVjWzFdO1xyXG4gICAgICAgIG91dFs3XSAgPSBtYXRbN10gICogdmVjWzFdO1xyXG4gICAgICAgIG91dFs4XSAgPSBtYXRbOF0gICogdmVjWzJdO1xyXG4gICAgICAgIG91dFs5XSAgPSBtYXRbOV0gICogdmVjWzJdO1xyXG4gICAgICAgIG91dFsxMF0gPSBtYXRbMTBdICogdmVjWzJdO1xyXG4gICAgICAgIG91dFsxMV0gPSBtYXRbMTFdICogdmVjWzJdO1xyXG4gICAgICAgIG91dFsxMl0gPSBtYXRbMTJdO1xyXG4gICAgICAgIG91dFsxM10gPSBtYXRbMTNdO1xyXG4gICAgICAgIG91dFsxNF0gPSBtYXRbMTRdO1xyXG4gICAgICAgIG91dFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OBq+W5s+ihjOenu+WLleOCkumBqeeUqOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgpLlj5fjgZHjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdmVjIC0gWFlaIOOBruWQhOi7uOOBq+WvvuOBl+OBpuW5s+ihjOenu+WLleOCkumBqeeUqOOBmeOCi+WApOOBruihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKG1hdCwgdmVjLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgb3V0WzBdID0gbWF0WzBdOyBvdXRbMV0gPSBtYXRbMV07IG91dFsyXSAgPSBtYXRbMl07ICBvdXRbM10gID0gbWF0WzNdO1xyXG4gICAgICAgIG91dFs0XSA9IG1hdFs0XTsgb3V0WzVdID0gbWF0WzVdOyBvdXRbNl0gID0gbWF0WzZdOyAgb3V0WzddICA9IG1hdFs3XTtcclxuICAgICAgICBvdXRbOF0gPSBtYXRbOF07IG91dFs5XSA9IG1hdFs5XTsgb3V0WzEwXSA9IG1hdFsxMF07IG91dFsxMV0gPSBtYXRbMTFdO1xyXG4gICAgICAgIG91dFsxMl0gPSBtYXRbMF0gKiB2ZWNbMF0gKyBtYXRbNF0gKiB2ZWNbMV0gKyBtYXRbOF0gICogdmVjWzJdICsgbWF0WzEyXTtcclxuICAgICAgICBvdXRbMTNdID0gbWF0WzFdICogdmVjWzBdICsgbWF0WzVdICogdmVjWzFdICsgbWF0WzldICAqIHZlY1syXSArIG1hdFsxM107XHJcbiAgICAgICAgb3V0WzE0XSA9IG1hdFsyXSAqIHZlY1swXSArIG1hdFs2XSAqIHZlY1sxXSArIG1hdFsxMF0gKiB2ZWNbMl0gKyBtYXRbMTRdO1xyXG4gICAgICAgIG91dFsxNV0gPSBtYXRbM10gKiB2ZWNbMF0gKyBtYXRbN10gKiB2ZWNbMV0gKyBtYXRbMTFdICogdmVjWzJdICsgbWF0WzE1XTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgavlm57ou6LjgpLpgannlKjjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44KS5Y+X44GR44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSDlm57ou6Lph4/jgpLooajjgZnlgKTvvIjjg6njgrjjgqLjg7PvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gYXhpcyAtIOWbnui7ouOBrui7uFxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcm90YXRlKG1hdCwgYW5nbGUsIGF4aXMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcclxuICAgICAgICBpZighc3Epe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgYSA9IGF4aXNbMF0sIGIgPSBheGlzWzFdLCBjID0gYXhpc1syXTtcclxuICAgICAgICBpZihzcSAhPSAxKXtzcSA9IDEgLyBzcTsgYSAqPSBzcTsgYiAqPSBzcTsgYyAqPSBzcTt9XHJcbiAgICAgICAgbGV0IGQgPSBNYXRoLnNpbihhbmdsZSksIGUgPSBNYXRoLmNvcyhhbmdsZSksIGYgPSAxIC0gZSxcclxuICAgICAgICAgICAgZyA9IG1hdFswXSwgIGggPSBtYXRbMV0sIGkgPSBtYXRbMl0sICBqID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBrID0gbWF0WzRdLCAgbCA9IG1hdFs1XSwgbSA9IG1hdFs2XSwgIG4gPSBtYXRbN10sXHJcbiAgICAgICAgICAgIG8gPSBtYXRbOF0sICBwID0gbWF0WzldLCBxID0gbWF0WzEwXSwgciA9IG1hdFsxMV0sXHJcbiAgICAgICAgICAgIHMgPSBhICogYSAqIGYgKyBlLFxyXG4gICAgICAgICAgICB0ID0gYiAqIGEgKiBmICsgYyAqIGQsXHJcbiAgICAgICAgICAgIHUgPSBjICogYSAqIGYgLSBiICogZCxcclxuICAgICAgICAgICAgdiA9IGEgKiBiICogZiAtIGMgKiBkLFxyXG4gICAgICAgICAgICB3ID0gYiAqIGIgKiBmICsgZSxcclxuICAgICAgICAgICAgeCA9IGMgKiBiICogZiArIGEgKiBkLFxyXG4gICAgICAgICAgICB5ID0gYSAqIGMgKiBmICsgYiAqIGQsXHJcbiAgICAgICAgICAgIHogPSBiICogYyAqIGYgLSBhICogZCxcclxuICAgICAgICAgICAgQSA9IGMgKiBjICogZiArIGU7XHJcbiAgICAgICAgaWYoYW5nbGUpe1xyXG4gICAgICAgICAgICBpZihtYXQgIT0gb3V0KXtcclxuICAgICAgICAgICAgICAgIG91dFsxMl0gPSBtYXRbMTJdOyBvdXRbMTNdID0gbWF0WzEzXTtcclxuICAgICAgICAgICAgICAgIG91dFsxNF0gPSBtYXRbMTRdOyBvdXRbMTVdID0gbWF0WzE1XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dCA9IG1hdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0WzBdICA9IGcgKiBzICsgayAqIHQgKyBvICogdTtcclxuICAgICAgICBvdXRbMV0gID0gaCAqIHMgKyBsICogdCArIHAgKiB1O1xyXG4gICAgICAgIG91dFsyXSAgPSBpICogcyArIG0gKiB0ICsgcSAqIHU7XHJcbiAgICAgICAgb3V0WzNdICA9IGogKiBzICsgbiAqIHQgKyByICogdTtcclxuICAgICAgICBvdXRbNF0gID0gZyAqIHYgKyBrICogdyArIG8gKiB4O1xyXG4gICAgICAgIG91dFs1XSAgPSBoICogdiArIGwgKiB3ICsgcCAqIHg7XHJcbiAgICAgICAgb3V0WzZdICA9IGkgKiB2ICsgbSAqIHcgKyBxICogeDtcclxuICAgICAgICBvdXRbN10gID0gaiAqIHYgKyBuICogdyArIHIgKiB4O1xyXG4gICAgICAgIG91dFs4XSAgPSBnICogeSArIGsgKiB6ICsgbyAqIEE7XHJcbiAgICAgICAgb3V0WzldICA9IGggKiB5ICsgbCAqIHogKyBwICogQTtcclxuICAgICAgICBvdXRbMTBdID0gaSAqIHkgKyBtICogeiArIHEgKiBBO1xyXG4gICAgICAgIG91dFsxMV0gPSBqICogeSArIG4gKiB6ICsgciAqIEE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OT44Ol44O85bqn5qiZ5aSJ5o+b6KGM5YiX44KS55Sf5oiQ44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IGV5ZSAtIOimlueCueS9jee9rlxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSBjZW50ZXIgLSDms6joppbngrlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdXAgLSDkuIrmlrnlkJHjgpLnpLrjgZnjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxvb2tBdChleWUsIGNlbnRlciwgdXAsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBleWVYICAgID0gZXllWzBdLCAgICBleWVZICAgID0gZXllWzFdLCAgICBleWVaICAgID0gZXllWzJdLFxyXG4gICAgICAgICAgICBjZW50ZXJYID0gY2VudGVyWzBdLCBjZW50ZXJZID0gY2VudGVyWzFdLCBjZW50ZXJaID0gY2VudGVyWzJdLFxyXG4gICAgICAgICAgICB1cFggICAgID0gdXBbMF0sICAgICB1cFkgICAgID0gdXBbMV0sICAgICB1cFogICAgID0gdXBbMl07XHJcbiAgICAgICAgaWYoZXllWCA9PSBjZW50ZXJYICYmIGV5ZVkgPT0gY2VudGVyWSAmJiBleWVaID09IGNlbnRlclope3JldHVybiBNYXQ0LmlkZW50aXR5KGRlc3QpO31cclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGw7XHJcbiAgICAgICAgejAgPSBleWVYIC0gY2VudGVyWzBdOyB6MSA9IGV5ZVkgLSBjZW50ZXJbMV07IHoyID0gZXllWiAtIGNlbnRlclsyXTtcclxuICAgICAgICBsID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xyXG4gICAgICAgIHowICo9IGw7IHoxICo9IGw7IHoyICo9IGw7XHJcbiAgICAgICAgeDAgPSB1cFkgKiB6MiAtIHVwWiAqIHoxO1xyXG4gICAgICAgIHgxID0gdXBaICogejAgLSB1cFggKiB6MjtcclxuICAgICAgICB4MiA9IHVwWCAqIHoxIC0gdXBZICogejA7XHJcbiAgICAgICAgbCA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xyXG4gICAgICAgIGlmKCFsKXtcclxuICAgICAgICAgICAgeDAgPSAwOyB4MSA9IDA7IHgyID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIHgwICo9IGw7IHgxICo9IGw7IHgyICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHkwID0gejEgKiB4MiAtIHoyICogeDE7IHkxID0gejIgKiB4MCAtIHowICogeDI7IHkyID0gejAgKiB4MSAtIHoxICogeDA7XHJcbiAgICAgICAgbCA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xyXG4gICAgICAgIGlmKCFsKXtcclxuICAgICAgICAgICAgeTAgPSAwOyB5MSA9IDA7IHkyID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIHkwICo9IGw7IHkxICo9IGw7IHkyICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dFswXSA9IHgwOyBvdXRbMV0gPSB5MDsgb3V0WzJdICA9IHowOyBvdXRbM10gID0gMDtcclxuICAgICAgICBvdXRbNF0gPSB4MTsgb3V0WzVdID0geTE7IG91dFs2XSAgPSB6MTsgb3V0WzddICA9IDA7XHJcbiAgICAgICAgb3V0WzhdID0geDI7IG91dFs5XSA9IHkyOyBvdXRbMTBdID0gejI7IG91dFsxMV0gPSAwO1xyXG4gICAgICAgIG91dFsxMl0gPSAtKHgwICogZXllWCArIHgxICogZXllWSArIHgyICogZXllWik7XHJcbiAgICAgICAgb3V0WzEzXSA9IC0oeTAgKiBleWVYICsgeTEgKiBleWVZICsgeTIgKiBleWVaKTtcclxuICAgICAgICBvdXRbMTRdID0gLSh6MCAqIGV5ZVggKyB6MSAqIGV5ZVkgKyB6MiAqIGV5ZVopO1xyXG4gICAgICAgIG91dFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmAj+imluaKleW9seWkieaPm+ihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZvdnkgLSDoppbph47op5LvvIjluqbmlbDms5XvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhc3BlY3QgLSDjgqLjgrnjg5rjgq/jg4jmr5TvvIjluYUgLyDpq5jjgZXvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIC0g44OL44Ki44Kv44Oq44OD44OX6Z2i44G+44Gn44Gu6Led6ZuiXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmFyIC0g44OV44Kh44O844Kv44Oq44OD44OX6Z2i44G+44Gn44Gu6Led6ZuiXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCB0ID0gbmVhciAqIE1hdGgudGFuKGZvdnkgKiBNYXRoLlBJIC8gMzYwKTtcclxuICAgICAgICBsZXQgciA9IHQgKiBhc3BlY3Q7XHJcbiAgICAgICAgbGV0IGEgPSByICogMiwgYiA9IHQgKiAyLCBjID0gZmFyIC0gbmVhcjtcclxuICAgICAgICBvdXRbMF0gID0gbmVhciAqIDIgLyBhO1xyXG4gICAgICAgIG91dFsxXSAgPSAwO1xyXG4gICAgICAgIG91dFsyXSAgPSAwO1xyXG4gICAgICAgIG91dFszXSAgPSAwO1xyXG4gICAgICAgIG91dFs0XSAgPSAwO1xyXG4gICAgICAgIG91dFs1XSAgPSBuZWFyICogMiAvIGI7XHJcbiAgICAgICAgb3V0WzZdICA9IDA7XHJcbiAgICAgICAgb3V0WzddICA9IDA7XHJcbiAgICAgICAgb3V0WzhdICA9IDA7XHJcbiAgICAgICAgb3V0WzldICA9IDA7XHJcbiAgICAgICAgb3V0WzEwXSA9IC0oZmFyICsgbmVhcikgLyBjO1xyXG4gICAgICAgIG91dFsxMV0gPSAtMTtcclxuICAgICAgICBvdXRbMTJdID0gMDtcclxuICAgICAgICBvdXRbMTNdID0gMDtcclxuICAgICAgICBvdXRbMTRdID0gLShmYXIgKiBuZWFyICogMikgLyBjO1xyXG4gICAgICAgIG91dFsxNV0gPSAwO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOato+WwhOW9seaKleW9seWkieaPm+ihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgLSDlt6bnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCAtIOWPs+err1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcCAtIOS4iuerr1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJvdHRvbSAtIOS4i+err1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgLSDjg4vjgqLjgq/jg6rjg4Pjg5fpnaLjgb7jgafjga7ot53pm6JcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgLSDjg5XjgqHjg7zjgq/jg6rjg4Pjg5fpnaLjgb7jgafjga7ot53pm6JcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG9ydGhvKGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IGggPSAocmlnaHQgLSBsZWZ0KTtcclxuICAgICAgICBsZXQgdiA9ICh0b3AgLSBib3R0b20pO1xyXG4gICAgICAgIGxldCBkID0gKGZhciAtIG5lYXIpO1xyXG4gICAgICAgIG91dFswXSAgPSAyIC8gaDtcclxuICAgICAgICBvdXRbMV0gID0gMDtcclxuICAgICAgICBvdXRbMl0gID0gMDtcclxuICAgICAgICBvdXRbM10gID0gMDtcclxuICAgICAgICBvdXRbNF0gID0gMDtcclxuICAgICAgICBvdXRbNV0gID0gMiAvIHY7XHJcbiAgICAgICAgb3V0WzZdICA9IDA7XHJcbiAgICAgICAgb3V0WzddICA9IDA7XHJcbiAgICAgICAgb3V0WzhdICA9IDA7XHJcbiAgICAgICAgb3V0WzldICA9IDA7XHJcbiAgICAgICAgb3V0WzEwXSA9IC0yIC8gZDtcclxuICAgICAgICBvdXRbMTFdID0gMDtcclxuICAgICAgICBvdXRbMTJdID0gLShsZWZ0ICsgcmlnaHQpIC8gaDtcclxuICAgICAgICBvdXRbMTNdID0gLSh0b3AgKyBib3R0b20pIC8gdjtcclxuICAgICAgICBvdXRbMTRdID0gLShmYXIgKyBuZWFyKSAvIGQ7XHJcbiAgICAgICAgb3V0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Lui572u6KGM5YiX44KS55Sf5oiQ44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdHJhbnNwb3NlKG1hdCwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIG91dFswXSAgPSBtYXRbMF07ICBvdXRbMV0gID0gbWF0WzRdO1xyXG4gICAgICAgIG91dFsyXSAgPSBtYXRbOF07ICBvdXRbM10gID0gbWF0WzEyXTtcclxuICAgICAgICBvdXRbNF0gID0gbWF0WzFdOyAgb3V0WzVdICA9IG1hdFs1XTtcclxuICAgICAgICBvdXRbNl0gID0gbWF0WzldOyAgb3V0WzddICA9IG1hdFsxM107XHJcbiAgICAgICAgb3V0WzhdICA9IG1hdFsyXTsgIG91dFs5XSAgPSBtYXRbNl07XHJcbiAgICAgICAgb3V0WzEwXSA9IG1hdFsxMF07IG91dFsxMV0gPSBtYXRbMTRdO1xyXG4gICAgICAgIG91dFsxMl0gPSBtYXRbM107ICBvdXRbMTNdID0gbWF0WzddO1xyXG4gICAgICAgIG91dFsxNF0gPSBtYXRbMTFdOyBvdXRbMTVdID0gbWF0WzE1XTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgIbooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbnZlcnNlKG1hdCwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCBhID0gbWF0WzBdLCAgYiA9IG1hdFsxXSwgIGMgPSBtYXRbMl0sICBkID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0WzRdLCAgZiA9IG1hdFs1XSwgIGcgPSBtYXRbNl0sICBoID0gbWF0WzddLFxyXG4gICAgICAgICAgICBpID0gbWF0WzhdLCAgaiA9IG1hdFs5XSwgIGsgPSBtYXRbMTBdLCBsID0gbWF0WzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV0sXHJcbiAgICAgICAgICAgIHEgPSBhICogZiAtIGIgKiBlLCByID0gYSAqIGcgLSBjICogZSxcclxuICAgICAgICAgICAgcyA9IGEgKiBoIC0gZCAqIGUsIHQgPSBiICogZyAtIGMgKiBmLFxyXG4gICAgICAgICAgICB1ID0gYiAqIGggLSBkICogZiwgdiA9IGMgKiBoIC0gZCAqIGcsXHJcbiAgICAgICAgICAgIHcgPSBpICogbiAtIGogKiBtLCB4ID0gaSAqIG8gLSBrICogbSxcclxuICAgICAgICAgICAgeSA9IGkgKiBwIC0gbCAqIG0sIHogPSBqICogbyAtIGsgKiBuLFxyXG4gICAgICAgICAgICBBID0gaiAqIHAgLSBsICogbiwgQiA9IGsgKiBwIC0gbCAqIG8sXHJcbiAgICAgICAgICAgIGl2ZCA9IDEgLyAocSAqIEIgLSByICogQSArIHMgKiB6ICsgdCAqIHkgLSB1ICogeCArIHYgKiB3KTtcclxuICAgICAgICBvdXRbMF0gID0gKCBmICogQiAtIGcgKiBBICsgaCAqIHopICogaXZkO1xyXG4gICAgICAgIG91dFsxXSAgPSAoLWIgKiBCICsgYyAqIEEgLSBkICogeikgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzJdICA9ICggbiAqIHYgLSBvICogdSArIHAgKiB0KSAqIGl2ZDtcclxuICAgICAgICBvdXRbM10gID0gKC1qICogdiArIGsgKiB1IC0gbCAqIHQpICogaXZkO1xyXG4gICAgICAgIG91dFs0XSAgPSAoLWUgKiBCICsgZyAqIHkgLSBoICogeCkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzVdICA9ICggYSAqIEIgLSBjICogeSArIGQgKiB4KSAqIGl2ZDtcclxuICAgICAgICBvdXRbNl0gID0gKC1tICogdiArIG8gKiBzIC0gcCAqIHIpICogaXZkO1xyXG4gICAgICAgIG91dFs3XSAgPSAoIGkgKiB2IC0gayAqIHMgKyBsICogcikgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzhdICA9ICggZSAqIEEgLSBmICogeSArIGggKiB3KSAqIGl2ZDtcclxuICAgICAgICBvdXRbOV0gID0gKC1hICogQSArIGIgKiB5IC0gZCAqIHcpICogaXZkO1xyXG4gICAgICAgIG91dFsxMF0gPSAoIG0gKiB1IC0gbiAqIHMgKyBwICogcSkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzExXSA9ICgtaSAqIHUgKyBqICogcyAtIGwgKiBxKSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTJdID0gKC1lICogeiArIGYgKiB4IC0gZyAqIHcpICogaXZkO1xyXG4gICAgICAgIG91dFsxM10gPSAoIGEgKiB6IC0gYiAqIHggKyBjICogdykgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzE0XSA9ICgtbSAqIHQgKyBuICogciAtIG8gKiBxKSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTVdID0gKCBpICogdCAtIGogKiByICsgayAqIHEpICogaXZkO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OBq+ODmeOCr+ODiOODq+OCkuS5l+eul+OBmeOCi++8iOODmeOCr+ODiOODq+OBq+ihjOWIl+OCkumBqeeUqOOBmeOCi++8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHZlYyAtIOS5l+eul+OBmeOCi+ODmeOCr+ODiOODq++8iDQg44Gk44Gu6KaB57Sg44KS5oyB44Gk6YWN5YiX77yJXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IOe1kOaenOOBruODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9WZWNJVihtYXQsIHZlYyl7XHJcbiAgICAgICAgbGV0IGEgPSBtYXRbMF0sICBiID0gbWF0WzFdLCAgYyA9IG1hdFsyXSwgIGQgPSBtYXRbM10sXHJcbiAgICAgICAgICAgIGUgPSBtYXRbNF0sICBmID0gbWF0WzVdLCAgZyA9IG1hdFs2XSwgIGggPSBtYXRbN10sXHJcbiAgICAgICAgICAgIGkgPSBtYXRbOF0sICBqID0gbWF0WzldLCAgayA9IG1hdFsxMF0sIGwgPSBtYXRbMTFdLFxyXG4gICAgICAgICAgICBtID0gbWF0WzEyXSwgbiA9IG1hdFsxM10sIG8gPSBtYXRbMTRdLCBwID0gbWF0WzE1XTtcclxuICAgICAgICBsZXQgeCA9IHZlY1swXSwgeSA9IHZlY1sxXSwgeiA9IHZlY1syXSwgdyA9IHZlY1szXTtcclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgb3V0WzBdID0geCAqIGEgKyB5ICogZSArIHogKiBpICsgdyAqIG07XHJcbiAgICAgICAgb3V0WzFdID0geCAqIGIgKyB5ICogZiArIHogKiBqICsgdyAqIG47XHJcbiAgICAgICAgb3V0WzJdID0geCAqIGMgKyB5ICogZyArIHogKiBrICsgdyAqIG87XHJcbiAgICAgICAgb3V0WzNdID0geCAqIGQgKyB5ICogaCArIHogKiBsICsgdyAqIHA7XHJcbiAgICAgICAgdmVjID0gb3V0O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCq+ODoeODqeOBruODl+ODreODkeODhuOCo+OBq+ebuOW9k+OBmeOCi+aDheWgseOCkuWPl+OBkeWPluOCiuihjOWIl+OCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSBwb3NpdGlvbiAtIOOCq+ODoeODqeOBruW6p+aomVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSBjZW50ZXJQb2ludCAtIOOCq+ODoeODqeOBruazqOimlueCuVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB1cERpcmVjdGlvbiAtIOOCq+ODoeODqeOBruS4iuaWueWQkVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZvdnkgLSDoppbph47op5JcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhc3BlY3QgLSDjgqLjgrnjg5rjgq/jg4jmr5RcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIC0g44OL44Ki44Kv44Oq44OD44OX6Z2iXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmFyIC0g44OV44Kh44O844Kv44Oq44OD44OX6Z2iXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IHZtYXQgLSDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJfjga7ntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gcG1hdCAtIOmAj+imluaKleW9seW6p+aomeWkieaPm+ihjOWIl+OBrue1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBkZXN0IC0g44OT44Ol44O8IHgg6YCP6KaW5oqV5b2x5aSJ5o+b6KGM5YiX44Gu57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB2cEZyb21DYW1lcmFQcm9wZXJ0eShwb3NpdGlvbiwgY2VudGVyUG9pbnQsIHVwRGlyZWN0aW9uLCBmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgdm1hdCwgcG1hdCwgZGVzdCl7XHJcbiAgICAgICAgTWF0NC5sb29rQXQocG9zaXRpb24sIGNlbnRlclBvaW50LCB1cERpcmVjdGlvbiwgdm1hdCk7XHJcbiAgICAgICAgTWF0NC5wZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgcG1hdCk7XHJcbiAgICAgICAgTWF0NC5tdWx0aXBseShwbWF0LCB2bWF0LCBkZXN0KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogTVZQIOihjOWIl+OBq+ebuOW9k+OBmeOCi+ihjOWIl+OCkuWPl+OBkeWPluOCiuODmeOCr+ODiOODq+OCkuWkieaPm+OBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSBNVlAg6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB2ZWMgLSBNVlAg6KGM5YiX44Go5LmX566X44GZ44KL44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDjg5Pjg6Xjg7zjg53jg7zjg4jjga7luYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDjg5Pjg6Xjg7zjg53jg7zjg4jjga7pq5jjgZVcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSDntZDmnpzjga7jg5njgq/jg4jjg6vvvIgyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq++8iVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NyZWVuUG9zaXRpb25Gcm9tTXZwKG1hdCwgdmVjLCB3aWR0aCwgaGVpZ2h0KXtcclxuICAgICAgICBsZXQgaGFsZldpZHRoID0gd2lkdGggKiAwLjU7XHJcbiAgICAgICAgbGV0IGhhbGZIZWlnaHQgPSBoZWlnaHQgKiAwLjU7XHJcbiAgICAgICAgbGV0IHYgPSBNYXQ0LnRvVmVjSVYobWF0LCBbdmVjWzBdLCB2ZWNbMV0sIHZlY1syXSwgMS4wXSk7XHJcbiAgICAgICAgaWYodlszXSA8PSAwLjApe3JldHVybiBbTmFOLCBOYU5dO31cclxuICAgICAgICB2WzBdIC89IHZbM107IHZbMV0gLz0gdlszXTsgdlsyXSAvPSB2WzNdO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGhhbGZXaWR0aCArIHZbMF0gKiBoYWxmV2lkdGgsXHJcbiAgICAgICAgICAgIGhhbGZIZWlnaHQgLSB2WzFdICogaGFsZkhlaWdodFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWZWMzXHJcbiAqIEBjbGFzcyBWZWMzXHJcbiAqL1xyXG5jbGFzcyBWZWMzIHtcclxuICAgIC8qKlxyXG4gICAgICogMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6vjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g44OZ44Kv44OI44Or5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44Gu6ZW344GV77yI5aSn44GN44GV77yJ44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjg5njgq/jg4jjg6vjga7plbfjgZXvvIjlpKfjgY3jgZXvvIlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxlbih2KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0gKyB2WzJdICogdlsyXSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu5bqn5qiZ77yI5aeL54K544O757WC54K577yJ44KS57WQ44G244OZ44Kv44OI44Or44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYwIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTlp4vngrnluqfmqJlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjEgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOe1gueCueW6p+aomVxyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMzPn0g6KaW54K544Go57WC54K544KS57WQ44G244OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkaXN0YW5jZSh2MCwgdjEpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBuWzBdID0gdjFbMF0gLSB2MFswXTtcclxuICAgICAgICBuWzFdID0gdjFbMV0gLSB2MFsxXTtcclxuICAgICAgICBuWzJdID0gdjFbMl0gLSB2MFsyXTtcclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44KS5q2j6KaP5YyW44GX44Gf57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMzPn0g5q2j6KaP5YyW44GX44Gf44OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBub3JtYWxpemUodil7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCBsID0gVmVjMy5sZW4odik7XHJcbiAgICAgICAgaWYobCA+IDApe1xyXG4gICAgICAgICAgICBsZXQgZSA9IDEuMCAvIGw7XHJcbiAgICAgICAgICAgIG5bMF0gPSB2WzBdICogZTtcclxuICAgICAgICAgICAgblsxXSA9IHZbMV0gKiBlO1xyXG4gICAgICAgICAgICBuWzJdID0gdlsyXSAqIGU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIG5bMF0gPSAwLjA7XHJcbiAgICAgICAgICAgIG5bMV0gPSAwLjA7XHJcbiAgICAgICAgICAgIG5bMl0gPSAwLjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruODmeOCr+ODiOODq+OBruWGheepjeOBrue1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MCAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYxIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g5YaF56mN44Gu57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkb3QodjAsIHYxKXtcclxuICAgICAgICByZXR1cm4gdjBbMF0gKiB2MVswXSArIHYwWzFdICogdjFbMV0gKyB2MFsyXSAqIHYxWzJdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruODmeOCr+ODiOODq+OBruWkluepjeOBrue1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MCAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYxIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMz59IOWkluepjeOBrue1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3Jvc3ModjAsIHYxKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgblswXSA9IHYwWzFdICogdjFbMl0gLSB2MFsyXSAqIHYxWzFdO1xyXG4gICAgICAgIG5bMV0gPSB2MFsyXSAqIHYxWzBdIC0gdjBbMF0gKiB2MVsyXTtcclxuICAgICAgICBuWzJdID0gdjBbMF0gKiB2MVsxXSAtIHYwWzFdICogdjFbMF07XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDMg44Gk44Gu44OZ44Kv44OI44Or44GL44KJ6Z2i5rOV57ea44KS5rGC44KB44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYwIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjEgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MiAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSDpnaLms5Xnt5rjg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZhY2VOb3JtYWwodjAsIHYxLCB2Mil7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCB2ZWMxID0gW3YxWzBdIC0gdjBbMF0sIHYxWzFdIC0gdjBbMV0sIHYxWzJdIC0gdjBbMl1dO1xyXG4gICAgICAgIGxldCB2ZWMyID0gW3YyWzBdIC0gdjBbMF0sIHYyWzFdIC0gdjBbMV0sIHYyWzJdIC0gdjBbMl1dO1xyXG4gICAgICAgIG5bMF0gPSB2ZWMxWzFdICogdmVjMlsyXSAtIHZlYzFbMl0gKiB2ZWMyWzFdO1xyXG4gICAgICAgIG5bMV0gPSB2ZWMxWzJdICogdmVjMlswXSAtIHZlYzFbMF0gKiB2ZWMyWzJdO1xyXG4gICAgICAgIG5bMl0gPSB2ZWMxWzBdICogdmVjMlsxXSAtIHZlYzFbMV0gKiB2ZWMyWzBdO1xyXG4gICAgICAgIHJldHVybiBWZWMzLm5vcm1hbGl6ZShuKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFZlYzJcclxuICogQGNsYXNzIFZlYzJcclxuICovXHJcbmNsYXNzIFZlYzIge1xyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq+OCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDjg5njgq/jg4jjg6vmoLzntI3nlKjjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5njgq/jg4jjg6vjga7plbfjgZXvvIjlpKfjgY3jgZXvvInjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdiAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOODmeOCr+ODiOODq+OBrumVt+OBle+8iOWkp+OBjeOBle+8iVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbGVuKHYpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu5bqn5qiZ77yI5aeL54K544O757WC54K577yJ44KS57WQ44G244OZ44Kv44OI44Or44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYwIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTlp4vngrnluqfmqJlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjEgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOe1gueCueW6p+aomVxyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMyPn0g6KaW54K544Go57WC54K544KS57WQ44G244OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkaXN0YW5jZSh2MCwgdjEpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMi5jcmVhdGUoKTtcclxuICAgICAgICBuWzBdID0gdjFbMF0gLSB2MFswXTtcclxuICAgICAgICBuWzFdID0gdjFbMV0gLSB2MFsxXTtcclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44KS5q2j6KaP5YyW44GX44Gf57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMyPn0g5q2j6KaP5YyW44GX44Gf44OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBub3JtYWxpemUodil7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMyLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCBsID0gVmVjMi5sZW4odik7XHJcbiAgICAgICAgaWYobCA+IDApe1xyXG4gICAgICAgICAgICBsZXQgZSA9IDEuMCAvIGw7XHJcbiAgICAgICAgICAgIG5bMF0gPSB2WzBdICogZTtcclxuICAgICAgICAgICAgblsxXSA9IHZbMV0gKiBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lhoXnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjAgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MSAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOWGheepjeOBrue1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZG90KHYwLCB2MSl7XHJcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMF0gKyB2MFsxXSAqIHYxWzFdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruODmeOCr+ODiOODq+OBruWkluepjeOBrue1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MCAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYxIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMj59IOWkluepjeOBrue1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3Jvc3ModjAsIHYxKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzIuY3JlYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMV0gLSB2MFsxXSAqIHYxWzBdO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUXRuXHJcbiAqIEBjbGFzcyBRdG5cclxuICovXHJcbmNsYXNzIFF0biB7XHJcbiAgICAvKipcclxuICAgICAqIDQg44Gk44Gu6KaB57Sg44GL44KJ44Gq44KL44Kv44Kp44O844K/44OL44Kq44Oz44Gu44OH44O844K/5qeL6YCg44KS55Sf5oiQ44GZ44KL77yI6Jma6YOoIHgsIHksIHosIOWun+mDqCB3IOOBrumghuW6j+OBp+Wumue+qe+8iVxyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDjgq/jgqnjg7zjgr/jg4vjgqrjg7Pjg4fjg7zjgr/moLzntI3nlKjjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgq/jgqnjg7zjgr/jg4vjgqrjg7PjgpLliJ3mnJ/ljJbjgZnjgovvvIjlj4Lnhafjgavms6jmhI/vvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBkZXN0IC0g5Yid5pyf5YyW44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaWRlbnRpdHkoZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSA9IDA7IGRlc3RbMV0gPSAwOyBkZXN0WzJdID0gMDsgZGVzdFszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWFseW9ueWbm+WFg+aVsOOCkueUn+aIkOOBl+OBpui/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0biAtIOWFg+OBqOOBquOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGludmVyc2UocXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IFF0bi5jcmVhdGUoKTt9XHJcbiAgICAgICAgb3V0WzBdID0gLXF0blswXTtcclxuICAgICAgICBvdXRbMV0gPSAtcXRuWzFdO1xyXG4gICAgICAgIG91dFsyXSA9IC1xdG5bMl07XHJcbiAgICAgICAgb3V0WzNdID0gIHF0blszXTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDomZrpg6jjgpLmraPopo/ljJbjgZfjgabov5TjgZnvvIjlj4Lnhafjgavms6jmhI/vvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4gLSDlhYPjgajjgarjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBub3JtYWxpemUoZGVzdCl7XHJcbiAgICAgICAgbGV0IHggPSBkZXN0WzBdLCB5ID0gZGVzdFsxXSwgeiA9IGRlc3RbMl07XHJcbiAgICAgICAgbGV0IGwgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgICAgICBpZihsID09PSAwKXtcclxuICAgICAgICAgICAgZGVzdFswXSA9IDA7XHJcbiAgICAgICAgICAgIGRlc3RbMV0gPSAwO1xyXG4gICAgICAgICAgICBkZXN0WzJdID0gMDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICBkZXN0WzBdID0geCAqIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMV0gPSB5ICogbDtcclxuICAgICAgICAgICAgZGVzdFsyXSA9IHogKiBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kv44Kp44O844K/44OL44Kq44Oz44KS5LmX566X44GX44Gf57WQ5p6c44KS6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuMCAtIOS5l+eul+OBleOCjOOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0bjEgLSDkuZfnrpfjgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBtdWx0aXBseShxdG4wLCBxdG4xLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IFF0bi5jcmVhdGUoKTt9XHJcbiAgICAgICAgbGV0IGF4ID0gcXRuMFswXSwgYXkgPSBxdG4wWzFdLCBheiA9IHF0bjBbMl0sIGF3ID0gcXRuMFszXTtcclxuICAgICAgICBsZXQgYnggPSBxdG4xWzBdLCBieSA9IHF0bjFbMV0sIGJ6ID0gcXRuMVsyXSwgYncgPSBxdG4xWzNdO1xyXG4gICAgICAgIG91dFswXSA9IGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnk7XHJcbiAgICAgICAgb3V0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcclxuICAgICAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4O1xyXG4gICAgICAgIG91dFszXSA9IGF3ICogYncgLSBheCAqIGJ4IC0gYXkgKiBieSAtIGF6ICogYno7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kv44Kp44O844K/44OL44Kq44Oz44Gr5Zue6Lui44KS6YGp55So44GX6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSDlm57ou6LjgZnjgovph4/vvIjjg6njgrjjgqLjg7PvvIlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGF4aXMgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOi7uOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJvdGF0ZShhbmdsZSwgYXhpcywgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xyXG4gICAgICAgIGxldCBzcSA9IE1hdGguc3FydChheGlzWzBdICogYXhpc1swXSArIGF4aXNbMV0gKiBheGlzWzFdICsgYXhpc1syXSAqIGF4aXNbMl0pO1xyXG4gICAgICAgIGlmKHNxICE9PSAwKXtcclxuICAgICAgICAgICAgbGV0IGwgPSAxIC8gc3E7XHJcbiAgICAgICAgICAgIGEgKj0gbDtcclxuICAgICAgICAgICAgYiAqPSBsO1xyXG4gICAgICAgICAgICBjICo9IGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4oYW5nbGUgKiAwLjUpO1xyXG4gICAgICAgIG91dFswXSA9IGEgKiBzO1xyXG4gICAgICAgIG91dFsxXSA9IGIgKiBzO1xyXG4gICAgICAgIG91dFsyXSA9IGMgKiBzO1xyXG4gICAgICAgIG91dFszXSA9IE1hdGguY29zKGFuZ2xlICogMC41KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5njgq/jg4jjg6vjgavjgq/jgqnjg7zjgr/jg4vjgqrjg7PjgpLpgannlKjjgZfov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHZlYyAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuIC0g44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBbZGVzdF0gLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IOe1kOaenOOBruODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9WZWNJSUkodmVjLCBxdG4sIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gWzAuMCwgMC4wLCAwLjBdO31cclxuICAgICAgICBsZXQgcXAgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IHFxID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCBxciA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBRdG4uaW52ZXJzZShxdG4sIHFyKTtcclxuICAgICAgICBxcFswXSA9IHZlY1swXTtcclxuICAgICAgICBxcFsxXSA9IHZlY1sxXTtcclxuICAgICAgICBxcFsyXSA9IHZlY1syXTtcclxuICAgICAgICBRdG4ubXVsdGlwbHkocXIsIHFwLCBxcSk7XHJcbiAgICAgICAgUXRuLm11bHRpcGx5KHFxLCBxdG4sIHFyKTtcclxuICAgICAgICBvdXRbMF0gPSBxclswXTtcclxuICAgICAgICBvdXRbMV0gPSBxclsxXTtcclxuICAgICAgICBvdXRbMl0gPSBxclsyXTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiA0eDQg6KGM5YiX44Gr44Kv44Kp44O844K/44OL44Kq44Oz44KS6YGp55So44GX6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuIC0g44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIDR4NCDooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9NYXRJVihxdG4sIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKTt9XHJcbiAgICAgICAgbGV0IHggPSBxdG5bMF0sIHkgPSBxdG5bMV0sIHogPSBxdG5bMl0sIHcgPSBxdG5bM107XHJcbiAgICAgICAgbGV0IHgyID0geCArIHgsIHkyID0geSArIHksIHoyID0geiArIHo7XHJcbiAgICAgICAgbGV0IHh4ID0geCAqIHgyLCB4eSA9IHggKiB5MiwgeHogPSB4ICogejI7XHJcbiAgICAgICAgbGV0IHl5ID0geSAqIHkyLCB5eiA9IHkgKiB6MiwgenogPSB6ICogejI7XHJcbiAgICAgICAgbGV0IHd4ID0gdyAqIHgyLCB3eSA9IHcgKiB5Miwgd3ogPSB3ICogejI7XHJcbiAgICAgICAgb3V0WzBdICA9IDEgLSAoeXkgKyB6eik7XHJcbiAgICAgICAgb3V0WzFdICA9IHh5IC0gd3o7XHJcbiAgICAgICAgb3V0WzJdICA9IHh6ICsgd3k7XHJcbiAgICAgICAgb3V0WzNdICA9IDA7XHJcbiAgICAgICAgb3V0WzRdICA9IHh5ICsgd3o7XHJcbiAgICAgICAgb3V0WzVdICA9IDEgLSAoeHggKyB6eik7XHJcbiAgICAgICAgb3V0WzZdICA9IHl6IC0gd3g7XHJcbiAgICAgICAgb3V0WzddICA9IDA7XHJcbiAgICAgICAgb3V0WzhdICA9IHh6IC0gd3k7XHJcbiAgICAgICAgb3V0WzldICA9IHl6ICsgd3g7XHJcbiAgICAgICAgb3V0WzEwXSA9IDEgLSAoeHggKyB5eSk7XHJcbiAgICAgICAgb3V0WzExXSA9IDA7XHJcbiAgICAgICAgb3V0WzEyXSA9IDA7XHJcbiAgICAgICAgb3V0WzEzXSA9IDA7XHJcbiAgICAgICAgb3V0WzE0XSA9IDA7XHJcbiAgICAgICAgb3V0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7Pjga7nkIPpnaLnt5rlvaLoo5zplpPjgpLooYzjgaPjgZ/ntZDmnpzjgpLov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4wIC0g44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuMSAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgLSDoo5zplpPkv4LmlbDvvIgwLjAg44GL44KJIDEuMCDjgafmjIflrprvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzbGVycChxdG4wLCBxdG4xLCB0aW1lLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IFF0bi5jcmVhdGUoKTt9XHJcbiAgICAgICAgbGV0IGh0ID0gcXRuMFswXSAqIHF0bjFbMF0gKyBxdG4wWzFdICogcXRuMVsxXSArIHF0bjBbMl0gKiBxdG4xWzJdICsgcXRuMFszXSAqIHF0bjFbM107XHJcbiAgICAgICAgbGV0IGhzID0gMS4wIC0gaHQgKiBodDtcclxuICAgICAgICBpZihocyA8PSAwLjApe1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBxdG4wWzBdO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBxdG4wWzFdO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBxdG4wWzJdO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBxdG4wWzNdO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBocyA9IE1hdGguc3FydChocyk7XHJcbiAgICAgICAgICAgIGlmKE1hdGguYWJzKGhzKSA8IDAuMDAwMSl7XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSAocXRuMFswXSAqIDAuNSArIHF0bjFbMF0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gKHF0bjBbMV0gKiAwLjUgKyBxdG4xWzFdICogMC41KTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IChxdG4wWzJdICogMC41ICsgcXRuMVsyXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSAocXRuMFszXSAqIDAuNSArIHF0bjFbM10gKiAwLjUpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGxldCBwaCA9IE1hdGguYWNvcyhodCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHQgPSBwaCAqIHRpbWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgdDAgPSBNYXRoLnNpbihwaCAtIHB0KSAvIGhzO1xyXG4gICAgICAgICAgICAgICAgbGV0IHQxID0gTWF0aC5zaW4ocHQpIC8gaHM7XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBxdG4wWzBdICogdDAgKyBxdG4xWzBdICogdDE7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBxdG4wWzFdICogdDAgKyBxdG4xWzFdICogdDE7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBxdG4wWzJdICogdDAgKyBxdG4xWzJdICogdDE7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBxdG4wWzNdICogdDAgKyBxdG4xWzNdICogdDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNNYXRoLmpzIiwiXHJcbi8qKlxyXG4gKiBnbDNNZXNoXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzTWVzaCB7XHJcbiAgICAvKipcclxuICAgICAqIOadv+ODneODquOCtOODs+OBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g5p2/44Od44Oq44K044Oz44Gu5LiA6L6644Gu5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g5p2/44Od44Oq44K044Oz44Gu5LiA6L6644Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBwbGFuZURhdGEgPSBnbDMuTWVzaC5wbGFuZSgyLjAsIDIuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGxhbmUod2lkdGgsIGhlaWdodCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCB3LCBoO1xyXG4gICAgICAgIHcgPSB3aWR0aCAvIDI7XHJcbiAgICAgICAgaCA9IGhlaWdodCAvIDI7XHJcbiAgICAgICAgaWYoY29sb3Ipe1xyXG4gICAgICAgICAgICB0YyA9IGNvbG9yO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0YyA9IFsxLjAsIDEuMCwgMS4wLCAxLjBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcG9zID0gW1xyXG4gICAgICAgICAgICAtdywgIGgsICAwLjAsXHJcbiAgICAgICAgICAgICB3LCAgaCwgIDAuMCxcclxuICAgICAgICAgICAgLXcsIC1oLCAgMC4wLFxyXG4gICAgICAgICAgICAgdywgLWgsICAwLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBub3IgPSBbXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBjb2wgPSBbXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgc3QgID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCxcclxuICAgICAgICAgICAgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAxLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGlkeCA9IFtcclxuICAgICAgICAgICAgMCwgMSwgMixcclxuICAgICAgICAgICAgMiwgMSwgM1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YaG77yIWFkg5bmz6Z2i5bGV6ZaL77yJ44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BsaXQgLSDlhobjga7lhoblkajjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgLSDlhobjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IGNpcmNsZURhdGEgPSBnbDMuTWVzaC5jaXJjbGUoNjQsIDEuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY2lyY2xlKHNwbGl0LCByYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgaiA9IDA7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBwb3MucHVzaCgwLjAsIDAuMCwgMC4wKTtcclxuICAgICAgICBub3IucHVzaCgwLjAsIDAuMCwgMS4wKTtcclxuICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgc3BsaXQ7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIuMCAvIHNwbGl0ICogaTtcclxuICAgICAgICAgICAgbGV0IHJ4ID0gTWF0aC5jb3Mocik7XHJcbiAgICAgICAgICAgIGxldCByeSA9IE1hdGguc2luKHIpO1xyXG4gICAgICAgICAgICBwb3MucHVzaChyeCAqIHJhZCwgcnkgKiByYWQsIDAuMCk7XHJcbiAgICAgICAgICAgIG5vci5wdXNoKDAuMCwgMC4wLCAxLjApO1xyXG4gICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgICAgIHN0LnB1c2goKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ5ICsgMS4wKSAqIDAuNSk7XHJcbiAgICAgICAgICAgIGlmKGkgPT09IHNwbGl0IC0gMSl7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaCgwLCBqICsgMSwgMSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goMCwgaiArIDEsIGogKyAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICArK2o7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCreODpeODvOODluOBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNpZGUgLSDmraPnq4vmlrnkvZPjga7kuIDovrrjga7plbfjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaIOKAu+OCreODpeODvOODluOBruS4reW/g+OBi+OCieWQhOmggueCueOBq+WQkeOBi+OBo+OBpuS8uOOBs+OCi+ODmeOCr+ODiOODq+OBquOBruOBp+azqOaEj1xyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBjdWJlRGF0YSA9IGdsMy5NZXNoLmN1YmUoMi4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjdWJlKHNpZGUsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaHMgPSBzaWRlICogMC41O1xyXG4gICAgICAgIGxldCBwb3MgPSBbXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgLWhzLCAtaHMsXHJcbiAgICAgICAgICAgIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsXHJcbiAgICAgICAgICAgICBocywgLWhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLCAgaHMsXHJcbiAgICAgICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAtaHNcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCB2ID0gMS4wIC8gTWF0aC5zcXJ0KDMuMCk7XHJcbiAgICAgICAgbGV0IG5vciA9IFtcclxuICAgICAgICAgICAgLXYsIC12LCAgdiwgIHYsIC12LCAgdiwgIHYsICB2LCAgdiwgLXYsICB2LCAgdixcclxuICAgICAgICAgICAgLXYsIC12LCAtdiwgLXYsICB2LCAtdiwgIHYsICB2LCAtdiwgIHYsIC12LCAtdixcclxuICAgICAgICAgICAgLXYsICB2LCAtdiwgLXYsICB2LCAgdiwgIHYsICB2LCAgdiwgIHYsICB2LCAtdixcclxuICAgICAgICAgICAgLXYsIC12LCAtdiwgIHYsIC12LCAtdiwgIHYsIC12LCAgdiwgLXYsIC12LCAgdixcclxuICAgICAgICAgICAgIHYsIC12LCAtdiwgIHYsICB2LCAtdiwgIHYsICB2LCAgdiwgIHYsIC12LCAgdixcclxuICAgICAgICAgICAgLXYsIC12LCAtdiwgLXYsIC12LCAgdiwgLXYsICB2LCAgdiwgLXYsICB2LCAtdlxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGNvbCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBwb3MubGVuZ3RoIC8gMzsgaSsrKXtcclxuICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3QgPSBbXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBpZHggPSBbXHJcbiAgICAgICAgICAgICAwLCAgMSwgIDIsICAwLCAgMiwgIDMsXHJcbiAgICAgICAgICAgICA0LCAgNSwgIDYsICA0LCAgNiwgIDcsXHJcbiAgICAgICAgICAgICA4LCAgOSwgMTAsICA4LCAxMCwgMTEsXHJcbiAgICAgICAgICAgIDEyLCAxMywgMTQsIDEyLCAxNCwgMTUsXHJcbiAgICAgICAgICAgIDE2LCAxNywgMTgsIDE2LCAxOCwgMTksXHJcbiAgICAgICAgICAgIDIwLCAyMSwgMjIsIDIwLCAyMiwgMjNcclxuICAgICAgICBdO1xyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4ieinkumMkOOBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwbGl0IC0g5bqV6Z2i5YaG44Gu5YaG5ZGo44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIC0g5bqV6Z2i5YaG44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g5LiJ6KeS6YyQ44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBjb25lRGF0YSA9IGdsMy5NZXNoLmNvbmUoNjQsIDEuMCwgMi4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb25lKHNwbGl0LCByYWQsIGhlaWdodCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqID0gMDtcclxuICAgICAgICBsZXQgaCA9IGhlaWdodCAvIDIuMDtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIHBvcy5wdXNoKDAuMCwgLWgsIDAuMCk7XHJcbiAgICAgICAgbm9yLnB1c2goMC4wLCAtMS4wLCAwLjApO1xyXG4gICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICBzdC5wdXNoKDAuNSwgMC41KTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gc3BsaXQ7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIuMCAvIHNwbGl0ICogaTtcclxuICAgICAgICAgICAgbGV0IHJ4ID0gTWF0aC5jb3Mocik7XHJcbiAgICAgICAgICAgIGxldCByeiA9IE1hdGguc2luKHIpO1xyXG4gICAgICAgICAgICBwb3MucHVzaChcclxuICAgICAgICAgICAgICAgIHJ4ICogcmFkLCAtaCwgcnogKiByYWQsXHJcbiAgICAgICAgICAgICAgICByeCAqIHJhZCwgLWgsIHJ6ICogcmFkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIG5vci5wdXNoKFxyXG4gICAgICAgICAgICAgICAgMC4wLCAtMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICByeCwgMC4wLCByelxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb2wucHVzaChcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgc3QucHVzaChcclxuICAgICAgICAgICAgICAgIChyeCArIDEuMCkgKiAwLjUsIDEuMCAtIChyeiArIDEuMCkgKiAwLjUsXHJcbiAgICAgICAgICAgICAgICAocnggKyAxLjApICogMC41LCAxLjAgLSAocnogKyAxLjApICogMC41XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmKGkgIT09IHNwbGl0KXtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKDAsIGogKyAxLCBqICsgMyk7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChqICsgNCwgaiArIDIsIHNwbGl0ICogMiArIDMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGogKz0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9zLnB1c2goMC4wLCBoLCAwLjApO1xyXG4gICAgICAgIG5vci5wdXNoKDAuMCwgMS4wLCAwLjApO1xyXG4gICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICBzdC5wdXNoKDAuNSwgMC41KTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhobmn7Hjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGxpdCAtIOWGhuafseOBruWGhuWRqOOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcFJhZCAtIOWGhuafseOBruWkqemdouOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJvdHRvbVJhZCAtIOWGhuafseOBruW6lemdouOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOWGhuafseOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgY3lsaW5kZXJEYXRhID0gZ2wzLk1lc2guY3lsaW5kZXIoNjQsIDAuNSwgMS4wLCAyLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGN5bGluZGVyKHNwbGl0LCB0b3BSYWQsIGJvdHRvbVJhZCwgaGVpZ2h0LCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGogPSAyO1xyXG4gICAgICAgIGxldCBoID0gaGVpZ2h0IC8gMi4wO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgcG9zLnB1c2goMC4wLCBoLCAwLjAsIDAuMCwgLWgsIDAuMCwpO1xyXG4gICAgICAgIG5vci5wdXNoKDAuMCwgMS4wLCAwLjAsIDAuMCwgLTEuMCwgMC4wKTtcclxuICAgICAgICBjb2wucHVzaChcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzdC5wdXNoKDAuNSwgMC41LCAwLjUsIDAuNSk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDw9IHNwbGl0OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyLjAgLyBzcGxpdCAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeCA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnogPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgcG9zLnB1c2goXHJcbiAgICAgICAgICAgICAgICByeCAqIHRvcFJhZCwgIGgsIHJ6ICogdG9wUmFkLFxyXG4gICAgICAgICAgICAgICAgcnggKiB0b3BSYWQsICBoLCByeiAqIHRvcFJhZCxcclxuICAgICAgICAgICAgICAgIHJ4ICogYm90dG9tUmFkLCAtaCwgcnogKiBib3R0b21SYWQsXHJcbiAgICAgICAgICAgICAgICByeCAqIGJvdHRvbVJhZCwgLWgsIHJ6ICogYm90dG9tUmFkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIG5vci5wdXNoKFxyXG4gICAgICAgICAgICAgICAgMC4wLCAxLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgIHJ4LCAwLjAsIHJ6LFxyXG4gICAgICAgICAgICAgICAgMC4wLCAtMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICByeCwgMC4wLCByelxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb2wucHVzaChcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHN0LnB1c2goXHJcbiAgICAgICAgICAgICAgICAocnggKyAxLjApICogMC41LCAxLjAgLSAocnogKyAxLjApICogMC41LFxyXG4gICAgICAgICAgICAgICAgMS4wIC0gaSAvIHNwbGl0LCAwLjAsXHJcbiAgICAgICAgICAgICAgICAocnggKyAxLjApICogMC41LCAxLjAgLSAocnogKyAxLjApICogMC41LFxyXG4gICAgICAgICAgICAgICAgMS4wIC0gaSAvIHNwbGl0LCAxLjBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYoaSAhPT0gc3BsaXQpe1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgaiArIDQsIGosXHJcbiAgICAgICAgICAgICAgICAgICAgMSwgaiArIDIsIGogKyA2LFxyXG4gICAgICAgICAgICAgICAgICAgIGogKyA1LCBqICsgNywgaiArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaiArIDEsIGogKyA3LCBqICsgM1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBqICs9IDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeQg+S9k+OBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdyAtIOeQg+OBrue4puaWueWQke+8iOe3r+W6puaWueWQke+8ieOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbiAtIOeQg+OBruaoquaWueWQke+8iOe1jOW6puaWueWQke+8ieOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIOeQg+OBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgc3BoZXJlRGF0YSA9IGdsMy5NZXNoLnNwaGVyZSg2NCwgNjQsIDEuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc3BoZXJlKHJvdywgY29sdW1uLCByYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAvIHJvdyAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeSA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnIgPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCB0ciA9IE1hdGguUEkgKiAyIC8gY29sdW1uICogajtcclxuICAgICAgICAgICAgICAgIGxldCB0eCA9IHJyICogcmFkICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR5ID0gcnkgKiByYWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHogPSByciAqIHJhZCAqIE1hdGguc2luKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeCA9IHJyICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ6ID0gcnIgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcclxuICAgICAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xyXG4gICAgICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgICAgICAgICAgc3QucHVzaCgxIC0gMSAvIGNvbHVtbiAqIGosIDEgLyByb3cgKiBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGNvbHVtbjsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCByID0gKGNvbHVtbiArIDEpICogaSArIGo7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgMSwgciArIGNvbHVtbiArIDIpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIGNvbHVtbiArIDIsIHIgKyBjb2x1bW4gKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg4jjg7zjg6njgrnjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3cgLSDovKrjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW4gLSDjg5HjgqTjg5fmlq3pnaLjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpcmFkIC0g44OR44Kk44OX5pat6Z2i44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3JhZCAtIOODkeOCpOODl+WFqOS9k+OBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgdG9ydXNEYXRhID0gZ2wzLk1lc2gudG9ydXMoNjQsIDY0LCAwLjI1LCAwLjc1LCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0b3J1cyhyb3csIGNvbHVtbiwgaXJhZCwgb3JhZCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDw9IHJvdzsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLlBJICogMiAvIHJvdyAqIGk7XHJcbiAgICAgICAgICAgIGxldCByciA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCB0ciA9IE1hdGguUEkgKiAyIC8gY29sdW1uICogajtcclxuICAgICAgICAgICAgICAgIGxldCB0eCA9IChyciAqIGlyYWQgKyBvcmFkKSAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogaXJhZDtcclxuICAgICAgICAgICAgICAgIGxldCB0eiA9IChyciAqIGlyYWQgKyBvcmFkKSAqIE1hdGguc2luKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeCA9IHJyICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ6ID0gcnIgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnMgPSAxIC8gY29sdW1uICogajtcclxuICAgICAgICAgICAgICAgIGxldCBydCA9IDEgLyByb3cgKiBpICsgMC41O1xyXG4gICAgICAgICAgICAgICAgaWYocnQgPiAxLjApe3J0IC09IDEuMDt9XHJcbiAgICAgICAgICAgICAgICBydCA9IDEuMCAtIHJ0O1xyXG4gICAgICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XHJcbiAgICAgICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcclxuICAgICAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICAgICAgICAgIHN0LnB1c2gocnMsIHJ0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGNvbHVtbjsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCByID0gKGNvbHVtbiArIDEpICogaSArIGo7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMSwgciArIDEpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociArIGNvbHVtbiArIDEsIHIgKyBjb2x1bW4gKyAyLCByICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q2j5LqM5Y2B6Z2i5L2T44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIC0g44K144Kk44K677yI6buE6YeR5q+U44Gr5a++44GZ44KL5q+U546H77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBpY29zYURhdGEgPSBnbDMuTWVzaC5pY29zYWhlZHJvbigxLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGljb3NhaGVkcm9uKHJhZCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgbGV0IGMgPSAoMS4wICsgTWF0aC5zcXJ0KDUuMCkpIC8gMi4wO1xyXG4gICAgICAgIGxldCB0ID0gYyAqIHJhZDtcclxuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCgxLjAgKyBjICogYyk7XHJcbiAgICAgICAgbGV0IHIgPSBbMS4wIC8gbCwgYyAvIGxdO1xyXG4gICAgICAgIHBvcyA9IFtcclxuICAgICAgICAgICAgLXJhZCwgICAgdCwgIDAuMCwgIHJhZCwgICAgdCwgIDAuMCwgLXJhZCwgICAtdCwgIDAuMCwgIHJhZCwgICAtdCwgIDAuMCxcclxuICAgICAgICAgICAgIDAuMCwgLXJhZCwgICAgdCwgIDAuMCwgIHJhZCwgICAgdCwgIDAuMCwgLXJhZCwgICAtdCwgIDAuMCwgIHJhZCwgICAtdCxcclxuICAgICAgICAgICAgICAgdCwgIDAuMCwgLXJhZCwgICAgdCwgIDAuMCwgIHJhZCwgICAtdCwgIDAuMCwgLXJhZCwgICAtdCwgIDAuMCwgIHJhZFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbm9yID0gW1xyXG4gICAgICAgICAgICAtclswXSwgIHJbMV0sICAgMC4wLCAgclswXSwgIHJbMV0sICAgMC4wLCAtclswXSwgLXJbMV0sICAgMC4wLCAgclswXSwgLXJbMV0sICAgMC4wLFxyXG4gICAgICAgICAgICAgIDAuMCwgLXJbMF0sICByWzFdLCAgIDAuMCwgIHJbMF0sICByWzFdLCAgIDAuMCwgLXJbMF0sIC1yWzFdLCAgIDAuMCwgIHJbMF0sIC1yWzFdLFxyXG4gICAgICAgICAgICAgclsxXSwgICAwLjAsIC1yWzBdLCAgclsxXSwgICAwLjAsICByWzBdLCAtclsxXSwgICAwLjAsIC1yWzBdLCAtclsxXSwgICAwLjAsICByWzBdXHJcbiAgICAgICAgXTtcclxuICAgICAgICBjb2wgPSBbXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICBdO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSBub3IubGVuZ3RoOyBpIDwgajsgaSArPSAzKXtcclxuICAgICAgICAgICAgbGV0IHUgPSAoTWF0aC5hdGFuMihub3JbaSArIDJdLCAtbm9yW2ldKSArIE1hdGguUEkpIC8gKE1hdGguUEkgKiAyLjApO1xyXG4gICAgICAgICAgICBsZXQgdiA9IDEuMCAtIChub3JbaSArIDFdICsgMS4wKSAvIDIuMDtcclxuICAgICAgICAgICAgc3QucHVzaCh1LCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWR4ID0gW1xyXG4gICAgICAgICAgICAgMCwgMTEsICA1LCAgMCwgIDUsICAxLCAgMCwgIDEsICA3LCAgMCwgIDcsIDEwLCAgMCwgMTAsIDExLFxyXG4gICAgICAgICAgICAgMSwgIDUsICA5LCAgNSwgMTEsICA0LCAxMSwgMTAsICAyLCAxMCwgIDcsICA2LCAgNywgIDEsICA4LFxyXG4gICAgICAgICAgICAgMywgIDksICA0LCAgMywgIDQsICAyLCAgMywgIDIsICA2LCAgMywgIDYsICA4LCAgMywgIDgsICA5LFxyXG4gICAgICAgICAgICAgNCwgIDksICA1LCAgMiwgIDQsIDExLCAgNiwgIDIsIDEwLCAgOCwgIDYsICA3LCAgOSwgIDgsICAxXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM01lc2guanMiLCJcclxuLyoqXHJcbiAqIGdsM1V0aWxcclxuICogQGNsYXNzIGdsM1V0aWxcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM1V0aWwge1xyXG4gICAgLyoqXHJcbiAgICAgKiBIU1Yg44Kr44Op44O844KS55Sf5oiQ44GX44Gm6YWN5YiX44Gn6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaCAtIOiJsuebuFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHMgLSDlvanluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2IC0g5piO5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYSAtIOOCouODq+ODleOCoVxyXG4gICAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBq+ato+imj+WMluOBl+OBn+iJsuOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaHN2YShoLCBzLCB2LCBhKXtcclxuICAgICAgICBpZihzID4gMSB8fCB2ID4gMSB8fCBhID4gMSl7cmV0dXJuO31cclxuICAgICAgICBsZXQgdGggPSBoICUgMzYwO1xyXG4gICAgICAgIGxldCBpID0gTWF0aC5mbG9vcih0aCAvIDYwKTtcclxuICAgICAgICBsZXQgZiA9IHRoIC8gNjAgLSBpO1xyXG4gICAgICAgIGxldCBtID0gdiAqICgxIC0gcyk7XHJcbiAgICAgICAgbGV0IG4gPSB2ICogKDEgLSBzICogZik7XHJcbiAgICAgICAgbGV0IGsgPSB2ICogKDEgLSBzICogKDEgLSBmKSk7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgaWYoIXMgPiAwICYmICFzIDwgMCl7XHJcbiAgICAgICAgICAgIGNvbG9yLnB1c2godiwgdiwgdiwgYSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHIgPSBuZXcgQXJyYXkodiwgbiwgbSwgbSwgaywgdik7XHJcbiAgICAgICAgICAgIGxldCBnID0gbmV3IEFycmF5KGssIHYsIHYsIG4sIG0sIG0pO1xyXG4gICAgICAgICAgICBsZXQgYiA9IG5ldyBBcnJheShtLCBtLCBrLCB2LCB2LCBuKTtcclxuICAgICAgICAgICAgY29sb3IucHVzaChyW2ldLCBnW2ldLCBiW2ldLCBhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kk44O844K444Oz44KwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCAtIDAuMCDjgYvjgokgMS4wIOOBruWApFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjgqTjg7zjgrjjg7PjgrDjgZfjgZ/ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGVhc2VMaW5lcih0KXtcclxuICAgICAgICByZXR1cm4gdCA8IDAuNSA/IDQgKiB0ICogdCAqIHQgOiAodCAtIDEpICogKDIgKiB0IC0gMikgKiAoMiAqIHQgLSAyKSArIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg7zjgrjjg7PjgrBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IC0gMC4wIOOBi+OCiSAxLjAg44Gu5YCkXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOOCpOODvOOCuOODs+OCsOOBl+OBn+e1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZWFzZU91dEN1YmljKHQpe1xyXG4gICAgICAgIHJldHVybiAodCA9IHQgLyAxIC0gMSkgKiB0ICogdCArIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg7zjgrjjg7PjgrBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IC0gMC4wIOOBi+OCiSAxLjAg44Gu5YCkXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOOCpOODvOOCuOODs+OCsOOBl+OBn+e1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZWFzZVF1aW50aWModCl7XHJcbiAgICAgICAgbGV0IHRzID0gKHQgPSB0IC8gMSkgKiB0O1xyXG4gICAgICAgIGxldCB0YyA9IHRzICogdDtcclxuICAgICAgICByZXR1cm4gKHRjICogdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bqm5pWw5rOV44Gu6KeS5bqm44GL44KJ5byn5bqm5rOV44Gu5YCk44G45aSJ5o+b44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVnIC0g5bqm5pWw5rOV44Gu6KeS5bqmXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOW8p+W6puazleOBruWApFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGVnVG9SYWQoZGVnKXtcclxuICAgICAgICByZXR1cm4gKGRlZyAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWk6YGT5Y2K5b6E77yIa23vvIlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRUFSVEhfUkFESVVTKCl7cmV0dXJuIDYzNzguMTM3O31cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1pOmBk+WGhuWRqO+8iGtt77yJXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEVBUlRIX0NJUkNVTSgpe3JldHVybiBnbDNVdGlsLkVBUlRIX1JBRElVUyAqIE1hdGguUEkgKiAyLjA7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWk6YGT5YaG5ZGo44Gu5Y2K5YiG77yIa23vvIlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRUFSVEhfSEFMRl9DSVJDVU0oKXtyZXR1cm4gZ2wzVXRpbC5FQVJUSF9SQURJVVMgKiBNYXRoLlBJO31cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCi+acgOWkp+e3r+W6plxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBFQVJUSF9NQVhfTEFUKCl7cmV0dXJuIDg1LjA1MTEyODc4O31cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe1jOW6puOCkuWFg+OBq+ODoeODq+OCq+ODiOODq+W6p+aomeOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9uVG9NZXIobG9uKXtcclxuICAgICAgICByZXR1cm4gZ2wzVXRpbC5FQVJUSF9SQURJVVMgKiBnbDNVdGlsLmRlZ1RvUmFkKGxvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnt6/luqbjgpLlhYPjgavjg6Hjg6vjgqvjg4jjg6vluqfmqJnjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZmxhdHRlbj0wXSAtIOaJgeW5s+eOh1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbGF0VG9NZXIobGF0LCBmbGF0dGVuID0gMCl7XHJcbiAgICAgICAgbGV0IGZsYXR0ZW5pbmcgPSBmbGF0dGVuO1xyXG4gICAgICAgIGlmKGlzTmFOKHBhcnNlRmxvYXQoZmxhdHRlbikpKXtcclxuICAgICAgICAgICAgZmxhdHRlbmluZyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjbGFtcCA9IDAuMDAwMTtcclxuICAgICAgICBpZihsYXQgPj0gOTAgLSBjbGFtcCl7XHJcbiAgICAgICAgICAgIGxhdCA9IDkwIC0gY2xhbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGxhdCA8PSAtOTAgKyBjbGFtcCl7XHJcbiAgICAgICAgICAgIGxhdCA9IC05MCArIGNsYW1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGVtcCA9ICgxIC0gZmxhdHRlbmluZyk7XHJcbiAgICAgICAgbGV0IGVzID0gMS4wIC0gKHRlbXAgKiB0ZW1wKTtcclxuICAgICAgICBsZXQgZWNjZW50ID0gTWF0aC5zcXJ0KGVzKTtcclxuICAgICAgICBsZXQgcGhpID0gZ2wzVXRpbC5kZWdUb1JhZChsYXQpO1xyXG4gICAgICAgIGxldCBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xyXG4gICAgICAgIGxldCBjb24gPSBlY2NlbnQgKiBzaW5waGk7XHJcbiAgICAgICAgbGV0IGNvbSA9IDAuNSAqIGVjY2VudDtcclxuICAgICAgICBjb24gPSBNYXRoLnBvdygoMS4wIC0gY29uKSAvICgxLjAgKyBjb24pLCBjb20pO1xyXG4gICAgICAgIGxldCB0cyA9IE1hdGgudGFuKDAuNSAqIChNYXRoLlBJICogMC41IC0gcGhpKSkgLyBjb247XHJcbiAgICAgICAgcmV0dXJuIGdsM1V0aWwuRUFSVEhfUkFESVVTICogTWF0aC5sb2codHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57ev5bqm57WM5bqm44KS44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr5aSJ5o+b44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2ZsYXR0ZW49MF0gLSDmiYHlubPnjodcclxuICAgICAqIEByZXR1cm4ge29ian1cclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4IC0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFgg5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0geSAtIOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBZIOW6p+aomVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9uTGF0VG9NZXIobG9uLCBsYXQsIGZsYXR0ZW4gPSAwKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBnbDNVdGlsLmxvblRvTWVyKGxvbiksXHJcbiAgICAgICAgICAgIHk6IGdsM1V0aWwubGF0VG9NZXIobGF0LCBmbGF0dGVuaW5nKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6Hjg6vjgqvjg4jjg6vluqfmqJnjgpLnt6/luqbntYzluqbjgavlpInmj5vjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFgg5bqn5qiZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBZIOW6p+aomVxyXG4gICAgICogQHJldHVybiB7b2JqfVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbWVyVG9Mb25MYXQoeCwgeSl7XHJcbiAgICAgICAgbGV0IGxvbiA9ICh4IC8gZ2wzVXRpbC5FQVJUSF9IQUxGX0NJUkNVTSkgKiAxODA7XHJcbiAgICAgICAgbGV0IGxhdCA9ICh5IC8gZ2wzVXRpbC5FQVJUSF9IQUxGX0NJUkNVTSkgKiAxODA7XHJcbiAgICAgICAgbGF0ID0gMTgwIC8gTWF0aC5QSSAqICgyICogTWF0aC5hdGFuKE1hdGguZXhwKGxhdCAqIE1hdGguUEkgLyAxODApKSAtIE1hdGguUEkgLyAyKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb246IGxvbixcclxuICAgICAgICAgICAgbGF0OiBsYXRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57WM5bqm44GL44KJ44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544KS5rGC44KB44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDntYzluqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxvblRvVGlsZShsb24sIHpvb20pe1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKChsb24gLyAxODAgKyAxKSAqIE1hdGgucG93KDIsIHpvb20pIC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnt6/luqbjgYvjgonjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe3r+W6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbGF0VG9UaWxlKGxhdCwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKC1NYXRoLmxvZyhNYXRoLnRhbigoNDUgKyBsYXQgLyAyKSAqIE1hdGguUEkgLyAxODApKSArIE1hdGguUEkpICogTWF0aC5wb3coMiwgem9vbSkgLyAoMiAqIE1hdGguUEkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe3r+W6pue1jOW6puOCkuOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOBq+WkieaPm+OBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge29ian1cclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb24gLSDntYzluqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYXQgLSDnt6/luqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxvbkxhdFRvVGlsZShsb24sIGxhdCwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9uOiBnbDNVdGlsLmxvblRvVGlsZShsb24sIHpvb20pLFxyXG4gICAgICAgICAgICBsYXQ6IGdsM1V0aWwubGF0VG9UaWxlKGxhdCwgem9vbSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544GL44KJ57WM5bqm44KS5rGC44KB44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDntYzluqZcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRpbGVUb0xvbihsb24sIHpvb20pe1xyXG4gICAgICAgIHJldHVybiAobG9uIC8gTWF0aC5wb3coMiwgem9vbSkpICogMzYwIC0gMTgwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544GL44KJ57ev5bqm44KS5rGC44KB44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDnt6/luqZcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRpbGVUb0xhdChsYXQsIHpvb20pe1xyXG4gICAgICAgIGxldCB5ID0gKGxhdCAvIE1hdGgucG93KDIsIHpvb20pKSAqIDIgKiBNYXRoLlBJIC0gTWF0aC5QSTtcclxuICAgICAgICByZXR1cm4gMiAqIE1hdGguYXRhbihNYXRoLnBvdyhNYXRoLkUsIC15KSkgKiAxODAgLyBNYXRoLlBJIC0gOTA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgYvjgonnt6/luqbntYzluqbjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtvYmp9XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbG9uIC0g57WM5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbGF0IC0g57ev5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0aWxlVG9Mb25MYXQobG9uLCBsYXQsIHpvb20pe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvbjogZ2wzVXRpbC50aWxlVG9Mb24obG9uLCB6b29tKSxcclxuICAgICAgICAgICAgbGF0OiBnbDNVdGlsLnRpbGVUb0xhdChsYXQsIHpvb20pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzVXRpbC5qcyIsIlxyXG5pbXBvcnQgYXVkaW8gZnJvbSAnLi9nbDNBdWRpby5qcyc7XHJcbmltcG9ydCBtYXRoICBmcm9tICcuL2dsM01hdGguanMnO1xyXG5pbXBvcnQgbWVzaCAgZnJvbSAnLi9nbDNNZXNoLmpzJztcclxuaW1wb3J0IHV0aWwgIGZyb20gJy4vZ2wzVXRpbC5qcyc7XHJcbmltcG9ydCBndWkgICBmcm9tICcuL2dsM0d1aS5qcyc7XHJcblxyXG4vKipcclxuICogZ2xjdWJpY1xyXG4gKiBAY2xhc3MgZ2wzXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB2ZXJzaW9uXHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlZFUlNJT04gPSAnMC4yLjInO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBpICogMlxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5QSTIgPSA2LjI4MzE4NTMwNzE3OTU4NjQ3NjkyNTI4Njc2NjU1OTAwNTc2O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBpXHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlBJID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwaSAvIDJcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuUElIID0gMS41NzA3OTYzMjY3OTQ4OTY2MTkyMzEzMjE2OTE2Mzk3NTE0NDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwaSAvIDRcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuUElIMiA9IDAuNzg1Mzk4MTYzMzk3NDQ4MzA5NjE1NjYwODQ1ODE5ODc1NzI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wuTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMg44KS5Yip55So44GX44Gm5b6X44KJ44KM44KL44OG44Kv44K544OB44Oj44Om44OL44OD44OI44Gu5pyA5aSn5Yip55So5Y+v6IO95pWwXHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlRFWFRVUkVfVU5JVF9DT1VOVCA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsY3ViaWMg44GM5q2j44GX44GP5Yid5pyf5YyW44GV44KM44Gf44Gp44GG44GL44Gu44OV44Op44KwXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsY3ViaWMg44Go57SQ5LuY44GE44Gm44GE44KLIGNhbnZhcyBlbGVtZW50XHJcbiAgICAgICAgICogQHR5cGUge0hUTUxDYW52YXNFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbGN1YmljIOOBqOe0kOS7mOOBhOOBpuOBhOOCiyBjYW52YXMg44GL44KJ5Y+W5b6X44GX44GfIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAgICAgICAgICogQHR5cGUge1dlYkdMUmVuZGVyaW5nQ29udGV4dH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmdsID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0IOOBqOOBl+OBpuWIneacn+WMluOBl+OBn+OBi+OBqeOBhuOBi+OCkuihqOOBmeecn+WBveWApFxyXG4gICAgICAgICAqIEB0eXBlIHtib29sfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaXNXZWJHTDIgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjdWJpYyDjgajjgZfjgabjga7jg63jgrDlh7rlipvjgpLjgZnjgovjgYvjganjgYbjgYtcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmlzQ29uc29sZU91dHB1dCA9IHRydWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaPjgabjgYTjgovjg4bjgq/jgrnjg4Hjg6PmoLzntI3nlKjjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPFdlYkdMVGV4dHVyZT59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcyA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2ViR0wg44Gu5ouh5by15qmf6IO944KS5qC857SN44GZ44KL44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmV4dCA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsM0F1ZGlvIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNBdWRpb31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLkF1ZGlvID0gYXVkaW87XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzTWVzaCDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzTWVzaH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLk1lc2ggPSBtZXNoO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsM1V0aWwg44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHR5cGUge2dsM1V0aWx9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5VdGlsID0gdXRpbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNHdWkg44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHR5cGUge2dsM0d1aX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLkd1aSA9IG5ldyBndWkoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNNYXRoIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNNYXRofVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuTWF0aCA9IG5ldyBtYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbGN1YmljIOOCkuWIneacn+WMluOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxzdHJpbmd9IGNhbnZhcyAtIGNhbnZhcyBlbGVtZW50IOOBiyBjYW52YXMg44Gr5LuY5LiO44GV44KM44Gm44GE44KLIElEIOaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGluaXRPcHRpb25zIC0gY2FudmFzLmdldENvbnRleHQg44Gn56ys5LqM5byV5pWw44Gr5rih44GZ5Yid5pyf5YyW5pmC44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY3ViaWNPcHRpb25zXHJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IHdlYmdsMk1vZGUgLSB3ZWJnbDIg44KS5pyJ5Yq55YyW44GZ44KL5aC05ZCIIHRydWVcclxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gY29uc29sZU1lc3NhZ2UgLSBjb25zb2xlIOOBqyBjdWJpYyDjga7jg63jgrDjgpLlh7rlipvjgZnjgovjgYvjganjgYbjgYtcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOWIneacn+WMluOBjOato+OBl+OBj+ihjOOCj+OCjOOBn+OBi+OBqeOBhuOBi+OCkuihqOOBmeecn+WBveWApFxyXG4gICAgICovXHJcbiAgICBpbml0KGNhbnZhcywgaW5pdE9wdGlvbnMsIGN1YmljT3B0aW9ucyl7XHJcbiAgICAgICAgbGV0IG9wdCA9IGluaXRPcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgICBpZihjYW52YXMgPT0gbnVsbCl7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICBpZihjYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1lbHNlIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjYW52YXMpID09PSAnW29iamVjdCBTdHJpbmddJyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jYW52YXMgPT0gbnVsbCl7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICBpZihjdWJpY09wdGlvbnMgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGlmKGN1YmljT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnd2ViZ2wyTW9kZScpID09PSB0cnVlICYmIGN1YmljT3B0aW9ucy53ZWJnbDJNb2RlID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbDInLCBvcHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1dlYkdMMiA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoY3ViaWNPcHRpb25zLmhhc093blByb3BlcnR5KCdjb25zb2xlTWVzc2FnZScpID09PSB0cnVlICYmIGN1YmljT3B0aW9ucy5jb25zb2xlTWVzc2FnZSAhPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29uc29sZU91dHB1dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZ2wgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLlRFWFRVUkVfVU5JVF9DT1VOVCA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gbmV3IEFycmF5KHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UKTtcclxuICAgICAgICAgICAgdGhpcy5leHQgPSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50SW5kZXhVaW50OiB0aGlzLmdsLmdldEV4dGVuc2lvbignT0VTX2VsZW1lbnRfaW5kZXhfdWludCcpLFxyXG4gICAgICAgICAgICAgICAgdGV4dHVyZUZsb2F0OiB0aGlzLmdsLmdldEV4dGVuc2lvbignT0VTX3RleHR1cmVfZmxvYXQnKSxcclxuICAgICAgICAgICAgICAgIHRleHR1cmVIYWxmRmxvYXQ6IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0JyksXHJcbiAgICAgICAgICAgICAgICBkcmF3QnVmZmVyczogdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RyYXdfYnVmZmVycycpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIGdsY3ViaWMuanMgJWPil4YlYyA6IHZlcnNpb24gJWMnICsgdGhpcy5WRVJTSU9OLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogcm95YWxibHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLjgq/jg6rjgqLjgZnjgotcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g44Kv44Oq44Ki44GZ44KL6Imy77yIMC4wIH4gMS4w77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2RlcHRoXSAtIOOCr+ODquOCouOBmeOCi+a3seW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzdGVuY2lsXSAtIOOCr+ODquOCouOBmeOCi+OCueODhuODs+OCt+ODq+WApFxyXG4gICAgICovXHJcbiAgICBzY2VuZUNsZWFyKGNvbG9yLCBkZXB0aCwgc3RlbmNpbCl7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgZmxnID0gZ2wuQ09MT1JfQlVGRkVSX0JJVDtcclxuICAgICAgICBnbC5jbGVhckNvbG9yKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICBpZihkZXB0aCAhPSBudWxsKXtcclxuICAgICAgICAgICAgZ2wuY2xlYXJEZXB0aChkZXB0aCk7XHJcbiAgICAgICAgICAgIGZsZyA9IGZsZyB8IGdsLkRFUFRIX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0ZW5jaWwgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGdsLmNsZWFyU3RlbmNpbChzdGVuY2lsKTtcclxuICAgICAgICAgICAgZmxnID0gZmxnIHwgZ2wuU1RFTkNJTF9CVUZGRVJfQklUO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5jbGVhcihmbGcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OT44Ol44O844Od44O844OI44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3hdIC0geO+8iOW3puerr+WOn+eCue+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5XSAtIHnvvIjkuIvnq6/ljp/ngrnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbd2lkdGhdIC0g5qiq44Gu5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodF0gLSDnuKbjga7pq5jjgZVcclxuICAgICAqL1xyXG4gICAgc2NlbmVWaWV3KHgsIHksIHdpZHRoLCBoZWlnaHQpe1xyXG4gICAgICAgIGxldCBYID0geCB8fCAwO1xyXG4gICAgICAgIGxldCBZID0geSB8fCAwO1xyXG4gICAgICAgIGxldCB3ID0gd2lkdGggIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIGxldCBoID0gaGVpZ2h0IHx8IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICB0aGlzLmdsLnZpZXdwb3J0KFgsIFksIHcsIGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2wuZHJhd0FycmF5cyDjgpLjgrPjg7zjg6vjgZnjgovjg6njg4Pjg5Hjg7xcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmltaXRpdmUgLSDjg5fjg6rjg5/jg4bjgqPjg5bjgr/jgqTjg5dcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2ZXJ0ZXhDb3VudCAtIOaPj+eUu+OBmeOCi+mggueCueOBruWAi+aVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXQ9MF0gLSDmj4/nlLvjgZnjgovpoILngrnjga7plovlp4vjgqrjg5Xjgrvjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgZHJhd0FycmF5cyhwcmltaXRpdmUsIHZlcnRleENvdW50LCBvZmZzZXQgPSAwKXtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXMocHJpbWl0aXZlLCBvZmZzZXQsIHZlcnRleENvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsLmRyYXdFbGVtZW50cyDjgpLjgrPjg7zjg6vjgZnjgovjg6njg4Pjg5Hjg7xcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmltaXRpdmUgLSDjg5fjg6rjg5/jg4bjgqPjg5bjgr/jgqTjg5dcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleExlbmd0aCAtIOaPj+eUu+OBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruWAi+aVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXQ9MF0gLSDmj4/nlLvjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7plovlp4vjgqrjg5Xjgrvjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIG9mZnNldCA9IDApe1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQsIG9mZnNldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbC5kcmF3RWxlbWVudHMg44KS44Kz44O844Or44GZ44KL44Op44OD44OR44O877yIZ2wuVU5TSUdORURfSU5U77yJIOKAu+imgeaLoeW8teapn+iDve+8iFdlYkdMIDEuMO+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByaW1pdGl2ZSAtIOODl+ODquODn+ODhuOCo+ODluOCv+OCpOODl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4TGVuZ3RoIC0g5o+P55S744GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu5YCL5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29mZnNldD0wXSAtIOaPj+eUu+OBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBrumWi+Wni+OCquODleOCu+ODg+ODiFxyXG4gICAgICovXHJcbiAgICBkcmF3RWxlbWVudHNJbnQocHJpbWl0aXZlLCBpbmRleExlbmd0aCwgb2Zmc2V0ID0gMCl7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCBpbmRleExlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9JTlQsIG9mZnNldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWQk/vvIhWZXJ0ZXggQnVmZmVyIE9iamVjdO+8ieOCkueUn+aIkOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gZGF0YSAtIOmggueCueaDheWgseOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7V2ViR0xCdWZmZXJ9IOeUn+aIkOOBl+OBn+mggueCueODkOODg+ODleOCoVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVWYm8oZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCB2Ym8gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmJvKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIHZibztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIElCT++8iEluZGV4IEJ1ZmZlciBPYmplY3TvvInjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGRhdGEgLSDjgqTjg7Pjg4fjg4Pjgq/jgrnmg4XloLHjgpLmoLzntI3jgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge1dlYkdMQnVmZmVyfSDnlJ/miJDjgZfjgZ/jgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqFcclxuICAgICAqL1xyXG4gICAgY3JlYXRlSWJvKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgaWJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWJvKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IEludDE2QXJyYXkoZGF0YSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICByZXR1cm4gaWJvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSUJP77yISW5kZXggQnVmZmVyIE9iamVjdO+8ieOCkueUn+aIkOOBl+OBpui/lOOBme+8iGdsLlVOU0lHTkVEX0lOVO+8iSDigLvopoHmi6HlvLXmqZ/og73vvIhXZWJHTCAxLjDvvIlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGRhdGEgLSDjgqTjg7Pjg4fjg4Pjgq/jgrnmg4XloLHjgpLmoLzntI3jgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge1dlYkdMQnVmZmVyfSDnlJ/miJDjgZfjgZ/jgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqFcclxuICAgICAqL1xyXG4gICAgY3JlYXRlSWJvSW50KGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgaWJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWJvKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQzMkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGlibztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleOCoeOCpOODq+OCkuWFg+OBq+ODhuOCr+OCueODgeODo+OCkueUn+aIkOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSAtIOODleOCoeOCpOODq+ODkeOCuVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSDnlLvlg4/jga7jg63jg7zjg4njgYzlrozkuobjgZfjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZfjgZ/lvozjgavlkbzjgbDjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAqL1xyXG4gICAgY3JlYXRlVGV4dHVyZUZyb21GaWxlKHNvdXJjZSwgbnVtYmVyLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoc291cmNlID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgICAgICBsZXQgdGV4ID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcclxuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWcpO1xyXG4gICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmaWxlIGxvYWRlZDogJWMnICsgc291cmNlLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrICE9IG51bGwpe2NhbGxiYWNrKG51bWJlcik7fVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW1nLnNyYyA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCquODluOCuOOCp+OCr+ODiOOCkuWFg+OBq+ODhuOCr+OCueODgeODo+OCkueUn+aIkOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCAtIOODreODvOODiea4iOOBv+OBriBJbWFnZSDjgqrjg5bjgrjjgqfjgq/jg4jjgoQgQ2FudmFzIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVUZXh0dXJlRnJvbU9iamVjdChvYmplY3QsIG51bWJlcil7XHJcbiAgICAgICAgaWYob2JqZWN0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgdGV4ID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXgpO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgb2JqZWN0KTtcclxuICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBvYmplY3QgYXR0YWNoZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUu+WDj+OCkuWFg+OBq+OCreODpeODvOODluODnuODg+ODl+ODhuOCr+OCueODgeODo+OCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gc291cmNlIC0g44OV44Kh44Kk44Or44OR44K544KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB0YXJnZXQgLSDjgq3jg6Xjg7zjg5bjg57jg4Pjg5fjg4bjgq/jgrnjg4Hjg6PjgavoqK3lrprjgZnjgovjgr/jg7zjgrLjg4Pjg4jjga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0g55S75YOP44Gu44Ot44O844OJ44GM5a6M5LqG44GX44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GX44Gf5b6M44Gr5ZG844Gw44KM44KL44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVRleHR1cmVDdWJlRnJvbUZpbGUoc291cmNlLCB0YXJnZXQsIG51bWJlciwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHNvdXJjZSA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBjSW1nID0gW107XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNJbWdbaV0gPSB7aW1hZ2U6IG5ldyBJbWFnZSgpLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgY0ltZ1tpXS5pbWFnZS5vbmxvYWQgPSAoKGluZGV4KSA9PiB7cmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNJbWdbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZihjSW1nLmxlbmd0aCA9PT0gNil7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGYgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNJbWcubWFwKCh2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmICYmIHYubG9hZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGYgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4ID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHNvdXJjZS5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKHRhcmdldFtqXSwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgY0ltZ1tqXS5pbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFX0NVQkVfTUFQO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZmlsZSBsb2FkZWQ6ICVjJyArIHNvdXJjZVswXSArICcuLi4nLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrICE9IG51bGwpe2NhbGxiYWNrKG51bWJlcik7fVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTt9KShpKTtcclxuICAgICAgICAgICAgY0ltZ1tpXS5pbWFnZS5zcmMgPSBzb3VyY2VbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2xjdWJpYyDjgYzmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjgajjg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjgpLmjIflrprjgZfjgabjg4bjgq/jgrnjg4Hjg6PjgpLjg5DjgqTjg7Pjg4njgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB1bml0IC0g44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgYmluZFRleHR1cmUodW5pdCwgbnVtYmVyKXtcclxuICAgICAgICBpZih0aGlzLnRleHR1cmVzW251bWJlcl0gPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmFjdGl2ZVRleHR1cmUodGhpcy5nbC5URVhUVVJFMCArIHVuaXQpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUsIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsY3ViaWMg44GM5oyB44Gk6YWN5YiX5YaF44Gu44OG44Kv44K544OB44Oj55So55S75YOP44GM5YWo44Gm44Ot44O844OJ5riI44G/44GL44Gp44GG44GL56K66KqN44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjg63jg7zjg4njgYzlrozkuobjgZfjgabjgYTjgovjgYvjganjgYbjgYvjga7jg5Xjg6njgrBcclxuICAgICAqL1xyXG4gICAgaXNUZXh0dXJlTG9hZGVkKCl7XHJcbiAgICAgICAgbGV0IGksIGosIGYsIGc7XHJcbiAgICAgICAgZiA9IHRydWU7IGcgPSBmYWxzZTtcclxuICAgICAgICBmb3IoaSA9IDAsIGogPSB0aGlzLnRleHR1cmVzLmxlbmd0aDsgaSA8IGo7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGV4dHVyZXNbaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGYgPSBmICYmIHRoaXMudGV4dHVyZXNbaV0ubG9hZGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGcpe3JldHVybiBmO31lbHNle3JldHVybiBmYWxzZTt9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgavjg4bjgq/jgrnjg4Hjg6PjgpLoqK3lrprjgZfjgabjgqrjg5bjgrjjgqfjgq/jg4jjgajjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBruaoquW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoUmVuZGVyQnVmZmVyIC0g5rex5bqm44OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44Os44Oz44OA44O844OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOOCq+ODqeODvOODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODhuOCr+OCueODgeODo1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlcih3aWR0aCwgaGVpZ2h0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGNyZWF0ZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgavjg4bjgq/jgrnjg4Hjg6PjgpLoqK3lrprjgIHjgrnjg4bjg7Pjgrfjg6vmnInlirnjgafjgqrjg5bjgrjjgqfjgq/jg4jjgajjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBruaoquW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoU3RlbmNpbFJlbmRlcmJ1ZmZlciAtIOa3seW6puODkOODg+ODleOCoeWFvOOCueODhuODs+OCt+ODq+ODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODrOODs+ODgOODvOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFRleHR1cmV9IHRleHR1cmUgLSDjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6NcclxuICAgICAqL1xyXG4gICAgY3JlYXRlRnJhbWVidWZmZXJTdGVuY2lsKHdpZHRoLCBoZWlnaHQsIG51bWJlcil7XHJcbiAgICAgICAgaWYod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBsZXQgZnJhbWVCdWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIGxldCBkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhTdGVuY2lsUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfU1RFTkNJTCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGNyZWF0ZWQgKGVuYWJsZSBzdGVuY2lsKScsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFN0ZW5jaWxSZW5kZXJidWZmZXI6IGRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlciwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Kr44Op44O844OQ44OD44OV44Kh44Gr5rWu5YuV5bCP5pWw54K544OG44Kv44K544OB44Oj44KS6Kit5a6a44GX44Gm44Kq44OW44K444Kn44Kv44OI44Go44GX44Gm6L+U44GZIOKAu+imgeaLoeW8teapn+iDve+8iFdlYkdMIDEuMO+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu5qiq5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IOeUn+aIkOOBl+OBn+WQhOeoruOCquODluOCuOOCp+OCr+ODiOOBr+ODqeODg+ODl+OBl+OBpui/lOWNtOOBmeOCi1xyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTEZyYW1lYnVmZmVyfSBmcmFtZWJ1ZmZlciAtIOODleODrOODvOODoOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFJlbmRlcmJ1ZmZlcn0gZGVwdGhSZW5kZXJCdWZmZXIgLSDmt7Hluqbjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg6zjg7Pjg4Djg7zjg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g44Kr44Op44O844OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44OG44Kv44K544OB44OjXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUZyYW1lYnVmZmVyRmxvYXQod2lkdGgsIGhlaWdodCwgbnVtYmVyKXtcclxuICAgICAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGlmKHRoaXMuZXh0ID09IG51bGwgfHwgKHRoaXMuZXh0LnRleHR1cmVGbG9hdCA9PSBudWxsICYmIHRoaXMuZXh0LnRleHR1cmVIYWxmRmxvYXQgPT0gbnVsbCkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmxvYXQgdGV4dHVyZSBub3Qgc3VwcG9ydCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgbGV0IGZsZyA9ICh0aGlzLmV4dC50ZXh0dXJlRmxvYXQgIT0gbnVsbCkgPyBnbC5GTE9BVCA6IHRoaXMuZXh0LnRleHR1cmVIYWxmRmxvYXQuSEFMRl9GTE9BVF9PRVM7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGxldCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGZUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlKTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGZsZywgbnVsbCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3JlYXRlZCAoZW5hYmxlIGZsb2F0KScsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFJlbmRlcmJ1ZmZlcjogbnVsbCwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Kr44Op44O844OQ44OD44OV44Kh44Gr44Kt44Ol44O844OW44OG44Kv44K544OB44Oj44KS6Kit5a6a44GX44Gm44Kq44OW44K444Kn44Kv44OI44Go44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7mqKrluYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHRhcmdldCAtIOOCreODpeODvOODluODnuODg+ODl+ODhuOCr+OCueODgeODo+OBq+ioreWumuOBmeOCi+OCv+ODvOOCsuODg+ODiOOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoUmVuZGVyQnVmZmVyIC0g5rex5bqm44OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44Os44Oz44OA44O844OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOOCq+ODqeODvOODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODhuOCr+OCueODgeODo1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlckN1YmUod2lkdGgsIGhlaWdodCwgdGFyZ2V0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0W2ldLCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjdWJlIGNyZWF0ZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIVE1MIOWGheOBq+WtmOWcqOOBmeOCiyBJRCDmloflrZfliJfjgYvjgokgc2NyaXB0IOOCv+OCsOOCkuWPgueFp+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzSWQgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgYzoqJjov7DjgZXjgozjgZ8gc2NyaXB0IOOCv+OCsOOBriBJRCDmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmc0lkIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K944O844K544GM6KiY6L+w44GV44KM44GfIHNjcmlwdCDjgr/jgrDjga4gSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBhdHRMb2NhdGlvbiAtIGF0dHJpYnV0ZSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGF0dFN0cmlkZSAtIGF0dHJpYnV0ZSDlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaUxvY2F0aW9uIC0gdW5pZm9ybSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaVR5cGUgLSB1bmlmb3JtIOWkieaVsOabtOaWsOODoeOCveODg+ODieOBruWQjeWJjeOCkuekuuOBmeaWh+Wtl+WIlyDigLvkvovvvJonbWF0cml4NGZ2J1xyXG4gICAgICogQHJldHVybiB7UHJvZ3JhbU1hbmFnZXJ9IOODl+ODreOCsOODqeODoOODnuODjeODvOOCuOODo+ODvOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUlkKHZzSWQsIGZzSWQsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wsIHRoaXMuaXNXZWJHTDIpO1xyXG4gICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tSWQodnNJZCk7XHJcbiAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21JZChmc0lkKTtcclxuICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgIGlmKG1uZy5wcmcgPT0gbnVsbCl7cmV0dXJuIG1uZzt9XHJcbiAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLmF0dExbaV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcudW5pTFtpXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieaWh+Wtl+WIl+OBi+OCieODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzIC0g6aCC54K544K344Kn44O844OA44Gu44K944O844K5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZnMgLSDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGF0dExvY2F0aW9uIC0gYXR0cmlidXRlIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXR0U3RyaWRlIC0gYXR0cmlidXRlIOWkieaVsOOBruOCueODiOODqeOCpOODieOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pTG9jYXRpb24gLSB1bmlmb3JtIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pVHlwZSAtIHVuaWZvcm0g5aSJ5pWw5pu05paw44Oh44K944OD44OJ44Gu5ZCN5YmN44KS56S644GZ5paH5a2X5YiXIOKAu+S+i++8midtYXRyaXg0ZnYnXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9ncmFtTWFuYWdlcn0g44OX44Ot44Kw44Op44Og44Oe44ON44O844K444Oj44O844Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tU291cmNlKHZzLCBmcywgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCwgdGhpcy5pc1dlYkdMMik7XHJcbiAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2UodnMsIHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2UoZnMsIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgIGlmKG1uZy5wcmcgPT0gbnVsbCl7cmV0dXJuIG1uZzt9XHJcbiAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLmF0dExbaV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcudW5pTFtpXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleOCoeOCpOODq+OBi+OCieOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieOCkuWPluW+l+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzUGF0aCAtIOmggueCueOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBn+ODleOCoeOCpOODq+OBruODkeOCuVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZzUGF0aCAtIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBn+ODleOCoeOCpOODq+OBruODkeOCuVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gYXR0TG9jYXRpb24gLSBhdHRyaWJ1dGUg5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRTdHJpZGUgLSBhdHRyaWJ1dGUg5aSJ5pWw44Gu44K544OI44Op44Kk44OJ44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlMb2NhdGlvbiAtIHVuaWZvcm0g5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlUeXBlIC0gdW5pZm9ybSDlpInmlbDmm7TmlrDjg6Hjgr3jg4Pjg4njga7lkI3liY3jgpLnpLrjgZnmloflrZfliJcg4oC75L6L77yaJ21hdHJpeDRmdidcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0g44K944O844K544Kz44O844OJ44Gu44Ot44O844OJ44GM5a6M5LqG44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GX44Gf5b6M44Gr5ZG844Gw44KM44KL44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9ncmFtTWFuYWdlcn0g44OX44Ot44Kw44Op44Og44Oe44ON44O844K444Oj44O844Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5IOKAu+ODreODvOODieWJjeOBq+OCpOODs+OCueOCv+ODs+OCueOBr+aIu+OCiuWApOOBqOOBl+OBpui/lOWNtOOBleOCjOOCi1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUZpbGUodnNQYXRoLCBmc1BhdGgsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsLCB0aGlzLmlzV2ViR0wyKTtcclxuICAgICAgICBsZXQgc3JjID0ge1xyXG4gICAgICAgICAgICB2czoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXJsOiB2c1BhdGgsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnM6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFVybDogZnNQYXRoLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMudnMpO1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMuZnMpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHhocihnbCwgdGFyZ2V0KXtcclxuICAgICAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4bWwub3BlbignR0VUJywgdGFyZ2V0LnRhcmdldFVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgc2hhZGVyIGZpbGUgbG9hZGVkOiAlYycgKyB0YXJnZXQudGFyZ2V0VXJsLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5zb3VyY2UgPSB4bWwucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgbG9hZENoZWNrKGdsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeG1sLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZENoZWNrKGdsKXtcclxuICAgICAgICAgICAgaWYoc3JjLnZzLnNvdXJjZSA9PSBudWxsIHx8IHNyYy5mcy5zb3VyY2UgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHNyYy52cy5zb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShzcmMuZnMuc291cmNlLCBnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgICAgICBpZihtbmcucHJnID09IG51bGwpe3JldHVybiBtbmc7fVxyXG4gICAgICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBtbmcuYXR0TFtpXSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIG1uZy51bmlMW2ldID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG1uZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Djg4Pjg5XjgqHjgqrjg5bjgrjjgqfjgq/jg4jjgpLliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xCdWZmZXJ9IGJ1ZmZlciAtIOWJiumZpOOBmeOCi+ODkOODg+ODleOCoeOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBkZWxldGVCdWZmZXIoYnVmZmVyKXtcclxuICAgICAgICBpZih0aGlzLmdsLmlzQnVmZmVyKGJ1ZmZlcikgIT09IHRydWUpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVCdWZmZXIoYnVmZmVyKTtcclxuICAgICAgICBidWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OI44KS5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOWJiumZpOOBmeOCi+ODhuOCr+OCueODgeODo+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBkZWxldGVUZXh0dXJlKHRleHR1cmUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuaXNUZXh0dXJlKHRleHR1cmUpICE9PSB0cnVlKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcclxuICAgICAgICB0ZXh0dXJlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOChOODrOODs+ODgOODvOODkOODg+ODleOCoeOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIOODleODrOODvOODoOODkOODg+ODleOCoeeUn+aIkOODoeOCveODg+ODieOBjOi/lOOBmeOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBkZWxldGVGcmFtZWJ1ZmZlcihvYmope1xyXG4gICAgICAgIGlmKG9iaiA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGZvcihsZXQgdiBpbiBvYmope1xyXG4gICAgICAgICAgICBpZihvYmpbdl0gaW5zdGFuY2VvZiBXZWJHTEZyYW1lYnVmZmVyICYmIHRoaXMuZ2wuaXNGcmFtZWJ1ZmZlcihvYmpbdl0pID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2wuZGVsZXRlRnJhbWVidWZmZXIob2JqW3ZdKTtcclxuICAgICAgICAgICAgICAgIG9ialt2XSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihvYmpbdl0gaW5zdGFuY2VvZiBXZWJHTFJlbmRlcmJ1ZmZlciAmJiB0aGlzLmdsLmlzUmVuZGVyYnVmZmVyKG9ialt2XSkgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbC5kZWxldGVSZW5kZXJidWZmZXIob2JqW3ZdKTtcclxuICAgICAgICAgICAgICAgIG9ialt2XSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihvYmpbdl0gaW5zdGFuY2VvZiBXZWJHTFRleHR1cmUgJiYgdGhpcy5nbC5pc1RleHR1cmUob2JqW3ZdKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsLmRlbGV0ZVRleHR1cmUob2JqW3ZdKTtcclxuICAgICAgICAgICAgICAgIG9ialt2XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gc2hhZGVyIC0g44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVNoYWRlcihzaGFkZXIpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuaXNTaGFkZXIoc2hhZGVyKSAhPT0gdHJ1ZSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIHNoYWRlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xQcm9ncmFtfSBwcm9ncmFtIC0g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVByb2dyYW0ocHJvZ3JhbSl7XHJcbiAgICAgICAgaWYodGhpcy5nbC5pc1Byb2dyYW0ocHJvZ3JhbSkgIT09IHRydWUpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgIHByb2dyYW0gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvZ3JhbU1hbmFnZXIg44Kv44Op44K544KS5YaF6YOo44OX44Ot44OR44OG44Kj44GU44Go5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1Byb2dyYW1NYW5hZ2VyfSBwcmcgLSBQcm9ncmFtTWFuYWdlciDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqL1xyXG4gICAgZGVsZXRlUHJvZ3JhbU1hbmFnZXIocHJnKXtcclxuICAgICAgICBpZihwcmcgPT0gbnVsbCB8fCAhKHByZyBpbnN0YW5jZW9mIFByb2dyYW1NYW5hZ2VyKSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmRlbGV0ZVNoYWRlcihwcmcudnMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2hhZGVyKHByZy5mcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9ncmFtKHByZy5wcmcpO1xyXG4gICAgICAgIHByZy5hdHRMID0gbnVsbDtcclxuICAgICAgICBwcmcuYXR0UyA9IG51bGw7XHJcbiAgICAgICAgcHJnLnVuaUwgPSBudWxsO1xyXG4gICAgICAgIHByZy51bmlUID0gbnVsbDtcclxuICAgICAgICBwcmcgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KE44K344Kn44O844OA44KS566h55CG44GZ44KL44Oe44ON44O844K444OjXHJcbiAqIEBjbGFzcyBQcm9ncmFtTWFuYWdlclxyXG4gKi9cclxuY2xhc3MgUHJvZ3JhbU1hbmFnZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBnbCAtIOiHqui6q+OBjOWxnuOBmeOCiyBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gICAgICogQHBhcmFtIHtib29sfSBbd2ViZ2wyTW9kZT1mYWxzZV0gLSB3ZWJnbDIg44KS5pyJ5Yq55YyW44GX44Gf44GL44Gp44GG44GLXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGdsLCB3ZWJnbDJNb2RlID0gZmFsc2Upe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OBjOWxnuOBmeOCiyBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQg44Go44GX44Gm5Yid5pyf5YyW44GX44Gf44GL44Gp44GG44GL44KS6KGo44GZ55yf5YG95YCkXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pc1dlYkdMMiA9IHdlYmdsMk1vZGU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6aCC54K544K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHR5cGUge1dlYkdMU2hhZGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudnMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFNoYWRlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmZzID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAdHlwZSB7V2ViR0xQcm9ncmFtfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucHJnID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4jjg6rjg5Pjg6Xjg7zjg4jjg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdHRMID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4jjg6rjg5Pjg6Xjg7zjg4jlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdHRTID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6bjg4vjg5Xjgqnjg7zjg6Djg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPFdlYkdMVW5pZm9ybUxvY2F0aW9uPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuaUwgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODpuODi+ODleOCqeODvOODoOWkieaVsOOBruOCv+OCpOODl+OBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuaVQgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODqeODvOmWoumAo+aDheWgseOCkuagvOe0jeOBmeOCi1xyXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZzIC0g6aCC54K544K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44Or44Ko44Op44O8XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44Or44Ko44Op44O8XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHByZyAtIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBruODquODs+OCr+OCqOODqeODvFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSB7dnM6IG51bGwsIGZzOiBudWxsLCBwcmc6IG51bGx9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2NyaXB0IOOCv+OCsOOBriBJRCDjgpLlhYPjgavjgr3jg7zjgrnjgrPjg7zjg4njgpLlj5blvpfjgZfjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHNjcmlwdCDjgr/jgrDjgavku5jliqDjgZXjgozjgZ8gSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFNoYWRlcn0g55Sf5oiQ44GX44Gf44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVNoYWRlckZyb21JZChpZCl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZighc2NyaXB0RWxlbWVudCl7cmV0dXJuO31cclxuICAgICAgICBzd2l0Y2goc2NyaXB0RWxlbWVudC50eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAneC1zaGFkZXIveC12ZXJ0ZXgnOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd4LXNoYWRlci94LWZyYWdtZW50JzpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNvdXJjZSA9IHNjcmlwdEVsZW1lbnQudGV4dDtcclxuICAgICAgICBpZih0aGlzLmlzV2ViR0wyICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgaWYoc291cmNlLnNlYXJjaCgvXiN2ZXJzaW9uIDMwMCBlcy8pID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY2FuIG5vdCB1c2UgZ2xzbCBlcyAzLjAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcclxuICAgICAgICAgICAgaWYoc2NyaXB0RWxlbWVudC50eXBlID09PSAneC1zaGFkZXIveC12ZXJ0ZXgnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudnMgPSBlcnI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5mcyA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieOCkuaWh+Wtl+WIl+OBp+W8leaVsOOBi+OCieWPluW+l+OBl+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSAtIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODiVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgLSBnbC5WRVJURVhfU0hBREVSIG9yIGdsLkZSQUdNRU5UX1NIQURFUlxyXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IOeUn+aIkOOBl+OBn+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVTaGFkZXJGcm9tU291cmNlKHNvdXJjZSwgdHlwZSl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgdGhpcy5nbC5WRVJURVhfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzV2ViR0wyICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgaWYoc291cmNlLnNlYXJjaCgvXiN2ZXJzaW9uIDMwMCBlcy8pID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY2FuIG5vdCB1c2UgZ2xzbCBlcyAzLjAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcclxuICAgICAgICAgICAgaWYodHlwZSA9PT0gdGhpcy5nbC5WRVJURVhfU0hBREVSKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudnMgPSBlcnI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5mcyA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkuW8leaVsOOBi+OCieWPluW+l+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdnMgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFByb2dyYW19IOeUn+aIkOOBl+OBn+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtKHZzLCBmcyl7XHJcbiAgICAgICAgaWYodnMgPT0gbnVsbCB8fCBmcyA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2cyk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnMpO1xyXG4gICAgICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpKXtcclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvZ3JhbTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IGVyciA9IHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IucHJnID0gZXJyO1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBsaW5rIHByb2dyYW0gZmFpbGVkOiAnICsgZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rouqvjga7lhoXpg6jjg5fjg63jg5Hjg4bjgqPjgajjgZfjgablrZjlnKjjgZnjgovjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLoqK3lrprjgZnjgotcclxuICAgICAqL1xyXG4gICAgdXNlUHJvZ3JhbSgpe1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLnByZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWQk8g44GoIElCTyDjgpLjg5DjgqTjg7Pjg4njgZfjgabmnInlirnljJbjgZnjgotcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPFdlYkdMQnVmZmVyPn0gdmJvIC0gVkJPIOOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICogQHBhcmFtIHtXZWJHTEJ1ZmZlcn0gW2lib10gLSBJQk9cclxuICAgICAqL1xyXG4gICAgc2V0QXR0cmlidXRlKHZibywgaWJvKXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGZvcihsZXQgaSBpbiB2Ym8pe1xyXG4gICAgICAgICAgICBpZih0aGlzLmF0dExbaV0gPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmJvW2ldKTtcclxuICAgICAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuYXR0TFtpXSk7XHJcbiAgICAgICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuYXR0TFtpXSwgdGhpcy5hdHRTW2ldLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlibyAhPSBudWxsKXtnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO31cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBq+ODpuODi+ODleOCqeODvOODoOWkieaVsOOBq+ioreWumuOBmeOCi+WApOOCkuODl+ODg+OCt+ODpeOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bWl4ZWQ+fSBtaXhlZCAtIOODpuODi+ODleOCqeODvOODoOWkieaVsOOBq+ioreWumuOBmeOCi+WApOOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICovXHJcbiAgICBwdXNoU2hhZGVyKG1peGVkKXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSB0aGlzLnVuaVQubGVuZ3RoOyBpIDwgajsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHVuaSA9ICd1bmlmb3JtJyArIHRoaXMudW5pVFtpXS5yZXBsYWNlKC9tYXRyaXgvaSwgJ01hdHJpeCcpO1xyXG4gICAgICAgICAgICBpZihnbFt1bmldICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYodW5pLnNlYXJjaCgvTWF0cml4LykgIT09IC0xKXtcclxuICAgICAgICAgICAgICAgICAgICBnbFt1bmldKHRoaXMudW5pTFtpXSwgZmFsc2UsIG1peGVkW2ldKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBtaXhlZFtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4Ygbm90IHN1cHBvcnQgdW5pZm9ybSB0eXBlOiAnICsgdGhpcy51bmlUW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCouODiOODquODk+ODpeODvOODiOODreOCseODvOOCt+ODp+ODs+OBqOODpuODi+ODleOCqeODvOODoOODreOCseODvOOCt+ODp+ODs+OBjOato+OBl+OBj+WPluW+l+OBp+OBjeOBn+OBi+ODgeOCp+ODg+OCr+OBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXR0TG9jYXRpb24gLSDlj5blvpfjgZfjgZ/jgqLjg4jjg6rjg5Pjg6Xjg7zjg4jjg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPFdlYkdMVW5pZm9ybUxvY2F0aW9uPn0gdW5pTG9jYXRpb24gLSDlj5blvpfjgZfjgZ/jg6bjg4vjg5Xjgqnjg7zjg6Djg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgbG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pe1xyXG4gICAgICAgIGxldCBpLCBsO1xyXG4gICAgICAgIGZvcihpID0gMCwgbCA9IGF0dExvY2F0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA9PSBudWxsIHx8IHRoaXMuYXR0TFtpXSA8IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgaW52YWxpZCBhdHRyaWJ1dGUgbG9jYXRpb246ICVjXCInICsgYXR0TG9jYXRpb25baV0gKyAnXCInLCAnY29sb3I6IGNyaW1zb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaSA9IDAsIGwgPSB1bmlMb2NhdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLnVuaUxbaV0gPT0gbnVsbCB8fCB0aGlzLnVuaUxbaV0gPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGludmFsaWQgdW5pZm9ybSBsb2NhdGlvbjogJWNcIicgKyB1bmlMb2NhdGlvbltpXSArICdcIicsICdjb2xvcjogY3JpbXNvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuZ2wzID0gd2luZG93LmdsMyB8fCBuZXcgZ2wzKCk7XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNDb3JlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==