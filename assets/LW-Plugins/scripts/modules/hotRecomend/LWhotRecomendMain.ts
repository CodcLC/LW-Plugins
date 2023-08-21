
const { ccclass, property } = cc._decorator;
import commonMain from '../moduleBase/LWcommonMain'
import ccUtils from '../../utils/LWccUtils';
import effcts from '../../effects/LWEffects'
import LWBaseMain from '../moduleBase/LWBaseMain';
@ccclass
export default class LWhotRecomendMain extends LWBaseMain {
    @property({ serializable: false, override: true })
    _autoScrollX: boolean = false;
    @property({ serializable: false, override: true })
    _autoScrollY: boolean = true;

    @property({ serializable: false, override: true })
    _splitLines: number = 1;
    @property({ serializable: false })
    _splitLines2: number = 3;


    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    container2: cc.Node = null;

    @property(cc.Prefab)
    item2: cc.Prefab = null;

    @property(cc.Node)
    handFocus: cc.Node = null;

    @property(cc.Node)
    hotTitle: cc.Node = null;

    reset() {
        this._index = 0;
    }

    /**
     * 初始化
     * @param positionId 位置id/位置key
     */
    init(data: initParam) {
        this.screenAdapted();
        super.init(data);
        this.getAdDataToShow2(data.positionId);
        this.addListener(this);
    }

    addListener(target) {
        // target.scrollView.node.on('touch-up', target.touchUp, target);
        // target.scrollView.node.on(cc.Node.EventType.TOUCH_END, ()=>console.log(11111), target);
        // target.scrollView.node.on(cc.Node.EventType.TOUCH_START, target.touchStart, target);
        if (target._autoScrollX && target._autoScrollY) {
            let scrollViewNode = target.scrollView.node;
            if (scrollViewNode) {
                scrollViewNode.on('scroll-to-right', target.scrollToRight, target);
                scrollViewNode.on('scroll-to-left', target.scrollToLeft, target);
            }
            let scrollViewNode2 = target.scrollView2.node;
            if (scrollViewNode2) {
                scrollViewNode2.on('scroll-to-bottom', target.scrollToBottom, target);
                scrollViewNode2.on('scroll-to-top', target.scrollToTop, target);
            }
        } else if (target._autoScrollX) {
            let scrollViewNode = target.scrollView.node;
            if (scrollViewNode) {
                scrollViewNode.on('scroll-to-right', target.scrollToRight, target);
                scrollViewNode.on('scroll-to-left', target.scrollToLeft, target);
            }
        } else if (target._autoScrollY) {
            let scrollViewNode = target.scrollView.node;
            if (scrollViewNode) {
                scrollViewNode.on('scroll-to-bottom', target.scrollToBottom, target);
                scrollViewNode.on('scroll-to-top', target.scrollToTop, target);
            }
        }

        // target.scrollView.node.on('scrolling', target.onScrolling, target);
    }

    removeListener(target) {
        // target.scrollView.node.off('touch-up', target.touchUp, target);
        // target.scrollView.node.off(cc.Node.EventType.TOUCH_END, ()=>console.log(11111), target);
        // target.scrollView.node.off(cc.Node.EventType.TOUCH_START, target.touchStart, target);
        if (target._autoScrollX && target._autoScrollY) {
            let scrollViewNode = target.scrollView.node;
            if (scrollViewNode) {
                scrollViewNode.off('scroll-to-right', target.scrollToRight, target);
                scrollViewNode.off('scroll-to-left', target.scrollToLeft, target);
            }
            let scrollViewNode2 = target.scrollView2.node;
            if (scrollViewNode2) {
                scrollViewNode2.off('scroll-to-bottom', target.scrollToBottom, target);
                scrollViewNode2.off('scroll-to-top', target.scrollToTop, target);
            }
        } else if (target._autoScrollX) {
            let scrollViewNode = target.scrollView.node;
            if (scrollViewNode) {
                scrollViewNode.off('scroll-to-right', target.scrollToRight, target);
                scrollViewNode.off('scroll-to-left', target.scrollToLeft, target);
            }
        } else if (target._autoScrollY) {
            let scrollViewNode = target.scrollView.node;
            if (scrollViewNode) {
                scrollViewNode.off('scroll-to-bottom', target.scrollToBottom, target);
                scrollViewNode.off('scroll-to-top', target.scrollToTop, target);
            }
        }
        // target.scrollView.node.off('scrolling', target.onScrolling, target);
    }

    onLoad() {
        let scrollView = this.scrollView.node.getChildByName('view');
        this.spacingX = scrollView.children[0].getComponent(cc.Layout).spacingX;
        this.contenty = scrollView.width / 2;
        let scrollView2 = this.scrollView2.node.getChildByName('view')
        let scrollView2Child = scrollView2.children[0]
        this.contenty2 = scrollView2.height / 2;
        scrollView2Child.y = this.contenty2;
        let layout = scrollView2Child.getComponent(cc.Layout)
        this.spacingY = layout.spacingY;
        this._containerTop = layout.paddingTop;


        // if (this._initParam.slideIn) {
        //     effcts.runEffect(this.node.getChildByName('box'), true);
        // }
        super.onLoad();
        this.playHandFocus();
    }

    screenAdapted() {
        return;
        let offset = ccUtils.getHeightOffset();
        this.scrollView.node.y += (offset / 2);
        this.hotTitle.y += (offset / 2);

        this.scrollView2.node.height = this.scrollView.node.height + offset;
        let scrollView2View = this.scrollView2.node.getChildByName('view')
        scrollView2View.height = scrollView2View.height + offset;

        if (this.continueButton) {
            this.continueButton.y -= (offset / 2);
        }
        if (this.closeButton) {
            this.closeButton.y += (offset / 2);
        }
    }

