/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Data, { Game_inter } from "../Apply/Data";
import Export from "../Export/Export";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Start from "../Start/Start";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Shop extends lw.BaseView {

    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    @metadata("cc.Button")
    private _btn_buy: cc.Button = null;
    @metadata("cc.Sprite")
    private _sp_rich: cc.Sprite = null;
    @metadata("cc.Label")
    private _lab_buy: cc.Label = null;
    @metadata("cc.Node")
    private _player: cc.Node = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super()
        this.LayerOrder = ViewZOrder.Shop;
    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        for (let i = 0; i < this._player.children.length; i++) {
            let drag = this._player.children[i].getChildByName("drag").getComponent(dragonBones.ArmatureDisplay);
            this.loadMonster(i + 1, drag);
        }
        this._lab_buy.node.parent.active = false;
        Export.instance.showBanner();
        Start.instance.shop = true;
    }

    /**
     * 加载游戏
     */
    loadMonster(num, animationDisplay) {
        let path = "Sprite/DragonBones/player" + num;
        cc.assetManager.getBundle('Start').loadDir(path, (err, assets) => {
            if (err || assets.length <= 0) return;
            assets.forEach(asset => {
                if (asset instanceof dragonBones.DragonBonesAsset) {
                    animationDisplay.dragonAsset = asset;
                }
                if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
                    animationDisplay.dragonAtlasAsset = asset;
                }
                animationDisplay.armatureName = "armatureName";
                animationDisplay.playAnimation("run", 0);
            });
        })
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
        for (let i = 0; i < this._player.children.length; i++) {
            let drag = this._player.children[i]
            drag.on(cc.Node.EventType.TOUCH_END, () => {
                this._player.children[0].scaleX = 1;
                this._player.children[0].scaleY = 1;

                this._player.children[1].scaleX = 1;
                this._player.children[1].scaleY = 1;

                this._player.children[2].scaleX = 1;
                this._player.children[2].scaleY = 1;
                drag.scaleX = 1.1;
                drag.scaleY = 1.1;
                this.initBuy(i);
            })
        }
    }
    buyNum = null;
    /**
     * 
     * @param num 购买
     */
    initBuy(num) {
        if (!Data.warehouse[201].SKIN.skin[num].is_get) {
            this.buyNum = num;
            this._lab_buy.node.parent.active = true;
            this._lab_buy.string = Data.warehouse[201].SKIN.skin[num].price;
            if (Data.warehouse[201].SKIN.skin[num].type == 1) {
                this._sp_rich.spriteFrame = Start.instance.rich.coin;
            } else {
                this._sp_rich.spriteFrame = Start.instance.rich.diam;
            }
            // 
        } else {
            this.buyNum = null;
            this._lab_buy.node.parent.active = false;
            Data.warehouse[201].SKIN.now = num;
            Start.instance.loadeDrag();
        }
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }

    clickBtnClose() {
        Export.instance.hideBanner();
        this.node.active = false;
        Start.instance.shop = false;
    }

    clickBtnBuy() {
        if (this.buyNum) {
            let rich = 0;
            let str = "coin";
            let idx = 101;
            if (Data.warehouse[201].SKIN.skin[this.buyNum].type == 1) {
                rich = Data.warehouse[101];
            } else {
                rich = Data.warehouse[102];
                idx = 102;
                str = "diam";
            }
            let bnum = Data.warehouse[201].SKIN.skin[this.buyNum].price
            if (bnum <= rich) {
                Data.warehouse[201].SKIN.skin[this.buyNum].is_get = true;
                Data.ware_change(idx, -bnum);
                this.initBuy(this.buyNum);
            } else {
                lw.viewMgr.open(Game_inter.Rich, str);
            }
        }
    }
}
