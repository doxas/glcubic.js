
/**
 * @example
 * let wrapper = new gl3.Gui.Wrapper();
 * document.body.appendChild(wrapper.getElement());
 *
 * let slider = new gl3.Gui.Slider('test', 50, 0, 100, 1);
 * slider.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(slider.getElement());
 *
 * let check = new gl3.Gui.Checkbox('hoge', false);
 * check.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(check.getElement());
 *
 * let radio = new gl3.Gui.Radio('hoge', null, false);
 * radio.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(radio.getElement());
 *
 * let select = new gl3.Gui.Select('fuga', ['foo', 'baa'], 0);
 * select.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(select.getElement());
 *
 * let spin = new gl3.Gui.Spin('hoge', 0.0, -1.0, 1.0, 0.1);
 * spin.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(spin.getElement());
 *
 * let color = new gl3.Gui.Color('fuga', '#ff0000');
 * color.add('change', (eve, self) => {console.log(self.getValue(), self.getFloatValue());});
 * wrapper.append(color.getElement());
 */

/**
 * gl3Gui
 * @class gl3Gui
 */
export default class gl3Gui {
    /**
     * @constructor
     */
    constructor(){
        /**
         * GUIWrapper
         * @type {GUIWrapper}
         */
        this.Wrapper = GUIWrapper;
        /**
         * GUIElement
         * @type {GUIElement}
         */
        this.Element = GUIElement;
        /**
         * GUISlider
         * @type {GUISlider}
         */
        this.Slider = GUISlider;
        /**
         * GUICheckbox
         * @type {GUICheckbox}
         */
        this.Checkbox = GUICheckbox;
        /**
         * GUIRadio
         * @type {GUIRadio}
         */
        this.Radio = GUIRadio;
        /**
         * GUISelect
         * @type {GUISelect}
         */
        this.Select = GUISelect;
        /**
         * GUISpin
         * @type {GUISpin}
         */
        this.Spin = GUISpin;
        /**
         * GUIColor
         * @type {GUIColor}
         */
        this.Color = GUIColor;
    }
}

/**
 * GUIWrapper
 * @class GUIWrapper
 */
class GUIWrapper {
    /**
     * @constructor
     */
    constructor(){
        /**
         * GUI 全体を包むラッパー DOM
         * @type {HTMLDivElement}
         */
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.top = '0px';
        this.element.style.right = '0px';
        this.element.style.width = '340px';
        this.element.style.height = '100%';
        this.element.style.transition = 'right 0.8s cubic-bezier(0, 0, 0, 1.0)';
        /**
         * GUI パーツを包むラッパー DOM
         * @type {HTMLDivElement}
         */
        this.wrapper = document.createElement('div');
        this.wrapper.style.backgroundColor = 'rgba(64, 64, 64, 0.5)';
        this.wrapper.style.height = '100%';
        this.wrapper.style.overflow = 'auto';
        /**
         * GUI 折りたたみトグル
         * @type {HTMLDivElement}
         */
        this.toggle = document.createElement('div');
        this.toggle.className = 'visible';
        this.toggle.textContent = '▶';
        this.toggle.style.fontSize = '18px';
        this.toggle.style.lineHeight = '32px';
        this.toggle.style.color = 'rgba(240, 240, 240, 0.5)';
        this.toggle.style.backgroundColor = 'rgba(32, 32, 32, 0.5)';
        this.toggle.style.border = '1px solid rgba(240, 240, 240, 0.2)';
        this.toggle.style.borderRadius = '25px';
        this.toggle.style.boxShadow = '0px 0px 2px 2px rgba(8, 8, 8, 0.8)';
        this.toggle.style.position = 'absolute';
        this.toggle.style.top = '20px';
        this.toggle.style.right = '360px';
        this.toggle.style.width = '32px';
        this.toggle.style.height = '32px';
        this.toggle.style.cursor = 'pointer';
        this.toggle.style.transform = 'rotate(0deg)';
        this.toggle.style.transition = 'transform 0.5s cubic-bezier(0, 0, 0, 1.0)';

        this.element.appendChild(this.toggle);
        this.element.appendChild(this.wrapper);

        this.toggle.addEventListener('click', () => {
            this.toggle.classList.toggle('visible');
            if(this.toggle.classList.contains('visible')){
                this.element.style.right = '0px';
                this.toggle.style.transform = 'rotate(0deg)';
            }else{
                this.element.style.right = '-340px';
                this.toggle.style.transform = 'rotate(-180deg)';
            }
        });
    }
    /**
     * エレメントを返す
     * @return {HTMLDivElement}
     */
    getElement(){
        return this.element;
    }
    /**
     * 子要素をアペンドする
     * @param {HTMLElement} element - アペンドする要素
     */
    append(element){
        this.wrapper.appendChild(element);
    }
}

