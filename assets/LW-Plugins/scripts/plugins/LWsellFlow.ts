import ccUtils from '../utils/LWccUtils'
import EventConst from './LWEventConst'
(function () {
    enum paths {
        'LW-resource/prefabs/modules/shakeIcon/main' = 1, //抖动单icon
        'LW-resource/prefabs/modules/sidebarDrawer/main' = 2, //侧边抽屉
        'LW-resource/prefabs/modules/iconScroll/main' = 3, //单行滚动栏
        'LW-resource/prefabs/modules/hotWindow/main' = 4, //爆款游戏弹窗
        'LW-resource/prefabs/modules/hotRecomend/main' = 5, //热门推荐页
        'LW-resource/prefabs/modules/twoLineRecomend/main' = 6, //两列推广页
        'LW-resource/prefabs/modules/resultPage/main' = 7, //四宫格结算页
        'LW-resource/prefabs/modules/hotBox/main' = 8, //热门盒子
        'LW-resource/prefabs/modules/fullScreenBox/main' = 9, //全屏盒子
    }
    enum scriptNames {
        'LWshakeIconMain' = 1,
        'LWsidebarDrawerMain' = 2,
        'LWiconScrollMain' = 3,
        'LWhotWindowMain' = 4,
        'LWhotRecomendMain' = 5,
        'LWtwoLineRecomendMain' = 6,
        'LWresultPageMain' = 7,
        'LWhotBoxMain' = 8,
        'LWfullScreenBoxMain' = 9,
    }
    class Flow {
        _flowId: number;
        _flowType: number;
        _node: any;
        _destroyed: boolean = false;
        _onDestroyList: Function[] = [];
        _onTryPlaySuccessList: Function[] = [];
        _onTryPlayFailList: Function[] = [];
        _onNavigateToFailList: Function[] = [];
        _onErrorList: Function[] = [];
        constructor(flowId: number, flowType: number) {
            this._flowId = flowId;
            this._flowType = flowType;
            //添加一个默认销毁监听，用于销毁自身产生的监听事件和对象实例
            this.onDestroy(() => {
                this.offAllEvent();
                this._destroyed = true;
            })
            //添加一个默认错误监听，用于销毁自身产生的监听事件和对象实例
            this.onError(() => {
                this.offAllEvent();
            })
        }
        onDestroy(f: Function) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.onDestroy + this._flowId;
            cc.director.on(eventType, f);
            this._onDestroyList.push(f);
        }
        onTryPlaySuccess(f: (gold: number) => void) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.onTryPlaySuccess + this._flowId;
            cc.director.on(eventType, f);
            this._onTryPlaySuccessList.push(f);
        }
        onTryPlayFail(f: (errorMsg) => void) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.onTryPlayFail + this._flowId;
            cc.director.on(eventType, f);
            this._onTryPlayFailList.push(f);
        }
        onNavigateToFail(f: (errorMsg) => void) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.onNavigateToFail + this._flowId;
            cc.director.on(eventType, f);
            this._onNavigateToFailList.push(f);
        }
        onError(f: (errorMsg) => void) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.onError + this._flowId;
            cc.director.on(eventType, f);
            this._onErrorList.push(f);
        }
        offDestroy(f: Function) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.offDestroy + this._flowId;
            cc.director.off(eventType, f);
        }
        offTryPlaySuccess(f: Function) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.offTryPlaySuccess + this._flowId;
            cc.director.off(eventType, f);
        }
        offTryPlayFail(f: Function) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.offTryPlayFail + this._flowId;
            cc.director.off(eventType, f);
        }
        offNavigateToFail(f: Function) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.offNavigateToFail + this._flowId;
            cc.director.off(eventType, f);
        }
        offError(f: Function) {
            if (!f) {
                return
            }
            let eventType = EventConst.FlowEvent.offError + this._flowId;
            cc.director.off(eventType, f);
        }

        set node(node: any) {
            this._node = node;
        }

        get node() {
            return this._node;
        }

        destroy() {
            if (this._destroyed) {
                return
            }
            this._destroyed = true;
            if (!this._node) {
                cc.director.emit(EventConst.FlowEvent.onDestroy + this._flowId);
                return
            }
            this._node.getComponent(scriptNames[this._flowType]).destroyMyself();
        }

        clickRandomGame(success, fail) {
            if (this._destroyed) {
                return
            }
            
            this._node.getComponent(scriptNames[this._flowType]).clickRandomGame(success, fail);
        }

        offAllEvent() {
            this._onDestroyList.forEach(f => {
                this.offDestroy(f);
            });
            this._onTryPlaySuccessList.forEach(f => {
                this.offTryPlaySuccess(f);
            });
            this._onTryPlayFailList.forEach(f => {
                this.offTryPlayFail(f);
            });
            this._onNavigateToFailList.forEach(f => {
                this.offNavigateToFail(f);
            });
            this._onErrorList.forEach(f => {
                this.offError(f);
            });
        }
    }
    let sellFlowPlugin = {
        flowList: [],
        currentFlowIdMax: 0,
        /**
         创建卖量广告
         @param positionId 位置id/位置key
         @param parentNode 广告挂载的父节点，默认挂载到根节点上
         @param x 位置x，cocos默认坐标系,默认值为0
         @param y 位置y，cocos默认坐标系,默认值为0
         @param zIndex 展示层级，默认99
         @param showCount 展示的icon数量
         @param autoScrollX 是否开启水平自动滚动
         @param autoScrollY 是否开启垂直自动滚动
         @param iconShake 是否开启icon自动抖动
         @param slideIn 是否开启弹窗滑动打开动效
         @param resultWinOrFail 打开游戏结束模板弹窗时，打开的是失败还是胜利。1为胜利、0为失败
         @param interval 自动刷新的间隔，需要大于等于1秒
         @param extraData 额外参数，可以是对象或其他类型。方便开发者自行拓展修改模板需求使用
         @param success 成功回调
         @param fail 失败回调
         @param onCloseButtonInit 广告界面"关闭/返回"按钮渲染回调，用于对该按钮有显示、隐藏要求的功能拓展
         @param onContinueButtonClick 广告界面"继续游戏/下一关"按钮点击事件回调，用于对该按钮有特殊要求的功能拓展，该参数会拦截该按钮的默认逻辑，需要开发者调用关闭接口关闭广告界面
         @param onCloseButtonClick 广告界面"关闭/返回"按钮点击事件回调，用于对该按钮有特殊要求的功能拓展，该参数会拦截关闭按钮的默认关闭逻辑，需要开发者调用关闭接口关闭广告界面
         @param onDestroy 广告界面销毁事件回调
         @param onTryPlaySuccess 广告界面点击游戏试玩成功事件回调，可用于试玩成功的交互功能
         @param onTryPlayFail 广告界面点击游戏试玩失败事件回调，可用于试玩失败的交互功能
         @param onNavigateToFail 广告界面点击游戏跳转失败事件回调，可用于跳转失败的交互功能
         @param onError 广告界面错误事件回调
         @example 
         ```js
         let flow = lwsdk.createFlow({
          positionId: 'DD_ICON',
         })
         ```
         */
        createFlow({
            positionId,
            parentNode,
            x,
            y,
            zIndex = 99,
            showCount = 0,
            autoScroll,
            iconShake,
            slideIn,
            resultWinOrFail,
            interval,
            extraData,
            success,
            fail,
            onCloseButtonInit,
            onContinueButtonInit,
            onContinueButtonClick,
            onCloseButtonClick,
            onDestroy,
            onTryPlaySuccess,
            onTryPlayFail,
            onNavigateToFail,
            onError
        }: createFlowParam): Flow {
            parentNode = parentNode || ccUtils.getRoot();
            if (!this.isInit()) {
                return null
            }
            let data = this.getDiversionDataByKey(positionId);
            if (!data || !data.data || data.data.length === 0) {
                this.error(`${positionId} error in getAdShowType`); //对应的data数据不存在,或者因为最高版本号限制或着版本号不对应问题导致data为空数组，
                return null;
            }
            let flowType = data.show_type;
            if (flowType === null) {
                this.error(`未找到位置“${positionId}”对应的展示广告类型，请找运营确认是否配置错误。`);
                return null
            }
            if (flowType === 0) {
                this.log(`位置${positionId}对应的类型是‘不控制’，请找运营确认是否配置错误，或者要求特殊展示而不使用模板组件（可以通过lwsdk.getAdDataToShow获取原始数据）。`);
                return null
            }
            let path = paths[flowType];
            if (!path) {
                this.error(`error in lwsdk.createFlow，未知的展示模板类型：${flowType}。`);
                return null
            }
            if (data.color_type && data.color_type > 1) {
                path += data.color_type;
            }
            // path += 2;
            this.currentFlowIdMax += 1;
            let flowId = this.currentFlowIdMax;
            let flowInstance = new Flow(flowId, flowType);
            let scriptName = scriptNames[flowType];
            ccUtils.loadPrefab(path)
                .then(node => {
                    this.log(`创建ID为‘${positionId}’的广告位`, (node as cc.Node).name, (node as cc.Node).uuid);
                    if (!node) {
                        this.error('创建广告位失败。');
                        flowInstance.onError = fail;
                        cc.director.emit(EventConst.FlowEvent.onError);
                        return
                    }
                    if (flowInstance._destroyed) {
                        (node as cc.Node).getComponent(scriptName).destroyMyself();
                        return
                    }
                    // 添加监听事件
                    flowInstance.onDestroy(onDestroy);
                    flowInstance.onTryPlaySuccess(onTryPlaySuccess);
                    flowInstance.onTryPlayFail(onTryPlayFail);
                    flowInstance.onNavigateToFail(onNavigateToFail);
                    flowInstance.onError(onError);
                    // 组件模板初始化
                    (node as cc.Node).getComponent(scriptName).init({
                        flowId: flowId,
                        positionId,
                        parentNode,
                        x,
                        y,
                        zIndex,
                        showCount,
                        autoScroll,
                        iconShake,
                        slideIn,
                        resultWinOrFail,
                        interval,
                        flowType,
                        extraData,
                        success,
                        fail,
                        onCloseButtonInit,
                        onContinueButtonInit,
                        onContinueButtonClick,
                        onCloseButtonClick,
                        onDestroy,
                        onTryPlaySuccess,
                        onTryPlayFail,
                        onNavigateToFail,
                        onError
                    } as initParam);
                    parentNode.addChild(node);
                    (node as cc.Node).zIndex = zIndex;
                    flowInstance.node = node;
                    success && success()
                });
            return flowInstance
        },

        /**
         销毁广告
         @param flow 广告实例
         @example 
         ```js
         let flow = lwsdk.createFlow({
            positionId: 'DD_ICON',
         })
         lwsdk.destroyFlow(flow);
         ```
         */
        destroyFlow(flow: Flow): void {
            if (!flow) {
                this.error('请传入已创建的广告位。');
                return
            }
            flow.destroy && flow.destroy();
        },

        /**
         点击广告随机游戏
         @param flow 广告实例
         @param success 成功回调
         @param fail 失败回调
         @example 
         ```js
         let flow = lwsdk.createFlow({
            positionId: 'DD_ICON',
         })
         lwsdk.clickRandomGame(flow);
         ```
         */
        clickRandomGame(flow: Flow, success: () => void, fail: (err) => void): void {
            if (!flow) {
                this.error('请传入已创建的广告位。');
                return
            }
            flow.clickRandomGame && flow.clickRandomGame(success, fail);
        }
    }
    function extendLWSDK() {
        setTimeout(() => {
            if (!lwsdk) {
                let err = new Error('缺少文件，请先引入“lwsdk.js”。');
                throw err;
            }
            Object.assign(lwsdk, sellFlowPlugin);
        }, 10)
    }
    extendLWSDK();
})()
