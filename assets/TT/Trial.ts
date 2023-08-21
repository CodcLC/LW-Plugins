/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Apply from "../Apply/Apply";
import Data, { Game_inter } from "../Apply/Data";
import Export from "../Export/Export";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Start from "../Start/Start";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Trial extends lw.BaseView {

    protected _autoBind: boolean = true;
    //--Auto export attr, Don't change--
    @metadata("dragonBones.ArmatureDisplay")
    private _drag_drag: dragonBones.ArmatureDisplay = null;
    @metadata("cc.Button")
    private _btn_trial: cc.Button = null;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super();
        this.LayerOrder = ViewZOrder.Trial;
    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(arg) {
        Export.instance.hideBanner();
        this.loadeDrag(arg);
    }

    dragIdx = 0;
    /**
    * 加载龙骨
    */
    loadeDrag(num) {
        let fun = () => {
            this._drag_drag.armatureName = "armatureName";
            this._drag_drag.playAnimation("run", 0);
        }
        this.dragIdx = num;
        let path = "Sprite/DragonBones/player" + num;
        Apply.loadDragonBones(this._drag_drag, "Start", path, fun);
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

    /**
    * 试用按钮
    */
    clickBtnTrial() {
        let fun = () => {
            Data.warehouse[201].SKIN.trial = this.dragIdx;
            this.clickBtnClose();
            Start.instance.loadeDrag();
            this.clickBtnClose();
        }
        Export.instance.wacth_video(fun);
    }


    /**
    * 关闭界面
    */
    clickBtnClose() {
        lw.viewMgr.close(Game_inter.Trial);
        lw.viewMgr.open(Game_inter.Draw);
    }
}
