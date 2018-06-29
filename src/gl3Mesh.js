
/**
 * gl3Mesh
 * @class
 */
export default class gl3Mesh {
    /**
     * 板ポリゴンの頂点情報を生成する
     * @param {number} width - 板ポリゴンの一辺の幅
     * @param {number} height - 板ポリゴンの一辺の高さ
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let planeData = gl3.Mesh.plane(2.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static plane(width, height, color){
        let w, h;
        w = width / 2;
        h = height / 2;
        if(color){
            tc = color;
        }else{
            tc = [1.0, 1.0, 1.0, 1.0];
        }
        let pos = [
            -w,  h,  0.0,
             w,  h,  0.0,
            -w, -h,  0.0,
             w, -h,  0.0
        ];
        let nor = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ];
        let col = [
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3]
        ];
        let st  = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];
        let idx = [
            0, 1, 2,
            2, 1, 3
        ];
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * 円（XY 平面展開）の頂点情報を生成する
     * @param {number} split - 円の円周の分割数
     * @param {number} rad - 円の半径
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let circleData = gl3.Mesh.circle(64, 1.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static circle(split, rad, color){
        let i, j = 0;
        let pos = [], nor = [],
            col = [], st  = [], idx = [];
        pos.push(0.0, 0.0, 0.0);
        nor.push(0.0, 0.0, 1.0);
        col.push(color[0], color[1], color[2], color[3]);
        st.push(0.5, 0.5);
        for(i = 0; i < split; i++){
            let r = Math.PI * 2.0 / split * i;
            let rx = Math.cos(r);
            let ry = Math.sin(r);
            pos.push(rx * rad, ry * rad, 0.0);
            nor.push(0.0, 0.0, 1.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push((rx + 1.0) * 0.5, 1.0 - (ry + 1.0) * 0.5);
            if(i === split - 1){
                idx.push(0, j + 1, 1);
            }else{
                idx.push(0, j + 1, j + 2);
            }
            ++j;
        }
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * キューブの頂点情報を生成する
     * @param {number} side - 正立方体の一辺の長さ
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let cubeData = gl3.Mesh.cube(2.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static cube(side, color){
        let hs = side * 0.5;
        let pos = [
            -hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,  hs,
            -hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs, -hs,
            -hs,  hs, -hs, -hs,  hs,  hs,  hs,  hs,  hs,  hs,  hs, -hs,
            -hs, -hs, -hs,  hs, -hs, -hs,  hs, -hs,  hs, -hs, -hs,  hs,
             hs, -hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,
            -hs, -hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs
        ];
        let v = 1.0 / Math.sqrt(3.0);
        let nor = [
            -v, -v,  v,  v, -v,  v,  v,  v,  v, -v,  v,  v,
            -v, -v, -v, -v,  v, -v,  v,  v, -v,  v, -v, -v,
            -v,  v, -v, -v,  v,  v,  v,  v,  v,  v,  v, -v,
            -v, -v, -v,  v, -v, -v,  v, -v,  v, -v, -v,  v,
             v, -v, -v,  v,  v, -v,  v,  v,  v,  v, -v,  v,
            -v, -v, -v, -v, -v,  v, -v,  v,  v, -v,  v, -v
        ];
        let col = [];
        for(let i = 0; i < pos.length / 3; i++){
            col.push(color[0], color[1], color[2], color[3]);
        }
        let st = [
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
        ];
        let idx = [
             0,  1,  2,  0,  2,  3,
             4,  5,  6,  4,  6,  7,
             8,  9, 10,  8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * 三角錐の頂点情報を生成する
     * @param {number} split - 底面円の円周の分割数
     * @param {number} rad - 底面円の半径
     * @param {number} height - 三角錐の高さ
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let coneData = gl3.Mesh.cone(64, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static cone(split, rad, height, color){
        let i, j = 0;
        let h = height / 2.0;
        let pos = [], nor = [],
            col = [], st  = [], idx = [];
        pos.push(0.0, -h, 0.0);
        nor.push(0.0, -1.0, 0.0);
        col.push(color[0], color[1], color[2], color[3]);
        st.push(0.5, 0.5);
        for(i = 0; i <= split; i++){
            let r = Math.PI * 2.0 / split * i;
            let rx = Math.cos(r);
            let rz = Math.sin(r);
            pos.push(
                rx * rad, -h, rz * rad,
                rx * rad, -h, rz * rad
            );
            nor.push(
                0.0, -1.0, 0.0,
                rx, 0.0, rz
            );
            col.push(
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3]
            );
            st.push(
                (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5,
                (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5
            );
            if(i !== split){
                idx.push(0, j + 1, j + 3);
                idx.push(j + 4, j + 2, split * 2 + 3);
            }
            j += 2;
        }
        pos.push(0.0, h, 0.0);
        nor.push(0.0, 1.0, 0.0);
        col.push(color[0], color[1], color[2], color[3]);
        st.push(0.5, 0.5);
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * 円柱の頂点情報を生成する
     * @param {number} split - 円柱の円周の分割数
     * @param {number} topRad - 円柱の天面の半径
     * @param {number} bottomRad - 円柱の底面の半径
     * @param {number} height - 円柱の高さ
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let cylinderData = gl3.Mesh.cylinder(64, 0.5, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static cylinder(split, topRad, bottomRad, height, color){
        let i, j = 2;
        let h = height / 2.0;
        let pos = [], nor = [],
            col = [], st  = [], idx = [];
        pos.push(0.0, h, 0.0, 0.0, -h, 0.0,);
        nor.push(0.0, 1.0, 0.0, 0.0, -1.0, 0.0);
        col.push(
            color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3]
        );
        st.push(0.5, 0.5, 0.5, 0.5);
        for(i = 0; i <= split; i++){
            let r = Math.PI * 2.0 / split * i;
            let rx = Math.cos(r);
            let rz = Math.sin(r);
            pos.push(
                rx * topRad,  h, rz * topRad,
                rx * topRad,  h, rz * topRad,
                rx * bottomRad, -h, rz * bottomRad,
                rx * bottomRad, -h, rz * bottomRad
            );
            nor.push(
                0.0, 1.0, 0.0,
                rx, 0.0, rz,
                0.0, -1.0, 0.0,
                rx, 0.0, rz
            );
            col.push(
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3]
            );
            st.push(
                (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5,
                1.0 - i / split, 0.0,
                (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5,
                1.0 - i / split, 1.0
            );
            if(i !== split){
                idx.push(
                    0, j + 4, j,
                    1, j + 2, j + 6,
                    j + 5, j + 7, j + 1,
                    j + 1, j + 7, j + 3
                );
            }
            j += 4;
        }
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * 球体の頂点情報を生成する
     * @param {number} row - 球の縦方向（緯度方向）の分割数
     * @param {number} column - 球の横方向（経度方向）の分割数
     * @param {number} rad - 球の半径
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let sphereData = gl3.Mesh.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static sphere(row, column, rad, color){
        let i, j;
        let pos = [], nor = [],
            col = [], st  = [], idx = [];
        for(i = 0; i <= row; i++){
            let r = Math.PI / row * i;
            let ry = Math.cos(r);
            let rr = Math.sin(r);
            for(j = 0; j <= column; j++){
                let tr = Math.PI * 2 / column * j;
                let tx = rr * rad * Math.cos(tr);
                let ty = ry * rad;
                let tz = rr * rad * Math.sin(tr);
                let rx = rr * Math.cos(tr);
                let rz = rr * Math.sin(tr);
                pos.push(tx, ty, tz);
                nor.push(rx, ry, rz);
                col.push(color[0], color[1], color[2], color[3]);
                st.push(1 - 1 / column * j, 1 / row * i);
            }
        }
        for(i = 0; i < row; i++){
            for(j = 0; j < column; j++){
                let r = (column + 1) * i + j;
                idx.push(r, r + 1, r + column + 2);
                idx.push(r, r + column + 2, r + column + 1);
            }
        }
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * トーラスの頂点情報を生成する
     * @param {number} row - 輪の分割数
     * @param {number} column - パイプ断面の分割数
     * @param {number} irad - パイプ断面の半径
     * @param {number} orad - パイプ全体の半径
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let torusData = gl3.Mesh.torus(64, 64, 0.25, 0.75, [1.0, 1.0, 1.0, 1.0]);
     */
    static torus(row, column, irad, orad, color){
        let i, j;
        let pos = [], nor = [],
            col = [], st  = [], idx = [];
        for(i = 0; i <= row; i++){
            let r = Math.PI * 2 / row * i;
            let rr = Math.cos(r);
            let ry = Math.sin(r);
            for(j = 0; j <= column; j++){
                let tr = Math.PI * 2 / column * j;
                let tx = (rr * irad + orad) * Math.cos(tr);
                let ty = ry * irad;
                let tz = (rr * irad + orad) * Math.sin(tr);
                let rx = rr * Math.cos(tr);
                let rz = rr * Math.sin(tr);
                let rs = 1 / column * j;
                let rt = 1 / row * i + 0.5;
                if(rt > 1.0){rt -= 1.0;}
                rt = 1.0 - rt;
                pos.push(tx, ty, tz);
                nor.push(rx, ry, rz);
                col.push(color[0], color[1], color[2], color[3]);
                st.push(rs, rt);
            }
        }
        for(i = 0; i < row; i++){
            for(j = 0; j < column; j++){
                let r = (column + 1) * i + j;
                idx.push(r, r + column + 1, r + 1);
                idx.push(r + column + 1, r + column + 2, r + 1);
            }
        }
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * 正二十面体の頂点情報を生成する
     * @param {number} rad - サイズ（黄金比に対する比率）
     * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     * @example
     * let icosaData = gl3.Mesh.icosahedron(1.0, [1.0, 1.0, 1.0, 1.0]);
     */
    static icosahedron(rad, color){
        let i, j;
        let pos = [], nor = [],
            col = [], st  = [], idx = [];
        let c = (1.0 + Math.sqrt(5.0)) / 2.0;
        let t = c * rad;
        let l = Math.sqrt(1.0 + c * c);
        let r = [1.0 / l, c / l];
        pos = [
            -rad,    t,  0.0,  rad,    t,  0.0, -rad,   -t,  0.0,  rad,   -t,  0.0,
             0.0, -rad,    t,  0.0,  rad,    t,  0.0, -rad,   -t,  0.0,  rad,   -t,
               t,  0.0, -rad,    t,  0.0,  rad,   -t,  0.0, -rad,   -t,  0.0,  rad
        ];
        nor = [
            -r[0],  r[1],   0.0,  r[0],  r[1],   0.0, -r[0], -r[1],   0.0,  r[0], -r[1],   0.0,
              0.0, -r[0],  r[1],   0.0,  r[0],  r[1],   0.0, -r[0], -r[1],   0.0,  r[0], -r[1],
             r[1],   0.0, -r[0],  r[1],   0.0,  r[0], -r[1],   0.0, -r[0], -r[1],   0.0,  r[0]
        ];
        col = [
            color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3],
            color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]
        ];
        for(let i = 0, j = nor.length; i < j; i += 3){
            let u = (Math.atan2(nor[i + 2], -nor[i]) + Math.PI) / (Math.PI * 2.0);
            let v = 1.0 - (nor[i + 1] + 1.0) / 2.0;
            st.push(u, v);
        }
        idx = [
             0, 11,  5,  0,  5,  1,  0,  1,  7,  0,  7, 10,  0, 10, 11,
             1,  5,  9,  5, 11,  4, 11, 10,  2, 10,  7,  6,  7,  1,  8,
             3,  9,  4,  3,  4,  2,  3,  2,  6,  3,  6,  8,  3,  8,  9,
             4,  9,  5,  2,  4, 11,  6,  2, 10,  8,  6,  7,  9,  8,  1
        ];
        return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }
}

