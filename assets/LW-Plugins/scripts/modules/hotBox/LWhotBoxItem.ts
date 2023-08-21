import LWitem from "../moduleBase/LWitem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LWhotBoxItem extends LWitem {

    @property(cc.Label)
    index: cc.Label = null;

    init(data) {
        super.init(data);
        if (data.index) {
            this.index.string = data.index;
        }
    }
}
