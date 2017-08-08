
/*
 * step 1: let a = new AudioCtr(bgmGainValue, soundGainValue) <- float(0 to 1)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

export default class AudioCtr {
    constructor(bgmGainValue, soundGainValue){
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
            this.bgmGain.gain.value = bgmGainValue;
            this.soundGain = this.ctx.createGain();
            this.soundGain.connect(this.comp);
            this.soundGain.gain.value = soundGainValue;
            this.src = [];
        }else{
            return null;
        }
    }

    load(url, index, loop, background, callback){
        let ctx = this.ctx;
        let gain = background ? this.bgmGain : this.soundGain;
        let src = this.src;
        src[index] = null;
        let xml = new XMLHttpRequest();
        xml.open('GET', url, true);
        xml.setRequestHeader('Pragma', 'no-cache');
        xml.setRequestHeader('Cache-Control', 'no-cache');
        xml.responseType = 'arraybuffer';
        xml.onload = () => {
            ctx.decodeAudioData(xml.response, (buf) => {
                src[index] = new AudioSrc(ctx, gain, buf, loop, background);
                src[index].loaded = true;
                console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + url, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                callback();
            }, (e) => {console.log(e);});
        };
        xml.send();
    }
    loadComplete(){
        let i, f;
        f = true;
        for(i = 0; i < this.src.length; i++){
            f = f && (this.src[i] != null) && this.src[i].loaded;
        }
        return f;
    }
}

class AudioSrc {
    constructor(ctx, gain, audioBuffer, loop, background){
        this.ctx                            = ctx;
        this.gain                           = gain;
        this.audioBuffer                    = audioBuffer;
        this.bufferSource                   = [];
        this.activeBufferSource             = 0;
        this.loop                           = loop;
        this.loaded                         = false;
        this.fftLoop                        = 16;
        this.update                         = false;
        this.background                     = background;
        this.node                           = this.ctx.createScriptProcessor(2048, 1, 1);
        this.analyser                       = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.fftSize               = this.fftLoop * 2;
        this.onData                         = new Uint8Array(this.analyser.frequencyBinCount);
    }

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
    stop(){
        this.bufferSource[this.activeBufferSource].stop(0);
        this.playnow = false;
    }
}

