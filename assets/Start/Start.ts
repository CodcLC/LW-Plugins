/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Apply from "../Apply/Apply";
import AudioMgr, { BgmType, SfxType } from "../Apply/audio_mgr";
import Data, { Game_inter } from "../Apply/Data";
import Plat from "../Apply/Plat";
import Export from "../Export/Export";
import Main from "../Main/Main";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Start extends lw.BaseView {

    public static instance: Start = null;
    protected _autoBind: boolean = true;
    //--Auto export attr, Don't change--
    @metadata("cc.Camera")
    private _camera_came: cc.Camera = null;
    @metadata("cc.Node")
    private _bg: cc.Node = null;
    @metadata("dragonBones.ArmatureDisplay")
    private _drag_player: dragonBones.ArmatureDisplay = null;
    @metadata("cc.Button")
    private _btn_start: cc.Button = null;
    @metadata("cc.Button")
    private _btn_diam: cc.Button = null;
    @metadata("cc.Label")
    private _lab_diam: cc.Label = null;
    @metadata("cc.Button")
    private _btn_coin: cc.Button = null;
    @metadata("cc.Label")
    private _lab_coin: cc.Label = null;
    @metadata("cc.Button")
    private _btn_set: cc.Button = null;
    @metadata("cc.Button")
    private _btn_shop: cc.Button = null;
    @metadata("cc.Node")
    private _attri: cc.Node = null;
    @metadata("cc.ProgressBar")
    private _pro_lev: cc.ProgressBar = null;
    @metadata("cc.Label")
    private _lab_aft1: cc.Label = null;
    @metadata("cc.Label")
    private _lab_aft2: cc.Label = null;
    @metadata("cc.Label")
    private _lab_now: cc.Label = null;
    @metadata("cc.Label")
    private _lab_next1: cc.Label = null;
    @metadata("cc.Label")
    private _lab_next2: cc.Label = null;
    @metadata("cc.Button")
    private _btn_egg: cc.Button = null;
    //--Auto export attr, Don't change end--

    rich = {
        coin: null,
        diam: null,
        coinD: null,
        diamD: null,

    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        Start.instance = this;
        this.init_Rich();
        this.initAttri();
        this.loadeDrag();
        console.log("warehouse>>>>>>", Data.warehouse);
        AudioMgr.initAudio();
        this.refreshlevel();
        lw.viewMgr.close(Game_inter.Load);
        Plat.preScreencap();
        Export.instance.hideBanner();
        let T_node = this.node.getChildByName("bannerLight1")
        Export.instance.bannerNode[0] = T_node;
        // T_node = this.node.getChildByName("bannerLight")
        // Export.instance.bannerNode[1] = T_node;
        console.log("userData>>>>>>>>>>>>>>", Main.instance.userData)
        //this.exprot();
    }




    /**
     * 刷新关卡
     */
    refreshlevel() {
        let t_num = Math.floor(Data.game_level.num / 5);
        let t_num1 = t_num * 5 + 1;
        this._lab_aft1.string = (t_num1).toString();
        this._lab_aft2.string = (t_num1 + 1).toString();
        this._lab_now.string = (t_num1 + 2).toString();
        this._lab_next1.string = (t_num1 + 3).toString();
        this._lab_next2.string = (t_num1 + 4).toString();
        let t_num3 = Data.game_level.num % 5;
        this._pro_lev.progress = (t_num3 - 1) / 4;
    }

    /**
     * 加载龙骨
     */
    loadeDrag() {
        let fun = () => {
            this._drag_player.armatureName = "armatureName";
            this._drag_player.playAnimation("run", 0);
        }
        let num = (Data.warehouse[201].SKIN.now + 1);
        if (Data.warehouse[201].SKIN.trial) {
            num = Data.warehouse[201].SKIN.trial;
        }
        let path = "Sprite/DragonBones/player" + num
        Apply.loadDragonBones(this._drag_player, "Start", path, fun);
    }

    onEnable() {
        if (this._lab_now) {
            this.refreshlevel();
            AudioMgr.stopMusic();
            this.loadeDrag();
            AudioMgr.playMusic(BgmType.kMenu);
        }
    }

    shop = false;
    exprot() {
        // Export.instance.showBanner(1);
    }



    /** 
     * 一些UI初始化 
     */
    protected _initUI() {
        let fun = (arr) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name == "coin") {
                    this.rich.coin = arr[i];
                }
                if (arr[i].name == "diam") {
                    this.rich.diam = arr[i];
                }
                if (arr[i].name == "coinD") {
                    this.rich.coinD = arr[i];
                }
                if (arr[i].name == "diamD") {
                    this.rich.diamD = arr[i];
                }
            }
        }
        Apply.loadDras("Start", "Sprite/Apply", fun);
    }

    /** 
     * 初始化事件 
     */
    protected _initEvent() {
        this._attri.getChildByName("attk").on(cc.Node.EventType.TOUCH_START, () => {

            if (Data.player_level_up(2)) {
                this.initAttri()
            } else {
                this.clickBtnCoin()
            }
            AudioMgr.playEffect(SfxType.kclick);

        })
        this._attri.getChildByName("hp").on(cc.Node.EventType.TOUCH_START, () => {
            if (Data.player_level_up(1)) {
                this.initAttri()
            } else {
                this.clickBtnCoin()
            }
            AudioMgr.playEffect(SfxType.kclick);
        })
        this._attri.getChildByName("def").on(cc.Node.EventType.TOUCH_START, () => {

            if (Data.player_level_up(3)) {
                this.initAttri()
            } else {
                this.clickBtnCoin()
            }
            AudioMgr.playEffect(SfxType.kclick);
        })
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }

    /**
     * 刷新属性的数据
     */
    initAttri() {
        let lel_data = Data.warehouse[201].data;
        let fun = (node, data) => {
            node.getChildByName("num").getComponent(cc.Label).string = "LV." + data.LV;
            node.getChildByName("coin").getComponent(cc.Label).string = lel_data[data.LV].cofe;
        }
        fun(this._attri.getChildByName("attk"), Data.warehouse[201].ATTK);
        fun(this._attri.getChildByName("hp"), Data.warehouse[201].HP);
        fun(this._attri.getChildByName("def"), Data.warehouse[201].DEF);
    }

    /**
     * 刷新仓库的财富
     */
    init_Rich() {
        this._lab_coin.string = Data.warehouse[101].toString();
        this._lab_diam.string = Data.warehouse[102].toString();
    }
    /**
     * 打开游戏画板
     */
    clickBtnStart() {
        AudioMgr.playEffect(SfxType.kclick);
        for (let i = 0; i < Data.warehouse[201].SKIN.skin.length; i++) {
            if (!Data.warehouse[201].SKIN.skin[i].is_get) {
                lw.viewMgr.open(Game_inter.Trial, i + 1);
                return;
            }
        }
        lw.viewMgr.open(Game_inter.Draw);
        Export.instance.hideBanner();
    }

    /**
     * 打开游戏商店
     */
    clickBtnShop() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.open(Game_inter.Shop);
    }

    /**
     * 打开财富界面
     */
    clickBtnDiam() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.open(Game_inter.Rich, "diam");
    }

    /**
     * 打开财富界面
     */
    clickBtnEgg() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.open(Game_inter.Egg);
    }

    /**
    * 打开设置界面
    */
    clickBtnSet() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.open(Game_inter.Set);
    }

    /**
     * 打开财富界面
     */
    clickBtnCoin() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.open(Game_inter.Rich);
    }
}
