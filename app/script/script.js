
gl3.init('c');
if(!gl3.ready){alert('initialize error'); return;}
var prg = gl3.generate_program(
	'vs',
	'fs',
	['position', 'normal', 'color', 'texCoord'],
	[3, 3, 4, 2],
	['mvpMatrix', 'texture'],
	['matrix4fv', 'i1']
);


// メッシュ系は生成工程踏まえて再考
var mesh = new gl3.mesh();

var count = 0;

render();

function render(){
}

