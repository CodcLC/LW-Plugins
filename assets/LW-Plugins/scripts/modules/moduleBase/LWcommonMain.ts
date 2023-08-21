import ccUtils from "../../utils/LWccUtils";

let commonMainInstance;
export default class LWcommonMain {
    constructor() {
        if (commonMainInstance) {
            return commonMainInstance
        }
        commonMainInstance = this;
    }

    static setProperty(initParam: initParam, target) {
        let scale = ccUtils.getScale();
        //target.node.setScale(scale);
        switch (initParam.flowType) {
            case 1:// 抖动单icon
                initParam.showCount = 1; // 指定1个icon
                break;
            case 2:// 侧边抽屉
                typeof initParam.autoScroll === 'boolean' && (target._autoScrollY = initParam.autoScroll);
                break;
            case 3:// 单行滚动栏
                typeof initParam.autoScroll === 'boolean' && (target._autoScrollX = initParam.autoScroll);
                break;
            case 8:// 热门盒子
            case 4:// 爆款游戏弹窗
                typeof initParam.autoScroll === 'boolean' && (target._autoScrollY = initParam.autoScroll);
                break;
            case 9: // 全屏盒子
            case 5:// 热门推荐页
                if (typeof initParam.autoScroll === 'boolean') {
                    target._autoScrollX = initParam.autoScroll;
                    target._autoScrollY = initParam.autoScroll;
                }
                break;
            case 6:// 两列推广页
                typeof initParam.autoScroll === 'boolean' && (target._autoScrollY = initParam.autoScroll);
                break;
            case 7:// 四宫格结算页
                initParam.showCount = 4; // 指定4个icon
                target._autoScrollY = false;
                target._autoScrollX = false;
                break;

            default:
                break;
        }
        if (initParam.x) {
            target.node.x = initParam.x //* scale;
        }
        if (initParam.y) {
            target.node.y = initParam.y //* scale;
        }
        // if (initParam.zIndex) {
        //     target.node.zIndex = initParam.zIndex;
        // }
        // let isWin = initParam.resultWinOrFail === 1;
        // target.winTitle && (target.winTitle.active = isWin);
        // target.failTitle && (target.failTitle.active = !isWin);

        //let sf = isWin ? target.nextSpriteFrame : target.continueSpriteFrame;
        //console.log(isWin,)
        //target.continueButton && (target.continueButton.getComponent(cc.Sprite).spriteFrame = sf)
        // if (initParam.resultWinOrFail === 1) {
        //     target.winTitle && (target.winTitle.active = true);
        //     target.failTitle && (target.failTitle.active = false);
        //     target.continueButton && (target.continueButton.getComponent(cc.Sprite).spriteFrame = target.nextSpriteFrame)
        // }
        // else if (initParam.resultWinOrFail === 0) {
        //     target.winTitle && (target.winTitle.active = false);
        //     target.failTitle && (target.failTitle.active = true);
        //     target.continueButton && (target.continueButton.getComponent(cc.Sprite).spriteFrame = target.continueSpriteFrame)
        // }
    }

    static addListener(target) {
        // target.scrollView.node.on('touch-up', target.touchUp, target);
        // target.scrollView.node.on(cc.Node.EventType.TOUCH_END, ()=>console.log(11111), target);
        // target.scrollView.node.on(cc.Node.EventType.TOUCH_START, target.touchStart, target);
        let scrollNode = target.scrollView.node;
        if (target._autoScrollX) {
            scrollNode && scrollNode.on('scroll-to-right', target.scrollToRight, target);
            scrollNode && scrollNode.on('scroll-to-left', target.scrollToLeft, target);
        }
        if (target._autoScrollY) {
            scrollNode && scrollNode.on('scroll-to-bottom', target.scrollToBottom, target);
            scrollNode && scrollNode.on('scroll-to-top', target.scrollToTop, target);
        }

        // target.scrollView.node.on('scrolling', target.onScrolling, target);
    }

    static removeListener(target) {
        // target.scrollView.node.off('touch-up', target.touchUp, target);
        // target.scrollView.node.off(cc.Node.EventType.TOUCH_END, ()=>console.log(11111), target);
        // target.scrollView.node.off(cc.Node.EventType.TOUCH_START, target.touchStart, target);
        let scrollNode = target.scrollView.node;
        if (target._autoScrollX) {
            scrollNode && scrollNode.off('scroll-to-right', target.scrollToRight, target);
            scrollNode && scrollNode.off('scroll-to-left', target.scrollToLeft, target);
        }
        if (target._autoScrollY) {
            scrollNode && scrollNode.off('scroll-to-bottom', target.scrollToBottom, target);
            scrollNode && scrollNode.off('scroll-to-top', target.scrollToTop, target);
        }
        // target.scrollView.node.off('scrolling', target.onScrolling, target);
    }

    static getItemNode(target) {
        let node = cc.instantiate(target.item);
        return node
    }

    static clickRandomGame(target, success, fail) {
        if (!target.adData) {
            console.log('没有广告游戏数据。')
            return
        }
        let index = Math.floor(Math.random() * target.adData.data.length);
        let gameItem = target.adData.data[index];
        lwsdk.onAdTouch({
            adItem: gameItem,
            navigateToFail: fail,
            navigateToSuccess: success
        })
    }
}