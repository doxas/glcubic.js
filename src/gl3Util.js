
/**
 * gl3Util
 * @class gl3Util
 */
export default class gl3Util {
    /**
     * HSV カラーを生成して配列で返す
     * @param {number} h - 色相
     * @param {number} s - 彩度
     * @param {number} v - 明度
     * @param {number} a - アルファ
     * @return {Array.<number>} RGBA を 0.0 から 1.0 の範囲に正規化した色の配列
     */
    static hsva(h, s, v, a){
        if(s > 1 || v > 1 || a > 1){return;}
        let th = h % 360;
        let i = Math.floor(th / 60);
        let f = th / 60 - i;
        let m = v * (1 - s);
        let n = v * (1 - s * f);
        let k = v * (1 - s * (1 - f));
        let color = new Array();
        if(!s > 0 && !s < 0){
            color.push(v, v, v, a);
        } else {
            let r = new Array(v, n, m, m, k, v);
            let g = new Array(k, v, v, n, m, m);
            let b = new Array(m, m, k, v, v, n);
            color.push(r[i], g[i], b[i], a);
        }
        return color;
    }
    /**
     * イージング
     * @param {number} t - 0.0 から 1.0 の値
     * @return {number} イージングした結果
     */
    static easeLiner(t){
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    /**
     * イージング
     * @param {number} t - 0.0 から 1.0 の値
     * @return {number} イージングした結果
     */
    static easeOutCubic(t){
        return (t = t / 1 - 1) * t * t + 1;
    }
    /**
     * イージング
     * @param {number} t - 0.0 から 1.0 の値
     * @return {number} イージングした結果
     */
    static easeQuintic(t){
        let ts = (t = t / 1) * t;
        let tc = ts * t;
        return (tc * ts);
    }
}

