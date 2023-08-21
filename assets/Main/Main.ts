
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    public static instance:Main = null;
    userData = null;
    onLoad() {
        Main.instance = this;
        
        lw.viewMgr.openSync('Load');
    }

    ExprotFnish=false;
    get bannerShowTime() {
        return this.userData.banner_data.bannerShowTime;
    }

    get bannershuaxin() {
        return this.userData.banner_data.bannershuaxin;
    }
}
