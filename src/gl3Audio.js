
// step 1: var a = new AudioCtr(bgmGainValue, soundGainValue) <- float(0 to 1)
// step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
// step 3: a.src[index].loaded then a.src[index].play()

// audio controler
gl3.audioCtr = function(){};

gl3.audioCtr.prototype.init = function(bgmGainValue, soundGainValue){
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
};

gl3.audioCtr.prototype.load = function(url, index, loop, background, callback){
    var ctx = this.ctx;
    var gain = background ? this.bgmGain : this.soundGain;
    var src = this.src;
    src[index] = null;
    var xml = new XMLHttpRequest();
    xml.open('GET', url, true);
    xml.setRequestHeader('Pragma', 'no-cache');
    xml.setRequestHeader('Cache-Control', 'no-cache');
    xml.responseType = 'arraybuffer';
    xml.onload = function(){
        ctx.decodeAudioData(xml.response, function(buf){
            src[index] = new gl3.audioSrc(ctx, gain, buf, loop, background);
            src[index].loaded = true;
            console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + url, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
            callback();
        }, function(e){console.log(e);});
    };
    xml.send();
};

gl3.audioCtr.prototype.loadComplete = function(){
    var i, f;
    f = true;
    for(i = 0; i < this.src.length; i++){
        f = f && (this.src[i] != null) && this.src[i].loaded;
    }
    return f;
};

// audio source
gl3.audioSrc = function(ctx, gain, audioBuffer, loop, background){
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
};

gl3.audioSrc.prototype.play = function(){
    var i, j, k;
    var self = this;
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
        this.bufferSource[k].onended = function(){
            this.stop(0);
            this.playnow = false;
        };
    }
    if(this.background){
        this.bufferSource[k].connect(this.analyser);
        this.analyser.connect(this.node);
        this.node.connect(this.ctx.destination);
        this.node.onaudioprocess = function(eve){onprocessEvent(eve);};
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
};

gl3.audioSrc.prototype.stop = function(){
    this.bufferSource[this.activeBufferSource].stop(0);
    this.playnow = false;
};

gl3.audio = new gl3.audioCtr();

