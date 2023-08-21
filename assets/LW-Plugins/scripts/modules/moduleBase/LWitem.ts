import EventConst from '../../plugins/LWEventConst'
const { ccclass, property } = cc._decorator;
import ccUtils from '../../utils/LWccUtils'
@ccclass
export default class LWitem extends cc.Component {

    @property(cc.Label)
    iconName: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Node)
    hot: cc.Node = null;

    @property
    _itemData: any = null;

    @property
    _flowId: number = null;

    init({ itemData, flowId, touchStart, touchUp, iconShake = false }: { itemData: any, flowId: number, touchStart?: Function, touchUp?: Function, iconShake: boolean }) {
        if (!itemData || !flowId) {
            console.warn('itemData或flowId 不能为空。');
            return
        }
        this._itemData = itemData;
        this._flowId = flowId;
        // this.schedule(() => {
        //     console.log(this.node.height, this.node.scaleX);
        // }, 2);

        ccUtils.renderIcon(this.icon, itemData.icon);
        this.iconName.string = itemData.name;
        this.hot && (this.hot.active = Boolean(itemData.label_switch));
        if (touchStart) {
            // touchStart = ()=>{console.log('itemTouchstart')}
            // this.node.on(cc.Node.EventType.TOUCH_START, touchStart);
        }
        if (touchUp) {
            // let touchend = ()=>{console.log('itemTouchend')}
            // let touchcancel = ()=>{console.log('itemTouchcancel')}
            // this.node.on(cc.Node.EventType.TOUCH_END, touchend);
            // this.node.on(cc.Node.EventType.TOUCH_CANCEL, touchcancel);
        }
        if (iconShake) {
            this.playShakeAnimation();
        }

    }

    playShakeAnimation(repeatForever: boolean = true) {
        if (repeatForever) {
            this.node.runAction(cc.sequence(cc.delayTime(1), cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.delayTime(3)).repeatForever());
        } else {
            this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0)/* , cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0) */));
        }
    }

    rotateOnce(delay = 0.3) {
        this.node.runAction(cc.rotateBy(delay, 360))
    }

    onItemClick(e) {
        // console.log(4444444,this._flowId)
        // return
        let self = this;
        var navigateToFail = function (err) {
            // console.log('发送失败事件。', EventConst.FlowEvent.onNavigateToFail + self._flowId)
            cc.director.emit(EventConst.FlowEvent.onNavigateToFail + self._flowId, err);
        }
        if (this._itemData.gc_status == 1 && !this._itemData.try_status) {
            var tryPlaySuccess = function (gold) {
                // console.log('发送tryPlaySuccess事件。', EventConst.FlowEvent.onTryPlaySuccess + self._flowId)
                cc.director.emit(EventConst.FlowEvent.onTryPlaySuccess + self._flowId, gold);
            }
            var tryPlayFail = function (msg) {
                // console.log('发送tryPlayFail事件。', EventConst.FlowEvent.onTryPlayFail + self._flowId)
                cc.director.emit(EventConst.FlowEvent.onTryPlayFail + self._flowId, msg);
            }
            lwsdk.onAdTouch({ adItem: this._itemData, tryPlaySuccess, tryPlayFail, navigateToFail });
        } else {
            lwsdk.onAdTouch({ adItem: this._itemData, navigateToFail });
        }
    }

    onDestroy() {
        this.node.stopAllActions()
    }

    // update (dt) {}
}
