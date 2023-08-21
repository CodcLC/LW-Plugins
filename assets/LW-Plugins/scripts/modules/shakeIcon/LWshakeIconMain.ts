
const { ccclass, property } = cc._decorator;
import effcts from '../../effects/LWEffects';
import commonMain from '../moduleBase/LWcommonMain';
import LWBaseMain from '../moduleBase/LWBaseMain';
let _index = 0;
let _currentIcons: any = {};
@ccclass
export default class LWshakeIconMain extends LWBaseMain {
    @property({ serializable: false, override: true })
    _autoScrollX: boolean = true;
    @property({ serializable: false, override: true })
    _autoScrollY: boolean = false;

    @property({ serializable: false, override: true })
    _splitLines: number = 1;

    // reset () {
    //     // _index = 0;
    // }

    onLoad() {
        if (this._initParam.slideIn) {
            effcts.runEffect(this.node.getChildByName('box'), true);
        }
        super.onLoad();
    }

    getAdDataToShow(positionId: string) {
        this.adData = lwsdk.getAdDataToShow({ positionKey: positionId, showCount: this._initParam.showCount, index: this._index });
        if (!this.adData) {
            return
        }
        // console.log(5555555555555555, this._initParam.flowId, _index, JSON.stringify(_currentIcons), this.adData.data[0].icon);
        _index = this.adData.index;
        let appid = this.adData.data[0].appid;
        let appids = Object.values(_currentIcons);
        let allCount = this.differentAppidsCount(positionId);
        if (appids.length >= allCount) {
            // 该位置key创建的广告实例数大于等于去重后的icon总数，必然会出现重复的icon
            console.warn('该位置key创建的广告实例数大于等于去重后的icon总数，必然会出现重复的icon，跟运营沟通是否需要减少创建的数量或后台配置更多的icon数量');
        } else {
            if (appids.length > 1) {
                // 单icon游戏去重处理
                for (let id in _currentIcons) {
                    if (_currentIcons[id] === appid) {
                        this.getAdDataToShow(positionId);
                        return;
                    }
                }
            }
        }

        _currentIcons[this._flowId] = appid;

        // console.log(66666, this._initParam.flowId, _index, appid, this.adData.data[0].icon);
        for (let i in this.adData.data) {
            let node = commonMain.getItemNode(this);
            node.getComponent('LWitem').init({ itemData: this.adData.data[i], flowId: this._flowId, touchStart: this.touchStart.bind(this), touchUp: this.touchUp, iconShake: this._initParam.iconShake });
            this.container.addChild(node);
            this.node.width;
        }
    }

    differentAppidsCount(positionKey) {
        let data = lwsdk.getDiversionDataByKey(positionKey)
        if (!data || !data.data || data.data.length === 0) {
            return 0;
        }
        let appids = {};
        let arr = data.data;
        for (let i in arr) {
            if (arr[i].appid) {
                appids[arr[i].appid] = 1;
            }
            else if (arr[i].icondata && arr[i].icondata.length > 0) {
                let icondata = arr[i].icondata;
                for (let j = 0; j < icondata.length; j++) {
                    appids[icondata[j].appid] = 1;
                }
            }
        }
        return Object.keys(appids).length;
    }

    onDestroy() {
        delete _currentIcons[this._flowId];
        commonMain.removeListener(this);
        super.onDestroy();
    }

    update(dt) { } // 覆盖掉父类方法
}
