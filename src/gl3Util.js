
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

    /**
     * 度数法の角度から弧度法の値へ変換する
     * @param {number} deg - 度数法の角度
     * @return {number} 弧度法の値
     */
    static degToRad(deg){
        return (deg % 360) * Math.PI / 180;
    }

    /**
     * 赤道半径（km）
     * @type {number}
     */
    static get EARTH_RADIUS(){return 6378.137;}

    /**
     * 赤道円周（km）
     * @type {number}
     */
    static get EARTH_CIRCUM(){return gl3Util.EARTH_RADIUS * Math.PI * 2.0;}

    /**
     * 赤道円周の半分（km）
     * @type {number}
     */
    static get EARTH_HALF_CIRCUM(){return gl3Util.EARTH_RADIUS * Math.PI;}

    /**
     * メルカトル座標系における最大緯度
     * @type {number}
     */
    static get EARTH_MAX_LAT(){return 85.05112878;}

    /**
     * 経度を元にメルカトル座標を返す
     * @param {number} lon - 経度
     * @return {number} メルカトル座標系における X
     */
    static lonToMer(lon){
        return gl3Util.EARTH_RADIUS * gl3Util.degToRad(lon);
    }

    /**
     * 緯度を元にメルカトル座標を返す
     * @param {number} lat - 緯度
     * @param {number} [flatten=0] - 扁平率
     * @return {number} メルカトル座標系における Y
     */
    static latToMer(lat, flatten = 0){
        let flattening = flatten;
        if(isNaN(parseFloat(flatten))){
            flattening = 0;
        }
        let clamp = 0.0001;
        if(lat >= 90 - clamp){
            lat = 90 - clamp;
        }
        if(lat <= -90 + clamp){
            lat = -90 + clamp;
        }
        let temp = (1 - flattening);
        let es = 1.0 - (temp * temp);
        let eccent = Math.sqrt(es);
        let phi = gl3Util.degToRad(lat);
        let sinphi = Math.sin(phi);
        let con = eccent * sinphi;
        let com = 0.5 * eccent;
        con = Math.pow((1.0 - con) / (1.0 + con), com);
        let ts = Math.tan(0.5 * (Math.PI * 0.5 - phi)) / con;
        return gl3Util.EARTH_RADIUS * Math.log(ts);
    }

    /**
     * 緯度経度をメルカトル座標系に変換して返す
     * @param {number} lon - 経度
     * @param {number} lat - 緯度
     * @param {number} [flatten=0] - 扁平率
     * @return {obj}
     * @property {number} x - メルカトル座標系における X 座標
     * @property {number} y - メルカトル座標系における Y 座標
     */
    static lonLatToMer(lon, lat, flatten = 0){
        return {
            x: gl3Util.lonToMer(lon),
            y: gl3Util.latToMer(lat, flattening)
        };
    }

    /**
     * メルカトル座標を緯度経度に変換して返す
     * @param {number} x - メルカトル座標系における X 座標
     * @param {number} y - メルカトル座標系における Y 座標
     * @return {obj}
     * @property {number} lon - 経度
     * @property {number} lat - 緯度
     */
    static merToLonLat(x, y){
        let lon = (x / gl3Util.EARTH_HALF_CIRCUM) * 180;
        let lat = (y / gl3Util.EARTH_HALF_CIRCUM) * 180;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
        return {
            lon: lon,
            lat: lat
        };
    }

    /**
     * 経度からタイルインデックスを求めて返す
     * @param {number} lon - 経度
     * @param {number} zoom - ズームレベル
     * @return {number} 経度方向のタイルインデックス
     */
    static lonToTile(lon, zoom){
        return Math.floor((lon / 180 + 1) * Math.pow(2, zoom) / 2);
    }

    /**
     * 緯度からタイルインデックスを求めて返す
     * @param {number} lat - 緯度
     * @param {number} zoom - ズームレベル
     * @return {number} 緯度方向のタイルインデックス
     */
    static latToTile(lat, zoom){
        return Math.floor((-Math.log(Math.tan((45 + lat / 2) * Math.PI / 180)) + Math.PI) * Math.pow(2, zoom) / (2 * Math.PI));
    }

    /**
     * 緯度経度をタイルインデックスに変換して返す
     * @param {number} lon - 経度
     * @param {number} lat - 緯度
     * @param {number} zoom - ズームレベル
     * @return {obj}
     * @property {number} lon - 経度方向のタイルインデックス
     * @property {number} lat - 緯度方向のタイルインデックス
     */
    static lonLatToTile(lon, lat, zoom){
        return {
            lon: gl3Util.lonToTile(lon, zoom),
            lat: gl3Util.latToTile(lat, zoom)
        };
    }

    /**
     * タイルインデックスから経度を求めて返す
     * @param {number} lon - 経度方向のタイルインデックス
     * @param {number} zoom - ズームレベル
     * @return {number} 経度
     */
    static tileToLon(lon, zoom){
        return (lon / Math.pow(2, zoom)) * 360 - 180;
    }

    /**
     * タイルインデックスから緯度を求めて返す
     * @param {number} lat - 緯度方向のタイルインデックス
     * @param {number} zoom - ズームレベル
     * @return {number} 緯度
     */
    static tileToLat(lat, zoom){
        let y = (lat / Math.pow(2, zoom)) * 2 * Math.PI - Math.PI;
        return 2 * Math.atan(Math.pow(Math.E, -y)) * 180 / Math.PI - 90;
    }

    /**
     * タイルインデックスから緯度経度を求めて返す
     * @param {number} lon - 経度
     * @param {number} lat - 緯度
     * @param {number} zoom - ズームレベル
     * @return {obj}
     * @property {number} lon - 経度方向のタイルインデックス
     * @property {number} lat - 緯度方向のタイルインデックス
     */
    static tileToLonLat(lon, lat, zoom){
        return {
            lon: gl3Util.tileToLon(lon, zoom),
            lat: gl3Util.tileToLat(lat, zoom)
        };
    }
}

