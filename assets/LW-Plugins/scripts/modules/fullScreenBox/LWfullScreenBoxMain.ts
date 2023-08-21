/**
 * 全屏盒子
 */

import LWBaseMain from "../moduleBase/LWBaseMain";
import commonMain from '../moduleBase/LWcommonMain'
import ccUtils from '../../utils/LWccUtils';
import effcts from '../../effects/LWEffects'

const {ccclass, property} = cc._decorator;

@ccclass
export default class LWfullScreenBoxMain extends LWBaseMain {

    @property({ serializable: false , override: true})
    _autoScrollX: boolean = true;
    @property({ serializable: false , override: true})
    _autoScrollY: boolean = true;

    @property({ serializable: false , override: true})
    _splitLines: number = 1;
    @property({ serializable: false })
    _splitLines2: number = 3;


    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;
    @property(cc.Node)
    container2: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    item2: cc.Prefab = null;
    @property(cc.Prefab)
    item3: cc.Prefab = null;
    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Node)
    handFocus: cc.Node = null;

    private adData3= null;

    onLoad() {
        let scrollView = this.scrollView.node.getChildByName('view')
        this.spacingX = scrollView.children[0].getComponent(cc.Layout).spacingX;
        this.contenty = scrollView.width / 2;
        let scrollView2 = this.scrollView2.node.getChildByName('view')
        let scrollView2Child = scrollView2.children[0]
        this.contenty2 = scrollView2.height / 2;
        scrollView2Child.y = this.contenty2;
        let layout = scrollView2Child.getComponent(cc.Layout)
        this.spacingY = layout.spacingY;
        this._containerTop = layout.paddingTop;

        super.onLoad();
        this.playHandFocus();
    }

    init(data: initParam) {
        this.screenAdapted();
        super.init(data);
        this.getAdDataToShow2(data.positionId);
        this.getAdDataToShow3(data.positionId);
        this.addListener(this);
    }

    addListener(target) {
        if(target._autoScrollX && target._autoScrollY) {
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
    }

    removeListener(target) {
        if(target._autoScrollX && target._autoScrollY) {
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
    }

    screenAdapted() {
        let offset = ccUtils.getHeightOffset();
        this.scrollView.node.y += (offset / 2);
        // this.hotTitle.y += (offset / 2);
        let panel3 = this.content2.parent;
        panel3.y += (offset / 2);

        let panel3Bottom = panel3.y + this.content2.y - this.content2.height;
        let bottom = panel3Bottom - (-cc.winSize.height / 2);
        let height = bottom - 90;

        this.scrollView2.node.y = panel3Bottom - (height/2) - 55;
        this.scrollView2.node.height = height;//this.scrollView2.node.height  + offset;
        // let scrollView2View = this.scrollView2.node.getChildByName('view')
        // scrollView2View.height = scrollView2View.height + offset;
        let title = this.scrollView2.node.getChildByName('title3');
        title.y = (height/2) + title.height / 2 + 5;
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
        this.getAdDataToShow3(this._initParam.positionId);
    }

    getAdDataToShow2(positionId: string) {
        this.adData2 = lwsdk.getAdDataToShow({positionKey: positionId, showCount: this._initParam.showCount, index:this._index});
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

    getAdDataToShow3(positionId: string) {
        this.adData3 = lwsdk.getAdDataToShow({positionKey: positionId, showCount: 8, index:this._index})
        if (!this.adData2) {
            return;
        }
        this._index = this.adData3.index;
        for (let i in this.adData3.data) {
            let node = cc.instantiate(this.item3);
            node.getComponent('LWitem').init({ itemData: this.adData3.data[i], flowId: this._flowId, touchStart: this.touchStart.bind(this), touchUp: this.touchUp, iconShake: this._initParam.iconShake });
            this.content2.addChild(node);
        }
    }

    onDestroy() {
        this.removeListener(this);
        super.onDestroy();
    }

    onScrolling(e) {
        let data = this.adData.data;
        let scrollViewChild = this.scrollView.node.getChildByName('view').children[0]
        let scrollView2Child =  this.scrollView2.node.getChildByName('view').children[0]
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
            this.autoScrollY(dt);
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
            
            if(absY > (maxHeight - this.contenty2)){
                this._scrollReverseY = true
            }
        }

        if (this._scrollReverseY) {
            scrollViewChild.y -= dt * this._moveOffset;
            let absY = Math.abs(scrollViewChild.y);
            if(absY < this.contenty2/*  - this._moveOffset / 3 */){
                this._scrollReverseY = false
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