    autoRefresh() {
        super.autoRefresh();
        this.getAdDataToShow2(this._initParam.positionId);
    }

    getAdDataToShow2(positionId: string) {
        this.adData2 = lwsdk.getAdDataToShow({ positionKey: positionId, showCount: this._initParam.showCount, index: this._index });
        if (!this.adData2) {
            return
        }
        // let temp = this.adData2.data.slice(0);
        // Array.prototype.push.apply(this.adData2.data, temp);
        this._index = this.adData2.index;
        for (let i in this.adData2.data) {
            let node = cc.instantiate(this.item2);
            node.getComponent('LWitem').init({ itemData: this.adData2.data[i], flowId: this._flowId, touchStart: this.touchStart.bind(this), touchUp: this.touchUp, iconShake: this._initParam.iconShake });
            this.container2.addChild(node);
        }
    }

    onDestroy() {
        this.removeListener(this);
        super.onDestroy();
    }

    onScrolling(e) {
        let data = this.adData.data;
        let scrollViewChild = this.scrollView.node.getChildByName('view').children[0]
        let scrollView2Child = this.scrollView2.node.getChildByName('view').children[0]
        if (this._autoScrollX) {
            var width = scrollViewChild.children[0].width;
            var maxwidth = (Math.ceil(data.length) * width + (Math.ceil(data.length) - 1) * this.spacingX) - this.contenty;
            console.log(scrollViewChild.x, scrollViewChild.width, width, maxwidth);
        }
        if (this._autoScrollY) {
            var height = scrollView2Child.children[0].height;
            var maxHeight = (Math.ceil(data.length / 3) * height + (Math.ceil(data.length / 3) - 1) * this.spacingY) - this.contenty + this._containerTop;
            console.log(scrollView2Child.y, scrollView2Child.height, height, maxHeight);
        }
    }

    clickRandomGame(success, fail) {
        commonMain.clickRandomGame(this, success, fail)
    }

    update(dt) {

        if (this._autoScrollX) {
            effcts.autoScrollX(dt, this);
        }
        if (this._autoScrollY) {
            console
            this.autoScrollX(dt);
        }
    }





    autoScrollY(dt) {
        if (!this.adData2) {
            return
        }
        this._moveOffset = 65;
        let scrollView = this.scrollView2.node.getChildByName('view');
        let scrollViewChild = scrollView.children[0];
        let data = this.adData2.data

        var height = scrollViewChild.children[0].height;
        var maxHeight = (Math.ceil(data.length / this._splitLines2) * height + (Math.ceil(data.length / this._splitLines2) - 1) * this.spacingY) + this._containerTop;
        let viewHeight = scrollView.height;
        if (maxHeight < viewHeight + this._moveOffset) {
            this._autoScrollY = false;
            return
        }
        if (!this._scrollReverseY) {
            scrollViewChild.y += dt * this._moveOffset;
            let absY = Math.abs(scrollViewChild.y);

            if (absY > (maxHeight - this.contenty2)) {
                this._scrollReverseY = true
            }
        }

        if (this._scrollReverseY) {
            scrollViewChild.y -= dt * this._moveOffset;
            let absY = Math.abs(scrollViewChild.y);
            if (absY < this.contenty2/*  - this._moveOffset / 3 */) {
                this._scrollReverseY = false
            }
        }
    }

    autoScrollX(dt) {

        if (!this.adData2) {
            return
        }
        let target = this;

        target._moveOffset = 65;
        let scrollViewNode = target.scrollView2.node.getChildByName('view');
        let scrollViewNodeChild = scrollViewNode.children[0];
        var width = scrollViewNodeChild.children[0].width;
        var maxWidth = (Math.ceil(target.adData2.data.length / target._splitLines) * width + (Math.ceil(target.adData2.data.length / target._splitLines) - 1) * target.spacingX)/*  + target._moveOffset / 3 */;
        let viewWidth = scrollViewNode.width;
        if (maxWidth < viewWidth + target._moveOffset) {
            target._autoScrollX = false;
            return
        }

        let contenty = target.scrollView2.node.getChildByName('view').width / 2;
        if (target._scrollReverseX2) {
            scrollViewNodeChild.x += dt * target._moveOffset;

            let absX = Math.abs(scrollViewNodeChild.x);
            if (absX < contenty) {
                target._scrollReverseX2 = false
            }
        }

        if (!target._scrollReverseX2) {
            scrollViewNodeChild.x -= dt * target._moveOffset;
            let absX = Math.abs(scrollViewNodeChild.x);
            if (absX > (maxWidth - contenty)) {
                target._scrollReverseX2 = true
            }
        }
    }


    playHandFocus() {
        let t1 = 0.35, t2 = 0.13, t3 = 0.2, t4 = 0;
        this.handFocus.getChildByName('circle').runAction(cc.sequence(
            cc.scaleTo(t4, 2),
            cc.scaleTo(t1, 1),
            cc.scaleTo(t1, 2),
            cc.scaleTo(t4, 2),
            cc.scaleTo(t1, 1),
            cc.scaleTo(t1, 2)).repeatForever());
        this.handFocus.getChildByName('hand').runAction(cc.sequence(
            cc.rotateTo(t4, 30),
            cc.rotateTo(t1, 0),
            cc.rotateTo(t1, 30),
            cc.rotateTo(t4, 30),
            cc.rotateTo(t1, 0),
            cc.rotateTo(t1, 30)).repeatForever());
    }
}