/**
 * GUIElement
 * @class GUIElement
 */
class GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     */
    constructor(text = ''){
        /**
         * エレメントラッパー DOM
         * @type {HTMLDivElement}
         */
        this.element = document.createElement('div');
        this.element.style.fontSize = 'small';
        this.element.style.textAlign = 'center';
        this.element.style.width = '320px';
        this.element.style.height = '30px';
        this.element.style.lineHeight = '30px';
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'row';
        this.element.style.justifyContent = 'flex-start';
        /**
         * ラベル用エレメント DOM
         * @type {HTMLSpanElement}
         */
        this.label = document.createElement('span');
        this.label.textContent = text;
        this.label.style.color = '#222';
        this.label.style.textShadow = '0px 0px 5px white';
        this.label.style.display = 'inline-block';
        this.label.style.margin = 'auto 5px';
        this.label.style.width = '100px';
        this.label.style.overflow = 'hidden';
        this.element.appendChild(this.label);
        /**
         * 値表示用 DOM
         * @type {HTMLSpanElement}
         */
        this.value = document.createElement('span');
        this.value.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        this.value.style.color = 'whitesmoke';
        this.value.style.fontSize = 'x-small';
        this.value.style.textShadow = '0px 0px 5px black';
        this.value.style.display = 'inline-block';
        this.value.style.margin = 'auto 5px';
        this.value.style.width = '50px';
        this.value.style.overflow = 'hidden';
        this.element.appendChild(this.value);
        /**
         * コントロール DOM
         * @type {HTMLElement}
         */
        this.control = null;
        /**
         * ラベルに設定するテキスト
         * @type {string}
         */
        this.text = text;
        /**
         * イベントリスナ
         * @type {object}
         */
        this.listeners = {};
    }
    /**
     * イベントリスナを登録する
     * @param {string} type - イベントタイプ
     * @param {function} func - 登録する関数
     */
    add(type, func){
        if(this.control == null || type == null || func == null){return;}
        if(Object.prototype.toString.call(type) !== '[object String]'){return;}
        if(Object.prototype.toString.call(func) !== '[object Function]'){return;}
        this.listeners[type] = func;
    }
    /**
     * イベントを発火する
     * @param {string} type - 発火するイベントタイプ
     * @param {Event} eve - Event オブジェクト
     */
    emit(type, eve){
        if(this.control == null || !this.listeners.hasOwnProperty(type)){return;}
        this.listeners[type](eve, this);
    }
    /**
     * イベントリスナを登録解除する
     */
    remove(){
        if(this.control == null || !this.listeners.hasOwnProperty(type)){return;}
        this.listeners[type] = null;
        delete this.listeners[type];
    }
    /**
     * ラベルテキストとコントロールの値を更新する
     * @param {mixed} value - 設定する値
     */
    setValue(value){
        this.value.textContent = value;
        this.control.value = value;
    }
    /**
     * コントロールに設定されている値を返す
     * @return {mixed} コントロールに設定されている値
     */
    getValue(){
        return this.control.value;
    }
    /**
     * コントロールエレメントを返す
     * @return {HTMLElement}
     */
    getControl(){
        return this.control;
    }
    /**
     * ラベルに設定されているテキストを返す
     * @return {string} ラベルに設定されている値
     */
    getText(){
        return this.text;
    }
    /**
     * エレメントを返す
     * @return {HTMLDivElement}
     */
    getElement(){
        return this.element;
    }
}

