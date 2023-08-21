// 界面窗口基类

import BaseComp from "./BaseComp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseView extends BaseComp {
    /** 所属层级 */
    public LayerOrder: number = 0;
    protected _parent: cc.Node = null;
    private _isClosing: boolean = false;
    protected _position: cc.Vec3 = cc.v3(0, 0, 0);
    /** 是否开启自动绑定 */
    protected _autoBind: boolean = false;
    private _btnEvtList: cc.Node[] = [];

    /** 执行初始化 只执行一次 */
    public doInit(arg) {
        if (this._isClosing) {
            cc.warn(`界面 --${this.name} 已处于关闭阶段，初始化失败`);
            return;
        }
        this._isClosing = false;
        this._autoOnListen();
        this._initNode();
        this._autoBindChild();
        this.init.apply(this, arg);
        this._initUI();
        this._initEvent();
    }

    /** 执行关闭 */
    public doClose() {
        this._isClosing = true;
        this.onClose();
        this._clearBtnEvt();
        this._autoOffListen();
    }

    /** 针对隐藏的再次打开 */
    public doShow(arg) {
        this.init.apply(this, arg);
        this._initUI();
    }

    /** 节点位置等的初始化 */
    private _initNode() {
        if (this._parent) {
            this.node.parent = this._parent
        }
        else {
            this.node.parent = cc.director.getScene().getChildByName('Canvas') || cc.find('Canvas');
        }
        this.node.zIndex = this.LayerOrder;
        if (this._position) {
            this.node.position = this._position;
        }
        // this._fitSize();
    }
    
    /** 自动绑定节点 */
    private _autoBindChild() {
        if (this._autoBind) {
            this._deepBind(this.node);
        }
    }

    /** 递归绑定 */
    private _deepBind(node: cc.Node) {
        let children = node.children;
        let len = children.length;
        for (let i = 0; i < len; i++) {
            let child = children[i];
            let k = child.name.replace('$', '_');
            if (this[k] === null) {
                let t = lw._decorator.getMatedata(this['__classname__'], k)
                if (t) {
                    if (t === "cc.Node") {
                        this[k] = child
                    }
                    else {
                        this[k] = child.getComponent(t);
                    }
                    if (t === "cc.Button") {
                        this._bindBtnEvt(child);
                    }
                }

                if (!this[k]) {
                    console.warn(`>>> auto bind fail: ${this['__classname__']} --> ${k} 未找到节点 ${child.name} 或 未找到期望的组件 ${t}`);
                }
            }
            
            if (child.childrenCount > 0) {
                this._deepBind(child);
            }
        }
    }

    private _formatToUpper(str: string) {
        let arr = str.match(/[a-zA-Z]+/g)
		for (let i = 0; i < arr.length; i++) {
			let c = arr[i];
			arr[i] = c.charAt(0).toUpperCase() + c.slice(1)
		}
		return arr.join('');
    }

    /** 绑定按钮事件 */
    private _bindBtnEvt(btnNode: cc.Node) {
        let k = this._formatToUpper(btnNode.name);
        if (typeof this['__proto__'][`click${k}`] == 'function') {
            let func = this['__proto__'][`click${k}`];
            this._btnEvtList.push(btnNode);
            btnNode.on(cc.Node.EventType.TOUCH_START, func, this);
        }
    }

    private _unbindBtnEvt(btnNode: cc.Node) {
        let k = this._formatToUpper(btnNode.name);
        let func = this['__proto__'][`click${k}`];
        btnNode.off(cc.Node.EventType.TOUCH_START, func, this);
    }

    /** 清除按钮事件 */
    private _clearBtnEvt() {
        this._btnEvtList.forEach(node => {
            this._unbindBtnEvt(node);
        })
        this._btnEvtList = [];
    }

    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        // 子类继承
    }

    /** 界面被关闭 */
    protected onClose() {
        // 子类继承
    }

    /** 一些UI初始化 */
    protected _initUI() {
        // 子类继承
    }

    /** 初始化事件 */
    protected _initEvent() {
        // 子类继承
    }

    // // 被其他界面覆盖
    // public onToBack() {
    //     // 子类继承
    // }

    // // 关闭其他界面时，再次被显示出来，初次open显示时不会调用
    // public onToFront(...args) {
    //     // 子类继承
    // }

    /** 初始化红点 */
    // protected _initRed() {

    // }

    // /** 界面适配 */
    // private _fitSize() {
        
    // }
}
