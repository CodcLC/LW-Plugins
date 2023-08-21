
const {ccclass, property} = cc._decorator;
import effcts from '../../effects/LWEffects'
import commonMain from '../moduleBase/LWcommonMain';
import ccUtils from '../../utils/LWccUtils';
import LWBaseMain from '../moduleBase/LWBaseMain';
@ccclass
export default class LWsidebarDrawerMain extends LWBaseMain {

    @property(cc.Node)
    btnHide: cc.Node = null;

    @property(cc.Node)
    btnShow: cc.Node = null;

    @property({serializable:false, override: true})
    _autoScrollX: boolean = false;
    @property({serializable:false, override: true})
    _autoScrollY: boolean = true;
    @property({serializable:false, override: true})
    _splitLines: number = 4;

    _isShow: boolean = false;

    _sourcePos: cc.Vec2 = null;

    _hidePositionX = -670;

    reset () {
        let scale = ccUtils.getScale();
        this._index = 0;
        this._hidePositionX = -670 * scale;
        this.node.x = this._hidePositionX;
        this.btnHide.active = false;
        this.btnShow.active = true;
        this._isShow = false;
    }

    /**
     * 初始化
     * @param positionId 位置id/位置key
     */
    init (data: initParam) {
        super.init(data);
        commonMain.addListener(this);
    }

    onLoad() {
        let scrollViewChild = this.scrollView.node.getChildByName('view').children[0];
        let layout = scrollViewChild.getComponent(cc.Layout)

        this.spacingX = layout.spacingX;
        this.contenty = this._autoScrollX ? scrollViewChild.x : scrollViewChild.y;
        this.spacingY = layout.spacingY;
        this._containerTop = layout.paddingTop;

        
        if (this._initParam.slideIn) {
            effcts.runEffect(this.node.getChildByName('box'), true);
        }
        super.onLoad();
    }

    onDestroy() {
        commonMain.removeListener(this);
        super.onDestroy();
    }

    triggerShow(event,isShow: '0' | '1') {
        if (isShow === '1') {
            // @ts-ignore
            if (cc.tween) {
                // @ts-ignore
                cc.tween(this.node)
                // @ts-ignore
                .to(0.2, {position: cc.v2(0, 0)}).start();
            } else {
                this.node.runAction(cc.moveTo(0.2, cc.v2(0, 0)))
            }
            this.btnHide.active = true;
            this.btnShow.active = false;
        } else {
            // @ts-ignore
            if (cc.tween) {
                // @ts-ignore
                cc.tween(this.node)
                // @ts-ignore
                .to(0.2, {position: cc.v2(this._hidePositionX, 0)}).start();
            } else {
                this.node.runAction(cc.moveTo(0.2, cc.v2(this._hidePositionX, 0)))
            }
            this.btnHide.active = false;
            this.btnShow.active = true;
        }
    }
}