/**
 * GUISlider
 * @class GUISlider
 */
class GUISlider extends GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     * @param {number} [value=0] - コントロールに設定する値
     * @param {number} [min=0] - スライダーの最小値
     * @param {number} [max=100] - スライダーの最大値
     * @param {number} [step=1] - スライダーのステップ数
     */
    constructor(text = '', value = 0, min = 0, max = 100, step = 1){
        super(text);
        /**
         * コントロールエレメント
         * @type {HTMLInputElement}
         */
        this.control = document.createElement('input');
        this.control.setAttribute('type', 'range');
        this.control.setAttribute('min', min);
        this.control.setAttribute('max', max);
        this.control.setAttribute('step', step);
        this.control.value = value;
        this.control.style.margin = 'auto';
        this.control.style.verticalAlign = 'middle';
        this.element.appendChild(this.control);

        // set
        this.setValue(this.control.value);

        // event
        this.control.addEventListener('input', (eve) => {
            this.emit('input', eve);
            this.setValue(this.control.value);
        }, false);
    }
    /**
     * スライダーの最小値をセットする
     * @param {number} min - 最小値に設定する値
     */
    setMin(min){
        this.control.setAttribute('min', min);
    }
    /**
     * スライダーの最大値をセットする
     * @param {number} max - 最大値に設定する値
     */
    setMax(max){
        this.control.setAttribute('max', max);
    }
    /**
     * スライダーのステップ数をセットする
     * @param {number} step - ステップ数に設定する値
     */
    setStep(step){
        this.control.setAttribute('step', step);
    }
}

/**
 * GUICheckbox
 * @class GUICheckbox
 */
class GUICheckbox extends GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     * @param {boolean} [checked=false] - コントロールに設定する値
     */
    constructor(text = '', checked = false){
        super(text);
        /**
         * コントロールエレメント
         * @type {HTMLInputElement}
         */
        this.control = document.createElement('input');
        this.control.setAttribute('type', 'checkbox');
        this.control.checked = checked;
        this.control.style.margin = 'auto';
        this.control.style.verticalAlign = 'middle';
        this.element.appendChild(this.control);

        // set
        this.setValue(this.control.checked);

        // event
        this.control.addEventListener('change', (eve) => {
            this.emit('change', eve);
            this.setValue(this.control.checked);
        }, false);
    }
    /**
     * コントロールに値を設定する
     * @param {boolean} checked - コントロールに設定する値
     */
    setValue(checked){
        this.value.textContent = checked;
        this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */
    getValue(){
        return this.control.checked;
    }
}

/**
 * GUIRadio
 * @class GUIRadio
 */
class GUIRadio extends GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     * @param {string} [name='gl3radio'] - エレメントに設定する名前
     * @param {boolean} [checked=false] - コントロールに設定する値
     */
    constructor(text = '', name = 'gl3radio', checked = false){
        super(text);
        /**
         * コントロールエレメント
         * @type {HTMLInputElement}
         */
        this.control = document.createElement('input');
        this.control.setAttribute('type', 'radio');
        this.control.setAttribute('name', name);
        this.control.checked = checked;
        this.control.style.margin = 'auto';
        this.control.style.verticalAlign = 'middle';
        this.element.appendChild(this.control);

        // set
        this.setValue(this.control.checked);

        // event
        this.control.addEventListener('change', (eve) => {
            this.emit('change', eve);
            this.setValue(this.control.checked);
        }, false);
    }
    /**
     * コントロールに値を設定する
     * @param {boolean} checked - コントロールに設定する値
     */
    setValue(checked){
        this.value.textContent = '---';
        this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */
    getValue(){
        return this.control.checked;
    }
}

/**
 * GUISelect
 * @class GUISelect
 */
