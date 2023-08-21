

import BaseView from './BaseView';
import ViewConf, { VConf} from './ViewConfig'

/** 
 * 界面管理器 
 * @method open 异步打开界面
 * @method openAsync 同步打开界面
 * @method close 关闭界面
 * @example 导出已为单例 直接使用方法 
 * ViewManager.open('TestView', args, cb) 
 * ViewManger.openAsync('TestView', args)
 * ViewManager.close('TestView', true?)
 */
class ViewManager {
    private static _inst: ViewManager = null;
    public static getIns():ViewManager {
        if (!ViewManager._inst) {
            ViewManager._inst = new ViewManager();
        }
        return ViewManager._inst;
    }

    /** 存储已经打开的界面 */
    private _viewStack = {};
    private _allView = {};

    /** 
     * 异步打开界面
     * @param viewName ViewConfig中配置的界面名
     * @param args 在View脚本的init中传入
     * @param cb 打开后的回调
     */
    public open(viewName: string, cb: <T extends BaseView>(view: T) => void, ...args) {
        if (typeof cb !== 'function') {
            args.splice(0, 0, cb);
            cb = function() {}
        }
        let conf = <VConf>ViewConf[viewName]
        if (conf) {
            let viewInfo: ViewStruct<BaseView> = this._allView[viewName];
            if (!viewInfo) {
                viewInfo = {
                    name: viewName,
                    view: null,
                    preventNode: null
                }
            }
            else if (viewInfo.view) {
                // 已经打开过的界面 不再次做初始化 直接移动到栈顶显示
                this._openedView(viewName);
                viewInfo.view.doShow(args);
                cb && cb(viewInfo.view);
                return;
            }
            else {
                // 界面正在打开
                return;
            }
            this._allView[viewName] = viewInfo;
            /** 创建触摸阻挡节点 */
            if (conf.preventTouch && !viewInfo.preventNode) {
                viewInfo.preventNode = this._createPreventNode();
            }
            lw.resLoader.load(conf.BundlePath, conf.PrefabPath, cc.Prefab, (err, prefab: cc.Prefab) => {
                if (err) {
                    cc.error(err);
                    cb && cb(null);
                }
                else {
                    this._doCreate(viewName, prefab, args);
                    cb && cb(viewInfo.view);
                }
            })
        }
    }

    /** 
     * 同步打开界面 
     * @param viewName 打开的界面
     * @param args 其他参数
     */
    public async openSync<T extends BaseView>(viewName: string, ...args) {
        let conf = <VConf>ViewConf[viewName]
        if (conf) {
            let viewInfo: ViewStruct<T> = this._allView[viewName];
            if (!viewInfo) {
                viewInfo = {
                    name: viewName,
                    view: null,
                    preventNode: null
                }
            }
            else if (viewInfo.view) {
                // 已经打开过的界面
                this._openedView(viewName);
                viewInfo.view.doShow(args);
                return null;
            }
            else {
                // 界面正在打开
                return null;
            }
            this._allView[viewName] = viewInfo;
            /** 创建触摸阻挡节点 */
            if (conf.preventTouch && !viewInfo.preventNode) {
                viewInfo.preventNode = this._createPreventNode();
            }
            let prefab = <cc.Prefab>await lw.resLoader.loadSync(conf.BundlePath, conf.PrefabPath, cc.Prefab);
            if (prefab) {
                this._doCreate(viewName, prefab, args);
                return viewInfo.view
            }
        }
    }

    /** 处理已经打开过的界面再次打开 */
    private _openedView(viewName: string) {
        let viewInfo: ViewStruct<BaseView> = this._allView[viewName];
        let comp = viewInfo.view;
        let layerOrder = comp.LayerOrder;
        let stack = this._viewStack[layerOrder] || [];
        let index = stack.indexOf(viewInfo);
        // if (index !== stack.length - 1) {
            stack.splice(index, 1);
            stack.push(viewInfo);
            this._showTopStack(layerOrder);
        // }
    }

