
(() => {
    // variable ===============================================================
    let gl, run, mat4, qtn, scene, camera, nowTime;
    let canvas, canvasWidth, canvasHeight;

    // shader
    let basePrg;

    // event
    let eveStart = 'mousedown';
    let eveMove  = 'mousemove';
    let eveEnd   = 'mouseup';

    // onload =================================================================
    window.addEventListener('load', () => {
        // initialize ---------------------------------------------------------
        gl3.init('canvas'); // @@@ id 名でも element でも受け取れるようにする
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        run           = true;
        canvas        = gl3.canvas;
        gl            = gl3.gl;
        mat4          = gl3.Mat4;
        qtn           = gl3.Qtn;
        canvasWidth   = window.innerWidth;
        canvasHeight  = window.innerHeight;
        canvas.width  = canvasWidth;
        canvas.height = canvasHeight;

        window.addEventListener('keydown', function(eve){
            if(eve.keyCode === 27){
                run = false;
            }
        }, false);

        // camera and event attach
        canvas.addEventListener(eveStart, camera.generateEventInteractionStart(), false);
        canvas.addEventListener(eveMove, camera.generateEventInteractionMove(), false);
        canvas.addEventListener(eveEnd, camera.generateEventInteractionEnd(), false);
        canvas.addEventListener('wheel', camera.generateEventInteractionWheel(), false);
        canvas.addEventListener('contextmenu', camera.generateEventDisableContext(), false);

        // start async load
        gl3.createTextureFromImage('image/sample.jpg', 0, shaderLoader);
    }, false);

    function shaderLoader(){
        // base texture program
        basePrg = gl3.createProgramFromFile(
            'shader/base.vert',
            'shader/base.frag',
            ['position', 'normal', 'color', 'texCoord'],
            [3, 3, 4, 2],
            ['mMatrix', 'mvpMatrix', 'normalMatrix', 'eyePosition', 'lightPosition', 'ambient', 'texture'],
            ['matrix4fv', 'matrix4fv', 'matrix4fv', '3fv', '3fv', '4fv', '1i'],
            shaderLoadCheck
        );
        function shaderLoadCheck(){
            if(basePrg.prg != null){init();}
        }
    }

    function init(){
        // @@@ ジオメトリ生成など

        // gl flags @@@ フラグ関係
        CTX.setEnable(true, false, false); // 深度テスト、カリング、ブレンド

        // rendering
        let count = 0;
        let beginTime = Date.now();
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

            // @@@ レンダリング

            // final
            gl.flush();
        }
    }
})();