class GUISelect extends GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     * @param {Array.<string>} [list=[]] - リストに登録するアイテムを指定する文字列の配列
     * @param {number} [selectedIndex=0] - コントロールで選択するインデックス
     */
    constructor(text = '', list = [], selectedIndex = 0){
        super(text);
        /**
         * コントロールエレメント
         * @type {HTMLSelectElement}
         */
        this.control = document.createElement('select');
        list.map((v) => {
            let opt = new Option(v, v);
            this.control.add(opt);
        });
        this.control.selectedIndex = selectedIndex;
        this.control.style.width = '130px';
        this.control.style.margin = 'auto';
        this.control.style.verticalAlign = 'middle';
        this.element.appendChild(this.control);

        // set
        this.setValue(this.control.value);

        // event
        this.control.addEventListener('change', (eve) => {
            this.emit('change', eve);
            this.setValue(this.control.value);
        }, false);
    }
    /**
     * コントロールで選択するインデックスを指定する
     * @param {number} index - 指定するインデックス
     */
    setSelectedIndex(index){
        this.control.selectedIndex = index;
    }
    /**
     * コントロールが現在選択しているインデックスを返す
     * @return {number} 現在選択しているインデックス
     */
    getSelectedIndex(){
        return this.control.selectedIndex;
    }
}

/**
 * GUISpin
 * @class GUISpin
 */
class GUISpin extends GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     * @param {number} [value=0.0] - コントロールに設定する値
     * @param {number} [min=-1.0] - スピンする際の最小値
     * @param {number} [max=1.0] - スピンする際の最大値
     * @param {number} [step=0.1] - スピンするステップ数
     */
    constructor(text = '', value = 0.0, min = -1.0, max = 1.0, step = 0.1){
        super(text);
        /**
         * コントロールエレメント
         * @type {HTMLInputElement}
         */
        this.control = document.createElement('input');
        this.control.setAttribute('type', 'number');
        this.control.setAttribute('min', min);
        this.control.setAttribute('max', max);
        this.control.setAttribute('step', step);
        this.control.value = value;
        this.control.style.margin = 'auto';
        this.control.style.verticalAlign = 'middle';
        this.element.appendChild(this.control);

        // set
        this.setValue(this.control.value);

        // event
        this.control.addEventListener('input', (eve) => {
            this.emit('input', eve);
            this.setValue(this.control.value);
        }, false);
    }
    /**
     * スピンの最小値を設定する
     * @param {number} min - 設定する最小値
     */
    setMin(min){
        this.control.setAttribute('min', min);
    }
    /**
     * スピンの最大値を設定する
     * @param {number} max - 設定する最大値
     */
    setMax(max){
        this.control.setAttribute('max', max);
    }
    /**
     * スピンのステップ数を設定する
     * @param {number} step - 設定するステップ数
     */
    setStep(step){
        this.control.setAttribute('step', step);
    }
}

/**
 * GUIColor
 * @class GUIColor
 */
