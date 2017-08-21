
(() => {
    // variable ===============================================================
    let gl, run, mat4, qtn, count, nowTime;
    let canvas, canvasWidth, canvasHeight;
    let audio;

    // shader
    let basePrg, noisePrg;

    // onload =================================================================
    window.addEventListener('load', () => {
        // initialize ---------------------------------------------------------
        gl3.init(document.getElementById('canvas')); // or gl3.init('canvas');
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        run           = true;
        canvas        = gl3.canvas;
        gl            = gl3.gl;
        mat4          = gl3.Math.Mat4;
        qtn           = gl3.Math.Qtn;
        canvasWidth   = window.innerWidth;
        canvasHeight  = window.innerHeight;
        canvas.width  = canvasWidth;
        canvas.height = canvasHeight;

        window.addEventListener('keydown', function(eve){
            if(eve.keyCode === 27){
                run = false;
                if(audio != null && audio.src[0] != null && audio.src[0].loaded){
                    audio.src[0].stop();
                }
            }
        }, false);

        // audio
        audio = new gl3.Audio(0.5, 0.5);
        audio.load('sound/amairo.mp3', 0, true, true, () => {
            gl3.createTextureFromFile('image/sample.jpg', 0, shaderLoader);
        });
    }, false);

    function shaderLoader(){
        // base texture program
        basePrg = gl3.createProgramFromFile(
            'shader/base.vert',
            'shader/base.frag',
            ['position', 'normal', 'color', 'texCoord'],
            [3, 3, 4, 2],
            ['mMatrix', 'mvpMatrix', 'normalMatrix', 'eyePosition', 'lightPosition', 'ambient', 'texture'],
            ['matrix4fv', 'matrix4fv', 'matrix4fv', '3fv', '3fv', '3fv', '1i'],
            shaderLoadCheck
        );
        noisePrg = gl3.createProgramFromFile(
            'shader/noise.vert',
            'shader/noise.frag',
            ['position'],
            [3],
            ['textureUnit', 'resolution', 'time'],
            ['1i', '2fv', '1f'],
            shaderLoadCheck
        );
        function shaderLoadCheck(){
            if(
                basePrg.prg != null &&
                noisePrg.prg != null &&
                true
            ){init();}
        }
    }

    function init(){
        // torus
        let torusData = gl3.Mesh.torus(64, 64, 0.3, 0.7, [1.0, 1.0, 1.0, 1.0]);
        let torusVBO = [
            gl3.createVbo(torusData.position),
            gl3.createVbo(torusData.normal),
            gl3.createVbo(torusData.color),
            gl3.createVbo(torusData.texCoord)
        ];
        let torusIBO = gl3.createIbo(torusData.index);

        // plane
        let planePosition = [
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        let planeIndex = [
            0, 2, 1,
            1, 2, 3
        ];
        let planeVBO = [
            gl3.createVbo(planePosition)
        ];
        let planeIBO = gl3.createIbo(planeIndex);

        // matrix
        let mMatrix      = mat4.identity(mat4.create());
        let vMatrix      = mat4.identity(mat4.create());
        let pMatrix      = mat4.identity(mat4.create());
        let vpMatrix     = mat4.identity(mat4.create());
        let mvpMatrix    = mat4.identity(mat4.create());
        let normalMatrix = mat4.identity(mat4.create());
        let invMatrix    = mat4.identity(mat4.create());

        // framebuffer
        let framebuffer = gl3.createFramebuffer(canvasWidth, canvasHeight, 1);

        // texture
        gl3.textures.map((v, i) => {
            if(v != null && v.texture != null){
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, v.texture);
            }
        });

        // flags
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        // variables
        let beginTime = Date.now();
        let nowTime = 0;
        let cameraPosition = [0.0, 0.0, 5.0];
        let centerPoint    = [0.0, 0.0, 0.0];
        let upDirection    = [0.0, 1.0, 0.0];
        let lightPosition  = [2.0, 3.0, 4.0];
        let ambientColor   = [0.1, 0.1, 0.1];
        let targetTexture  = 0;

        // view x proj
        mat4.vpFromCameraProperty(
            cameraPosition,
            centerPoint,
            upDirection,
            60,
            canvasWidth / canvasHeight,
            0.1,
            10.0,
            vMatrix, pMatrix, vpMatrix
        );

        // audio
        audio.src[0].play();

        render();
        function render(){
            nowTime = Date.now() - beginTime;
            nowTime /= 1000;
            count++;

            // animation
            if(run){requestAnimationFrame(render);}

            // canvas
            canvasWidth   = window.innerWidth;
            canvasHeight  = window.innerHeight;
            canvas.width  = canvasWidth;
            canvas.height = canvasHeight;

            // render to framebuffer ==========================================
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);
            gl3.sceneView(0, 0, canvasWidth, canvasHeight);
            gl3.sceneClear([0.3, 0.3, 0.4, 1.0], 1.0);

            // program
            basePrg.useProgram();
            basePrg.setAttribute(torusVBO, torusIBO);

            // model and draw
            mat4.identity(mMatrix);
            mat4.translate(mMatrix, [0.0, 0.0, Math.sin(nowTime) * 0.5], mMatrix);
            mat4.rotate(mMatrix, nowTime, [1.0, 1.0, 0.0], mMatrix);
            mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
            mat4.inverse(mMatrix, invMatrix);
            mat4.transpose(invMatrix, normalMatrix);
            basePrg.pushShader([
                mMatrix,
                mvpMatrix,
                normalMatrix,
                cameraPosition,
                lightPosition,
                ambientColor,
                targetTexture
            ]);
            gl3.drawElements(gl.TRIANGLES, torusData.index.length);

            // render to canvas
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl3.sceneView(0, 0, canvasWidth, canvasHeight);
            gl3.sceneClear([0.0, 0.0, 0.0, 1.0], 1.0);

            // program
            noisePrg.useProgram();
            noisePrg.setAttribute(planeVBO, planeIBO);
            noisePrg.pushShader([1, [canvasWidth, canvasHeight], nowTime]);
            gl3.drawElements(gl.TRIANGLES, planeIndex.length);

            // final
            gl.flush();
        }
    }
})();

