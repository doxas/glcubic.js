
gl3.common = function(){};


// ------------------------------------------------------------------------------------------------
// util
// ------------------------------------------------------------------------------------------------

function mesh(){
	this.position;
	this.normal;
	this.color;
	this.texCoord;
	this.index;
}

function radian(){
	this.rad = new Array();
	this.sin = new Array();
	this.cos = new Array();
	for(var i = 0; i < 360; i++){
		this.rad.push(i * Math.PI / 180);
		this.sin.push(Math.sin(this.rad[i]));
		this.cos.push(Math.cos(this.rad[i]));
	}
}


