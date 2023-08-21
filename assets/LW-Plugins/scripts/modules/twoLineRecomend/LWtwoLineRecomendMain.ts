
const { ccclass, property } = cc._decorator;
import commonMain from '../moduleBase/LWcommonMain'
import ccUtils from '../../utils/LWccUtils';
import LWBaseMain from '../moduleBase/LWBaseMain';

@ccclass
export default class LWsidebarDrawerMain extends LWBaseMain {

    @property({ serializable: false, override: true})
    _autoScrollX: boolean = true;
    @property({ serializable: false, override: true })
    _autoScrollY: boolean = false;

    @property({ serializable: false, override: true })
    _splitLines: number = 2;


    @property(cc.Node)
    winTitle: cc.Node = null;
    @property(cc.Node)
    failTitle: cc.Node = null;
    @property(cc.SpriteFrame)
    continueSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    nextSpriteFrame: cc.SpriteFrame = null;

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
        commonMain.addListener(this);
        this._autoScrollY=false;
    }



    onLoad() {
        let scrollView = this.scrollView.node.getChildByName('view');
        let scrollViewChild = scrollView.children[0];
        let layout = scrollViewChild.getComponent(cc.Layout)
        this.spacingX = layout.spacingX;
        this.contenty = this._autoScrollX ? scrollView.width / 2 : scrollView.height / 2;
        scrollViewChild.y = this.contenty;
        this.spacingY = layout.spacingY;
        this._containerTop = layout.paddingTop;
        super.onLoad();
    }

    screenAdapted() {
        return
        let offset = ccUtils.getHeightOffset();
        // cc.log(44444, this.scrollView.node.height, offset);
        this.scrollView.node.height = this.scrollView.node.height + offset;
        // cc.log(55555, this.scrollView.node.height, offset);
        this.scrollView.node.getChildByName('view').height = this.scrollView.node.getChildByName('view').height + offset;
        if (this.continueButton) {
            this.continueButton.y = this.continueButton.y - (offset / 2);
        }
        if (this.closeButton) {
            this.closeButton.y = this.closeButton.y + (offset / 2);
        }
    }

    onDestroy() {
        commonMain.removeListener(this);
        super.onDestroy();
    }

    clickRandomGame(success, fail) {
        commonMain.clickRandomGame(this, success, fail)
    }

    update(dt) {
        console.log(this._autoScrollX)
        if (this._autoScrollX) {
            this.autoScrollX(dt);
        }
    }

    autoScrollX(dt) {

        if (!this.adData) {
            return
        }
        let target = this;

        target._moveOffset = 65;
        let scrollViewNode = target.scrollView.node.getChildByName('view');
        let scrollViewNodeChild = scrollViewNode.children[0];
        var width = scrollViewNodeChild.children[0].width;
        var maxWidth = (Math.ceil(target.adData.data.length / target._splitLines) * width + (Math.ceil(target.adData.data.length / target._splitLines) - 1) * target.spacingX)/*  + target._moveOffset / 3 */;
        let viewWidth = scrollViewNode.width;
        if (maxWidth < viewWidth + target._moveOffset) {
            target._autoScrollX = false;
            return
        }

        let contenty = target.scrollView.node.getChildByName('view').width / 2;
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
}
