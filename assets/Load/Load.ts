/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Data, { Game_inter } from "../Apply/Data";
import Plat from "../Apply/Plat";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Main from "../Main/Main";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Load extends lw.BaseView {

    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    @metadata("cc.Node")
    private _bg: cc.Node = null;
    @metadata("cc.ProgressBar")
    private _pro_pro: cc.ProgressBar = null;
    //--Auto export attr, Don't change end--

    constructor() {
        super();
        this.LayerOrder = ViewZOrder.Load;
    }
    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        // TODO
        Data.init();
        this.initLWsdk();
        lw.viewMgr.open(Game_inter.Export);
        let arr = ["Start", "Draw", "Game", "Shop", "Rich", "Sett", "Buff", "Set", "TT", "Export"];
        this.getbundle(arr);
        Plat.fetchSdkInfo();
    }

    _sdkInitOk = false;
    userData = {
        pres: null,                     //人物的数据
        export: false,                  //卖量功能开关
        video_prob: true,               //视频开关
        banner_prob: true,              //误点开关
        start_box: true,                //开始游戏宝箱
        video_force: true,              //强拉视频
        SPTJ: true,                     //首屏热门推荐
        SPLD: true,                     //首屏两列导出
        SPBK: true,                     //首屏爆款弹窗
        CNXH: true,                     //猜你喜欢
        DBHT: true,                      //底部横条
        banner_data: null,               //banner的参数
        coin: false,                        //金币的开关
    };
    /**
     * 乐玩sdk的初始化
     */
    initLWsdk() {
        let self = this;
        lwsdk.init({
            debug: false,
            game: 'jijiahuangyegedou-toutiao',
            version: '1.0.0',
            dev_platform: 'toutiao',
            changeHost: false,
            gameAdIsNeed: false,
            preloadBanner: true,
            BANNERAD_MAX_COUNT: 1,
            loginIsNeed: true,
            success: (userData) => {
                // 初始化成功
                // console.log("初始化成功")
                self.userData.pres = userData;
                self.pull_open()
                lwsdk.onShareAppMessage();
            },
            fail: err => {
                console.warn('sdk初始化失败，重试。');
                setTimeout(() => {
                    self.initLWsdk();
                }, 1000)
            }
        })
    }

    pull_open() {
        let str = "JJHYGD-"
        let data = lwsdk.getConfig(1);

        this.userData.export = data[str + "MLKG"] == 1;
        this.userData.video_prob = data[str + "SPKG"] == 1;
        this.userData.banner_prob = data[str + "WDKG"] == 1;
        this.userData.start_box = data[str + "KSYXBX"] == 1;
        this.userData.video_force = data[str + "QLSP"] == 1;
        this.userData.SPTJ = data[str + "SPRMTJ"] == 1;
        this.userData.SPLD = data[str + "SPLD"] == 1;
        this.userData.SPBK = data[str + "SPBK"] == 1;
        this.userData.coin = data[str + "GDHW"] == 1;

        this.userData.banner_data = lwsdk.getConfig(2);
        console.log("userData>>>>>>>>>>>>>>", Main.instance.userData)
        this._sdkInitOk = true;
        this.por_num = 30;
    }


    exprotState = false;
    getbundle(arr) {
        let idx = 0;
        console.log(arr)
        let fun = () => {
            cc.assetManager.loadBundle(arr[idx], (err) => {
                if (err) {
                    console.log(err)
                    fun();
                    return;
                }
                console.log(arr[idx], "加载成功");
                idx++;
                if (idx == arr.length) {
                    this.exprotState = true;
                } else {
                    fun();
                }
            })
        }
        fun();
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {

    }

    /** 
     * 初始化事件 
     */
    protected _initEvent() {

    }

    /** 
     * 界面关闭 
     */
    protected onClose() {

    }



    por_num = 0;
    update(dt) {
        if (this.por_num >= 100) {
            return;
        }
        if (this._sdkInitOk && Data.data_state && Main.instance.ExprotFnish && this.exprotState) {
            this.por_num = 100;
        } else {
            this.por_num += dt;
            if (this.por_num >= 95) {
                this.por_num = 95;
            }
        }
        this._pro_pro.progress = this.por_num;
        if (this.por_num >= 100) {
            Main.instance.userData = this.userData;
            lw.viewMgr.open(Game_inter.Start);
        }

    }
}
