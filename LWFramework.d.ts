

/** 
 * 乐玩框架 
 * 最后维护时间：2021-4-10 15:54:37
 */
declare namespace lw {
    
    /** 界面管理器 */
    export class ViewManager {
        /** 
         * 异步打开界面
         * @param viewName ViewConfig中配置的界面名
         * @param args 在View脚本的init中传入
         * @param cb 打开后的回调
         */
        public open(viewName: string, cb: <T extends BaseView>(view: T) => void, ...args?): void;
        public open(viewName: string, ...args?)

        /** 
         * 同步打开界面 
         * @param viewName 打开的界面
         * @param args 其他参数
         */
        public openSync<T extends BaseView>(viewName: string, ...args): T;

        /** 
         * 关闭界面
         * @param viewName 界面名
         * @param releaseAll 释放整个bundle相关资源，如果其他地方有使用，会导致显示丢失
         */
        public close(viewName: string, releaseAll?: boolean): void;

        /**
         * 隐藏界面  （只做隐藏操作 active = false）
         * @param viewName 界面名
         */
        public hide(viewName: string): void;
    }

    /** 界面管理单例 */
    export let viewMgr: ViewManager;

    /** 组件基类 */
    export class BaseComp extends cc.Component {}

    /** 界面基类 */
    export class BaseView extends BaseComp{
        /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
        protected init(...arg): void;
        /** 界面被关闭 */
        protected onClose(): void;
        /** 一些UI初始化 */
        protected _initUI(): void;
        /** 初始化事件 */
        protected _initEvent(): void;
        /** 所在界面层级 */
        public LayerOrder: number;
        /** 初始位置  默认 cc.Vec3.ZERO */
        protected _position: cc.Vec3;
    }

    /** 事件管理 */
    export class EventManager {
        /** 注册事件 */
        public on(eventName: string, func: Function, target, isOnce?: boolean): void;
        /** 注册单次事件 */
        public once(eventName: string, func: Function, target): void;
        /** 销毁事件 */
        public off(eventName: string): void;
        public off(eventName: string, func: Function, target):void;

        /** 发送事件 */
        public emit(eventName: string, ...args)
    }

    /** 事件管理单例 */
    export let evtMgr: EventManager;

    export class ResLoader {
        /** 加载资源 */
        public load<T extends cc.Asset>(bundleName:string, paths: string, type: typeof cc.Asset, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: T) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string[], type: typeof cc.Asset, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: T) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string[], onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string, type: typeof cc.Asset, onComplete?: (error: Error, assets: T) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string[], type: typeof cc.Asset, onComplete?: (error: Error, assets: Array<T>) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string, onComplete?: (error: Error, assets: T) => void): void;
        public load<T extends cc.Asset>(bundleName:string, paths: string[], onComplete?: (error: Error, assets: Array<T>) => void): void;

        /** 
         * 加载Bundle
         * @param bundleName bundle路径
         * @param cb 回调
         */
        public loadBundle(bundleName: string, cb: (bundle: cc.AssetManager.Bundle) => void)

        /**
         * 同步加载资源
         * @param bundleName bundle路径
         * @param path bundle内部资源路径
         * @param type 资源类型
         * @returns 
         */
        public loadSync(bundleName = 'resources', path, type?: typeof cc.Asset)

        /**
         * 同步加载bundle
         * @param bundleName bundle路径
         * @returns 
         */
        public loadBundleSync(bundleName: string)

        /**
         * 移除Bundle
         * @param bundle bundle路径或者实例
         * @param removeAssets 是否释放bundle内的资源
         */
        public async removeBundle(bundle: string | cc.AssetManager.Bundle, removeAssets = false)

        /** 加载文件夹 */
        public loadDirSync(bundleName: string, path: string, type?: typeof cc.Asset)
    }

    export let resLoader: ResLoader
}

declare namespace lw._decorator {
    /** 装饰器-添加元信息 */
    export function metadata(descrip: string);

    /** 
     * 获取标记属性 
     * @param {string} className 类名
     * @param {string} attrKey 属性名
     */
    export function getMatedata(className: string, attrKey: string);
}