class GUIColor extends GUIElement {
    /**
     * @constructor
     * @param {string} [text=''] - エレメントに設定するテキスト
     * @param {string} [value='#000000'] - コントロールに設定する値
     */
    constructor(text = '', value = '#000000'){
        super(text);
        /**
         * コントロールを包むコンテナエレメント
         * @type {HTMLDivElement}
         */
        this.container = document.createElement('div');
        this.container.style.lineHeight = '0';
        this.container.style.margin = '2px auto';
        this.container.style.width = '100px';
        /**
         * 余白兼選択カラー表示エレメント
         * @type {HTMLDivElement}
         */
        this.label = document.createElement('div');
        this.label.style.margin = '0px';
        this.label.style.width = 'calc(100% - 2px)';
        this.label.style.height = '24px';
        this.label.style.border = '1px solid whitesmoke';
        this.label.style.boxShadow = '0px 0px 0px 1px #222';
        /**
         * コントロールエレメントの役割を担う canvas
         * @type {HTMLCanvasElement}
         */
        this.control = document.createElement('canvas');
        this.control.style.margin = '0px';
        this.control.style.display = 'none';
        this.control.width = 100;
        this.control.height = 100;

        // append
        this.element.appendChild(this.container);
        this.container.appendChild(this.label);
        this.container.appendChild(this.control);

        /**
         * コントロール用 canvas の 2d コンテキスト
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.control.getContext('2d');
        let grad = this.ctx.createLinearGradient(0, 0, this.control.width, 0);
        let arr = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'];
        for(let i = 0, j = arr.length; i < j; ++i){
            grad.addColorStop(i / (j - 1), arr[i]);
        }
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.control.width, this.control.height);
        grad = this.ctx.createLinearGradient(0, 0, 0, this.control.height);
        arr = ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 1.0)'];
        for(let i = 0, j = arr.length; i < j; ++i){
            grad.addColorStop(i / (j - 1), arr[i]);
        }
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.control.width, this.control.height);

        /**
         * 自身に設定されている色を表す文字列の値
         * @type {string}
         */
        this.colorValue = value;
        /**
         * クリック時にのみ colorValue を更新するための一時キャッシュ変数
         * @type {string}
         */
        this.tempColorValue = null;

        // set
        this.setValue(value);

        // event
        this.container.addEventListener('mouseover', () => {
            this.control.style.display = 'block';
            this.tempColorValue = this.colorValue;
        });
        this.container.addEventListener('mouseout', () => {
            this.control.style.display = 'none';
            if(this.tempColorValue != null){
                this.setValue(this.tempColorValue);
                this.tempColorValue = null;
            }
        });
        this.control.addEventListener('mousemove', (eve) => {
            let imageData = this.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
            let color = this.getColor8bitString(imageData.data);
            this.setValue(color);
        });

        this.control.addEventListener('click', (eve) => {
            let imageData = this.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
            eve.currentTarget.value = this.getColor8bitString(imageData.data);
            this.tempColorValue = null;
            this.control.style.display = 'none';
            this.emit('change', eve);
        }, false);
    }
    /**
     * 自身のプロパティに色を設定する
     * @param {string} value - CSS 色表現のうち 16 進数表記のもの
     */
    setValue(value){
        this.value.textContent = value;
        this.colorValue = value;
        this.container.style.backgroundColor = this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を返す
     * @return {string} 16 進数表記の色を表す文字列
     */
    getValue(){
        return this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を 0.0 から 1.0 の値に変換し配列で返す
     * @return {Array.<number>} 浮動小数で表現した色の値の配列
     */
    getFloatValue(){
        return this.getColorFloatArray(this.colorValue);
    }
    /**
     * canvas.imageData から取得する数値の配列を元に 16 進数表記文字列を生成して返す
     * @param {Array.<number>} color - 最低でも 3 つの要素を持つ数値の配列
     * @return {string} 16 進数表記の色の値の文字列
     */
    getColor8bitString(color){
        let r = this.zeroPadding(color[0].toString(16), 2);
        let g = this.zeroPadding(color[1].toString(16), 2);
        let b = this.zeroPadding(color[2].toString(16), 2);
        return '#' + r + g + b;
    }
    /**
     * 16 進数表記の色表現文字列を元に 0.0 から 1.0 の値に変換した配列を生成し返す
     * @param {string} color - 16 進数表記の色の値の文字列
     * @return {Array.<number>} RGB の 3 つの値を 0.0 から 1.0 に変換した値の配列
     */
    getColorFloatArray(color){
        if(color == null || Object.prototype.toString.call(color) !== '[object String]'){return null;}
        if(color.search(/^#+[\d|a-f|A-F]+$/) === -1){return null;}
        let s = color.replace('#', '');
        if(s.length !== 3 && s.length !== 6){return null;}
        let t = s.length / 3;
        return [
            parseInt(color.substr(1, t), 16) / 255,
            parseInt(color.substr(1 + t, t), 16) / 255,
            parseInt(color.substr(1 + t * 2, t), 16) / 255
        ];
    }
    /**
     * 数値を指定された桁数に整形した文字列を返す
     * @param {number} number - 整形したい数値
     * @param {number} count - 整形する桁数
     * @return {string} 16 進数表記の色の値の文字列
     */
    zeroPadding(number, count){
        let a = new Array(count).join('0');
        return (a + number).slice(-count);
    }
}

