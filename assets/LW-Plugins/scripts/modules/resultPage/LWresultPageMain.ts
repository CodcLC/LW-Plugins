
const { ccclass, property } = cc._decorator;
import commonMain from '../moduleBase/LWcommonMain'
import ccUtils from '../../utils/LWccUtils';
import LWBaseMain from '../moduleBase/LWBaseMain';
@ccclass
export default class LWresultPageMain extends LWBaseMain {
    @property({ serializable: false, override: true })
    _autoScrollX: boolean = false;
    @property({ serializable: false, override: true })
    _autoScrollY: boolean = true;

    @property({ serializable: false, override: true })
    _splitLines: number = 3;


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

        
        // if (this._initParam.slideIn) {
            // effcts.runEffect(this.node.getChildByName('box'), true);
            this.iconRotateIn(this.container.position);
        // }
        super.onLoad();
        this.randomItemShake();
    }

    randomItemShake() {
        this.schedule(() => {
            let index = Math.floor(this.container.children.length * Math.random());
            this.container.children[index].getComponent('LWitem').playShakeAnimation(false);
        }, 2)
    }

    iconRotateIn(sourcePosition) {
        this.container.x = (-750) * ccUtils.getScale();
        let delay = 0.4;
        // @ts-ignore
        if (cc.tween) {
            // @ts-ignore
            cc.tween(this.container)
            // @ts-ignore
            .to(delay, {position: sourcePosition}).start();
        } else {
            this.container.runAction(cc.moveTo(delay, sourcePosition))
        }
        this.container.children.forEach(item => {
            item.getComponent('LWitem').rotateOnce(delay)
        })
    }

    onDestroy() {
        commonMain.removeListener(this);
        super.onDestroy();
    }
}
