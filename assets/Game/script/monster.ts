import Apply from "../../Apply/Apply";
import Data from "../../Apply/Data";
import Buff from "../../Buff/Buff";
import Game from "../Game";
import Attk from "./Attk";
import Player from "./player";


const { ccclass, property } = cc._decorator;



//1是跑 2 是跳 3是无 4受伤 5死亡  6是攻击1 7是无
const act_name = [null, "run", "jump", null, "hit", "death", "attack01", "attack02", "attack03"]

const attak_range = {
    Melee: {                //近战
        x: 100,
        y: 200,
    },
    remote: {               //远程
        x: 400,
        y: 200,
    }
}


@ccclass
export default class monster extends cc.Component {


    @property(dragonBones.ArmatureDisplay)
    drag: dragonBones.ArmatureDisplay = null;

    @property(cc.ProgressBar)
    HPpro: cc.ProgressBar = null;

    @property(dragonBones.ArmatureDisplay)
    effe: dragonBones.ArmatureDisplay = null;

    _attr = {
        max_HP: 0,
        HP: 100,
        AtkMin: 50,
        AtkMax: 70,
        Att_type: 1,                //1近战   2远程
    }
    attakRange = null;

    isBoss = false;
    /**
     * 
     * @param num 初始化怪物的参数 1是近战1  2是近战2  3是远程  4是boss1  5是boss2
     */
    init(num) {
        this.isBoss = false;
        this.attakRange = attak_range.remote
        if (Data.monster_data[num].attk_type == 1) {
            this.attakRange = attak_range.Melee;
        }
        if (num == "boos1" || num == "boos2") {
            this.isBoss = true;
            lw.evtMgr.emit("Boss_com");
        }
        let basic_att = Data.monster_data[num];
        let coef = Data.game_level.json[Data.game_level.num - 1].level_json[Game.instance.GameRank - 1].coef;
        this._attr.HP = basic_att.HP * coef;
        this._attr.max_HP = this._attr.HP;
        this._attr.AtkMin = basic_att.AtkMin * coef;
        this._attr.AtkMax = basic_att.AtkMax * coef;
        this._attr.Att_type = Data.monster_data[num].attk_type;
        this.monX = basic_att.move;
        this.playdragon(1, 0);
        let fun = () => {
            let ar_name = "armatureName"
            this.drag.armatureName = ar_name;
            this.playdragon(1, 0);
            //this.drag.playAnimation("run", 0);
        }
        let path = "Sprite/DragonBones/" + num;
        Apply.loadDragonBones(this.drag, "Game", path, fun);

        this.HPpro.progress = 1;
        this.HPpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.floor(this._attr.HP).toString();

        this.stageNum = 1;
        this.lifeover = false;
    }

    /**
     * //1是跑 2 是跳 3是待机 4受伤 5死亡  6是攻击1 7是
     * @param num 
     * @param lun 
     * @param completeCallback 
     */
    playdragon(num, lun, completeCallback = null) {

        let animName = act_name[num];
        if (this.drag.animationName != animName) {
            if (animName == act_name[1]) {
                lun = 0;
            }
            this.drag.playAnimation(animName, lun);

            let fun = () => {

                if (completeCallback) {
                    completeCallback();
                } else {
                    if (this.lifeover) {
                        return
                    }

                    this.playdragon(1, 0);
                }
            }
            this.drag.once(dragonBones.EventObject.COMPLETE, fun);

            this.scheduleOnce(() => {
                if (this.isBoss) {
                    this.boosAttk(animName);
                    return;
                }

                if (animName == act_name[7] && this._attr.Att_type == 1) {

                    let bool = Attk.isM_Attack(this.node, this.attakRange, Player.instance.node);
                    if (bool) {
                        this.stageNum++;
                        this.attkCool = true;
                        let attk_num = Apply.randRange(this._attr.AtkMin, this._attr.AtkMax);
                        Player.instance.hit_(attk_num);
                        let t_ran = Apply.randRangeF(3, 5);
                        this.scheduleOnce(() => {
                            this.attkCool = false;
                        }, t_ran);
                    } else {
                        this.attkCool = false;
                        this.stageNum--;
                    }

                } else if (animName == act_name[6] && this._attr.Att_type == 2) {

                    this.stageNum++;
                    this.attkCool = true;
                    let t_rand = Apply.randRange(this._attr.AtkMin, this._attr.AtkMax);
                    let pos = cc.v2(this.node.x, this.node.y + 80);
                    Game.instance.creatMBullet("mat", this.drag.node.scaleX, t_rand, pos);
                    let t_ran = Apply.randRangeF(3, 5);
                    this.scheduleOnce(() => {
                        this.attkCool = false;
                    }, t_ran);


                }
            }, 0.3);
        }
    }

