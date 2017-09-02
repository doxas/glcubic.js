
/**
 * gl3Mesh
 * @class
 */
export default class gl3Mesh {
    /**
     * 板ポリゴンの頂点情報を生成する
     * @param {number} width - 板ポリゴンの一辺の幅
     * @param {number} height - 板ポリゴンの一辺の高さ
     * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
     * トーラスの頂点情報を生成する
     * @param {number} row - 輪の分割数
     * @param {number} column - パイプ断面の分割数
     * @param {number} irad - パイプ断面の半径
     * @param {number} orad - パイプ全体の半径
     * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
     * 球体の頂点情報を生成する
     * @param {number} row - 球の縦方向（緯度方向）の分割数
     * @param {number} column - 球の横方向（経度方向）の分割数
     * @param {number} rad - 球の半径
     * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
     * 円（XY 平面展開）の頂点情報を生成する
     * @param {number} split - 円の円周の分割数
     * @param {number} rad - 球の半径
     * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
     */
    static circle(split, rad, color){
        // let i, j;
        // let pos = [], nor = [],
        //     col = [], st  = [], idx = [];
        // for(i = 0; i <= row; i++){
        //     let r = Math.PI / row * i;
        //     let ry = Math.cos(r);
        //     let rr = Math.sin(r);
        //     for(j = 0; j <= column; j++){
        //         let tr = Math.PI * 2 / column * j;
        //         let tx = rr * rad * Math.cos(tr);
        //         let ty = ry * rad;
        //         let tz = rr * rad * Math.sin(tr);
        //         let rx = rr * Math.cos(tr);
        //         let rz = rr * Math.sin(tr);
        //         pos.push(tx, ty, tz);
        //         nor.push(rx, ry, rz);
        //         col.push(color[0], color[1], color[2], color[3]);
        //         st.push(1 - 1 / column * j, 1 / row * i);
        //     }
        // }
        // for(i = 0; i < row; i++){
        //     for(j = 0; j < column; j++){
        //         let r = (column + 1) * i + j;
        //         idx.push(r, r + 1, r + column + 2);
        //         idx.push(r, r + column + 2, r + column + 1);
        //     }
        // }
        // return {position: pos, normal: nor, color: col, texCoord: st, index: idx}
    }

    /**
     * キューブの頂点情報を生成する
     * @param {number} side - 正立方体の一辺の長さ
     * @param {Array.<number>} [color] - RGBA を 0.0 から 1.0 の範囲で指定した配列
     * @return {object}
     * @property {Array.<number>} position - 頂点座標
     * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
     * @property {Array.<number>} color - 頂点カラー
     * @property {Array.<number>} texCoord - テクスチャ座標
     * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
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
}

