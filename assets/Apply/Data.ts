import Plat from "./Plat";


const { ccclass, property } = cc._decorator;

export class Game_data {
    static kgame_num = 'game_num';                 //游戏新手指导完成
    static kware = 'ware';                 //游戏数据
    static klevel = 'level';                 //游戏数据
    static kset = 'set';                 //游戏数据
}



export class Game_inter {
    static Load = 'Load';                 //加载界面
    static Start = 'Start';                 //加载界面
    static Draw = 'Draw';                 //画板界面
    static Game = 'Game';                 //游戏界面
    static Shop = 'Shop';                 //暂停界面
    static Rich = 'Rich';                 //财富界面
    static Sett = 'Sett';                 //结算界面
    static Buff = 'Buff';                 //Buff界面
    static Set = "Set"                        //设置界面
    static Export = "Export"                        //导出界面

    static Trial = "Trial"                        //试用界面
    static Egg = "Egg"                        //试用界面
    static Video = "Video"                        //视频分享界面

}


@ccclass
export default class Data {


    static data_state = false;     //数据的读取状况   
    static init() {
        this.load_Json();

        Plat._showInterstitialAd("11");
    }

    static monster_data = null;
    /**
     * 加载json的数据
     */
    static load_Json() {
        cc.assetManager.getBundle('Load').loadDir("data", cc.JsonAsset, (err, assets) => {
            if (err) {
                Data.load_Json();
                console.log("data  err", err);
            } else {
                let fun = (str) => {
                    for (let idx in assets) {
                        let t_josn = null;
                        if (assets[idx].name == str) {
                            t_josn = assets[idx];
                            return t_josn.json;
                        }
                    }
                }
                this.warehouse_Data(fun("player"));
                this.level_init(fun("level"));
                this.monster_data = fun("monster");
                this.data_state = true;
                // Data.refresh_data();           //每日的数据刷新
            }
        })
    }
    static player_num = 0;
    static warehouse = {
        101: 0,
        102: 0,
        201: null,
    }
    /**
     * 仓库数据的读取
     */
    static warehouse_Data(data) {
        let t_ware = this.readJSON(Game_data.kgame_num);
        if (t_ware) {
            this.warehouse = t_ware;
            this.warehouse[201].data = data;
        } else {
            this.add_player(data);
            this.writeJSON(Game_data.kgame_num, this.warehouse);
        }
    }
    /**
     * 添加人物的属性
     */
    static add_player(data) {
        let player = {
            data: data,
            HP: { LV: 1, num: data[1].HP },
            ATTK: { LV: 1, num_min: data[1].AtkMin, num_max: data[1].AtkMax },
            DEF: { LV: 1, num: data[1].Def },
            SKIN: {
                now: 0,
                trial: null,
                skin: [{
                    is_get: true,            //是否拥有
                    price: 0,              //价格
                    type: 1,                 //1是金币   2是钻石
                },
                {
                    is_get: false,            //是否拥有
                    price: 2000,              //价格
                    type: 1,                 //1是金币   2是钻石
                },
                {
                    is_get: false,            //是否拥有
                    price: 200,              //价格
                    type: 2,                 //1是金币   2是钻石
                }]
            }

        }
        this.warehouse[201] = player;
    }

    /**
     * 人物升级
     * @param idx  升级的是什么  1是生命  2是攻击力  3是防御力
     */
    static player_level_up(idx) {
        let t_data = this.warehouse[201];
        let coin_num = 0
        let fun = () => {
            if (idx == 1) {
                coin_num = t_data.data[t_data.HP.LV].cofe;
            } else if (idx == 2) {
                coin_num = t_data.data[t_data.ATTK.LV].cofe;
            } else if (idx == 3) {
                coin_num = t_data.data[t_data.DEF.LV].cofe;
            }
            return coin_num;
        }

        if (this.warehouse[101] >= fun()) {
            if (idx == 1) {
                this.warehouse[201].HP.LV += 1;
                this.warehouse[201].HP.num = t_data.data[this.warehouse[201].HP.LV].HP;
            } else if (idx == 2) {
                this.warehouse[201].ATTK.LV += 1;
                this.warehouse[201].ATTK.num_max = t_data.data[this.warehouse[201].ATTK.LV].AtkMin;
                this.warehouse[201].ATTK.num_min = t_data.data[this.warehouse[201].ATTK.LV].AtkMax;
            } else if (idx == 3) {
                this.warehouse[201].DEF.LV += 1;
                this.warehouse[201].DEF.num = t_data.data[this.warehouse[201].DEF.LV].Def;
            }
            this.ware_change(101, -coin_num);
            return true;
        } else {
            return false;
        }
    }
    /**
     * 
     * @param idx 仓库的改变
     * @param num 数量 要区分正负
     */
    static ware_change(idx, num) {
        this.warehouse[idx] += num;
        this.writeJSON(Game_data.kgame_num, this.warehouse);
        lw.evtMgr.emit("init_Rich");
    }

    static game_level = {
        num: 1,
        json: null,
    }
    static level_init(data) {
        let t_level = this.readJSON(Game_data.klevel);
        if (t_level) {
            this.game_level = t_level;
            this.game_level.json = data;
        } else {
            this.game_level.json = data;
        }
        this.writeJSON(Game_data.klevel, this.game_level);
    }

    static set = {
        music: true,
        shock: true,
    }
    /**
     * 设置
     */
    static setInit() {
        let t_set = this.readJSON(Game_data.kset);
        if (t_set) {
            this.set = t_set;
        }
        this.writeJSON(Game_data.kset, this.set);
    }

    /**
     * 完成关卡
     */
    static finishLevel() {
        this.game_level.num++;
        this.writeJSON(Game_data.klevel, this.game_level);
    }
    /**
     * 每日刷新
     */
    static refresh_data() {

    }

    //使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
    static vibrateShort() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Plat.vibrateShort();
        }
    }

    //使手机发生较长时间的振动（400 ms)
    static vibrateLong() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Plat.vibrateLong();
        }
    }

    static writeJSON(str: string, val: any) {
        let data = JSON.stringify(val);
        cc.sys.localStorage.setItem(str, data);
    }

    static readJSON(str: string): any {
        let data = null;
        let data1 = cc.sys.localStorage.getItem(str);
        if (data1) {
            data = JSON.parse(data1);
        }
        return data
    }
}
