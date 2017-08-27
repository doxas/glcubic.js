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
 * step 1: let a = new gl3Audio(bgmGainValue, soundGainValue) <- float(0 to 1)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

/**
 * gl3Audio クラス
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
            this.bgmGain.gain.value = bgmGainValue;
            this.soundGain = this.ctx.createGain();
            this.soundGain.connect(this.comp);
            this.soundGain.gain.value = soundGainValue;
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
 * let wrapper = new gl3.Gui.Wrapper().getElement();
 * document.body.appendChild(wrapper);
 *
 * let slider = new gl3.Gui.Slider('test', 50, 0, 100, 1);
 * slider.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.appendChild(slider.getElement());
 *
 * let check = new gl3.Gui.Checkbox('hoge', false);
 * check.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.appendChild(check.getElement());
 *
 * let select = new gl3.Gui.Select('fuga', ['foo', 'baa'], 0);
 * select.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.appendChild(select.getElement());
 *
 * let spin = new gl3.Gui.Spin('hoge', 0.0, -1.0, 1.0, 0.1);
 * spin.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.appendChild(spin.getElement());
 *
 * let color = new gl3.Gui.Color('fuga', '#ff0000');
 * color.add('change', (eve, self) => {console.log(self.getValue(), self.getFloatValue());});
 * wrapper.appendChild(color.getElement());
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
    _classCallCheck(this, GUIWrapper);

    /**
     * GUI 全体を包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.backgroundColor = 'rgba(64, 64, 64, 0.5)';
    this.element.style.position = 'absolute';
    this.element.style.top = '0px';
    this.element.style.right = '0px';
    this.element.style.height = '100%';
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
    this.element.style.width = '270px';
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
    this.label.style.width = '50px';
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
    var _this = _possibleConstructorReturn(this, (GUISlider.__proto__ || Object.getPrototypeOf(GUISlider)).call(this, text));

    _this.control = document.createElement('input');
    _this.control.setAttribute('type', 'range');
    _this.control.setAttribute('min', min);
    _this.control.setAttribute('max', max);
    _this.control.setAttribute('step', step);
    _this.control.value = value;
    _this.control.style.margin = 'auto';
    _this.control.style.verticalAlign = 'middle';
    _this.element.appendChild(_this.control);

    // set
    _this.setValue(_this.control.value);

    // event
    _this.control.addEventListener('input', function (eve) {
      _this.emit('input', eve);
      _this.setValue(_this.control.value);
    }, false);
    return _this;
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
    var _this2 = _possibleConstructorReturn(this, (GUICheckbox.__proto__ || Object.getPrototypeOf(GUICheckbox)).call(this, text));

    _this2.control = document.createElement('input');
    _this2.control.setAttribute('type', 'checkbox');
    _this2.control.checked = checked;
    _this2.control.style.margin = 'auto';
    _this2.control.style.verticalAlign = 'middle';
    _this2.element.appendChild(_this2.control);

    // set
    _this2.setValue(_this2.control.checked);

    // event
    _this2.control.addEventListener('change', function (eve) {
      _this2.emit('change', eve);
      _this2.setValue(_this2.control.checked);
    }, false);
    return _this2;
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
 * GUISelect
 * @class GUISelect
 */


