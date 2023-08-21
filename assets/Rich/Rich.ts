/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import AudioMgr, { SfxType } from "../Apply/audio_mgr";
import Data, { Game_inter } from "../Apply/Data";
import Export from "../Export/Export";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Start from "../Start/Start";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Rich extends lw.BaseView {

    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Node")
    private _diam: cc.Node = null;
    @metadata("cc.Label")
    private _lab_diam: cc.Label = null;
    @metadata("cc.Node")
    private _coin: cc.Node = null;
    @metadata("cc.Label")
    private _lab_coin: cc.Label = null;
    @metadata("cc.Button")
    private _btn_buy: cc.Button = null;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    //--Auto export attr, Don't change end--

    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */

    diam_num = 100;
    coin_num = 1000;
    constructor() {
        super()
        this.LayerOrder = ViewZOrder.Rich;
    }
    protected init(arg) {
        this._coin.active = false;
        this._diam.active = false;
        if (arg == "diam") {
            this._diam.active = true;
        } else {
            this._coin.active = true;
        }
        this._lab_coin.string = "x" + this.coin_num.toString();
        this._lab_diam.string = "x" + this.diam_num.toString();
        Export.instance.showBanner();
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {

    }

    /** 
     * 初始化事件 
     */
    protected _initEvent() {
        // TODO
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        if (Start.instance.shop) {

        } else {
            Export.instance.hideBanner();
        }
        // TODO
    }

    /**
     * 继续
     */
    clickBtnBuy() {
        AudioMgr.playEffect(SfxType.kclick);
        let fun = () => {
            let tpye = 0;
            let rich_num = 0;
            if (this._diam.active) {
                tpye = 102;
                rich_num = this.diam_num;
            } else {
                tpye = 101;
                rich_num = this.coin_num;
            }
            AudioMgr.playEffect(SfxType.kgetcoin);
            Data.ware_change(tpye, rich_num)
        }
        Export.instance.wacth_video(fun);
    }

    clickBtnClose() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.close(Game_inter.Rich);
    }
}
