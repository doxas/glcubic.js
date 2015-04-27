
gl3.mesh = {
	plane: function(width, height, color){
		var w, h, tc;
		w = width / 2;
		h = height / 2;
		if(color){
			tc = color;
		}else{
			tc = [1.0, 1.0, 1.0, 1.0];
		}
		var pos = [
			-w,  h,  0.0,
			 w,  h,  0.0,
			-w, -h,  0.0,
			 w, -h,  0.0
		];
		var nor = [
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
		];
		var col = [
			tc[0], tc[1], tc[2], tc[3],
			tc[0], tc[1], tc[2], tc[3],
			tc[0], tc[1], tc[2], tc[3],
			tc[0], tc[1], tc[2], tc[3]
		];
		var st  = [
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,
			1.0, 1.0
		];
		var idx = [
			0, 1, 2,
			2, 1, 3
		];
		return {position: pos, normal: nor, color: col, texCoord: st, index: idx};
	},

	torus: function(row, column, irad, orad, color){
		var i, j, tc;
		var pos = [], nor = [],
			col = [], st  = [], idx = [];
		for(i = 0; i <= row; i++){
			var r = Math.PI * 2 / row * i;
			var rr = Math.cos(r);
			var ry = Math.sin(r);
			for(j = 0; j <= column; j++){
				var tr = Math.PI * 2 / column * j;
				var tx = (rr * irad + orad) * Math.cos(tr);
				var ty = ry * irad;
				var tz = (rr * irad + orad) * Math.sin(tr);
				var rx = rr * Math.cos(tr);
				var rz = rr * Math.sin(tr);
				if(color){
					tc = color;
				}else{
					tc = gl3.util.hsva(360 / column * j, 1, 1, 1);
				}
				var rs = 1 / column * j;
				var rt = 1 / row * i + 0.5;
				if(rt > 1.0){rt -= 1.0;}
				rt = 1.0 - rt;
				pos.push(tx, ty, tz);
				nor.push(rx, ry, rz);
				col.push(tc[0], tc[1], tc[2], tc[3]);
				st.push(rs, rt);
			}
		}
		for(i = 0; i < row; i++){
			for(j = 0; j < column; j++){
				r = (column + 1) * i + j;
				idx.push(r, r + column + 1, r + 1);
				idx.push(r + column + 1, r + column + 2, r + 1);
			}
		}
		return {position: pos, normal: nor, color: col, texCoord: st, index: idx};
	},

	sphere: function(row, column, rad, color){
		var i, j, tc;
		var pos = [], nor = [],
			col = [], st  = [], idx = [];
		for(i = 0; i <= row; i++){
			var r = Math.PI / row * i;
			var ry = Math.cos(r);
			var rr = Math.sin(r);
			for(j = 0; j <= column; j++){
				var tr = Math.PI * 2 / column * j;
				var tx = rr * rad * Math.cos(tr);
				var ty = ry * rad;
				var tz = rr * rad * Math.sin(tr);
				var rx = rr * Math.cos(tr);
				var rz = rr * Math.sin(tr);
				if(color){
					tc = color;
				}else{
					tc = gl3.util.hsva(360 / row * i, 1, 1, 1);
				}
				pos.push(tx, ty, tz);
				nor.push(rx, ry, rz);
				col.push(tc[0], tc[1], tc[2], tc[3]);
				st.push(1 - 1 / column * j, 1 / row * i);
			}
		}
		r = 0;
		for(i = 0; i < row; i++){
			for(j = 0; j < column; j++){
				r = (column + 1) * i + j;
				idx.push(r, r + 1, r + column + 2);
				idx.push(r, r + column + 2, r + column + 1);
			}
		}
		return {position: pos, normal: nor, color: col, texCoord: st, index: idx};
	},

	cube: function(side, color){
		var tc, hs = side * 0.5;
		var pos = [
			-hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,  hs,
			-hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs, -hs,
			-hs,  hs, -hs, -hs,  hs,  hs,  hs,  hs,  hs,  hs,  hs, -hs,
			-hs, -hs, -hs,  hs, -hs, -hs,  hs, -hs,  hs, -hs, -hs,  hs,
			 hs, -hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,
			-hs, -hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs
		];
		var nor = [
			-1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
			-1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,
			-1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
			 1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,
			-1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
		];
		var col = [];
		for(var i = 0; i < pos.length / 3; i++){
			if(color){
				tc = color;
			}else{
				tc = gl3.util.hsva(360 / pos.length / 3 * i, 1, 1, 1);
			}
			col.push(tc[0], tc[1], tc[2], tc[3]);
		}
		var st = [
			0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
		];
		var idx = [
			 0,  1,  2,  0,  2,  3,
			 4,  5,  6,  4,  6,  7,
			 8,  9, 10,  8, 10, 11,
			12, 13, 14, 12, 14, 15,
			16, 17, 18, 16, 18, 19,
			20, 21, 22, 20, 22, 23
		];
		return {position: pos, normal: nor, color: col, texCoord: st, index: idx};
	}
};

