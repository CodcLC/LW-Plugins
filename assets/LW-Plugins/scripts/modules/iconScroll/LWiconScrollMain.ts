
const {ccclass, property} = cc._decorator;
import effcts from '../../effects/LWEffects';
import commonMain from '../moduleBase/LWcommonMain';
import LWBaseMain from '../moduleBase/LWBaseMain';
@ccclass
export default class LWiconScrollMain extends LWBaseMain {
    @property({serializable:false, override: true})
    _autoScrollX: boolean = true;
    @property({serializable:false, override: true})
    _autoScrollY: boolean = false;

    @property({serializable:false, override: true})
    _splitLines: number = 1;


    reset () {
        this._index = 0;
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
}
