
import Apply from "../Apply/Apply";
import Export from "../Export/Export";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Game from "../Game/Game";
import Player from "../Game/script/player";
import Main from "../Main/Main";
import Start from "../Start/Start";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

const BuffType = [
    {
        type: 1,
        name: "增加最大生命值"
    },
    {
        type: 2,
        name: "恢复生命值"
    },
    {
        type: 3,
        name: "增加攻击力"
    },
    {
        type: 4,
        name: "额外一条生命"
    },
    {
        type: 5,
        name: "增加防御力"
    },
    {
        type: 6,
        name: "召唤陨石"
    },
    {
        type: 7,
        name: "拥有额外的护盾"
    },
]

@ccclass
export default class Buff extends lw.BaseView {


    public static instance: Buff = null;
    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Node")
    private _buff: cc.Node = null;
    @metadata("cc.Button")
    private _btn_allGet: cc.Button = null;
    @metadata("cc.Button")
    private _btn_chance: cc.Button = null;
    @metadata("cc.Node")
    private _getBuff: cc.Node = null;
    @metadata("cc.Button")
    private _btn_getBuff: cc.Button = null;
    @metadata("cc.Button")
    private _btn_douBuff: cc.Button = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super()
        this.LayerOrder = ViewZOrder.Buff;
    }

    buffnode = [];
    buffspr = null;
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        Buff.instance = this;
        this.buffnode = this._buff.getChildByName("buff").children;
        let fun = (arr) => {
            this.buffspr = [];
            this.buffspr[0] = null;
            for (let i = 0; i < arr.length; i++) {
                this.buffspr[arr[i].name] = arr[i];
            }
            this.initBuff();
        }
        this._buff.active = true;
        this._getBuff.active = false;
        Apply.loadDras("Buff", "Sprite/buffspr", fun);
        this.getBuffarr = [];
        for (let i = 0; i < this._getBuff.getChildByName("buff").children.length; i++) {
            let node = this._getBuff.getChildByName("buff").children[i]
            this.getBuffarr[i] = node;
        }
    }

    /**
     * 
     */
    onEnable() {
        if (this.buffspr) {
            this.initBuff();
            this._buff.active = true;
            this._getBuff.active = false;
        }
    }



    /**
     * 初始化buff
     */
    initBuff() {
        let arr = [];
        for (let i = 0; i < 3; i++) {
            let bool = true;
            let t_num = arr[i];
            while (bool) {
                bool = false;
                t_num = Apply.randRange(0, BuffType.length - 1);
                for (let j = 0; j < arr.length; j++) {
                    if (arr[j] == t_num) {
                        bool = true;
                    }
                }
                if (!bool) {
                    arr.push(t_num);
                }
            }

            this.buffnode[i].getChildByName("spr").getComponent(cc.Sprite).spriteFrame = this.buffspr[BuffType[t_num].type];
            this.buffnode[i].getChildByName("lab").getComponent(cc.Label).string = BuffType[t_num].name;
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
        for (let i = 0; i < 3; i++) {
            this.buffnode[i].on(cc.Node.EventType.TOUCH_END, () => {
                this._buff.active = false;
                this._getBuff.active = true;
                this.buffArr.push(this.buffnode[i]);
                this.initGetBuff();
            })
        }
    }
    buffArr = [];
    getBuffarr = null;
    /**
     * 渲染得到buff界面的函数
     */
    initGetBuff() {
        for (let i = 0; i < 3; i++) {
            if (i < this.buffArr.length) {
                let buff = this.getBuffarr[i];
                let spr = this.buffArr[i].getChildByName("spr").getComponent(cc.Sprite).spriteFrame;
                let lab = this.buffArr[i].getChildByName("lab").getComponent(cc.Label).string;
                buff.getChildByName("spr").getComponent(cc.Sprite).spriteFrame = spr;
                buff.getChildByName("lab").getComponent(cc.Label).string = lab;
            } else {
                this.getBuffarr[i].parent = null;
            }
        }
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }

    /**
     * 全部都要的的函数
     */
    clickBtnAllGet() {
        let fun = () => {
            this._buff.active = false;
            this._getBuff.active = true;
            for (let i = 0; i < 3; i++) {
                this.buffArr.push(this.buffnode[i]);
            }
            this.initGetBuff();
        }
        Export.instance.wacth_video(fun);
    }

    /**
     * 换一批的的函数
     */
    clickBtnChance() {
        let fun = () => {
            this.initBuff();
        }
        Export.instance.wacth_video(fun);
    }


    noNode = [];

    onDisable() {
        for (let i = 0; i < this.getBuffarr.length; i++) {
            this.getBuffarr[i].parent = this._getBuff.getChildByName("buff");
        }
    }

    /**
     * 得到buff的的函数
     */
    clickBtnGetBuff() {
        let node = this._getBuff.getChildByName("buff");
        for (let i = 0; i < node.children.length; i++) {
            let buff = node.children[i];
            let spr = buff.getChildByName("spr").getComponent(cc.Sprite).spriteFrame;
            Player.instance.getBuff(spr.name);
        }
        this.closNode()
    }



    /**
    * 得到双倍buff的的函数
    */
    clickBtnDouBuff() {
        let fun = () => {
            let node = this._getBuff.getChildByName("buff");
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < node.children.length; i++) {
                    let buff = node.children[i];
                    let spr = buff.getChildByName("spr").getComponent(cc.Sprite).spriteFrame;
                    Player.instance.getBuff(spr.name);
                }
            }
            this.closNode()
        }
        Export.instance.wacth_video(fun);
    }

    closNode() {
        this.buffArr = [];
        this.node.active = false;
        Game.instance.creatMonster();
    }
}
