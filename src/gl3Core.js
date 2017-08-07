
import audio      from './gl3Audio.js';
import creator    from './gl3Creator.js';
import math       from './gl3Math.js';
import mesh       from './gl3Mesh.js';
import util       from './gl3Util.js';

export default class gl3 {
    constructor(){
        this.VERSION = '0.0.5';
        this.PI2  = 6.28318530717958647692528676655900576;
        this.PI   = 3.14159265358979323846264338327950288;
        this.PIH  = 1.57079632679489661923132169163975144;
        this.PIH2 = 0.78539816339744830961566084581987572;
        this.TEXTURE_UNIT_COUNT = null;

        console.log('%c◆%c glCubic.js %c◆%c : version %c' + gl3.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');

        this.ready    = false;
        this.canvas   = null;
        this.gl       = null;
        this.textures = null;
        this.ext      = null;

        this.Audio   = audio;
        this.Creator = creator;
        this.Math    = math;
        this.Mesh    = mesh;
        this.Util    = util;
    }

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
        return this.ready;
    }

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

    sceneView(camera, x, y, width, height){
        let X = x || 0;
        let Y = y || 0;
        let w = width  || window.innerWidth;
        let h = height || window.innerHeight;
        this.gl.viewport(X, Y, w, h);
        if(camera != null){camera.aspect = w / h;}
    }

    drawArrays(primitive, vertexCount){
        this.gl.drawArrays(primitive, 0, vertexCount);
    }

    drawElements(primitive, indexLength){
        this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, 0);
    }

    bindTexture(unit, number){
        if(this.textures[number] == null){return;}
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
    }

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

    createProgramFromFile(vsUrl, fsUrl, attLocation, attStride, uniLocation, uniType, callback){
        if(this.gl == null){return null;}
        let mng = new ProgramManager(this.gl);
        let src = {
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
        function xhr(gl, target){
            let xml = new XMLHttpRequest();
            xml.open('GET', target.targetUrl, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.onload = function(){
                console.log('%c◆%c shader source loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
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
            callback();
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
    };

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

