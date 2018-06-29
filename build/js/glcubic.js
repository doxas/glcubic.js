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
var gl3Gui =
/**
 * @constructor
 */
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
};

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
    this.element.style.width = '340px';
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
    this.toggle.style.border = '1px solid rgba(240, 240, 240, 0.2)';
    this.toggle.style.borderRadius = '25px';
    this.toggle.style.boxShadow = '0px 0px 2px 2px rgba(8, 8, 8, 0.8)';
    this.toggle.style.position = 'absolute';
    this.toggle.style.top = '20px';
    this.toggle.style.right = '360px';
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
        _this.element.style.right = '-340px';
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
    this.element.style.width = '320px';
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
    this.label.style.width = '100px';
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
    this.value.style.width = '50px';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWE2ZTljYzJjYWM3MjAyNWFmYmQiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzR3VpLmpzIiwid2VicGFjazovLy8uL2dsM01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzTWVzaC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNVdGlsLmpzIiwid2VicGFjazovLy8uL2dsM0NvcmUuanMiXSwibmFtZXMiOlsiZ2wzQXVkaW8iLCJiZ21HYWluVmFsdWUiLCJzb3VuZEdhaW5WYWx1ZSIsImN0eCIsImNvbXAiLCJiZ21HYWluIiwic291bmRHYWluIiwic3JjIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiY3JlYXRlRHluYW1pY3NDb21wcmVzc29yIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJzZXRWYWx1ZUF0VGltZSIsIkVycm9yIiwicGF0aCIsImluZGV4IiwibG9vcCIsImJhY2tncm91bmQiLCJjYWxsYmFjayIsInhtbCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJyZXNwb25zZVR5cGUiLCJvbmxvYWQiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImJ1ZiIsIkF1ZGlvU3JjIiwibG9hZGVkIiwiY29uc29sZSIsImxvZyIsImUiLCJzZW5kIiwiaSIsImYiLCJsZW5ndGgiLCJhdWRpb0J1ZmZlciIsImJ1ZmZlclNvdXJjZSIsImFjdGl2ZUJ1ZmZlclNvdXJjZSIsImZmdExvb3AiLCJ1cGRhdGUiLCJub2RlIiwiY3JlYXRlU2NyaXB0UHJvY2Vzc29yIiwiYW5hbHlzZXIiLCJjcmVhdGVBbmFseXNlciIsInNtb290aGluZ1RpbWVDb25zdGFudCIsImZmdFNpemUiLCJvbkRhdGEiLCJVaW50OEFycmF5IiwiZnJlcXVlbmN5QmluQ291bnQiLCJqIiwiayIsInNlbGYiLCJwbGF5bm93IiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYnVmZmVyIiwicGxheWJhY2tSYXRlIiwidmFsdWUiLCJvbmVuZGVkIiwic3RvcCIsIm9uYXVkaW9wcm9jZXNzIiwiZXZlIiwib25wcm9jZXNzRXZlbnQiLCJzdGFydCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwiZ2wzR3VpIiwiV3JhcHBlciIsIkdVSVdyYXBwZXIiLCJFbGVtZW50IiwiR1VJRWxlbWVudCIsIlNsaWRlciIsIkdVSVNsaWRlciIsIkNoZWNrYm94IiwiR1VJQ2hlY2tib3giLCJSYWRpbyIsIkdVSVJhZGlvIiwiU2VsZWN0IiwiR1VJU2VsZWN0IiwiU3BpbiIsIkdVSVNwaW4iLCJDb2xvciIsIkdVSUNvbG9yIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsIndpZHRoIiwiaGVpZ2h0IiwidHJhbnNpdGlvbiIsIndyYXBwZXIiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvdmVyZmxvdyIsInRvZ2dsZSIsImNsYXNzTmFtZSIsInRleHRDb250ZW50IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiY29sb3IiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJjdXJzb3IiLCJ0cmFuc2Zvcm0iLCJhcHBlbmRDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInRleHQiLCJ0ZXh0QWxpZ24iLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwibGFiZWwiLCJ0ZXh0U2hhZG93IiwibWFyZ2luIiwiY29udHJvbCIsImxpc3RlbmVycyIsInR5cGUiLCJmdW5jIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiaGFzT3duUHJvcGVydHkiLCJtaW4iLCJtYXgiLCJzdGVwIiwic2V0QXR0cmlidXRlIiwidmVydGljYWxBbGlnbiIsInNldFZhbHVlIiwiZW1pdCIsImNoZWNrZWQiLCJuYW1lIiwibGlzdCIsInNlbGVjdGVkSW5kZXgiLCJtYXAiLCJ2Iiwib3B0IiwiT3B0aW9uIiwiYWRkIiwiY29udGFpbmVyIiwiZ2V0Q29udGV4dCIsImdyYWQiLCJjcmVhdGVMaW5lYXJHcmFkaWVudCIsImFyciIsImFkZENvbG9yU3RvcCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiY29sb3JWYWx1ZSIsInRlbXBDb2xvclZhbHVlIiwiaW1hZ2VEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJnZXRDb2xvcjhiaXRTdHJpbmciLCJkYXRhIiwiY3VycmVudFRhcmdldCIsImdldENvbG9yRmxvYXRBcnJheSIsInIiLCJ6ZXJvUGFkZGluZyIsImciLCJiIiwic2VhcmNoIiwicyIsInJlcGxhY2UiLCJ0IiwicGFyc2VJbnQiLCJzdWJzdHIiLCJudW1iZXIiLCJjb3VudCIsImEiLCJBcnJheSIsImpvaW4iLCJzbGljZSIsImdsM01hdGgiLCJNYXQ0IiwiVmVjMyIsIlZlYzIiLCJRdG4iLCJGbG9hdDMyQXJyYXkiLCJkZXN0IiwibWF0MCIsIm1hdDEiLCJvdXQiLCJjcmVhdGUiLCJjIiwiZCIsImgiLCJsIiwibSIsIm4iLCJvIiwicCIsIkEiLCJCIiwiQyIsIkQiLCJFIiwiRiIsIkciLCJIIiwiSSIsIkoiLCJLIiwiTCIsIk0iLCJOIiwiTyIsIlAiLCJtYXQiLCJ2ZWMiLCJhbmdsZSIsImF4aXMiLCJzcSIsIk1hdGgiLCJzcXJ0Iiwic2luIiwiY29zIiwicSIsInUiLCJ3IiwieCIsInkiLCJ6IiwiZXllIiwiY2VudGVyIiwidXAiLCJleWVYIiwiZXllWSIsImV5ZVoiLCJjZW50ZXJYIiwiY2VudGVyWSIsImNlbnRlcloiLCJ1cFgiLCJ1cFkiLCJ1cFoiLCJpZGVudGl0eSIsIngwIiwieDEiLCJ4MiIsInkwIiwieTEiLCJ5MiIsInowIiwiejEiLCJ6MiIsImZvdnkiLCJhc3BlY3QiLCJuZWFyIiwiZmFyIiwidGFuIiwiUEkiLCJsZWZ0IiwiYm90dG9tIiwiaXZkIiwiY2VudGVyUG9pbnQiLCJ1cERpcmVjdGlvbiIsInZtYXQiLCJwbWF0IiwibG9va0F0IiwicGVyc3BlY3RpdmUiLCJtdWx0aXBseSIsImhhbGZXaWR0aCIsImhhbGZIZWlnaHQiLCJ0b1ZlY0lWIiwiTmFOIiwidjAiLCJ2MSIsImxlbiIsInYyIiwidmVjMSIsInZlYzIiLCJub3JtYWxpemUiLCJxdG4iLCJxdG4wIiwicXRuMSIsImF4IiwiYXkiLCJheiIsImF3IiwiYngiLCJieSIsImJ6IiwiYnciLCJxcCIsInFxIiwicXIiLCJpbnZlcnNlIiwieHgiLCJ4eSIsInh6IiwieXkiLCJ5eiIsInp6Iiwid3giLCJ3eSIsInd6IiwidGltZSIsImh0IiwiaHMiLCJhYnMiLCJwaCIsImFjb3MiLCJwdCIsInQwIiwidDEiLCJnbDNNZXNoIiwidGMiLCJwb3MiLCJub3IiLCJjb2wiLCJzdCIsImlkeCIsIm5vcm1hbCIsInRleENvb3JkIiwic3BsaXQiLCJyYWQiLCJwdXNoIiwicngiLCJyeSIsInNpZGUiLCJyeiIsInRvcFJhZCIsImJvdHRvbVJhZCIsInJvdyIsImNvbHVtbiIsInJyIiwidHIiLCJ0eCIsInR5IiwidHoiLCJpcmFkIiwib3JhZCIsInJzIiwicnQiLCJhdGFuMiIsImdsM1V0aWwiLCJ0aCIsImZsb29yIiwidHMiLCJkZWciLCJsb24iLCJFQVJUSF9SQURJVVMiLCJkZWdUb1JhZCIsImxhdCIsImZsYXR0ZW4iLCJmbGF0dGVuaW5nIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiY2xhbXAiLCJ0ZW1wIiwiZXMiLCJlY2NlbnQiLCJwaGkiLCJzaW5waGkiLCJjb24iLCJjb20iLCJwb3ciLCJsb25Ub01lciIsImxhdFRvTWVyIiwiRUFSVEhfSEFMRl9DSVJDVU0iLCJhdGFuIiwiZXhwIiwiem9vbSIsImxvblRvVGlsZSIsImxhdFRvVGlsZSIsInRpbGVUb0xvbiIsInRpbGVUb0xhdCIsImdsMyIsIlZFUlNJT04iLCJQSTIiLCJQSUgiLCJQSUgyIiwiVEVYVFVSRV9VTklUX0NPVU5UIiwicmVhZHkiLCJjYW52YXMiLCJnbCIsImlzV2ViR0wyIiwiaXNDb25zb2xlT3V0cHV0IiwidGV4dHVyZXMiLCJleHQiLCJBdWRpbyIsIk1lc2giLCJVdGlsIiwiR3VpIiwiaW5pdE9wdGlvbnMiLCJjdWJpY09wdGlvbnMiLCJIVE1MQ2FudmFzRWxlbWVudCIsImdldEVsZW1lbnRCeUlkIiwid2ViZ2wyTW9kZSIsImNvbnNvbGVNZXNzYWdlIiwiZ2V0UGFyYW1ldGVyIiwiTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMiLCJlbGVtZW50SW5kZXhVaW50IiwiZ2V0RXh0ZW5zaW9uIiwidGV4dHVyZUZsb2F0IiwidGV4dHVyZUhhbGZGbG9hdCIsImRyYXdCdWZmZXJzIiwiZGVwdGgiLCJzdGVuY2lsIiwiZmxnIiwiQ09MT1JfQlVGRkVSX0JJVCIsImNsZWFyQ29sb3IiLCJjbGVhckRlcHRoIiwiREVQVEhfQlVGRkVSX0JJVCIsImNsZWFyU3RlbmNpbCIsIlNURU5DSUxfQlVGRkVSX0JJVCIsImNsZWFyIiwiWCIsIlkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJ2aWV3cG9ydCIsInByaW1pdGl2ZSIsInZlcnRleENvdW50Iiwib2Zmc2V0IiwiZHJhd0FycmF5cyIsImluZGV4TGVuZ3RoIiwiZHJhd0VsZW1lbnRzIiwiVU5TSUdORURfU0hPUlQiLCJVTlNJR05FRF9JTlQiLCJ2Ym8iLCJjcmVhdGVCdWZmZXIiLCJiaW5kQnVmZmVyIiwiQVJSQVlfQlVGRkVSIiwiYnVmZmVyRGF0YSIsIlNUQVRJQ19EUkFXIiwiaWJvIiwiRUxFTUVOVF9BUlJBWV9CVUZGRVIiLCJJbnQxNkFycmF5IiwiVWludDMyQXJyYXkiLCJzb3VyY2UiLCJpbWciLCJJbWFnZSIsInRleHR1cmUiLCJ0ZXgiLCJjcmVhdGVUZXh0dXJlIiwiYWN0aXZlVGV4dHVyZSIsIlRFWFRVUkUwIiwiYmluZFRleHR1cmUiLCJURVhUVVJFXzJEIiwidGV4SW1hZ2UyRCIsIlJHQkEiLCJVTlNJR05FRF9CWVRFIiwiZ2VuZXJhdGVNaXBtYXAiLCJ0ZXhQYXJhbWV0ZXJpIiwiVEVYVFVSRV9NSU5fRklMVEVSIiwiTElORUFSIiwiVEVYVFVSRV9NQUdfRklMVEVSIiwiVEVYVFVSRV9XUkFQX1MiLCJDTEFNUF9UT19FREdFIiwiVEVYVFVSRV9XUkFQX1QiLCJvYmplY3QiLCJ0YXJnZXQiLCJjSW1nIiwiaW1hZ2UiLCJURVhUVVJFX0NVQkVfTUFQIiwidW5pdCIsImZyYW1lQnVmZmVyIiwiY3JlYXRlRnJhbWVidWZmZXIiLCJiaW5kRnJhbWVidWZmZXIiLCJGUkFNRUJVRkZFUiIsImRlcHRoUmVuZGVyQnVmZmVyIiwiY3JlYXRlUmVuZGVyYnVmZmVyIiwiYmluZFJlbmRlcmJ1ZmZlciIsIlJFTkRFUkJVRkZFUiIsInJlbmRlcmJ1ZmZlclN0b3JhZ2UiLCJERVBUSF9DT01QT05FTlQxNiIsImZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyIiwiREVQVEhfQVRUQUNITUVOVCIsImZUZXh0dXJlIiwiZnJhbWVidWZmZXJUZXh0dXJlMkQiLCJDT0xPUl9BVFRBQ0hNRU5UMCIsImZyYW1lYnVmZmVyIiwiZGVwdGhSZW5kZXJidWZmZXIiLCJkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIiLCJERVBUSF9TVEVOQ0lMIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UIiwiZGVwdGhTdGVuY2lsUmVuZGVyYnVmZmVyIiwiRkxPQVQiLCJIQUxGX0ZMT0FUX09FUyIsIk5FQVJFU1QiLCJ2c0lkIiwiZnNJZCIsImF0dExvY2F0aW9uIiwiYXR0U3RyaWRlIiwidW5pTG9jYXRpb24iLCJ1bmlUeXBlIiwibW5nIiwiUHJvZ3JhbU1hbmFnZXIiLCJ2cyIsImNyZWF0ZVNoYWRlckZyb21JZCIsImZzIiwicHJnIiwiY3JlYXRlUHJvZ3JhbSIsImF0dEwiLCJhdHRTIiwiZ2V0QXR0cmliTG9jYXRpb24iLCJ1bmlMIiwiZ2V0VW5pZm9ybUxvY2F0aW9uIiwidW5pVCIsImxvY2F0aW9uQ2hlY2siLCJjcmVhdGVTaGFkZXJGcm9tU291cmNlIiwiVkVSVEVYX1NIQURFUiIsIkZSQUdNRU5UX1NIQURFUiIsInZzUGF0aCIsImZzUGF0aCIsInRhcmdldFVybCIsInhociIsInJlc3BvbnNlVGV4dCIsImxvYWRDaGVjayIsImlzQnVmZmVyIiwiZGVsZXRlQnVmZmVyIiwiaXNUZXh0dXJlIiwiZGVsZXRlVGV4dHVyZSIsIm9iaiIsIldlYkdMRnJhbWVidWZmZXIiLCJpc0ZyYW1lYnVmZmVyIiwiZGVsZXRlRnJhbWVidWZmZXIiLCJXZWJHTFJlbmRlcmJ1ZmZlciIsImlzUmVuZGVyYnVmZmVyIiwiZGVsZXRlUmVuZGVyYnVmZmVyIiwiV2ViR0xUZXh0dXJlIiwic2hhZGVyIiwiaXNTaGFkZXIiLCJkZWxldGVTaGFkZXIiLCJwcm9ncmFtIiwiaXNQcm9ncmFtIiwiZGVsZXRlUHJvZ3JhbSIsImVycm9yIiwiaWQiLCJzY3JpcHRFbGVtZW50IiwiY3JlYXRlU2hhZGVyIiwid2FybiIsInNoYWRlclNvdXJjZSIsImNvbXBpbGVTaGFkZXIiLCJnZXRTaGFkZXJQYXJhbWV0ZXIiLCJDT01QSUxFX1NUQVRVUyIsImVyciIsImdldFNoYWRlckluZm9Mb2ciLCJhdHRhY2hTaGFkZXIiLCJsaW5rUHJvZ3JhbSIsImdldFByb2dyYW1QYXJhbWV0ZXIiLCJMSU5LX1NUQVRVUyIsInVzZVByb2dyYW0iLCJnZXRQcm9ncmFtSW5mb0xvZyIsImVuYWJsZVZlcnRleEF0dHJpYkFycmF5IiwidmVydGV4QXR0cmliUG9pbnRlciIsIm1peGVkIiwidW5pIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFB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QUFnQixJQUFoQixJQUF3QixLQUFLa2QsSUFBTCxDQUFVbGQsQ0FBVixJQUFlLENBQTFDLEVBQTRDO0FBQ3hDSiw0QkFBUTRmLElBQVIsQ0FBYSxzQ0FBc0NqRCxZQUFZdmMsQ0FBWixDQUF0QyxHQUF1RCxHQUFwRSxFQUF5RSxnQkFBekU7QUFDSDtBQUNKO0FBQ0QsaUJBQUlBLElBQUksQ0FBSixFQUFPOEosSUFBSTJTLFlBQVl2YyxNQUEzQixFQUFtQ0YsSUFBSThKLENBQXZDLEVBQTBDOUosR0FBMUMsRUFBOEM7QUFDMUMsb0JBQUcsS0FBS3FkLElBQUwsQ0FBVXJkLENBQVYsS0FBZ0IsSUFBaEIsSUFBd0IsS0FBS3FkLElBQUwsQ0FBVXJkLENBQVYsSUFBZSxDQUExQyxFQUE0QztBQUN4Q0osNEJBQVE0ZixJQUFSLENBQWEsb0NBQW9DL0MsWUFBWXpjLENBQVosQ0FBcEMsR0FBcUQsR0FBbEUsRUFBdUUsZ0JBQXZFO0FBQ0g7QUFDSjtBQUNKOzs7Ozs7QUFHTDRYLE9BQU8xQyxHQUFQLEdBQWEwQyxPQUFPMUMsR0FBUCxJQUFjLElBQUlBLEdBQUosRUFBM0IsQyIsImZpbGUiOiJnbGN1YmljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDVhNmU5Y2MyY2FjNzIwMjVhZmJkIiwiXHJcbi8qKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzdGVwIDE6IGxldCBhID0gbmV3IGdsM0F1ZGlvKGJnbUdhaW5WYWx1ZSwgc291bmRHYWluVmFsdWUpIDwtIGZsb2F0KDAuMCB0byAxLjApXHJcbiAqIHN0ZXAgMjogYS5sb2FkKHVybCwgaW5kZXgsIGxvb3AsIGJhY2tncm91bmQpIDwtIHN0cmluZywgaW50LCBib29sZWFuLCBib29sZWFuXHJcbiAqIHN0ZXAgMzogYS5zcmNbaW5kZXhdLmxvYWRlZCB0aGVuIGEuc3JjW2luZGV4XS5wbGF5KClcclxuICovXHJcblxyXG4vKipcclxuICogZ2wzQXVkaW9cclxuICogQGNsYXNzIGdsM0F1ZGlvXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNBdWRpbyB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJnbUdhaW5WYWx1ZSAtIEJHTSDjga7lho3nlJ/pn7Pph49cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzb3VuZEdhaW5WYWx1ZSAtIOWKueaenOmfs+OBruWGjeeUn+mfs+mHj1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihiZ21HYWluVmFsdWUsIHNvdW5kR2FpblZhbHVlKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqrjg7zjg4fjgqPjgqrjgrPjg7Pjg4bjgq3jgrnjg4hcclxuICAgICAgICAgKiBAdHlwZSB7QXVkaW9Db250ZXh0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY3R4ID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjg4rjg5/jg4Pjgq/jgrPjg7Pjg5fjg6zjg4PjgrXjg7zjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7RHluYW1pY3NDb21wcmVzc29yTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbXAgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJHTSDnlKjjga7jgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7R2Fpbk5vZGV9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5iZ21HYWluID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlirnmnpzpn7PnlKjjga7jgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7R2Fpbk5vZGV9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zb3VuZEdhaW4gPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCquODvOODh+OCo+OCquOCveODvOOCueOCkuODqeODg+ODl+OBl+OBn+OCr+ODqeOCueOBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48QXVkaW9TcmM+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc3JjID0gbnVsbDtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICB0eXBlb2Ygd2Via2l0QXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyB3ZWJraXRBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNvbXAgPSB0aGlzLmN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmJnbUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKGJnbUdhaW5WYWx1ZSwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoc291bmRHYWluVmFsdWUsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNyYyA9IFtdO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBmb3VuZCBBdWRpb0NvbnRleHQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5XjgqHjgqTjg6vjgpLjg63jg7zjg4njgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0g44Kq44O844OH44Kj44Kq44OV44Kh44Kk44Or44Gu44OR44K5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSDlhoXpg6jjg5fjg63jg5Hjg4bjgqPjga7phY3liJfjgavmoLzntI3jgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9vcCAtIOODq+ODvOODl+WGjeeUn+OCkuioreWumuOBmeOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBiYWNrZ3JvdW5kIC0gQkdNIOOBqOOBl+OBpuioreWumuOBmeOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSDoqq3jgb/ovrzjgb/jgajliJ3mnJ/ljJbjgYzlrozkuobjgZfjgZ/jgYLjgajlkbzjgbDjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAqL1xyXG4gICAgbG9hZChwYXRoLCBpbmRleCwgbG9vcCwgYmFja2dyb3VuZCwgY2FsbGJhY2spe1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZ2FpbiA9IGJhY2tncm91bmQgPyB0aGlzLmJnbUdhaW4gOiB0aGlzLnNvdW5kR2FpbjtcclxuICAgICAgICBsZXQgc3JjID0gdGhpcy5zcmM7XHJcbiAgICAgICAgc3JjW2luZGV4XSA9IG51bGw7XHJcbiAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhtbC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgICAgICB4bWwub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjdHguZGVjb2RlQXVkaW9EYXRhKHhtbC5yZXNwb25zZSwgKGJ1ZikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3JjW2luZGV4XSA9IG5ldyBBdWRpb1NyYyhjdHgsIGdhaW4sIGJ1ZiwgbG9vcCwgYmFja2dyb3VuZCk7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBhdWRpbyBudW1iZXI6ICVjJyArIGluZGV4ICsgJyVjLCBhdWRpbyBsb2FkZWQ6ICVjJyArIHBhdGgsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0sIChlKSA9PiB7Y29uc29sZS5sb2coZSk7fSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4bWwuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844OJ44Gu5a6M5LqG44KS44OB44Kn44OD44Kv44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjg63jg7zjg4njgYzlrozkuobjgZfjgabjgYTjgovjgYvjganjgYbjgYtcclxuICAgICAqL1xyXG4gICAgbG9hZENvbXBsZXRlKCl7XHJcbiAgICAgICAgbGV0IGksIGY7XHJcbiAgICAgICAgZiA9IHRydWU7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5zcmMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBmID0gZiAmJiAodGhpcy5zcmNbaV0gIT0gbnVsbCkgJiYgdGhpcy5zcmNbaV0ubG9hZGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOOCquODvOODh+OCo+OCquOChOOCveODvOOCueODleOCoeOCpOODq+OCkueuoeeQhuOBmeOCi+OBn+OCgeOBruOCr+ODqeOCuVxyXG4gKiBAY2xhc3MgQXVkaW9TcmNcclxuICovXHJcbmNsYXNzIEF1ZGlvU3JjIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY3R4IC0g5a++6LGh44Go44Gq44KL44Kq44O844OH44Kj44Kq44Kz44Oz44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge0dhaW5Ob2RlfSBnYWluIC0g5a++6LGh44Go44Gq44KL44Ky44Kk44Oz44OO44O844OJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhdWRpb0J1ZmZlciAtIOODkOOCpOODiuODquOBruOCquODvOODh+OCo+OCquOCveODvOOCuVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBib29sIC0g44Or44O844OX5YaN55Sf44KS6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJhY2tncm91bmQgLSBCR00g44Go44GX44Gm6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGN0eCwgZ2FpbiwgYXVkaW9CdWZmZXIsIGxvb3AsIGJhY2tncm91bmQpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWvvuixoeOBqOOBquOCi+OCquODvOODh+OCo+OCquOCs+ODs+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a++6LGh44Go44Gq44KL44Ky44Kk44Oz44OO44O844OJXHJcbiAgICAgICAgICogQHR5cGUge0dhaW5Ob2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2FpbiA9IGdhaW47XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K944O844K544OV44Kh44Kk44Or44Gu44OQ44Kk44OK44Oq44OH44O844K/XHJcbiAgICAgICAgICogQHR5cGUge0FycmF5QnVmZmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXVkaW9CdWZmZXIgPSBhdWRpb0J1ZmZlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqrjg7zjg4fjgqPjgqrjg5Djg4Pjg5XjgqHjgr3jg7zjgrnjg47jg7zjg4njgpLmoLzntI3jgZnjgovphY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPEF1ZGlvQnVmZmVyU291cmNlTm9kZT59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2UgPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjgq/jg4bjgqPjg5bjgarjg5Djg4Pjg5XjgqHjgr3jg7zjgrnjga7jgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQnVmZmVyU291cmNlID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6vjg7zjg5fjgZnjgovjgYvjganjgYbjgYvjga7jg5Xjg6njgrBcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxvb3AgPSBsb29wO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODreODvOODiea4iOOBv+OBi+OBqeOBhuOBi+OCkuekuuOBmeODleODqeOCsFxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRkZUIOOCteOCpOOCulxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5mZnRMb29wID0gMTY7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44GT44Gu44OV44Op44Kw44GM56uL44Gj44Gm44GE44KL5aC05ZCI5YaN55Sf5Lit44Gu44OH44O844K/44KS5LiA5bqm5Y+W5b6X44GZ44KLXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCR00g44GL44Gp44GG44GL44KS56S644GZ44OV44Op44KwXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg6rjg5fjg4jjg5fjg63jgrvjg4PjgrXjg7zjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7U2NyaXB0UHJvY2Vzc29yTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMjA0OCwgMSwgMSk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ki44OK44Op44Kk44K244OO44O844OJXHJcbiAgICAgICAgICogQHR5cGUge0FuYWx5c2VyTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFuYWx5c2VyID0gdGhpcy5jdHguY3JlYXRlQW5hbHlzZXIoKTtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuODtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgPSB0aGlzLmZmdExvb3AgKiAyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODh+ODvOOCv+OCkuWPluW+l+OBmeOCi+mam+OBq+WIqeeUqOOBmeOCi+Wei+S7mOOBjemFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtVaW50OEFycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMub25EYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5hbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqrjg7zjg4fjgqPjgqrjgpLlho3nlJ/jgZnjgotcclxuICAgICAqL1xyXG4gICAgcGxheSgpe1xyXG4gICAgICAgIGxldCBpLCBqLCBrO1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICBpID0gdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoO1xyXG4gICAgICAgIGsgPSAtMTtcclxuICAgICAgICBpZihpID4gMCl7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGk7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5idWZmZXJTb3VyY2Vbal0ucGxheW5vdyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vbal0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2pdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGo7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoayA8IDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2VbdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICAgICAgayA9IHRoaXMuYnVmZmVyU291cmNlLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2VbMF0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgayA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWN0aXZlQnVmZmVyU291cmNlID0gaztcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5idWZmZXIgPSB0aGlzLmF1ZGlvQnVmZmVyO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmxvb3AgPSB0aGlzLmxvb3A7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ucGxheWJhY2tSYXRlLnZhbHVlID0gMS4wO1xyXG4gICAgICAgIGlmKCF0aGlzLmxvb3Ape1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5vbmVuZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5bm93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuYmFja2dyb3VuZCl7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmNvbm5lY3QodGhpcy5hbmFseXNlcik7XHJcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZXIuY29ubmVjdCh0aGlzLm5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbmF1ZGlvcHJvY2VzcyA9IChldmUpID0+IHtvbnByb2Nlc3NFdmVudChldmUpO307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmNvbm5lY3QodGhpcy5nYWluKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5zdGFydCgwKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5wbGF5bm93ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25wcm9jZXNzRXZlbnQoZXZlKXtcclxuICAgICAgICAgICAgaWYoc2VsZi51cGRhdGUpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNlbGYuYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoc2VsZi5vbkRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kq44O844OH44Kj44Kq44Gu5YaN55Sf44KS5q2i44KB44KLXHJcbiAgICAgKi9cclxuICAgIHN0b3AoKXtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmFjdGl2ZUJ1ZmZlclNvdXJjZV0uc3RvcCgwKTtcclxuICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzQXVkaW8uanMiLCJcclxuLyoqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGxldCB3cmFwcGVyID0gbmV3IGdsMy5HdWkuV3JhcHBlcigpO1xyXG4gKiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIuZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IHNsaWRlciA9IG5ldyBnbDMuR3VpLlNsaWRlcigndGVzdCcsIDUwLCAwLCAxMDAsIDEpO1xyXG4gKiBzbGlkZXIuYWRkKCdpbnB1dCcsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChzbGlkZXIuZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IGNoZWNrID0gbmV3IGdsMy5HdWkuQ2hlY2tib3goJ2hvZ2UnLCBmYWxzZSk7XHJcbiAqIGNoZWNrLmFkZCgnY2hhbmdlJywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKGNoZWNrLmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCByYWRpbyA9IG5ldyBnbDMuR3VpLlJhZGlvKCdob2dlJywgbnVsbCwgZmFsc2UpO1xyXG4gKiByYWRpby5hZGQoJ2NoYW5nZScsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChyYWRpby5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgc2VsZWN0ID0gbmV3IGdsMy5HdWkuU2VsZWN0KCdmdWdhJywgWydmb28nLCAnYmFhJ10sIDApO1xyXG4gKiBzZWxlY3QuYWRkKCdjaGFuZ2UnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpKTt9KTtcclxuICogd3JhcHBlci5hcHBlbmQoc2VsZWN0LmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCBzcGluID0gbmV3IGdsMy5HdWkuU3BpbignaG9nZScsIDAuMCwgLTEuMCwgMS4wLCAwLjEpO1xyXG4gKiBzcGluLmFkZCgnaW5wdXQnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpKTt9KTtcclxuICogd3JhcHBlci5hcHBlbmQoc3Bpbi5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgY29sb3IgPSBuZXcgZ2wzLkd1aS5Db2xvcignZnVnYScsICcjZmYwMDAwJyk7XHJcbiAqIGNvbG9yLmFkZCgnY2hhbmdlJywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSwgc2VsZi5nZXRGbG9hdFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChjb2xvci5nZXRFbGVtZW50KCkpO1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBnbDNHdWlcclxuICogQGNsYXNzIGdsM0d1aVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzR3VpIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJV3JhcHBlclxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlXcmFwcGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuV3JhcHBlciA9IEdVSVdyYXBwZXI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJRWxlbWVudFxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuRWxlbWVudCA9IEdVSUVsZW1lbnQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJU2xpZGVyXHJcbiAgICAgICAgICogQHR5cGUge0dVSVNsaWRlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlNsaWRlciA9IEdVSVNsaWRlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlDaGVja2JveFxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlDaGVja2JveH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLkNoZWNrYm94ID0gR1VJQ2hlY2tib3g7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJUmFkaW9cclxuICAgICAgICAgKiBAdHlwZSB7R1VJUmFkaW99XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5SYWRpbyA9IEdVSVJhZGlvO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSVNlbGVjdFxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlTZWxlY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5TZWxlY3QgPSBHVUlTZWxlY3Q7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJU3BpblxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlTcGlufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuU3BpbiA9IEdVSVNwaW47XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJQ29sb3JcclxuICAgICAgICAgKiBAdHlwZSB7R1VJQ29sb3J9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5Db2xvciA9IEdVSUNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJV3JhcHBlclxyXG4gKiBAY2xhc3MgR1VJV3JhcHBlclxyXG4gKi9cclxuY2xhc3MgR1VJV3JhcHBlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSSDlhajkvZPjgpLljIXjgoDjg6njg4Pjg5Hjg7wgRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9ICczNDBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdyaWdodCAwLjhzIGN1YmljLWJlemllcigwLCAwLCAwLCAxLjApJztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUkg44OR44O844OE44KS5YyF44KA44Op44OD44OR44O8IERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoNjQsIDY0LCA2NCwgMC41KSc7XHJcbiAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJIOaKmOOCiuOBn+OBn+OBv+ODiOOCsOODq1xyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLmNsYXNzTmFtZSA9ICd2aXNpYmxlJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS50ZXh0Q29udGVudCA9ICfilrYnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmZvbnRTaXplID0gJzE4cHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmxpbmVIZWlnaHQgPSAnMzJweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuY29sb3IgPSAncmdiYSgyNDAsIDI0MCwgMjQwLCAwLjUpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgzMiwgMzIsIDMyLCAwLjUpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIHJnYmEoMjQwLCAyNDAsIDI0MCwgMC4yKSc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzI1cHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmJveFNoYWRvdyA9ICcwcHggMHB4IDJweCAycHggcmdiYSg4LCA4LCA4LCAwLjgpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudG9wID0gJzIwcHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnJpZ2h0ID0gJzM2MHB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS53aWR0aCA9ICczMnB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5oZWlnaHQgPSAnMzJweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoMGRlZyknO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIDAuNXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAsIDEuMCknO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50b2dnbGUpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGUuY2xhc3NMaXN0LnRvZ2dsZSgndmlzaWJsZScpO1xyXG4gICAgICAgICAgICBpZih0aGlzLnRvZ2dsZS5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoMGRlZyknO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yaWdodCA9ICctMzQwcHgnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgtMTgwZGVnKSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Os44Oh44Oz44OI44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgZ2V0RWxlbWVudCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWtkOimgee0oOOCkuOCouODmuODs+ODieOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIOOCouODmuODs+ODieOBmeOCi+imgee0oFxyXG4gICAgICovXHJcbiAgICBhcHBlbmQoZWxlbWVudCl7XHJcbiAgICAgICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJRWxlbWVudFxyXG4gKiBAY2xhc3MgR1VJRWxlbWVudFxyXG4gKi9cclxuY2xhc3MgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODrOODoeODs+ODiOODqeODg+ODkeODvCBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gJ3NtYWxsJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gJzMyMHB4JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzMwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gJzMwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gJ3Jvdyc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2ZsZXgtc3RhcnQnO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODqeODmeODq+eUqOOCqOODrOODoeODs+ODiCBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTFNwYW5FbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgdGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5jb2xvciA9ICcjMjIyJztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLnRleHRTaGFkb3cgPSAnMHB4IDBweCA1cHggd2hpdGUnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUubWFyZ2luID0gJ2F1dG8gNXB4JztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLndpZHRoID0gJzEwMHB4JztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWApOihqOekuueUqCBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTFNwYW5FbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjI1KSc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS5jb2xvciA9ICd3aGl0ZXNtb2tlJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmZvbnRTaXplID0gJ3gtc21hbGwnO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUudGV4dFNoYWRvdyA9ICcwcHggMHB4IDVweCBibGFjayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS5tYXJnaW4gPSAnYXV0byA1cHgnO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUud2lkdGggPSAnNTBweCc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6sgRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Op44OZ44Or44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCpOODmeODs+ODiOODquOCueODilxyXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kk44OZ44Oz44OI44Oq44K544OK44KS55m76Yyy44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIOOCpOODmeODs+ODiOOCv+OCpOODl1xyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAtIOeZu+mMsuOBmeOCi+mWouaVsFxyXG4gICAgICovXHJcbiAgICBhZGQodHlwZSwgZnVuYyl7XHJcbiAgICAgICAgaWYodGhpcy5jb250cm9sID09IG51bGwgfHwgdHlwZSA9PSBudWxsIHx8IGZ1bmMgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodHlwZSkgIT09ICdbb2JqZWN0IFN0cmluZ10nKXtyZXR1cm47fVxyXG4gICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmdW5jKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJyl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IGZ1bmM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCpOODmeODs+ODiOOCkueZuueBq+OBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSDnmbrngavjgZnjgovjgqTjg5njg7Pjg4jjgr/jgqTjg5dcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZSAtIEV2ZW50IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBlbWl0KHR5cGUsIGV2ZSl7XHJcbiAgICAgICAgaWYodGhpcy5jb250cm9sID09IG51bGwgfHwgIXRoaXMubGlzdGVuZXJzLmhhc093blByb3BlcnR5KHR5cGUpKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdKGV2ZSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCpOODmeODs+ODiOODquOCueODiuOCkueZu+mMsuino+mZpOOBmeOCi1xyXG4gICAgICovXHJcbiAgICByZW1vdmUoKXtcclxuICAgICAgICBpZih0aGlzLmNvbnRyb2wgPT0gbnVsbCB8fCAhdGhpcy5saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkodHlwZSkpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBudWxsO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1t0eXBlXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Op44OZ44Or44OG44Kt44K544OI44Go44Kz44Oz44OI44Ot44O844Or44Gu5YCk44KS5pu05paw44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge21peGVkfSB2YWx1ZSAtIOioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy52YWx1ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZXjgozjgabjgYTjgovlgKTjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge21peGVkfSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZXjgozjgabjgYTjgovlgKRcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBnZXRDb250cm9sKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Op44OZ44Or44Gr6Kit5a6a44GV44KM44Gm44GE44KL44OG44Kt44K544OI44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IOODqeODmeODq+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+WApFxyXG4gICAgICovXHJcbiAgICBnZXRUZXh0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Os44Oh44Oz44OI44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgZ2V0RWxlbWVudCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlTbGlkZXJcclxuICogQGNsYXNzIEdVSVNsaWRlclxyXG4gKi9cclxuY2xhc3MgR1VJU2xpZGVyIGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt2YWx1ZT0wXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttaW49MF0gLSDjgrnjg6njgqTjg4Djg7zjga7mnIDlsI/lgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWF4PTEwMF0gLSDjgrnjg6njgqTjg4Djg7zjga7mnIDlpKflgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSAtIOOCueODqeOCpOODgOODvOOBruOCueODhuODg+ODl+aVsFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIHZhbHVlID0gMCwgbWluID0gMCwgbWF4ID0gMTAwLCBzdGVwID0gMSl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3JhbmdlJyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWluJywgbWluKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtYXgnLCBtYXgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBzdGVwKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnaW5wdXQnLCBldmUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC52YWx1ZSk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg6njgqTjg4Djg7zjga7mnIDlsI/lgKTjgpLjgrvjg4Pjg4jjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSDmnIDlsI/lgKTjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0TWluKG1pbil7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWluJywgbWluKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544Op44Kk44OA44O844Gu5pyA5aSn5YCk44KS44K744OD44OI44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IC0g5pyA5aSn5YCk44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldE1heChtYXgpe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21heCcsIG1heCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODqeOCpOODgOODvOOBruOCueODhuODg+ODl+aVsOOCkuOCu+ODg+ODiOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZXAgLSDjgrnjg4bjg4Pjg5fmlbDjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0U3RlcChzdGVwKXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdzdGVwJywgc3RlcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlDaGVja2JveFxyXG4gKiBAY2xhc3MgR1VJQ2hlY2tib3hcclxuICovXHJcbmNsYXNzIEdVSUNoZWNrYm94IGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY2hlY2tlZD1mYWxzZV0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCBjaGVja2VkID0gZmFsc2Upe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5jaGVja2VkID0gY2hlY2tlZDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLmNoZWNrZWQpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgZXZlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wuY2hlY2tlZCk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgavlgKTjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tlZCAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRWYWx1ZShjaGVja2VkKXtcclxuICAgICAgICB0aGlzLnZhbHVlLnRleHRDb250ZW50ID0gY2hlY2tlZDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuY2hlY2tlZCA9IGNoZWNrZWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBruWApOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0g44Kz44Oz44OI44Ot44O844Or44Gu5YCkXHJcbiAgICAgKi9cclxuICAgIGdldFZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbC5jaGVja2VkO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJUmFkaW9cclxuICogQGNsYXNzIEdVSVJhZGlvXHJcbiAqL1xyXG5jbGFzcyBHVUlSYWRpbyBleHRlbmRzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZT0nZ2wzcmFkaW8nXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+WQjeWJjVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY2hlY2tlZD1mYWxzZV0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCBuYW1lID0gJ2dsM3JhZGlvJywgY2hlY2tlZCA9IGZhbHNlKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAncmFkaW8nKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCduYW1lJywgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmNoZWNrZWQgPSBjaGVja2VkO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wuY2hlY2tlZCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBldmUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC5jaGVja2VkKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBq+WApOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKGNoZWNrZWQpe1xyXG4gICAgICAgIHRoaXMudmFsdWUudGV4dENvbnRlbnQgPSAnLS0tJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuY2hlY2tlZCA9IGNoZWNrZWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBruWApOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0g44Kz44Oz44OI44Ot44O844Or44Gu5YCkXHJcbiAgICAgKi9cclxuICAgIGdldFZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbC5jaGVja2VkO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJU2VsZWN0XHJcbiAqIEBjbGFzcyBHVUlTZWxlY3RcclxuICovXHJcbmNsYXNzIEdVSVNlbGVjdCBleHRlbmRzIEdVSUVsZW1lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdGV4dD0nJ10gLSDjgqjjg6zjg6Hjg7Pjg4jjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IFtsaXN0PVtdXSAtIOODquOCueODiOOBq+eZu+mMsuOBmeOCi+OCouOCpOODhuODoOOCkuaMh+WumuOBmeOCi+aWh+Wtl+WIl+OBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzZWxlY3RlZEluZGV4PTBdIC0g44Kz44Oz44OI44Ot44O844Or44Gn6YG45oqe44GZ44KL44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgbGlzdCA9IFtdLCBzZWxlY3RlZEluZGV4ID0gMCl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxTZWxlY3RFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xyXG4gICAgICAgIGxpc3QubWFwKCh2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBvcHQgPSBuZXcgT3B0aW9uKHYsIHYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuYWRkKG9wdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNlbGVjdGVkSW5kZXggPSBzZWxlY3RlZEluZGV4O1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS53aWR0aCA9ICcxMzBweCc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUudmVydGljYWxBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC52YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBldmUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC52YWx1ZSk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgafpgbjmip7jgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLmjIflrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIOaMh+WumuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzZXRTZWxlY3RlZEluZGV4KGluZGV4KXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgYznj77lnKjpgbjmip7jgZfjgabjgYTjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g54++5Zyo6YG45oqe44GX44Gm44GE44KL44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIGdldFNlbGVjdGVkSW5kZXgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sLnNlbGVjdGVkSW5kZXg7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlTcGluXHJcbiAqIEBjbGFzcyBHVUlTcGluXHJcbiAqL1xyXG5jbGFzcyBHVUlTcGluIGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt2YWx1ZT0wLjBdIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21pbj0tMS4wXSAtIOOCueODlOODs+OBmeOCi+mam+OBruacgOWwj+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttYXg9MS4wXSAtIOOCueODlOODs+OBmeOCi+mam+OBruacgOWkp+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzdGVwPTAuMV0gLSDjgrnjg5Tjg7PjgZnjgovjgrnjg4bjg4Pjg5fmlbBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCB2YWx1ZSA9IDAuMCwgbWluID0gLTEuMCwgbWF4ID0gMS4wLCBzdGVwID0gMC4xKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWluJywgbWluKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtYXgnLCBtYXgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBzdGVwKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnaW5wdXQnLCBldmUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC52YWx1ZSk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg5Tjg7Pjga7mnIDlsI/lgKTjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSDoqK3lrprjgZnjgovmnIDlsI/lgKRcclxuICAgICAqL1xyXG4gICAgc2V0TWluKG1pbil7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWluJywgbWluKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544OU44Oz44Gu5pyA5aSn5YCk44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IC0g6Kit5a6a44GZ44KL5pyA5aSn5YCkXHJcbiAgICAgKi9cclxuICAgIHNldE1heChtYXgpe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21heCcsIG1heCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODlOODs+OBruOCueODhuODg+ODl+aVsOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZXAgLSDoqK3lrprjgZnjgovjgrnjg4bjg4Pjg5fmlbBcclxuICAgICAqL1xyXG4gICAgc2V0U3RlcChzdGVwKXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdzdGVwJywgc3RlcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlDb2xvclxyXG4gKiBAY2xhc3MgR1VJQ29sb3JcclxuICovXHJcbmNsYXNzIEdVSUNvbG9yIGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZT0nIzAwMDAwMCddIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgdmFsdWUgPSAnIzAwMDAwMCcpe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCkuWMheOCgOOCs+ODs+ODhuODiuOCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxpbmVIZWlnaHQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubWFyZ2luID0gJzJweCBhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxMDBweCc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5L2Z55m95YW86YG45oqe44Kr44Op44O86KGo56S644Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUud2lkdGggPSAnY2FsYygxMDAlIC0gMnB4KSc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5oZWlnaHQgPSAnMjRweCc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIHdoaXRlc21va2UnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUuYm94U2hhZG93ID0gJzBweCAwcHggMHB4IDFweCAjMjIyJztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4jjga7lvbnlibLjgpLmi4XjgYYgY2FudmFzXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxDYW52YXNFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnMHB4JztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wud2lkdGggPSAxMDA7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmhlaWdodCA9IDEwMDtcclxuXHJcbiAgICAgICAgLy8gYXBwZW5kXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vnlKggY2FudmFzIOOBriAyZCDjgrPjg7Pjg4bjgq3jgrnjg4hcclxuICAgICAgICAgKiBAdHlwZSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jb250cm9sLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgbGV0IGdyYWQgPSB0aGlzLmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCB0aGlzLmNvbnRyb2wud2lkdGgsIDApO1xyXG4gICAgICAgIGxldCBhcnIgPSBbJyNmZjAwMDAnLCAnI2ZmZmYwMCcsICcjMDBmZjAwJywgJyMwMGZmZmYnLCAnIzAwMDBmZicsICcjZmYwMGZmJywgJyNmZjAwMDAnXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwLCBqID0gYXJyLmxlbmd0aDsgaSA8IGo7ICsraSl7XHJcbiAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKGkgLyAoaiAtIDEpLCBhcnJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY29udHJvbC53aWR0aCwgdGhpcy5jb250cm9sLmhlaWdodCk7XHJcbiAgICAgICAgZ3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuY29udHJvbC5oZWlnaHQpO1xyXG4gICAgICAgIGFyciA9IFsncmdiYSgyNTUsIDI1NSwgMjU1LCAxLjApJywgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4wKScsICdyZ2JhKDAsIDAsIDAsIDAuMCknLCAncmdiYSgwLCAwLCAwLCAxLjApJ107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IGFyci5sZW5ndGg7IGkgPCBqOyArK2kpe1xyXG4gICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcChpIC8gKGogLSAxKSwgYXJyW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gZ3JhZDtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNvbnRyb2wud2lkdGgsIHRoaXMuY29udHJvbC5oZWlnaHQpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDoh6rouqvjgavoqK3lrprjgZXjgozjgabjgYTjgovoibLjgpLooajjgZnmloflrZfliJfjga7lgKRcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29sb3JWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCr+ODquODg+OCr+aZguOBq+OBruOBvyBjb2xvclZhbHVlIOOCkuabtOaWsOOBmeOCi+OBn+OCgeOBruS4gOaZguOCreODo+ODg+OCt+ODpeWkieaVsFxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZW1wQ29sb3JWYWx1ZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBDb2xvclZhbHVlID0gdGhpcy5jb2xvclZhbHVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgaWYodGhpcy50ZW1wQ29sb3JWYWx1ZSAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy50ZW1wQ29sb3JWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBDb2xvclZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoZXZlLm9mZnNldFgsIGV2ZS5vZmZzZXRZLCAxLCAxKTtcclxuICAgICAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5nZXRDb2xvcjhiaXRTdHJpbmcoaW1hZ2VEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKGNvbG9yKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKGV2ZS5vZmZzZXRYLCBldmUub2Zmc2V0WSwgMSwgMSk7XHJcbiAgICAgICAgICAgIGV2ZS5jdXJyZW50VGFyZ2V0LnZhbHVlID0gdGhpcy5nZXRDb2xvcjhiaXRTdHJpbmcoaW1hZ2VEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBDb2xvclZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgZXZlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiHqui6q+OBruODl+ODreODkeODhuOCo+OBq+iJsuOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gQ1NTIOiJsuihqOePvuOBruOBhuOBoSAxNiDpgLLmlbDooajoqJjjga7jgoLjga5cclxuICAgICAqL1xyXG4gICAgc2V0VmFsdWUodmFsdWUpe1xyXG4gICAgICAgIHRoaXMudmFsdWUudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNvbG9yVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yVmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiHqui6q+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+iJsuOCkuihqOOBmeaWh+Wtl+WIl+OCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAxNiDpgLLmlbDooajoqJjjga7oibLjgpLooajjgZnmloflrZfliJdcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xvclZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rouqvjgavoqK3lrprjgZXjgozjgabjgYTjgovoibLjgpLooajjgZnmloflrZfliJfjgpIgMC4wIOOBi+OCiSAxLjAg44Gu5YCk44Gr5aSJ5o+b44GX6YWN5YiX44Gn6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0g5rWu5YuV5bCP5pWw44Gn6KGo54++44GX44Gf6Imy44Gu5YCk44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIGdldEZsb2F0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb2xvckZsb2F0QXJyYXkodGhpcy5jb2xvclZhbHVlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY2FudmFzLmltYWdlRGF0YSDjgYvjgonlj5blvpfjgZnjgovmlbDlgKTjga7phY3liJfjgpLlhYPjgasgMTYg6YCy5pWw6KGo6KiY5paH5a2X5YiX44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOacgOS9juOBp+OCgiAzIOOBpOOBruimgee0oOOCkuaMgeOBpOaVsOWApOOBrumFjeWIl1xyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAxNiDpgLLmlbDooajoqJjjga7oibLjga7lgKTjga7mloflrZfliJdcclxuICAgICAqL1xyXG4gICAgZ2V0Q29sb3I4Yml0U3RyaW5nKGNvbG9yKXtcclxuICAgICAgICBsZXQgciA9IHRoaXMuemVyb1BhZGRpbmcoY29sb3JbMF0udG9TdHJpbmcoMTYpLCAyKTtcclxuICAgICAgICBsZXQgZyA9IHRoaXMuemVyb1BhZGRpbmcoY29sb3JbMV0udG9TdHJpbmcoMTYpLCAyKTtcclxuICAgICAgICBsZXQgYiA9IHRoaXMuemVyb1BhZGRpbmcoY29sb3JbMl0udG9TdHJpbmcoMTYpLCAyKTtcclxuICAgICAgICByZXR1cm4gJyMnICsgciArIGcgKyBiO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAxNiDpgLLmlbDooajoqJjjga7oibLooajnj77mloflrZfliJfjgpLlhYPjgasgMC4wIOOBi+OCiSAxLjAg44Gu5YCk44Gr5aSJ5o+b44GX44Gf6YWN5YiX44KS55Sf5oiQ44GX6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSAxNiDpgLLmlbDooajoqJjjga7oibLjga7lgKTjga7mloflrZfliJdcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSBSR0Ig44GuIDMg44Gk44Gu5YCk44KSIDAuMCDjgYvjgokgMS4wIOOBq+WkieaPm+OBl+OBn+WApOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBnZXRDb2xvckZsb2F0QXJyYXkoY29sb3Ipe1xyXG4gICAgICAgIGlmKGNvbG9yID09IG51bGwgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGNvbG9yKSAhPT0gJ1tvYmplY3QgU3RyaW5nXScpe3JldHVybiBudWxsO31cclxuICAgICAgICBpZihjb2xvci5zZWFyY2goL14jK1tcXGR8YS1mfEEtRl0rJC8pID09PSAtMSl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBzID0gY29sb3IucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICBpZihzLmxlbmd0aCAhPT0gMyAmJiBzLmxlbmd0aCAhPT0gNil7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCB0ID0gcy5sZW5ndGggLyAzO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGNvbG9yLnN1YnN0cigxLCB0KSwgMTYpIC8gMjU1LFxyXG4gICAgICAgICAgICBwYXJzZUludChjb2xvci5zdWJzdHIoMSArIHQsIHQpLCAxNikgLyAyNTUsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGNvbG9yLnN1YnN0cigxICsgdCAqIDIsIHQpLCAxNikgLyAyNTVcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmlbDlgKTjgpLmjIflrprjgZXjgozjgZ/moYHmlbDjgavmlbTlvaLjgZfjgZ/mloflrZfliJfjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSDmlbTlvaLjgZfjgZ/jgYTmlbDlgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIOaVtOW9ouOBmeOCi+ahgeaVsFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAxNiDpgLLmlbDooajoqJjjga7oibLjga7lgKTjga7mloflrZfliJdcclxuICAgICAqL1xyXG4gICAgemVyb1BhZGRpbmcobnVtYmVyLCBjb3VudCl7XHJcbiAgICAgICAgbGV0IGEgPSBuZXcgQXJyYXkoY291bnQpLmpvaW4oJzAnKTtcclxuICAgICAgICByZXR1cm4gKGEgKyBudW1iZXIpLnNsaWNlKC1jb3VudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM0d1aS5qcyIsIlxyXG4vKipcclxuICogZ2wzTWF0aFxyXG4gKiBAY2xhc3MgZ2wzTWF0aFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzTWF0aCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hdDRcclxuICAgICAgICAgKiBAdHlwZSB7TWF0NH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLk1hdDQgPSBNYXQ0O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFZlYzNcclxuICAgICAgICAgKiBAdHlwZSB7VmVjM31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlZlYzMgPSBWZWMzO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFZlYzJcclxuICAgICAgICAgKiBAdHlwZSB7VmVjMn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlZlYzIgPSBWZWMyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFF0blxyXG4gICAgICAgICAqIEB0eXBlIHtRdG59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5RdG4gID0gUXRuO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogTWF0NFxyXG4gKiBAY2xhc3MgTWF0NFxyXG4gKi9cclxuY2xhc3MgTWF0NCB7XHJcbiAgICAvKipcclxuICAgICAqIDR4NCDjga7mraPmlrnooYzliJfjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g6KGM5YiX5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OCkuWNmOS9jeWMluOBmeOCi++8iOWPgueFp+OBq+azqOaEj++8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBkZXN0IC0g5Y2Y5L2N5YyW44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDljZjkvY3ljJbjgZfjgZ/ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlkZW50aXR5KGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gID0gMTsgZGVzdFsxXSAgPSAwOyBkZXN0WzJdICA9IDA7IGRlc3RbM10gID0gMDtcclxuICAgICAgICBkZXN0WzRdICA9IDA7IGRlc3RbNV0gID0gMTsgZGVzdFs2XSAgPSAwOyBkZXN0WzddICA9IDA7XHJcbiAgICAgICAgZGVzdFs4XSAgPSAwOyBkZXN0WzldICA9IDA7IGRlc3RbMTBdID0gMTsgZGVzdFsxMV0gPSAwO1xyXG4gICAgICAgIGRlc3RbMTJdID0gMDsgZGVzdFsxM10gPSAwOyBkZXN0WzE0XSA9IDA7IGRlc3RbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44KS5LmX566X44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdDAgLSDkuZfnrpfjgZXjgozjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0MSAtIOS5l+eul+OBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDkuZfnrpfntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOS5l+eul+e1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0MCwgbWF0MSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCBhID0gbWF0MFswXSwgIGIgPSBtYXQwWzFdLCAgYyA9IG1hdDBbMl0sICBkID0gbWF0MFszXSxcclxuICAgICAgICAgICAgZSA9IG1hdDBbNF0sICBmID0gbWF0MFs1XSwgIGcgPSBtYXQwWzZdLCAgaCA9IG1hdDBbN10sXHJcbiAgICAgICAgICAgIGkgPSBtYXQwWzhdLCAgaiA9IG1hdDBbOV0sICBrID0gbWF0MFsxMF0sIGwgPSBtYXQwWzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdDBbMTJdLCBuID0gbWF0MFsxM10sIG8gPSBtYXQwWzE0XSwgcCA9IG1hdDBbMTVdLFxyXG4gICAgICAgICAgICBBID0gbWF0MVswXSwgIEIgPSBtYXQxWzFdLCAgQyA9IG1hdDFbMl0sICBEID0gbWF0MVszXSxcclxuICAgICAgICAgICAgRSA9IG1hdDFbNF0sICBGID0gbWF0MVs1XSwgIEcgPSBtYXQxWzZdLCAgSCA9IG1hdDFbN10sXHJcbiAgICAgICAgICAgIEkgPSBtYXQxWzhdLCAgSiA9IG1hdDFbOV0sICBLID0gbWF0MVsxMF0sIEwgPSBtYXQxWzExXSxcclxuICAgICAgICAgICAgTSA9IG1hdDFbMTJdLCBOID0gbWF0MVsxM10sIE8gPSBtYXQxWzE0XSwgUCA9IG1hdDFbMTVdO1xyXG4gICAgICAgIG91dFswXSAgPSBBICogYSArIEIgKiBlICsgQyAqIGkgKyBEICogbTtcclxuICAgICAgICBvdXRbMV0gID0gQSAqIGIgKyBCICogZiArIEMgKiBqICsgRCAqIG47XHJcbiAgICAgICAgb3V0WzJdICA9IEEgKiBjICsgQiAqIGcgKyBDICogayArIEQgKiBvO1xyXG4gICAgICAgIG91dFszXSAgPSBBICogZCArIEIgKiBoICsgQyAqIGwgKyBEICogcDtcclxuICAgICAgICBvdXRbNF0gID0gRSAqIGEgKyBGICogZSArIEcgKiBpICsgSCAqIG07XHJcbiAgICAgICAgb3V0WzVdICA9IEUgKiBiICsgRiAqIGYgKyBHICogaiArIEggKiBuO1xyXG4gICAgICAgIG91dFs2XSAgPSBFICogYyArIEYgKiBnICsgRyAqIGsgKyBIICogbztcclxuICAgICAgICBvdXRbN10gID0gRSAqIGQgKyBGICogaCArIEcgKiBsICsgSCAqIHA7XHJcbiAgICAgICAgb3V0WzhdICA9IEkgKiBhICsgSiAqIGUgKyBLICogaSArIEwgKiBtO1xyXG4gICAgICAgIG91dFs5XSAgPSBJICogYiArIEogKiBmICsgSyAqIGogKyBMICogbjtcclxuICAgICAgICBvdXRbMTBdID0gSSAqIGMgKyBKICogZyArIEsgKiBrICsgTCAqIG87XHJcbiAgICAgICAgb3V0WzExXSA9IEkgKiBkICsgSiAqIGggKyBLICogbCArIEwgKiBwO1xyXG4gICAgICAgIG91dFsxMl0gPSBNICogYSArIE4gKiBlICsgTyAqIGkgKyBQICogbTtcclxuICAgICAgICBvdXRbMTNdID0gTSAqIGIgKyBOICogZiArIE8gKiBqICsgUCAqIG47XHJcbiAgICAgICAgb3V0WzE0XSA9IE0gKiBjICsgTiAqIGcgKyBPICogayArIFAgKiBvO1xyXG4gICAgICAgIG91dFsxNV0gPSBNICogZCArIE4gKiBoICsgTyAqIGwgKyBQICogcDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgavmi6HlpKfnuK7lsI/jgpLpgannlKjjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44KS5Y+X44GR44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHZlYyAtIFhZWiDjga7lkITou7jjgavlr77jgZfjgabmi6HnuK7jgpLpgannlKjjgZnjgovlgKTjga7ooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjYWxlKG1hdCwgdmVjLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgb3V0WzBdICA9IG1hdFswXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgb3V0WzFdICA9IG1hdFsxXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgb3V0WzJdICA9IG1hdFsyXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgb3V0WzNdICA9IG1hdFszXSAgKiB2ZWNbMF07XHJcbiAgICAgICAgb3V0WzRdICA9IG1hdFs0XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgb3V0WzVdICA9IG1hdFs1XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgb3V0WzZdICA9IG1hdFs2XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgb3V0WzddICA9IG1hdFs3XSAgKiB2ZWNbMV07XHJcbiAgICAgICAgb3V0WzhdICA9IG1hdFs4XSAgKiB2ZWNbMl07XHJcbiAgICAgICAgb3V0WzldICA9IG1hdFs5XSAgKiB2ZWNbMl07XHJcbiAgICAgICAgb3V0WzEwXSA9IG1hdFsxMF0gKiB2ZWNbMl07XHJcbiAgICAgICAgb3V0WzExXSA9IG1hdFsxMV0gKiB2ZWNbMl07XHJcbiAgICAgICAgb3V0WzEyXSA9IG1hdFsxMl07XHJcbiAgICAgICAgb3V0WzEzXSA9IG1hdFsxM107XHJcbiAgICAgICAgb3V0WzE0XSA9IG1hdFsxNF07XHJcbiAgICAgICAgb3V0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44Gr5bmz6KGM56e75YuV44KS6YGp55So44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOCkuWPl+OBkeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2ZWMgLSBYWVog44Gu5ZCE6Lu444Gr5a++44GX44Gm5bmz6KGM56e75YuV44KS6YGp55So44GZ44KL5YCk44Gu6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUobWF0LCB2ZWMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBvdXRbMF0gPSBtYXRbMF07IG91dFsxXSA9IG1hdFsxXTsgb3V0WzJdICA9IG1hdFsyXTsgIG91dFszXSAgPSBtYXRbM107XHJcbiAgICAgICAgb3V0WzRdID0gbWF0WzRdOyBvdXRbNV0gPSBtYXRbNV07IG91dFs2XSAgPSBtYXRbNl07ICBvdXRbN10gID0gbWF0WzddO1xyXG4gICAgICAgIG91dFs4XSA9IG1hdFs4XTsgb3V0WzldID0gbWF0WzldOyBvdXRbMTBdID0gbWF0WzEwXTsgb3V0WzExXSA9IG1hdFsxMV07XHJcbiAgICAgICAgb3V0WzEyXSA9IG1hdFswXSAqIHZlY1swXSArIG1hdFs0XSAqIHZlY1sxXSArIG1hdFs4XSAgKiB2ZWNbMl0gKyBtYXRbMTJdO1xyXG4gICAgICAgIG91dFsxM10gPSBtYXRbMV0gKiB2ZWNbMF0gKyBtYXRbNV0gKiB2ZWNbMV0gKyBtYXRbOV0gICogdmVjWzJdICsgbWF0WzEzXTtcclxuICAgICAgICBvdXRbMTRdID0gbWF0WzJdICogdmVjWzBdICsgbWF0WzZdICogdmVjWzFdICsgbWF0WzEwXSAqIHZlY1syXSArIG1hdFsxNF07XHJcbiAgICAgICAgb3V0WzE1XSA9IG1hdFszXSAqIHZlY1swXSArIG1hdFs3XSAqIHZlY1sxXSArIG1hdFsxMV0gKiB2ZWNbMl0gKyBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OBq+Wbnui7ouOCkumBqeeUqOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgpLlj5fjgZHjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIOWbnui7oumHj+OCkuihqOOBmeWApO+8iOODqeOCuOOCouODs++8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSBheGlzIC0g5Zue6Lui44Gu6Lu4XHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByb3RhdGUobWF0LCBhbmdsZSwgYXhpcywgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCBzcSA9IE1hdGguc3FydChheGlzWzBdICogYXhpc1swXSArIGF4aXNbMV0gKiBheGlzWzFdICsgYXhpc1syXSAqIGF4aXNbMl0pO1xyXG4gICAgICAgIGlmKCFzcSl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xyXG4gICAgICAgIGlmKHNxICE9IDEpe3NxID0gMSAvIHNxOyBhICo9IHNxOyBiICo9IHNxOyBjICo9IHNxO31cclxuICAgICAgICBsZXQgZCA9IE1hdGguc2luKGFuZ2xlKSwgZSA9IE1hdGguY29zKGFuZ2xlKSwgZiA9IDEgLSBlLFxyXG4gICAgICAgICAgICBnID0gbWF0WzBdLCAgaCA9IG1hdFsxXSwgaSA9IG1hdFsyXSwgIGogPSBtYXRbM10sXHJcbiAgICAgICAgICAgIGsgPSBtYXRbNF0sICBsID0gbWF0WzVdLCBtID0gbWF0WzZdLCAgbiA9IG1hdFs3XSxcclxuICAgICAgICAgICAgbyA9IG1hdFs4XSwgIHAgPSBtYXRbOV0sIHEgPSBtYXRbMTBdLCByID0gbWF0WzExXSxcclxuICAgICAgICAgICAgcyA9IGEgKiBhICogZiArIGUsXHJcbiAgICAgICAgICAgIHQgPSBiICogYSAqIGYgKyBjICogZCxcclxuICAgICAgICAgICAgdSA9IGMgKiBhICogZiAtIGIgKiBkLFxyXG4gICAgICAgICAgICB2ID0gYSAqIGIgKiBmIC0gYyAqIGQsXHJcbiAgICAgICAgICAgIHcgPSBiICogYiAqIGYgKyBlLFxyXG4gICAgICAgICAgICB4ID0gYyAqIGIgKiBmICsgYSAqIGQsXHJcbiAgICAgICAgICAgIHkgPSBhICogYyAqIGYgKyBiICogZCxcclxuICAgICAgICAgICAgeiA9IGIgKiBjICogZiAtIGEgKiBkLFxyXG4gICAgICAgICAgICBBID0gYyAqIGMgKiBmICsgZTtcclxuICAgICAgICBpZihhbmdsZSl7XHJcbiAgICAgICAgICAgIGlmKG1hdCAhPSBvdXQpe1xyXG4gICAgICAgICAgICAgICAgb3V0WzEyXSA9IG1hdFsxMl07IG91dFsxM10gPSBtYXRbMTNdO1xyXG4gICAgICAgICAgICAgICAgb3V0WzE0XSA9IG1hdFsxNF07IG91dFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0ID0gbWF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRbMF0gID0gZyAqIHMgKyBrICogdCArIG8gKiB1O1xyXG4gICAgICAgIG91dFsxXSAgPSBoICogcyArIGwgKiB0ICsgcCAqIHU7XHJcbiAgICAgICAgb3V0WzJdICA9IGkgKiBzICsgbSAqIHQgKyBxICogdTtcclxuICAgICAgICBvdXRbM10gID0gaiAqIHMgKyBuICogdCArIHIgKiB1O1xyXG4gICAgICAgIG91dFs0XSAgPSBnICogdiArIGsgKiB3ICsgbyAqIHg7XHJcbiAgICAgICAgb3V0WzVdICA9IGggKiB2ICsgbCAqIHcgKyBwICogeDtcclxuICAgICAgICBvdXRbNl0gID0gaSAqIHYgKyBtICogdyArIHEgKiB4O1xyXG4gICAgICAgIG91dFs3XSAgPSBqICogdiArIG4gKiB3ICsgciAqIHg7XHJcbiAgICAgICAgb3V0WzhdICA9IGcgKiB5ICsgayAqIHogKyBvICogQTtcclxuICAgICAgICBvdXRbOV0gID0gaCAqIHkgKyBsICogeiArIHAgKiBBO1xyXG4gICAgICAgIG91dFsxMF0gPSBpICogeSArIG0gKiB6ICsgcSAqIEE7XHJcbiAgICAgICAgb3V0WzExXSA9IGogKiB5ICsgbiAqIHogKyByICogQTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gZXllIC0g6KaW54K55L2N572uXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IGNlbnRlciAtIOazqOimlueCuVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB1cCAtIOS4iuaWueWQkeOCkuekuuOBmeODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9va0F0KGV5ZSwgY2VudGVyLCB1cCwgZGVzdCl7XHJcbiAgICAgICAgbGV0IGV5ZVggICAgPSBleWVbMF0sICAgIGV5ZVkgICAgPSBleWVbMV0sICAgIGV5ZVogICAgPSBleWVbMl0sXHJcbiAgICAgICAgICAgIGNlbnRlclggPSBjZW50ZXJbMF0sIGNlbnRlclkgPSBjZW50ZXJbMV0sIGNlbnRlclogPSBjZW50ZXJbMl0sXHJcbiAgICAgICAgICAgIHVwWCAgICAgPSB1cFswXSwgICAgIHVwWSAgICAgPSB1cFsxXSwgICAgIHVwWiAgICAgPSB1cFsyXTtcclxuICAgICAgICBpZihleWVYID09IGNlbnRlclggJiYgZXllWSA9PSBjZW50ZXJZICYmIGV5ZVogPT0gY2VudGVyWil7cmV0dXJuIE1hdDQuaWRlbnRpdHkoZGVzdCk7fVxyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbDtcclxuICAgICAgICB6MCA9IGV5ZVggLSBjZW50ZXJbMF07IHoxID0gZXllWSAtIGNlbnRlclsxXTsgejIgPSBleWVaIC0gY2VudGVyWzJdO1xyXG4gICAgICAgIGwgPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XHJcbiAgICAgICAgejAgKj0gbDsgejEgKj0gbDsgejIgKj0gbDtcclxuICAgICAgICB4MCA9IHVwWSAqIHoyIC0gdXBaICogejE7XHJcbiAgICAgICAgeDEgPSB1cFogKiB6MCAtIHVwWCAqIHoyO1xyXG4gICAgICAgIHgyID0gdXBYICogejEgLSB1cFkgKiB6MDtcclxuICAgICAgICBsID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XHJcbiAgICAgICAgaWYoIWwpe1xyXG4gICAgICAgICAgICB4MCA9IDA7IHgxID0gMDsgeDIgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcclxuICAgICAgICAgICAgeDAgKj0gbDsgeDEgKj0gbDsgeDIgKj0gbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgeTAgPSB6MSAqIHgyIC0gejIgKiB4MTsgeTEgPSB6MiAqIHgwIC0gejAgKiB4MjsgeTIgPSB6MCAqIHgxIC0gejEgKiB4MDtcclxuICAgICAgICBsID0gTWF0aC5zcXJ0KHkwICogeTAgKyB5MSAqIHkxICsgeTIgKiB5Mik7XHJcbiAgICAgICAgaWYoIWwpe1xyXG4gICAgICAgICAgICB5MCA9IDA7IHkxID0gMDsgeTIgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcclxuICAgICAgICAgICAgeTAgKj0gbDsgeTEgKj0gbDsgeTIgKj0gbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0WzBdID0geDA7IG91dFsxXSA9IHkwOyBvdXRbMl0gID0gejA7IG91dFszXSAgPSAwO1xyXG4gICAgICAgIG91dFs0XSA9IHgxOyBvdXRbNV0gPSB5MTsgb3V0WzZdICA9IHoxOyBvdXRbN10gID0gMDtcclxuICAgICAgICBvdXRbOF0gPSB4Mjsgb3V0WzldID0geTI7IG91dFsxMF0gPSB6Mjsgb3V0WzExXSA9IDA7XHJcbiAgICAgICAgb3V0WzEyXSA9IC0oeDAgKiBleWVYICsgeDEgKiBleWVZICsgeDIgKiBleWVaKTtcclxuICAgICAgICBvdXRbMTNdID0gLSh5MCAqIGV5ZVggKyB5MSAqIGV5ZVkgKyB5MiAqIGV5ZVopO1xyXG4gICAgICAgIG91dFsxNF0gPSAtKHowICogZXllWCArIHoxICogZXllWSArIHoyICogZXllWik7XHJcbiAgICAgICAgb3V0WzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6YCP6KaW5oqV5b2x5aSJ5o+b6KGM5YiX44KS55Sf5oiQ44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZm92eSAtIOimlumHjuinku+8iOW6puaVsOazle+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCAtIOOCouOCueODmuOCr+ODiOavlO+8iOW5hSAvIOmrmOOBle+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgLSDjg4vjgqLjgq/jg6rjg4Pjg5fpnaLjgb7jgafjga7ot53pm6JcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgLSDjg5XjgqHjg7zjgq/jg6rjg4Pjg5fpnaLjgb7jgafjga7ot53pm6JcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlKGZvdnksIGFzcGVjdCwgbmVhciwgZmFyLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IHQgPSBuZWFyICogTWF0aC50YW4oZm92eSAqIE1hdGguUEkgLyAzNjApO1xyXG4gICAgICAgIGxldCByID0gdCAqIGFzcGVjdDtcclxuICAgICAgICBsZXQgYSA9IHIgKiAyLCBiID0gdCAqIDIsIGMgPSBmYXIgLSBuZWFyO1xyXG4gICAgICAgIG91dFswXSAgPSBuZWFyICogMiAvIGE7XHJcbiAgICAgICAgb3V0WzFdICA9IDA7XHJcbiAgICAgICAgb3V0WzJdICA9IDA7XHJcbiAgICAgICAgb3V0WzNdICA9IDA7XHJcbiAgICAgICAgb3V0WzRdICA9IDA7XHJcbiAgICAgICAgb3V0WzVdICA9IG5lYXIgKiAyIC8gYjtcclxuICAgICAgICBvdXRbNl0gID0gMDtcclxuICAgICAgICBvdXRbN10gID0gMDtcclxuICAgICAgICBvdXRbOF0gID0gMDtcclxuICAgICAgICBvdXRbOV0gID0gMDtcclxuICAgICAgICBvdXRbMTBdID0gLShmYXIgKyBuZWFyKSAvIGM7XHJcbiAgICAgICAgb3V0WzExXSA9IC0xO1xyXG4gICAgICAgIG91dFsxMl0gPSAwO1xyXG4gICAgICAgIG91dFsxM10gPSAwO1xyXG4gICAgICAgIG91dFsxNF0gPSAtKGZhciAqIG5lYXIgKiAyKSAvIGM7XHJcbiAgICAgICAgb3V0WzE1XSA9IDA7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5q2j5bCE5b2x5oqV5b2x5aSJ5o+b6KGM5YiX44KS55Sf5oiQ44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdCAtIOW3puerr1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IC0g5Y+z56uvXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9wIC0g5LiK56uvXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIC0g5LiL56uvXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciAtIOODi+OCouOCr+ODquODg+ODl+mdouOBvuOBp+OBrui3nembolxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZhciAtIOODleOCoeODvOOCr+ODquODg+ODl+mdouOBvuOBp+OBrui3nembolxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgb3J0aG8obGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgaCA9IChyaWdodCAtIGxlZnQpO1xyXG4gICAgICAgIGxldCB2ID0gKHRvcCAtIGJvdHRvbSk7XHJcbiAgICAgICAgbGV0IGQgPSAoZmFyIC0gbmVhcik7XHJcbiAgICAgICAgb3V0WzBdICA9IDIgLyBoO1xyXG4gICAgICAgIG91dFsxXSAgPSAwO1xyXG4gICAgICAgIG91dFsyXSAgPSAwO1xyXG4gICAgICAgIG91dFszXSAgPSAwO1xyXG4gICAgICAgIG91dFs0XSAgPSAwO1xyXG4gICAgICAgIG91dFs1XSAgPSAyIC8gdjtcclxuICAgICAgICBvdXRbNl0gID0gMDtcclxuICAgICAgICBvdXRbN10gID0gMDtcclxuICAgICAgICBvdXRbOF0gID0gMDtcclxuICAgICAgICBvdXRbOV0gID0gMDtcclxuICAgICAgICBvdXRbMTBdID0gLTIgLyBkO1xyXG4gICAgICAgIG91dFsxMV0gPSAwO1xyXG4gICAgICAgIG91dFsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBoO1xyXG4gICAgICAgIG91dFsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB2O1xyXG4gICAgICAgIG91dFsxNF0gPSAtKGZhciArIG5lYXIpIC8gZDtcclxuICAgICAgICBvdXRbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDou6Lnva7ooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0cmFuc3Bvc2UobWF0LCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgb3V0WzBdICA9IG1hdFswXTsgIG91dFsxXSAgPSBtYXRbNF07XHJcbiAgICAgICAgb3V0WzJdICA9IG1hdFs4XTsgIG91dFszXSAgPSBtYXRbMTJdO1xyXG4gICAgICAgIG91dFs0XSAgPSBtYXRbMV07ICBvdXRbNV0gID0gbWF0WzVdO1xyXG4gICAgICAgIG91dFs2XSAgPSBtYXRbOV07ICBvdXRbN10gID0gbWF0WzEzXTtcclxuICAgICAgICBvdXRbOF0gID0gbWF0WzJdOyAgb3V0WzldICA9IG1hdFs2XTtcclxuICAgICAgICBvdXRbMTBdID0gbWF0WzEwXTsgb3V0WzExXSA9IG1hdFsxNF07XHJcbiAgICAgICAgb3V0WzEyXSA9IG1hdFszXTsgIG91dFsxM10gPSBtYXRbN107XHJcbiAgICAgICAgb3V0WzE0XSA9IG1hdFsxMV07IG91dFsxNV0gPSBtYXRbMTVdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmAhuihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGludmVyc2UobWF0LCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IGEgPSBtYXRbMF0sICBiID0gbWF0WzFdLCAgYyA9IG1hdFsyXSwgIGQgPSBtYXRbM10sXHJcbiAgICAgICAgICAgIGUgPSBtYXRbNF0sICBmID0gbWF0WzVdLCAgZyA9IG1hdFs2XSwgIGggPSBtYXRbN10sXHJcbiAgICAgICAgICAgIGkgPSBtYXRbOF0sICBqID0gbWF0WzldLCAgayA9IG1hdFsxMF0sIGwgPSBtYXRbMTFdLFxyXG4gICAgICAgICAgICBtID0gbWF0WzEyXSwgbiA9IG1hdFsxM10sIG8gPSBtYXRbMTRdLCBwID0gbWF0WzE1XSxcclxuICAgICAgICAgICAgcSA9IGEgKiBmIC0gYiAqIGUsIHIgPSBhICogZyAtIGMgKiBlLFxyXG4gICAgICAgICAgICBzID0gYSAqIGggLSBkICogZSwgdCA9IGIgKiBnIC0gYyAqIGYsXHJcbiAgICAgICAgICAgIHUgPSBiICogaCAtIGQgKiBmLCB2ID0gYyAqIGggLSBkICogZyxcclxuICAgICAgICAgICAgdyA9IGkgKiBuIC0gaiAqIG0sIHggPSBpICogbyAtIGsgKiBtLFxyXG4gICAgICAgICAgICB5ID0gaSAqIHAgLSBsICogbSwgeiA9IGogKiBvIC0gayAqIG4sXHJcbiAgICAgICAgICAgIEEgPSBqICogcCAtIGwgKiBuLCBCID0gayAqIHAgLSBsICogbyxcclxuICAgICAgICAgICAgaXZkID0gMSAvIChxICogQiAtIHIgKiBBICsgcyAqIHogKyB0ICogeSAtIHUgKiB4ICsgdiAqIHcpO1xyXG4gICAgICAgIG91dFswXSAgPSAoIGYgKiBCIC0gZyAqIEEgKyBoICogeikgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzFdICA9ICgtYiAqIEIgKyBjICogQSAtIGQgKiB6KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMl0gID0gKCBuICogdiAtIG8gKiB1ICsgcCAqIHQpICogaXZkO1xyXG4gICAgICAgIG91dFszXSAgPSAoLWogKiB2ICsgayAqIHUgLSBsICogdCkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzRdICA9ICgtZSAqIEIgKyBnICogeSAtIGggKiB4KSAqIGl2ZDtcclxuICAgICAgICBvdXRbNV0gID0gKCBhICogQiAtIGMgKiB5ICsgZCAqIHgpICogaXZkO1xyXG4gICAgICAgIG91dFs2XSAgPSAoLW0gKiB2ICsgbyAqIHMgLSBwICogcikgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzddICA9ICggaSAqIHYgLSBrICogcyArIGwgKiByKSAqIGl2ZDtcclxuICAgICAgICBvdXRbOF0gID0gKCBlICogQSAtIGYgKiB5ICsgaCAqIHcpICogaXZkO1xyXG4gICAgICAgIG91dFs5XSAgPSAoLWEgKiBBICsgYiAqIHkgLSBkICogdykgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzEwXSA9ICggbSAqIHUgLSBuICogcyArIHAgKiBxKSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTFdID0gKC1pICogdSArIGogKiBzIC0gbCAqIHEpICogaXZkO1xyXG4gICAgICAgIG91dFsxMl0gPSAoLWUgKiB6ICsgZiAqIHggLSBnICogdykgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzEzXSA9ICggYSAqIHogLSBiICogeCArIGMgKiB3KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTRdID0gKC1tICogdCArIG4gKiByIC0gbyAqIHEpICogaXZkO1xyXG4gICAgICAgIG91dFsxNV0gPSAoIGkgKiB0IC0gaiAqIHIgKyBrICogcSkgKiBpdmQ7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44Gr44OZ44Kv44OI44Or44KS5LmX566X44GZ44KL77yI44OZ44Kv44OI44Or44Gr6KGM5YiX44KS6YGp55So44GZ44KL77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gdmVjIC0g5LmX566X44GZ44KL44OZ44Kv44OI44Or77yINCDjgaTjga7opoHntKDjgpLmjIHjgaTphY3liJfvvIlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g57WQ5p6c44Gu44OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0b1ZlY0lWKG1hdCwgdmVjKXtcclxuICAgICAgICBsZXQgYSA9IG1hdFswXSwgIGIgPSBtYXRbMV0sICBjID0gbWF0WzJdLCAgZCA9IG1hdFszXSxcclxuICAgICAgICAgICAgZSA9IG1hdFs0XSwgIGYgPSBtYXRbNV0sICBnID0gbWF0WzZdLCAgaCA9IG1hdFs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgIGogPSBtYXRbOV0sICBrID0gbWF0WzEwXSwgbCA9IG1hdFsxMV0sXHJcbiAgICAgICAgICAgIG0gPSBtYXRbMTJdLCBuID0gbWF0WzEzXSwgbyA9IG1hdFsxNF0sIHAgPSBtYXRbMTVdO1xyXG4gICAgICAgIGxldCB4ID0gdmVjWzBdLCB5ID0gdmVjWzFdLCB6ID0gdmVjWzJdLCB3ID0gdmVjWzNdO1xyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBvdXRbMF0gPSB4ICogYSArIHkgKiBlICsgeiAqIGkgKyB3ICogbTtcclxuICAgICAgICBvdXRbMV0gPSB4ICogYiArIHkgKiBmICsgeiAqIGogKyB3ICogbjtcclxuICAgICAgICBvdXRbMl0gPSB4ICogYyArIHkgKiBnICsgeiAqIGsgKyB3ICogbztcclxuICAgICAgICBvdXRbM10gPSB4ICogZCArIHkgKiBoICsgeiAqIGwgKyB3ICogcDtcclxuICAgICAgICB2ZWMgPSBvdXQ7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kr44Oh44Op44Gu44OX44Ot44OR44OG44Kj44Gr55u45b2T44GZ44KL5oOF5aCx44KS5Y+X44GR5Y+W44KK6KGM5YiX44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHBvc2l0aW9uIC0g44Kr44Oh44Op44Gu5bqn5qiZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IGNlbnRlclBvaW50IC0g44Kr44Oh44Op44Gu5rOo6KaW54K5XHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHVwRGlyZWN0aW9uIC0g44Kr44Oh44Op44Gu5LiK5pa55ZCRXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZm92eSAtIOimlumHjuinklxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCAtIOOCouOCueODmuOCr+ODiOavlFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgLSDjg4vjgqLjgq/jg6rjg4Pjg5fpnaJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgLSDjg5XjgqHjg7zjgq/jg6rjg4Pjg5fpnaJcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gdm1hdCAtIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl+OBrue1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBwbWF0IC0g6YCP6KaW5oqV5b2x5bqn5qiZ5aSJ5o+b6KGM5YiX44Gu57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IGRlc3QgLSDjg5Pjg6Xjg7wgeCDpgI/oppbmipXlvbHlpInmj5vooYzliJfjga7ntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHZwRnJvbUNhbWVyYVByb3BlcnR5KHBvc2l0aW9uLCBjZW50ZXJQb2ludCwgdXBEaXJlY3Rpb24sIGZvdnksIGFzcGVjdCwgbmVhciwgZmFyLCB2bWF0LCBwbWF0LCBkZXN0KXtcclxuICAgICAgICBNYXQ0Lmxvb2tBdChwb3NpdGlvbiwgY2VudGVyUG9pbnQsIHVwRGlyZWN0aW9uLCB2bWF0KTtcclxuICAgICAgICBNYXQ0LnBlcnNwZWN0aXZlKGZvdnksIGFzcGVjdCwgbmVhciwgZmFyLCBwbWF0KTtcclxuICAgICAgICBNYXQ0Lm11bHRpcGx5KHBtYXQsIHZtYXQsIGRlc3QpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBNVlAg6KGM5YiX44Gr55u45b2T44GZ44KL6KGM5YiX44KS5Y+X44GR5Y+W44KK44OZ44Kv44OI44Or44KS5aSJ5o+b44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIE1WUCDooYzliJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHZlYyAtIE1WUCDooYzliJfjgajkuZfnrpfjgZnjgovjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODk+ODpeODvOODneODvOODiOOBruW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODk+ODpeODvOODneODvOODiOOBrumrmOOBlVxyXG4gICAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IOe1kOaenOOBruODmeOCr+ODiOODq++8iDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44Or77yJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzY3JlZW5Qb3NpdGlvbkZyb21NdnAobWF0LCB2ZWMsIHdpZHRoLCBoZWlnaHQpe1xyXG4gICAgICAgIGxldCBoYWxmV2lkdGggPSB3aWR0aCAqIDAuNTtcclxuICAgICAgICBsZXQgaGFsZkhlaWdodCA9IGhlaWdodCAqIDAuNTtcclxuICAgICAgICBsZXQgdiA9IE1hdDQudG9WZWNJVihtYXQsIFt2ZWNbMF0sIHZlY1sxXSwgdmVjWzJdLCAxLjBdKTtcclxuICAgICAgICBpZih2WzNdIDw9IDAuMCl7cmV0dXJuIFtOYU4sIE5hTl07fVxyXG4gICAgICAgIHZbMF0gLz0gdlszXTsgdlsxXSAvPSB2WzNdOyB2WzJdIC89IHZbM107XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgaGFsZldpZHRoICsgdlswXSAqIGhhbGZXaWR0aCxcclxuICAgICAgICAgICAgaGFsZkhlaWdodCAtIHZbMV0gKiBoYWxmSGVpZ2h0XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFZlYzNcclxuICogQGNsYXNzIFZlYzNcclxuICovXHJcbmNsYXNzIFZlYzMge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq+OCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDjg5njgq/jg4jjg6vmoLzntI3nlKjjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5njgq/jg4jjg6vjga7plbfjgZXvvIjlpKfjgY3jgZXvvInjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdiAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOODmeOCr+ODiOODq+OBrumVt+OBle+8iOWkp+OBjeOBle+8iVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbGVuKHYpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSArIHZbMl0gKiB2WzJdKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7luqfmqJnvvIjlp4vngrnjg7vntYLngrnvvInjgpLntZDjgbbjg5njgq/jg4jjg6vjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjAgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOWni+eCueW6p+aomVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk57WC54K55bqn5qiZXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSDoppbngrnjgajntYLngrnjgpLntZDjgbbjg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRpc3RhbmNlKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIG5bMF0gPSB2MVswXSAtIHYwWzBdO1xyXG4gICAgICAgIG5bMV0gPSB2MVsxXSAtIHYwWzFdO1xyXG4gICAgICAgIG5bMl0gPSB2MVsyXSAtIHYwWzJdO1xyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5njgq/jg4jjg6vjgpLmraPopo/ljJbjgZfjgZ/ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdiAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSDmraPopo/ljJbjgZfjgZ/jg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG5vcm1hbGl6ZSh2KXtcclxuICAgICAgICBsZXQgbiA9IFZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IGwgPSBWZWMzLmxlbih2KTtcclxuICAgICAgICBpZihsID4gMCl7XHJcbiAgICAgICAgICAgIGxldCBlID0gMS4wIC8gbDtcclxuICAgICAgICAgICAgblswXSA9IHZbMF0gKiBlO1xyXG4gICAgICAgICAgICBuWzFdID0gdlsxXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMl0gPSB2WzJdICogZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgblswXSA9IDAuMDtcclxuICAgICAgICAgICAgblsxXSA9IDAuMDtcclxuICAgICAgICAgICAgblsyXSA9IDAuMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44OZ44Kv44OI44Or44Gu5YaF56mN44Gu57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYwIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjEgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDlhoXnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRvdCh2MCwgdjEpe1xyXG4gICAgICAgIHJldHVybiB2MFswXSAqIHYxWzBdICsgdjBbMV0gKiB2MVsxXSArIHYwWzJdICogdjFbMl07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44OZ44Kv44OI44Or44Gu5aSW56mN44Gu57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYwIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjEgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMzPn0g5aSW56mN44Gu57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcm9zcyh2MCwgdjEpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBuWzBdID0gdjBbMV0gKiB2MVsyXSAtIHYwWzJdICogdjFbMV07XHJcbiAgICAgICAgblsxXSA9IHYwWzJdICogdjFbMF0gLSB2MFswXSAqIHYxWzJdO1xyXG4gICAgICAgIG5bMl0gPSB2MFswXSAqIHYxWzFdIC0gdjBbMV0gKiB2MVswXTtcclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMyDjgaTjga7jg5njgq/jg4jjg6vjgYvjgonpnaLms5Xnt5rjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjAgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYyIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMz59IOmdouazlee3muODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmFjZU5vcm1hbCh2MCwgdjEsIHYyKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IHZlYzEgPSBbdjFbMF0gLSB2MFswXSwgdjFbMV0gLSB2MFsxXSwgdjFbMl0gLSB2MFsyXV07XHJcbiAgICAgICAgbGV0IHZlYzIgPSBbdjJbMF0gLSB2MFswXSwgdjJbMV0gLSB2MFsxXSwgdjJbMl0gLSB2MFsyXV07XHJcbiAgICAgICAgblswXSA9IHZlYzFbMV0gKiB2ZWMyWzJdIC0gdmVjMVsyXSAqIHZlYzJbMV07XHJcbiAgICAgICAgblsxXSA9IHZlYzFbMl0gKiB2ZWMyWzBdIC0gdmVjMVswXSAqIHZlYzJbMl07XHJcbiAgICAgICAgblsyXSA9IHZlYzFbMF0gKiB2ZWMyWzFdIC0gdmVjMVsxXSAqIHZlYzJbMF07XHJcbiAgICAgICAgcmV0dXJuIFZlYzMubm9ybWFsaXplKG4pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVmVjMlxyXG4gKiBAY2xhc3MgVmVjMlxyXG4gKi9cclxuY2xhc3MgVmVjMiB7XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44Or44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IOODmeOCr+ODiOODq+agvOe0jeeUqOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OBrumVt+OBle+8iOWkp+OBjeOBle+8ieOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2IC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44OZ44Kv44OI44Or44Gu6ZW344GV77yI5aSn44GN44GV77yJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsZW4odil7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2WzBdICogdlswXSArIHZbMV0gKiB2WzFdKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7luqfmqJnvvIjlp4vngrnjg7vntYLngrnvvInjgpLntZDjgbbjg5njgq/jg4jjg6vjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjAgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOWni+eCueW6p+aomVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MSAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk57WC54K55bqn5qiZXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSDoppbngrnjgajntYLngrnjgpLntZDjgbbjg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRpc3RhbmNlKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMyLmNyZWF0ZSgpO1xyXG4gICAgICAgIG5bMF0gPSB2MVswXSAtIHYwWzBdO1xyXG4gICAgICAgIG5bMV0gPSB2MVsxXSAtIHYwWzFdO1xyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5njgq/jg4jjg6vjgpLmraPopo/ljJbjgZfjgZ/ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdiAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSDmraPopo/ljJbjgZfjgZ/jg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG5vcm1hbGl6ZSh2KXtcclxuICAgICAgICBsZXQgbiA9IFZlYzIuY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IGwgPSBWZWMyLmxlbih2KTtcclxuICAgICAgICBpZihsID4gMCl7XHJcbiAgICAgICAgICAgIGxldCBlID0gMS4wIC8gbDtcclxuICAgICAgICAgICAgblswXSA9IHZbMF0gKiBlO1xyXG4gICAgICAgICAgICBuWzFdID0gdlsxXSAqIGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruODmeOCr+ODiOODq+OBruWGheepjeOBrue1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MCAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYxIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g5YaF56mN44Gu57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkb3QodjAsIHYxKXtcclxuICAgICAgICByZXR1cm4gdjBbMF0gKiB2MVswXSArIHYwWzFdICogdjFbMV07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44OZ44Kv44OI44Or44Gu5aSW56mN44Gu57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYwIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjEgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMyPn0g5aSW56mN44Gu57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcm9zcyh2MCwgdjEpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMi5jcmVhdGUoKTtcclxuICAgICAgICByZXR1cm4gdjBbMF0gKiB2MVsxXSAtIHYwWzFdICogdjFbMF07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBRdG5cclxuICogQGNsYXNzIFF0blxyXG4gKi9cclxuY2xhc3MgUXRuIHtcclxuICAgIC8qKlxyXG4gICAgICogNCDjgaTjga7opoHntKDjgYvjgonjgarjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7Pjga7jg4fjg7zjgr/mp4vpgKDjgpLnlJ/miJDjgZnjgovvvIjomZrpg6ggeCwgeSwgeiwg5a6f6YOoIHcg44Gu6aCG5bqP44Gn5a6a576p77yJXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IOOCr+OCqeODvOOCv+ODi+OCquODs+ODh+ODvOOCv+agvOe0jeeUqOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCr+OCqeODvOOCv+ODi+OCquODs+OCkuWIneacn+WMluOBmeOCi++8iOWPgueFp+OBq+azqOaEj++8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IGRlc3QgLSDliJ3mnJ/ljJbjgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpZGVudGl0eShkZXN0KXtcclxuICAgICAgICBkZXN0WzBdID0gMDsgZGVzdFsxXSA9IDA7IGRlc3RbMl0gPSAwOyBkZXN0WzNdID0gMTtcclxuICAgICAgICByZXR1cm4gZGVzdDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5YWx5b255Zub5YWD5pWw44KS55Sf5oiQ44GX44Gm6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuIC0g5YWD44Go44Gq44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW52ZXJzZShxdG4sIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gUXRuLmNyZWF0ZSgpO31cclxuICAgICAgICBvdXRbMF0gPSAtcXRuWzBdO1xyXG4gICAgICAgIG91dFsxXSA9IC1xdG5bMV07XHJcbiAgICAgICAgb3V0WzJdID0gLXF0blsyXTtcclxuICAgICAgICBvdXRbM10gPSAgcXRuWzNdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiZmumDqOOCkuato+imj+WMluOBl+OBpui/lOOBme+8iOWPgueFp+OBq+azqOaEj++8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0biAtIOWFg+OBqOOBquOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG5vcm1hbGl6ZShkZXN0KXtcclxuICAgICAgICBsZXQgeCA9IGRlc3RbMF0sIHkgPSBkZXN0WzFdLCB6ID0gZGVzdFsyXTtcclxuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gICAgICAgIGlmKGwgPT09IDApe1xyXG4gICAgICAgICAgICBkZXN0WzBdID0gMDtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IDA7XHJcbiAgICAgICAgICAgIGRlc3RbMl0gPSAwO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBsID0gMSAvIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSB4ICogbDtcclxuICAgICAgICAgICAgZGVzdFsxXSA9IHkgKiBsO1xyXG4gICAgICAgICAgICBkZXN0WzJdID0geiAqIGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgq/jgqnjg7zjgr/jg4vjgqrjg7PjgpLkuZfnrpfjgZfjgZ/ntZDmnpzjgpLov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4wIC0g5LmX566X44GV44KM44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuMSAtIOS5l+eul+OBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG11bHRpcGx5KHF0bjAsIHF0bjEsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gUXRuLmNyZWF0ZSgpO31cclxuICAgICAgICBsZXQgYXggPSBxdG4wWzBdLCBheSA9IHF0bjBbMV0sIGF6ID0gcXRuMFsyXSwgYXcgPSBxdG4wWzNdO1xyXG4gICAgICAgIGxldCBieCA9IHF0bjFbMF0sIGJ5ID0gcXRuMVsxXSwgYnogPSBxdG4xWzJdLCBidyA9IHF0bjFbM107XHJcbiAgICAgICAgb3V0WzBdID0gYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieTtcclxuICAgICAgICBvdXRbMV0gPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6O1xyXG4gICAgICAgIG91dFsyXSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYng7XHJcbiAgICAgICAgb3V0WzNdID0gYXcgKiBidyAtIGF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBiejtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgq/jgqnjg7zjgr/jg4vjgqrjg7Pjgavlm57ou6LjgpLpgannlKjjgZfov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIOWbnui7ouOBmeOCi+mHj++8iOODqeOCuOOCouODs++8iVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXhpcyAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk6Lu444OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcm90YXRlKGFuZ2xlLCBheGlzLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IFF0bi5jcmVhdGUoKTt9XHJcbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XHJcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XHJcbiAgICAgICAgaWYoc3EgIT09IDApe1xyXG4gICAgICAgICAgICBsZXQgbCA9IDEgLyBzcTtcclxuICAgICAgICAgICAgYSAqPSBsO1xyXG4gICAgICAgICAgICBiICo9IGw7XHJcbiAgICAgICAgICAgIGMgKj0gbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihhbmdsZSAqIDAuNSk7XHJcbiAgICAgICAgb3V0WzBdID0gYSAqIHM7XHJcbiAgICAgICAgb3V0WzFdID0gYiAqIHM7XHJcbiAgICAgICAgb3V0WzJdID0gYyAqIHM7XHJcbiAgICAgICAgb3V0WzNdID0gTWF0aC5jb3MoYW5nbGUgKiAwLjUpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OBq+OCr+OCqeODvOOCv+ODi+OCquODs+OCkumBqeeUqOOBl+i/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gdmVjIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4gLSDjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IFtkZXN0XSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0g57WQ5p6c44Gu44OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0b1ZlY0lJSSh2ZWMsIHF0biwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBbMC4wLCAwLjAsIDAuMF07fVxyXG4gICAgICAgIGxldCBxcCA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgcXEgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgbGV0IHFyID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIFF0bi5pbnZlcnNlKHF0biwgcXIpO1xyXG4gICAgICAgIHFwWzBdID0gdmVjWzBdO1xyXG4gICAgICAgIHFwWzFdID0gdmVjWzFdO1xyXG4gICAgICAgIHFwWzJdID0gdmVjWzJdO1xyXG4gICAgICAgIFF0bi5tdWx0aXBseShxciwgcXAsIHFxKTtcclxuICAgICAgICBRdG4ubXVsdGlwbHkocXEsIHF0biwgcXIpO1xyXG4gICAgICAgIG91dFswXSA9IHFyWzBdO1xyXG4gICAgICAgIG91dFsxXSA9IHFyWzFdO1xyXG4gICAgICAgIG91dFsyXSA9IHFyWzJdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDR4NCDooYzliJfjgavjgq/jgqnjg7zjgr/jg4vjgqrjg7PjgpLpgannlKjjgZfov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4gLSDjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0gNHg0IOihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0b01hdElWKHF0biwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpO31cclxuICAgICAgICBsZXQgeCA9IHF0blswXSwgeSA9IHF0blsxXSwgeiA9IHF0blsyXSwgdyA9IHF0blszXTtcclxuICAgICAgICBsZXQgeDIgPSB4ICsgeCwgeTIgPSB5ICsgeSwgejIgPSB6ICsgejtcclxuICAgICAgICBsZXQgeHggPSB4ICogeDIsIHh5ID0geCAqIHkyLCB4eiA9IHggKiB6MjtcclxuICAgICAgICBsZXQgeXkgPSB5ICogeTIsIHl6ID0geSAqIHoyLCB6eiA9IHogKiB6MjtcclxuICAgICAgICBsZXQgd3ggPSB3ICogeDIsIHd5ID0gdyAqIHkyLCB3eiA9IHcgKiB6MjtcclxuICAgICAgICBvdXRbMF0gID0gMSAtICh5eSArIHp6KTtcclxuICAgICAgICBvdXRbMV0gID0geHkgLSB3ejtcclxuICAgICAgICBvdXRbMl0gID0geHogKyB3eTtcclxuICAgICAgICBvdXRbM10gID0gMDtcclxuICAgICAgICBvdXRbNF0gID0geHkgKyB3ejtcclxuICAgICAgICBvdXRbNV0gID0gMSAtICh4eCArIHp6KTtcclxuICAgICAgICBvdXRbNl0gID0geXogLSB3eDtcclxuICAgICAgICBvdXRbN10gID0gMDtcclxuICAgICAgICBvdXRbOF0gID0geHogLSB3eTtcclxuICAgICAgICBvdXRbOV0gID0geXogKyB3eDtcclxuICAgICAgICBvdXRbMTBdID0gMSAtICh4eCArIHl5KTtcclxuICAgICAgICBvdXRbMTFdID0gMDtcclxuICAgICAgICBvdXRbMTJdID0gMDtcclxuICAgICAgICBvdXRbMTNdID0gMDtcclxuICAgICAgICBvdXRbMTRdID0gMDtcclxuICAgICAgICBvdXRbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruOCr+OCqeODvOOCv+ODi+OCquODs+OBrueQg+mdoue3muW9ouijnOmWk+OCkuihjOOBo+OBn+e1kOaenOOCkui/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0bjAgLSDjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4xIC0g44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSAtIOijnOmWk+S/guaVsO+8iDAuMCDjgYvjgokgMS4wIOOBp+aMh+Wumu+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNsZXJwKHF0bjAsIHF0bjEsIHRpbWUsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gUXRuLmNyZWF0ZSgpO31cclxuICAgICAgICBsZXQgaHQgPSBxdG4wWzBdICogcXRuMVswXSArIHF0bjBbMV0gKiBxdG4xWzFdICsgcXRuMFsyXSAqIHF0bjFbMl0gKyBxdG4wWzNdICogcXRuMVszXTtcclxuICAgICAgICBsZXQgaHMgPSAxLjAgLSBodCAqIGh0O1xyXG4gICAgICAgIGlmKGhzIDw9IDAuMCl7XHJcbiAgICAgICAgICAgIG91dFswXSA9IHF0bjBbMF07XHJcbiAgICAgICAgICAgIG91dFsxXSA9IHF0bjBbMV07XHJcbiAgICAgICAgICAgIG91dFsyXSA9IHF0bjBbMl07XHJcbiAgICAgICAgICAgIG91dFszXSA9IHF0bjBbM107XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGhzID0gTWF0aC5zcXJ0KGhzKTtcclxuICAgICAgICAgICAgaWYoTWF0aC5hYnMoaHMpIDwgMC4wMDAxKXtcclxuICAgICAgICAgICAgICAgIG91dFswXSA9IChxdG4wWzBdICogMC41ICsgcXRuMVswXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSAocXRuMFsxXSAqIDAuNSArIHF0bjFbMV0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gKHF0bjBbMl0gKiAwLjUgKyBxdG4xWzJdICogMC41KTtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IChxdG4wWzNdICogMC41ICsgcXRuMVszXSAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbGV0IHBoID0gTWF0aC5hY29zKGh0KTtcclxuICAgICAgICAgICAgICAgIGxldCBwdCA9IHBoICogdGltZTtcclxuICAgICAgICAgICAgICAgIGxldCB0MCA9IE1hdGguc2luKHBoIC0gcHQpIC8gaHM7XHJcbiAgICAgICAgICAgICAgICBsZXQgdDEgPSBNYXRoLnNpbihwdCkgLyBocztcclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHF0bjBbMF0gKiB0MCArIHF0bjFbMF0gKiB0MTtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHF0bjBbMV0gKiB0MCArIHF0bjFbMV0gKiB0MTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHF0bjBbMl0gKiB0MCArIHF0bjFbMl0gKiB0MTtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHF0bjBbM10gKiB0MCArIHF0bjFbM10gKiB0MTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM01hdGguanMiLCJcclxuLyoqXHJcbiAqIGdsM01lc2hcclxuICogQGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNNZXNoIHtcclxuICAgIC8qKlxyXG4gICAgICog5p2/44Od44Oq44K044Oz44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDmnb/jg53jg6rjgrTjg7Pjga7kuIDovrrjga7luYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDmnb/jg53jg6rjgrTjg7Pjga7kuIDovrrjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IHBsYW5lRGF0YSA9IGdsMy5NZXNoLnBsYW5lKDIuMCwgMi4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBwbGFuZSh3aWR0aCwgaGVpZ2h0LCBjb2xvcil7XHJcbiAgICAgICAgbGV0IHcsIGg7XHJcbiAgICAgICAgdyA9IHdpZHRoIC8gMjtcclxuICAgICAgICBoID0gaGVpZ2h0IC8gMjtcclxuICAgICAgICBpZihjb2xvcil7XHJcbiAgICAgICAgICAgIHRjID0gY29sb3I7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRjID0gWzEuMCwgMS4wLCAxLjAsIDEuMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwb3MgPSBbXHJcbiAgICAgICAgICAgIC13LCAgaCwgIDAuMCxcclxuICAgICAgICAgICAgIHcsICBoLCAgMC4wLFxyXG4gICAgICAgICAgICAtdywgLWgsICAwLjAsXHJcbiAgICAgICAgICAgICB3LCAtaCwgIDAuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IG5vciA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGNvbCA9IFtcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBzdCAgPSBbXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLFxyXG4gICAgICAgICAgICAxLjAsIDAuMCxcclxuICAgICAgICAgICAgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDEuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgaWR4ID0gW1xyXG4gICAgICAgICAgICAwLCAxLCAyLFxyXG4gICAgICAgICAgICAyLCAxLCAzXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhobvvIhYWSDlubPpnaLlsZXplovvvInjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGxpdCAtIOWGhuOBruWGhuWRqOOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIOWGhuOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgY2lyY2xlRGF0YSA9IGdsMy5NZXNoLmNpcmNsZSg2NCwgMS4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjaXJjbGUoc3BsaXQsIHJhZCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqID0gMDtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIHBvcy5wdXNoKDAuMCwgMC4wLCAwLjApO1xyXG4gICAgICAgIG5vci5wdXNoKDAuMCwgMC4wLCAxLjApO1xyXG4gICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICBzdC5wdXNoKDAuNSwgMC41KTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBzcGxpdDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLlBJICogMi4wIC8gc3BsaXQgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnggPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ5ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIHBvcy5wdXNoKHJ4ICogcmFkLCByeSAqIHJhZCwgMC4wKTtcclxuICAgICAgICAgICAgbm9yLnB1c2goMC4wLCAwLjAsIDEuMCk7XHJcbiAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICAgICAgc3QucHVzaCgocnggKyAxLjApICogMC41LCAxLjAgLSAocnkgKyAxLjApICogMC41KTtcclxuICAgICAgICAgICAgaWYoaSA9PT0gc3BsaXQgLSAxKXtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKDAsIGogKyAxLCAxKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaCgwLCBqICsgMSwgaiArIDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICsrajtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kt44Ol44O844OW44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lkZSAtIOato+eri+aWueS9k+OBruS4gOi+uuOBrumVt+OBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5og4oC744Kt44Ol44O844OW44Gu5Lit5b+D44GL44KJ5ZCE6aCC54K544Gr5ZCR44GL44Gj44Gm5Ly444Gz44KL44OZ44Kv44OI44Or44Gq44Gu44Gn5rOo5oSPXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IGN1YmVEYXRhID0gZ2wzLk1lc2guY3ViZSgyLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGN1YmUoc2lkZSwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBocyA9IHNpZGUgKiAwLjU7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtcclxuICAgICAgICAgICAgLWhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocyxcclxuICAgICAgICAgICAgLWhzLCAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAtaHMsIC1ocyxcclxuICAgICAgICAgICAgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocyxcclxuICAgICAgICAgICAgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgLWhzLCAtaHMsICBocyxcclxuICAgICAgICAgICAgIGhzLCAtaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsICBocyxcclxuICAgICAgICAgICAgLWhzLCAtaHMsIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsIC1oc1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IHYgPSAxLjAgLyBNYXRoLnNxcnQoMy4wKTtcclxuICAgICAgICBsZXQgbm9yID0gW1xyXG4gICAgICAgICAgICAtdiwgLXYsICB2LCAgdiwgLXYsICB2LCAgdiwgIHYsICB2LCAtdiwgIHYsICB2LFxyXG4gICAgICAgICAgICAtdiwgLXYsIC12LCAtdiwgIHYsIC12LCAgdiwgIHYsIC12LCAgdiwgLXYsIC12LFxyXG4gICAgICAgICAgICAtdiwgIHYsIC12LCAtdiwgIHYsICB2LCAgdiwgIHYsICB2LCAgdiwgIHYsIC12LFxyXG4gICAgICAgICAgICAtdiwgLXYsIC12LCAgdiwgLXYsIC12LCAgdiwgLXYsICB2LCAtdiwgLXYsICB2LFxyXG4gICAgICAgICAgICAgdiwgLXYsIC12LCAgdiwgIHYsIC12LCAgdiwgIHYsICB2LCAgdiwgLXYsICB2LFxyXG4gICAgICAgICAgICAtdiwgLXYsIC12LCAtdiwgLXYsICB2LCAtdiwgIHYsICB2LCAtdiwgIHYsIC12XHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgY29sID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHBvcy5sZW5ndGggLyAzOyBpKyspe1xyXG4gICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzdCA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGlkeCA9IFtcclxuICAgICAgICAgICAgIDAsICAxLCAgMiwgIDAsICAyLCAgMyxcclxuICAgICAgICAgICAgIDQsICA1LCAgNiwgIDQsICA2LCAgNyxcclxuICAgICAgICAgICAgIDgsICA5LCAxMCwgIDgsIDEwLCAxMSxcclxuICAgICAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSxcclxuICAgICAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSxcclxuICAgICAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyM1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LiJ6KeS6YyQ44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BsaXQgLSDlupXpnaLlhobjga7lhoblkajjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgLSDlupXpnaLlhobjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDkuInop5LpjJDjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IGNvbmVEYXRhID0gZ2wzLk1lc2guY29uZSg2NCwgMS4wLCAyLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbmUoc3BsaXQsIHJhZCwgaGVpZ2h0LCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGogPSAwO1xyXG4gICAgICAgIGxldCBoID0gaGVpZ2h0IC8gMi4wO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgcG9zLnB1c2goMC4wLCAtaCwgMC4wKTtcclxuICAgICAgICBub3IucHVzaCgwLjAsIC0xLjAsIDAuMCk7XHJcbiAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIHN0LnB1c2goMC41LCAwLjUpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSBzcGxpdDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLlBJICogMi4wIC8gc3BsaXQgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnggPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ6ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIHBvcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgcnggKiByYWQsIC1oLCByeiAqIHJhZCxcclxuICAgICAgICAgICAgICAgIHJ4ICogcmFkLCAtaCwgcnogKiByYWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbm9yLnB1c2goXHJcbiAgICAgICAgICAgICAgICAwLjAsIC0xLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgIHJ4LCAwLjAsIHJ6XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNvbC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBzdC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNSxcclxuICAgICAgICAgICAgICAgIChyeCArIDEuMCkgKiAwLjUsIDEuMCAtIChyeiArIDEuMCkgKiAwLjVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYoaSAhPT0gc3BsaXQpe1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goMCwgaiArIDEsIGogKyAzKTtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKGogKyA0LCBqICsgMiwgc3BsaXQgKiAyICsgMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaiArPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwb3MucHVzaCgwLjAsIGgsIDAuMCk7XHJcbiAgICAgICAgbm9yLnB1c2goMC4wLCAxLjAsIDAuMCk7XHJcbiAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIHN0LnB1c2goMC41LCAwLjUpO1xyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWGhuafseOBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwbGl0IC0g5YaG5p+x44Gu5YaG5ZGo44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9wUmFkIC0g5YaG5p+x44Gu5aSp6Z2i44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm90dG9tUmFkIC0g5YaG5p+x44Gu5bqV6Z2i44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g5YaG5p+x44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBjeWxpbmRlckRhdGEgPSBnbDMuTWVzaC5jeWxpbmRlcig2NCwgMC41LCAxLjAsIDIuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3lsaW5kZXIoc3BsaXQsIHRvcFJhZCwgYm90dG9tUmFkLCBoZWlnaHQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgaiA9IDI7XHJcbiAgICAgICAgbGV0IGggPSBoZWlnaHQgLyAyLjA7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBwb3MucHVzaCgwLjAsIGgsIDAuMCwgMC4wLCAtaCwgMC4wLCk7XHJcbiAgICAgICAgbm9yLnB1c2goMC4wLCAxLjAsIDAuMCwgMC4wLCAtMS4wLCAwLjApO1xyXG4gICAgICAgIGNvbC5wdXNoKFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICApO1xyXG4gICAgICAgIHN0LnB1c2goMC41LCAwLjUsIDAuNSwgMC41KTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gc3BsaXQ7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIuMCAvIHNwbGl0ICogaTtcclxuICAgICAgICAgICAgbGV0IHJ4ID0gTWF0aC5jb3Mocik7XHJcbiAgICAgICAgICAgIGxldCByeiA9IE1hdGguc2luKHIpO1xyXG4gICAgICAgICAgICBwb3MucHVzaChcclxuICAgICAgICAgICAgICAgIHJ4ICogdG9wUmFkLCAgaCwgcnogKiB0b3BSYWQsXHJcbiAgICAgICAgICAgICAgICByeCAqIHRvcFJhZCwgIGgsIHJ6ICogdG9wUmFkLFxyXG4gICAgICAgICAgICAgICAgcnggKiBib3R0b21SYWQsIC1oLCByeiAqIGJvdHRvbVJhZCxcclxuICAgICAgICAgICAgICAgIHJ4ICogYm90dG9tUmFkLCAtaCwgcnogKiBib3R0b21SYWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbm9yLnB1c2goXHJcbiAgICAgICAgICAgICAgICAwLjAsIDEuMCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgcngsIDAuMCwgcnosXHJcbiAgICAgICAgICAgICAgICAwLjAsIC0xLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgIHJ4LCAwLjAsIHJ6XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNvbC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM11cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgc3QucHVzaChcclxuICAgICAgICAgICAgICAgIChyeCArIDEuMCkgKiAwLjUsIDEuMCAtIChyeiArIDEuMCkgKiAwLjUsXHJcbiAgICAgICAgICAgICAgICAxLjAgLSBpIC8gc3BsaXQsIDAuMCxcclxuICAgICAgICAgICAgICAgIChyeCArIDEuMCkgKiAwLjUsIDEuMCAtIChyeiArIDEuMCkgKiAwLjUsXHJcbiAgICAgICAgICAgICAgICAxLjAgLSBpIC8gc3BsaXQsIDEuMFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZihpICE9PSBzcGxpdCl7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAwLCBqICsgNCwgaixcclxuICAgICAgICAgICAgICAgICAgICAxLCBqICsgMiwgaiArIDYsXHJcbiAgICAgICAgICAgICAgICAgICAgaiArIDUsIGogKyA3LCBqICsgMSxcclxuICAgICAgICAgICAgICAgICAgICBqICsgMSwgaiArIDcsIGogKyAzXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGogKz0gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55CD5L2T44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm93IC0g55CD44Gu57im5pa55ZCR77yI57ev5bqm5pa55ZCR77yJ44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIC0g55CD44Gu5qiq5pa55ZCR77yI57WM5bqm5pa55ZCR77yJ44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIC0g55CD44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBzcGhlcmVEYXRhID0gZ2wzLk1lc2guc3BoZXJlKDY0LCA2NCwgMS4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzcGhlcmUocm93LCBjb2x1bW4sIHJhZCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDw9IHJvdzsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLlBJIC8gcm93ICogaTtcclxuICAgICAgICAgICAgbGV0IHJ5ID0gTWF0aC5jb3Mocik7XHJcbiAgICAgICAgICAgIGxldCByciA9IE1hdGguc2luKHIpO1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPD0gY29sdW1uOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyID0gTWF0aC5QSSAqIDIgLyBjb2x1bW4gKiBqO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR4ID0gcnIgKiByYWQgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHkgPSByeSAqIHJhZDtcclxuICAgICAgICAgICAgICAgIGxldCB0eiA9IHJyICogcmFkICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ4ID0gcnIgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnogPSByciAqIE1hdGguc2luKHRyKTtcclxuICAgICAgICAgICAgICAgIHBvcy5wdXNoKHR4LCB0eSwgdHopO1xyXG4gICAgICAgICAgICAgICAgbm9yLnB1c2gocngsIHJ5LCByeik7XHJcbiAgICAgICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgICAgICAgICBzdC5wdXNoKDEgLSAxIC8gY29sdW1uICogaiwgMSAvIHJvdyAqIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHJvdzsgaSsrKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgY29sdW1uOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyAxLCByICsgY29sdW1uICsgMik7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMiwgciArIGNvbHVtbiArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODiOODvOODqeOCueOBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdyAtIOi8quOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbiAtIOODkeOCpOODl+aWremdouOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlyYWQgLSDjg5HjgqTjg5fmlq3pnaLjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcmFkIC0g44OR44Kk44OX5YWo5L2T44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCB0b3J1c0RhdGEgPSBnbDMuTWVzaC50b3J1cyg2NCwgNjQsIDAuMjUsIDAuNzUsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvcnVzKHJvdywgY29sdW1uLCBpcmFkLCBvcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyIC8gcm93ICogaTtcclxuICAgICAgICAgICAgbGV0IHJyID0gTWF0aC5jb3Mocik7XHJcbiAgICAgICAgICAgIGxldCByeSA9IE1hdGguc2luKHIpO1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPD0gY29sdW1uOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyID0gTWF0aC5QSSAqIDIgLyBjb2x1bW4gKiBqO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR4ID0gKHJyICogaXJhZCArIG9yYWQpICogTWF0aC5jb3ModHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR5ID0gcnkgKiBpcmFkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR6ID0gKHJyICogaXJhZCArIG9yYWQpICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ4ID0gcnIgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnogPSByciAqIE1hdGguc2luKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCBycyA9IDEgLyBjb2x1bW4gKiBqO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ0ID0gMSAvIHJvdyAqIGkgKyAwLjU7XHJcbiAgICAgICAgICAgICAgICBpZihydCA+IDEuMCl7cnQgLT0gMS4wO31cclxuICAgICAgICAgICAgICAgIHJ0ID0gMS4wIC0gcnQ7XHJcbiAgICAgICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcclxuICAgICAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xyXG4gICAgICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgICAgICAgICAgc3QucHVzaChycywgcnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHJvdzsgaSsrKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgY29sdW1uOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAxLCByICsgMSk7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaChyICsgY29sdW1uICsgMSwgciArIGNvbHVtbiArIDIsIHIgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraPkuozljYHpnaLkvZPjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgLSDjgrXjgqTjgrrvvIjpu4Tph5Hmr5Tjgavlr77jgZnjgovmr5TnjofvvIlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IGljb3NhRGF0YSA9IGdsMy5NZXNoLmljb3NhaGVkcm9uKDEuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaWNvc2FoZWRyb24ocmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBsZXQgYyA9ICgxLjAgKyBNYXRoLnNxcnQoNS4wKSkgLyAyLjA7XHJcbiAgICAgICAgbGV0IHQgPSBjICogcmFkO1xyXG4gICAgICAgIGxldCBsID0gTWF0aC5zcXJ0KDEuMCArIGMgKiBjKTtcclxuICAgICAgICBsZXQgciA9IFsxLjAgLyBsLCBjIC8gbF07XHJcbiAgICAgICAgcG9zID0gW1xyXG4gICAgICAgICAgICAtcmFkLCAgICB0LCAgMC4wLCAgcmFkLCAgICB0LCAgMC4wLCAtcmFkLCAgIC10LCAgMC4wLCAgcmFkLCAgIC10LCAgMC4wLFxyXG4gICAgICAgICAgICAgMC4wLCAtcmFkLCAgICB0LCAgMC4wLCAgcmFkLCAgICB0LCAgMC4wLCAtcmFkLCAgIC10LCAgMC4wLCAgcmFkLCAgIC10LFxyXG4gICAgICAgICAgICAgICB0LCAgMC4wLCAtcmFkLCAgICB0LCAgMC4wLCAgcmFkLCAgIC10LCAgMC4wLCAtcmFkLCAgIC10LCAgMC4wLCAgcmFkXHJcbiAgICAgICAgXTtcclxuICAgICAgICBub3IgPSBbXHJcbiAgICAgICAgICAgIC1yWzBdLCAgclsxXSwgICAwLjAsICByWzBdLCAgclsxXSwgICAwLjAsIC1yWzBdLCAtclsxXSwgICAwLjAsICByWzBdLCAtclsxXSwgICAwLjAsXHJcbiAgICAgICAgICAgICAgMC4wLCAtclswXSwgIHJbMV0sICAgMC4wLCAgclswXSwgIHJbMV0sICAgMC4wLCAtclswXSwgLXJbMV0sICAgMC4wLCAgclswXSwgLXJbMV0sXHJcbiAgICAgICAgICAgICByWzFdLCAgIDAuMCwgLXJbMF0sICByWzFdLCAgIDAuMCwgIHJbMF0sIC1yWzFdLCAgIDAuMCwgLXJbMF0sIC1yWzFdLCAgIDAuMCwgIHJbMF1cclxuICAgICAgICBdO1xyXG4gICAgICAgIGNvbCA9IFtcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IG5vci5sZW5ndGg7IGkgPCBqOyBpICs9IDMpe1xyXG4gICAgICAgICAgICBsZXQgdSA9IChNYXRoLmF0YW4yKG5vcltpICsgMl0sIC1ub3JbaV0pICsgTWF0aC5QSSkgLyAoTWF0aC5QSSAqIDIuMCk7XHJcbiAgICAgICAgICAgIGxldCB2ID0gMS4wIC0gKG5vcltpICsgMV0gKyAxLjApIC8gMi4wO1xyXG4gICAgICAgICAgICBzdC5wdXNoKHUsIHYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZHggPSBbXHJcbiAgICAgICAgICAgICAwLCAxMSwgIDUsICAwLCAgNSwgIDEsICAwLCAgMSwgIDcsICAwLCAgNywgMTAsICAwLCAxMCwgMTEsXHJcbiAgICAgICAgICAgICAxLCAgNSwgIDksICA1LCAxMSwgIDQsIDExLCAxMCwgIDIsIDEwLCAgNywgIDYsICA3LCAgMSwgIDgsXHJcbiAgICAgICAgICAgICAzLCAgOSwgIDQsICAzLCAgNCwgIDIsICAzLCAgMiwgIDYsICAzLCAgNiwgIDgsICAzLCAgOCwgIDksXHJcbiAgICAgICAgICAgICA0LCAgOSwgIDUsICAyLCAgNCwgMTEsICA2LCAgMiwgMTAsICA4LCAgNiwgIDcsICA5LCAgOCwgIDFcclxuICAgICAgICBdO1xyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzTWVzaC5qcyIsIlxyXG4vKipcclxuICogZ2wzVXRpbFxyXG4gKiBAY2xhc3MgZ2wzVXRpbFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzVXRpbCB7XHJcbiAgICAvKipcclxuICAgICAqIEhTViDjgqvjg6njg7zjgpLnlJ/miJDjgZfjgabphY3liJfjgafov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoIC0g6Imy55u4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcyAtIOW9qeW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHYgLSDmmI7luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhIC0g44Ki44Or44OV44KhXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gr5q2j6KaP5YyW44GX44Gf6Imy44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBoc3ZhKGgsIHMsIHYsIGEpe1xyXG4gICAgICAgIGlmKHMgPiAxIHx8IHYgPiAxIHx8IGEgPiAxKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCB0aCA9IGggJSAzNjA7XHJcbiAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKHRoIC8gNjApO1xyXG4gICAgICAgIGxldCBmID0gdGggLyA2MCAtIGk7XHJcbiAgICAgICAgbGV0IG0gPSB2ICogKDEgLSBzKTtcclxuICAgICAgICBsZXQgbiA9IHYgKiAoMSAtIHMgKiBmKTtcclxuICAgICAgICBsZXQgayA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcclxuICAgICAgICBsZXQgY29sb3IgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBpZighcyA+IDAgJiYgIXMgPCAwKXtcclxuICAgICAgICAgICAgY29sb3IucHVzaCh2LCB2LCB2LCBhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgciA9IG5ldyBBcnJheSh2LCBuLCBtLCBtLCBrLCB2KTtcclxuICAgICAgICAgICAgbGV0IGcgPSBuZXcgQXJyYXkoaywgdiwgdiwgbiwgbSwgbSk7XHJcbiAgICAgICAgICAgIGxldCBiID0gbmV3IEFycmF5KG0sIG0sIGssIHYsIHYsIG4pO1xyXG4gICAgICAgICAgICBjb2xvci5wdXNoKHJbaV0sIGdbaV0sIGJbaV0sIGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg7zjgrjjg7PjgrBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IC0gMC4wIOOBi+OCiSAxLjAg44Gu5YCkXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOOCpOODvOOCuOODs+OCsOOBl+OBn+e1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZWFzZUxpbmVyKHQpe1xyXG4gICAgICAgIHJldHVybiB0IDwgMC41ID8gNCAqIHQgKiB0ICogdCA6ICh0IC0gMSkgKiAoMiAqIHQgLSAyKSAqICgyICogdCAtIDIpICsgMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCpOODvOOCuOODs+OCsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgLSAwLjAg44GL44KJIDEuMCDjga7lgKRcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Kk44O844K444Oz44Kw44GX44Gf57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlYXNlT3V0Q3ViaWModCl7XHJcbiAgICAgICAgcmV0dXJuICh0ID0gdCAvIDEgLSAxKSAqIHQgKiB0ICsgMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCpOODvOOCuOODs+OCsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgLSAwLjAg44GL44KJIDEuMCDjga7lgKRcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Kk44O844K444Oz44Kw44GX44Gf57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlYXNlUXVpbnRpYyh0KXtcclxuICAgICAgICBsZXQgdHMgPSAodCA9IHQgLyAxKSAqIHQ7XHJcbiAgICAgICAgbGV0IHRjID0gdHMgKiB0O1xyXG4gICAgICAgIHJldHVybiAodGMgKiB0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDluqbmlbDms5Xjga7op5LluqbjgYvjgonlvKfluqbms5Xjga7lgKTjgbjlpInmj5vjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWcgLSDluqbmlbDms5Xjga7op5LluqZcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g5byn5bqm5rOV44Gu5YCkXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZWdUb1JhZChkZWcpe1xyXG4gICAgICAgIHJldHVybiAoZGVnICUgMzYwKSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaTpgZPljYrlvoTvvIhrbe+8iVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBFQVJUSF9SQURJVVMoKXtyZXR1cm4gNjM3OC4xMzc7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWk6YGT5YaG5ZGo77yIa23vvIlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRUFSVEhfQ0lSQ1VNKCl7cmV0dXJuIGdsM1V0aWwuRUFSVEhfUkFESVVTICogTWF0aC5QSSAqIDIuMDt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaTpgZPlhoblkajjga7ljYrliIbvvIhrbe+8iVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBFQVJUSF9IQUxGX0NJUkNVTSgpe3JldHVybiBnbDNVdGlsLkVBUlRIX1JBRElVUyAqIE1hdGguUEk7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KL5pyA5aSn57ev5bqmXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEVBUlRIX01BWF9MQVQoKXtyZXR1cm4gODUuMDUxMTI4Nzg7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57WM5bqm44KS5YWD44Gr44Oh44Or44Kr44OI44Or5bqn5qiZ44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBYXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb25Ub01lcihsb24pe1xyXG4gICAgICAgIHJldHVybiBnbDNVdGlsLkVBUlRIX1JBRElVUyAqIGdsM1V0aWwuZGVnVG9SYWQobG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe3r+W6puOCkuWFg+OBq+ODoeODq+OCq+ODiOODq+W6p+aomeOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtmbGF0dGVuPTBdIC0g5omB5bmz546HXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBZXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsYXRUb01lcihsYXQsIGZsYXR0ZW4gPSAwKXtcclxuICAgICAgICBsZXQgZmxhdHRlbmluZyA9IGZsYXR0ZW47XHJcbiAgICAgICAgaWYoaXNOYU4ocGFyc2VGbG9hdChmbGF0dGVuKSkpe1xyXG4gICAgICAgICAgICBmbGF0dGVuaW5nID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNsYW1wID0gMC4wMDAxO1xyXG4gICAgICAgIGlmKGxhdCA+PSA5MCAtIGNsYW1wKXtcclxuICAgICAgICAgICAgbGF0ID0gOTAgLSBjbGFtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYobGF0IDw9IC05MCArIGNsYW1wKXtcclxuICAgICAgICAgICAgbGF0ID0gLTkwICsgY2xhbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0ZW1wID0gKDEgLSBmbGF0dGVuaW5nKTtcclxuICAgICAgICBsZXQgZXMgPSAxLjAgLSAodGVtcCAqIHRlbXApO1xyXG4gICAgICAgIGxldCBlY2NlbnQgPSBNYXRoLnNxcnQoZXMpO1xyXG4gICAgICAgIGxldCBwaGkgPSBnbDNVdGlsLmRlZ1RvUmFkKGxhdCk7XHJcbiAgICAgICAgbGV0IHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XHJcbiAgICAgICAgbGV0IGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcclxuICAgICAgICBsZXQgY29tID0gMC41ICogZWNjZW50O1xyXG4gICAgICAgIGNvbiA9IE1hdGgucG93KCgxLjAgLSBjb24pIC8gKDEuMCArIGNvbiksIGNvbSk7XHJcbiAgICAgICAgbGV0IHRzID0gTWF0aC50YW4oMC41ICogKE1hdGguUEkgKiAwLjUgLSBwaGkpKSAvIGNvbjtcclxuICAgICAgICByZXR1cm4gZ2wzVXRpbC5FQVJUSF9SQURJVVMgKiBNYXRoLmxvZyh0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnt6/luqbntYzluqbjgpLjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavlpInmj5vjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZmxhdHRlbj0wXSAtIOaJgeW5s+eOh1xyXG4gICAgICogQHJldHVybiB7b2JqfVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHggLSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWCDluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5IC0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFkg5bqn5qiZXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb25MYXRUb01lcihsb24sIGxhdCwgZmxhdHRlbiA9IDApe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IGdsM1V0aWwubG9uVG9NZXIobG9uKSxcclxuICAgICAgICAgICAgeTogZ2wzVXRpbC5sYXRUb01lcihsYXQsIGZsYXR0ZW5pbmcpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODoeODq+OCq+ODiOODq+W6p+aomeOCkue3r+W6pue1jOW6puOBq+WkieaPm+OBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWCDluqfmqJlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFkg5bqn5qiZXHJcbiAgICAgKiBAcmV0dXJuIHtvYmp9XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBtZXJUb0xvbkxhdCh4LCB5KXtcclxuICAgICAgICBsZXQgbG9uID0gKHggLyBnbDNVdGlsLkVBUlRIX0hBTEZfQ0lSQ1VNKSAqIDE4MDtcclxuICAgICAgICBsZXQgbGF0ID0gKHkgLyBnbDNVdGlsLkVBUlRIX0hBTEZfQ0lSQ1VNKSAqIDE4MDtcclxuICAgICAgICBsYXQgPSAxODAgLyBNYXRoLlBJICogKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAobGF0ICogTWF0aC5QSSAvIDE4MCkpIC0gTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvbjogbG9uLFxyXG4gICAgICAgICAgICBsYXQ6IGxhdFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDntYzluqbjgYvjgonjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe1jOW6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9uVG9UaWxlKGxvbiwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGxvbiAvIDE4MCArIDEpICogTWF0aC5wb3coMiwgem9vbSkgLyAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe3r+W6puOBi+OCieOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g57ev5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsYXRUb1RpbGUobGF0LCB6b29tKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoLU1hdGgubG9nKE1hdGgudGFuKCg0NSArIGxhdCAvIDIpICogTWF0aC5QSSAvIDE4MCkpICsgTWF0aC5QSSkgKiBNYXRoLnBvdygyLCB6b29tKSAvICgyICogTWF0aC5QSSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57ev5bqm57WM5bqm44KS44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544Gr5aSJ5o+b44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7b2JqfVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxvbiAtIOe1jOW6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxhdCAtIOe3r+W6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9uTGF0VG9UaWxlKGxvbiwgbGF0LCB6b29tKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb246IGdsM1V0aWwubG9uVG9UaWxlKGxvbiwgem9vbSksXHJcbiAgICAgICAgICAgIGxhdDogZ2wzVXRpbC5sYXRUb1RpbGUobGF0LCB6b29tKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgYvjgonntYzluqbjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe1jOW6plxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdGlsZVRvTG9uKGxvbiwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIChsb24gLyBNYXRoLnBvdygyLCB6b29tKSkgKiAzNjAgLSAxODA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgYvjgonnt6/luqbjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe3r+W6plxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdGlsZVRvTGF0KGxhdCwgem9vbSl7XHJcbiAgICAgICAgbGV0IHkgPSAobGF0IC8gTWF0aC5wb3coMiwgem9vbSkpICogMiAqIE1hdGguUEkgLSBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiAyICogTWF0aC5hdGFuKE1hdGgucG93KE1hdGguRSwgLXkpKSAqIDE4MCAvIE1hdGguUEkgLSA5MDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOBi+OCiee3r+W6pue1jOW6puOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge29ian1cclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb24gLSDntYzluqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYXQgLSDnt6/luqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRpbGVUb0xvbkxhdChsb24sIGxhdCwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9uOiBnbDNVdGlsLnRpbGVUb0xvbihsb24sIHpvb20pLFxyXG4gICAgICAgICAgICBsYXQ6IGdsM1V0aWwudGlsZVRvTGF0KGxhdCwgem9vbSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNVdGlsLmpzIiwiXHJcbmltcG9ydCBhdWRpbyBmcm9tICcuL2dsM0F1ZGlvLmpzJztcclxuaW1wb3J0IG1hdGggIGZyb20gJy4vZ2wzTWF0aC5qcyc7XHJcbmltcG9ydCBtZXNoICBmcm9tICcuL2dsM01lc2guanMnO1xyXG5pbXBvcnQgdXRpbCAgZnJvbSAnLi9nbDNVdGlsLmpzJztcclxuaW1wb3J0IGd1aSAgIGZyb20gJy4vZ2wzR3VpLmpzJztcclxuXHJcbi8qKlxyXG4gKiBnbGN1YmljXHJcbiAqIEBjbGFzcyBnbDNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsMyB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHZlcnNpb25cclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVkVSU0lPTiA9ICcwLjIuMic7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGkgKiAyXHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlBJMiA9IDYuMjgzMTg1MzA3MTc5NTg2NDc2OTI1Mjg2NzY2NTU5MDA1NzY7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGlcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTUwMjg4O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBpIC8gMlxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5QSUggPSAxLjU3MDc5NjMyNjc5NDg5NjYxOTIzMTMyMTY5MTYzOTc1MTQ0O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBpIC8gNFxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5QSUgyID0gMC43ODUzOTgxNjMzOTc0NDgzMDk2MTU2NjA4NDU4MTk4NzU3MjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbC5NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyDjgpLliKnnlKjjgZfjgablvpfjgonjgozjgovjg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjga7mnIDlpKfliKnnlKjlj6/og73mlbBcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2xjdWJpYyDjgYzmraPjgZfjgY/liJ3mnJ/ljJbjgZXjgozjgZ/jganjgYbjgYvjga7jg5Xjg6njgrBcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2xjdWJpYyDjgajntJDku5jjgYTjgabjgYTjgosgY2FudmFzIGVsZW1lbnRcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsY3ViaWMg44Go57SQ5LuY44GE44Gm44GE44KLIGNhbnZhcyDjgYvjgonlj5blvpfjgZfjgZ8gV2ViR0wgUmVuZGVyaW5nIENvbnRleHRcclxuICAgICAgICAgKiBAdHlwZSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2wgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQg44Go44GX44Gm5Yid5pyf5YyW44GX44Gf44GL44Gp44GG44GL44KS6KGo44GZ55yf5YG95YCkXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pc1dlYkdMMiA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGN1YmljIOOBqOOBl+OBpuOBruODreOCsOWHuuWKm+OCkuOBmeOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICAgICAqIEB0eXBlIHtib29sfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaXNDb25zb2xlT3V0cHV0ID0gdHJ1ZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBo+OBpuOBhOOCi+ODhuOCr+OCueODgeODo+agvOe0jeeUqOOBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48V2ViR0xUZXh0dXJlPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRleHR1cmVzID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXZWJHTCDjga7mi6HlvLXmqZ/og73jgpLmoLzntI3jgZnjgovjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZXh0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzQXVkaW8g44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHR5cGUge2dsM0F1ZGlvfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuQXVkaW8gPSBhdWRpbztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNNZXNoIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNNZXNofVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuTWVzaCA9IG1lc2g7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzVXRpbCDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzVXRpbH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlV0aWwgPSB1dGlsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsM0d1aSDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzR3VpfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuR3VpID0gbmV3IGd1aSgpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsM01hdGgg44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHR5cGUge2dsM01hdGh9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5NYXRoID0gbmV3IG1hdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsY3ViaWMg44KS5Yid5pyf5YyW44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fHN0cmluZ30gY2FudmFzIC0gY2FudmFzIGVsZW1lbnQg44GLIGNhbnZhcyDjgavku5jkuI7jgZXjgozjgabjgYTjgosgSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5pdE9wdGlvbnMgLSBjYW52YXMuZ2V0Q29udGV4dCDjgafnrKzkuozlvJXmlbDjgavmuKHjgZnliJ3mnJ/ljJbmmYLjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdWJpY09wdGlvbnNcclxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gd2ViZ2wyTW9kZSAtIHdlYmdsMiDjgpLmnInlirnljJbjgZnjgovloLTlkIggdHJ1ZVxyXG4gICAgICogQHByb3BlcnR5IHtib29sfSBjb25zb2xlTWVzc2FnZSAtIGNvbnNvbGUg44GrIGN1YmljIOOBruODreOCsOOCkuWHuuWKm+OBmeOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0g5Yid5pyf5YyW44GM5q2j44GX44GP6KGM44KP44KM44Gf44GL44Gp44GG44GL44KS6KGo44GZ55yf5YG95YCkXHJcbiAgICAgKi9cclxuICAgIGluaXQoY2FudmFzLCBpbml0T3B0aW9ucywgY3ViaWNPcHRpb25zKXtcclxuICAgICAgICBsZXQgb3B0ID0gaW5pdE9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIGlmKGNhbnZhcyA9PSBudWxsKXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIGlmKGNhbnZhcyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfWVsc2UgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGNhbnZhcykgPT09ICdbb2JqZWN0IFN0cmluZ10nKXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmNhbnZhcyA9PSBudWxsKXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIGlmKGN1YmljT3B0aW9ucyAhPSBudWxsKXtcclxuICAgICAgICAgICAgaWYoY3ViaWNPcHRpb25zLmhhc093blByb3BlcnR5KCd3ZWJnbDJNb2RlJykgPT09IHRydWUgJiYgY3ViaWNPcHRpb25zLndlYmdsMk1vZGUgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsMicsIG9wdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzV2ViR0wyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihjdWJpY09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NvbnNvbGVNZXNzYWdlJykgPT09IHRydWUgJiYgY3ViaWNPcHRpb25zLmNvbnNvbGVNZXNzYWdlICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25zb2xlT3V0cHV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtcclxuICAgICAgICAgICAgdGhpcy5nbCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgb3B0KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJywgb3B0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5nbCAhPSBudWxsKXtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UID0gdGhpcy5nbC5nZXRQYXJhbWV0ZXIodGhpcy5nbC5NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXMgPSBuZXcgQXJyYXkodGhpcy5URVhUVVJFX1VOSVRfQ09VTlQpO1xyXG4gICAgICAgICAgICB0aGlzLmV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRJbmRleFVpbnQ6IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfZWxlbWVudF9pbmRleF91aW50JyksXHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlRmxvYXQ6IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpLFxyXG4gICAgICAgICAgICAgICAgdGV4dHVyZUhhbGZGbG9hdDogdGhpcy5nbC5nZXRFeHRlbnNpb24oJ09FU190ZXh0dXJlX2hhbGZfZmxvYXQnKSxcclxuICAgICAgICAgICAgICAgIGRyYXdCdWZmZXJzOiB0aGlzLmdsLmdldEV4dGVuc2lvbignV0VCR0xfZHJhd19idWZmZXJzJylcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgZ2xjdWJpYy5qcyAlY+KXhiVjIDogdmVyc2lvbiAlYycgKyB0aGlzLlZFUlNJT04sICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiByb3lhbGJsdWUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOCkuOCr+ODquOCouOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDjgq/jg6rjgqLjgZnjgovoibLvvIgwLjAgfiAxLjDvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZGVwdGhdIC0g44Kv44Oq44Ki44GZ44KL5rex5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0ZW5jaWxdIC0g44Kv44Oq44Ki44GZ44KL44K544OG44Oz44K344Or5YCkXHJcbiAgICAgKi9cclxuICAgIHNjZW5lQ2xlYXIoY29sb3IsIGRlcHRoLCBzdGVuY2lsKXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCBmbGcgPSBnbC5DT0xPUl9CVUZGRVJfQklUO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIGlmKGRlcHRoICE9IG51bGwpe1xyXG4gICAgICAgICAgICBnbC5jbGVhckRlcHRoKGRlcHRoKTtcclxuICAgICAgICAgICAgZmxnID0gZmxnIHwgZ2wuREVQVEhfQlVGRkVSX0JJVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3RlbmNpbCAhPSBudWxsKXtcclxuICAgICAgICAgICAgZ2wuY2xlYXJTdGVuY2lsKHN0ZW5jaWwpO1xyXG4gICAgICAgICAgICBmbGcgPSBmbGcgfCBnbC5TVEVOQ0lMX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLmNsZWFyKGZsZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Pjg6Xjg7zjg53jg7zjg4jjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeF0gLSB477yI5bem56uv5Y6f54K577yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ldIC0gee+8iOS4i+err+WOn+eCue+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aF0gLSDmqKrjga7luYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0XSAtIOe4puOBrumrmOOBlVxyXG4gICAgICovXHJcbiAgICBzY2VuZVZpZXcoeCwgeSwgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgICAgbGV0IFggPSB4IHx8IDA7XHJcbiAgICAgICAgbGV0IFkgPSB5IHx8IDA7XHJcbiAgICAgICAgbGV0IHcgPSB3aWR0aCAgfHwgd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSBoZWlnaHQgfHwgd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2wudmlld3BvcnQoWCwgWSwgdywgaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbC5kcmF3QXJyYXlzIOOCkuOCs+ODvOODq+OBmeOCi+ODqeODg+ODkeODvFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByaW1pdGl2ZSAtIOODl+ODquODn+ODhuOCo+ODluOCv+OCpOODl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlcnRleENvdW50IC0g5o+P55S744GZ44KL6aCC54K544Gu5YCL5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29mZnNldD0wXSAtIOaPj+eUu+OBmeOCi+mggueCueOBrumWi+Wni+OCquODleOCu+ODg+ODiFxyXG4gICAgICovXHJcbiAgICBkcmF3QXJyYXlzKHByaW1pdGl2ZSwgdmVydGV4Q291bnQsIG9mZnNldCA9IDApe1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyhwcmltaXRpdmUsIG9mZnNldCwgdmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2wuZHJhd0VsZW1lbnRzIOOCkuOCs+ODvOODq+OBmeOCi+ODqeODg+ODkeODvFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByaW1pdGl2ZSAtIOODl+ODquODn+ODhuOCo+ODluOCv+OCpOODl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4TGVuZ3RoIC0g5o+P55S744GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu5YCL5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29mZnNldD0wXSAtIOaPj+eUu+OBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBrumWi+Wni+OCquODleOCu+ODg+ODiFxyXG4gICAgICovXHJcbiAgICBkcmF3RWxlbWVudHMocHJpbWl0aXZlLCBpbmRleExlbmd0aCwgb2Zmc2V0ID0gMCl7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCBpbmRleExlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgb2Zmc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsLmRyYXdFbGVtZW50cyDjgpLjgrPjg7zjg6vjgZnjgovjg6njg4Pjg5Hjg7zvvIhnbC5VTlNJR05FRF9JTlTvvIkg4oC76KaB5ouh5by15qmf6IO977yIV2ViR0wgMS4w77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJpbWl0aXZlIC0g44OX44Oq44Of44OG44Kj44OW44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhMZW5ndGggLSDmj4/nlLvjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgIvmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTBdIC0g5o+P55S744GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu6ZaL5aeL44Kq44OV44K744OD44OIXHJcbiAgICAgKi9cclxuICAgIGRyYXdFbGVtZW50c0ludChwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCBvZmZzZXQgPSAwKXtcclxuICAgICAgICB0aGlzLmdsLmRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCB0aGlzLmdsLlVOU0lHTkVEX0lOVCwgb2Zmc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZCT++8iFZlcnRleCBCdWZmZXIgT2JqZWN077yJ44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBkYXRhIC0g6aCC54K55oOF5aCx44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTEJ1ZmZlcn0g55Sf5oiQ44GX44Gf6aCC54K544OQ44OD44OV44KhXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVZibyhkYXRhKXtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IHZibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2Ym8pO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICByZXR1cm4gdmJvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSUJP77yISW5kZXggQnVmZmVyIE9iamVjdO+8ieOCkueUn+aIkOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gZGF0YSAtIOOCpOODs+ODh+ODg+OCr+OCueaDheWgseOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7V2ViR0xCdWZmZXJ9IOeUn+aIkOOBl+OBn+OCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVJYm8oZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBpYm8gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgSW50MTZBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiBpYm87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJQk/vvIhJbmRleCBCdWZmZXIgT2JqZWN077yJ44KS55Sf5oiQ44GX44Gm6L+U44GZ77yIZ2wuVU5TSUdORURfSU5U77yJIOKAu+imgeaLoeW8teapn+iDve+8iFdlYkdMIDEuMO+8iVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gZGF0YSAtIOOCpOODs+ODh+ODg+OCr+OCueaDheWgseOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7V2ViR0xCdWZmZXJ9IOeUn+aIkOOBl+OBn+OCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVJYm9JbnQoZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBpYm8gPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDMyQXJyYXkoZGF0YSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICByZXR1cm4gaWJvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Kh44Kk44Or44KS5YWD44Gr44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIC0g44OV44Kh44Kk44Or44OR44K5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIOeUu+WDj+OBruODreODvOODieOBjOWujOS6huOBl+ODhuOCr+OCueODgeODo+OCkueUn+aIkOOBl+OBn+W+jOOBq+WRvOOBsOOCjOOCi+OCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVUZXh0dXJlRnJvbUZpbGUoc291cmNlLCBudW1iZXIsIGNhbGxiYWNrKXtcclxuICAgICAgICBpZihzb3VyY2UgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXgpO1xyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltZyk7XHJcbiAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZpbGUgbG9hZGVkOiAlYycgKyBzb3VyY2UsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2sgIT0gbnVsbCl7Y2FsbGJhY2sobnVtYmVyKTt9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kq44OW44K444Kn44Kv44OI44KS5YWD44Gr44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IC0g44Ot44O844OJ5riI44G/44GuIEltYWdlIOOCquODluOCuOOCp+OCr+ODiOOChCBDYW52YXMg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVRleHR1cmVGcm9tT2JqZWN0KG9iamVjdCwgbnVtYmVyKXtcclxuICAgICAgICBpZihvYmplY3QgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBvYmplY3QpO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIG9iamVjdCBhdHRhY2hlZCcsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44KS5YWD44Gr44Kt44Ol44O844OW44Oe44OD44OX44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBzb3VyY2UgLSDjg5XjgqHjgqTjg6vjg5HjgrnjgpLmoLzntI3jgZfjgZ/phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHRhcmdldCAtIOOCreODpeODvOODluODnuODg+ODl+ODhuOCr+OCueODgeODo+OBq+ioreWumuOBmeOCi+OCv+ODvOOCsuODg+ODiOOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSDnlLvlg4/jga7jg63jg7zjg4njgYzlrozkuobjgZfjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZfjgZ/lvozjgavlkbzjgbDjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAqL1xyXG4gICAgY3JlYXRlVGV4dHVyZUN1YmVGcm9tRmlsZShzb3VyY2UsIHRhcmdldCwgbnVtYmVyLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoc291cmNlID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGNJbWcgPSBbXTtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY0ltZ1tpXSA9IHtpbWFnZTogbmV3IEltYWdlKCksIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgICAgICBjSW1nW2ldLmltYWdlLm9ubG9hZCA9ICgoaW5kZXgpID0+IHtyZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY0ltZ1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKGNJbWcubGVuZ3RoID09PSA2KXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY0ltZy5tYXAoKHYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGYgJiYgdi5sb2FkZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZiA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgc291cmNlLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0W2pdLCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBjSW1nW2pdLmltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFX0NVQkVfTUFQKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmaWxlIGxvYWRlZDogJWMnICsgc291cmNlWzBdICsgJy4uLicsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2FsbGJhY2sgIT0gbnVsbCl7Y2FsbGJhY2sobnVtYmVyKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O30pKGkpO1xyXG4gICAgICAgICAgICBjSW1nW2ldLmltYWdlLnNyYyA9IHNvdXJjZVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbGN1YmljIOOBjOaMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCueOBqOODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiOOCkuaMh+WumuOBl+OBpuODhuOCr+OCueODgeODo+OCkuODkOOCpOODs+ODieOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHVuaXQgLSDjg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOaMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBiaW5kVGV4dHVyZSh1bml0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZ2wuYWN0aXZlVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkUwICsgdW5pdCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSwgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2xjdWJpYyDjgYzmjIHjgaTphY3liJflhoXjga7jg4bjgq/jgrnjg4Hjg6PnlKjnlLvlg4/jgYzlhajjgabjg63jg7zjg4nmuIjjgb/jgYvjganjgYbjgYvnorroqo3jgZnjgotcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOODreODvOODieOBjOWujOS6huOBl+OBpuOBhOOCi+OBi+OBqeOBhuOBi+OBruODleODqeOCsFxyXG4gICAgICovXHJcbiAgICBpc1RleHR1cmVMb2FkZWQoKXtcclxuICAgICAgICBsZXQgaSwgaiwgZiwgZztcclxuICAgICAgICBmID0gdHJ1ZTsgZyA9IGZhbHNlO1xyXG4gICAgICAgIGZvcihpID0gMCwgaiA9IHRoaXMudGV4dHVyZXMubGVuZ3RoOyBpIDwgajsgaSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy50ZXh0dXJlc1tpXSAhPSBudWxsKXtcclxuICAgICAgICAgICAgICAgIGcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZiA9IGYgJiYgdGhpcy50ZXh0dXJlc1tpXS5sb2FkZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZyl7cmV0dXJuIGY7fWVsc2V7cmV0dXJuIGZhbHNlO31cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOCkueUn+aIkOOBl+OCq+ODqeODvOODkOODg+ODleOCoeOBq+ODhuOCr+OCueODgeODo+OCkuioreWumuOBl+OBpuOCquODluOCuOOCp+OCr+ODiOOBqOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu5qiq5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IOeUn+aIkOOBl+OBn+WQhOeoruOCquODluOCuOOCp+OCr+ODiOOBr+ODqeODg+ODl+OBl+OBpui/lOWNtOOBmeOCi1xyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTEZyYW1lYnVmZmVyfSBmcmFtZWJ1ZmZlciAtIOODleODrOODvOODoOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFJlbmRlcmJ1ZmZlcn0gZGVwdGhSZW5kZXJCdWZmZXIgLSDmt7Hluqbjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg6zjg7Pjg4Djg7zjg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g44Kr44Op44O844OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44OG44Kv44K544OB44OjXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUZyYW1lYnVmZmVyKHdpZHRoLCBoZWlnaHQsIG51bWJlcil7XHJcbiAgICAgICAgaWYod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBsZXQgZnJhbWVCdWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIGxldCBkZXB0aFJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgZ2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGZUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlKTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUsIDApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3JlYXRlZCcsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFJlbmRlcmJ1ZmZlcjogZGVwdGhSZW5kZXJCdWZmZXIsIHRleHR1cmU6IGZUZXh0dXJlfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOCkueUn+aIkOOBl+OCq+ODqeODvOODkOODg+ODleOCoeOBq+ODhuOCr+OCueODgeODo+OCkuioreWumuOAgeOCueODhuODs+OCt+ODq+acieWKueOBp+OCquODluOCuOOCp+OCr+ODiOOBqOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu5qiq5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IOeUn+aIkOOBl+OBn+WQhOeoruOCquODluOCuOOCp+OCr+ODiOOBr+ODqeODg+ODl+OBl+OBpui/lOWNtOOBmeOCi1xyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTEZyYW1lYnVmZmVyfSBmcmFtZWJ1ZmZlciAtIOODleODrOODvOODoOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFJlbmRlcmJ1ZmZlcn0gZGVwdGhTdGVuY2lsUmVuZGVyYnVmZmVyIC0g5rex5bqm44OQ44OD44OV44Kh5YW844K544OG44Oz44K344Or44OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44Os44Oz44OA44O844OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOOCq+ODqeODvOODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODhuOCr+OCueODgeODo1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlclN0ZW5jaWwod2lkdGgsIGhlaWdodCwgbnVtYmVyKXtcclxuICAgICAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGxldCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9TVEVOQ0lMLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGZUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlKTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUsIDApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3JlYXRlZCAoZW5hYmxlIHN0ZW5jaWwpJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtmcmFtZWJ1ZmZlcjogZnJhbWVCdWZmZXIsIGRlcHRoU3RlbmNpbFJlbmRlcmJ1ZmZlcjogZGVwdGhTdGVuY2lsUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgavmta7li5XlsI/mlbDngrnjg4bjgq/jgrnjg4Hjg6PjgpLoqK3lrprjgZfjgabjgqrjg5bjgrjjgqfjgq/jg4jjgajjgZfjgabov5TjgZkg4oC76KaB5ouh5by15qmf6IO977yIV2ViR0wgMS4w77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7mqKrluYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0g55Sf5oiQ44GX44Gf5ZCE56iu44Kq44OW44K444Kn44Kv44OI44Gv44Op44OD44OX44GX44Gm6L+U5Y2044GZ44KLXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMRnJhbWVidWZmZXJ9IGZyYW1lYnVmZmVyIC0g44OV44Os44O844Og44OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMUmVuZGVyYnVmZmVyfSBkZXB0aFJlbmRlckJ1ZmZlciAtIOa3seW6puODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODrOODs+ODgOODvOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFRleHR1cmV9IHRleHR1cmUgLSDjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6NcclxuICAgICAqL1xyXG4gICAgY3JlYXRlRnJhbWVidWZmZXJGbG9hdCh3aWR0aCwgaGVpZ2h0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgaWYodGhpcy5leHQgPT0gbnVsbCB8fCAodGhpcy5leHQudGV4dHVyZUZsb2F0ID09IG51bGwgJiYgdGhpcy5leHQudGV4dHVyZUhhbGZGbG9hdCA9PSBudWxsKSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmbG9hdCB0ZXh0dXJlIG5vdCBzdXBwb3J0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgZmxnID0gKHRoaXMuZXh0LnRleHR1cmVGbG9hdCAhPSBudWxsKSA/IGdsLkZMT0FUIDogdGhpcy5leHQudGV4dHVyZUhhbGZGbG9hdC5IQUxGX0ZMT0FUX09FUztcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUpO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZmxnLCBudWxsKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUsIDApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjcmVhdGVkIChlbmFibGUgZmxvYXQpJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtmcmFtZWJ1ZmZlcjogZnJhbWVCdWZmZXIsIGRlcHRoUmVuZGVyYnVmZmVyOiBudWxsLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgavjgq3jg6Xjg7zjg5bjg4bjgq/jgrnjg4Hjg6PjgpLoqK3lrprjgZfjgabjgqrjg5bjgrjjgqfjgq/jg4jjgajjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBruaoquW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gdGFyZ2V0IC0g44Kt44Ol44O844OW44Oe44OD44OX44OG44Kv44K544OB44Oj44Gr6Kit5a6a44GZ44KL44K/44O844Ky44OD44OI44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IOeUn+aIkOOBl+OBn+WQhOeoruOCquODluOCuOOCp+OCr+ODiOOBr+ODqeODg+ODl+OBl+OBpui/lOWNtOOBmeOCi1xyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTEZyYW1lYnVmZmVyfSBmcmFtZWJ1ZmZlciAtIOODleODrOODvOODoOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFJlbmRlcmJ1ZmZlcn0gZGVwdGhSZW5kZXJCdWZmZXIgLSDmt7Hluqbjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg6zjg7Pjg4Djg7zjg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g44Kr44Op44O844OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44OG44Kv44K544OB44OjXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUZyYW1lYnVmZmVyQ3ViZSh3aWR0aCwgaGVpZ2h0LCB0YXJnZXQsIG51bWJlcil7XHJcbiAgICAgICAgaWYod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCB8fCB0YXJnZXQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBsZXQgZnJhbWVCdWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIGxldCBkZXB0aFJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgZ2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGZUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGZUZXh0dXJlKTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRCh0YXJnZXRbaV0sIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV9DVUJFX01BUDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGN1YmUgY3JlYXRlZCcsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFJlbmRlcmJ1ZmZlcjogZGVwdGhSZW5kZXJCdWZmZXIsIHRleHR1cmU6IGZUZXh0dXJlfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhUTUwg5YaF44Gr5a2Y5Zyo44GZ44KLIElEIOaWh+Wtl+WIl+OBi+OCiSBzY3JpcHQg44K/44Kw44KS5Y+C54Wn44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdnNJZCAtIOmggueCueOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBnyBzY3JpcHQg44K/44Kw44GuIElEIOaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZzSWQgLSDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgYzoqJjov7DjgZXjgozjgZ8gc2NyaXB0IOOCv+OCsOOBriBJRCDmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGF0dExvY2F0aW9uIC0gYXR0cmlidXRlIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXR0U3RyaWRlIC0gYXR0cmlidXRlIOWkieaVsOOBruOCueODiOODqeOCpOODieOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pTG9jYXRpb24gLSB1bmlmb3JtIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pVHlwZSAtIHVuaWZvcm0g5aSJ5pWw5pu05paw44Oh44K944OD44OJ44Gu5ZCN5YmN44KS56S644GZ5paH5a2X5YiXIOKAu+S+i++8midtYXRyaXg0ZnYnXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9ncmFtTWFuYWdlcn0g44OX44Ot44Kw44Op44Og44Oe44ON44O844K444Oj44O844Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tSWQodnNJZCwgZnNJZCwgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCwgdGhpcy5pc1dlYkdMMik7XHJcbiAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21JZCh2c0lkKTtcclxuICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbUlkKGZzSWQpO1xyXG4gICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgaWYobW5nLnByZyA9PSBudWxsKXtyZXR1cm4gbW5nO31cclxuICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXR0TG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcuYXR0TFtpXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICBtbmcuYXR0U1tpXSA9IGF0dFN0cmlkZVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB1bmlMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy51bmlMW2ldID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICByZXR1cm4gbW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Gu44K944O844K544Kz44O844OJ5paH5a2X5YiX44GL44KJ44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdnMgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmcyAtIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCveODvOOCuVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gYXR0TG9jYXRpb24gLSBhdHRyaWJ1dGUg5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRTdHJpZGUgLSBhdHRyaWJ1dGUg5aSJ5pWw44Gu44K544OI44Op44Kk44OJ44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlMb2NhdGlvbiAtIHVuaWZvcm0g5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlUeXBlIC0gdW5pZm9ybSDlpInmlbDmm7TmlrDjg6Hjgr3jg4Pjg4njga7lkI3liY3jgpLnpLrjgZnmloflrZfliJcg4oC75L6L77yaJ21hdHJpeDRmdidcclxuICAgICAqIEByZXR1cm4ge1Byb2dyYW1NYW5hZ2VyfSDjg5fjg63jgrDjg6njg6Djg57jg43jg7zjgrjjg6Pjg7zjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZ3JhbUZyb21Tb3VyY2UodnMsIGZzLCBhdHRMb2NhdGlvbiwgYXR0U3RyaWRlLCB1bmlMb2NhdGlvbiwgdW5pVHlwZSl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsLCB0aGlzLmlzV2ViR0wyKTtcclxuICAgICAgICBtbmcudnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZSh2cywgdGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShmcywgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgaWYobW5nLnByZyA9PSBudWxsKXtyZXR1cm4gbW5nO31cclxuICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXR0TG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcuYXR0TFtpXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICBtbmcuYXR0U1tpXSA9IGF0dFN0cmlkZVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB1bmlMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy51bmlMW2ldID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICByZXR1cm4gbW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Kh44Kk44Or44GL44KJ44K344Kn44O844OA44Gu44K944O844K544Kz44O844OJ44KS5Y+W5b6X44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdnNQYXRoIC0g6aCC54K544K344Kn44O844OA44Gu44K944O844K544GM6KiY6L+w44GV44KM44Gf44OV44Kh44Kk44Or44Gu44OR44K5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZnNQYXRoIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K944O844K544GM6KiY6L+w44GV44KM44Gf44OV44Kh44Kk44Or44Gu44OR44K5XHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBhdHRMb2NhdGlvbiAtIGF0dHJpYnV0ZSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGF0dFN0cmlkZSAtIGF0dHJpYnV0ZSDlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaUxvY2F0aW9uIC0gdW5pZm9ybSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaVR5cGUgLSB1bmlmb3JtIOWkieaVsOabtOaWsOODoeOCveODg+ODieOBruWQjeWJjeOCkuekuuOBmeaWh+Wtl+WIlyDigLvkvovvvJonbWF0cml4NGZ2J1xyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSDjgr3jg7zjgrnjgrPjg7zjg4njga7jg63jg7zjg4njgYzlrozkuobjgZfjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZfjgZ/lvozjgavlkbzjgbDjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAqIEByZXR1cm4ge1Byb2dyYW1NYW5hZ2VyfSDjg5fjg63jgrDjg6njg6Djg57jg43jg7zjgrjjg6Pjg7zjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7Pjgrkg4oC744Ot44O844OJ5YmN44Gr44Kk44Oz44K544K/44Oz44K544Gv5oi744KK5YCk44Go44GX44Gm6L+U5Y2044GV44KM44KLXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tRmlsZSh2c1BhdGgsIGZzUGF0aCwgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUsIGNhbGxiYWNrKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wsIHRoaXMuaXNXZWJHTDIpO1xyXG4gICAgICAgIGxldCBzcmMgPSB7XHJcbiAgICAgICAgICAgIHZzOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRVcmw6IHZzUGF0aCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmczoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXJsOiBmc1BhdGgsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyKHRoaXMuZ2wsIHNyYy52cyk7XHJcbiAgICAgICAgeGhyKHRoaXMuZ2wsIHNyYy5mcyk7XHJcbiAgICAgICAgZnVuY3Rpb24geGhyKGdsLCB0YXJnZXQpe1xyXG4gICAgICAgICAgICBsZXQgeG1sID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhtbC5vcGVuKCdHRVQnLCB0YXJnZXQudGFyZ2V0VXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ1ByYWdtYScsICduby1jYWNoZScpO1xyXG4gICAgICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICduby1jYWNoZScpO1xyXG4gICAgICAgICAgICB4bWwub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBzaGFkZXIgZmlsZSBsb2FkZWQ6ICVjJyArIHRhcmdldC50YXJnZXRVcmwsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNvdXJjZSA9IHhtbC5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAgICAgICBsb2FkQ2hlY2soZ2wpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4bWwuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2FkQ2hlY2soZ2wpe1xyXG4gICAgICAgICAgICBpZihzcmMudnMuc291cmNlID09IG51bGwgfHwgc3JjLmZzLnNvdXJjZSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgICAgICBsZXQgaTtcclxuICAgICAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc3JjLnZzLnNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHNyYy5mcy5zb3VyY2UsIGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgICAgIGlmKG1uZy5wcmcgPT0gbnVsbCl7cmV0dXJuIG1uZzt9XHJcbiAgICAgICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODkOODg+ODleOCoeOCquODluOCuOOCp+OCr+ODiOOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTEJ1ZmZlcn0gYnVmZmVyIC0g5YmK6Zmk44GZ44KL44OQ44OD44OV44Kh44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZUJ1ZmZlcihidWZmZXIpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuaXNCdWZmZXIoYnVmZmVyKSAhPT0gdHJ1ZSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZUJ1ZmZlcihidWZmZXIpO1xyXG4gICAgICAgIGJ1ZmZlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg4bjgq/jgrnjg4Hjg6Pjgqrjg5bjgrjjgqfjgq/jg4jjgpLliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g5YmK6Zmk44GZ44KL44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVRleHR1cmUodGV4dHVyZSl7XHJcbiAgICAgICAgaWYodGhpcy5nbC5pc1RleHR1cmUodGV4dHVyZSkgIT09IHRydWUpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xyXG4gICAgICAgIHRleHR1cmUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KE44Os44Oz44OA44O844OQ44OD44OV44Kh44KS5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqIC0g44OV44Os44O844Og44OQ44OD44OV44Kh55Sf5oiQ44Oh44K944OD44OJ44GM6L+U44GZ44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZUZyYW1lYnVmZmVyKG9iail7XHJcbiAgICAgICAgaWYob2JqID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgZm9yKGxldCB2IGluIG9iail7XHJcbiAgICAgICAgICAgIGlmKG9ialt2XSBpbnN0YW5jZW9mIFdlYkdMRnJhbWVidWZmZXIgJiYgdGhpcy5nbC5pc0ZyYW1lYnVmZmVyKG9ialt2XSkgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbC5kZWxldGVGcmFtZWJ1ZmZlcihvYmpbdl0pO1xyXG4gICAgICAgICAgICAgICAgb2JqW3ZdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG9ialt2XSBpbnN0YW5jZW9mIFdlYkdMUmVuZGVyYnVmZmVyICYmIHRoaXMuZ2wuaXNSZW5kZXJidWZmZXIob2JqW3ZdKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsLmRlbGV0ZVJlbmRlcmJ1ZmZlcihvYmpbdl0pO1xyXG4gICAgICAgICAgICAgICAgb2JqW3ZdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG9ialt2XSBpbnN0YW5jZW9mIFdlYkdMVGV4dHVyZSAmJiB0aGlzLmdsLmlzVGV4dHVyZShvYmpbdl0pID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2wuZGVsZXRlVGV4dHVyZShvYmpbdl0pO1xyXG4gICAgICAgICAgICAgICAgb2JqW3ZdID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvYmogPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OI44KS5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBzaGFkZXIgLSDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZGVsZXRlU2hhZGVyKHNoYWRlcil7XHJcbiAgICAgICAgaWYodGhpcy5nbC5pc1NoYWRlcihzaGFkZXIpICE9PSB0cnVlKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgc2hhZGVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW0gLSDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZGVsZXRlUHJvZ3JhbShwcm9ncmFtKXtcclxuICAgICAgICBpZih0aGlzLmdsLmlzUHJvZ3JhbShwcm9ncmFtKSAhPT0gdHJ1ZSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgcHJvZ3JhbSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9ncmFtTWFuYWdlciDjgq/jg6njgrnjgpLlhoXpg6jjg5fjg63jg5Hjg4bjgqPjgZTjgajliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7UHJvZ3JhbU1hbmFnZXJ9IHByZyAtIFByb2dyYW1NYW5hZ2VyIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9ncmFtTWFuYWdlcihwcmcpe1xyXG4gICAgICAgIGlmKHByZyA9PSBudWxsIHx8ICEocHJnIGluc3RhbmNlb2YgUHJvZ3JhbU1hbmFnZXIpKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZGVsZXRlU2hhZGVyKHByZy52cyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVTaGFkZXIocHJnLmZzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZVByb2dyYW0ocHJnLnByZyk7XHJcbiAgICAgICAgcHJnLmF0dEwgPSBudWxsO1xyXG4gICAgICAgIHByZy5hdHRTID0gbnVsbDtcclxuICAgICAgICBwcmcudW5pTCA9IG51bGw7XHJcbiAgICAgICAgcHJnLnVuaVQgPSBudWxsO1xyXG4gICAgICAgIHByZyA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgoTjgrfjgqfjg7zjg4DjgpLnrqHnkIbjgZnjgovjg57jg43jg7zjgrjjg6NcclxuICogQGNsYXNzIFByb2dyYW1NYW5hZ2VyXHJcbiAqL1xyXG5jbGFzcyBQcm9ncmFtTWFuYWdlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IGdsIC0g6Ieq6Lqr44GM5bGe44GZ44KLIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IFt3ZWJnbDJNb2RlPWZhbHNlXSAtIHdlYmdsMiDjgpLmnInlirnljJbjgZfjgZ/jgYvjganjgYbjgYtcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZ2wsIHdlYmdsMk1vZGUgPSBmYWxzZSl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Ieq6Lqr44GM5bGe44GZ44KLIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAgICAgICAgICogQHR5cGUge1dlYkdMUmVuZGVyaW5nQ29udGV4dH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmdsID0gZ2w7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCDjgajjgZfjgabliJ3mnJ/ljJbjgZfjgZ/jgYvjganjgYbjgYvjgpLooajjgZnnnJ/lgb3lgKRcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmlzV2ViR0wyID0gd2ViZ2wyTW9kZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpoILngrnjgrfjgqfjg7zjg4Djga7jgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAdHlwZSB7V2ViR0xTaGFkZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy52cyA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHR5cGUge1dlYkdMU2hhZGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZnMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFByb2dyYW19XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5wcmcgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCouODiOODquODk+ODpeODvOODiOODreOCseODvOOCt+ODp+ODs+OBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48bnVtYmVyPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmF0dEwgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCouODiOODquODk+ODpeODvOODiOWkieaVsOOBruOCueODiOODqeOCpOODieOBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48bnVtYmVyPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmF0dFMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODpuODi+ODleOCqeODvOODoOODreOCseODvOOCt+ODp+ODs+OBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48V2ViR0xVbmlmb3JtTG9jYXRpb24+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudW5pTCA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Om44OL44OV44Kp44O844Og5aSJ5pWw44Gu44K/44Kk44OX44Gu6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudW5pVCA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ko44Op44O86Zai6YCj5oOF5aCx44KS5qC857SN44GZ44KLXHJcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cclxuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gdnMgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgrPjg7Pjg5HjgqTjg6vjgqjjg6njg7xcclxuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZnMgLSDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgrPjg7Pjg5HjgqTjg6vjgqjjg6njg7xcclxuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gcHJnIC0g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu44Oq44Oz44Kv44Ko44Op44O8XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5lcnJvciA9IHt2czogbnVsbCwgZnM6IG51bGwsIHByZzogbnVsbH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzY3JpcHQg44K/44Kw44GuIElEIOOCkuWFg+OBq+OCveODvOOCueOCs+ODvOODieOCkuWPluW+l+OBl+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gc2NyaXB0IOOCv+OCsOOBq+S7mOWKoOOBleOCjOOBnyBJRCDmloflrZfliJdcclxuICAgICAqIEByZXR1cm4ge1dlYkdMU2hhZGVyfSDnlJ/miJDjgZfjgZ/jgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgY3JlYXRlU2hhZGVyRnJvbUlkKGlkKXtcclxuICAgICAgICBsZXQgc2hhZGVyO1xyXG4gICAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGlmKCFzY3JpcHRFbGVtZW50KXtyZXR1cm47fVxyXG4gICAgICAgIHN3aXRjaChzY3JpcHRFbGVtZW50LnR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlICd4LXNoYWRlci94LXZlcnRleCc6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3gtc2hhZGVyL3gtZnJhZ21lbnQnOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc291cmNlID0gc2NyaXB0RWxlbWVudC50ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuaXNXZWJHTDIgIT09IHRydWUpe1xyXG4gICAgICAgICAgICBpZihzb3VyY2Uuc2VhcmNoKC9eI3ZlcnNpb24gMzAwIGVzLykgPiAtMSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjYW4gbm90IHVzZSBnbHNsIGVzIDMuMCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IGVyciA9IHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xyXG4gICAgICAgICAgICBpZihzY3JpcHRFbGVtZW50LnR5cGUgPT09ICd4LXNoYWRlci94LXZlcnRleCcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci52cyA9IGVycjtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmZzID0gZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGNvbXBpbGUgZmFpbGVkIG9mIHNoYWRlcjogJyArIGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Gu44K944O844K544Kz44O844OJ44KS5paH5a2X5YiX44Gn5byV5pWw44GL44KJ5Y+W5b6X44GX44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIC0g44K344Kn44O844OA44Gu44K944O844K544Kz44O844OJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZSAtIGdsLlZFUlRFWF9TSEFERVIgb3IgZ2wuRlJBR01FTlRfU0hBREVSXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFNoYWRlcn0g55Sf5oiQ44GX44Gf44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc291cmNlLCB0eXBlKXtcclxuICAgICAgICBsZXQgc2hhZGVyO1xyXG4gICAgICAgIHN3aXRjaCh0eXBlKXtcclxuICAgICAgICAgICAgY2FzZSB0aGlzLmdsLlZFUlRFWF9TSEFERVI6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVI6XHJcbiAgICAgICAgICAgICAgICBzaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaXNXZWJHTDIgIT09IHRydWUpe1xyXG4gICAgICAgICAgICBpZihzb3VyY2Uuc2VhcmNoKC9eI3ZlcnNpb24gMzAwIGVzLykgPiAtMSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjYW4gbm90IHVzZSBnbHNsIGVzIDMuMCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IGVyciA9IHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xyXG4gICAgICAgICAgICBpZih0eXBlID09PSB0aGlzLmdsLlZFUlRFWF9TSEFERVIpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci52cyA9IGVycjtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmZzID0gZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGNvbXBpbGUgZmFpbGVkIG9mIHNoYWRlcjogJyArIGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OI44KS5byV5pWw44GL44KJ5Y+W5b6X44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSB2cyAtIOmggueCueOCt+OCp+ODvOODgOOBruOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gZnMgLSDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEByZXR1cm4ge1dlYkdMUHJvZ3JhbX0g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2dyYW0odnMsIGZzKXtcclxuICAgICAgICBpZih2cyA9PSBudWxsIHx8IGZzID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZzKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcyk7XHJcbiAgICAgICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpe1xyXG4gICAgICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9ncmFtO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBsZXQgZXJyID0gdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvci5wcmcgPSBlcnI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGxpbmsgcHJvZ3JhbSBmYWlsZWQ6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHqui6q+OBruWGhemDqOODl+ODreODkeODhuOCo+OBqOOBl+OBpuWtmOWcqOOBmeOCi+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkuioreWumuOBmeOCi1xyXG4gICAgICovXHJcbiAgICB1c2VQcm9ncmFtKCl7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZCTyDjgaggSUJPIOOCkuODkOOCpOODs+ODieOBl+OBpuacieWKueWMluOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48V2ViR0xCdWZmZXI+fSB2Ym8gLSBWQk8g44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMQnVmZmVyfSBbaWJvXSAtIElCT1xyXG4gICAgICovXHJcbiAgICBzZXRBdHRyaWJ1dGUodmJvLCBpYm8pe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpIGluIHZibyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA+PSAwKXtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2Ym9baV0pO1xyXG4gICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5hdHRMW2ldKTtcclxuICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5hdHRMW2ldLCB0aGlzLmF0dFNbaV0sIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaWJvICE9IG51bGwpe2dsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Gr44Om44OL44OV44Kp44O844Og5aSJ5pWw44Gr6Kit5a6a44GZ44KL5YCk44KS44OX44OD44K344Ol44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxtaXhlZD59IG1peGVkIC0g44Om44OL44OV44Kp44O844Og5aSJ5pWw44Gr6Kit5a6a44GZ44KL5YCk44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHB1c2hTaGFkZXIobWl4ZWQpe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IHRoaXMudW5pVC5sZW5ndGg7IGkgPCBqOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgdW5pID0gJ3VuaWZvcm0nICsgdGhpcy51bmlUW2ldLnJlcGxhY2UoL21hdHJpeC9pLCAnTWF0cml4Jyk7XHJcbiAgICAgICAgICAgIGlmKGdsW3VuaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih1bmkuc2VhcmNoKC9NYXRyaXgvKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBmYWxzZSwgbWl4ZWRbaV0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xbdW5pXSh0aGlzLnVuaUxbaV0sIG1peGVkW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBub3Qgc3VwcG9ydCB1bmlmb3JtIHR5cGU6ICcgKyB0aGlzLnVuaVRbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ki44OI44Oq44OT44Ol44O844OI44Ot44Kx44O844K344On44Oz44Go44Om44OL44OV44Kp44O844Og44Ot44Kx44O844K344On44Oz44GM5q2j44GX44GP5Y+W5b6X44Gn44GN44Gf44GL44OB44Kn44OD44Kv44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRMb2NhdGlvbiAtIOWPluW+l+OBl+OBn+OCouODiOODquODk+ODpeODvOODiOODreOCseODvOOCt+ODp+ODs+OBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48V2ViR0xVbmlmb3JtTG9jYXRpb24+fSB1bmlMb2NhdGlvbiAtIOWPluW+l+OBl+OBn+ODpuODi+ODleOCqeODvOODoOODreOCseODvOOCt+ODp+ODs+OBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBsb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbil7XHJcbiAgICAgICAgbGV0IGksIGw7XHJcbiAgICAgICAgZm9yKGkgPSAwLCBsID0gYXR0TG9jYXRpb24ubGVuZ3RoOyBpIDwgbDsgaSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy5hdHRMW2ldID09IG51bGwgfHwgdGhpcy5hdHRMW2ldIDwgMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBpbnZhbGlkIGF0dHJpYnV0ZSBsb2NhdGlvbjogJWNcIicgKyBhdHRMb2NhdGlvbltpXSArICdcIicsICdjb2xvcjogY3JpbXNvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpID0gMCwgbCA9IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudW5pTFtpXSA9PSBudWxsIHx8IHRoaXMudW5pTFtpXSA8IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgaW52YWxpZCB1bmlmb3JtIGxvY2F0aW9uOiAlY1wiJyArIHVuaUxvY2F0aW9uW2ldICsgJ1wiJywgJ2NvbG9yOiBjcmltc29uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5nbDMgPSB3aW5kb3cuZ2wzIHx8IG5ldyBnbDMoKTtcclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM0NvcmUuanMiXSwic291cmNlUm9vdCI6IiJ9