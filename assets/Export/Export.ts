/**
 * export by auto
 * author:
 * Date:
 * Desc:
 */

import Apply from "../Apply/Apply";
import Data from "../Apply/Data";
import Plat from "../Apply/Plat";
import { ViewZOrder } from "../Framework/View/ViewZOrder";
import Main from "../Main/Main";

const { ccclass, property } = cc._decorator;
const { metadata } = lw._decorator;

@ccclass
export default class Export extends lw.BaseView {
    public static instance: Export = null;
    //--Auto export attr, Don't change--
    protected _autoBind: boolean = true;
    //--Auto export attr, Don't change end--


    constructor() {
        super()
        this.LayerOrder = ViewZOrder.Export;
    }

    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        // TODO
        Export.instance = this;
        this.ex_prant = this.node;
        Main.instance.ExprotFnish = true;
    }

    /** 
     * 一些UI初始化 
     */
    protected _initUI() {
        // TODO
    }

    /** 
     * 初始化事件 
     */
    protected _initEvent() {
        // TODO
    }

    /** 
     * 界面关闭 
     */
    protected onClose() {
        // TODO
    }
    _flowList: any[] = [];
    ex_prant = null;
    closeAll() {
        if (this._flowList && this._flowList.length > 0) {
            this._flowList.forEach(flow => {
                lwsdk.destroyFlow(flow);
            });
            this._flowList.length = 0;
        }
        lwsdk.hideBanner()
    }

    /**
     * 
     * @param typeId 1是单个icon 2是侧边抽屉 3是单行滚动条 4是爆款弹窗 5热门推荐页 6两列全屏 7四宫格结算页
     * @returns 
     */
    show(typeId, clo_fun?: Function, bool?: boolean, arr?: any) {
        if (!typeId) {
            // 关闭所有
            this.closeAll();
            return
        }
        switch (Number(typeId)) {
            case 1:
                // if (Main.instance.userData.)) {
                //     if (clo_fun) {
                //         clo_fun();
                //     }
                //     return;
                // }
                for (let i = 0; i < arr.length; i++) {
                    this.showXFDD(arr[i].x, arr[i].y);
                }
                break;
            case 2:
                //this.showCBCT()
                break;
            case 3:
                // if (!lwsdk.getButtonVisible("JJPZGD-DBGDT")) {
                //     if (clo_fun) {
                //         clo_fun();
                //     }
                //     return;
                // }
                this.showHYRWGD();
                break;
            case 4:
                // if (!lwsdk.getButtonVisible("JJPZGD-BKTC")) {
                //     if (clo_fun) {
                //         clo_fun();
                //     }
                //     return;
                // }
                this.showBKTC(clo_fun)
                break;
            case 5:
                // if (!lwsdk.getButtonVisible("JJPZGD-RMTJ")) {
                //     if (clo_fun) {
                //         clo_fun();
                //     }
                //     return;
                // }
                this.showRMTJLL(clo_fun)
                break;
            case 6:
                // if (!lwsdk.getButtonVisible("JJPZGD-LLDC")) {
                //     if (clo_fun) {
                //         clo_fun();
                //     }
                //     return;
                // }
                this.showLLTGY(clo_fun)
                break;
            case 7:
                // if (!lwsdk.getButtonVisible("JJPZGD-JSYM")) {
                //     if (clo_fun) {
                //         clo_fun();
                //     }
                //     return;
                // }
                //this.showSGG(clo_fun)
                break;
            default:
                break;
        }
    }

    banner_epx = null;
    banner_normal = null;
    bannerNode = [];
    getStyle(idx, width = 300) {
        let scl = width / 300;
        let hgt = 120 * scl;
        let sdkInfo = Plat.sdkInfo;
        let style = {
            left: 0,
            top: 0,
            width: width
        }
        let node = this.bannerNode[idx];
        let x = sdkInfo.screenWidth / 2 - width / 2;
        let y = sdkInfo.screenHeight - hgt;
        if (node) {
            let linex = cc.view.getVisibleSize().width;
            let pos = Apply.localConvertWorldPointAR(node);
            let rat = pos.x / linex;
            x = sdkInfo.screenWidth * rat - width * 0.5;

            let gameHgt = cc.view.getVisibleSize().height;
            let ratio = (gameHgt - pos.y) / gameHgt;
            y = sdkInfo.screenHeight * ratio;

        }
        style.left = x;
        style.top = y;
        console.log("style>>>>>>>>>>>>>>", style);
        return style;
    }
    bannerNum = 0;
    /**
     *  展示banner
     * @param idx 在节点数组里的下标  默认是0
     * @param width banner的宽      默认是300
     * @returns 
     */
    showBanner(idx = 0, width = 300,) {
        if (!Plat.bWxPlat) {
            return;
        }
        this.bannerNum++;
        idx = 0;
        this.hideBanner();
        lwsdk.showBanner({
            bottomOffset: 0,
            //style: style,
            fail: (err) => {
                console.log('展示失败');
                if (Export.instance.bannerNum > 5) {
                    Export.instance.bannerNum = 0;
                    return;
                }
                cc.tween(Export.instance.node)
                    .delay(0.1)
                    .call(() => {
                        Export.instance.showBanner();
                    })
                    .start();
                return
                // 这里可以写其他失败处理逻辑
                if (false) {
                    Export.instance.banner_epx = true;
                    Export.instance.showHYRWGD();
                } else {
                    Export.instance.show(3);
                }

            },
            success: () => {
                Export.instance.bannerNum = 0;
                console.log('展示成功');
            }
        })
    }



    /**
     * 销毁anner
     */
    hideBanner() {
        if (this.banner_epx) {
            lwsdk.destroyFlow(this.banner_epx);
            this.banner_epx = null;
        } else {
            lwsdk.hideBanner();
        }
    }

    /**
     * 
     * @param str 看视频
     * @param scu_fun 
     */
    wacth_video(scu_fun?: Function, fail_fun?: Function, str = "JJHYGD-QLSP",) {

        lwsdk.shareOrVideo({
            buttonKey: str,
            success: () => {
                console.log("111111")
                if (scu_fun) {
                    scu_fun()
                }
            },
            fail: () => {
                console.log("2222222")
                if (fail_fun) {
                    fail_fun()
                }
            }
        });
    }

    /**
     * 侧边抽屉
     */
    showCBCT() {
        let flow = lwsdk.createFlow({
            positionId: 'TTJT-CBCT',
            parentNode: Export.instance.ex_prant,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                console.log(222222, '跳转失败。', err);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            }
        });
        if (flow) {
            this._flowList.push(flow)
        }
    }

    /**
     * 单行滚动条
     */
    showHYRWGD() {
        let flow = lwsdk.createFlow({
            positionId: 'JJPZGD-DBGDT',
            parentNode: Export.instance.ex_prant,
            y: -cc.winSize.height / 2 + 50,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                console.log(222222, '跳转失败。', err);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            }
        });
        if (flow) {
            this._flowList.push(flow)
        }
        if (Export.instance.banner_epx) {
            Export.instance.banner_epx = null;
            if (flow) {
                Export.instance.banner_epx = flow;
            }
        } else {
            Export.instance.banner_normal = flow;
        }
    }

    /**
     * 爆款弹窗
     */
    showBKTC(clo_fun?: Function) {
        let flow = lwsdk.createFlow({
            positionId: 'JJPZGD-BKTC',
            parentNode: Export.instance.ex_prant,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                console.log(222222, '跳转失败。', err);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            },
            onCloseButtonInit: node => {
                //Export.instance.run_node(node);
                // 显示banner
                // lwsdk.showBanner();
                node.y = -cc.winSize.height / 2 + 300;
                cc.tween(Export.instance.node)
                    .delay(0.1)
                    .call(() => {
                        Export.instance.showBanner();
                    })
                    .start();

            },
            onCloseButtonClick: node => {
                // @ts-ignore
                Export.instance.hideBanner();
                lwsdk.destroyFlow(flow);
                if (clo_fun) {
                    clo_fun();
                }

            },
            onContinueButtonClick: node => {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '继续/下一关按钮回调'
                // });
                Export.instance.hideBanner();
                lwsdk.destroyFlow(flow)
                if (clo_fun) {
                    clo_fun();
                }

            }
        });
        if (flow) {
            this._flowList.push(flow)
        }
    }

    /**
     * 四宫格结算页
     */
    showSGG(idx: any, clo_fun?: Function,) {
        let list_state = {
            num: 1
        }

        let flow = lwsdk.createFlow({
            positionId: 'JJHYGD-JSYM',
            showCount: 10,
            parentNode: Export.instance.ex_prant,

            resultWinOrFail: idx,
            interval: 5,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                console.log(222222, '跳转失败。', err);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            },
            onCloseButtonInit: node => {

                // 显示banner
                // lwsdk.showBanner();
            },
            onCloseButtonClick: node => {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '关闭/返回按钮回调'
                // });

            },
            onContinueButtonInit: node => {

                //Export.instance.showBanner();
            },
            onContinueButtonClick: node => {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '继续/下一关按钮回调'
                // });
                if (list_state.num != 1) {
                    return;
                }
                if (clo_fun) {
                    clo_fun();
                }
                //Export.instance.hideBanner();
                lwsdk.destroyFlow(flow)
            }
        });
        if (flow) {

            this._flowList.push(flow)
        }

    }

    /**
     * 两列推荐页
     */
    showLLTGY(clo_fun?: Function) {
        let list_state = {
            num: 0
        }
        let flow = lwsdk.createFlow({
            positionId: 'JJHYGD-LLDC',
            parentNode: Export.instance.ex_prant,
            showCount: 20,
            // interval: 5,
            autoScroll: true,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                console.log(222222, '跳转失败。', err);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            },
            onContinueButtonInit: node => {
                // (node as cc.Node).active = false;
                // cc.tween(node)
                // .delay(0.2)
                // .to(0.2, {position: cc.v2(node.x, node.y + 100)})
                // .start();

                Export.instance.run_node(node, list_state);
                // 显示banner
                // lwsdk.showBanner();
                // setTimeout(()=>{
                //     node.active = true;
                // }, 1000)
            },
            onContinueButtonClick: function (node) {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '继续/下一关按钮回调'
                // });
                if (list_state.num != 1) {
                    return;
                }

                lwsdk.destroyFlow(flow)
                if (clo_fun) {
                    clo_fun();
                }
                //随机点击一个游戏
                // let success = () => {
                //     console.log('成功回调执行。');
                //     lwsdk.destroyFlow(flow)
                // }
                // let fail = () => {
                //     console.log('失败回调执行。');
                //     lwsdk.destroyFlow(flow);
                // }
                // lwsdk.clickRandomGame(flow, success, fail);

            },
            onCloseButtonClick: node => {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '关闭/返回按钮回调'
                // });

                Export.instance.hideBanner()
                lwsdk.destroyFlow(flow)
                if (clo_fun) {
                    clo_fun();
                }
            }
        });
        if (flow) {
            this._flowList.push(flow)
        }
    }

    /**
     * 热门推荐页
     */
    showRMTJLL(clo_fun?: Function) {
        let list_state = {
            num: 0
        }
        let flow = lwsdk.createFlow({
            positionId: 'JJHYGD-RMTJ',
            parentNode: Export.instance.ex_prant,
            showCount: 15,
            slideIn: true,
            // interval: 5,
            autoScroll: true,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                console.log(222222, '跳转失败。', err);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            },
            onContinueButtonInit: node => {

                Export.instance.run_node(node, list_state);
                // 显示banner
                // lwsdk.showBanner();
            },
            onContinueButtonClick: function (node) {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '继续/下一关按钮回调'
                // });

                if (list_state.num != 1) {
                    return;
                }

                lwsdk.destroyFlow(flow);
                if (clo_fun) {
                    clo_fun();
                }

                //随机点击一个游戏
                // let success = () => {
                //     console.log('成功回调执行。');
                //     lwsdk.destroyFlow(flow)
                // }
                // let fail = () => {
                //     console.log('失败回调执行。');
                //     // lwsdk.destroyFlow(flow);
                // }
                // lwsdk.clickRandomGame(flow, success, fail);

            },
            onCloseButtonClick: node => {
                // @ts-ignore
                // typeof wx !== 'undefined' && wx.showToast({
                //     title: '关闭/返回按钮回调'
                // });
                Export.instance.hideBanner();
                lwsdk.destroyFlow(flow);
                if (clo_fun) {
                    clo_fun();
                }
                Export.instance.showBanner()
            }
        });
        if (flow) {
            this._flowList.push(flow)
        }
    }

    /**
     * 抖动icon
     */
    showXFDD(x, y, parent?: any) {
        let flow = lwsdk.createFlow({
            positionId: 'JJHYGD-DDDC',
            parentNode: parent,
            showCount: 0,
            slideIn: true,
            x: x,
            y: y,
            iconShake: true,
            interval: 5,
            autoScroll: true,
            onDestroy: () => {
                console.log(222222)
            },
            onTryPlaySuccess: gold => {
                console.log(222222, '试玩成功，应该奖励金币：' + gold)
            },
            onTryPlayFail: err => {
                console.log(222222, '试玩失败。', err);
            },
            onNavigateToFail: err => {
                Export.instance.show(5);
            },
            onError: err => {
                console.log(222222, '创建广告报错了', err);
            }
        });
        if (flow) {
            this._flowList.push(flow)
        }
    }

    /**
     * 
     * @param node 继续游戏按钮的动作
     */
    run_node(node, state?: any) {
        let b_s_time = Main.instance.bannerShowTime;
        if (Main.instance.userData.banner_prob) {
            let fun = cc.callFunc(() => {
                Export.instance.showBanner();
            })
            let fun1 = cc.callFunc(() => {
                Export.instance.hideBanner();
                state.num = 1;
            })
            node.runAction(cc.sequence(cc.delayTime(b_s_time), fun, cc.delayTime(1.5), fun1));
        } else {
            state.num = 1;
        }
    }

    /**
     * 
     * @param node 继续游戏按钮的动作
     */
    run_node1(node, state?: any) {

        let b_s_time = Main.instance.bannerShowTime;
        if (Main.instance.userData.banner_prob) {
            let fun = cc.callFunc(() => {
                Export.instance.showBanner();
            })
            node.runAction(cc.sequence(cc.delayTime(b_s_time), fun));
        } else {
            state.num = 1;
        }

    }
}