    /**
     * boss的攻击
     */
    boosAttk(animName) {
        if (animName == act_name[6]) {
            if (this.skillTime == 0) {
                this.stageNum++;
                this.attkCool = true;
                let t_rand = Apply.randRange(this._attr.AtkMin, this._attr.AtkMax);
                let pos = cc.v2(this.node.x, this.node.y);
                if (this.drag.node.scaleX > 0) {
                    pos.x += 150;
                } else {
                    pos.x -= 150;
                }
                Game.instance.creatMBullet("boss", this.drag.node.scaleX, t_rand, pos);
                let t_ran = Apply.randRangeF(3, 5);
                this.scheduleOnce(() => {
                    this.attkCool = false;
                }, t_ran);
                this.skillTime = 100000;
                this.scheduleOnce(() => {
                    this.skillTime = 0;
                }, 8);
            } else {
                let range_t = {
                    x: attak_range.Melee.x + 80,
                    y: attak_range.Melee.y
                }
                let bool = Attk.isM_Attack(this.node, range_t, Player.instance.node);
                if (bool) {
                    this.stageNum++;
                    this.attkCool = true;
                    let attk_num = Apply.randRange(this._attr.AtkMin, this._attr.AtkMax);
                    Player.instance.hit_(attk_num);
                    let t_ran = Apply.randRangeF(3, 5);
                    this.scheduleOnce(() => {
                        this.attkCool = false;
                    }, t_ran);
                } else {
                    this.attkCool = false;
                    this.stageNum--;
                }
            }
        }

    }



    hitState = false;
    /**
     * 被打的函数  
     * @param hitNum 被打的数值  这个是掺进来的数值 不是最终伤害
     */
    hit_(hitNum) {
        let hit_num = hitNum;
        this.plHP(-hit_num);
        lw.evtMgr.emit("double_Hit");
        let rang_num = Apply.randRange(1, 10);
        if (rang_num > 5) {
            this.effe.playAnimation("hit_1", 1);
        } else {
            this.effe.playAnimation("hit_2", 1);
        }
        if (this.lifeover) {
            return
        }
        this.hitState = true;
        let fun = () => {
            this.hitState = false;
        }
        this.playdragon(4, 1, fun);

    }

    /**
     * 人物生命值发生变化的函数
     * @param num 
     */
    plHP(num) {
        this._attr.HP += num;
        if (this._attr.HP <= 0) {
            this._attr.HP = 0;
            this.lifeover = true;
            this.playdragon(5, 1, () => {
                this.node.active = false;
                this.node.parent = null;

                if (Data.set.shock) {
                    Data.vibrateShort();
                }

                Game.instance.diyMonsterArr.push(this.node);
                Game.instance.monsterPool.put(this.node);
                Game.instance.isGameover();
            });

        }

        this.HPpro.progress = this._attr.HP / this._attr.max_HP;
        this.HPpro.node.getChildByName("lab").getComponent(cc.Label).string = Math.floor(this._attr.HP).toString();
        Game.instance.hitLabinit(this.node, num);
    }

    lifeover = false;
    monX = 0;
    stageNum = 1;
    attkCool = false;
    attnow = false;


    skillTime = 0;
    update(dt) {
        if (Game.instance.isStop()) {
            return;
        }
        if (this.lifeover) {                 //在死亡的时候不动
            return;
        }
        if (this.hitState) {                 //在伤害的时候不动
            return;
        }
        if (this.attnow) {                  //在攻击的时候不动
            return
        }
        if (this.stageNum == 1) {                   //在追击人物的过程中
            if (this.isBoss) {
                let rang_X = attak_range.Melee.x + 80;
                if (this.skillTime == 0) {
                    rang_X = attak_range.remote.x;
                }
                if (Math.abs(Player.instance.node.x - this.node.x) <= rang_X) {
                    this.stageNum++;
                    return
                }
            } else {
                if (Math.abs(Player.instance.node.x - this.node.x) <= this.attakRange.x) {
                    this.stageNum++;
                    return
                }
            }

            let scal = 1;
            if (Player.instance.node.x < this.node.x) {
                scal = -1;
            }
            this.drag.node.scaleX = scal;
            this.node.x += this.monX * scal * Game.instance.GameSpeed;

        } else if (this.stageNum == 2) {                //攻击的过程
            this.attnow = true;
            if (this.isBoss) {
                this.playdragon(6, 1);
            } else {
                if (this._attr.Att_type == 1) {
                    this.playdragon(7, 1);
                } else {
                    this.playdragon(6, 1);
                }
            }


            this.drag.once(dragonBones.EventObject.COMPLETE, () => {
                this.attnow = false;
            });
        } else if (this.stageNum == 3) {
            if (this.attkCool) {
                let scal = 1;
                if (Player.instance.node.x < this.node.x) {
                    scal = -1;
                }
                this.drag.node.scaleX = scal;
                this.node.x -= this.monX * scal;
            } else {
                this.attkCool = false;
                this.stageNum = 1;
            }
        }
    }
}
