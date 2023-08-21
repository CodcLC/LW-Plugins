

const { ccclass, property } = cc._decorator;

@ccclass
export default class Plat {

    //static Util = tt;
    static sdkInfo = null;
    static bWxPlat = typeof tt !== 'undefined'
    //获取系统信息
    static fetchSdkInfo() {
        console.log("bWxPlat", this.bWxPlat)
        if (this.bWxPlat) {
            this.sdkInfo = tt.getSystemInfoSync();
        }

    }

    //对比微信基础库版本号，返回1 代表v1Str大，返回-1 代表v2Str大，返回0则相等
    static compareVersion(v1Str: String, v2Str: String) {
        let v1 = v1Str.split('.')
        let v2 = v2Str.split('.')
        let len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            let num1 = parseInt(v1[i])
            let num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            }
            else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }

    static toast(text: string, dura = 1500) {
        tt.showToast({ title: text, duration: dura, icon: 'none' })
    }
    /**
     * 
     * @param id 显示插屏
     */
    static _showInterstitialAd(id = "a7cbfknkapmjja88cd") {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return
        }
        try {
            let interAd_ = null;
            interAd_ = tt.createInterstitialAd({ adUnitId: id })
            if (interAd_ != null) {
                interAd_.load().then(
                    () => {
                        interAd_.show().then((val) => {
                            console.log('showInterShow', val)

                        }).catch((err) => {
                            console.log('showInterErr', err)
                            if (err != null) {
                                switch (err.errCode) {
                                    case 2001:
                                        console.log('启动一定时间内不允许展示插屏广告')
                                        break;
                                    case 2002:
                                        console.log('距离小程序插屏广告展示时间间隔不足，不允许展示插屏广告，间隔30秒')
                                        break;
                                    case 2003:
                                        console.log('当前正在播放激励视频广告或者插屏广告，不允许再次展示插屏广告')
                                        break;
                                    case 2004:
                                        console.log('错误不是开发者的异常情况')
                                        break;
                                    case 2005:
                                        console.log('插屏广告实例不允许跨页面调用')
                                        break;
                                }
                            }
                            interAd_.destroy();
                        })
                    }
                )
                    .catch((err) => {
                        console.log('InterstitialAd load err===', err)
                    })
            }
        }
        catch (error) {
            console.log('showInterstitialAd', error)
        }
    }


    //使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
    static vibrateShort() {
        tt.vibrateShort();
    }

    //使手机发生较长时间的振动（400 ms)
    static vibrateLong() {
        tt.vibrateLong();
    }

    //录屏的实例
    static GameRecorderM = null
    //录屏的地址
    static GameRecorderP = null
    //录屏的时间
    static GameRecorderT = null

    static GameRecorD = null

    /**
     * 预备游戏录屏
     * @param startCb 开始录屏回调 
     * @param stopCb 停止录屏回调，接收一个string类型的videoPath用于视屏分享，如果videoPath为空，则为不足3s的视屏
     * @param errCb 录屏出错时的回调
     * @param pauseCb 录屏暂停回调
     * @param resumeCb 录屏恢复回调
     */
    static preScreencap(startCb?: Function, stopCb?: Function, errCb?: Function, pauseCb?: Function, resumeCb?: Function) {
        if (!this.bWxPlat) {
            return
        }
        let info = this.sdkInfo;
        if (this.compareVersion(info.SDKVersion, '1.4.1') !== -1) {
            if (!this.GameRecorderM) {
                this.GameRecorderM = tt.getGameRecorderManager();
                console.log("屏幕录制", this.GameRecorderM);
                this.GameRecorderM.onStart(() => {
                    if (startCb) {
                        startCb();
                    }
                    this.GameRecorderP = ''
                    this.GameRecorderT = Date.now()
                    this.GameRecorD = true;
                })
                this.GameRecorderM.onStop((res) => {
                    let diff = Date.now() - this.GameRecorderT;
                    if (diff >= 3000) {
                        this.GameRecorderP = res.videoPath;
                    } else {
                        this.GameRecorderP = '';
                        if (this.GameRecorD) {
                            this.toast('录屏时间不足3秒', 2000);
                        }
                    }
                    if (stopCb) {
                        stopCb(this.GameRecorderP);
                    }

                    this.GameRecorD = false;
                })
                this.GameRecorderM.onError((errMgs: string) => {
                    if (errCb) {
                        errCb();
                    }

                    console.log('录屏出错', errMgs)
                })
                this.GameRecorderM.onPause(() => {
                    if (pauseCb) {
                        pauseCb()
                    }
                    console.log('录屏暂停');
                })
                this.GameRecorderM.onResume(() => {
                    if (resumeCb) {
                        resumeCb();
                    }
                    console.log('录屏继续');
                })
                this.GameRecorderM.onStop((res) => {
                    console.log(res.videoPath);
                    this.GameRecorderP = res.videoPath;
                });
                if (this.compareVersion(info.SDKVersion, '1.6.1') !== -1) {
                    this.GameRecorderM.onInterruptionBegin(() => {
                        this.GameRecorderM.pause()
                    })

                    this.GameRecorderM.onInterruptionEnd(() => {
                        this.GameRecorderM.resume()
                    })
                }
            }
        }
    }

    /**
     * 开始录制视屏
     * @param dura 录制视屏长度，默认300s
     */
    static startGameRecord(dura = 300) {
        if (this.GameRecorderM) {
            this.GameRecorderM.start({ duration: dura });
            console.log('开始录制屏幕', dura);
        }
    }

    /**
     * 结束录制视屏
     */
    static stopGameRecord() {
        if (this.GameRecorderM) {
            this.GameRecorderM.stop()
        }
    }


    /**
     * 暂停录制视屏
     */
    static pauseGameRecord() {
        if (this.GameRecorderM) {
            this.GameRecorderM.pause()
        }
    }


    /**
     * 继续录制视屏
     */
    static resumeGameRecord() {
        if (this.GameRecorderM) {
            this.GameRecorderM.resume()
        }
    }


    /**
     * 分享录制好的视屏
     * @param succCb 分享成功回调
     * @param failCb 分享失败回调
     */
    static shareRecordVideo(succCb?: Function, failCb?: Function) {
        console.log('shareRecordVideo', this.GameRecorderP)
        if (!this.bWxPlat) {
            return
        }
        console.log(this.GameRecorderP);
        if (this.GameRecorderP == '') {
            this.toast('不存在录制视频')
        }
        else {
            tt.shareAppMessage({
                channel: "video",
                title: '',
                extra: {
                    videoPath: this.GameRecorderP, // 可替换成录屏得到的视频地址
                },
                success: () => {
                    console.log("分享视频成功")
                    if (succCb) {
                        succCb()
                    }
                },
                fail: (e) => {
                    console.log("分享视频失败", e);
                    if (e && e.errMsg && e.errMsg.indexOf('cancel') === -1) {
                        this.toast('暂无可以分享的视频')
                        this.GameRecorderP = null;
                    }
                    else {
                        this.toast('请分享视频获取奖励')
                    }
                    if (failCb)
                        failCb()
                }
            })
        }
    }

}
