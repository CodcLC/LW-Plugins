

const { ccclass, property } = cc._decorator;

@ccclass
export default class Attk {


    /**怪物用的
     * 两个物体可以攻击到
     * @param node1 怪物
     * @param range 攻击范围
     * @param node2 玩家
     */
    static isM_Attack(node1: cc.Node, range, node2: cc.Node) {
        let bool = false;
        let t_min_y1 = node2.y + 90
        let t_min_y2 = node1.y + 90
        if (t_min_y1 >= t_min_y2 - range.y && t_min_y1 <= t_min_y2 + range.y) {
            if (node1.x <= node2.x) {
                if (node1.x + range.x >= node2.x) {
                    bool = true;
                }
            } else {
                if (node1.x - range.x <= node2.x) {
                    bool = true;
                }
            }
        }
        return bool;
    }

    /**玩家用的
     * 两个物体可以攻击到
     * @param node1 玩家
     * @param range 攻击范围
     * @param node2 怪物
     */
    static isP_Attack(node1: cc.Node, range, node2: cc.Node) {
        let bool = false;
        let sca_x = node1.getChildByName("drag").getChildByName("drag").scaleX;
        let t_min_y1 = node2.y + 90
        let t_min_y2 = node1.y + 90
        if (t_min_y1 >= t_min_y2 - range.y && t_min_y1 <= t_min_y2 + range.y) {
            if (node1.x <= node2.x && sca_x < 0) {
                if (node1.x + range.x >= node2.x) {
                    bool = true;
                }
            } else if (node1.x > node2.x && sca_x > 0) {
                console.log()
                if (node1.x - range.x <= node2.x) {
                    bool = true;
                }
            }
        }
        return bool;
    }


    /**子弹
    * 两个物体可以攻击到
    * @param node1 子弹
    * @param range 攻击范围
    * @param node2 目标
    */
    static isB_Attack(node1: cc.Node, range, node2: cc.Node) {
        let bool = false;
        let t_min_y1 = node2.y + 90;
        if (t_min_y1 >= node1.y - range.y && t_min_y1 <= node1.y + range.y) {
            if (node1.x + range.x >= node2.x && node1.x - range.x <= node2.x) {
                bool = true;
            }
        }
        return bool;
    }



}
