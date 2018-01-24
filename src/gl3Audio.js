
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
export default class gl3Audio {
    /**
     * @constructor
     * @param {number} bgmGainValue - BGM の再生音量
     * @param {number} soundGainValue - 効果音の再生音量
     */
    constructor(bgmGainValue, soundGainValue){
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
        if(
            typeof AudioContext != 'undefined' ||
            typeof webkitAudioContext != 'undefined'
        ){
            if(typeof AudioContext != 'undefined'){
                this.ctx = new AudioContext();
            }else{
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
        }else{
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
    load(path, index, loop, background, callback){
        let ctx = this.ctx;
        let gain = background ? this.bgmGain : this.soundGain;
        let src = this.src;
        src[index] = null;
        let xml = new XMLHttpRequest();
        xml.open('GET', path, true);
        xml.setRequestHeader('Pragma', 'no-cache');
        xml.setRequestHeader('Cache-Control', 'no-cache');
        xml.responseType = 'arraybuffer';
        xml.onload = () => {
            ctx.decodeAudioData(xml.response, (buf) => {
                src[index] = new AudioSrc(ctx, gain, buf, loop, background);
                src[index].loaded = true;
                console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + path, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                callback();
            }, (e) => {console.log(e);});
        };
        xml.send();
    }

    /**
     * ロードの完了をチェックする
     * @return {boolean} ロードが完了しているかどうか
     */
    loadComplete(){
        let i, f;
        f = true;
        for(i = 0; i < this.src.length; i++){
            f = f && (this.src[i] != null) && this.src[i].loaded;
        }
        return f;
    }
}

/**
 * オーディオやソースファイルを管理するためのクラス
 * @class AudioSrc
 */
class AudioSrc {
    /**
     * @constructor
     * @param {AudioContext} ctx - 対象となるオーディオコンテキスト
     * @param {GainNode} gain - 対象となるゲインノード
     * @param {ArrayBuffer} audioBuffer - バイナリのオーディオソース
     * @param {boolean} bool - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     */
    constructor(ctx, gain, audioBuffer, loop, background){
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
    play(){
        let i, j, k;
        let self = this;
        i = this.bufferSource.length;
        k = -1;
        if(i > 0){
            for(j = 0; j < i; j++){
                if(!this.bufferSource[j].playnow){
                    this.bufferSource[j] = null;
                    this.bufferSource[j] = this.ctx.createBufferSource();
                    k = j;
                    break;
                }
            }
            if(k < 0){
                this.bufferSource[this.bufferSource.length] = this.ctx.createBufferSource();
                k = this.bufferSource.length - 1;
            }
        }else{
            this.bufferSource[0] = this.ctx.createBufferSource();
            k = 0;
        }
        this.activeBufferSource = k;
        this.bufferSource[k].buffer = this.audioBuffer;
        this.bufferSource[k].loop = this.loop;
        this.bufferSource[k].playbackRate.value = 1.0;
        if(!this.loop){
            this.bufferSource[k].onended = () => {
                this.stop(0);
                this.playnow = false;
            };
        }
        if(this.background){
            this.bufferSource[k].connect(this.analyser);
            this.analyser.connect(this.node);
            this.node.connect(this.ctx.destination);
            this.node.onaudioprocess = (eve) => {onprocessEvent(eve);};
        }
        this.bufferSource[k].connect(this.gain);
        this.bufferSource[k].start(0);
        this.bufferSource[k].playnow = true;

        function onprocessEvent(eve){
            if(self.update){
                self.update = false;
                self.analyser.getByteFrequencyData(self.onData);
            }
        }
    }

    /**
     * オーディオの再生を止める
     */
    stop(){
        this.bufferSource[this.activeBufferSource].stop(0);
        this.playnow = false;
    }
}

