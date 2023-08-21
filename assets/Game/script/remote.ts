import Apply from "../../Apply/Apply";
import Game from "../Game";
import Player from "./player";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    remote: cc.Node = null;


    onLoad() {
        this._initEvent();
    }

    _initEvent() {
        this.remote.parent.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (Game.instance.isStop()) {
                return;
            }
            let pos = cc.v2(event.getLocation().x, event.getLocation().y);
            let pos1 = Apply.worldConvertLocalPointAR(this.remote.parent, pos);
            this.remote.position = pos1;
            this.playerMove(pos1);
            Player.instance.playdragon(1, 0);
        });

        this.remote.parent.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (Game.instance.isStop()) {
                return;
            }
            let pos = cc.v2(event.getLocation().x, event.getLocation().y);
            let pos1 = Apply.worldConvertLocalPointAR(this.remote.parent, pos);
            let targ_pos = cc.v3(0, 0, 0);
            if (this.compR(pos1.x, pos1.y) <= this.remote.parent.width / 2) {
                targ_pos.x = pos1.x;
                targ_pos.y = pos1.y;
            } else {
                let prop = this.remote.parent.width / 2 / Math.sqrt(Math.pow(pos1.x, 2) + Math.pow(pos1.y, 2));
                targ_pos.x = pos1.x * prop;
                targ_pos.y = pos1.y * prop;
            }
            this.remote.position = targ_pos;
            this.playerMove(targ_pos);

        });

        this.remote.parent.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (Game.instance.isStop()) {
                return;
            }
            this.remote.position = cc.v3(0, 0, 0);
            Player.instance.stopMove();
        });

        this.remote.parent.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            if (Game.instance.isStop()) {
                return;
            }
            this.remote.position = cc.v3(0, 0, 0);
            Player.instance.stopMove();
        });
    }

    playerMove(pos) {
        if (pos.x > 0) {
            Player.instance.dire = 1;
        } else if (pos.x < 0) {
            Player.instance.dire = -1;
        }
        if (pos.y > 30) {
            Player.instance.jumpFun();
        }
    }

    compR(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
}
