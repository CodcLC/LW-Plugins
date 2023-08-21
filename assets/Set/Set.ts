/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import AudioMgr, { BgmType, SfxType } from "../Apply/audio_mgr";
import Data, { Game_data } from "../Apply/Data";
import Export from "../Export/Export";
import { ViewZOrder } from "../Framework/View/ViewZOrder";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Set extends lw.BaseView {

    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    @metadata("cc.Button")
    private _btn_music: cc.Button = null;
    @metadata("cc.Button")
    private _btn_shock: cc.Button = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super()
        this.LayerOrder = ViewZOrder.Set;
    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        // TODO
        Export.instance.showBanner();
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {
        if (Data.set.music) {
            this._btn_music.interactable = true;
        } else {
            this._btn_music.interactable = false;
        }
    }

    refresh() {
        if (Data.set.music) {
            this._btn_music.interactable = true;
            AudioMgr.playMusic(BgmType.kMenu);
        } else {
            this._btn_music.interactable = false;
            AudioMgr.stopMusic();
        }
        if (Data.set.shock) {
            this._btn_shock.interactable = true;
        } else {
            this._btn_shock.interactable = false;
        }
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

    clickBtnClose() {
        AudioMgr.playEffect(SfxType.kclick);
        this.node.active = false;
        Export.instance.hideBanner();
    }

    /**
     * 音效的点击
     */
    clickBtnMusic() {
        AudioMgr.playEffect(SfxType.kclick);
        Data.set.music = !Data.set.music;
        this.refresh()
        Data.writeJSON(Game_data.kset, Data.set);
    }

    /**
     * 震动的点击
     */
    clickBtnShock() {
        AudioMgr.playEffect(SfxType.kclick);
        Data.set.shock = !Data.set.shock;
        this.refresh()
        Data.writeJSON(Game_data.kset, Data.set);
    }
}
