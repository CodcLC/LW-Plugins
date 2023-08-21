import AudioMgr, { SfxType } from "../Apply/audio_mgr";
import Data, { Game_inter } from "../Apply/Data";
import Export from "../Export/Export";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Game from "../Game/Game";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Sett extends lw.BaseView {

    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Node")
    private _succ: cc.Node = null;
    @metadata("cc.Button")
    private _btn_next: cc.Button = null;
    @metadata("cc.Node")
    private _fail: cc.Node = null;
    @metadata("cc.Button")
    private _btn_agin: cc.Button = null;
    @metadata("cc.Button")
    private _btn_back: cc.Button = null;
    @metadata("cc.Label")
    private _lab_aft: cc.Label = null;
    @metadata("cc.Label")
    private _lab_now: cc.Label = null;
    @metadata("cc.Label")
    private _lab_next: cc.Label = null;
    @metadata("cc.Button")
    private _btn_dou: cc.Button = null;
    @metadata("cc.Node")
    private _rew: cc.Node = null;
    @metadata("cc.Label")
    private _lab_coin: cc.Label = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super();
        this.LayerOrder = ViewZOrder.Sett;
    }

    coinNode = null;
    diamNode = null;
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(arg) {
        this._succ.active = false;
        this._fail.active = false;
        let json = Data.game_level.json[Data.game_level.num - 1].level_json;
        this.coinNode = this._rew.getChildByName("coin");
        this.diamNode = this._rew.getChildByName("diam");
        let lab_coin = this.coinNode.getChildByName("lab").getComponent(cc.Label);
        let lab_diam = this.diamNode.getChildByName("lab").getComponent(cc.Label);
        if (arg) {
            Data.finishLevel();
            AudioMgr.playEffect(SfxType.kvictory);
            this._succ.active = true;
            lab_coin.string = json[json.length - 1].win_coin.toString();
            if (json[json.length - 1].win_diam > 0) {
                this.diamNode.parent = this._rew;
                Data.ware_change(102, json[json.length - 1].win_diam);
                lab_diam.string = json[json.length - 1].win_diam.toString();
            } else {
                this.diamNode.parent = null;
            }
            Data.ware_change(101, json[json.length - 1].win_coin);
        } else {
            this._fail.active = true;
            let bl = ((Game.instance.GameRank - 1) / Data.game_level.json[Data.game_level.num - 1].level_num);
            let coin = Math.floor(json[json.length - 1].win_coin * bl);
            lab_coin.string = coin.toString();

            if (json[json.length - 1].win_diam > 0) {
                this.diamNode.parent = this._rew;
                let diam = Math.floor(json[json.length - 1].win_coin * bl);
                lab_coin.string = diam.toString();
                Data.ware_change(102, diam);
                lab_diam.string = diam.toString();
            } else {
                this.diamNode.parent = null;
            }
            Data.ware_change(101, coin);
        }
        this._lab_now.string = Data.game_level.num.toString();
        if (Data.game_level.num > 1) {
            this._lab_aft.node.active = true;
            this._lab_aft.string = (Data.game_level.num - 1).toString();
        } else {
            this._lab_aft.node.active = false;
        }
        this._lab_next.string = (Data.game_level.num + 1).toString();

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
        this._btn_dou.node.on(cc.Node.EventType.TOUCH_END, () => {
            let fun = () => {
                let json = Data.game_level.json[Data.game_level.num - 1].level_json;
                Data.ware_change(101, json[json.length - 1].win_coin);
                Data.ware_change(101, json[json.length - 1].win_diam);
                this._btn_dou.node.active = false;
            }
            Export.instance.wacth_video(fun);
        })

        this._btn_next.node.on(cc.Node.EventType.TOUCH_END, () => {
            Data.finishLevel();
            lw.viewMgr.close(Game_inter.Sett);
            lw.viewMgr.close(Game_inter.Game);
            lw.viewMgr.open(Game_inter.Start);
        })

        this._btn_agin.node.on(cc.Node.EventType.TOUCH_END, () => {
            lw.viewMgr.close(Game_inter.Sett);
            lw.viewMgr.close(Game_inter.Game);
            lw.viewMgr.open(Game_inter.Start);
        })
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }

    /**
     * 返回的主界面
     */
    clickBtnBack() {

        lw.viewMgr.close(Game_inter.Sett);
        lw.viewMgr.close(Game_inter.Game);
        lw.viewMgr.open(Game_inter.Start);
    }
}
