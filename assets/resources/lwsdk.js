(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const errMsg_1 = require("./errMsg");
        const mockWeiXinApi_1 = require("./mockWeiXinApi");
        const sdk_conf_1 = require("./sdk_conf");
        const Md5_1 = require("./Md5");
        var lwsdk = null;
        class LWSDK {
            constructor() {
                // Md5: any = Md5;
                this.ip1 = ''; //"https://login.llewan.com:1799";
                this.ip2 = ''; //"https://game.llewan.com:1899";
                this.ip3 = ''; //"https://log.llewan.com:1999";
                this.ip4 = ''; //"https://res.g.llewan.com";
                // loginBg: string = "https://res.g.llewan.com/uploadfile/common/20180831/20180831173032_3279.png";
                // loginBt: string = "https://res.g.llewan.com/uploadfile/common/20180831/20180831180006_1583.png";
                this.debug = false; //是否开启调试
                this.login = '/Login/common';
                this.modify = '/Login/modify';
                this.Config = '/Config/common';
                //游戏数据存储/获取
                // set: string = "/game/set";
                // get: string = "/game/get";
                this.time = "/game/time";
                this.ConfigData = {};
                this.Share = "/Share/common";
                this.ShareList = [];
                this.Logcommon = "/Log/common";
                this.BannerAd = null;
                this.VideoAd = null;
                //.即将废弃，请不要操作此变量。
                this.userid = 0;
                this.initFlag = 0;
                //视频成功回调 
                this.videoSuccess = null;
                //视频失败回调 
                this.videoFail = null;
                //视频失败回调 
                this.videoError = null;
                // isGameStart: boolean = false;
                // gameOnlineKey: string = "游戏在线";
                // shareCancelCallback: boolean = false;
                this.shareStartTime = -1;
                this.shareInfo = null;
                // 网络图片纹理缓存
                this.imageCacheList = []; //结构[{url:'https://xxxxx.com/xxx.png',spriteFrame: spriteFrame}]
                this.imageCacheMax = sdk_conf_1.default.imageCacheMax; //图片纹理缓存最大数量
                this.videoAdUnitIdIndex = {}; //视频广告id数组的索引，比如{buttonKey1: 0,buttonKey2: 4}
                this.currentVideoId = 0; //当前播放的视频id，管理后台配置生成的。
                // currentBannerId: any = {};//当前展示的bannerid，管理后台配置生成的。
                this.bannerAdUnitIdIndex = {}; //banner广告id数组的索引，比如{buttonKey1: 0,buttonKey2: 4}
                this.tryLogMaxCount = 5; //卖量广告埋点上报失败重传的最大尝试次数
                this.BannerAdList = []; //已加载的banner广告队列
                this.bannerAdUnitIdIndex1 = 0; //banner广告单元id索引
                this.BANNERAD_MAX_COUNT = 3; //banner广告预加载的最大数量
                this.showTime = null; //banner广告展示的时间点
                this.preloadBanner = true;
                // initStartTime: number = 0;
                this.changeHost = true;
                // loginIsNeed: boolean = true;
                this.button = null;
                // isWXLoading: boolean = false;
                // scene: any = null;
                this.sysInfo = null;
                this.ratio = null;
                this.videoAd = null;
                this.isOnce = true;
                this.initOk = false;
                this.bannerAdWith = 0;
                this.diversionData = null; //导流数据
                this.tryPlaySetting = null; //试玩设置数据
                if (lwsdk) {
                    return lwsdk;
                }
                lwsdk = this;
                var envGlobal = typeof window === 'undefined' ? GameGlobal : window;
                if (!envGlobal) {
                    this.error('无运行环境 window or gameGlobal');
                    return null;
                }
                let platform = sdk_conf_1.default.dev_platform;
                if (platform === 'weixin' || platform === 'qq' || platform === 'toutiao' || (envGlobal.navigator && envGlobal.navigator.appName)) {
                    console.warn('sdk platform is (wx、qq、tt), sdk version: ' + sdk_conf_1.default.llewan_sdk_version);
                    let option = typeof wx !== 'undefined' ? wx.getLaunchOptionsSync() : {};
                    console.warn('scene: ', option.scene);
                    console.warn('path: ', lwsdk.queryToPath(option.query));
                    envGlobal.lwsdk = lwsdk;
                    // Object.defineProperty(envGlobal, 'lwsdk', { value: lwsdk, writable: false, configurable: false })
                    // envGlobal.wx = typeof qq !== 'undefined' ? qq : envGlobal.wx;
                    // envGlobal.wx = typeof tt !== 'undefined' ? tt : envGlobal.wx;
                    typeof qq !== 'undefined' && (envGlobal.wx = qq);
                    typeof tt !== 'undefined' && (envGlobal.wx = tt);
                }
            }
            /**
             * 检测SDK是否已初始化成功，成功返回true，未成功返回false。debug模式会直接抛出异常。
             */
            isInit() {
                if (!this.initOk) {
                    this.error(`请在lwsdk初始成功之后再调用该方法。`);
                }
                return this.initOk;
            }
            clone(jsonObject) {
                var jsonString = JSON.stringify(jsonObject);
                return JSON.parse(jsonString);
            }
            /**
             {console} console.log封装 log(打印log信息)
             @example
             ```js
             lwsdk.log(1111)
             ```
             */
            log(message, ...optionalParams) {
                if (this.debug) {
                    var t = Array.prototype.slice.apply(arguments);
                    var formatString = "%c>>>DEBUG: ";
                    for (var i = 0; i < t.length; i++) {
                        if (typeof t[i] === 'boolean') {
                            t[i] = String(t[i]);
                        }
                        if (typeof t[i] === 'string' || typeof t[i] === 'number') {
                            formatString += '%s  ';
                        }
                        else {
                            formatString += '%o  ';
                        }
                    }
                    t.unshift('color: #008cc5;'); //008cc5/e96900
                    t.unshift(formatString);
                    console.log.apply(console, t);
                }
            }
            /**
             console.error封装 error(打印error信息)
             @example 示例:
             lwsdk.error(1111)
             */
            error(message, ...optionalParams) {
                console.error.apply(console, arguments);
                if (this.debug) {
                    if (message && message.code) {
                        let err = new Error(JSON.stringify(message));
                        throw err;
                    }
                    else {
                        let err = new Error(`{code: 0,msg: ${message}}`);
                        throw err;
                    }
                }
            }
            /**
             检测平台环境是否匹配，调用平台api前，必须先调用此方法判断一下 fitPlatform(检测平台环境)
             @example {Boolean} 示例:
             if(sdk.fitPlatform()){wx.showLoading()}
             */
            fitPlatform() {
                if (typeof wx === 'undefined') {
                    this.error('当前sdk为(wx, tt, qq)版，请发布到相应平台运行。');
                    return false;
                }
                return true;
            }
            /**
             * 脚本内部调用
             */
            initData(args = { gameAdIsNeed: false }, callback) {
                var self = this;
                self.checkUpdate();
                if (self.fitPlatform()) {
                    //初始化导流数据
                    // self.getDiversionData();
                    var arr = [];
                    arr.push(self.getServerConfig());
                    if (args && args.gameAdIsNeed) {
                        arr.push(self.getDiversionData());
                    }
                    arr.push(self.getShareData());
                    //2.初始化分享信息
                    Promise.all(arr).then(res => {
                        args.gameAdIsNeed && self.log('Recommended wall ad data: ', res[1]);
                        // self.preloadAllLocationBannerAd();//预加载所有位置的banner广告
                        if (!self.preloadBanner || !self.getBannerAdUnitIdArr() || self.isBrowser()) {
                            self.log('preload banner warn: arg preloadBanner is false || no adUnitId || run in the browser');
                            // 不需要预加载banner广告
                            callback && callback(true);
                            return;
                        }
                        self.preloadAllBannerAd();
                        var count = 0;
                        var interval = 50;
                        var timer = setInterval(() => {
                            if (self.BannerAdList.length > 0) {
                                clearInterval(timer);
                                callback && callback(true);
                            }
                            else {
                                count = count + interval;
                                if (count > 2e3) {
                                    clearInterval(timer);
                                    callback && callback(true);
                                }
                            }
                        }, interval);
                    })
                        .catch(err => {
                            self.error('catch init error:', err);
                            callback && callback(false);
                        });
                    //为了方便技术在浏览器中调试
                    self.setWeChatListener();
                }
            }
            /**
             * 获取服务器配置
             */
            getServerConfig() {
                var self = this;
                return new Promise((resolve, reject) => {
                    //1.初始化后台配置信息
                    self.Post(self.ip2 + self.Config, {}, function (d) {
                        if (d && d.c == 1) {
                            self.ConfigData = d.d;
                            resolve(true);
                            // self.getShareData(callback);
                        }
                        else {
                            self.error("sdk get server config fail", d);
                            // self.fitPlatform() && wx.showToast({
                            //   title: '网络超时'
                            // });
                            reject(false);
                            // return;
                        }
                    });
                });
            }
            /**
             * 获取分享配置
             */
            getShareData() {
                var self = this;
                return new Promise((resolve, reject) => {
                    self.Post(self.ip2 + self.Share, {}, function (d2) {
                        // self.log("初始化分享信息：",d2)
                        if (d2 && d2.c == 1) {
                            self.ShareList = d2.d;
                        }
                        else {
                            self.log("sdk init share info fail", d2);
                        }
                        resolve(true);
                    });
                });
            }
            /**
             {全局监听} 微信小游戏显示和隐藏的监听事件，无需手动调用，不对外提供使用 setWeChatListener(游戏显示和隐藏监听)
             */
            setWeChatListener() {
                let self = this;
                if (!self.fitPlatform()) {
                    return;
                }
                wx.onHide(function () {
                    //监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
                    self.uploadSceneEvent(null, '隐藏小游戏到后台', null);
                });
                wx.onShow(function () {
                    //监听小游戏回到前台的事件
                    self.log("sdk on show");
                    var nowTime = new Date().getTime();
                    if (self.shareStartTime > 0) {
                        let shareInfo = self.shareInfo;
                        //分享成功记录到服务器
                        var option = {
                            'uid': self.userid,
                            'share_id': shareInfo.sysid,
                            'type': shareInfo.type
                        };
                        //开启地区IP分享就领取
                        let successCB = shareInfo.successCallback;
                        if (self.getConfig(4).cityLimit == 1) {
                            successCB && successCB();
                            // 上报
                            // self.Post(self.ip3 + self.Logcommon, {
                            //   log_type: "ShareClick",
                            //   data: JSON.stringify(option)
                            // }, ()=>{});
                            self.shareTypeClickStatusLog(option.share_id, option.type, 1);
                        }
                        else {
                            let shareTime = (nowTime / 1000) - self.shareStartTime;
                            if (shareTime >= sdk_conf_1.default.share_time_limit) {
                                successCB && successCB();
                                // 上报
                                // self.Post(self.ip3 + self.Logcommon, {
                                //   log_type: "ShareClick",
                                //   data: JSON.stringify(option)
                                // }, ()=>{});
                                self.shareTypeClickStatusLog(option.share_id, option.type, 1);
                            }
                            else {
                                // self.log("sdk share fail");
                                //分享失败 回调失败
                                if (shareInfo.failCallback) {
                                    shareInfo.failCallback();
                                }
                                else if (shareInfo.cancelCallback) {
                                    shareInfo.cancelCallback();
                                }
                                self.shareTypeClickStatusLog(option.share_id, option.type, 2);
                            }
                        }
                        //重置分享数据
                        self.shareStartTime = -1;
                        self.shareInfo = null;
                        // self.log("sdk clear share data");
                    }
                    //检测是否是试玩游戏返回
                    if (self.tryPlaySetting) {
                        let tryPlaySetting = self.tryPlaySetting;
                        let adItem = tryPlaySetting.adItem;
                        //检测是否满足试玩时长
                        self.log(`try play time: ${adItem.second}`);
                        if ((Date.now() - tryPlaySetting.startTime) >= adItem.second * 1000) {
                            // self.log('试玩时间已满足 ' + self.tryPlaySetting.adItem.second + ' 秒');
                            var success = function () {
                                wx.hideLoading();
                                self.setTryPlayStatus(adItem.config_id, adItem.iconid);
                                tryPlaySetting.tryPlaySuccess && tryPlaySetting.tryPlaySuccess(adItem.gold);
                                self.tryPlaySetting = null;
                            };
                            var fail = function () {
                                wx.hideLoading();
                                tryPlaySetting.tryPlayFail && tryPlaySetting.tryPlayFail('你已试玩过该游戏不能重复获得奖励');
                                self.tryPlaySetting = null;
                            };
                            wx.showLoading();
                            self.tryPlayLog(adItem.iconid, success, fail);
                        }
                        else {
                            // self.log('试玩时间不足 ' + self.tryPlaySetting.adItem.second + ' 秒');
                            tryPlaySetting.tryPlayFail && tryPlaySetting.tryPlayFail('试玩时间不足');
                            self.tryPlaySetting = null;
                        }
                    }
                });
            }
            _postShareEnter(option) {
                let self = this;
                let query = option.query;
                if (query.uid) {
                    query.share_uid = option.query.uid;
                    query.uid = self.userid;
                    self.commonLog("ShareEnter", option);
                    // self.Post(self.ip3 + self.Logcommon, {
                    //   log_type: "ShareEnter",
                    //   data: JSON.stringify(option)
                    // }, function () {
                    // });
                    self.shareTypeEnterLog(option);
                }
            }
            /**
             logServer 日志上报
             */
            logServer() {
                var self = this;
                let user = self.getUser();
                let userId = user ? user.uid : null;
                if (userId && self.initFlag === 0) {
                    self.userid = userId;
                    var option = wx.getLaunchOptionsSync();
                    let query = option.query;
                    var gdt_vid = query.gdt_vid;
                    var weixinadinfo = query.weixinadinfo;
                    if (gdt_vid) {
                        self.setItem("gdt_vid", gdt_vid);
                        self.setItem("weixinadinfo", weixinadinfo);
                    }
                    if (query.share_id) {
                        this._postShareEnter(option);
                    }
                    wx.onShow((option) => {
                        this._postShareEnter(option);
                    });
                    //5.统计：每次打开小游戏调用
                    wx.getSystemInfo({
                        success(res) {
                            var loginData = res;
                            loginData.uid = userId;
                            loginData.share_uid = query.share_uid;
                            loginData.scene = option.scene;
                            loginData.source_id = query.source_id;
                            loginData.source_id2 = query.source_id2;
                            loginData.special_flag = query.special_flag;
                            loginData.reward_flag = query.reward_flag;
                            self.setItem("deviceModel", res.model);
                            // if (sdk_conf.game_online) {
                            //   //开启游戏统计情况下
                            //   self.gameStart({}, null);
                            // }
                            wx.getNetworkType({
                                success(res2) {
                                    loginData.network_type = res2.networkType;
                                    self.log("sdk LoginData", loginData);
                                    self.commonLog("LoginData", loginData, () => {
                                        self.initFlag = 1;
                                    });
                                    // self.Post(self.ip3 + self.Logcommon, {
                                    //   log_type: "LoginData",
                                    //   data: JSON.stringify(loginData)
                                    // }, function () {
                                    //   //很重要防止因为配置获取失败，重复调用
                                    //   self.initFlag = 1;
                                    // });
                                }
                            });
                        }
                    });
                }
            }
            /**
             lwsdk初始化 init(无授权登录)
             @param {string} debug 是否开启debug，值为true打开，false关闭
             @param {string} changeHost 是否把旧域名切换到新域名，值为true则切换，默认为true（https://res.g.llewan.com/4.png替换为https://res.fdn4i.com/4.png），false则不切换
             @param {string} game 游戏编码，乐玩后台获取， 比如'tatajuntuan-weixin'
             @param {string} version 游戏版本，乐玩后台获取 ,比如'1.0.0'
             @param {string} dev_platform 游戏发布平台，乐玩后台获取 ,比如'weixin'、'toutiao'、'qq'
             @param {boolean} gameAdIsNeed 是否需要支持卖量广告功能
             @param {boolean} preloadBanner 是否预加载banner广告，false表示不预加载
             @param {number} BANNERAD_MAX_COUNT 预加载banner广告的最大数量，如超过10将强行设置为10
             @param {boolean} loginIsNeed 是否需要登录，默认为需要，不需要请填false
             @param {number} bannerAdWith banner广告的宽度，最小不能小于300，最大不能超过屏幕宽度，默认值300
             @param {function} success 成功回调函数
             @param {function} fail 失败回调函数
             @example
            ```js
             var sdkInitOk = false;
             function initLWsdk () {
               lwsdk.init({
                 debug: true,
                 game: 'tatajuntuan-weixin',
                 version: '1.2.30',
                 dev_platform: 'weixin',
                 changeHost: false,
                 gameAdIsNeed: true,
                 preloadBanner: true,
                 success: (userData) => {
                  // 初始化成功
                  console.log(userData);
                  sdkInitOk = true;
                  lwsdk.onShareAppMessage();
                 },
                 fail: err => {
                  console.warn('lwsdk初始化失败，重试。');
                  setTimeout(()=>{
                    initLWsdk();
                  },1000)
                 }
               })
             }
             initLWsdk();
             ```
             */
            init({ game, version, dev_platform, debug, success, fail, changeHost = true, tryLogMaxCount = 5, gameAdIsNeed = true, preloadBanner = true, BANNERAD_MAX_COUNT = 3, loginIsNeed = true, bannerAdWith = 300 }) {
                let self = this;
                let initStartTime = Date.now();
                console.warn('SDK params:', arguments && arguments[0] || undefined);
                if (!arguments[0]) {
                    console.error('sdk init no params');
                    return;
                }
                if (!game || !version || !dev_platform) {
                    console.error(`以下参数不能为空 game:${game}  version:${version}  dev_platform:${dev_platform}`);
                    return;
                }
                self.debug = !!debug;
                let isBrowser = self.isBrowser();
                self.changeHost = isBrowser ? false : changeHost;
                self.log('preloadBanner的值为：', preloadBanner);
                self.preloadBanner = preloadBanner;
                // self.loginIsNeed = loginIsNeed;
                self.bannerAdWith = Math.max(bannerAdWith, 300); // banner宽度最小为300
                self.tryLogMaxCount = tryLogMaxCount;
                self.BANNERAD_MAX_COUNT = Math.min(BANNERAD_MAX_COUNT, 10); // 预加载最多为10个
                self.init_api(); //根据sdk_conf初始化api
                sdk_conf_1.default.game = game;
                sdk_conf_1.default.version = version;
                sdk_conf_1.default.dev_platform = dev_platform;
                if (isBrowser) {
                    // 浏览器开发环境，启用模拟微信api
                    mockWeiXinApi_1.default();
                }
                if (self.fitPlatform()) {
                    let userinfo = self.getUser();
                    let loginOk = false, initOk = false, userData = null, config = false;
                    let initCallback = function () {
                        // debugger
                        if (loginOk && initOk) {
                            if (config) {
                                self.log('sdk init suc');
                                console.warn('lwsdk初始化耗时', (Date.now() - initStartTime) + 'ms');
                                self.initOk = true;
                                success(userData);
                            }
                            else {
                                fail(config);
                            }
                            self.logServer();
                        }
                    };
                    if (!loginIsNeed || (userinfo && userinfo.uid)) {
                        (!loginIsNeed) ? self.log('need not login') : self.log("sdk enter game");
                        //用户信息获取到并且授权了
                        self.initData({ gameAdIsNeed: gameAdIsNeed }, (data) => {
                            initOk = true;
                            loginOk = true;
                            config = data;
                            userData = !loginIsNeed ? {} : userinfo;
                            initCallback();
                        });
                    }
                    else {
                        //没有用户信息，也没有授权，就应该去登陆并且去授权后调用服务端member/update用户信息
                        self.WxLogin((data) => {
                            loginOk = true;
                            userData = data;
                            initCallback();
                        });
                        self.initData({ gameAdIsNeed: gameAdIsNeed }, (data) => {
                            initOk = true;
                            config = data;
                            initCallback();
                        });
                    }
                }
            }
            /**
             获取设备信息新增用户 wxLogin 不对外提供调用
             
             */
            WxLogin(callback) {
                var self = this;
                if (self.fitPlatform()) {
                    var options = wx.getLaunchOptionsSync();
                    let query = options.query;
                    var param = {
                        success(res2) {
                            var reqData = {
                                referee_id: query.uid,
                                source_id: query.source_id,
                                source_id2: query.source_id2,
                                share_id: query.share_id,
                                special_flag: query.special_flag,
                                code: self.isTouTiao() ? res2.anonymousCode : res2.code,
                            };
                            // reqData.code = self.isTouTiao()? res2.anonymousCode: res2.code;
                            self.log('sdk registe param', reqData);
                            self.Post(self.ip1 + self.login, reqData, function (data) {
                                // self.log('sdk 新增登陆结果', data);
                                if (data.c == 1) {
                                    self.setItem('userinfo', JSON.stringify(data.d));
                                    callback(data.d);
                                }
                                else {
                                    self.log('sdk 登录接口请求失败', data);
                                    callback(null);
                                    wx.showToast({
                                        title: '登录失败请重试1'
                                    });
                                }
                            });
                        },
                        fail() {
                            wx.showToast({
                                title: '登录失败请重试2'
                            });
                            //self.error("systemInfo",res);
                            callback(false);
                        },
                    };
                    if (self.isBrowser()) {
                        let uid = "noid_";
                        let userInfo = { "uid": uid, "openid": "openid", "nickName": "BrowserDev", "avatarUrl": null, "gender": "3", "country": "", "regTime": "1581522623", "city": "", "province": "", "time": 1608278642, "scene_flag": 1, "scene_flag_test": null, "token": "", "isNew": false };
                        self.log('lwsdk 浏览器模拟登录成功。', userInfo);
                        self.setItem('userinfo', JSON.stringify(userInfo));
                        callback(userInfo);
                        return;
                    }
                    if (self.isTouTiao()) {
                        param.force = false;
                    }
                    wx.login(param);
                }
            }
            /**
             微信授权登录，将透明图片附着在游戏中功能按钮之上，点击弹出授权按钮 WxAuthLoginOpacity（授权）
             @param {Object} [obj] 传递按钮位置信息 width height left top
             @deprecated
             @example 示例：
             var obj = {
              width: 100,
              height: 200,
              left: 100,
              top: 100
             }
             lwsdk.WxAuthLoginOpacity(obj,function(userInfo){
              //userInfo 为null时，则用户拒绝授权
              lwsdk.log(userInfo);
             })
             */
            WxAuthLoginOpacity(obj, callback) {
                var self = this;
                if (self.fitPlatform()) {
                    let wxauthFlag = self.getItem('wxauth');
                    if (wxauthFlag)
                        return; //已授权
                    var options = wx.getLaunchOptionsSync();
                    let query = options.query;
                    var referee_id = query.share_uid; //.推荐人id
                    var source_id = query.source_id; //.用户来源id
                    var source_id2 = query.source_id2; //.用户来源子id
                    var share_id = query.share_id; //.分享素材ID
                    var special_flag = query.special_flag;
                    //.微信登录按钮
                    if (self.button) {
                        self.button.show();
                    }
                    else {
                        wx.getSystemInfo({
                            success(res) {
                                var ratio = 750 / res.screenWidth; //设计与真实尺寸缩放比例,这里默认设计分辨率为750x1334
                                if (!obj) {
                                    var width = 120;
                                    var height = 40;
                                    var left = res.screenWidth / 2 - width / 2;
                                    var top = res.screenHeight / 2 - height / 2;
                                }
                                else {
                                    var width = obj.width / ratio;
                                    var height = obj.height / ratio;
                                    var left = obj.left / ratio;
                                    var top = obj.top ? obj.top / ratio : obj.bottom ? res.screenHeight - obj.bottom / ratio - height : 0; //如果以底部为定位基线要使用bottom计算
                                }
                                self.button = wx.createUserInfoButton({
                                    type: 'text',
                                    text: '获',
                                    style: {
                                        left: left,
                                        top: top,
                                        width: width,
                                        height: height,
                                        lineHeight: height,
                                        backgroundColor: '#00000000',
                                        color: '#00000000',
                                        textAlign: 'center',
                                        fontSize: 16,
                                        borderRadius: 4
                                    }
                                });
                                self.button.onTap((res1) => {
                                    if (!wxauthFlag) {
                                        wx.showToast({
                                            title: '登录中...',
                                            icon: 'loading',
                                            duration: 8
                                        });
                                    }
                                    else {
                                        callback && callback(self.getUser());
                                        return;
                                    }
                                    // 处理用户拒绝授权的情况
                                    self.log('授权按钮', res1);
                                    if (res1.errMsg.indexOf('deny') > -1 || res1.errMsg.indexOf('denied') > -1) {
                                        // self.button.hide();
                                        callback && callback(null);
                                        return;
                                    }
                                    wx.getSetting({
                                        success(auths) {
                                            if (auths.authSetting["scope.userInfo"]) {
                                                self.setItem("wxauth", 1);
                                                self.log('sdk user authed');
                                                var reqData = {
                                                    rawData: res1.rawData,
                                                    iv: res1.iv,
                                                    encryptedData: res1.encryptedData,
                                                    signature: res1.signature,
                                                    referee_id: referee_id,
                                                    source_id: source_id,
                                                    source_id2: source_id2,
                                                    share_id: share_id,
                                                    special_flag: special_flag,
                                                };
                                                // self.log('==登录参数==', reqData)
                                                self.Post(self.ip1 + self.modify, reqData, function (data) {
                                                    self.log('sdk update user info ', data);
                                                    if (data.c == 1) {
                                                        self.setItem('userinfo', JSON.stringify(data.d));
                                                        wx.hideToast();
                                                        self.button.hide();
                                                        //.登录成功，重新初始化
                                                        self.userid = data.d.uid;
                                                        //self.init({},(d)=>{})
                                                        callback && callback(data.d);
                                                    }
                                                    else {
                                                        self.log(' sdk 登录接口请求失败', data);
                                                        wx.showToast({
                                                            title: '登录失败请重试3'
                                                        });
                                                    }
                                                });
                                            }
                                            else {
                                                callback && callback(false);
                                            }
                                        }
                                    });
                                });
                                self.button.show();
                            }
                        });
                    }
                }
            }
            /**
             初始化ip init_api
             */
            init_api() {
                var self = this;
                let env = sdk_conf_1.default.env === 'prod' ? 'prod' : 'test';
                if (env === 'prod' && self.changeHost) {
                    env = 'anonymous';
                }
                for (let i = 1; i <= 4; i++) {
                    let k = `ip${i}`;
                    self[k] = sdk_conf_1.default.env_apis[env][k];
                }
                self.log("sdk ip1", self.ip1);
                self.log("sdk ip2", self.ip2);
                self.log("sdk ip3", self.ip3);
                self.log("sdk ip4", self.ip4);
            }
            //.根据权重随机获取指定type类型的分享信息。
            getShareByWeight(type) {
                let self = this;
                let shareList = this.ShareList;
                if (!shareList || shareList.length === 0) {
                    self.error('Did not find the shared configured in the background');
                    return sdk_conf_1.default.default_shareInfo;
                }
                if (shareList.length > 0) {
                    //1.获取某种type的集合
                    var tArray = [];
                    for (var i = 0; i < shareList.length; i++) {
                        let shareData = shareList[i];
                        if (type == shareData.type) {
                            shareData.weight = parseInt(shareData.weight);
                            tArray.push(shareData);
                        }
                    }
                    //2.根据权重配比：从i集合（权重越大占比越多）中随机获取。
                    var iArray = [];
                    for (var i = 0; i < tArray.length; i++) {
                        for (var j = 0; j < tArray[i].weight; j++) {
                            iArray.push(i);
                        }
                    }
                    var index = iArray[self.randomIndex(iArray)];
                    //3.结果处理：正则替换昵称
                    var item = tArray[index];
                    if (item.title.indexOf("&nickName") != -1) {
                        item.title = item.title.replace(/&nickName/g, self.getUser().nickName);
                    }
                    return JSON.parse(JSON.stringify(item));
                }
            }
            /**
             * 获取分享数据（内部调用）
             */
            getShareInfo(obj) {
                let self = this;
                //.根据类型获取权重
                let specialFlag = obj.specialFlag || 0;
                let rewardFlag = obj.rewardFlag || 0;
                var shareInfo = self.getShareByWeight(obj.type || 0);
                if (obj.title) {
                    shareInfo.title = obj.title;
                }
                if (obj.imageUrl) {
                    shareInfo.imageUrl = obj.imageUrl;
                }
                let sysid = shareInfo.sysid;
                let stype = shareInfo.type;
                let userid = self.userid;
                if (shareInfo.query) {
                    // shareInfo.query += obj.query + "&type=" + shareInfo.type + "&share_id=" + shareInfo.sysid + "&uid=" + self.userid + "&special_flag=" + specialFlag + "&reward_flag=" + rewardFlag;
                    shareInfo.query += `${obj.query}&type=${stype}&share_id=${sysid}&uid=${userid}&special_flag=${specialFlag}&reward_flag=${rewardFlag}`;
                }
                else {
                    shareInfo.query = `share_id=${sysid}&type=${stype}&uid=${userid}&special_flag=${specialFlag}&reward_flag=${rewardFlag}`;
                    if (obj.query) {
                        shareInfo.query += `&${obj.query}`;
                    }
                }
                if (obj.success) {
                    shareInfo.successCallback = obj.success;
                }
                if (obj.fail) {
                    shareInfo.failCallback = obj.fail;
                }
                if (obj.cancel) {
                    shareInfo.cancelCallback = function () {
                        obj.cancel();
                        self.log("share cancel");
                    };
                }
                var nowTime = new Date().getTime();
                self.shareStartTime = nowTime / 1000;
                self.shareInfo = shareInfo;
                self.shareTypeClickLog(shareInfo.sysid, shareInfo.type);
                return shareInfo;
            }
            /**
             {分享} 注册微信右上角分享,游戏初始化就可以调用了 onShareAppMessage(分享)
             @param {int} type=0 后台自定义的分享类型；例如：0：右上角分享、1：普通分享
             @param {int} specialFlag=0 特殊标记,例如0:默认、1：邀新好友、2:邀旧好友
             @param {int} rewardFlag=xxx 活动或者道具id
             @param {String} [title] 转发标题
             @param {String} [imageUrl] 转发显示图片的链接
             @param {String} [query] 查询字符串，从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。必须是类似 key1=val1&key2=val2 的格式。
             @param {callback} [success] 成功回调
             @param {callback} [fail] 失败回调
             @example 示例:
             lwsdk.onShareAppMessage({type: 0,query: "a=1",success:()=>{},fail:(err)=>{} });
             */
            onShareAppMessage(obj) {
                var self = this;
                if (self.fitPlatform()) {
                    //.微信右上角分享
                    wx.showShareMenu({
                        withShareTicket: true,
                        menus: ['shareAppMessage', 'shareTimeline']
                    });
                    var callback = function () {
                        //.默认0：右上角分享
                        obj = obj || {};
                        obj.type = obj.type || 0;
                        return self.getShareInfo(obj);
                    };
                    wx.onShareAppMessage && wx.onShareAppMessage(callback);
                    wx.onShareTimeline && wx.onShareTimeline(callback);
                }
            }
            /**
             {分享} 主动拉起微信分享 shareAppMessage(分享)
             @param {int} type=1 后台自定义的分享类型；例如：0：右上角分享、1：普通分享 2：分享加金币
             @param {int} specialFlag=0 特殊标记,例如0:默认、1：邀新好友、2:邀旧好友
             @param {int} rewardFlag=xxx 活动或者道具id
             @param {String} [title] 转发标题
             @param {String} [imageUrl] 转发显示图片的链接
             @param {String} [query] 必须是 key1=val1&key2=val2 的格式。
             @param {callback} [success] 成功回调
             @param {callback} [fail] 失败回调
             @param {callback} [cancel] 点击取消分享按钮回调
             
             @example 示例:
             lwsdk.shareAppMessage({type: 1,query: "a=1",success:()=>{},fail:(err)=>{} });
             */
            shareAppMessage(obj) {
                var self = this;
                //.默认1：普通分享
                if (self.fitPlatform()) {
                    obj = obj || {};
                    obj.type = obj.type || 1;
                    let shareInfo = self.getShareInfo(obj);
                    wx.shareAppMessage(shareInfo);
                }
            }
            /**
             http请求
             @param {String} url
             */
            httpRequest(url, requestType, param = null, callback) {
                var self = this;
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            var response = xhr.responseText;
                            self.log("Network request returned, url: ", url, " response: ", response);
                            if (response) {
                                if (self.changeHost) {
                                    response = response.replace(/https:\/\/res.g.llewan.com/g, self.ip4);
                                }
                                var responseJson = JSON.parse(response);
                                callback(responseJson);
                            }
                            else {
                                self.log("sdk return null", url);
                                callback(null);
                            }
                        }
                        else {
                            self.log("sdk request failed", url);
                            callback(null);
                        }
                    }
                };
                xhr.onabort = xhr.onerror = xhr.ontimeout = function () {
                    self.log("sdk request failed");
                    callback(null);
                };
                self.log("request, url: " + url);
                xhr.open(requestType, url, true);
                if (requestType == 'POST') {
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.send(param);
                }
                else {
                    xhr.send();
                }
            }
            /**
             * 微信请求
             */
            wxRequest(url, requestType, param = null, callback) {
                let self = this;
                let content_type = requestType === 'GET' ? 'application/x-www-form-urlencoded' : 'application/json';
                wx.request({
                    url: url,
                    data: param || '',
                    method: requestType,
                    timeout: 60 * 1000,
                    dataType: 'text',
                    header: {
                        'content-type': content_type
                    },
                    success(res) {
                        // console.info(res.data);
                        if (res.statusCode >= 200 && res.statusCode < 400) {
                            var response = res.data;
                            self.log("wxRequest: ", url, "response: ", response);
                            if (response) {
                                if (self.changeHost) {
                                    response = response.replace(/https:\/\/res.g.llewan.com/g, self.ip4);
                                }
                                var responseJson = JSON.parse(response);
                                callback(responseJson);
                            }
                            else {
                                self.log("sdk wxRequest no data");
                                callback(null);
                            }
                        }
                        else {
                            self.log("sdk wxRequest fail");
                            callback(null);
                        }
                    },
                    fail(err) {
                        self.log("sdk wxRequest fail", err);
                        callback(null);
                    }
                });
            }
            /**
             发起网络请求 Get（发起Get请求）
             
             @param {String} url 请求地址
             @param {Object} reqData 请求参数
             @param {Object} callback 不存在返回null
             @example 示例:
             lwsdk.Get("https://xxx.xxx", { user_id: user_id }, function (d) {
                 lwsdk.log(d)
             });
             */
            Get(url, reqData, callback) {
                var self = this;
                if (reqData) {
                    reqData.game = sdk_conf_1.default.game;
                    reqData.version = sdk_conf_1.default.version;
                    reqData.dev_platform = sdk_conf_1.default.dev_platform;
                    reqData.llewan_sdk_version = sdk_conf_1.default.llewan_sdk_version;
                    var ts = new Date().getTime();
                    reqData.ts = ts;
                    var token = "";
                    if (self.getUser() && self.getUser() != null) {
                        token = self.getUser().token;
                    }
                    var options = null;
                    var source_id = 0;
                    options = wx.getLaunchOptionsSync();
                    source_id = options.query.source_id;
                    //数据验证签名。规则为：MD5(ts.substr(9,4)+game.substr(0,2)+version.substr(0,1)+key),时间戳后4位、data前3位、key（服务端提供）然后进行MD5加密
                    reqData.sign = Md5_1.default.hashStr(ts.toString().substr(9, 4) + sdk_conf_1.default.game.substr(0, 2) + sdk_conf_1.default.version.substr(0, 1) + sdk_conf_1.default.md5_key);
                    url += "?";
                    for (var item in reqData) {
                        let reqItem = reqData[item];
                        var value = typeof reqItem === 'object' && reqItem !== null ? JSON.stringify(reqItem) : reqItem;
                        url += `${item}=${value}&`; //item + "=" + value + "&";
                    }
                    url += `token=${token}&`; //"token=" + token + "&";
                    url += `source_id=${source_id}&`; //"source_id=" + source_id + "&";
                }
                if (self.isBrowser()) {
                    self.httpRequest(url, "GET", null, callback);
                }
                else if (self.fitPlatform()) {
                    self.wxRequest(url, "GET", null, callback);
                }
                // self.log("发起网络请求，接口地址：" + url);
                // wx.request({
                //   url: url,
                //   data: '',
                //   method: 'GET',
                //   timeout: 60 * 1000,
                //   dataType: 'text',
                //   header: {
                //     'content-type': 'application/x-www-form-urlencoded'
                //   },
                //   success(res) {
                //     // console.info(res.data);
                //     if (res.statusCode >= 200 && res.statusCode < 400) {
                //       var response = res.data;
                //       self.log("网络请求返回，接口地址：", url, "返回内容", response);
                //       if (response) {
                //         if (self.changeHost) {
                //           response = response.replace(/https:\/\/res.g.llewan.com/g, self.ip4);
                //         }
                //         var responseJson = JSON.parse(response);
                //         callback(responseJson);
                //       } else {
                //         self.log("sdk 返回数据不存在");
                //         callback(null);
                //       }
                //     } else {
                //       self.log("sdk 请求失败");
                //       callback(null);
                //     }
                //   },
                //   fail(err) {
                //     self.log("sdk 请求失败", err);
                //     callback(null);
                //   }
                // })
            }
            /**
             发起网络请求 Post（发起Post请求）
             @param {String} url 请求地址
             @param {Object} reqData 请求参数
             @param {Object} callback 不存在返回null
             @example 示例:
             lwsdk.Post(sdk.ip + lwsdk.common, { user_id: user_id }, function (d) {
                 lwsdk.log(d)
             });
             */
            Post(url, reqData, callback) {
                var self = this;
                reqData.game = sdk_conf_1.default.game;
                reqData.version = sdk_conf_1.default.version;
                reqData.dev_platform = sdk_conf_1.default.dev_platform;
                reqData.llewan_sdk_version = sdk_conf_1.default.llewan_sdk_version;
                var ts = new Date().getTime();
                var token = "";
                if (self.getUser() && self.getUser() != null) {
                    token = self.getUser().token;
                }
                var options = null;
                var source_id = 0;
                options = wx.getLaunchOptionsSync();
                source_id = options.query.source_id;
                reqData.ts = ts;
                reqData.sign = Md5_1.default.hashStr(ts.toString().substr(9, 4) + sdk_conf_1.default.game.substr(0, 2) + sdk_conf_1.default.version.substr(0, 1) + sdk_conf_1.default.md5_key);
                if (self.isBrowser()) {
                    let param = "";
                    for (let key in reqData) {
                        let reqItem = reqData[key];
                        var value = typeof reqItem === 'object' && reqItem !== null ? JSON.stringify(reqItem) : reqItem;
                        param += `${key}=${value}&`; //item + "=" + value + "&";
                    }
                    param += `token=${token}&`; //"token=" + token + "&";
                    param += `source_id=${source_id}&`; //"source_id=" + source_id + "&";
                    self.httpRequest(url, "POST", param, callback);
                }
                else if (self.fitPlatform()) {
                    for (let key in reqData) {
                        let reqItem = reqData[key];
                        var value = typeof reqItem === 'object' && reqItem !== null ? JSON.stringify(reqItem) : reqItem;
                        reqData[key] = value;
                    }
                    reqData['token'] = token;
                    if (typeof source_id !== 'undefined') {
                        reqData['source_id'] = source_id;
                    }
                    self.wxRequest(url, "POST", reqData, callback);
                }
                // //1.拼接请求参数
                // self.log("path: ", url, " params: ", reqData);
                // wx.request({
                //   url: url,
                //   data: reqData,
                //   method: 'POST',
                //   timeout: 60 * 1000,
                //   dataType: 'text',
                //   header: {
                //     'content-type': 'application/json'
                //   },
                //   success(res) {
                //     // console.info(res.data);
                //     if (res.statusCode >= 200 && res.statusCode < 400) {
                //       var response = res.data;
                //       self.log("path: ", url, " response: ", response);
                //       if (response) {
                //         if (self.changeHost) {
                //           response = response.replace(/https:\/\/res.g.llewan.com/g, self.ip4);
                //         }
                //         var responseJson = JSON.parse(response);
                //         callback(responseJson);
                //       } else {
                //         // self.log("sdk no data");
                //         callback(null);
                //       }
                //     } else {
                //       // self.log("sdk post fail");
                //       callback(null);
                //     }
                //   },
                //   fail(err) {
                //     self.log("sdk post fail", err);
                //     callback(null);
                //   }
                // })
            }
            /**
             @apiGroup C
             @apiName checkUpdate
             @api {检测版本更新} 微信小游戏（冷启动的时候会检查，如果有更新则会重启小游戏进行更新） checkUpdate（版本更新）非必要
             
             @example {json} 示例:
             lwsdk.checkUpdate();
             */
            checkUpdate() {
                var self = this;
                if (self.fitPlatform() && wx.getUpdateManager) {
                    const updateManager = wx.getUpdateManager();
                    updateManager.onCheckForUpdate(function (res) {
                        self.log("sdk onCheckForUpdate", res.hasUpdate);
                    });
                    updateManager.onUpdateReady(function () {
                        self.log("sdk onUpdateReady");
                        updateManager.applyUpdate();
                    });
                    updateManager.onUpdateFailed(function () {
                        self.log("sdk new version download fail");
                    });
                }
            }
            /**
             * 获取游戏后台配置
             * @description configType 不同值对应说明
             * @description 1、{运营配置} 游戏后台配置信息，运营人员使用的通用配置开关 getConfig(1)（运营配置）
             * @description 2、获取自定义配置参数，如果有需求在服务器端配置一些数据或可变参数，为了方便游戏上线后，在服务端灵活修改的，可以联系我们，配置这些数据，数据格式要求是JSON格式。我方运营主动配置的自定义参数也可以通过该方法获取。
             * @description 3、{运营配置} 游戏后台配置信息，运营人员使用的通用配置开关,相关按钮根据时间来配置以及跳转方式按钮属性 getConfig(3)（运营配置）
             * @description 4、{技术程序控制} 游戏服务端控制一些需要服务端判断的比如：ip地区配置，getConfig(4)（技术程序）
             * @description 5、{视频配置} 视频广告相关的配置getConfig(5)（运营配置）
             * @description 6、{banner配置} banner相关的配置，getConfig(6)（运营配置）
             * @description 7、{运营配置} 游戏后台配置信息，运营人员使用的通用限制配置开关 getConfig(7)（运营配置）
             */
            getConfig(configType) {
                let k = `config${configType}`;
                if (!this.ConfigData || !this.ConfigData[k]) {
                    console.error(`no config${configType}, Please check if the background is configured or the network request is normal`);
                    return null;
                }
                return JSON.parse(this.ConfigData[k]);
            }
            /**
             @apiGroup A
             @apiName createImage
             @api {显示网络图片} 微信小游戏加载图片,该方法暂时仅支持cocos引擎 createImage（显示图片）
             @param {cc.Sprite} sprite 显示图片的Sprite
             @param {String} url 需要加载的图片地址
             @param {callback} [cb] 图片加载回调，成功回调参数值为图片纹理，失败回调参数值为null
             @param {Boolean} [cache] 是否缓存纹理
             
             @example {json} 示例:
             //该方法暂时仅支持cocos引擎
             lwsdk.createImage(itemNode.getComponent(cc.Sprite), imageUrl, null , true);//缓存图片
             lwsdk.createImage(itemNode.getComponent(cc.Sprite), imageUrl, null , false);//不缓存图片
             */
            createImage(sprite, url, cb = null, cache = true) {
                var self = this;
                if (typeof cc === 'undefined') {
                    self.error('only support cc');
                    cb && cb(null);
                    return;
                }
                var spriteFrame = self.imageUrl2SpriteFrame(url);
                if (spriteFrame) { //纹理有缓存
                    sprite.spriteFrame = spriteFrame;
                    cb && cb(sprite.spriteFrame);
                    return;
                }
                var image;
                if (self.fitPlatform()) {
                    image = wx.createImage();
                }
                else if (window.navigator) { //web环境设置允许跨域
                    image = new Image();
                    image.setAttribute('crossOrigin', 'anonymous'); //设置允许跨域
                }
                if (!image) {
                    self.error('new image fail');
                    cb && cb(null);
                    return;
                }
                image.onload = function () {
                    var texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    var spriteFrame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = spriteFrame;
                    // 缓存纹理
                    if (cache) {
                        var imageCache = {
                            url: url,
                            spriteFrame: spriteFrame
                        };
                        if (self.imageCacheList.length > self.imageCacheMax - 1) { //缓存数量超过最大值
                            self.imageCacheList.shift();
                        }
                        self.imageCacheList.push(imageCache);
                    }
                    cb && cb(sprite.spriteFrame);
                };
                image.onerror = function (err) {
                    cb && cb(null);
                };
                image.src = url;
            }
            //通过图片url查对应图片纹理缓存,不提供对外使用
            imageUrl2SpriteFrame(url) {
                var temp = this.imageCacheList.findIndex(function (item) {
                    return item.url === url;
                });
                if (temp > -1) {
                    return this.imageCacheList[temp].spriteFrame || null;
                }
                return null;
            }
            /**
             获取用户信息（初始化成功后调用才能正常返回用户信息）
             @returns null 或者 json结构的用户信息
             @example
             //.不存在返回null
             var user = lwsdk.getUser();
             */
            getUser() {
                var userinfo = this.getItem('userinfo');
                return userinfo ? JSON.parse(userinfo) : null;
            }
            /**
             @apiGroup B
             @apiName setItem
             @api {set} 数据存储 setItem（存）
             @param {String} key 键
             @param {String} value 值
             
             @example {json} 示例:
             lwsdk.setItem("nick","hello")
             */
            setItem(key, value) {
                if (typeof cc !== 'undefined') {
                    cc.sys.localStorage.setItem(key, value);
                }
                else if (typeof Laya !== 'undefined') {
                    Laya.LocalStorage.setItem(key, value);
                }
                else if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(key, value);
                }
            }
            /**
             @apiGroup B
             @apiName getItem
             @api {数据存储} 数据存储 getItem（取）
             @param {String} key 键
             @param {String} value 值
             
             @example {json} 示例:
             var nick = lwsdk.getItem("nick")
             */
            getItem(key) {
                if (typeof cc !== 'undefined') {
                    return cc.sys.localStorage.getItem(key);
                }
                else if (typeof Laya !== 'undefined') {
                    return Laya.LocalStorage.getItem(key);
                }
                else if (typeof localStorage !== 'undefined') {
                    return localStorage.getItem(key);
                }
            }
            /**
             @apiGroup B
             @apiName removeItem
             @api {数据存储} 数据存储 removeItem(删)
             @param {String} key 键
             
             @example {json} 示例:
             lwsdk.removeItem("nick")
             */
            removeItem(key) {
                if (typeof cc !== 'undefined') {
                    cc.sys.localStorage.removeItem(key);
                }
                else if (typeof Laya !== 'undefined') {
                    Laya.LocalStorage.removeItem(key);
                }
                else if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(key);
                }
            }
            /**
             获取服务器时间，一般用于时间比较严谨和敏感的场景。
             @param {function} success 成功回调，回调参数是毫秒时间戳
             @param {function} fail 失败回调
             @example
             lwsdk.getServerTime((timestamp)=>{
                lwsdk.log("获取返回", timestamp);
                var date = new Date(timestamp);
             });
             */
            getServerTime(success, fail) {
                this.Post(this.ip2 + this.time, {}, function (d) {
                    if (!d || d.c != 1) {
                        fail && fail(null);
                        return;
                    }
                    if (d.c === 1) {
                        success && success(d.nowTime * 1000);
                    }
                });
            }
            /**
             对时间格式化 formatTime (时间格式化)
             @param {Date} time 时间
             @param {String} type 类型 date or time
             @param {String} split 分隔符 / - : 空
             @example 示例:
             var time = lwsdk.formatTime(new Date(),"date",""); 20180920
             var time = lwsdk.formatTime(new Date(),"time",""); 20180920122324
             */
            formatTime(time, type, split) {
                var self = this;
                var mat = {};
                mat.M = time.getMonth() + 1; //月份记得加1
                mat.H = time.getHours();
                mat.s = time.getSeconds();
                mat.m = time.getMinutes();
                mat.Y = time.getFullYear();
                mat.D = time.getDate();
                mat.d = time.getDay(); //星期几
                mat.d = self.formatZero(mat.d);
                mat.H = self.formatZero(mat.H);
                mat.M = self.formatZero(mat.M);
                mat.D = self.formatZero(mat.D);
                mat.s = self.formatZero(mat.s);
                mat.m = self.formatZero(mat.m);
                if (type == "date") {
                    if (split.indexOf(":") > -1) {
                        mat.Y = mat.Y.toString().substr(2, 2);
                        return mat.Y + "/" + mat.M + "/" + mat.D;
                    }
                    else if (split.indexOf("/") > -1) {
                        return mat.Y + "/" + mat.M + "/" + mat.D;
                    }
                    else if (split.indexOf("-") > -1) {
                        return mat.Y + "-" + mat.M + "-" + mat.D;
                    }
                    else if (split.indexOf("-") > -1) {
                        return mat.Y + "-" + mat.M + "-" + mat.D;
                    }
                    else {
                        return mat.Y + mat.M + mat.D;
                    }
                }
                else {
                    if (split.indexOf(":") > -1) {
                        mat.Y = mat.Y.toString().substr(2, 2);
                        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
                    }
                    else if (split.indexOf("/") > -1) {
                        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
                    }
                    else if (split.indexOf("-") > -1) {
                        return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + "-" + mat.m + "-" + mat.s;
                    }
                    else if (split.indexOf("-") > -1) {
                        return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + "-" + mat.m + "-" + mat.s;
                    }
                    else {
                        return mat.Y + mat.M + mat.D + mat.H + mat.m + mat.s;
                    }
                }
            }
            formatZero(str) {
                str = str.toString();
                if (str.length < 2) {
                    str = '0' + str;
                }
                return str;
            }
            getUploadRowCount() {
                let config4 = this.getConfig(4);
                let res = config4 ? config4.uploadRowCount : sdk_conf_1.default.default_upload_row_count;
                return res;
            }
            getUploadInterval() {
                let config4 = this.getConfig(4);
                let res = config4 ? config4.uploadInterval : sdk_conf_1.default.default_upload_interval;
                // var res = sdk_conf.default_upload_interval;
                // try {
                //   res = this.getConfig(4).uploadInterval;
                //   if (!res) {
                //     res = sdk_conf.default_upload_interval;
                //   }
                // } catch (e) {
                //   res = sdk_conf.default_upload_interval;
                // }
                return res;
            }
            /**
             将事件信息发送到乐玩服务器记录 uploadSceneEvent(将事件信息发送到乐玩服务器记录)
             @param {JsonArray} eventJsonArray 要上传的json数组
             @apiDeprecated 废弃，sdk内部调用，外部一般调用这个方法即可 (#B:setSceneEvent)
             @example 示例：
             lwsdk.uploadSceneEvent(null,'游戏结束',null)   //游戏上传场景数据
             lwsdk.uploadSceneEvent(jsonArray,'',null)      //将要上传的数据传递过来
             */
            uploadSceneEvent(eventJsonArray, uploadEvent, callbackFunction) {
                var self = this;
                var lastUploadDataTime = self.getItem("lastUploadDataTime");
                var nowTime = new Date().getTime() / 1000;
                self.log("nowTime:" + nowTime + ";lastUploadDataTime:" + lastUploadDataTime);
                if (!lastUploadDataTime) {
                    //上次更新时间没有就等于当前时间
                    lastUploadDataTime = nowTime;
                    self.setItem("lastUploadDataTime", lastUploadDataTime);
                }
                let uploadRowCount = self.getUploadRowCount();
                let uploadInterval = self.getUploadInterval();
                if (!eventJsonArray) {
                    let eventData = self.getItem("eventData");
                    if (eventData) {
                        eventJsonArray = JSON.parse(eventData);
                    }
                }
                if (eventJsonArray) {
                    if (eventJsonArray.data.length >= uploadRowCount) {
                        uploadEvent = "数据累计(" + uploadRowCount + "条)上传";
                    }
                    else if ((nowTime - lastUploadDataTime) >= uploadInterval) {
                        uploadEvent = "定时(" + uploadInterval + "秒)上传";
                    }
                    self.log(uploadEvent);
                    self.uploadData(eventJsonArray, uploadEvent, callbackFunction);
                }
                // if (eventJsonArray === null) {
                //   //如果没有传递要上传的数据
                //   var eventData = self.getItem("eventData");
                //   try {
                //     eventJsonArray = JSON.parse(eventData);
                //     self.log(uploadEvent);
                //     self.uploadData(eventJsonArray, uploadEvent, callbackFunction);
                //   } catch (e) {
                //     // self.log("埋点没有数据上传!");
                //   }
                // } else if (eventJsonArray.data.length >= uploadRowCount) {
                //   uploadEvent = "数据累计(" + uploadRowCount + "条)上传";
                //   self.log(uploadEvent);
                //   self.uploadData(eventJsonArray, uploadEvent, callbackFunction);
                // } else if ((nowTime - lastUploadDataTime) >= uploadInterval) {
                //   uploadEvent = "定时(" + uploadInterval + "秒)上传";
                //   self.log(uploadEvent);
                //   self.uploadData(eventJsonArray, uploadEvent, callbackFunction);
                // }
            }
            uploadData(eventJsonArray, uploadEvent, callbackFunction) {
                var self = this;
                var nowTime = new Date().getTime() / 1000;
                eventJsonArray.upload_event = uploadEvent;
                //达到一定数量级
                self.log("uploadData :", eventJsonArray);
                self.commonLog("SceneEventLog", eventJsonArray, (d) => {
                    callbackFunction && callbackFunction(d);
                });
                // self.Post(self.ip3 + self.Logcommon, {
                //   log_type: "SceneEventLog",
                //   data: JSON.stringify(eventJsonArray)
                // }, function (d) {
                //   if (callbackFunction) {
                //     callbackFunction(d);
                //   }
                // });
                //上传完了之后删除数据
                self.removeItem("eventData");
                self.setItem("lastUploadDataTime", nowTime);
            }
            /**
             * 判断目标是否为整数
             @param obj 待判断的目标参数
             */
            isInteger(obj) {
                return Math.floor(obj) === obj;
            }
            /**
             *
             @param eventId 事件ID 通常谢按钮的英文或者中文名字，比如：首页-开始闯关
             @param eventType 事件类型，比如：点击、加载、曝光等
             @param sceneName 场景名称，比如：加载界面，主界面，第1关,第2关，厨房，矿坑
             @example
             ```js
             lwsdk.sendEvent({ eventId: '首页-开始游戏', eventType: '点击', sceneName: '主界面', callback: (res) => {console.log(res)} });
             ```
             */
            sendEvent({ eventId, eventType, sceneName, callback }) {
                this.setSceneEvent(sceneName, eventType, eventId, undefined, callback);
            }
            /**
             一般用于事件埋点上报 setSceneEvent(存) 将事件信息发送到乐玩服务器记录
             @param {String} sceneName 场景名称，比如：第1关,第2关，厨房，矿坑
             @param {String} eventName 事件名称，比如：点击、加载、触摸、移动
             @param {String} eventId 事件ID 通常谢按钮的英文或者中文名字，比如：首页-开始闯关
             @param {JSON} params 参数相关
             @param {function} callbackFunction 回调函数
             @example 示例:
               // 关卡埋点规则
              sceneName: [场景名称]第[整数]关
              eventId: [任意字符]进入[任意字符]、[任意字符]成功[任意字符]、[任意字符]失败[任意字符]
              lwsdk.setSceneEvent("生涯模式第1关","加载","进入关卡",{'uid':'8975621'},null)
              lwsdk.setSceneEvent("生涯模式第1关","点击","关卡成功",{'uid':'8975621'},null)
              lwsdk.setSceneEvent("生涯模式第1关","点击","关卡失败",{'uid':'8975621'},null)
             lwsdk.setSceneEvent("第一关","点击","首页-开始闯关",{'uid':'8975621'},null)
             
             例：lwsdk.setSceneEvent("场景名称","事件名称","事件ID",function(){});
             */
            setSceneEvent(sceneName, eventName, eventId, params, callbackFunction) {
                var self = this;
                if (!self.fitPlatform()) {
                    return;
                }
                let user = self.getUser();
                var uid = user ? user.uid : null;
                // try {
                //   uid = self.getUser().uid;
                // } catch (e) {
                //   // uid = "noid_" +
                //   //   (new Date()).getTime() +
                //   //   "_" +
                //   //   (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
                //   //   (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                // }
                if (!uid) {
                    return;
                }
                var eventData = self.getItem("eventData");
                var deviceModel = self.getItem('deviceModel');
                var eventJsonArray = {};
                var data = [];
                if (eventData) {
                    eventJsonArray = JSON.parse(eventData);
                    data = eventJsonArray.data;
                    //self.log("已经存在:"+data);
                }
                var insertData = {
                    uid: uid,
                    scene_name: sceneName,
                    event_id: eventId,
                    event_name: eventName,
                    params: JSON.stringify(params),
                    device_model: deviceModel,
                    event_time: self.formatTime(new Date(), "time", "-")
                };
                //self.log("添加数据",JSON.stringify(insertData));
                data.push(insertData);
                eventJsonArray.data = data;
                //self.log("添加后:"+JSON.stringify(eventJsonArray.data));
                self.setItem("eventData", JSON.stringify(eventJsonArray));
                self.uploadSceneEvent(eventJsonArray, '', callbackFunction);
            }
            /**
             * 自定义事件上报（微信小游戏官方）
             * @param {string} branchId 事件id
             * @param {string} [branchDim] 自定义维度(可选)：取值[1,100]，必须为整数，当上传类型不符时不统计
             * @param {number} eventType 1：曝光； 2：点击。默认值为2
             * @example
              ```js
                lwsdk.wxSendEvent({
                  branchId: 'aftcE_rCid',
                  eventType: 2
                }
              ```
             */
            wxSendEvent({ branchId, eventType = 2, branchDim }) {
                var self = this;
                if (!self.fitPlatform()) {
                    return;
                }
                if (!branchId) {
                    self.error('branchId', errMsg_1.default[1003]);
                    return;
                }
                if (!wx.reportUserBehaviorBranchAnalytics) {
                    self.error('wx.reportUserBehaviorBranchAnalytics', errMsg_1.default[1004], wx.getSystemInfoSync());
                    return;
                }
                var data = { branchId: branchId, eventType: eventType };
                self.log('wx.reportUserBehaviorBranchAnalytics is ok', data);
                let temp = Number(branchDim);
                if (temp) {
                    // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
                    if (!self.isInteger(branchDim) || temp < 1 || temp > 100) {
                        self.error('branchDim', '仅支持1-100的整数');
                    }
                    else {
                        data.branchDim = String(temp);
                    }
                }
                wx.reportUserBehaviorBranchAnalytics(data);
            }
            // /**
            //  @apiGroup A
            //  @apiName getButtonConfig
            //  @api {数据存储} 数据存储 getButtonConfig（获取按钮配置）视频或分享切换
            //  @param {String} buttonKey 按钮的键值 比如 hz2 hz3
            //  @deprecated
            //  @example {json} 示例:
            //  var d = lwsdk.getButtonConfig2("xxx",1);
            //  //特别说明：对于视频分享切换的解析返回的json为：
            //  //{"type":"share","count":5,"left_count":3,"use_count":2,"next":"key_1"}
            //  //技术获取之后根据d.type判断类型然后做响应处理就可以了;
            //  */
            // getButtonConfig(buttonKey) {
            //   return this.getButtonConfig2(buttonKey, 1);
            // }
            /**
             @apiGroup C
             @apiName getButtonConfig
             @api {数据存储} 数据存储 getButtonConfig（取）
             @param {String} buttonKey 按钮的键值 比如 hz2 hz3
             @param {int} isCount 值为1或者0  1：表示本次调用使用次数加一;0：表示本次调用使用次数不发生变化
             @apiDeprecated 废弃，外部替代使用为 (#A:getButtonConfig)
             @example {json} 示例:
             var d = lwsdk.getButtonConfig2("xxx",1);
             特别说明：对于视频分享切换的解析返回的json为：
             {"type":"share","count":5,"left_count":3,"use_count":2,"next":"key_1"}
             技术获取之后根据d.type判断类型然后做响应处理就可以了;
             */
            getButtonConfig2(buttonKey, isCount = 0) {
                var self = this;
                var c3 = self.getConfig(3);
                if (c3.length > 0) {
                    for (var i = 0; i < c3.length; i++) {
                        var c = c3[i];
                        if (c.key === buttonKey) {
                            var dl = c.date_list;
                            for (var i = 0; i < dl.length; i++) {
                                var d = dl[i];
                                var nowTime = new Date().getTime();
                                var date = self.formatTime(new Date(), "date", "");
                                if (nowTime >= d.s_time && nowTime <= d.e_time) {
                                    if (c.type === 'mix') {
                                        let ddata = d.data;
                                        let dataStart = ddata.start;
                                        var countKey = buttonKey + ":" + date + ":" + i + ":count";
                                        var count = self.getItem(countKey) || 1;
                                        self.log(buttonKey + "->" + countKey, count); // log
                                        var startKey = buttonKey + ":" + date + ":" + i + ":start:" + dataStart.type + ":" + count;
                                        var startVal = self.getItem(startKey) || 0;
                                        self.log(buttonKey + "->" + startKey, startVal); // log
                                        if (Number(startVal) >= Number(dataStart.count)) {
                                            return self.nextConfig(buttonKey, date, ddata, dataStart.next, i, count, isCount);
                                        }
                                        else {
                                            //当前记录的次数小于配置次数
                                            if (isCount == 1) {
                                                startVal++;
                                                self.setItem(startKey, startVal);
                                                dataStart.left_count = dataStart.count - startVal;
                                                dataStart.use_count = startVal;
                                            }
                                            else {
                                                dataStart.left_count = dataStart.count - startVal;
                                                dataStart.use_count = startVal;
                                            }
                                            return dataStart;
                                        }
                                    }
                                    else {
                                        return d;
                                    }
                                }
                            }
                        }
                    }
                    return null;
                }
                else {
                    return null;
                }
            }
            nextConfig(buttonKey, date, data, nextKey, i, count, isCount) {
                var self = this;
                if (nextKey == 'end') {
                    return null;
                }
                let nextData = data[nextKey];
                var nextCacheKey = buttonKey + ":" + date + ":" + i + ":" + nextKey + ":" + nextData.type + ":" + count;
                var nextCacheVal = self.getItem(nextCacheKey);
                self.log("nextConfig->" + nextCacheKey, nextCacheVal);
                if (!nextCacheVal) {
                    nextCacheVal = 1;
                }
                else {
                    nextCacheVal = nextCacheVal + 1;
                }
                //计数的话
                // if (isCount == 1) {
                //   self.setItem(nextCacheKey, nextCacheVal);
                // }
                if (nextCacheVal > nextData.count) {
                    //当前缓存中的记录当前key的次数已经超过配置次数
                    if (nextData.next == 'start') {
                        var countKey = buttonKey + ":" + date + ":" + i + ":count";
                        count = count + 1;
                        self.setItem(countKey, count);
                    }
                    //往下递归
                    return self.nextConfig(buttonKey, date, data, nextData.next, i, count, isCount);
                }
                else {
                    //计数的话
                    if (isCount == 1) {
                        self.setItem(nextCacheKey, nextCacheVal);
                        nextData.left_count = nextData.count - nextCacheVal;
                        nextData.use_count = nextCacheVal;
                    }
                    return nextData;
                }
            }
            /**
             @apiGroup C
             @apiName navigateToMiniProgram
             @api {跳转到小程序} 跳转到小程序或者小游戏注意有时间限定 navigateToMiniProgram(跳转到小程序)
             @param {json} config json包含app_id,path,extraData,env_version
             @param {fucntion} success 成功返回
             @param {fucntion} fail 失败返回
             @param {fucntion} complete 完成返回
             
             @example {json} 示例:
             var d = lwsdk.getButtonConfig('hz2');
             lwsdk.navigateToMiniProgram(d);
             */
            navigateToMiniProgram(config, successCallback = null, failCallback = null, complete = null) {
                if (!this.fitPlatform()) {
                    return;
                }
                if (this.isTouTiao()) {
                    console.warn('tt is not support navigateToMiniProgram');
                    if (tt.showMoreGamesModal) {
                        tt.showMoreGamesModal({
                            appLaunchOptions: [{
                                appId: config.app_id,
                                query: config.path,
                                extraData: {}
                            }
                                // {...}
                            ],
                            success(res) {
                                console.log("success", res.errMsg);
                            },
                            fail(res) {
                                console.log("fail", res.errMsg);
                            }
                        });
                    }
                    return;
                }
                // this.setWeChatAdEvent("/", 1, {}, null);
                wx.navigateToMiniProgram({
                    appId: config.app_id,
                    path: config.path,
                    extraData: config.extra,
                    envVersion: config.env_version,
                    success: (res) => {
                        // console.log("小程序跳转成功",res);
                        successCallback && successCallback(res);
                    },
                    fail: (err) => {
                        this.log(err);
                        failCallback && failCallback(err); //点击小游戏，又不跳转，将状态恢复默认
                        // console.log("小程序跳转失败",res,LWGlobal.clickShiwan);
                    },
                    complete: () => {
                    },
                });
            }
            /**
             {调用分享或视频} 调用分享或视频 shareOrVideo(调用分享或视频)
             @param {object} obj 参数集合的对象
             @param {String} [obj.buttonKey] 按钮对应的key，乐玩后台配置
             @param {callback} [obj.success] 成功回调
             @param {callback} [obj.fail] 失败回调
             @example 示例:
             var fail = function (type) {
                // type 的值可能为 share/video/none 分别对应 分享失败/视频未看完/当天通过分享或视频奖励次数已用完
                if (type === 'share'){
          
                } else if (type === 'video') {
                  
                } else if (type === 'none') {
                    
                }
             }
             lwsdk.shareOrVideo({buttonKey:"xxx",autoShare: true, success: ()=>{},fail: fail});
             */
            shareOrVideo({ buttonKey, shareType = 1, autoShare = true, success, fail, onSuccess, onFail }) {
                var self = this;
                success = success || onSuccess || function () { };
                fail = fail || onFail || function () { };
                console.log("<<<<<<<!self.fitPlatform()", !self.fitPlatform());
                if (!self.fitPlatform()) {
                    success('video');
                    return;
                }
                console.log("<<<<<<<!self.isInit()", !self.isInit());
                if (!self.isInit()) {
                    return;
                }
                console.log(buttonKey)
                var d = self.getButtonConfig2(buttonKey, 1);
                console.log("<<<<<<<d", d);
                if (false) {//(!d) {
                    // self.log('没有获取到按钮配置数据或已达到后台配置使用的最大次数');
                    fail("none");
                    return;
                }
                var shareFun = function () {
                    self.shareAppMessage({
                        type: shareType,
                        query: "",
                        success: function () {
                            success("share");
                        },
                        cancel: function () {
                            fail("share");
                        }
                    });
                };
                if (false) {// (d.type == 'share') {
                    //凋起分享
                    shareFun();
                }
                else {
                    //调起视频
                    var videoAdUnitId = self.getVideoAdUnitId(buttonKey);
                    console.log("<<<<<<<<<<<<<videoAdUnitId", videoAdUnitId)
                    if (!videoAdUnitId) {
                        self.error('can not find videoAd UnitId');
                        shareFun();
                        return;
                    }
                    self.videoSuccess = function () {
                        //视频看完处理逻辑
                        self.videoCloseLog(self.currentVideoId, 1);
                        success("video");
                    };
                    self.videoFail = function () {
                        //视频未看完处理逻辑
                        self.videoCloseLog(self.currentVideoId, 2);
                        fail("video");
                    };
                    self.videoError = function () {
                        //视频凋起失败处理逻辑，要么就是广告id没有或者是调起视频广告太频繁微信限制调起，这里一般都会改成去调起分享
                        self.videoCloseLog(self.currentVideoId, 2);
                        if (autoShare) {
                            shareFun();
                        }
                        else {
                            fail("video");
                        }
                    };
                    var video = self.createVideoAd(videoAdUnitId);
                    video.load().then(() => video.show());
                    self.videoShowLog(self.currentVideoId);
                }
            }
            createVideoAd(videoAdUnitId) {
                // this.setWeChatAdEvent("/", 1, {}, null);
                return this.videoAd || this.createRewardedVideoAd(videoAdUnitId);
            }
            /**
             该方法不直接对外提供调用
             @param {string} videoAdUnitId1
             
             */
            createRewardedVideoAd(videoAdUnitId1) {
                let self = this;
                if (self.fitPlatform()) {
                    let videoAd = wx.createRewardedVideoAd({ adUnitId: videoAdUnitId1 });
                    if (self.isOnce) {
                        self.isOnce = false;
                        videoAd.onLoad(function (res) {
                            self.log("sdk VideoAd onLoad:", res);
                        });
                        var closeFun1 = function (res) {
                            // 用户点击了【关闭广告】按钮
                            // 小于 2.1.0 的基础库版本，res 是一个 undefined
                            if (res && res.isEnded || res === undefined) {
                                self.videoSuccess();
                            }
                            else {
                                self.videoFail();
                            }
                        };
                        videoAd.onClose(closeFun1);
                        videoAd.onError(function () {
                            wx.showToast({
                                title: '今日视频已上限，明日再来！',
                                icon: 'none'
                            });
                            if (self.videoError) {
                                self.videoError();
                            }
                        });
                    }
                    this.videoAd = videoAd;
                    return videoAd;
                }
            }
            /**
             获取对应按钮的视频广告单元id
             @param {String} location 位置：后台配置应该跟按钮的key对应一样
             */
            getVideoAdUnitId(location) {
                var config5 = this.getConfig(5);
                if (!config5) {
                    return null;
                }
                var distData = null;
                for (var i in config5) {
                    if (config5[i].location === location) {
                        distData = config5[i];
                        break;
                    }
                }
                if (!distData) {
                    this.error(`no video config of location ${location}`);
                    return null;
                }
                this.currentVideoId = distData.video_id;
                if (distData.continued_refresh === "1") {
                    return distData.adunit_id[0];
                }
                if (!this.videoAdUnitIdIndex.hasOwnProperty(location)) {
                    this.videoAdUnitIdIndex[location] = 0;
                    return distData.adunit_id[0];
                }
                var index = this.getNewArrayIndex(this.videoAdUnitIdIndex[location], distData.adunit_id.length);
                this.videoAdUnitIdIndex[location] = index;
                return distData.adunit_id[index];
            }
            /**
             按顺序循环返回数组元素的新索引
             @param {Number} index 当前索引
             @param {Number} length 数组长度
             */
            getNewArrayIndex(index, length) {
                if (index < length - 1) {
                    index++;
                    return index;
                }
                return 0;
            }
            /**
             视频展示上报日志
             @param {*} videoId 后台生成的视频id
             */
            videoShowLog(videoId) {
                var data = {
                    video_id: videoId,
                    uid: this.getUser().uid
                };
                this.commonLog('VideoClick', data);
            }
            /**
             视频关闭上报日志
             @param {*} videoId 后台生成的视频id
             @param {*} status 成功状态，看完视频为：1，否则为：2
             */
            videoCloseLog(videoId, status) {
                var data = {
                    video_id: videoId,
                    uid: this.getUser().uid,
                    status: status
                };
                this.commonLog('VideoStatus', data);
            }
            /**
             点击分享上报日志
             */
            shareTypeClickLog(shareId, type) {
                // var data = {
                //   share_id: shareId,
                //   uid: this.getUser().uid,
                //   type: type
                // }
                // this.commonLog('ShareTypeClick', data);
            }
            /**
             分享成功或失败上报日志
             @param {*} shareId 分享素材id
             @param {*} type 分享素材位置类型
             @param {Number} status 分享成功：1，分享失败：2
             */
            shareTypeClickStatusLog(shareId, type, status) {
                // var data = {
                //   share_id: shareId,
                //   uid: this.getUser().uid,
                //   type: type,
                //   status: status
                // }
                // this.commonLog('ShareTypeClickStatus', data);
            }
            /**
             分享进入上报日志
             @param {Object} option 包含query等参数
             */
            shareTypeEnterLog(option) {
                // this.commonLog('ShareTypeEnter', option);
            }
            /**
             后台日志上报接口
             @param {String} log_type 日志上报类型
             @param {Object} data 日志上报数据
             */
            commonLog(log_type, data, callback = null) {
                var self = this;
                var maxCount = self.tryLogMaxCount;
                var tryCount = 0;
                var tryLog = function (log_type, data) {
                    if (tryCount >= maxCount) {
                        return;
                    }
                    tryCount++;
                    self.log(log_type + 'ad data try to report', JSON.stringify(data));
                    self.Post(self.ip3 + self.Logcommon, {
                        log_type: log_type,
                        data: JSON.stringify(data)
                    }, function (d) {
                        callback && callback(d);
                        if (!d || d.c != 1) {
                            setTimeout(() => {
                                tryLog(log_type, data);
                            }, 0.5 * 1000);
                        }
                    });
                };
                tryLog(log_type, data);
            }
            /**
             {后台按钮开关} 游戏后台配置信息，运营人员使用的通用配置开关控制，一般用于控制游戏内容的显示和隐藏。返回布尔值，true代表开关打开，false代表关闭
             @param {string} buttonKey 开关的key，由运营提供，比如'SHARE'
             @example 示例:
             if(!sdk.getButtonVisible('SHARE')){
                //这里可以控制内容隐藏
             } else {
               
             }
             */
            getButtonVisible(buttonKey) {
                if (!this.fitPlatform())
                    return true;
                if (!this.isInit()) {
                    return false;
                }
                let config1 = this.getConfig(1);
                if (!config1 || config1[buttonKey] == 0) {
                    return false;
                }
                else {
                    // return true;
                    var limitConfig = this.getConfig(7);
                    if (!limitConfig) {
                        // 限制配置不存在
                        this.log('限制配置不存在');
                        return true;
                    }
                    let limitData = limitConfig.data;
                    if (typeof limitData === 'string') {
                        limitData = JSON.parse(limitData);
                        limitConfig.data = limitData;
                    }
                    if (!limitData || !limitData[buttonKey]) {
                        // 不是限制类型的开关
                        this.log('不是限制类型的开关');
                        return true;
                    }
                    var options = wx.getLaunchOptionsSync();
                    if (!options) {
                        // 没有获取到启动参数
                        this.log('can not get lauch options');
                        return true;
                    }
                    if (this.checkScene(buttonKey, limitConfig, options.scene) || !this.checkPath(buttonKey, limitConfig, options.query) || this.checkCity(buttonKey, limitConfig)) {
                        return false;
                    }
                    return true;
                }
            }
            /**
             检测场景值是否在黑名单里
             @param {*} btnName
             @param {*} limitConfig
             @param {*} scene
             */
            checkScene(btnName, limitConfig, scene) {
                var btnData = limitConfig.data[btnName];
                if (btnData.scene_switch == 0) {
                    // 没开启场景检测
                    this.log('scene_switch is off');
                    return false;
                }
                if (limitConfig.scenedata.indexOf(scene) > -1) {
                    this.log('scene value is on the blacklist');
                    return true;
                }
                this.log('scene value is not on the blacklist');
                return false;
            }
            /**
             检测路径是否在白名单里
             @param {*} btnName
             @param {*} limitConfig
             @param {*} query
             */
            checkPath(btnName, limitConfig, query) {
                var btnData = limitConfig.data[btnName];
                if (btnData.url_switch == 0) {
                    // 没开启路径检测
                    this.log('url_switch is off');
                    return true;
                }
                if (limitConfig.urldata.indexOf(this.queryToPath(query)) > -1) {
                    this.log('url is in the whitelist');
                    return true;
                }
                this.log('url is not in the whitelist');
                return false;
            }
            /**
             检测IP城市是否在黑名单里
             @param {*} btnName
             @param {*} limitConfig
             */
            checkCity(btnName, limitConfig) {
                var btnData = limitConfig.data[btnName];
                if (btnData.city_switch == 0) {
                    // 没开启IP城市检测
                    this.log('city_switch is off');
                    return false;
                }
                if (limitConfig.cityLimit == 1) {
                    this.log('city_ip is on the blacklist');
                    return true;
                }
                this.log('city_ip is not on the blacklist');
                return false;
            }
            /**
             路径的query转换成路径字符串
             @param {*} query 启动小游戏的 query 参数
             */
            queryToPath(query) {
                if (!query) {
                    return null;
                }
                var path = '?';
                for (var key in query) {
                    path += `${key}=${query[key]}&`;
                }
                if (path == '?') {
                    return null;
                }
                if (path.lastIndexOf('&') > 0) {
                    path = path.substr(0, path.length - 1);
                }
                return path;
            }
            /**
             是否头条系平台
             */
            isTouTiao() {
                return typeof tt !== 'undefined';
            }
            /**
             是否微信平台
             */
            isWeiXin() {
                return typeof wx !== 'undefined' && (typeof tt === 'undefined' && typeof qq === 'undefined');
            }
            isBrowser() {
                return !!(window && window.navigator && window.navigator.appName);
            }
            /**
             修改对应icon的试玩状态为1:已经试玩过了
             @param {*} config_id 配置id
             @param {*} iconid icon图标的id
             */
            setTryPlayStatus(config_id, iconid) {
                var self = this;
                if (!self.diversionData) {
                    self.error('sdk no diversionData, please check');
                    return null;
                }
                let data = self.diversionData.data;
                for (var key1 in data) {
                    let dataItem = data[key1];
                    if (dataItem.config_id == config_id) {
                        for (var key2 in dataItem.icondata) {
                            let dataItemIcon = dataItem.icondata[key2];
                            if (dataItemIcon.iconid == iconid) {
                                dataItemIcon.try_status = 1;
                                self.log('修改icondata的try_status状态成功', iconid, dataItemIcon.try_status);
                                return;
                            }
                        }
                    }
                }
            }
            /**
             获取卖量导流位相关数据
             @param {function} callback 回调方法
             */
            getDiversionData() {
                var self = this;
                return new Promise((resolve, reject) => {
                    self.Get(self.ip4 + '/uploadfile/advertis/' + sdk_conf_1.default.game + '.json', null, function (res) {
                        if (res && typeof res === 'object') {
                            var data = self.formatDiversionData(res);
                            for (var i = 0; i < data.length; i++) {
                                let di = data[i];
                                if (di && di.data) {
                                    for (var j = 0; j < di.data.length; j++) {
                                        for (var key in di) {
                                            if (key != 'data') {
                                                di.data[j][key] = di[key];
                                            }
                                        }
                                    }
                                }
                            }
                            self.diversionData = data;
                            resolve(true);
                        }
                        else {
                            reject(false);
                        }
                    });
                    return;
                });
            }
            /**
             对原始数据结构进行重构
             @param {Object} sourceData 拉取回来的原始数据
             */
            formatDiversionData(sourceData) {
                var self = this;
                if (!sourceData || typeof sourceData !== 'object') {
                    self.error('no export ad config, please check');
                    return;
                }
                var configData = sourceData.configData;
                var iconData = sourceData.iconData;
                var locationConfig = sourceData.locationConfig;
                var locationData = sourceData.locationData;
                //过滤符合版本号的数据
                var configIds = []; //符合版本的config_id集合
                configData = configData.filter((item, index) => {
                    var temp1 = 1; // 取消版本限制，如需打开，切换回上面的变量即可
                    var temp2 = 1; // 取消版本限制，如需打开，切换回上面的变量即可
                    if (temp1 !== -1 && temp2 !== -1) {
                        configIds.push(Number(item.config_id));
                        return true;
                    }
                    else {
                        // console.log(index + '：数据不符合版本，被过滤', item);
                        return false;
                    }
                });
                //重构数据
                for (var j = 0; j < locationData.length; j++) {
                    var lid = locationData[j].location_id;
                    var temp3 = locationConfig.filter(item => {
                        return item.gal_id == lid && configIds.includes(Number(item.gac_id));
                    });
                    var temp4 = [];
                    let tempArr = [4, 5, 7];
                    if (tempArr.includes(Number(locationData[j].strategy))) {
                        temp3.forEach((item, index) => {
                            var gac_id = item.gac_id;
                            var cData = configData.filter(item => {
                                return item.config_id == gac_id;
                            })[0];
                            if (cData && locationData[j].gc_status != 1) {
                                cData.gold = 0;
                            }
                            var tempIconData = iconData && iconData.filter(item => {
                                return item.gac_id == gac_id;
                            }) || [];
                            if (!tempIconData || tempIconData.length === 0) {
                                var tempObj = {};
                                self.extend(tempObj, cData);
                                temp4.push(tempObj);
                            }
                            else {
                                tempIconData.forEach((item, index) => {
                                    var tempObj = {};
                                    self.extend(tempObj, cData, item);
                                    temp4.push(tempObj);
                                });
                            }
                        });
                    }
                    else {
                        temp3.forEach((item, index) => {
                            var gac_id = item.gac_id;
                            var cData = configData.filter(item => {
                                return item.config_id == gac_id;
                            })[0];
                            if (cData && locationData[j].gc_status != 1) {
                                cData.gold = 0;
                            }
                            var tempIconData = iconData && iconData.filter(item => {
                                return item.gac_id == gac_id;
                            }) || [];
                            var tempObj = {};
                            self.extend(tempObj, cData);
                            tempObj.icondata = tempIconData;
                            temp4.push(tempObj);
                        });
                    }
                    temp3 = temp4;
                    locationData[j].data = temp3;
                }
                // console.log(locationData);
                return locationData;
            }
            /**
             对象继承
             @param {Object} target 目标对象
             @example 示例：
             var target = {};
             var extra1 = {a: 1};
             var extra2 = {b: 2};
             lwsdk.extend(target, extra1, extra2);
             console.log(target);
             */
            extend(target, ...optionalParams) {
                var sources = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < sources.length; i += 1) {
                    var source = sources[i];
                    if (source && typeof source == "object") {
                        for (var key in source) {
                            if (source.hasOwnProperty(key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                }
                return target;
            }
            /**
             根据位置获取对应的卖量导流数据
             @param {String} positionKey 位置key
             @example
             var data = lwsdk.getDiversionDataByKey('ceshi');
             */
            getDiversionDataByKey(positionKey) {
                var self = this;
                if (!positionKey) {
                    self.error('error in lwsdk.getDiversionDataByKey,positionKey 参数不能为空');
                    return null;
                }
                if (!self.diversionData) {
                    self.error('没有加载到后台配置的导流位广告数据，请检查网络或后台是否已配置。');
                    return null;
                }
                for (const key in self.diversionData) {
                    if (self.diversionData.hasOwnProperty(key)) {
                        const element = self.diversionData[key];
                        if (element.key === positionKey) {
                            return element;
                        }
                    }
                }
                return null;
            }
            /**
             获取重新排序处理后展示的数据
             @param {Object} positionKey 对应位置的key，该参数由我放运营提供
             @param {Number} showCount 需要展示的游戏数量，如果要取全部数据请填写 0
             @param {Number} index 索引值，默认第一个从0开始，需要调用者自行管理该参数的状态，函数返回值里包含index新的值，需要更新。每个不同展示的地方都需要独立管理index状态，一般重新打开展示场景（界面）可以重置为0
             @returns {object} {data:[],index:0,gc_status:1}//gc_status为1时代表是可以试玩的
             @example
             var positionKey = 'ceshi';//对应位置的key，该参数由我放运营提供
             var index1 = 0;//需要调用者自行管理该值得更新或重置
             var showCount = 1;//需要展示的游戏数量，如果要取全部数据请填写 0
             var data = lwsdk.getAdDataToShow({positionKey: positionKey,showCount: showCount,index: index1});
             //需要更新index1的值
             index1 = data.index;
             //sdk.getAdDataToShow返回的值数据结构如下:
             {
              "data": [{
                "name": "水果切切切",//游戏名
                "banner": "",//banner图
                "display_type": 2,//显示图，1：banner图；2：icon图
                "gc_status": 1,//值为1代表试玩模式，值为0代表非试玩模式
                "icon": "https://res.g.llewan.com/uploadfile/common/20200309/20200309173743_8354.png",//要显示的icon图
                "tx_switch": 0,//特效开光，1：开，0：关
                "label_switch": 0,//标签开关，1：开，0：关
                "try_status": 1//try_status属性存在并且等于1时代表已试玩
              }],
              "index": 1,//返回的新索引值，用于更新外部调用方法传进来的索引值
              "strategy": 6,//展示策略类型
              "gc_status": 1//值为1代表试玩模式，值为0代表非试玩模式
            }
             */
            getAdDataToShow({ positionKey, showCount, index }) {
                var self = this;
                if (!positionKey) {
                    self.error('error in lwsdk.getAdDataToShow,positionKey 参数不能为空');
                    return null;
                }
                var data = self.getDiversionDataByKey(positionKey);
                if (!data || !data.data || data.data.length === 0) {
                    self.error(positionKey + '对应的data数据不存在,或者因为最高版本号限制或着版本号不对应问题导致data为空数组，error in getAdDataToShow');
                    return null;
                }
                if (typeof showCount !== 'number' || typeof index !== 'number') {
                    self.error('showCount或index参数必须是number类型');
                    return null;
                }
                var dataCopy = self.clone(data);
                // var structure = 1;
                var distData = null;
                var strategy = Number(dataCopy.strategy);
                var displayType = dataCopy.display_type;
                var dataListCopy = dataCopy.data;
                // 当前showCount传0时，要取对应key的全部数据
                if (showCount === 0) {
                    showCount = dataListCopy.length;
                }
                distData = self.resortByRule(dataListCopy, showCount, index, strategy, displayType);
                var locationId = data.location_id;
                var configId = distData.data.map(item => {
                    return item.config_id;
                });
                var iconId = distData.data.map(item => {
                    return item.iconid;
                });
                distData.gc_status = data.gc_status;
                distData.display_type = data.display_type;
                self.advertisingLog(locationId, configId, iconId, 1); //曝光埋点上报
                self.log(distData);
                return distData;
            }
            resortByRule(data, showCount, index, strategy, displayType) {
                let self = this;
                if (!data) {
                    self.error('sort data is null');
                    return null;
                }
                let temp;
                switch (strategy) {
                    case 1:
                        temp = self.sortByWeight(data, 'weight');
                        break;
                    case 2:
                    case 3:
                    case 6:
                        temp = self.sortByOrder(data);
                        break;
                    case 4:
                        temp = self.sortByOrderAndWeight(data, 'icon_weight');
                        break;
                    case 5:
                        temp = self.sortByWeightAndOrder(data, 'icon_weight');
                        break;
                    case 7:
                        temp = self.sortByRandom(data);
                        break;
                    default:
                        temp = null;
                        break;
                }
                if (!temp) {
                    self.log(`Do not exist sort rule ${strategy}`);
                    return null;
                }
                let temp2 = self.getEnoughData(null, temp, showCount, index, strategy, displayType);
                return temp2;
            }
            /**
             获取足够数量的导流广告
             @param {*} distData 目标返回的数据
             @param {*} sourceData 源数据
             @param {*} leftCount 剩余数量
             @param {*} currentIndex 当前索引
             @param {*} strategy 策略类型 分别有1、2、3、4、5、6这几种
             */
            getEnoughData(distData, sourceData, leftCount, currentIndex, strategy, displayType) {
                var self = this;
                distData = distData || [];
                if (leftCount <= 0) {
                    return {
                        data: distData,
                        index: currentIndex,
                        strategy: strategy
                    };
                }
                var currentCount = 0;
                let added = currentIndex + leftCount;
                let flag = added <= sourceData.length;
                let max = flag ? added : sourceData.length;
                for (var i = currentIndex; i < max; i++) {
                    var element = sourceData[i];
                    if (displayType == 2) {
                        element = self.setIconDataToItem(element, strategy);
                    }
                    distData.push(element);
                    currentCount++;
                }
                leftCount -= currentCount;
                if (flag) { //开始取的索引加上数量没有超过数组长度
                    // for (var i = currentIndex; i < currentIndex + leftCount; i++) {
                    //   var element = sourceData[i];
                    //   if (displayType == 2) {
                    //     element = self.setIconDataToItem(element, strategy);
                    //   }
                    //   distData.push(element);
                    //   currentCount++;
                    // }
                    // leftCount -= currentCount;
                    currentIndex += currentCount;
                    if (currentIndex === sourceData.length) {
                        currentIndex = 0;
                    }
                }
                else {
                    // for (var j = currentIndex; j < sourceData.length; j++) {
                    //   var element = sourceData[j];
                    //   if (displayType == 2) {
                    //     element = self.setIconDataToItem(element, strategy);
                    //   }
                    //   distData.push(element);
                    //   currentCount++;
                    // }
                    // leftCount -= currentCount;
                    currentIndex = 0;
                }
                return self.getEnoughData(distData, sourceData, leftCount, currentIndex, strategy, displayType);
            }
            /**
             根据规则设置icon数据到item层数据上
             @param {*} element 游戏item数据
             @param {*} strategy 规则
             */
            setIconDataToItem(element, strategy) {
                var self = this;
                let iconData;
                if (strategy == 1 || strategy == 2) {
                    iconData = self.getOneIconDataByWeight(element.icondata);
                }
                else if (strategy == 3) {
                    iconData = self.getOneIconDataByWeightAndTryStatus(element.icondata);
                }
                else if (strategy == 6) {
                    iconData = self.getOneIconDataByWeightorder(element.icondata);
                }
                if (iconData) {
                    for (var key in iconData) {
                        element[key] = iconData[key];
                    }
                }
                return element;
            }
            /**
             随机排序并且相邻数据不能是同一款游戏（就是appid不能相同）
             */
            sortByRandom(data) {
                var self = this;
                if (!data || data.length === 0) {
                    return null;
                }
                // self.log('sortByRandom:1', data);
                var cloneData = self.clone(data);
                // self.log('sortByRandom:2', cloneData);
                var distData = new Array();
                var leftItemAppid = null;
                while (cloneData.length > 0) {
                    let index;
                    if (!leftItemAppid) {
                        index = self.randomIndex(cloneData);
                    }
                    else {
                        var temp = cloneData.filter((item, index) => {
                            item.tempIndex = index;
                            return item.appid != leftItemAppid;
                        });
                        if (temp.length > 0) {
                            var index2 = self.randomIndex(temp);
                            index = temp[index2].tempIndex;
                        }
                        else {
                            index = self.randomIndex(cloneData);
                        }
                    }
                    leftItemAppid = cloneData[index].appid;
                    distData.push(cloneData[index]);
                    cloneData.splice(index, 1);
                }
                return distData;
            }
            /**
             随机返回数组里面的一个元素的索引
             @param  {String} arr 产生随机结果的数组
             @return (200) {T} result 从arr中随机返回的元素
             @example
             var a = ['mac', 'iphone', 'vivo', 'OPPO'];
             console.log(sdk.randomIndex(a));
             
             */
            randomIndex(arr) {
                let n = Math.floor(Math.random() * arr.length + 1) - 1;
                return n;
            }
            /**
             根据序号小到大排序
             @param {*} data 待处理数据
             @example
             var data = lwsdk.getDiversionDataByKey('ceshi');
             var data2 = lwsdk.sortByOrder(data.data);
             */
            sortByOrder(data) {
                if (!data)
                    return null;
                var temp = data.sort(function (a, b) {
                    return a.sort - b.sort;
                });
                return temp;
            }
            /**
             根据权重大到小排序
             @param {Array} data 待处理数据
             @param {String} weightName 权重的key名
             @example
             var data = lwsdk.getDiversionDataByKey('ceshi');
             var data2 = lwsdk.sortByWeight(data.data, 'weight');
             */
            sortByWeight(data, weightName) {
                if (!data)
                    return null;
                var temp = data.sort(function (a, b) {
                    return b[weightName] - a[weightName];
                });
                return temp;
            }
            /**
             根据order小到大和权重大到小排序
             @param {Array} data 待处理数据
             @param {String} weightName 权重的key名
             @example
             var data = lwsdk.getDiversionDataByKey('ceshi');
             var data2 = lwsdk.sortByWeight(data.data, 'weight');
             */
            sortByOrderAndWeight(data, weightName) {
                if (!data)
                    return null;
                //先根据order排序
                data.sort(function (a, b) {
                    var result = 1;
                    if (a.sort < b.sort) {
                        result = -1;
                    }
                    return result;
                });
                //再按权重排序
                data.sort(function (a, b) {
                    var result = 1;
                    if (a.sort == b.sort && a[weightName] > b[weightName]) {
                        result = -1;
                    }
                    return result;
                });
                return data;
            }
            /**
             根据权重大到小和order小到大排序
             @param {Array} data 待处理数据
             @param {String} weightName 权重的key名
             @example
             var data = lwsdk.getDiversionDataByKey('ceshi');
             var data2 = lwsdk.sortByWeightAndOrder(data.data, 'weight');
             */
            sortByWeightAndOrder(data, weightName) {
                if (!data)
                    return null;
                //先根据权重大到小排序
                data.sort(function (a, b) {
                    var result = 1;
                    if (a[weightName] > b[weightName]) {
                        result = -1;
                    }
                    return result;
                });
                //再按order升序排序
                data.sort(function (a, b) {
                    var result = 1;
                    if (a[weightName] == b[weightName] && a.sort < b.sort) {
                        result = -1;
                    }
                    return result;
                });
                return data;
            }
            /**
             根据icon权重获取显示的icon图
             @param {*} data
             */
            getOneIconDataByWeight(data) {
                // var self = this;
                if (!data) {
                    // self.error('data不存在,getOneIconDataByWeight(data)');
                    return null;
                }
                var temp = [];
                for (var i in data) {
                    for (var j = 0; j < data[i].icon_weight; j++) {
                        temp.push(data[i]);
                    }
                }
                if (temp.length === 0) {
                    return null;
                }
                return this.getRandomValue(temp);
            }
            /**
             根据icon权重排序获取第一个作为显示的icon图
             @param {*} data
             */
            getOneIconDataByWeightorder(data) {
                var self = this;
                if (!data) {
                    // self.error('data不存在,getOneIconDataByWeight(data)');
                    return null;
                }
                var temp = self.sortByWeight(data.slice(0), 'icon_weight');
                if (temp.length === 0) {
                    return null;
                }
                return temp[0];
            }
            /**
             根据icon权重和试玩状态获取显示的icon图，优先没有试玩过的icon
             @param {*} data icon列表
             */
            getOneIconDataByWeightAndTryStatus(data) {
                // var self = this;
                if (!data) {
                    // self.error('data不存在,getOneIconDataByWeight(data)');
                    return null;
                }
                var temp = [];
                for (var i in data) {
                    for (var j = 0; j < data[i].icon_weight; j++) {
                        temp.push(data[i]);
                    }
                }
                if (temp.length === 0) {
                    return null;
                }
                var dataNotTry = temp.filter(item => {
                    return !item.try_status;
                });
                if (dataNotTry.length > 0) {
                    return this.getRandomValue(dataNotTry);
                }
                else {
                    return this.getRandomValue(temp);
                }
            }
            /**
             随机返回数组里面的一个元素
             @param  {Array} arr 产生随机结果的源数组
             @example
             var a = ['mac', 'iphone', 'vivo', 'OPPO'];
             console.log(sdk.getRandomValue(a));
             
             */
            getRandomValue(arr) {
                let n = this.randomIndex(arr); //Math.floor(Math.random() * arr.length + 1) - 1;
                return arr[n];
            }
            /**
             随机打乱数组
             @param  {arr} arr要打乱的数组
             @example
             var arr = ['mac', 'iphone', 'vivo', 'OPPO'];
             lwsdk.randomSort(arr);
             */
            randomSort(data) {
                data.sort(() => {
                    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
                    return Math.random() > 0.5 ? -1 : 1;
                });
            }
            /**
             上报试玩数据协议
             @param {*} icon_id 图标id
             @param {function} success 成功回调函数
             @param {function} fail 失败回调函数
             */
            tryPlayLog(icon_id, success, fail) {
                var self = this;
                self.Post(self.ip2 + '/adConfig/addtry', { uid: self.getUser().uid, icon_id: icon_id }, function (res) {
                    self.log(res);
                    if (res && res.c === 1) {
                        success && success(true);
                    }
                    else {
                        fail && fail();
                    }
                });
            }
            /**
             卖量广告行为日志上报
             @param {*} locationId 后台生成的位置的id
             @param {*} configId 配置id
             @param {*} iconId 标签(图标)id
             @param {1|2|3} type 1 曝光 2 点击 3跳转
             */
            advertisingLog(locationId, configId, iconId, type) {
                let key = '';
                switch (type) {
                    case 1:
                        key = 'AdvertisingExposure';
                        break;
                    case 2:
                        key = 'AdvertisingClick';
                        break;
                    case 3:
                        key = 'AdvertisingJump';
                }
                let self = this;
                let user = self.getUser();
                let data = {
                    location_id: locationId,
                    uid: user.uid || '',
                    config_id: configId,
                    icon_id: iconId
                };
                // if (self.debug) {
                //   console.log('开始卖量广告曝光日志上报')
                // }
                self.commonLog(key, data);
            }
            /**
             卖量广告曝光日志上报
             @param {*} locationId 后台生成的位置的id
             @param {*} configId 配置id
             @param {*} iconId 标签(图标)id
             @deprecated 调用 advertisingLog(locationId, configId, iconId, 1)
             */
            advertisingExposureLog(locationId, configId, iconId) {
                this.advertisingLog(locationId, configId, iconId, 1);
                // var self = this;
                // var data = {
                //   location_id: locationId,
                //   uid: self.getUser().uid,
                //   config_id: configId,
                //   icon_id: iconId
                // }
                // // if (self.debug) {
                // //   console.log('开始卖量广告曝光日志上报')
                // // }
                // self.commonLog('AdvertisingExposure', data);
            }
            /**
             卖量广告点击日志上报
             @param {*} locationId 后台生成的位置的id
             @param {*} configId 配置id
             @param {*} iconId 标签(图标)id
             @deprecated 调用 advertisingLog(locationId, configId, iconId, 2)
             */
            advertisingClickLog(locationId, configId, iconId) {
                this.advertisingLog(locationId, configId, iconId, 2);
                // var data = {
                //   location_id: locationId,
                //   uid: this.getUser().uid,
                //   config_id: configId,
                //   icon_id: iconId
                // }
                // // if (this.debug) {
                // //   console.log('开始卖量广告点击日志上报')
                // // }
                // this.commonLog('AdvertisingClick', data);
            }
            /**
             卖量广告跳转日志上报
             @param {*} locationId 后台生成的位置的id
             @param {*} configId 配置id
             @param {*} iconId 标签(图标)id
             @deprecated 调用 advertisingLog(locationId, configId, iconId, 3)
             */
            advertisingJumpLog(locationId, configId, iconId) {
                this.advertisingLog(locationId, configId, iconId, 3);
                // var data = {
                //   location_id: locationId,
                //   uid: this.getUser().uid,
                //   config_id: configId,
                //   icon_id: iconId
                // }
                // // if (this.debug) {
                // //   console.log('开始卖量广告跳转日志上报')
                // // }
                // this.commonLog('AdvertisingJump', data);
            }
            /**
             卖量功能需求可调用（乐玩导流位、互推功能）——调用该方法触发游戏跳转。
             @param {JSON} adItem 把当前点击的游戏item完整数据传进来，不用额外处理，类似：{appid: "wx99ef5bd0791407a1",name: "一起切水果",path: "?wxgamecid=CCBgAAoXkpQY97LalPGvHM&source_id=243",......}
             @param {function} [tryPlaySuccess] 试玩成功的回调，非必传，试玩模式的游戏可以传该参数。回调参数是奖励的金币gold。
             @param {function} [tryPlayFail] 试玩失败的回调，非必传，试玩模式的游戏可以传该参数。回调参数是失败原因。
             @param {function} [navigateToFail] 跳转失败的回调，非必传。回调参数是失败原因，包括点击取消和其他原因，按需自行判断使用。
             @example
             //这里只是举例，该变量是跟用户点击的游戏（广告）关联的数据
             var data = {
                "data": [{
                  "name": "水果切切切",//游戏名
                  "banner": "",//banner图
                  "display_type": 2,//显示图，1：banner图；2：icon图
                  "gc_status": 1,//值为1代表试玩模式，值为0代表非试玩模式
                  "icon": "https://res.g.llewan.com/uploadfile/common/20200309/20200309173743_8354.png",//要显示的icon图
                  "tx_switch": 0,//特效开光，1：开，0：关
                  "label_switch": 0,//标签开关，1：开，0：关
                  "try_status": 1//try_status属性存在并且等于1时代表已试玩
                }],
                "index": 1,//返回的新索引值，用于更新外部调用方法传进来的索引值
                "strategy": 6,//展示策略类型
                "gc_status": 1//值为1代表试玩模式，值为0代表非试玩模式
              };
             var adItem = data.data[0];//这里只是举例，该变量是跟用户点击的游戏（广告）关联的数据
             var navigateToFail = function (err) {
                
             }
             if (adItem.gc_status == 1 && !adItem.try_status) {
              var tryPlaySuccess = function (gold) {
                
              }
              var tryPlayFail = function (msg) {
                
              }
              lwsdk.onAdTouch (adItem, tryPlaySuccess, tryPlayFail, navigateToFail);
             }else{
              lwsdk.onAdTouch (adItem, null, null, navigateToFail);
             }
             */
            onAdTouch({ adItem, tryPlaySuccess, tryPlayFail, navigateToFail, navigateToSuccess }) {
                var self = this;
                var success = function (params) {
                    self.log('jump success');
                    navigateToSuccess && navigateToSuccess(params);
                    //跳转埋点上报 -- 跳转
                    self.advertisingLog(adItem.location_id, adItem.config_id, adItem.iconid, 3);
                    //检测是否满足试玩送金币条件
                    if (adItem.gc_status == 0 || adItem.try_status) {
                        //不满足试玩送金币条件
                        return;
                    }
                    self.tryPlaySetting = {
                        adItem: adItem,
                        tryPlaySuccess: tryPlaySuccess,
                        tryPlayFail: tryPlayFail,
                        startTime: Date.now()
                    };
                };
                //跳转埋点上报 -- 点击
                self.advertisingLog(adItem.location_id, adItem.config_id, adItem.iconid, 2);
                //弹出跳转授权允许弹出
                self.navigateToMiniProgram({ app_id: adItem.appid, path: adItem.path }, success, navigateToFail);
            }
            /** 获取默认banner样式 */
            getBannerStyle(bottomOffset = 0, defaultWidthDiff = 20, bannerWidth) {
                let self = this;
                if (!self.sysInfo) {
                    self.sysInfo = wx.getSystemInfoSync();
                }
                let phone = self.sysInfo;
                let safeAreaBottomOffset = 0;
                let screenW = phone.screenWidth;
                let screenH = phone.screenHeight;
                // // self.log("系统信息：", phone);
                let width = bannerWidth || self.bannerAdWith;
                let left = (screenW - width) / 2;
                let scale = 0.3;
                let baseDesignWidth = 1334;
                let baseDesignHeight = 750;
                if (!self.ratio) {
                    self.ratio = baseDesignHeight / screenH;
                }
                if (screenW <= screenH) {
                    baseDesignWidth = 750;
                    baseDesignHeight = 1334;
                    self.ratio = baseDesignWidth / screenW;
                    if (bannerWidth) {
                        // @ts-ignore
                        width = bannerWidth / self.ratio;
                        left = (screenW - width) / 2;
                    }
                    else {
                        left = defaultWidthDiff / self.ratio / 2;
                        // @ts-ignore
                        width = screenW - left * 2;
                        if (typeof qq !== 'undefined') {
                            scale = 0.23;
                        }
                        else if (typeof tt !== 'undefined') {
                            scale = 0.3481875;
                            width = screenW * 0.8;
                            left = screenW * 0.1;
                        }
                    }
                }
                bottomOffset = bottomOffset / self.ratio;
                var height = width * scale;
                // var halfOfHeightDifference = bottomOffset > 0 ? (phone.screenHeight - baseDesignHeight / self.ratio) / 2 / self.ratio : 0;
                // var halfOfHeightDifference = 0;
                var top = phone.screenHeight - height - 0.05 - bottomOffset / self.ratio;
                if (phone.safeArea) {
                    safeAreaBottomOffset = (screenH - phone.safeArea.bottom) / 2.5;
                }
                let style = {
                    left: left,
                    height: height,
                    width: width,
                    top: top - safeAreaBottomOffset,
                };
                // self.log('halfOfHeightDifference', halfOfHeightDifference);
                return style;
            }
            /** banner样式改变 */
            bannerResizeHandle(bannerAd, res, isCustom, onResize, bottomOffset = 0) {
                let self = this;
                self.log("sdk BannerAd resize: ", res);
                // bannerAd.offResize(resizeHandler);
                if (isCustom) {
                    //用户要自定义banner广告样式
                    res.width = res.realWidth || res.width;
                    res.height = res.realHeight || res.height;
                    res.realWidth = res.realWidth || res.width;
                    res.realHeight = res.realHeight || res.height;
                    onResize && onResize(bannerAd, res);
                    return;
                }
                onResize && onResize(bannerAd, res);
                if (typeof qq !== 'undefined')
                    return; // 不知道为啥
                let phone = wx.getSystemInfoSync();
                let safeAreaBottomOffset = phone.safeArea ? (phone.screenHeight - phone.safeArea.bottom) / 2.5 : 0;
                var realLeft = phone.screenWidth / 2 - (res.realWidth || res.width) / 2 + 0.1;
                var realTop = phone.screenHeight - (res.realHeight || res.height) - safeAreaBottomOffset - bottomOffset / self.ratio;
                self.log('realLeft:' + realLeft, 'realTop:' + realTop, 'safeAreaBottomOffset:' + safeAreaBottomOffset);
                if (bannerAd && bannerAd.style) {
                    bannerAd.style.left = realLeft;
                    bannerAd.style.top = realTop;
                }
                else {
                    self.log('sdk BannerAd has been destroyed, please check code.');
                }
            }
            /**
            * 创建banner广告
            * @param {json} style
            * @param {string} bannerAdUnitId
            */
            createBannerAdByAdId({ style = null, bannerAdUnitId = '', bottomOffset = 0, defaultWidthDiff = 20, bannerWidth = undefined, onResize = undefined } = {}) {
                let self = this;
                if (!self.fitPlatform())
                    return null;
                if (!bannerAdUnitId) {
                    self.error(errMsg_1.default[106]);
                    return null;
                }
                let isCustom = !!style;
                style = style || self.getBannerStyle(bottomOffset, defaultWidthDiff, bannerWidth);
                self.log('style', style);
                if (!wx.createBannerAd) {
                    self.error('Not find Function wx.createBannerAd !');
                    return null;
                }
                let bannerAd = wx.createBannerAd({
                    adUnitId: bannerAdUnitId,
                    style: style,
                });
                let resizeHandler = function (res) {
                    bannerAd.offResize(resizeHandler);
                    self.bannerResizeHandle(bannerAd, res, isCustom, onResize, bottomOffset);
                };
                bannerAd.onResize(resizeHandler);
                bannerAd.onLoad(function () {
                    self.BannerAdList.push(bannerAd);
                });
                bannerAd.onError(function (err) {
                    self.log("sdk BannerAd load error: ", err);
                });
                bannerAd.hide();
                return bannerAd;
            }
            /**
             * 重设banner的样式
             * @param param0
             */
            resetBannerStyle({ style = null, bannerAd = undefined, bottomOffset = 0, defaultWidthDiff = 20, bannerWidth = undefined, onResize = undefined } = {}) {
                var self = this;
                if (self.fitPlatform() && bannerAd) {
                    var isCustom = !!style;
                    style = style || self.getBannerStyle(bottomOffset, defaultWidthDiff, bannerWidth);
                    let resizeHandler = function (res) {
                        bannerAd.offResize(resizeHandler);
                        self.bannerResizeHandle(bannerAd, res, isCustom, onResize, bottomOffset);
                    };
                    bannerAd.onResize(resizeHandler);
                    bannerAd.style.left = style.left;
                    bannerAd.style.top = style.top;
                    bannerAd.style.width = style.width;
                    return bannerAd;
                }
            }
            /**
             显示banner广告。
             @param {number} bottomOffset banner与屏幕底部距离
             @param {function} success 成功回调
             @param {function} fail 失败回调
             @example 示例：
               lwsdk.showBanner({
                  bottomOffset: 0,
                  success: function(){
                    console.log('展示成功')
                  },
                  fail:function(err){
                    console.log('展示失败');
                    // 这里可以写其他失败处理逻辑
                  }
                })
             */
            showBanner({ style, bottomOffset = 0, onResize = undefined, fail = undefined, success = undefined } = {}) {
                var self = this;
                if (!self.fitPlatform() || !self.isInit() || self.isBrowser()) {
                    return;
                }
                if (self.showTime) {
                    if ((Date.now() - self.showTime) < 1000) {
                        self.log('bannerAd refresh too fast, Ignore this time');
                        return;
                    }
                    self.hideBanner();
                }
                let BannerAdList = self.BannerAdList;
                if (BannerAdList.length === 0) {
                    var msg = 'No BannerAd, Try again later';
                    self.log(msg);
                    fail && fail(msg);
                    // 这里可以预加载
                    self.preloadAllBannerAd();
                    return;
                }
                var bannerAd = BannerAdList[0];
                let info = wx.getSystemInfoSync();
                if (info && self.sysInfo && info.deviceOrientation !== self.sysInfo.deviceOrientation) {
                    // 屏幕发生了旋转
                    self.sysInfo = info;
                    // self.log('屏幕发生了旋转。');
                    self.resetBannerStyle({ bannerAd: bannerAd, bottomOffset: bottomOffset });
                }
                else if (bottomOffset > 0) {
                    // var newTop = bannerAd.style.top - (bottomOffset / self.ratio);
                    // bannerAd.style.top = newTop
                    bannerAd.style.top -= (bottomOffset / self.ratio);
                }
                if (style) {
                    self.resetBannerStyle({ bannerAd: bannerAd, style: style, onResize: onResize });
                }
                bannerAd.show().then(() => {
                    self.showTime = Date.now();
                    success && success();
                }).catch(err => {
                    fail && fail(err);
                });
                // 这里可以预加载
                self.preloadAllBannerAd();
            }
            /**
             自定义样式显示banner广告。
             @param {number} left banner与屏幕左边距离
             @param {number} top banner与屏幕顶部距离
             @param {number} width banner宽度
             @param {function} onResize 监听 banner 广告尺寸变化事件
             @param {function} success 成功回调
             @param {function} fail 失败回调
             @example 示例：
             lwsdk.showBannerWithStyle({left: 10, top: 10, onResize:(bannerAd,realStyle) => {console.log(2222222,bannerAd,realStyle)}})
            */
            showBannerWithStyle() {
                this.error('api showBannerWithStyle 已废弃，功能已合并至 showBanner');
            }
            /**
             预加载所有的banner广告
             */
            preloadAllBannerAd() {
                var self = this;
                var UnitIdArr = self.getBannerAdUnitIdArr();
                if (!UnitIdArr) {
                    return null;
                }
                var count = self.BANNERAD_MAX_COUNT - self.BannerAdList.length;
                if (count <= 0) {
                    return null;
                }
                for (let i = 0; i < count; i++) {
                    var bannerAdUnitId = self.getBannerAdUnitId();
                    if (!bannerAdUnitId) {
                        self.error('bannerAd UnitId can not be null');
                        continue;
                    }
                    // self.preloadBannerAd(bannerAdUnitId);
                    self.createBannerAdByAdId({ bannerAdUnitId: bannerAdUnitId, });
                }
            }
            getBannerAdUnitIdArr() {
                var self = this;
                var config4 = self.getConfig(4);
                if (config4 && config4.bannerAdUnitId) {
                    var bannerAdUnitIdArr = config4.bannerAdUnitId.split('|');
                    return bannerAdUnitIdArr;
                }
                var config6 = self.getConfig(6);
                if (config6) {
                    var arr = [];
                    for (var i in config6) {
                        arr.push(config6[i].adunit_id);
                    }
                    return arr;
                }
                self.error('no banner config，can not preload bannerAd');
                return null;
            }
            getBannerAdUnitId() {
                var self = this;
                var bannerAdUnitIdArr = self.getBannerAdUnitIdArr();
                self.bannerAdUnitIdIndex1 = self.getNewArrayIndex(self.bannerAdUnitIdIndex1, bannerAdUnitIdArr.length);
                var bannerAdUnitId = bannerAdUnitIdArr[self.bannerAdUnitIdIndex1];
                return bannerAdUnitId;
            }
            /**
             * 关闭banner广告
             */
            hideBanner() {
                var self = this;
                if (!self.showTime) {
                    return;
                }
                self.showTime = null;
                if (self.BannerAdList[0]) {
                    self.BannerAdList[0].hide();
                    self.BannerAdList[0].destroy();
                    self.BannerAdList.shift();
                }
                self.preloadAllBannerAd();
            }
            /**
             * 获取所有导流广告数据
             */
            getAllDiversionData() {
                return this.diversionData;
            }
            /**
             * 根据键获取自定义配置数据(运营自定义在线参数)
             * @param {string} key 自定义数据的键
             * @deprecated
             * @example
             * var timeLimit = lwsdk.getCustomConfigByKey('timeLimit');
             */
            getCustomConfigByKey(key) {
                if (!this.isInit()) {
                    return null;
                }
                var config = this.getConfig(2);
                if (!config) {
                    return null;
                }
                return config[key];
            }
        }
        exports.default = new LWSDK;

    }, { "./Md5": 2, "./errMsg": 3, "./mockWeiXinApi": 4, "./sdk_conf": 5 }], 2: [function (require, module, exports) {
        "use strict";
        /*
        TypeScript Md5
        ==============
        Based on work by
        * Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
        * André Cruz: https://github.com/satazor/SparkMD5
        * Raymond Hill: https://github.com/gorhill/yamd5.js
        Effectively a TypeScrypt re-write of Raymond Hill JS Library
        The MIT License (MIT)
        Copyright (C) 2014 Raymond Hill
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
                    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                            Version 2, December 2004
         Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>
         Everyone is permitted to copy and distribute verbatim or modified
         copies of this license document, and changing it is allowed as long
         as the name is changed.
                    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
           TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
          0. You just DO WHAT THE FUCK YOU WANT TO.
        */
        Object.defineProperty(exports, "__esModule", { value: true });
        class Md5 {
            constructor() {
                this._state = new Int32Array(4);
                this._buffer = new ArrayBuffer(68);
                this._buffer8 = new Uint8Array(this._buffer, 0, 68);
                this._buffer32 = new Uint32Array(this._buffer, 0, 17);
                this.start();
            }
            static hashStr(str, raw = false) {
                return this.onePassHasher
                    .start()
                    .appendStr(str)
                    .end(raw);
            }
            static hashAsciiStr(str, raw = false) {
                return this.onePassHasher
                    .start()
                    .appendAsciiStr(str)
                    .end(raw);
            }
            static _hex(x) {
                const hc = Md5.hexChars;
                const ho = Md5.hexOut;
                let n;
                let offset;
                let j;
                let i;
                for (i = 0; i < 4; i += 1) {
                    offset = i * 8;
                    n = x[i];
                    for (j = 0; j < 8; j += 2) {
                        ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                        n >>>= 4;
                        ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                        n >>>= 4;
                    }
                }
                return ho.join('');
            }
            static _md5cycle(x, k) {
                let a = x[0];
                let b = x[1];
                let c = x[2];
                let d = x[3];
                // ff()
                a += (b & c | ~b & d) + k[0] - 680876936 | 0;
                a = (a << 7 | a >>> 25) + b | 0;
                d += (a & b | ~a & c) + k[1] - 389564586 | 0;
                d = (d << 12 | d >>> 20) + a | 0;
                c += (d & a | ~d & b) + k[2] + 606105819 | 0;
                c = (c << 17 | c >>> 15) + d | 0;
                b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
                b = (b << 22 | b >>> 10) + c | 0;
                a += (b & c | ~b & d) + k[4] - 176418897 | 0;
                a = (a << 7 | a >>> 25) + b | 0;
                d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
                d = (d << 12 | d >>> 20) + a | 0;
                c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
                c = (c << 17 | c >>> 15) + d | 0;
                b += (c & d | ~c & a) + k[7] - 45705983 | 0;
                b = (b << 22 | b >>> 10) + c | 0;
                a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
                a = (a << 7 | a >>> 25) + b | 0;
                d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
                d = (d << 12 | d >>> 20) + a | 0;
                c += (d & a | ~d & b) + k[10] - 42063 | 0;
                c = (c << 17 | c >>> 15) + d | 0;
                b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
                b = (b << 22 | b >>> 10) + c | 0;
                a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
                a = (a << 7 | a >>> 25) + b | 0;
                d += (a & b | ~a & c) + k[13] - 40341101 | 0;
                d = (d << 12 | d >>> 20) + a | 0;
                c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
                c = (c << 17 | c >>> 15) + d | 0;
                b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
                b = (b << 22 | b >>> 10) + c | 0;
                // gg()
                a += (b & d | c & ~d) + k[1] - 165796510 | 0;
                a = (a << 5 | a >>> 27) + b | 0;
                d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
                d = (d << 9 | d >>> 23) + a | 0;
                c += (d & b | a & ~b) + k[11] + 643717713 | 0;
                c = (c << 14 | c >>> 18) + d | 0;
                b += (c & a | d & ~a) + k[0] - 373897302 | 0;
                b = (b << 20 | b >>> 12) + c | 0;
                a += (b & d | c & ~d) + k[5] - 701558691 | 0;
                a = (a << 5 | a >>> 27) + b | 0;
                d += (a & c | b & ~c) + k[10] + 38016083 | 0;
                d = (d << 9 | d >>> 23) + a | 0;
                c += (d & b | a & ~b) + k[15] - 660478335 | 0;
                c = (c << 14 | c >>> 18) + d | 0;
                b += (c & a | d & ~a) + k[4] - 405537848 | 0;
                b = (b << 20 | b >>> 12) + c | 0;
                a += (b & d | c & ~d) + k[9] + 568446438 | 0;
                a = (a << 5 | a >>> 27) + b | 0;
                d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
                d = (d << 9 | d >>> 23) + a | 0;
                c += (d & b | a & ~b) + k[3] - 187363961 | 0;
                c = (c << 14 | c >>> 18) + d | 0;
                b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
                b = (b << 20 | b >>> 12) + c | 0;
                a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
                a = (a << 5 | a >>> 27) + b | 0;
                d += (a & c | b & ~c) + k[2] - 51403784 | 0;
                d = (d << 9 | d >>> 23) + a | 0;
                c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
                c = (c << 14 | c >>> 18) + d | 0;
                b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
                b = (b << 20 | b >>> 12) + c | 0;
                // hh()
                a += (b ^ c ^ d) + k[5] - 378558 | 0;
                a = (a << 4 | a >>> 28) + b | 0;
                d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
                d = (d << 11 | d >>> 21) + a | 0;
                c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
                c = (c << 16 | c >>> 16) + d | 0;
                b += (c ^ d ^ a) + k[14] - 35309556 | 0;
                b = (b << 23 | b >>> 9) + c | 0;
                a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
                a = (a << 4 | a >>> 28) + b | 0;
                d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
                d = (d << 11 | d >>> 21) + a | 0;
                c += (d ^ a ^ b) + k[7] - 155497632 | 0;
                c = (c << 16 | c >>> 16) + d | 0;
                b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
                b = (b << 23 | b >>> 9) + c | 0;
                a += (b ^ c ^ d) + k[13] + 681279174 | 0;
                a = (a << 4 | a >>> 28) + b | 0;
                d += (a ^ b ^ c) + k[0] - 358537222 | 0;
                d = (d << 11 | d >>> 21) + a | 0;
                c += (d ^ a ^ b) + k[3] - 722521979 | 0;
                c = (c << 16 | c >>> 16) + d | 0;
                b += (c ^ d ^ a) + k[6] + 76029189 | 0;
                b = (b << 23 | b >>> 9) + c | 0;
                a += (b ^ c ^ d) + k[9] - 640364487 | 0;
                a = (a << 4 | a >>> 28) + b | 0;
                d += (a ^ b ^ c) + k[12] - 421815835 | 0;
                d = (d << 11 | d >>> 21) + a | 0;
                c += (d ^ a ^ b) + k[15] + 530742520 | 0;
                c = (c << 16 | c >>> 16) + d | 0;
                b += (c ^ d ^ a) + k[2] - 995338651 | 0;
                b = (b << 23 | b >>> 9) + c | 0;
                // ii()
                a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
                a = (a << 6 | a >>> 26) + b | 0;
                d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
                d = (d << 10 | d >>> 22) + a | 0;
                c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
                c = (c << 15 | c >>> 17) + d | 0;
                b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
                b = (b << 21 | b >>> 11) + c | 0;
                a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
                a = (a << 6 | a >>> 26) + b | 0;
                d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
                d = (d << 10 | d >>> 22) + a | 0;
                c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
                c = (c << 15 | c >>> 17) + d | 0;
                b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
                b = (b << 21 | b >>> 11) + c | 0;
                a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
                a = (a << 6 | a >>> 26) + b | 0;
                d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
                d = (d << 10 | d >>> 22) + a | 0;
                c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
                c = (c << 15 | c >>> 17) + d | 0;
                b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
                b = (b << 21 | b >>> 11) + c | 0;
                a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
                a = (a << 6 | a >>> 26) + b | 0;
                d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
                d = (d << 10 | d >>> 22) + a | 0;
                c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
                c = (c << 15 | c >>> 17) + d | 0;
                b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
                b = (b << 21 | b >>> 11) + c | 0;
                x[0] = a + x[0] | 0;
                x[1] = b + x[1] | 0;
                x[2] = c + x[2] | 0;
                x[3] = d + x[3] | 0;
            }
            start() {
                this._dataLength = 0;
                this._bufferLength = 0;
                this._state.set(Md5.stateIdentity);
                return this;
            }
            // Char to code point to to array conversion:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
            // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
            appendStr(str) {
                const buf8 = this._buffer8;
                const buf32 = this._buffer32;
                let bufLen = this._bufferLength;
                let code;
                let i;
                for (i = 0; i < str.length; i += 1) {
                    code = str.charCodeAt(i);
                    if (code < 128) {
                        buf8[bufLen++] = code;
                    }
                    else if (code < 0x800) {
                        buf8[bufLen++] = (code >>> 6) + 0xC0;
                        buf8[bufLen++] = code & 0x3F | 0x80;
                    }
                    else if (code < 0xD800 || code > 0xDBFF) {
                        buf8[bufLen++] = (code >>> 12) + 0xE0;
                        buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                        buf8[bufLen++] = (code & 0x3F) | 0x80;
                    }
                    else {
                        code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                        if (code > 0x10FFFF) {
                            throw new Error('Unicode standard supports code points up to U+10FFFF');
                        }
                        buf8[bufLen++] = (code >>> 18) + 0xF0;
                        buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                        buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                        buf8[bufLen++] = (code & 0x3F) | 0x80;
                    }
                    if (bufLen >= 64) {
                        this._dataLength += 64;
                        Md5._md5cycle(this._state, buf32);
                        bufLen -= 64;
                        buf32[0] = buf32[16];
                    }
                }
                this._bufferLength = bufLen;
                return this;
            }
            appendAsciiStr(str) {
                const buf8 = this._buffer8;
                const buf32 = this._buffer32;
                let bufLen = this._bufferLength;
                let i;
                let j = 0;
                for (; ;) {
                    i = Math.min(str.length - j, 64 - bufLen);
                    while (i--) {
                        buf8[bufLen++] = str.charCodeAt(j++);
                    }
                    if (bufLen < 64) {
                        break;
                    }
                    this._dataLength += 64;
                    Md5._md5cycle(this._state, buf32);
                    bufLen = 0;
                }
                this._bufferLength = bufLen;
                return this;
            }
            appendByteArray(input) {
                const buf8 = this._buffer8;
                const buf32 = this._buffer32;
                let bufLen = this._bufferLength;
                let i;
                let j = 0;
                for (; ;) {
                    i = Math.min(input.length - j, 64 - bufLen);
                    while (i--) {
                        buf8[bufLen++] = input[j++];
                    }
                    if (bufLen < 64) {
                        break;
                    }
                    this._dataLength += 64;
                    Md5._md5cycle(this._state, buf32);
                    bufLen = 0;
                }
                this._bufferLength = bufLen;
                return this;
            }
            getState() {
                const self = this;
                const s = self._state;
                return {
                    buffer: String.fromCharCode.apply(null, self._buffer8),
                    buflen: self._bufferLength,
                    length: self._dataLength,
                    state: [s[0], s[1], s[2], s[3]]
                };
            }
            setState(state) {
                const buf = state.buffer;
                const x = state.state;
                const s = this._state;
                let i;
                this._dataLength = state.length;
                this._bufferLength = state.buflen;
                s[0] = x[0];
                s[1] = x[1];
                s[2] = x[2];
                s[3] = x[3];
                for (i = 0; i < buf.length; i += 1) {
                    this._buffer8[i] = buf.charCodeAt(i);
                }
            }
            end(raw = false) {
                const bufLen = this._bufferLength;
                const buf8 = this._buffer8;
                const buf32 = this._buffer32;
                const i = (bufLen >> 2) + 1;
                let dataBitsLen;
                this._dataLength += bufLen;
                buf8[bufLen] = 0x80;
                buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
                buf32.set(Md5.buffer32Identity.subarray(i), i);
                if (bufLen > 55) {
                    Md5._md5cycle(this._state, buf32);
                    buf32.set(Md5.buffer32Identity);
                }
                // Do the final computation based on the tail and length
                // Beware that the final length may not fit in 32 bits so we take care of that
                dataBitsLen = this._dataLength * 8;
                if (dataBitsLen <= 0xFFFFFFFF) {
                    buf32[14] = dataBitsLen;
                }
                else {
                    const matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
                    if (matches === null) {
                        return;
                    }
                    const lo = parseInt(matches[2], 16);
                    const hi = parseInt(matches[1], 16) || 0;
                    buf32[14] = lo;
                    buf32[15] = hi;
                }
                Md5._md5cycle(this._state, buf32);
                return raw ? this._state : Md5._hex(this._state);
            }
        }
        exports.default = Md5;
        // Private Static Variables
        Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
        Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        Md5.hexChars = '0123456789abcdef';
        Md5.hexOut = [];
        // Permanent instance is to use for one-call hashing
        Md5.onePassHasher = new Md5();
        if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
            console.error('Md5 self test failed.');
        }

    }, {}], 3: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = {
            100: {
                code: 100,
                msg: "请求参数为空。"
            },
            101: {
                code: 101,
                msg: "跳转小程序appId不能为空。"
            },
            102: {
                code: 102,
                msg: "初始化失败。"
            },
            103: {
                code: 103,
                msg: '"埋点没有数据上传!"'
            },
            104: {
                code: 104,
                msg: '"用户拒绝授权!"'
            },
            105: {
                code: 105,
                msg: '"更新用户信息失败!"'
            },
            106: {
                code: 106,
                msg: '"banner广告单元id不能为空!"'
            },
            200: {
                code: 200,
                msg: "接口返回数据为空。"
            },
            201: {
                code: 201,
                msg: "接口请求失败。"
            },
            1000: {
                code: 1000,
                msg: "调用了指定平台api，请发布到相应平台运行。"
            },
            1001: {
                code: 1001,
                msg: "浏览器模拟平台api失败结果。"
            },
            1002: {
                code: 1002,
                msg: "浏览器模拟平台api成功结果。"
            },
            1003: {
                code: 1003,
                msg: "参数不能为空!"
            },
            1004: {
                code: 1004,
                msg: "未支持的平台api，可能因为平台版本过低，请更新到新版重试!"
            },
            1005: {
                code: 1005,
                msg: "not fit platform!"
            }
        };

    }, {}], 4: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const errMsg_1 = require("./errMsg");
        function default_1() {
            let Global = "undefined" == typeof window ? {} : window;
            if (Global.wx) {
                return;
            }
            let t = {
                model: "iPhone X",
                pixelRatio: 3,
                windowWidth: 375,
                windowHeight: 812,
                system: "iOS 10.0.1",
                language: "zh_CN",
                version: "7.0.4",
                screenWidth: 375,
                screenHeight: 812,
                SDKVersion: "2.12.1",
                brand: "devtools",
                fontSizeSetting: 16,
                benchmarkLevel: 1,
                batteryLevel: 100,
                statusBarHeight: 44,
                safeArea: {
                    right: 375,
                    bottom: 812,
                    left: 0,
                    top: 44,
                    width: 375,
                    height: 768
                },
                deviceOrientation: "portrait",
                platform: "devtools",
                devicePixelRatio: 3
            };
            ;
            let wxapi = {
                mockSuccessOrFailDelay: function (e, t, n) {
                    let o = Math.random();
                    if (e && 0.5 < o) {
                        let temp = { code: errMsg_1.default[1001].code, msg: errMsg_1.default[1001].msg + 'api：' + this.name };
                        e.fail && e.fail(n || temp);
                        console.log(temp);
                    }
                    if (e && o <= 0.5) {
                        e.success && setTimeout(function () {
                            let temp = { code: errMsg_1.default[1002].code, msg: errMsg_1.default[1002].msg + 'api：' + this.name };
                            console.log(temp);
                            e.success(t || temp);
                        }, 800);
                    }
                },
                mockSuccessOrFail: function (e, t, n) {
                    let o = Math.random();
                    if (e && 0.5 < o) {
                        let temp = { code: errMsg_1.default[1001].code, msg: errMsg_1.default[1001].msg + 'api：' + this.name };
                        e.fail && e.fail(n || temp);
                        console.log(temp);
                    }
                    if (e && o <= 0.5) {
                        let temp = { code: errMsg_1.default[1002].code, msg: errMsg_1.default[1002].msg + 'api：' + this.name };
                        console.log(temp);
                        e.success && (e.success(t || temp));
                    }
                },
                getSystemInfoSync: function () {
                    return t;
                },
                getLaunchOptionsSync: function () {
                    return {
                        scene: 1001,
                        query: {},
                        referrerInfo: {}
                    };
                },
                login: function (e) {
                    return new Promise((resolve, reject) => {
                        if (e && e.fail) {
                            e.fail(errMsg_1.default[1001]);
                            reject(errMsg_1.default[1001]);
                        }
                    });
                },
                showShareMenu: function () { },
                onShareAppMessage: function () { },
                shareAppMessage: function (e) {
                    this.mockSuccessOrFailDelay.call(this.shareAppMessage, e);
                },
                onHide: function () { },
                onShow: function () { },
                navigateToMiniProgram: function (e) {
                    this.mockSuccessOrFail.call(this.navigateToMiniProgram, e);
                },
                getSystemInfo: function (e) {
                    this.mockSuccessOrFail.call(this.getSystemInfo, e, t);
                },
                getNetworkType: function (e) {
                    this.mockSuccessOrFail.call(this.getNetworkType, e, {
                        networkType: "wifi"
                    });
                },
                createUserInfoButton: function () {
                    return {
                        onTap: function () { },
                        show: function () { },
                        hide: function () { },
                        destroy: function () { }
                    };
                },
                showToast: function (e) {
                    this.mockSuccessOrFail.call(this.showToast, e);
                },
                hideToast: function (e) {
                    this.mockSuccessOrFail.call(this.hideToast, e);
                },
                getSetting: function (e) {
                    this.mockSuccessOrFail.call(this.getSetting, e, {
                        authSetting: {}
                    });
                },
                checkSession: function (e) {
                    this.mockSuccessOrFail.call(this.checkSession, e);
                },
                getUserInfo: function (e) {
                    e && e.fail && e.fail(errMsg_1.default[1001]);
                },
                showLoading: function () { },
                hideLoading: function () { },
                postMessage: function () { },
                setUserCloudStorage: function () { },
                createRewardedVideoAd: function () {
                    return {
                        onLoad: function (onLoadC) { },
                        load: function () {
                            return new Promise((resolve, reject) => {
                                resolve(1);
                            });
                        },
                        show: function () {
                            this.onCloseC && this.onCloseC({ isEnded: true });
                        },
                        onClose: function (onCloseC) { this.onCloseC = onCloseC; },
                        onError: function () { }
                    };
                },
                getStorageSync: function (key) {
                    return localStorage.getItem(key);
                },
                setStorageSync: function (key, value) {
                    var formatVaule = typeof value === 'object' ? JSON.stringify(value) : value;
                    localStorage.setItem(key, formatVaule);
                },
                request: function (obj) {
                },
                reportUserBehaviorBranchAnalytics: function (params) {
                    console.log(params);
                },
                createImage: function () {
                    return (Image && (new Image)) || (document && document.createElement('img'));
                }
            };
            Object.defineProperty(Global, 'wx', { value: wxapi, writable: false, configurable: false });
        }
        exports.default = default_1;
        ;

    }, { "./errMsg": 3 }], 5: [function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = {
            //.开发调试环境:prod 或 test,env_apis配合使用,主要是将接口切换正式环境和测试环境,上线务必修改为:prod
            env: 'prod',
            //.游戏唯一标识:已改用初始化时外部传递
            game: 'tatajuntuan-toutiao',
            //.当前游戏版本：已改用初始化时外部传递        
            version: '1.1.1',
            //.开发平台:由sdk维护者确定,weixin/toutiao/qq/app,接入游戏的技术不需要修改
            dev_platform: 'toutiao',
            //.乐玩sdk的版本号:由sdk维护者确定,接入游戏的技术不需要修改
            llewan_sdk_version: '3.1.1',
            //.接口加密key,切勿修改
            md5_key: '$5dfjr$%dsadsfdsii',
            //相关api配置,由sdk维护者确定,接入游戏的技术不需要修改
            env_apis: {
                prod: {
                    ip1: "https://login.llewan.com:1799",
                    ip2: "https://game.llewan.com:1899",
                    ip3: "https://log.llewan.com:1999",
                    ip4: "https://res.g.llewan.com",
                },
                anonymous: {
                    ip1: "https://login.fdn4i.com:2799",
                    ip2: "https://game.fdn4i.com:2899",
                    ip3: "https://log.fdn4i.com:2999",
                    ip4: "https://res.fdn4i.com",
                },
                test: {
                    ip1: "https://login.test.llewan.com",
                    ip2: "https://game.test.llewan.com",
                    ip3: "https://log.test.llewan.com",
                    ip4: "https://res.test.llewan.com",
                }
            },
            default_upload_row_count: 20,
            default_upload_interval: 120,
            //暂时已经废弃，不再统计游戏时长 --游戏在线统计时长开启与关闭。true为开启,false为关闭
            game_online: false,
            //分享调起时间设置
            share_time_limit: 2,
            imageCacheMax: 50,
            //默认分享文案
            default_shareInfo: {
                imageUrl: 'https://res.g.llewan.com/uploadfile/common/20190522/20190522163612_2971.jpg',
                query: '',
                sysid: -1,
                title: '根本停不下来不玩的游戏',
                type: 0
            },
            canShare: true,
        };

    }, {}]
}, {}, [1]);
