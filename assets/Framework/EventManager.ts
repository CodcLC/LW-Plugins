
/**
 * 事件管理器
 */

class EventManager {
    private static _inst: EventManager = null;
    public static getInst(): EventManager {
        if (!EventManager._inst) {
            EventManager._inst = new EventManager();
        }
        return EventManager._inst;
    }

    private _evtMap = {}; // 所有事件
    private _dispatchingList = []; // 正在触发的事件
    private _waitList = []; // 等待注入的事件

    /** 注册事件 */
    public on(eventName: string, func: Function, target, isOnce?: boolean) {
        this._evtMap[eventName] = this._evtMap[eventName] || [];
        if (this._isDispatching(eventName)) {
            let evt = {name: eventName, cb: func, target: target, isOnce: isOnce};
            this._waitList.push(evt);
        }
        else if (!this._hasEventListner(eventName, func, target)){
            isOnce = isOnce || false;
            let evt: EvtStruct = {
                func: func,
                target: target,
                isOnce: isOnce
            }
            this._evtMap[eventName].push(evt);
        }
        else {
            cc.warn(`事件重复注册  --${eventName}`, func, target);
        }
    }

    /** 注册单次事件 */
    public once(eventName: string, func: Function, target) {
        this.on(eventName, func, target, true);
    }

    /** 注销事件 */
    public off(eventName: string): void;
    public off(eventName: string, func: Function, target):void;
    public off() {
        let evtName = arguments[0];
        let target = arguments[1] || null;
        let func = arguments[2] || null;

        if (evtName && target && func) {
            this._removeOne(evtName, func, target);
        }
        else if (evtName) {
            this._removeByEventName(evtName);
        }
    }

    /** 发送事件 */
    public emit(eventName: string, ...args) {
        if (this._isDispatching(eventName)) {
            cc.error(`事件 ${eventName} 触发期间，再次发送同名事件，应避免嵌套`);
            return;
        }
        if (!this._evtMap[eventName]) {
            return;
        }
        let list = this._evtMap[eventName];
        let index = 0;
        let len = list.length;
        this._dispatchingList.push(eventName);
        while (index < len) {
            let evt: EvtStruct = list[index];
            let target = evt.target;
            let func = evt.func;
            func.apply(target, args);
            if (evt.isOnce) {
                this._removeOne(eventName, func, target);
                len--;
            }
            else {
                index++;
            }
        }
        let i = this._dispatchingList.indexOf(eventName);
        this._dispatchingList.splice(i, 1);
        this._autoOnWait();
    }

    /** 是否正在触发中 */
    private _isDispatching(eventName) {
        return this._dispatchingList.indexOf(eventName) !== -1;
    }

    /** 是否已经注册改事件 */
    private _hasEventListner(eventName: string, func: Function, target) {
        if (!this._evtMap[eventName]) {
            return false;
        }
        let evtList = this._evtMap[eventName];
        for (let i = evtList.length - 1; i >= 0; i--) {
            let evt: EvtStruct = evtList[i];
            if (evt.func === func && evt.target === target) {
                return true;
            }
        }
        return false;
    }

    /** 移除一个事件 */
    private _removeOne(eventName: string, func: Function, target) {
        if (!this._evtMap[eventName]) {
            return;
        }
        let list = this._evtMap[eventName];
        for (let i = list.length - 1; i >= 0; i--) {
            let evt: EvtStruct = list[i];
            if (evt.func === func && evt.target === target) {
                list.splice(i, 1);
                return;
            }
        }
    }

    /** 移除所有的某一事件名 */
    private _removeByEventName(eventName) {
        if (this._evtMap[eventName]) {
            delete this._evtMap[eventName];
        }
    }

    /** 将等待列表的注册 */
    private _autoOnWait() {
        let len = this._waitList.length;
        while (len > 0) {
            let evt = this._waitList[0];
            this.on(evt.name, evt.cb, evt.target, evt.isOnce);
            this._waitList.splice(0, 1);
            len--;
        }
    }
}

export default EventManager.getInst();

class EvtStruct {
    func: Function
    target
    isOnce: boolean
}