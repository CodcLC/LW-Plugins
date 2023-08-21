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
import PoolMgr from "../Apply/PoolMgr";
import Draw from "../Draw/Draw";
import Export from "../Export/Export";
import Player from "./script/player";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Game extends lw.BaseView {

    public static instance: Game = null;
    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Node")
    private _UICamera: cc.Node = null;
    @metadata("cc.Sprite")
    private _sp_bg1: cc.Sprite = null;
    @metadata("cc.Sprite")
    private _sp_bg2: cc.Sprite = null;
    @metadata("cc.Sprite")
    private _sp_bg3: cc.Sprite = null;
    @metadata("cc.Node")
    private _rode: cc.Node = null;
    @metadata("cc.Node")
    private _player: cc.Node = null;
    @metadata("cc.Node")
    private _monster: cc.Node = null;
    @metadata("cc.Button")
    private _btn_attack: cc.Button = null;
    @metadata("cc.Button")
    private _btn_skill: cc.Button = null;
    @metadata("cc.Sprite")
    private _sp_cool: cc.Sprite = null;
    @metadata("cc.Button")
    private _btn_set: cc.Button = null;
    @metadata("cc.Label")
    private _lab_lenum: cc.Label = null;
    @metadata("cc.Label")
    private _lab_monNum: cc.Label = null;
    @metadata("cc.Node")
    private _tipy: cc.Node = null;
    @metadata("cc.Node")
    private _tipz: cc.Node = null;
    @metadata("cc.Node")
    private _start: cc.Node = null;
    @metadata("cc.Node")
    private _Boss: cc.Node = null;
    @metadata("cc.Node")
    private _doubleHit: cc.Node = null;
    @metadata("cc.Label")
    private _lab_hit_num: cc.Label = null;
    @metadata("cc.Node")
    private _set_inter: cc.Node = null;
    @metadata("cc.Button")
    private _btn_agin: cc.Button = null;
    @metadata("cc.Button")
    private _btn_back: cc.Button = null;
    @metadata("cc.Button")
    private _btn_conti: cc.Button = null;
    @metadata("cc.Node")
    private _revive: cc.Node = null;
    @metadata("cc.Animation")
    private _ani_num: cc.Animation = null;
    @metadata("cc.Button")
    private _btn_revive: cc.Button = null;
    @metadata("cc.Button")
    private _btn_reviveno: cc.Button = null;
    //--Auto export attr, Don't change end--

    settAbv = 0;
    /**
     * 游戏结束
     */
    GameOver = false;

    /**
     * 游戏暂停
     */
    GameStop = false;

    /**
     * 游戏的进度
     */
    GameRank = 1;

    GameSpeed = 1;

    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        Game.instance = this;
        this._sp_cool.fillRange = 0;
        this.GameRank = 1;
        this.loadMonster();
        this.initBg();
        this._start.active = true;
        cc.tween(this._start)
            .to(0.5, { scaleX: 1.2, scaleY: 1.2 })
            .to(0.1, { scaleY: 0 })
            .call(() => {
                this._start.active = false;
            })
            .start();
        AudioMgr.stopMusic();
        AudioMgr.playMusic(BgmType.kMenu);
        Plat.startGameRecord();
        //lw.viewMgr.open(Game_inter.Sett, true);
    }



    /**
     *  加载背景和地面
     */
    initBg() {
        let path = "Sprite/GameUi/back_" + Data.game_level.json[Data.game_level.num - 1].level_bg;
        Apply.loadDras("Game", path, (arr) => {
            let fun = (str) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    if (arr[idx].name == str) {
                        return arr[idx];
                    }
                }
            }
            this._sp_bg1.spriteFrame = fun("res_1");
            this._sp_bg2.spriteFrame = fun("res_2");
            this._sp_bg3.spriteFrame = fun("res_1");
            this._rode.getComponent(cc.Sprite).spriteFrame = fun("rode");
        })
    }
    /**
     * 怪物的预制件
     */
    monsterPool = null;

    /**
     * 伤害的字体的预制件的对象池
     */
    hitLabPool = null;


    bullPool = null

    M_bullPool = null
    /**
     * 加载预制件
     */
    loadMonster() {
        let fun = (path, fun) => {
            let path1 = "Sprite/prefab/" + path
            cc.assetManager.getBundle('Game').load(path1, cc.Prefab, (err, assets) => {
                if (err) {
                } else {
                    fun(assets);
                }
            })
        }
        fun("monster", (assets) => {
            this.monsterPool = new PoolMgr(assets, 15);
            this.creatMonster();
        })
        fun("hitLab", (assets) => {
            this.hitLabPool = new PoolMgr(assets, 50);
        })

        fun("PL_Bullet", (assets) => {
            this.bullPool = new PoolMgr(assets, 20);
        })

        fun("M_Bullet", (assets) => {
            this.M_bullPool = new PoolMgr(assets, 20);
        })

    }


    /**
     * 伤害字体的出现
     * @param node 
     * @param num 
     */
    hitLabinit(node, num) {
        let lab = this.hitLabPool.get();
        lab.parent = node;
        lab.getComponent(cc.Label).string = Math.floor(num).toString();
        lab.x = 0;
        lab.y = 180;
        lab.scaleX = 1;
        lab.scaleY = 1;
        let fun = cc.callFunc(() => {
            lab.parent = null;
            this.hitLabPool.put(lab);
        })
        lab.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5, 0, 260), cc.scaleTo(0.5, 0)), fun))
    }

    monsterArr = [];
    diyMonsterArr = [];
    /**
     * 创建怪物
     */
    creatMonster() {
        this._lab_lenum.string = this.GameRank.toString() + "/" + Data.game_level.json[Data.game_level.num - 1].level_num.toString();
        let data = Data.game_level.json[Data.game_level.num - 1].level_json[this.GameRank - 1];
        Player.instance.initBuff(data);
        this.monsterArr = [];
        this.diyMonsterArr = [];
        let tM_num = 0;
        let fun = (num, idx) => {
            for (let i = 0; i < num; i++) {
                let t_monster = this.monsterPool.get();
                t_monster.getComponent("monster").init(idx);
                let _ran = Apply.randRange(1, 10);
                let t_x = this._rode.width / 2 - 100;
                if (_ran > 5) {
                    t_x = t_x * -1;
                } else {
                }
                t_monster.x = t_x;
                t_monster.y = this.minY;
                this.monsterArr.push(t_monster);
                this.scheduleOnce(() => {
                    t_monster.active = true;
                    this._monster.addChild(t_monster);
                }, tM_num);

                tM_num++;
            }
            this._lab_monNum.string = "剩余敌人:    " + tM_num;
        }
        fun(data.sm_mons1, "sm_mons1");
        fun(data.sm_mons2, "sm_mons2");
        fun(data.sm_mons3, "sm_mons3");
        fun(data.boos1, "boos1");
        fun(data.boos2, "boos2");
    }



    /**
     * 创建主角飞弹
     */
    creatBullet(sca) {

        let bull = this.bullPool.get();
        bull.active = true;
        bull.x = Player.instance.node.x;
        bull.y = Player.instance.node.y + 130;
        bull.getComponent("P_bull").init(sca);
        bull.parent = this._player.parent;

    }


    /**
     * 创建怪物的飞弹
     */

    creatMBullet(str, sca, num, pos) {
        let bull = this.M_bullPool.get();
        bull.active = true;
        bull.x = pos.x;
        bull.y = pos.y;
        bull.getComponent("M_bull").init(str, sca, num);
        bull.parent = this._player.parent;
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {
        let fun = (node: cc.Node) => {
            cc.tween(node)
                .repeatForever(
                    cc.tween().to(0.3, { opacity: 0 })
                        .to(0.3, { opacity: 255 })
                )
                .start();
        }
        fun(this._tipz);
        fun(this._tipy);

    }

    /** 
     * 初始化事件 
     */
    protected _initEvent() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                Player.instance.dire = -1;
                break;
            case cc.macro.KEY.d:
                Player.instance.dire = 1;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                Player.instance.stopMove();
                break;
            case cc.macro.KEY.d:
                Player.instance.stopMove();
                break;
        }
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        Draw.instance.dragBack();
    }

    /**
     * 得到龙骨的组件
     */
    get getDrag() {

        return null//this._drag_drag;
    }

    /**
     * 得到地块的组件
     */
    get sprRode() {
        return this._rode;
    }

    /**
     * 得到地块的组件的最低点
     */
    get minY() {
        return this._rode.y;
    }


    hitNum = 0;
    hitTime = 0;
    /**
     * 击打次数
     */
    double_Hit() {
        this._doubleHit.active = true;
        this.hitNum++;
        this.hitTime = 2;
        this._lab_hit_num.string = this.hitNum.toString();
        cc.tween(this._doubleHit)
            .to(0, { scaleX: 0, scaleY: 0 })
            .to(0.2, { scaleX: 1.2, scaleY: 1.2 })
            .to(0.1, { scaleX: 1, scaleY: 1 })
            .start();
    }

    /**
     * Boss来袭
     */
    Boss_com() {
        this._Boss.active = true;
        cc.tween(this._Boss)
            .repeat(5,
                cc.tween().to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: 255 })
            ).call(() => {
                this._Boss.active = false
            })
            .start();
    }

    /**
     * 攻击的函数
     */
    clickBtnAttack() {
        Player.instance.attackFun()
    }

    cool_state = true;
    cool_time = 1;
    /**
     * 技能的函数
     */
    clickBtnSkill() {
        if (this.cool_state) {
            this.cNowtime = 0;
            this.cool_state = false;
            Player.instance.skillFun();
        }
    }

    /**
     * 暂停按钮
     */
    clickBtnSet() {
        AudioMgr.playEffect(SfxType.kclick);
        this.GameStop = true;
        this._set_inter.active = true;
    }

    /**
     * 重玩
     */
    clickBtnAgin() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.close(Game_inter.Game);
        lw.viewMgr.open(Game_inter.Start);
    }

    /**
     * 返回
     */
    clickBtnBack() {
        AudioMgr.playEffect(SfxType.kclick);
        lw.viewMgr.close(Game_inter.Game);
        lw.viewMgr.open(Game_inter.Start);

    }

    /**
     * 继续
     */
    clickBtnConti() {
        AudioMgr.playEffect(SfxType.kclick);
        this.GameStop = false;
        this._set_inter.active = false;
    }


    /***
     * 检测是否打开buff界面
     */
    isGameover() {
        this._lab_monNum.string = "剩余敌人:    " + (Game.instance.monsterArr.length - Game.instance.diyMonsterArr.length);
        if (Game.instance.monsterArr.length == Game.instance.diyMonsterArr.length) {
            Game.instance.GameRank++;
            if (Data.game_level.json[Data.game_level.num - 1].level_json.length >= Game.instance.GameRank) {
                lw.viewMgr.open(Game_inter.Buff);
            } else {
                lw.viewMgr.open(Game_inter.Video);
                Game.instance.GameOver = true;
            }
        }
    }

    /**
     * 显示复活界面
     */
    reviInter() {
        this.GameStop = true;
        this._ani_num.stop()
        this._ani_num.play();
        this._revive.active = true;
    }
    /**
     * 复活不用
     */
    clickBtnReviveno() {
        if (this._revive.active) {
            this.reviveSucc(false);
        }
    }

    /**
     * 复活
     */
    clickBtnRevive() {
        AudioMgr.playEffect(SfxType.kclick);
        let fun = () => {
            this.reviveSucc(true);
        }
        Export.instance.wacth_video(fun);
    }

    /**
     * 复活成功
     */
    reviveSucc(bool) {
        if (bool) {
            this.GameStop = false;
            this.GameOver = false;
            this._revive.active = false;
            Player.instance.reviveSucc();
        } else {
            this._revive.active = false;
            Plat.stopGameRecord();
            lw.viewMgr.open(Game_inter.Sett, false);
        }
    }



    /**
     * 游戏是否停止
     *  
     */
    isStop() {
        let bool = false;
        if (this.GameOver || this.GameStop) {
            bool = true;
        }
        return bool;
    }

    cNowtime = 0;
    update(dt) {

        if (this.isStop()) {
            return;
        }
        if (this.hitTime > 0) {
            this.hitTime -= dt;
            if (this.hitTime <= 0) {
                this._doubleHit.active = false;
                this.hitNum = 0;
            }
        }

        this._tipz.active = false;
        this._tipy.active = false;
        for (let i = 0; i < this.monsterArr.length; i++) {
            if (this.monsterArr[i].active) {
                let min_x = this._UICamera.x - cc.winSize.width / 2 - 30;
                let max_x = this._UICamera.x + cc.winSize.width / 2 + 30;
                if (this.monsterArr[i].x < min_x) {
                    this._tipz.active = true;
                } else {
                    if (this.monsterArr[i].x > max_x) {
                        this._tipy.active = true;
                    }
                }
            }
        }

        if (!this.cool_state) {
            this.cNowtime += dt;
            if (this.cNowtime >= this.cool_time) {
                this.cool_state = true;
                this._sp_cool.fillRange = 0;
            }
            this._sp_cool.fillRange = 1 - (this.cNowtime / this.cool_time);
        }
        let cam_max = this._rode.width / 2 - cc.winSize.width / 2;
        if (Player.instance.node.x < cam_max && Player.instance.node.x > -cam_max) {
            this._UICamera.x = Player.instance.node.x;
        }

    }
}
