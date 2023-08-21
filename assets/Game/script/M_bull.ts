import Apply from "../../Apply/Apply";
import Game from "../Game";
import Attk from "./Attk";
import Player from "./player";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    mat: cc.Node = null;

    @property(cc.Node)
    boss: cc.Node = null;


    attk = 0;
    init(str, sca, num) {
        this.mat.active = false;
        this.boss.active = false;
        this.attk = num;
        this.node.scaleX = -1;
        if (sca > 0) {
            this.node.scaleX = 1;
        }
        if (str == "boss") {
            this.boss.active = true;
        } else {
            this.mat.active = true;
        }

    }

    hitArr = null;
    onEnable() {
        this.hitArr = null;
    }

    attakRange = {
        x: 80,
        y: 100,
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
            Game.instance.M_bullPool.put(this.node);
            this.node.parent = null;
            return;
        }

        if (this.hitArr) {
            return;
        }
        if (!Game.instance.isStop()) {
            let bool = Attk.isB_Attack(this.node, this.attakRange, Player.instance.node);
            if (bool) {
                this.hitArr = true;
                Player.instance.hit_(this.attk);
            }

        }
    }
}
