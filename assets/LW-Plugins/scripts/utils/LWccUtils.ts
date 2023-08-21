let ccUtilsInstance;
interface DesignResolution {
    with: number,
    height: number
}
interface canvasC {
    designResolution: DesignResolution;
    /** !#en TODO
    !#zh: 是否优先将设计分辨率高度撑满视图高度。 */
    fitHeight: boolean;
    /** !#en TODO
    !#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
    fitWidth: boolean;
}
class LWccUtils {

    constructor() {
        if (ccUtilsInstance) {
            return ccUtilsInstance
        }
        ccUtilsInstance = this;
    }

    /**
     * 返回当前场景的canvas组件挂载节点
     */
    getRoot(): cc.Node {
        return cc.director.getScene().getChildByName('Canvas') || cc.find('Canvas');
    }
    /**
     * 返回当前场景的canvas组件的designResolution和fitHeight/fitWidth数据
     */
    getCanvasInfo(): canvasC {
        let rootArr: cc.Node = this.getRoot();
        if (!rootArr) {
            return {
                designResolution: {
                    with: 750,
                    height: 1334
                },
                fitWidth: true,
                fitHeight: true
            }
        }
        let canvas = rootArr.getComponent(cc.Canvas);
        return {
            designResolution: {
                with: canvas.designResolution.width,
                height: canvas.designResolution.height
            },
            fitHeight: canvas.fitHeight,
            fitWidth: canvas.fitWidth
        }
    }

    /**
     * 加载icon
     * @param url icon的url
     * @param success 成功回调
     * @param fail 失败回调
     */
    loadIcon(url: string, success?: (spriteFrame: cc.SpriteFrame) => void, fail?: (err) => void) {
        return new Promise((resolve, reject) => {
            let callback = function (err, texture) {
                // console.log(err, texture);
                if (!err && texture) {
                    // @ts-ignore
                    var spriteFrame = new cc.SpriteFrame(texture);
                    resolve(spriteFrame);
                    success && success(spriteFrame);
                } else {
                    reject(err);
                    fail && fail(err);
                }
            }
            if (cc.assetManager) {
                cc.assetManager.loadRemote(url, callback)
            } else {
                cc.loader.load(url, callback)
            }
        })
    }

    /**
     * 渲染icon到节点上
     * @param sprite 节点上的sprite组件
     * @param url icon的url
     */
    renderIcon(sprite: cc.Sprite, url: string) {
        return new Promise((resolve, reject) => {
            this.loadIcon(url)
                .then(spriteFrame => {
                    // @ts-ignore
                    sprite.spriteFrame = spriteFrame;
                    resolve(true)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /**
     * 加载广告模板
     * @param path 广告模板prefab的path
     * @param success 成功回调
     * @param fail 失败回调
     */
    loadPrefab(path: string, success?: (node: cc.Node) => void, fail?: (err) => void) {
        return new Promise((resolve, reject) => {
            let callback = function (err, prefab) {
                // console.log(err, prefab);
                if (!err && prefab) {
                    // @ts-ignore
                    var node = new cc.instantiate(prefab);
                    resolve(node);
                    success && success(node);
                } else {
                    reject(err);
                    fail && fail(err);
                }
            }
            if (cc.resources) {
                cc.resources.load(path, cc.Prefab, callback)
            } else {
                cc.loader.loadRes(path, cc.Prefab, callback)
            }
        })
    }

    /**
     * 返回适配的缩放倍率
     */
    getScale() {
        let canvasInfo: canvasC = this.getCanvasInfo();
        let winSize = cc.winSize;
        let width = 1280;
        // let width = canvasInfo.designResolution.with;
        return winSize.width / width;
        // if (!canvasInfo) {
            // return winSize.width / width
        // }
        // if (canvasInfo.fitWidth) {
        //     if (canvasInfo.fitHeight) {
        //         return winSize.width / width
        //     } else {
        //         return winSize.width / width
        //     }
        // } else if (canvasInfo.fitHeight) {
        //     return winSize.width / width
        // }
    }

    /**
     * 获取组件设计尺寸跟实际屏幕尺寸的高度偏差
     */
    getHeightOffset(): number {
        let scale = this.getScale();
        let resolution = cc.sys.windowPixelResolution;
        let canvas = this.getCanvasInfo();
        let designWidth = canvas.designResolution.with;
        let designHeight = canvas.designResolution.height;

        let rate = designWidth / resolution.width;
        let realHeight = resolution.height * rate;
        let offset = realHeight - designHeight;

        let offsetScaled = offset * scale;
        return offsetScaled
    }
}
// typeof window !== 'undefined' && Object.defineProperty(window, 'lwccUtils', {
//     value: new LWccUtils,
//     writable: false,
//     configurable: false,
//     enumerable: false
// });
export default new LWccUtils