var GUISelect = function (_GUIElement3) {
  _inherits(GUISelect, _GUIElement3);

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
    var _this3 = _possibleConstructorReturn(this, (GUISelect.__proto__ || Object.getPrototypeOf(GUISelect)).call(this, text));

    _this3.control = document.createElement('select');
    list.map(function (v) {
      var opt = new Option(v, v);
      _this3.control.add(opt);
    });
    _this3.control.selectedIndex = selectedIndex;
    _this3.control.style.width = '130px';
    _this3.control.style.margin = 'auto';
    _this3.control.style.verticalAlign = 'middle';
    _this3.element.appendChild(_this3.control);

    // set
    _this3.setValue(_this3.control.value);

    // event
    _this3.control.addEventListener('change', function (eve) {
      _this3.emit('change', eve);
      _this3.setValue(_this3.control.value);
    }, false);
    return _this3;
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


var GUISpin = function (_GUIElement4) {
  _inherits(GUISpin, _GUIElement4);

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
    var _this4 = _possibleConstructorReturn(this, (GUISpin.__proto__ || Object.getPrototypeOf(GUISpin)).call(this, text));

    _this4.control = document.createElement('input');
    _this4.control.setAttribute('type', 'number');
    _this4.control.setAttribute('min', min);
    _this4.control.setAttribute('max', max);
    _this4.control.setAttribute('step', step);
    _this4.control.value = value;
    _this4.control.style.margin = 'auto';
    _this4.control.style.verticalAlign = 'middle';
    _this4.element.appendChild(_this4.control);

    // set
    _this4.setValue(_this4.control.value);

    // event
    _this4.control.addEventListener('input', function (eve) {
      _this4.emit('input', eve);
      _this4.setValue(_this4.control.value);
    }, false);
    return _this4;
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


var GUIColor = function (_GUIElement5) {
  _inherits(GUIColor, _GUIElement5);

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
    var _this5 = _possibleConstructorReturn(this, (GUIColor.__proto__ || Object.getPrototypeOf(GUIColor)).call(this, text));

    _this5.container = document.createElement('div');
    _this5.container.style.lineHeight = '0';
    _this5.container.style.margin = '2px auto';
    _this5.container.style.width = '100px';
    /**
     * 余白兼選択カラー表示エレメント
     * @type {HTMLDivElement}
     */
    _this5.label = document.createElement('div');
    _this5.label.style.margin = '0px';
    _this5.label.style.width = 'calc(100% - 2px)';
    _this5.label.style.height = '24px';
    _this5.label.style.border = '1px solid whitesmoke';
    _this5.label.style.boxShadow = '0px 0px 0px 1px #222';
    /**
     * コントロールエレメントの役割を担う canvas
     * @type {HTMLCanvasElement}
     */
    _this5.control = document.createElement('canvas');
    _this5.control.style.margin = '0px';
    _this5.control.style.display = 'none';
    _this5.control.width = 100;
    _this5.control.height = 100;

    // append
    _this5.element.appendChild(_this5.container);
    _this5.container.appendChild(_this5.label);
    _this5.container.appendChild(_this5.control);

    /**
     * コントロール用 canvas の 2d コンテキスト
     * @type {CanvasRenderingContext2D}
     */
    _this5.ctx = _this5.control.getContext('2d');
    var grad = _this5.ctx.createLinearGradient(0, 0, _this5.control.width, 0);
    var arr = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'];
    for (var i = 0, j = arr.length; i < j; ++i) {
      grad.addColorStop(i / (j - 1), arr[i]);
    }
    _this5.ctx.fillStyle = grad;
    _this5.ctx.fillRect(0, 0, _this5.control.width, _this5.control.height);
    grad = _this5.ctx.createLinearGradient(0, 0, 0, _this5.control.height);
    arr = ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 1.0)'];
    for (var _i = 0, _j = arr.length; _i < _j; ++_i) {
      grad.addColorStop(_i / (_j - 1), arr[_i]);
    }
    _this5.ctx.fillStyle = grad;
    _this5.ctx.fillRect(0, 0, _this5.control.width, _this5.control.height);

    /**
     * 自身に設定されている色を表す文字列の値
     * @type {string}
     */
    _this5.colorValue = value;

    // set
    _this5.setValue(value);

    // event
    _this5.container.addEventListener('mouseover', function () {
      _this5.control.style.display = 'block';
    });
    _this5.container.addEventListener('mouseout', function () {
      _this5.control.style.display = 'none';
    });
    _this5.control.addEventListener('mousemove', function (eve) {
      var imageData = _this5.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      var color = _this5.getColor8bitString(imageData.data);
      _this5.setValue(color);
    });

    _this5.control.addEventListener('click', function (eve) {
      var imageData = _this5.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      eve.currentTarget.value = _this5.getColor8bitString(imageData.data);
      _this5.control.style.display = 'none';
      _this5.emit('change', eve);
    }, false);
    return _this5;
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
         * @param {Float32Array.<Mat4>} mat1 - 乗算される行列
         * @param {Float32Array.<Mat4>} mat2 - 乗算する行列
         * @param {Float32Array.<Mat4>} [dest] - 乗算結果を格納する行列
         * @return {Float32Array.<Mat4>} 乗算結果の行列
         */

    }, {
        key: "multiply",
        value: function multiply(mat1, mat2, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
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
    }, {
        key: "length",
        value: function length(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        }
    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec3.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            n[2] = v1[2] - v0[2];
            return n;
        }
    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec3.create();
            var l = Vec3.length(v);
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
    }, {
        key: "length",
        value: function length(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }
    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec2.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            return n;
        }
    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec2.create();
            var l = Vec2.length(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
            }
            return n;
        }
    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1];
        }
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
         * 4 つの要素からなるクォータニオンのデータ構造を生成する
         * @return {Float32Array} クォータニオンデータ格納用の配列
         */
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
         * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
         * トーラスの頂点情報を生成する
         * @param {number} row - 輪の分割数
         * @param {number} column - パイプ断面の分割数
         * @param {number} irad - パイプ断面の半径
         * @param {number} orad - パイプ全体の半径
         * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
                    var _r = (column + 1) * i + j;
                    idx.push(_r, _r + column + 1, _r + 1);
                    idx.push(_r + column + 1, _r + column + 2, _r + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 球体の頂点情報を生成する
         * @param {number} row - 球の縦方向（緯度方向）の分割数
         * @param {number} column - 球の横方向（経度方向）の分割数
         * @param {number} rad - 球の半径
         * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
                    var _r2 = (column + 1) * i + j;
                    idx.push(_r2, _r2 + 1, _r2 + column + 2);
                    idx.push(_r2, _r2 + column + 2, _r2 + column + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * キューブの頂点情報を生成する
         * @param {number} side - 正立方体の一辺の長さ
         * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
         */

    }, {
        key: "easeLiner",
        value: function easeLiner(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         */

    }, {
        key: "easeOutCubic",
        value: function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }
        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         */

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
        this.VERSION = '0.1.2';
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

        console.log('%c◆%c glcubic.js %c◆%c : version %c' + this.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');
    }

    /**
     * glcubic を初期化する
     * @param {HTMLCanvasElement|string} canvas - canvas element か canvas に付与されている ID 文字列
     * @param {Object} options - canvas.getContext で第二引数に渡す初期化時オプション
     * @return {boolean} 初期化が正しく行われたかどうかを表す真偽値
     */


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
                console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
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
            console.log('%c◆%c texture number: %c' + number + '%c, object attached', 'color: crimson', '', 'color: blue', '');
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
                                console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
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
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable stencil)', 'color: crimson', '', 'color: blue', '');
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
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable float)', 'color: crimson', '', 'color: blue', '');
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
            var mng = new ProgramManager(this.gl);
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
                    console.log('%c◆%c shader file loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
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
                callback(mng);
            }
            return mng;
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
     */
    function ProgramManager(gl) {
        _classCallCheck(this, ProgramManager);

        /**
         * 自身が属する WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;
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
            this.gl.shaderSource(shader, scriptElement.text);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                console.warn('◆ compile failed of shader: ' + this.gl.getShaderInfoLog(shader));
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
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                console.warn('◆ compile failed of shader: ' + this.gl.getShaderInfoLog(shader));
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