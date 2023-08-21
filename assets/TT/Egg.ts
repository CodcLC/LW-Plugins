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
import Main from "../Main/Main";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Egg extends lw.BaseView {

    //--Auto export attr, Don't change--
    @metadata("cc.Node")
    private _rew: cc.Node = null;
    @metadata("cc.Node")
    private _true: cc.Node = null;
    @metadata("cc.ProgressBar")
    private _pro_pro: cc.ProgressBar = null;
    @metadata("cc.Button")
    private _btn_open: cc.Button = null;
    @metadata("cc.Node")
    private _false: cc.Node = null;
    @metadata("cc.Button")
    private _btn_rece: cc.Button = null;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    @metadata("cc.Node")
    private _get: cc.Node = null;
    @metadata("cc.Label")
    private _lab_lab: cc.Label = null;
    @metadata("cc.Button")
    private _btn_get: cc.Button = null;
    //--Auto export attr, Don't change end--
    protected _autoBind: boolean = true;

    constructor() {
        super()
        this.LayerOrder = ViewZOrder.Egg;
    }
    proNum = 0;
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(arg) {
        // TODO
        this._get.active = false;
        this._rew.active = true;
        this._false.active = false;
        this._true.active = false;
        this.proNum = 0;
        if (Main.instance.userData.banner_data.boxProbability != 0) {
            this._true.active = true;
            this._pro_pro.progress = this.proNum;
            this._btn_open.node.getChildByName("video").active = false;
            this._btn_close.node.active = false;
        } else {
            this._false.active = true;
            this._btn_close.node.active = true;
        }
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {
        // TODO
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
        // TODO
    }

    getRew() {

        this._rew.active = false;
        this._get.active = true;
        let coin = 500;
        this._lab_lab.string = coin.toString();
        Data.ware_change(101, coin);
        this._btn_close.node.active = true;
    }

    /**
     * 得到奖励
     */
    clickBtnRece() {
        AudioMgr.playEffect(SfxType.kclick);
        let fun = () => {
            this.getRew();
        }
        Export.instance.wacth_video(fun);
    }
    /**
    * 
    */
    clickBtnGet() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.close(Game_inter.Egg);
    }
    /**
     * 关闭
     */
    clickBtnClose() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.close(Game_inter.Egg);
    }

    /**
     * 关闭
     */
    clickBtnOpen() {
        AudioMgr.playEffect(SfxType.kclick);
        if (this._btn_open.node.getChildByName("video").active) {
            Export.instance.wacth_video(this.getRew.bind(this));
            return;
        }

        this.proNum += 0.2;
        this._pro_pro.progress = this.proNum;
        if (this.proNum >= 0.8) {
            this._btn_close.node.active = true;
            this._btn_open.node.getChildByName("video").active = true;
        }
    }
}
