
declare interface initParam {
  flowId: number,
  positionId: string,
  parentNode?: any,
  x?: number,
  y?: number,
  zIndex?: number,
  showCount?: number,
  autoScroll?: boolean,
  iconShake?: boolean,
  slideIn?: boolean,
  resultWinOrFail?: 1 | 0,
  interval?: number,
  flowType?: number,
  extraData?: any,
  success?: () => void,
  fail?: (err) => void,
  onCloseButtonInit?: (buttonNode) => void,
  onContinueButtonInit?: (buttonNode) => void,
  onContinueButtonClick?: (buttonNode) => void,
  onCloseButtonClick?: (buttonNode) => void,
  onDestroy?: () => void,
  onTryPlaySuccess?: (gold: number) => void,
  onTryPlayFail?: (errorMsg) => void,
  onNavigateToFail?: (errorMsg) => void,
  onError?: (errorMsg) => void
}
declare interface createFlowParam {
  positionId: string,
  parentNode?: any,
  x?: number,
  y?: number,
  zIndex?: number,
  showCount?: number,
  autoScroll?: boolean,
  iconShake?: boolean,
  slideIn?: boolean,
  resultWinOrFail?: 1 | 0,
  interval?: number,
  extraData?: any,
  success?: () => void,
  fail?: (err) => void,
  onCloseButtonInit?: (buttonNode) => void,
  onContinueButtonInit?: (buttonNode) => void,
  onContinueButtonClick?: (buttonNode) => void,
  onCloseButtonClick?: (buttonNode) => void,
  onDestroy?: () => void,
  onTryPlaySuccess?: (gold: number) => void,
  onTryPlayFail?: (errorMsg) => void,
  onNavigateToFail?: (errorMsg) => void,
  onError?: (errorMsg) => void
}
declare class Flow {
  /**
   * 销毁监听
   * @param f 回调函数
   */
  onDestroy(f: () => void);
  /**
   * 试玩成功监听
   * @param f 回调函数
   */
  onTryPlaySuccess(f: (gold: number) => void);
  /**
   * 试玩失败监听
   * @param f 回调函数
   */
  onTryPlayFail(f: (errorMsg) => void);
  /**
   * 跳转失败监听
   * @param f 回调函数
   */
  onNavigateToFail(f: (errorMsg) => void);
  /**
   * 错误监听
   * @param f 回调函数
   */
  onError(f: (errorMsg) => void);
  /**
   * 取消监听
   * @param f 回调函数
   */
  offDestroy(f: Function);
  /**
   * 取消监听
   * @param f 回调函数
   */
  offTryPlaySuccess(f: Function);
  /**
   * 取消监听
   * @param f 回调函数
   */
  offTryPlayFail(f: Function);
  /**
   * 取消监听
   * @param f 回调函数
   */
  offNavigateToFail(f: Function);
  /**
   * 取消监听
   * @param f 回调函数
   */
  offError(f: Function);
}
declare namespace lwsdk {
  /**
  创建卖量广告位
  @param positionId 位置id/位置key
  @param parentNode 广告挂载的父节点，默认挂载到根节点上
  @param x 位置x，cocos默认坐标系,默认值为0
  @param y 位置y，cocos默认坐标系,默认值为0
  @param zIndex 展示层级，默认99
  @param showCount 展示的icon数量
  @param autoScroll 是否开启自动滚动
  @param iconShake 是否开启icon自动抖动
  @param slideIn 是否开启弹窗滑动打开动效
  @param resultWinOrFail 打开游戏结束模板弹窗时，打开的是失败还是胜利。1为胜利、0为失败
  @param interval 自动刷新的间隔，单位（秒）需要大于等于1秒
  @param extraData 额外参数，可以是对象或其他类型。方便开发者自行拓展修改模板需求使用
  @param success 成功回调
  @param fail 失败回调
  @param onCloseButtonInit 广告界面"关闭/返回"按钮渲染回调，用于对该按钮有显示、隐藏要求的功能拓展
  @param onContinueButtonInit 广告界面"继续游戏/下一关"按钮渲染回调，用于对该按钮有显示、隐藏要求的功能拓展
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
  export function createFlow({
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
}: createFlowParam): Flow;

  /**
   销毁广告
    @param flow 广告实例
    @example 
    ```js
    let flow = lwsdk.createFlow({
      positionId: 'DD_ICON',
    })
    //-------------------------
    //-------------------------
    //-------------------------
    //-------------------------
    lwsdk.destroyFlow(flow);
    ```
    */
  export function destroyFlow(flow: Flow): void;

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
  export function clickRandomGame(flow: Flow, success: () => void, fail: (err) => void): void;

  /**
   * 返回该位置去重后的appid总数
   * @param positionKey 对应位置的key或id
   */
  export function differentAppidsCount(positionKey: string): number;
}