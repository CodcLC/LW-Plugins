/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Apply from "../Apply/Apply";
import AudioMgr, { SfxType } from "../Apply/audio_mgr";
import Data, { Game_inter } from "../Apply/Data";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Start from "../Start/Start";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Draw extends lw.BaseView {

    public static instance: Draw = null;
    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Node")
    private _draw1: cc.Node = null;
    @metadata("cc.Node")
    private _drag: cc.Node = null;
    @metadata("cc.Graphics")
    private _grap_graph: cc.Graphics = null;
    @metadata("cc.Node")
    private _energy: cc.Node = null;
    @metadata("cc.Label")
    private _lab_ene: cc.Label = null;
    @metadata("cc.Node")
    private _draw: cc.Node = null;
    @metadata("cc.Graphics")
    private _grap_draw: cc.Graphics = null;
    @metadata("cc.Button")
    private _btn_clear: cc.Button = null;
    @metadata("cc.Button")
    private _btn_close: cc.Button = null;
    @metadata("cc.Button")
    private _btn_start: cc.Button = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super();
        this.LayerOrder = ViewZOrder.Draw;
    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        Draw.instance = this;
        this.initPro();
        this.loadeDrag();
    }



    loadeDrag() {
        let Drag = this._drag.getComponent(dragonBones.ArmatureDisplay);
        let fun = () => {
            Drag.armatureName = "armatureName";
            Drag.playAnimation("run", 0);
        }
        let num = (Data.warehouse[201].SKIN.now + 1);
        if (Data.warehouse[201].SKIN.trial) {
            num = Data.warehouse[201].SKIN.trial;
        }
        let path = "Sprite/DragonBones/player" + num;
        Apply.loadDragonBones(Drag, "Start", path, fun);
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {
        // TODO
    }

    get dragFun() {
        return this._drag;
    }

    /**
     * 墨水
     */
    ink_max = 150;
    ink_num = 0;
    draw_pint = [];
    /** 
      * 初始化事件 
      */
    protected _initEvent() {
        let aft_pos = cc.v2(0, 0);
        this._draw.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (this.ink_num <= 0) {
                return;
            }
            let pos = cc.v2(event.getLocation().x, event.getLocation().y);
            let pos1 = Apply.worldConvertLocalPointAR(this._draw, pos);
            this._grap_draw.moveTo(pos1.x, pos1.y);
            this._grap_graph.moveTo(pos1.x, pos1.y);
            aft_pos.x = pos1.x;
            aft_pos.y = pos1.y;
            this.draw_pint.push(aft_pos);
        });

        this._draw.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (this.ink_num <= 0) {
                return;
            }
            let pos = cc.v2(event.getLocation().x, event.getLocation().y);
            let pos1 = Apply.worldConvertLocalPointAR(this._draw, pos);
            let bool = true;
            if (pos1.x > -this._draw.width / 2 && pos1.x < this._draw.width / 2) {
                aft_pos.x = pos1.x;
                bool = false;
            }

            if (pos1.y > -this._draw.height / 2 && pos1.y < this._draw.height / 2) {
                aft_pos.y = pos1.y;
                bool = false;
            }
            if (bool) {
                return;
            }
            this.ink_num -= 1;
            this._energy.height = this._energy.parent.height * this.ink_num / this.ink_max;
            this._lab_ene.string = Math.floor(this.ink_num / this.ink_max * 100).toString() + "%";
            if ((this.ink_num / this.ink_max) < 0.7) {
                this._btn_start.interactable = true;
            }
            this._grap_draw.lineTo(aft_pos.x, aft_pos.y);
            this._grap_graph.lineTo(aft_pos.x, aft_pos.y);
            this._grap_draw.stroke();
            this._grap_graph.stroke();
            this.draw_pint.push(aft_pos);
        });

        this._btn_start.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (this._btn_start.interactable) {
                Start.instance.node.active = false;
                this.node.active = false;
                lw.viewMgr.open(Game_inter.Game);
            }
        })
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }
    onEnable() {
        
        if (this._energy) {
           
            this.initPro();
            this._grap_draw.clear();
            this._grap_graph.clear();
            this._btn_start.interactable = false;
            this.loadeDrag();
        }
    }
    clickBtnClear() {
        AudioMgr.playEffect(SfxType.kclick);
        this._grap_draw.clear();
        this._grap_graph.clear();
        this.initPro();
    }

    clickBtnClose() {
        AudioMgr.playEffect(SfxType.kclick);
        this.node.active = false;
    }

    /**
     * 把龙骨节点的父节点重置一下
     */
    dragBack() {
        this._drag.parent = this._draw1;
        this._drag.scaleX = 1;
        this._drag.scaleY = 1;
    }

    /**
     * 初始化画板
     */
    initPro() {
        this._btn_start.interactable = false;
        this.ink_num = this.ink_max;
        this._energy.height = this._energy.parent.height * this.ink_num / this.ink_max;
        this._lab_ene.string = Math.floor(this.ink_num / this.ink_max * 100).toString() + "%";
    }



}
