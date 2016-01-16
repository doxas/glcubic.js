
gl3.ready = false;
gl3.canvas = null;
gl3.gl = null;
gl3.textures = null;
gl3.textureUnitCount = null;

// initialize webgl
gl3.initGL = function(canvasId, options){
    var opt = options || {};
    this.ready = false;
    this.canvas = document.getElementById(canvasId);
    if(this.canvas == null){return false;}
    this.gl = this.canvas.getContext('webgl', opt)
           || this.canvas.getContext('experimental-webgl', opt);
    if(this.gl != null){
        this.ready = true;
        this.textureUnitCount = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        this.textures = new Array(this.textureUnitCount);
    }
    return this.ready;
};

// clear canvas
gl3.scene_clear = function(color, depth, stencil){
    var gl = this.gl;
    var flg = gl.COLOR_BUFFER_BIT;
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
};

// view setting
gl3.scene_view = function(camera, x, y, width, height){
    var X = x || 0;
    var Y = y || 0;
    var w = width  || window.innerWidth;
    var h = height || window.innerHeight;
    this.gl.viewport(X, Y, w, h);
    if(camera != null){camera.aspect = w / h;}
};

// array buffer draw
gl3.draw_arrays = function(primitive, vertexCount){
    this.gl.drawArrays(primitive, 0, vertexCount);
};

// index buffer draw
gl3.draw_elements = function(primitive, indexLength){
    this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, 0);
};

// binding texture
gl3.bind_texture = function(unit, number){
    if(this.textures[number] == null){return;}
    this.gl.activeTexture(33984 + unit);
    this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
};

// load check for texture
gl3.texture_loaded = function(){
    var i, j, f, g;
    f = true; g = false;
    for(i = 0, j = this.textures.length; i < j; i++){
        if(this.textures[i] != null){
            g = true;
            f = f && this.textures[i].loaded;
        }
    }
    if(g){return f;}else{return false;}
};

