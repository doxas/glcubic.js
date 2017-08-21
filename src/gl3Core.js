
import audio from './gl3Audio.js';
import math  from './gl3Math.js';
import mesh  from './gl3Mesh.js';
import util  from './gl3Util.js';

/**
 * glcubic
 * @class gl3
 */
export default class gl3 {
    /**
     * @constructor
     */
    constructor(){
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
        this.Audio = audio;
        /**
         * gl3Mesh クラスのインスタンス
         * @type {gl3Mesh}
         */
        this.Mesh = mesh;
        /**
         * gl3Util クラスのインスタンス
         * @type {gl3Util}
         */
        this.Util = util;
        /**
         * gl3Math クラスのインスタンス
         * @type {gl3Math}
         */
        this.Math = new math();

        console.log('%c◆%c glcubic.js %c◆%c : version %c' + this.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');
    }

    /**
     * glcubic を初期化する
     * @param {HTMLCanvasElement|string} canvas - canvas element か canvas に付与されている ID 文字列
     * @param {Object} options - canvas.getContext で第二引数に渡す初期化時オプション
     * @return {boolean} 初期化が正しく行われたかどうかを表す真偽値
     */
    init(canvas, options){
        let opt = options || {};
        this.ready = false;
        if(canvas == null){return false;}
        if(canvas instanceof HTMLCanvasElement){
            this.canvas = canvas;
        }else if(Object.prototype.toString.call(canvas) === '[object String]'){
            this.canvas = document.getElementById(canvas);
        }
        if(this.canvas == null){return false;}
        this.gl = this.canvas.getContext('webgl', opt) ||
                  this.canvas.getContext('experimental-webgl', opt);
        if(this.gl != null){
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
    sceneClear(color, depth, stencil){
        let gl = this.gl;
        let flg = gl.COLOR_BUFFER_BIT;
        gl.clearColor(color[0], color[1], color[2], color[3]);
        if(depth != null){
            gl.clearDepth(depth);
            flg = flg | gl.DEPTH_BUFFER_BIT;
        }
        if(stencil != null){
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
    sceneView(x, y, width, height){
        let X = x || 0;
        let Y = y || 0;
        let w = width  || window.innerWidth;
        let h = height || window.innerHeight;
        this.gl.viewport(X, Y, w, h);
    }

    /**
     * gl.drawArrays をコールするラッパー
     * @param {number} primitive - プリミティブタイプ
     * @param {number} vertexCount - 描画する頂点の個数
     * @param {number} [offset=0] - 描画する頂点の開始オフセット
     */
    drawArrays(primitive, vertexCount, offset = 0){
        this.gl.drawArrays(primitive, offset, vertexCount);
    }

    /**
     * gl.drawElements をコールするラッパー
     * @param {number} primitive - プリミティブタイプ
     * @param {number} vertexCount - 描画するインデックスの個数
     * @param {number} [offset=0] - 描画するインデックスの開始オフセット
     */
    drawElements(primitive, indexLength, offset = 0){
        this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, offset);
    }

    /**
     * gl.drawElements をコールするラッパー（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
     * @param {number} primitive - プリミティブタイプ
     * @param {number} vertexCount - 描画するインデックスの個数
     * @param {number} [offset=0] - 描画するインデックスの開始オフセット
     */
    drawElementsInt(primitive, indexLength, offset = 0){
        this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_INT, offset);
    }

    /**
     * VBO（Vertex Buffer Object）を生成して返す
     * @param {Array.<number>} data - 頂点情報を格納した配列
     * @return {WebGLBuffer} 生成した頂点バッファ
     */
    createVbo(data){
        if(data == null){return;}
        let vbo = this.gl.createBuffer();
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
    createIbo(data){
        if(data == null){return;}
        let ibo = this.gl.createBuffer();
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
    createIboInt(data){
        if(data == null){return;}
        let ibo = this.gl.createBuffer();
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
    createTextureFromFile(source, number, callback){
        if(source == null || number == null){return;}
        let img = new Image();
        let gl = this.gl;
        img.onload = () => {
            this.textures[number] = {texture: null, type: null, loaded: false};
            let tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.textures[number].texture = tex;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
            gl.bindTexture(gl.TEXTURE_2D, null);
            if(callback != null){callback(number);}
        };
        img.src = source;
    }

    /**
     * オブジェクトを元にテクスチャを生成して返す
     * @param {string} source - ロード済みの Image オブジェクトや Canvas オブジェクト
     * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
     */
    createTextureFromObject(object, number){
        if(object == null || number == null){return;}
        let gl = this.gl;
        let tex = gl.createTexture();
        this.textures[number] = {texture: null, type: null, loaded: false};
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
    createTextureCubeFromFile(source, target, number, callback){
        if(source == null || target == null || number == null){return;}
        let cImg = [];
        let gl = this.gl;
        this.textures[number] = {texture: null, type: null, loaded: false};
        for(let i = 0; i < source.length; i++){
            cImg[i] = {image: new Image(), loaded: false};
            cImg[i].image.onload = ((index) => {return () => {
                cImg[index].loaded = true;
                if(cImg.length === 6){
                    let f = true;
                    cImg.map((v) => {
                        f = f && v.loaded;
                    });
                    if(f === true){
                        let tex = gl.createTexture();
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
                        for(let j = 0; j < source.length; j++){
                            gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cImg[j].image);
                        }
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        this.textures[number].texture = tex;
                        this.textures[number].type = gl.TEXTURE_CUBE_MAP;
                        this.textures[number].loaded = true;
                        console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                        if(callback != null){callback(number);}
                    }
                }
            };})(i);
            cImg[i].image.src = source[i];
        }
    }

    /**
     * glcubic が持つ配列のインデックスとテクスチャユニットを指定してテクスチャをバインドする
     * @param {number} unit - テクスチャユニット
     * @param {number} number - glcubic が持つ配列のインデックス
     */
    bindTexture(unit, number){
        if(this.textures[number] == null){return;}
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
    }

    /**
     * glcubic が持つ配列内のテクスチャ用画像が全てロード済みかどうか確認する
     * @return {boolean} ロードが完了しているかどうかのフラグ
     */
    isTextureLoaded(){
        let i, j, f, g;
        f = true; g = false;
        for(i = 0, j = this.textures.length; i < j; i++){
            if(this.textures[i] != null){
                g = true;
                f = f && this.textures[i].loaded;
            }
        }
        if(g){return f;}else{return false;}
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
    createFramebuffer(width, height, number){
        if(width == null || height == null || number == null){return;}
        let gl = this.gl;
        this.textures[number] = {texture: null, type: null, loaded: false};
        let frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        let depthRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
        let fTexture = gl.createTexture();
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
        return {framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture};
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
    createFramebufferStencil(width, height, number){
        if(width == null || height == null || number == null){return;}
        let gl = this.gl;
        this.textures[number] = {texture: null, type: null, loaded: false};
        let frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        let depthStencilRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderBuffer);
        let fTexture = gl.createTexture();
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
        return {framebuffer: frameBuffer, depthStencilRenderbuffer: depthStencilRenderBuffer, texture: fTexture};
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
    createFramebufferFloat(width, height, number){
        if(width == null || height == null || number == null){return;}
        let gl = this.gl;
        this.textures[number] = {texture: null, type: null, loaded: false};
        let frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        let fTexture = gl.createTexture();
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
        return {framebuffer: frameBuffer, depthRenderbuffer: null, texture: fTexture};
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
    createFramebufferCube(width, height, target, number){
        if(width == null || height == null || target == null || number == null){return;}
        let gl = this.gl;
        this.textures[number] = {texture: null, type: null, loaded: false};
        let frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        let depthRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
        let fTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, fTexture);
        for(let i = 0; i < target.length; i++){
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
        return {framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture};
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
    createProgramFromId(vsId, fsId, attLocation, attStride, uniLocation, uniType){
        if(this.gl == null){return null;}
        let i;
        let mng = new ProgramManager(this.gl);
        mng.vs = mng.createShaderFromId(vsId);
        mng.fs = mng.createShaderFromId(fsId);
        mng.prg = mng.createProgram(mng.vs, mng.fs);
        mng.attL = new Array(attLocation.length);
        mng.attS = new Array(attLocation.length);
        for(i = 0; i < attLocation.length; i++){
            mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
            mng.attS[i] = attStride[i];
        }
        mng.uniL = new Array(uniLocation.length);
        for(i = 0; i < uniLocation.length; i++){
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
    createProgramFromSource(vs, fs, attLocation, attStride, uniLocation, uniType){
        if(this.gl == null){return null;}
        let i;
        let mng = new ProgramManager(this.gl);
        mng.vs = mng.createShaderFromSource(vs, this.gl.VERTEX_SHADER);
        mng.fs = mng.createShaderFromSource(fs, this.gl.FRAGMENT_SHADER);
        mng.prg = mng.createProgram(mng.vs, mng.fs);
        mng.attL = new Array(attLocation.length);
        mng.attS = new Array(attLocation.length);
        for(i = 0; i < attLocation.length; i++){
            mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
            mng.attS[i] = attStride[i];
        }
        mng.uniL = new Array(uniLocation.length);
        for(i = 0; i < uniLocation.length; i++){
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
    createProgramFromFile(vsPath, fsPath, attLocation, attStride, uniLocation, uniType, callback){
        if(this.gl == null){return null;}
        let mng = new ProgramManager(this.gl);
        let src = {
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
        function xhr(gl, target){
            let xml = new XMLHttpRequest();
            xml.open('GET', target.targetUrl, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.onload = function(){
                console.log('%c◆%c shader file loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                target.source = xml.responseText;
                loadCheck(gl);
            };
            xml.send();
        }
        function loadCheck(gl){
            if(src.vs.source == null || src.fs.source == null){return;}
            let i;
            mng.vs = mng.createShaderFromSource(src.vs.source, gl.VERTEX_SHADER);
            mng.fs = mng.createShaderFromSource(src.fs.source, gl.FRAGMENT_SHADER);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for(i = 0; i < attLocation.length; i++){
                mng.attL[i] = gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for(i = 0; i < uniLocation.length; i++){
                mng.uniL[i] = gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            callback(mng);
        }
        return mng;
    }
}

class ProgramManager {
    constructor(gl){
        this.gl   = gl;
        this.vs   = null;
        this.fs   = null;
        this.prg  = null;
        this.attL = null;
        this.attS = null;
        this.uniL = null;
        this.uniT = null;
    }

    createShaderFromId(id){
        let shader;
        let scriptElement = document.getElementById(id);
        if(!scriptElement){return;}
        switch(scriptElement.type){
            case 'x-shader/x-vertex':
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                break;
            case 'x-shader/x-fragment':
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }
        this.gl.shaderSource(shader, scriptElement.text);
        this.gl.compileShader(shader);
        if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
            return shader;
        }else{
            console.warn('◆ compile failed of shader: ' + this.gl.getShaderInfoLog(shader));
        }
    }

    createShaderFromSource(source, type){
        let shader;
        switch(type){
            case this.gl.VERTEX_SHADER:
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                break;
            case this.gl.FRAGMENT_SHADER:
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
            return shader;
        }else{
            console.warn('◆ compile failed of shader: ' + this.gl.getShaderInfoLog(shader));
        }
    }

    createProgram(vs, fs){
        let program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);
        this.gl.linkProgram(program);
        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
            this.gl.useProgram(program);
            return program;
        }else{
            console.warn('◆ link program failed: ' + this.gl.getProgramInfoLog(program));
        }
    }

    useProgram(){
        this.gl.useProgram(this.prg);
    }

    setAttribute(vbo, ibo){
        let gl = this.gl;
        for(let i in vbo){
            if(this.attL[i] >= 0){
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
                gl.enableVertexAttribArray(this.attL[i]);
                gl.vertexAttribPointer(this.attL[i], this.attS[i], gl.FLOAT, false, 0, 0);
            }
        }
        if(ibo != null){gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);}
    }

    pushShader(any){
        let gl = this.gl;
        for(let i = 0, j = this.uniT.length; i < j; i++){
            let uni = 'uniform' + this.uniT[i].replace(/matrix/i, 'Matrix');
            if(gl[uni] != null){
                if(uni.search(/Matrix/) !== -1){
                    gl[uni](this.uniL[i], false, any[i]);
                }else{
                    gl[uni](this.uniL[i], any[i]);
                }
            }else{
                console.warn('◆ not support uniform type: ' + this.uniT[i]);
            }
        }
    }

    locationCheck(attLocation, uniLocation){
        let i, l;
        for(i = 0, l = attLocation.length; i < l; i++){
            if(this.attL[i] == null || this.attL[i] < 0){
                console.warn('◆ invalid attribute location: %c"' + attLocation[i] + '"', 'color: crimson');
            }
        }
        for(i = 0, l = uniLocation.length; i < l; i++){
            if(this.uniL[i] == null || this.uniL[i] < 0){
                console.warn('◆ invalid uniform location: %c"' + uniLocation[i] + '"', 'color: crimson');
            }
        }
    }
}

window.gl3 = window.gl3 || new gl3();