    /** 创建view实例 */
    private _doCreate(viewName: string, prefab: cc.Prefab, args) {
        let viewInfo: ViewStruct<BaseView> = this._allView[viewName];
        let node = cc.instantiate(prefab);
        let comp: BaseView = node.getComponent(prefab.name);
        if (!comp) { // 没有挂载脚本的添加
            comp = node.addComponent(prefab.name);
        }
        if (comp) {
            comp.doInit(args);
            viewInfo.view = comp;
            if (viewInfo.preventNode) {
                viewInfo.preventNode.removeFromParent();
                viewInfo.preventNode = null;
            }

            let zOrder = comp.LayerOrder.toString();
            if (!this._viewStack[zOrder]) {
                this._viewStack[zOrder] = [];
            }
            let stack = this._viewStack[zOrder];
            stack.push(viewInfo);
            this._showTopStack(zOrder);
        }
    }

    /** 检测view栈，只显示栈顶view */
    private _autoCheckStack() {
        for (let k in this._viewStack) {
            this._showTopStack(k)
        }
    }

    /** 显示栈顶界面 */
    private _showTopStack(zOrder) {
        let stack = this._viewStack[zOrder];
        if (!stack || stack.length == 0) return;
        let top = stack.length - 1;
        for (let i = 0; i < top; i++) {
            let viewInfo: ViewStruct<BaseView> = stack[i];
            if (viewInfo.view) {
                let node = viewInfo.view.node;
                if (node && node.active == true) {
                    node.active = false;
                    // viewInfo.view.onToback();
                }
            }
        }
        let popView: ViewStruct<BaseView> = stack[top];
        popView.view.node.active = true;
    }

    /** 创建触摸阻挡节点 */
    private _createPreventNode() {
        let node = new cc.Node();
        node.parent = cc.director.getScene().getChildByName('Canvas') || cc.find('Canvas');
        node.addComponent(cc.BlockInputEvents);
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        node.position = cc.v3(0, 0, 0);
        return node;
    }

    /** 
     * 关闭界面
     * @param viewName 界面名
     * @param releaseAll 释放整个bundle相关资源，如果其他地方有使用，会导致显示丢失
     */
    public close(viewName: string, releaseAll?: boolean) {
        let viewInfo: ViewStruct<BaseView> = this._allView[viewName];
        if (viewInfo && viewInfo.view) {
            // 关闭界面
            let comp = viewInfo.view;
            comp.doClose();
            let node = comp.node;
            node.removeFromParent();
            this._allView[viewName] = null;
            let zOrder = comp.LayerOrder;
            let stack = this._viewStack[zOrder] || [];
            if (stack) {
                for (let i = stack.length - 1; i >= 0; i--) {
                    if (viewInfo == stack[i]) {
                        stack.splice(i, 1);
                        break;
                    }
                }
            }
            this._showTopStack(zOrder);
            if (releaseAll) {
                let conf: VConf = ViewConf[viewName];
                let bundle = cc.assetManager.getBundle(conf.BundlePath);
                bundle.releaseAll();
                cc.assetManager.removeBundle(bundle);
            }
        }
        else {
            cc.warn(`尝试关闭的界面 -- ${viewName}  不存在`);
        }
    }

    /**
     * 隐藏界面  （只做隐藏操作）
     * @param viewName 界面名
     */
    public hide(viewName: string) {
        let viewInfo: ViewStruct<BaseView> = this._allView[viewName];
        if (viewInfo && viewInfo.view) {
            let comp = viewInfo.view;
            let node = comp.node;
            node.active = false;
        }
    }

    /**
     * 获取界面
     * @param viewName 界面名
     * @returns 
     */
    public getView(viewName) {
        let viewInfo: ViewStruct<BaseView> = this._allView[viewName];
        if (viewInfo && viewInfo.view) {
            return viewInfo.view
        }
        return null;
    }
}

/** 界面信息结构体 */

class ViewStruct<T extends BaseView> {
    name: string;
    view: T ;
    preventNode: cc.Node;
}

export default ViewManager.getIns();