// program object -------------------------------------------------------------
gl3.program = {
    create: function(vsId, fsId, attLocation, attStride, uniLocation, uniType){
        if(gl3.gl == null){return null;}
        var i;
        var mng = new gl3.programManager(gl3.gl);
        mng.vs = mng.create_shader(vsId);
        mng.fs = mng.create_shader(fsId);
        mng.prg = mng.create_program(mng.vs, mng.fs);
        mng.attL = new Array(attLocation.length);
        mng.attS = new Array(attLocation.length);
        for(i = 0; i < attLocation.length; i++){
            mng.attL[i] = gl3.gl.getAttribLocation(mng.prg, attLocation[i]);
            mng.attS[i] = attStride[i];
        }
        mng.uniL = new Array(uniLocation.length);
        for(i = 0; i < uniLocation.length; i++){
            mng.uniL[i] = gl3.gl.getUniformLocation(mng.prg, uniLocation[i]);
        }
        mng.uniT = uniType;
        mng.location_check(attLocation, uniLocation);
        return mng;
    },
    create_from_source: function(vs, fs, attLocation, attStride, uniLocation, uniType){
        if(gl3.gl == null){return null;}
        var i;
        var mng = new gl3.programManager(gl3.gl);
        mng.vs = mng.create_shader_from_source(vs, gl3.gl.VERTEX_SHADER);
        mng.fs = mng.create_shader_from_source(fs, gl3.gl.FRAGMENT_SHADER);
        mng.prg = mng.create_program(mng.vs, mng.fs);
        mng.attL = new Array(attLocation.length);
        mng.attS = new Array(attLocation.length);
        for(i = 0; i < attLocation.length; i++){
            mng.attL[i] = gl3.gl.getAttribLocation(mng.prg, attLocation[i]);
            mng.attS[i] = attStride[i];
        }
        mng.uniL = new Array(uniLocation.length);
        for(i = 0; i < uniLocation.length; i++){
            mng.uniL[i] = gl3.gl.getUniformLocation(mng.prg, uniLocation[i]);
        }
        mng.uniT = uniType;
        mng.location_check(attLocation, uniLocation);
        return mng;
    },
    create_from_file: function(vsUrl, fsUrl, attLocation, attStride, uniLocation, uniType, callback){
        if(gl3.gl == null){return null;}
        var mng = new gl3.programManager(gl3.gl);
        var src = {
            vs: {
                targetUrl: vsUrl,
                source: null,
            },
            fs: {
                targetUrl: fsUrl,
                source: null,
            }
        };
        xhr(src.vs);
        xhr(src.fs);
        function xhr(target){
            var xml = new XMLHttpRequest();
            xml.open('GET', target.targetUrl, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.onload = function(){
                console.log('%c◆%c shader source loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                target.source = xml.responseText;
                loadCheck();
            };
            xml.send();
        }
        function loadCheck(){
            if(src.vs.source == null || src.fs.source == null){return;}
            var i;
            mng.vs = mng.create_shader_from_source(src.vs.source, gl3.gl.VERTEX_SHADER);
            mng.fs = mng.create_shader_from_source(src.fs.source, gl3.gl.FRAGMENT_SHADER);
            mng.prg = mng.create_program(mng.vs, mng.fs);
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for(i = 0; i < attLocation.length; i++){
                mng.attL[i] = gl3.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for(i = 0; i < uniLocation.length; i++){
                mng.uniL[i] = gl3.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.location_check(attLocation, uniLocation);
            callback();
        }
        return mng;
    }
};

gl3.programManager = function(webglContext){
    this.gl = webglContext;
};

gl3.programManager.prototype.gl   = null;
gl3.programManager.prototype.vs   = null;
gl3.programManager.prototype.fs   = null;
gl3.programManager.prototype.prg  = null;
gl3.programManager.prototype.attL = null;
gl3.programManager.prototype.attS = null;
gl3.programManager.prototype.uniL = null;
gl3.programManager.prototype.uniT = null;

gl3.programManager.prototype.create_shader = function(id){
    var shader;
    var scriptElement = document.getElementById(id);
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
};

gl3.programManager.prototype.create_shader_from_source = function(source, type){
    var shader;
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
};

gl3.programManager.prototype.create_program = function(vs, fs){
    var program = this.gl.createProgram();
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

gl3.programManager.prototype.set_program = function(){
    this.gl.useProgram(this.prg);
};

gl3.programManager.prototype.set_attribute = function(vbo, ibo){
    for(var i in vbo){
        if(this.attL[i] >= 0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
            this.gl.enableVertexAttribArray(this.attL[i]);
            this.gl.vertexAttribPointer(this.attL[i], this.attS[i], this.gl.FLOAT, false, 0, 0);
        }
    }
    if(ibo != null){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);}
};

gl3.programManager.prototype.push_shader = function(any){
    for(var i = 0, l = this.uniT.length; i < l; i++){
        switch(this.uniT[i]){
            case 'matrix4fv':
                this.gl.uniformMatrix4fv(this.uniL[i], false, any[i]);
                break;
            case '4fv':
                this.gl.uniform4fv(this.uniL[i], any[i]);
                break;
            case '3fv':
                this.gl.uniform3fv(this.uniL[i], any[i]);
                break;
            case '2fv':
                this.gl.uniform2fv(this.uniL[i], any[i]);
                break;
            case '1fv':
                this.gl.uniform1fv(this.uniL[i], any[i]);
                break;
            case '1f':
                this.gl.uniform1f(this.uniL[i], any[i]);
                break;
            case '1iv':
                this.gl.uniform1iv(this.uniL[i], any[i]);
                break;
            case '1i':
                this.gl.uniform1i(this.uniL[i], any[i]);
                break;
            case 'matrix3fv':
                this.gl.uniformMatrix3fv(this.uniL[i], false, any[i]);
                break;
            case 'matrix2fv':
                this.gl.uniformMatrix2fv(this.uniL[i], false, any[i]);
                break;
            default :
                break;
        }
    }
};

gl3.programManager.prototype.location_check = function(attLocation, uniLocation){
    var i, l;
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
};

