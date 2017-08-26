
/**
 * gl3Gui
 * @class gl3Gui
 */
export default class gl3Gui {
    constructor(){
        this.Wrapper  = GUIWrapper;
        this.Element  = GUIElement;
        this.Slider   = GUISlider;
        this.Checkbox = GUICheckbox;
        this.Select   = GUISelect;
        this.Spin     = GUISpin;
        this.Color    = GUIColor;
    }
}

class GUIWrapper {
    constructor(){
        this.element = document.createElement('div');
        this.element.style.backgroundColor = 'rgba(64, 64, 64, 0.5)';
        this.element.style.position = 'absolute';
        this.element.style.top = '0px';
        this.element.style.right = '0px';
        this.element.style.height = '100%';
    }
    getElement(){
        return this.element;
    }
}

class GUIElement {
    constructor(text = ''){
        this.element = document.createElement('div');
        this.element.style.fontSize = 'small';
        this.element.style.textAlign = 'center';
        this.element.style.width = '270px';
        this.element.style.height = '30px';
        this.element.style.lineHeight = '30px';
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'row';
        this.element.style.justifyContent = 'flex-start';
        this.text = text;
        this.label = document.createElement('span');
        this.label.textContent = this.text;
        this.label.style.color = '#222';
        this.label.style.textShadow = '0px 0px 5px white';
        this.label.style.display = 'inline-block';
        this.label.style.margin = 'auto 5px';
        this.label.style.width = '50px';
        this.label.style.overflow = 'hidden';
        this.element.appendChild(this.label);
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
        this.control = null;
        this.listeners = {};
    }
    add(type, func){
        if(this.control == null || type == null || func == null){return;}
        if(Object.prototype.toString.call(type) !== '[object String]'){return}
        if(Object.prototype.toString.call(func) !== '[object Function]'){return}
        this.listeners[type] = func;
    }
    emit(type, eve){
        if(this.control == null || !this.listeners.hasOwnProperty(type)){return;}
        this.listeners[type](eve, this);
    }
    remove(){
        if(this.control == null || !this.listeners.hasOwnProperty(type)){return;}
        this.listeners[type] = null;
        delete this.listeners[type];
    }
    setValue(value){
        this.value.textContent = value;
        this.control.value = value;
    }
    getValue(){
        return this.control.value;
    }
    getControl(){
        return this.control;
    }
    getText(){
        return this.text;
    }
    getElement(){
        return this.element;
    }
}

class GUISlider extends GUIElement {
    constructor(text = '', value = 0, min = 0, max = 100, step = 1){
        super(text);
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
    setMin(min){
        this.control.setAttribute('min', min);
    }
    setMax(max){
        this.control.setAttribute('max', max);
    }
    setStep(step){
        this.control.setAttribute('step', step);
    }
}

class GUICheckbox extends GUIElement {
    constructor(text = '', checked = false){
        super(text);
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
    setValue(checked){
        this.value.textContent = checked;
        this.control.checked = checked;
    }
    getValue(){
        return this.control.checked;
    }
}

class GUISelect extends GUIElement {
    constructor(text = '', list = [], selectedIndex = 0){
        super(text);
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
    setSelectedIndex(index){
        this.control.selectedIndex = index;
    }
    getSelectedIndex(){
        return this.control.selectedIndex;
    }
}

class GUISpin extends GUIElement {
    constructor(text = '', value = 0.0, min = -1.0, max = 1.0, step = 0.1){
        super(text);
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
    setMin(min){
        this.control.setAttribute('min', min);
    }
    setMax(max){
        this.control.setAttribute('max', max);
    }
    setStep(step){
        this.control.setAttribute('step', step);
    }
}

class GUIColor extends GUIElement {
    constructor(text = '', value = 0.0){
        // super(text);
        // this.control = document.createElement('canvas');
        // this.control.setAttribute('type', 'number');
        // this.control.setAttribute('min', min);
        // this.control.setAttribute('max', max);
        // this.control.setAttribute('step', step);
        // this.control.value = value;
        // this.control.style.margin = 'auto';
        // this.control.style.verticalAlign = 'middle';
        // this.element.appendChild(this.control);
        //
        // // set
        // this.setValue(this.control.value);
        //
        // // event
        // this.control.addEventListener('click', (eve) => {
        //     this.emit('input', eve);
        //     this.setValue(this.control.value);
        // }, false);
    }
}

