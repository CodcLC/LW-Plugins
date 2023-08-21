
const { ccclass, property } = cc._decorator;
import EventConst from '../../plugins/LWEventConst'
import effcts from '../../effects/LWEffects'
import commonMain from '../moduleBase/LWcommonMain'

@ccclass
export default class LWBaseMain extends cc.Component {

    @property
    _index: number = 0;

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Prefab)
    item: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property
    _flowId: number = null;

    _onTouching: boolean = false;

    _moveOffset: number = 100;

    _scrollReverseX: boolean = false;

    _scrollReverseX2: boolean = false;

    _scrollReverseY: boolean = false;

    adData: any = null;
    adData2: any = null;
    @property({ serializable: false })
    _autoScrollX: boolean = false;
    @property({ serializable: false })
    _autoScrollY: boolean = false;

    contenty;
    contenty2;
    spacingX;
    spacingY;
    _containerTop;

    @property({ serializable: false })
    _splitLines: number = 1;


    _initParam: initParam = null;
    @property(cc.Node)
    closeButton: cc.Node = null;
    @property(cc.Node)
    continueButton: cc.Node = null;


    reset() {
        // this._index = 0;
    }

    /**
     * 初始化
     * @param positionId 位置id/位置key
     */
    init(data: initParam) {
        this._flowId = data.flowId;
        this._initParam = data;
        commonMain.setProperty(data, this);
        this.reset();
        this.getAdDataToShow(data.positionId);
    }

    onLoad() {
        let param = this._initParam;
        if (param.onCloseButtonInit && this.closeButton) {
            param.onCloseButtonInit(this.closeButton);
        }
        if (param.interval && param.interval > 0) {
            this.schedule(this.autoRefresh, param.interval)
        }
        if (param.onContinueButtonInit && this.continueButton) {
            param.onContinueButtonInit(this.continueButton);
        }
    }

    autoRefresh() {
        this.container.removeAllChildren();
        this.getAdDataToShow(this._initParam.positionId);
    }

    getAdDataToShow(positionId: string) {
        this.adData = lwsdk.getAdDataToShow({ positionKey: positionId, showCount: this._initParam.showCount, index: this._index });
        if (!this.adData) {
            return
        }
        this._index = this.adData.index;
        for (let i in this.adData.data) {
            let node = commonMain.getItemNode(this);
            node.getComponent('LWitem').init({ itemData: this.adData.data[i], flowId: this._flowId, touchStart: this.touchStart.bind(this), touchUp: this.touchUp, iconShake: this._initParam.iconShake });
            this.container.addChild(node);
        }
    }

    onCloseButton() {
        if (this._initParam.onCloseButtonClick) {
            this._initParam.onCloseButtonClick(this.closeButton);
            return
        }
        this.destroyMyself()
    }

    destroyMyself() {
        this.node.destroy();
        this.node.removeFromParent();
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        // this.removeListener(this);
        cc.director.emit(EventConst.FlowEvent.onDestroy + this._flowId)
    }

    touchUp() {
        // console.log('touchUp');
        this._onTouching = false;
    }

    touchStart() {
        // console.log('touchStart');
        this._onTouching = true;
    }

    scrollToLeft() {
        // console.log(4444);
        this._scrollReverseX = false;
    }

    scrollToRight() {
        // console.log(3333);
        this._scrollReverseX = true;
    }

    scrollToTop() {
        // console.log(4444);
        this._scrollReverseY = false;
    }

    scrollToBottom() {
        // console.log(3333);
        this._scrollReverseY = true;
    }

    onScrolling(e) {
        let data = this.adData.data;
        let scrollViewChild = this.scrollView.node.getChildByName('view').children[0];
        if (this._autoScrollX) {
            var width = scrollViewChild.children[0].width;
            var maxwidth = (Math.ceil(data.length) * width + (Math.ceil(data.length) - 1) * this.spacingX) - this.contenty;
            console.log(scrollViewChild.x, scrollViewChild.width, width, maxwidth);
        }
        if (this._autoScrollY) {
            var height = scrollViewChild.children[0].height;
            var maxHeight = (Math.ceil(data.length / 3) * height + (Math.ceil(data.length / 3) - 1) * this.spacingY) - this.contenty + this._containerTop;
            console.log(scrollViewChild.y, scrollViewChild.height, height, maxHeight);
        }
    }

    update(dt) {
        
        if (this._autoScrollX) {
            effcts.autoScrollX(dt, this);
        }
        if (this._autoScrollY) {
            effcts.autoScrollY(dt, this);
        }
    }

    onContinue() {
        if (this._initParam.onContinueButtonClick && this.continueButton) {
            this._initParam.onContinueButtonClick(this.continueButton);
            return
        }
        this.destroyMyself()
    }
}
