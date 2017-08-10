// post.frag ------------------------------------------------------------------
// バリューノイズを使うと、まるで水中のようなゆらゆらシェーダも簡単に実現できま
// す。これは乱数を使ったサンプルの一例ですが、揺らがせる強さを RGB ごとに個別に
// 変化させたりすることも、シェーダの仕組みがわかっていれば簡単ですね。
// ----------------------------------------------------------------------------
precision mediump float;
uniform sampler2D textureUnit;
uniform vec2      resolution; // スクリーン解像度
uniform float     time;       // 時間の経過
varying vec2 vTexCoord;
const int   oct  = 8;         // オクターブ
const float per  = 0.5;       // パーセンテージ
const float PI   = 3.1415926; // 円周率

float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return a * (1.0 - f) + b * f;
}
float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}
float irnd(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
                  rnd(vec2(i.x + 1.0, i.y      )),
                  rnd(vec2(i.x,       i.y + 1.0)),
                  rnd(vec2(i.x + 1.0, i.y + 1.0)));
    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}
float noise(vec2 p){
    float t = 0.0;
    for(int i = 0; i < oct; i++){
        float freq = pow(2.0, float(i));
        float amp  = pow(per, float(oct - i));
        t += irnd(vec2(p.x / freq, p.y / freq)) * amp;
    }
    return t;
}
float snoise(vec2 p, vec2 q, vec2 r){
    return noise(vec2(p.x,       p.y      )) *        q.x  *        q.y  +
           noise(vec2(p.x,       p.y + r.y)) *        q.x  * (1.0 - q.y) +
           noise(vec2(p.x + r.x, p.y      )) * (1.0 - q.x) *        q.y  +
           noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);
}
void main(void){
    // ノイズ用のシード値を時間の経過によって変化させる
    vec2 v = gl_FragCoord.st + vec2(0.0, time * 100.0);
    // ノイズを得る
    float r = snoise(v, gl_FragCoord.st / resolution, resolution);
    // ノイズの値を若干補正して小さめに
    float s = (r - 0.5) * 0.1;
    // テクスチャの色（ノイズから得た値を参照時に補正値として使う）
    vec4 samplerColor = texture2D(textureUnit, vTexCoord + vec2(s));
    // テクスチャの色にノイズの値を掛ける
    gl_FragColor = samplerColor;
}

