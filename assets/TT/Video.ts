/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Data, { Game_inter } from "../Apply/Data";
import Plat from "../Apply/Plat";
import { ViewZOrder } from "../Framework/View/ViewZOrder";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Video extends lw.BaseView {

    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Label")
    private _lab_num: cc.Label = null;
    @metadata("cc.Button")
    private _btn_share: cc.Button = null;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    //--Auto export attr, Don't change end-

    constructor() {
        super();
        this.LayerOrder = ViewZOrder.Video;
    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        Plat.stopGameRecord();
        // TODO
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
        this._btn_share.node.on(cc.Node.EventType.TOUCH_END, () => {
            let fun = () => {
                console.log("分享完成");
                Data.ware_change(101, 200);
                this.clickBtnClose()
            }
            let fun1 = () => {
                console.log("分享失败");
                this.clickBtnClose()
                
            }
            Plat.shareRecordVideo(fun, fun1);
        })
        // TODO
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }
    /**
    * 关闭界面
    */
    clickBtnClose() {
        lw.viewMgr.close(Game_inter.Video);
        lw.viewMgr.open(Game_inter.Sett, true);
    }
}
