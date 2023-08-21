import LWBaseMain from "../moduleBase/LWBaseMain";
import commonMain from '../moduleBase/LWcommonMain'
import effcts from '../../effects/LWEffects'


// import effcts from '../../effects/LWEffects'
// import commonMain from '../moduleBase/LWcommonMain'
const {ccclass, property} = cc._decorator;

@ccclass
export default class LWhotBoxMain extends LWBaseMain {

    
    @property({ serializable: false , override: true})
    _autoScrollX: boolean = false;
    @property({ serializable: false , override: true})
    _autoScrollY: boolean = true;

    @property([cc.Node])
    topItems: cc.Node[] = [];
    
    @property(cc.Node)
    handFocus: cc.Node = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    init(data: initParam) {
        this.screenAdapted();
        super.init(data);
        commonMain.addListener(this);
    }

    getAdDataToShow(positionId: string) {
        this.adData = lwsdk.getAdDataToShow({positionKey: positionId, showCount: this._initParam.showCount, index:this._index});
        if (!this.adData) {
            return
        }
        this._index = this.adData.index;
        for (let i = 0; i < 3; i++) {
            let node = this.topItems[i];
            node.getComponent('LWitem').init({ itemData: this.adData.data[i], flowId: this._flowId, touchStart: this.touchStart.bind(this), touchUp: this.touchUp, iconShake: false });
        }
        for (let i = 3; i < this.adData.data.length; i++) {
            let node = cc.instantiate(this.item);
            node.getComponent('LWhotBoxItem').init({ itemData: this.adData.data[i], flowId: this._flowId, touchStart: this.touchStart.bind(this), touchUp: this.touchUp, iconShake: false, index: i});
            this.container.addChild(node);
        }
    }

    onLoad() {
        let scrollView = this.scrollView.node.getChildByName('view');
        let scrollViewChild = scrollView.children[0];
        let layout = scrollViewChild.getComponent(cc.Layout)

        this.spacingX = layout.spacingX;
        this.contenty = this._autoScrollX ? scrollView.width / 2 : scrollView.height / 2;
        scrollViewChild.y = this.contenty;
        // cc.log(1111111, this.contenty);
        this.spacingY = layout.spacingY;
        this._containerTop = layout.paddingTop;
        super.onLoad();
        this.playHandFocus();
    }

    onScrolling(e) {
        // let data = this.adData.data;
        // let scrollViewChild = this.scrollView.node.getChildByName('view').children[0]
        // if (this._autoScrollX) {
        //     var width = scrollViewChild.children[0].width;
        //     var maxwidth = (Math.ceil(data.length) * width + (Math.ceil(data.length) - 1) * this.spacingX) - this.contenty;
        //     console.log(scrollViewChild.x, scrollViewChild.width, width, maxwidth);
        // }
        // if (this._autoScrollY) {
        //     var height = scrollViewChild.children[0].height;
        //     var maxHeight = (Math.ceil(data.length - 3) * height + (Math.ceil(data.length - 3) - 1) * this.spacingY) - this.contenty + this._containerTop;
        //     console.log(scrollViewChild.y, scrollViewChild.height, height, maxHeight);
        // }
    }

    screenAdapted() {
        // let offset = ccUtils.getHeightOffset();
        // cc.log(44444, this.scrollView.node.height, offset);
        let safeArea = cc.sys.getSafeAreaRect()
        console.log(cc.winSize, safeArea)
        let scrollNode = this.scrollView.node;
        scrollNode.height = safeArea.height - this.bgNode.height - 50;
        scrollNode.y = cc.winSize.height / 2 - this.bgNode.height - scrollNode.height / 2 - 20;
        // if (this.continueButton) {
        //     this.continueButton.y = this.continueButton.y - (offset / 2);
        // }
        // if (this.closeButton) {
        //     this.closeButton.y = this.closeButton.y + (offset / 2);
        // }
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
        if (!this.adData) {
            return
        }
        this._moveOffset = 65;
        let scrollView = this.scrollView.node.getChildByName('view');
        let scrollViewChild = scrollView.children[0];
        let length = this.adData.data.length - 3;

        var height = scrollViewChild.children[0].height;
        var maxHeight = (Math.ceil(length / this._splitLines) * height + (Math.ceil(length / this._splitLines) - 1) * this.spacingY) + this._containerTop;
        let viewHeight = scrollView.height;
        if (maxHeight < viewHeight + this._moveOffset) {
            this._autoScrollY = false;
            return
        }
        if (!this._scrollReverseY) {
            scrollViewChild.y += dt * this._moveOffset;
            let absY = Math.abs(scrollViewChild.y);
            
            if(absY > (maxHeight - this.contenty)){
                this._scrollReverseY = true
            }
        }

        if (this._scrollReverseY) {
            scrollViewChild.y -= dt * this._moveOffset;
            let absY = Math.abs(scrollViewChild.y);
            if(absY < this.contenty/*  - this._moveOffset / 3 */){
                this._scrollReverseY = false
            }
        }
    }

    onDestroy() {
        commonMain.removeListener(this);
        super.onDestroy();
    }

    clickRandomGame(success, fail) {
        commonMain.clickRandomGame(this, success, fail)
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
