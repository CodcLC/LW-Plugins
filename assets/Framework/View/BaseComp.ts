// 组件基类

import EventManager from "../EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseComp extends cc.Component {

    /** 自动注册事件列表 */
    private _autoEvents: Array<string> = [];

    protected _autoOnListen() {
        let keys = Object.keys(this['__proto__']);
        keys.forEach(k => {
            if (k.match(/.+_.+/) && typeof(this[k]) === 'function') {
                this._autoEvents.push(k);
                EventManager.on(k, this[k], this);
            }
        })
    }

    protected _autoOffListen() {
        this._autoEvents.forEach(k => {
            EventManager.off(k, this[k], this);
        })
        this._autoEvents = [];
    }
}
