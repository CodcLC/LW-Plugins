import Apply from "../../Apply/Apply";
import Game from "../Game";
import Attk from "./Attk";
import Player from "./player";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    init(sca) {
        this.node.scaleX = 1;
        if (sca > 0) {
            this.node.scaleX = -1;
        }
    }

    hitArr = [];
    onEnable() {
        this.hitArr = [];
    }

    attakRange = {
        x: 50,
        y: 120,
    }




    speed_x = 20;
    update(dt) {
        let t_x = this.speed_x * this.node.scaleX;
        if (this.node.scaleX > 0) {
            t_x = this.speed_x * 1;
        } else {
            t_x = this.speed_x * -1;
        }
        this.node.x += t_x * Game.instance.GameSpeed;
        let max_width = Game.instance.sprRode.width / 2;
        if (this.node.x > max_width || this.node.x < -max_width) {
            this.node.active = false;
            Game.instance.bullPool.put(this.node);
            this.node.parent = null;
            return;
        }
        for (let i = 0; i < Game.instance.monsterArr.length; i++) {
            let monster = Game.instance.monsterArr[i];
            if (Apply.isEqual(monster, this.hitArr)) {
                continue;
            }
            if (!monster.getComponent("monster").lifeover) {
                let bool = Attk.isB_Attack(this.node, this.attakRange, monster);
                if (bool) {
                    let attk_num = Apply.randRange(Player.instance._attr.ATTK_MIN, Player.instance._attr.ATTK_MAX);
                    monster.getComponent("monster").hit_(attk_num);
                    this.hitArr.push(monster);
                    if (Player.instance.MeteoriteState) {
                        Player.instance.mateRefresh(monster);
                    }
                }
            }
        }
    }
}
