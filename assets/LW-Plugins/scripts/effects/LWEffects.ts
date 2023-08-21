let effectsInstance;
export default class LWEffects {
    private static _effectTypes: string[] = ['swingInLeft'];
    constructor() {
        if (effectsInstance) {
            return effectsInstance
        }
        effectsInstance = this;
    }

    static getEffectType(): string {
        let type = Math.floor(Math.random() * LWEffects._effectTypes.length);
        return LWEffects._effectTypes[type]
    }

    /**
     * 
     * @param node 目标节点
     * @param randomType 是否使用随机效果
     * @param type 动效类型：swingInLeft/
     */
    static runEffect(node: cc.Node, randomType: boolean = false, type: string = 'swingInLeft') {
        if (!node) {
            return
        }
        type = randomType ? LWEffects.getEffectType() : type;
        let sourcePosition = cc.v2(node.x, node.y);
        switch (type) {
            case 'swingInLeft':
                LWEffects[type](node, sourcePosition);
                break;

            default:
                break;
        }

    }

    static swingInLeft(node: cc.Node, sourcePosition: cc.Vec2) {
        node.x = -750;
        // @ts-ignore
        if (cc.tween) {
            // @ts-ignore
            cc.tween(node)
                // @ts-ignore
                .to(0.2, { position: sourcePosition }).start();
        } else {
            node.runAction(cc.moveTo(0.2, sourcePosition))
        }
    }

    static autoScrollY(dt, target: { adData: any, spacingY: number, _splitLines: number, _moveOffset: number, _scrollReverseY: boolean, scrollView: cc.ScrollView, contenty: number, _autoScrollY: boolean, _containerTop: number }) {
        if (!target.adData) {
            return
        }
        target._moveOffset = 65;
        let scrollViewNode = target.scrollView.node.getChildByName('view');
        let scrollViewNodeChild = scrollViewNode.children[0];

        var height = scrollViewNodeChild.children[0].height;
        var maxHeight = (Math.ceil(target.adData.data.length / target._splitLines) * height + (Math.ceil(target.adData.data.length / target._splitLines) - 1) * target.spacingY) + target._containerTop;
        let viewHeight = scrollViewNode.height;
        if (maxHeight < viewHeight + target._moveOffset) {
            target._autoScrollY = false;
            return
        }
        if (!target._scrollReverseY) {
            scrollViewNodeChild.y += dt * target._moveOffset;
            let absY = Math.abs(scrollViewNodeChild.y);

            if (absY > (maxHeight - target.contenty)) {
                target._scrollReverseY = true
            }
        }

        if (target._scrollReverseY) {
            scrollViewNodeChild.y -= dt * target._moveOffset;
            let absY = Math.abs(scrollViewNodeChild.y);
            if (absY < target.contenty/*  - target._moveOffset / 3 */) {
                target._scrollReverseY = false
            }
        }
    }

    static autoScrollX(dt, target: { adData: any, spacingX: number, _splitLines: number, _moveOffset: number, _scrollReverseX: boolean, scrollView: cc.ScrollView, contenty: number, _autoScrollX: boolean }) {
        if (!target.adData) {
            return
        }
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
        if (target._scrollReverseX) {
            scrollViewNodeChild.x += dt * target._moveOffset;
            let absX = Math.abs(scrollViewNodeChild.x);
            if (absX < contenty) {
                target._scrollReverseX = false
            }
        }

        if (!target._scrollReverseX) {
            scrollViewNodeChild.x -= dt * target._moveOffset;
            let absX = Math.abs(scrollViewNodeChild.x);
            if (absX > (maxWidth - contenty)) {
                target._scrollReverseX = true
            }
        }
    }


}
// export default new LWEffects