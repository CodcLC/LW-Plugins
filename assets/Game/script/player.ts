import Apply from "../../Apply/Apply";
import AudioMgr, { SfxType } from "../../Apply/audio_mgr";
import Data from "../../Apply/Data";
import PoolMgr from "../../Apply/PoolMgr";
import Draw from "../../Draw/Draw";
import Game from "../Game";
import Attk from "./Attk";

//1是跑 2 是跳 3是待机 4受伤 5死亡  6是攻击1 7 是攻击2 8是攻击3 9是技能
const play_action = [0, "run", "jump", "idle", "hit", "death", "attack1", "attack2", "attack3", "skill"]

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    public static instance: Player = null;

    @property({
        displayName: "矩形框",
        tooltip: '自身的碰撞约束框'
    })
    Rect: cc.Rect = new cc.Rect(0, 0, 0, 0);

    @property(cc.ProgressBar)
    HPpro: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    DEFpro: cc.ProgressBar = null;

    @property(dragonBones.ArmatureDisplay)
    Effe: dragonBones.ArmatureDisplay = null;

    @property(dragonBones.ArmatureDisplay)
    hit: dragonBones.ArmatureDisplay = null;

    @property(dragonBones.ArmatureDisplay)
    buff: dragonBones.ArmatureDisplay = null;

    metaPool = null;
    @property(cc.Prefab)
    metaPre: cc.Prefab = null;

    jump_max = 20;              //人物跳跃的力量
    jump_num = 1;               //人物跳跃的次数
    jump_speed = 0;             //人物跑的速度
    gravity_max = 1;                //重力的大小
    gravity = 1;                //重力的大小
    run_speed = 5;              //人物跑的时候的前进速度

    dire = 0;                 //人物的方向 0是不动 1是前进   -1是后退

    _attr = {
        max_HP: 0,
        HP: 100,
        ATTK_MIN: 100,
        ATTK_MAX: 100,
        DEF: 100,
        BUFF: [],
    }

    revive_num = 0;

    /**
     * 龙骨的组件
     */
    Dragon = null;

    /**
     * 龙骨操控的节点
     */
    dragNode = null;

    onLoad() {
        Player.instance = this;
        let drag = Draw.instance.dragFun;
        this.dragNode = this.node.getChildByName("drag").getChildByName("drag");
        drag.parent = this.dragNode;
        drag.zIndex = this.dragNode.getChildByName("effe").zIndex - 1;
        drag.scaleX = 0.5;
        drag.scaleY = 0.5;
        this.Dragon = drag.getComponent(dragonBones.ArmatureDisplay);
        this.playdragon(3, 0);
        this.attInit();

        this.metaPool = new PoolMgr(this.metaPre, 10);
    }

    /**
     * 初始化人物的属性
     */
    attInit() {
        let data = Data.warehouse[201];
        this._attr.HP = data.HP.num;
        this._attr.max_HP = data.HP.num;
        this._attr.ATTK_MIN = data.ATTK.num_min;
        this._attr.ATTK_MAX = data.ATTK.num_max;
        this._attr.DEF = data.DEF.num;
        this.Dragon.off(dragonBones.EventObject.COMPLETE)
        this.Dragon.on(dragonBones.EventObject.COMPLETE, () => {
            if (this.nowPlActive == play_action[6] || this.nowPlActive == play_action[7] ||
                this.nowPlActive == play_action[8] || this.nowPlActive == play_action[9]) {
                this.atta_state = false;
                this.attack_num = 1;
            } else if (this.nowPlActive == play_action[4]) {
                this.atta_state = false;
                this.attack_num = 1;
            } else if (this.nowPlActive == play_action[9]) {
                this.atta_state = false;
            }
            if (Game.instance.isStop()) {
                return;
            }

            if (this.dire != 0) {
                this.playdragon(1, 0);
            } else {
                this.playdragon(3, 0);
            }

        });
        this.Dragon.removeEventListener(dragonBones.EventObject.FRAME_EVENT)
        this.Dragon.addEventListener(dragonBones.EventObject.FRAME_EVENT, (event) => {
            if (event.name == "attk1") {
                this.displayEffec(1);
            } else if (event.name == "attk2") {
                this.displayEffec(2);
            } else if (event.name == "attk3") {
                this.displayEffec(3);
            } else if (event.name == "skill") {
                Game.instance.creatBullet(this.dragNode.scaleX);
            }
        });
        this.HPpro.progress = 1;
        this.HPpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.ceil(this._attr.HP).toString();
        this.DEFpro.node.active = false;
        this.buff.node.active = false;
    }

    start() {
        //this.Dragon = Game.instance.drag_drag;
    }

    nowPlActive = null;
    /**
     * //1是跑 2 是跳 3是待机 4受伤 5死亡  6是攻击1 7 是攻击2 8是攻击3 9是技能
     * @param num 
     * @param lun 
     * @param completeCallback 
     */
    playdragon(num, lun, completeCallback = null) {
        let animName = play_action[num];

        if (this.Dragon.animationName != animName) {


            if (this.atta_state) {
                if (animName == play_action[1] || animName == play_action[2] || animName == play_action[3]) {
                    return;
                }
            }
            this.Dragon.animationName = animName;
            if (animName == play_action[1]) {
                lun = 0;
            }
            // if (num == 6) {
            //     this.displayEffec(1);
            // } else if (num == 7) {
            //     this.displayEffec(2);
            // } else if (num == 8) {
            //     this.displayEffec(3);
            // } else 
            if (num == 9) {
                this.displayEffec(4);
            }
            this.Dragon.playAnimation(animName, lun);
            this.nowPlActive = animName;
            let fun = () => {
                if (completeCallback) {
                    completeCallback();
                }
            }
            this.Dragon.once(dragonBones.EventObject.COMPLETE, fun);
        }
    }

    hitState = false;
    hitTIme = 0;
    /**
     * 被打的函数  
     * @param hitNum 被打的数值  这个是掺进来的数值 不是最终伤害
     */
    hit_(hitNum) {
        this.atta_state = false;
        this.attack_num = 1;

        let hit_num = hitNum - this._attr.DEF;
        if (hit_num <= 0) {
            hit_num = 1;
        }
        this.plHP(-hit_num);

        if (Game.instance.isStop()) {
            return
        }
        this.hit.playAnimation("hit", 1);
        this.hitState = true;
        this.hitTIme = 0.5;
        this.playdragon(4, 1);
    }


    invin = false;//无敌
    /**
     * 人物生命值发生变化的函数
     * @param num 
     */
    plHP(num) {
        if (this.DEF_num > 0 && num < 0) {
            this.DEF_num += num;
            this.DEFpro.progress = this.DEF_num / this.DEFMAX_num;
            this.DEFpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.floor(this.DEF_num).toString();
            if (this.DEF_num <= 0) {
                this.DEFpro.node.active = false;
                this.buff.node.active = false;
                this._attr.HP += this.DEF_num;
            }
        } else {
            this._attr.HP += num;
        }
        if (num < 0) {
            AudioMgr.playEffect(SfxType.khit);
        }
        if (this._attr.HP <= 0) {
            this._attr.HP = 0;
            if (this.revive_num > 0) {
                this.reviveSucc();
                this.revive_num = 0;
            } else {
                Game.instance.GameOver = true;
                this.playdragon(5, 1, () => {
                    Game.instance.reviInter();
                })
            }
        }

        if (this._attr.HP >= this._attr.max_HP) {
            this._attr.HP = this._attr.max_HP;
        }
        Game.instance.hitLabinit(this.node, num);
        this.HPpro.progress = this._attr.HP / this._attr.max_HP;
        this.HPpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.ceil(this._attr.HP).toString();
    }

    /**
     * 复活
     */
    reviveSucc() {
        this._attr.HP = this._attr.max_HP;
        this.invin = true;
        this.dragNode.opacity = 150;
        this.scheduleOnce(() => {
            this.invin = false;
            this.dragNode.opacity = 255;
        }, 2);
        this.HPpro.progress = this._attr.HP / this._attr.max_HP;
        this.HPpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.ceil(this._attr.HP).toString();
        this.playdragon(3, 0);
    }


    DEF_num = 0;
    DEFMAX_num = 0;
    /**
    * 人物护盾发生变化的函数
    * @param num 
    */
    plDEF(num) {
        this.DEFpro.node.active = true;
        // this.buff.node.active = true;
        // this.buff.playAnimation("hudun", 0);
        this.DEF_num = num;
        this.DEFMAX_num = num;
        this.DEFpro.progress = 1;
        this.DEFpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.ceil(this.DEF_num).toString();
    }

    /**
     * 人物普通攻击的段数
     */
    attack_num = 1;
    atta_state = false;
    attaCool = false;
    /**
    * 攻击的函数
    */
    attackFun() {
        if (Game.instance.isStop()) {
            return;
        }
        if (this.attaCool) {
            return;
        }
        this.attaCool = true;
        this.scheduleOnce(() => {
            this.attaCool = false;
        }, 0.3);
        this.atta_state = true;
        AudioMgr.playEffect(SfxType.kattack2);
        this.playdragon(this.attack_num + 5, 1);
        this.attack_num++;
        if (this.attack_num > 3) {
            this.attack_num = 1;
        }

    }

    /**
     * 人物的攻击范围
     */
    attakRange = [{
        x: 200,
        y: 200
    },
    {
        x: 170,
        y: 300
    },
    {
        x: 350,
        y: 300
    }]
   /**
     * 人物身上的特效   
     * @param num 1是攻击1 2是攻击2 3是攻击3 4是技能    5是受伤1   6是受伤2 
     */
    displayEffec(num) {
        let effestr = [null, "attack_001", "attack_002", "attack_003", "skill", "skill_fly", "hit_2"];
        this.Effe.playAnimation(effestr[num], 1);
        let pos = [null, {
            x: -40,
            y: 90
        },
            {
                x: -90,
                y: 90
            },
            {
                x: -150,
                y: 115
            }, {
                x: -40,
                y: 0
            }]
        this.Effe.node.x = pos[num].x;
        this.Effe.node.y = 0;
        if (num == 4) {
            return
        }
        if (num == 1 || num == 2 || num == 3) {
            for (let i = 0; i < Game.instance.monsterArr.length; i++) {
                let monster = Game.instance.monsterArr[i];
                if (!monster.getComponent("monster").lifeover) {
                    let tRange = null;
                    if (this.attack_num == 2) {
                        tRange = this.attakRange[0];
                    } else if (this.attack_num == 3) {
                        tRange = this.attakRange[1];
                    } else {
                        tRange = this.attakRange[2];
                    }
                    let bool = Attk.isP_Attack(this.node, tRange, monster);
                    if (bool) {
                        let attk_num = Apply.randRange(this._attr.ATTK_MIN, this._attr.ATTK_MAX);
                        monster.getComponent("monster").hit_(attk_num);
                        if (this.MeteoriteState) {
                            this.mateRefresh(monster);
                        }
                    }
                }
            }
        }
    }


    /**
     * 陨石的攻击
     * @param tager  怪物的节点 
     */
    mateRefresh(tager) {
        let t_rand = Apply.randRange(1, 100);

        if (t_rand < 40) {
            let tMeta = this.metaPool.get();
            let attakRange = {
                x: tMeta.width,
                y: tMeta.height,
            }
            tMeta.active = true;
            tMeta.x = tager.x;
            tMeta.y = tager.y;
            let tMetaD = tMeta.getComponent(dragonBones.ArmatureDisplay);
            tMetaD.playAnimation("newAnimation", 1);
            this.scheduleOnce(() => {
                for (let i = 0; i < Game.instance.monsterArr.length; i++) {
                    let monster = Game.instance.monsterArr[i];
                    if (!monster.getComponent("monster").lifeover) {
                        let bool = Attk.isB_Attack(tMeta, attakRange, monster);
                        if (bool) {
                            monster.getComponent("monster").hit_(this.buffArg.mete);
                        }
                    }
                }
            }, 0.4)
            tMetaD.off(dragonBones.EventObject.COMPLETE)
            tMetaD.on(dragonBones.EventObject.COMPLETE, () => {
                tMeta.parent = null;
                tMeta.active = false;
                this.metaPool.put(tMeta);
            })
            this.node.parent.addChild(tMeta);
        }
    }


    /**
     * 技能的函数
     */
    skillFun() {
        if (Game.instance.isStop()) {
            return;
        }
        this.atta_state = true;
        this.playdragon(9, 1);
    }


    update(dt) {
        if (Game.instance.isStop()) {
            return;
        }
        // if (this.atta_state) {          //在攻击状态下  不可以懂
        //     return
        // }
        if (this.hitState) {                //被打之后0.5秒内不可以动
            this.hitTIme -= dt;
            if (this.hitTIme <= 0) {
                this.hitState = false;
            }
            return;
        }

        let t_speedX = this.run_speed * this.dire *Game.instance.GameSpeed;
        this.changSca(t_speedX);
        this.setPos(this.node.x + t_speedX, null);
        this.decline();
    }

    /**
     * 人物跳跃的函数
     */
    jumpFun() {
        if (this.jump_num > 0) {
            this.jump_speed = this.jump_max;
            this.jump_num--;
            this.playdragon(2, 1);
        }
    }

    /**
     * 不用
     * 碰撞的函数
     */
    collision() {
        // let r1 = new cc.Rect(this.node.x - this.Rect.width / 2, this.node.y - this.Rect.height / 2, this.Rect.width, this.Rect.height);
        // let t_node = Game.rode
        // let otherRect = new cc.Rect(t_node.x - t_node.width / 2, t_node.y - t_node.height / 2, t_node.width, t_node.height);
        // if (cc.Intersection.rectRect(r1, otherRect)) {
        //     let nr = r1.intersection(new cc.Rect(), otherRect);
        //     this.node.y += nr.width;
        //     this.jump_num = 1;
        //     this.jump_speed = 0;
        //     this.gravity = 0;
        // }
    }

    /**
     * 改变人物的方向
     * @param num 
     */
    changSca(num) {
        let scax = this.dragNode.scaleX;
        let t_num = Math.abs(this.dragNode.scaleX);
        if (num > 0 && scax > 0) {
            this.dragNode.scaleX = -1 * t_num;
        } else if (num < 0 && scax < 0) {
            this.dragNode.scaleX = 1 * t_num;
        }
    }

    stopMove() {
        this.dire = 0;
        this.playdragon(3, 0);
    }
    /**
     * 改变人物位置的函数
     * @param x 
     * @param y 
     */
    setPos(x = null, y = null) {
        let rode = Game.instance.sprRode;
        if (x != null) {
            let max_x = rode.width / 2 - this.Rect.width / 2;
            if (x > -max_x && x < max_x) {
                this.node.x = x;
            }
        }
        if (y) {
            let min_y = Game.instance.minY;
            if (y < min_y) {
                y = min_y;
                this.jump_num = 1;
                this.jump_speed = 0;
                if (this.dire != 0) {
                    this.playdragon(1, 0);
                }
            } else {
                this.node.y = y;
            }
        }
    }

    /**
     * y方向上的改变
     */
    decline() {
        if (this.node.y <= Game.instance.minY) {
            this.node.y = Game.instance.minY;
            return
        }
        this.setPos(null, this.node.y + this.jump_speed);
        this.jump_speed -= this.gravity * Game.instance.GameSpeed;
        let max_dec = -30;              //下降的最大速度
        if (this.jump_speed <= max_dec) {
            this.jump_speed = max_dec;
        }
    }

    /**
     * 每一关都要初始化buff的数值
     */
    initBuff(data) {
        this.buffArg.maxHP = data.maxHP;
        this.buffArg.HP = data.HP;
        this.buffArg.attk = data.attk;
        this.buffArg.def = data.def;
        this.buffArg.shie = data.shie;
        this.buffArg.mete = data.mete;
    }

    buffArg = {
        maxHP: 200,
        HP: 400,
        attk: 30,
        def: 500,
        mete: 0,            //陨石
        shie: 0,            //护盾
    }


    /**
     * 是否有陨石攻击
     */
    MeteoriteState = false;
    /**
     * 得到buff的函数
     * @param idx       //1是增加最大生命值   2是恢复生命值  3是加攻击力   4是复活  5加防御力  6是陨石   7加盾
     */
    getBuff(idx) {
        console.log(idx);
        let fun = (str) => {
            this.buff.node.active = true;
            this.buff.playAnimation(str, 0);
            cc.tween(this.buff.node)
                .delay(3)
                .call(() => {
                    this.buff.node.active = false;
                })
                .start();

        }
        if (idx == 1) {
            this._attr.max_HP += this.buffArg.maxHP;
            this.plHP(this.buffArg.maxHP);
            fun("jiaxue");
        } else if (idx == 2) {
            this.plHP(this.buffArg.HP);
            fun("jiaxue");
        } else if (idx == 3) {
            this._attr.ATTK_MIN += this.buffArg.attk;
            this._attr.ATTK_MAX += this.buffArg.attk;
        } else if (idx == 4) {
            this.revive_num = 1;
        } else if (idx == 5) {
            this._attr.DEF += this.buffArg.def;
        } else if (idx == 6) {
            this.MeteoriteState = true;
        } else if (idx == 7) {
            this.plDEF(this.buffArg.shie);
        }
    }
}
