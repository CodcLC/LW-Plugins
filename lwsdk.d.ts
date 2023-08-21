// declare let wx: any;
// declare let tt: any;
// declare let qq: any;
// declare let GameGlobal: any;
declare namespace lwsdk {
  /**
  lwsdk初始化 WeChatLoginNoAuth(无授权登录)
  @param {string} debug 是否开启debug，值为true打开，false关闭
  @param {string} changeHost 是否把旧域名切换到新域名，值为true则切换，默认为true（https://res.g.llewan.com/4.png替换为https://res.fdn4i.com/4.png），false则不切换
  @param {string} game 游戏编码，乐玩后台获取， 比如'tatajuntuan-weixin'
  @param {string} version 游戏版本，乐玩后台获取 ,比如'1.0.0'
  @param {string} dev_platform 游戏发布平台，乐玩后台获取 ,比如'weixin'、'toutiao'、'qq'
  @param {string} ald_key 阿拉丁统计的key ,若不需要阿拉丁统计可以不传该参数。比如'07f4d248a97a22da54005d7fd6f34301'
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
       success: (userinfo) => {
        // 初始化成功
        console.log(userinfo);
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
  export function init({
    game, version,
    dev_platform,
    ald_key,
    debug,
    success,
    fail,
    changeHost,
    tryLogMaxCount,
    gameAdIsNeed,
    preloadBanner,
    BANNERAD_MAX_COUNT,
    loginIsNeed
  }: {
    game, version: string,
    dev_platform: string,
    ald_key?: string,
    debug?: boolean,
    success: ({ uid, openid, nickName, gender, avatarUrl }: { uid: string, openid: string, nickName: string, gender: string, avatarUrl: string }) => void,
    fail: (err) => void,
    changeHost?: boolean,
    tryLogMaxCount?: number,
    gameAdIsNeed?: boolean,
    preloadBanner?: boolean,
    BANNERAD_MAX_COUNT?,
    loginIsNeed?: boolean
  }): void;

/**
 {调用分享或视频} 主动拉起视频广告或分享，一般用于控制游戏道具奖励，在按钮点击事件里调用。
注意：运营需求文档里可能会写到视频失败（没有视频）后要调用分享，但是调用此方法在拉取视频失败时会自动调用分享功能，所以不需要额外再调用分享。
 @param {String} [buttonKey] 按钮对应的key，乐玩后台配置
 @param {boolean} autoShare 是否在视频错误时自动调用分享，默认为true
 @param {callback} [success] 成功回调
 @param {callback} [fail] 失败回调
 @example 
 ```js
  var fail = function (type) {
    // type 的值可能为 share/video/none 分别对应 分享失败/视频未看完/当天通过分享或视频奖励次数已用完
    if (type === 'share'){

    } else if (type === 'video') {
      
    } else if (type === 'none') {
        
    }
  }
  lwsdk.shareOrVideo({buttonKey:"xxx",success: ()=>{},fail: fail});
  ```
*/
export function shareOrVideo({ buttonKey, shareType, autoShare, success, fail }: { buttonKey: string, shareType?: number,autoShare?: boolean, success: () => void, fail: (type: 'share' | 'video' | 'none') => void }): void;

/**
 {分享} 注册微信右上角分享,游戏初始化成功就可以调用了 onShareAppMessage(分享)
 @param {int} type=0 后台自定义的分享类型；例如：0：右上角分享、1：普通分享
 @param {int} specialFlag=0 特殊标记,例如0:默认、1：邀新好友、2:邀旧好友
 @param {int} rewardFlag=xxx 活动或者道具id
 @param {String} [title] 自定义转发标题
 @param {String} [imageUrl] 自定义转发显示图片的链接
 @param {String} [query] 自定义查询字符串，从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。必须是类似 key1=val1&key2=val2 的格式。
 @param {callback} [success] 成功回调
 @param {callback} [fail] 失败回调
 @example 
 ```js
 lwsdk.onShareAppMessage({type: 0 });
 ```
 */
export function onShareAppMessage({ type, query, success, fail, rewardFlag, title, imageUrl, specialFlag }?): void;

/**
 {分享} 主动拉起微信分享 shareAppMessage(分享)
 @param {int} type=0 后台自定义的分享类型；例如：0：右上角分享、1：普通分享
 @param {int} specialFlag=0 特殊标记,例如0:默认、1：邀新好友、2:邀旧好友
 @param {int} rewardFlag=xxx 活动或者道具id
 @param {String} [title] 自定义转发标题
 @param {String} [imageUrl] 自定义转发显示图片的链接
 @param {String} [query] 自定义查询字符串，从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。必须是类似 key1=val1&key2=val2 的格式。
 @param {callback} [success] 成功回调
 @param {callback} [fail] 失败回调
 @example 
 ```js
 lwsdk.shareAppMessage({type: 1,query: "a=1",success:()=>{},fail:(err)=>{} });
 ```
 */
export function shareAppMessage({ type, query, success, fail, rewardFlag, title, imageUrl, specialFlag }): void;

/**
{后台按钮开关} 游戏后台配置信息，运营人员使用的通用配置开关控制，一般用于控制游戏内容的显示和隐藏。返回布尔值，true代表开关打开，false代表关闭
@param {string} buttonKey 开关的key，由运营提供，比如'SHARE' 
@example 
```js
if(!lwsdk.getButtonVisible('SHARE')){
  //这里可以控制内容隐藏
} else {
  //这里可以控制内容显示
}
```
*/
export function getButtonVisible(buttonKey: string): boolean;

/**
 显示banner广告。
 @param {number} bottomOffset banner与屏幕底部距离
 @param {left?: number, top?: number, width?: number} style banner样式 不传采用默认样式
 @param {function} success 成功回调
 @param {function} fail 失败回调
 @example 
 ```js
 lwsdk.showBanner({
  style: {
    left:0,
    top:0,
    width:300
  },
  bottomOffset: 0,
  success: function(){
    console.log('展示成功')
  },
  fail:function(err){
    console.log('展示失败');
    // 这里可以写其他失败处理逻辑
  }
 })
 ```
 */
export function showBanner({style, bottomOffset, fail, success }?: {style?:{left?: number, top?: number, width?: number}, bottomOffset?: number, fail?: (err) => void, success?: (err) => void }): void;

/**
 关闭banner广告
 @example 
 ```js
 lwsdk.hideBanner()
 ```
 */
export function hideBanner(): void;

/**
一般用于事件埋点上报， 将事件信息发送到乐玩服务器记录
 @param {String} sceneName 场景名称，比如：第1关,第2关，厨房，矿坑
 @param {String} eventType 事件名称，比如：点击、加载、触摸、移动
 @param {String} eventId 事件ID 通常谢按钮的英文或者中文名字，比如：首页-开始闯关
 @param {function} callback 回调函数
 @example 
 ```js
 lwsdk.sendEvent({ eventId: '首页-开始游戏', eventType: '点击', sceneName: '主界面', callback: (res) => {console.log(res)} });
 ```
 */
export function sendEvent({ eventId, eventType, sceneName, callback }: { eventId: string, eventType: string, sceneName: string, callback: (res) => void }): void;

/**
 获取重新排序处理后展示用的卖量广告数据
 @param {Object} positionKey 对应位置的key，该参数由我放运营提供
 @param {Number} showCount 需要展示的游戏数量，如果要取全部数据请填写 0
 @param {Number} index 索引值，默认第一个从0开始，需要调用者自行管理该参数的状态，函数返回值里包含index新的值，需要更新。每个不同展示的地方都需要独立管理index状态，一般重新打开展示场景（界面）可以重置为0
 @returns {object} {data:[],index:0,gc_status:1}//gc_status为1时代表是可以试玩的
 @example
 ```js
  var positionKey = 'ceshi';//对应位置的key，该参数由我放运营提供
  var index1 = 0;//需要调用者自行管理该值得更新或重置
  var showCount = 1;//需要展示的游戏数量，如果要取全部数据请填写 0
  var data = lwsdk.getAdDataToShow({positionKey: positionKey,showCount: showCount,index: index1});
  //需要更新index1的值
  index1 = data.index;
  //lwsdk.getAdDataToShow返回的值数据结构如下:
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
```
 */
export function getAdDataToShow({ positionKey, showCount, index }: { positionKey: string, showCount: number, index: number }): { data: [{ name: string, icon: string, display_type: 1 | 2, gc_status: 0 | 1, tx_switch: 0 | 1, label_switch: 0 | 1, try_status?: 1 }], index: number, gc_status: 0 | 1 };

/**
 卖量功能需求可调用（乐玩导流位、互推功能）——调用该方法触发游戏跳转。
 @param {JSON} adItem 把当前点击的游戏item完整数据传进来，不用额外处理，类似：{appid: "wx99ef5bd0791407a1",name: "一起切水果",path: "?wxgamecid=CCBgAAoXkpQY97LalPGvHM&source_id=243",......}
 @param {function} [tryPlaySuccess] 试玩成功的回调，非必传，试玩模式的游戏可以传该参数。回调参数是奖励的金币gold。
 @param {function} [tryPlayFail] 试玩失败的回调，非必传，试玩模式的游戏可以传该参数。回调参数是失败原因。
 @param {function} [navigateToFail] 跳转失败的回调，非必传。回调参数是失败原因，包括点击取消和其他原因，按需自行判断使用。
 @param {function} [navigateToSuccess] 跳转成功的回调，非必传。
 @example
 ```js
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
  ```
*/
export function onAdTouch({ adItem, tryPlaySuccess, tryPlayFail, navigateToFail, navigateToSuccess }: {
  adItem: {
    name: string,
    icon: string,
    appid: string,//appid
    path: string,//"?wxgamecid=CCBgAAoXkpQY97LalPGvHM&source_id=243"
    iconid: any,
    gac_id: any,
    config_id: any,
    location_id: any,
    gc_status: 0 | 1,
    try_status?: 1
  }, tryPlaySuccess?: (gold: any) => void, tryPlayFail?: (errMsg: string) => void, navigateToFail?: (err: any) => void, navigateToSuccess?: (msg: any) => void
}): void;

/**
 保存用户数据到服务器，有存档用户游戏数据到服务器需求时可使用
 @param {String} key 键
 @param {any} data 需要保存的数据
 @param {String} success 成功回调 
 @param {String} fail 失败回调
 @deprecated 暂不提供将游戏数据存储到乐玩服务器，如有需要请联系运营同学反馈
 @example 
  ```js
  var userData = {
    score: 10,
    level: 1
   };
 lwsdk.setData({key: "userData", data: userData});
  ```
*/
export function setData({ key, data, expireTime, success, fail }: { key: string, data: any, expireTime?: number, success: Function, fail: Function }): void;

/**
 拉取用户服务器数据，有存档用户游戏数据到服务器需求时可使用
 @param {String} key 键
 @param {boolean} force 是否强行从服务器拉取数据，非本地缓存读取
 @param {function} success 成功回调
 @param {function} fail 失败回调
 @param {String} extraData 特殊情况下需要传递额外数据状况，一般不传递
 @deprecated 暂不提供将游戏数据存储到乐玩服务器，如有需要请联系运营同学反馈
 @example 
 ```js
 lwsdk.getData({key:"userData",success:(d)=>{
  console.log("获取返回",d);
 },fail:err => {

 }});
```
*/
export function getData({ key, success, fail, force, extraData }: { key: string, success: (data) => void, fail: (err) => void, force?: boolean, extraData?: any }): void;

/**
 获取服务器时间，一般用于时间比较严谨和敏感的场景。
 @param {function} success 成功回调，回调参数是毫秒时间戳
 @param {function} fail 失败回调
 @example 
 ```js
 lwsdk.getServerTime((timestamp)=>{
  console.log("获取返回", timestamp);
  var date = new Date(timestamp);
 });
 ```
*/
export function getServerTime(success: (timestamp) => void, fail: (err) => void): void;

/**
  获取自定义配置参数，如果有需求在服务器端配置一些数据或可变参数，为了方便游戏上线后，在服务端灵活修改的，可以联系我们，配置这些数据，数据格式要求是JSON格式。我方运营主动配置的自定义（在线）参数也可以通过该方法获取。
  @param {string} key 自定义数据的键
  @example 
  ```js
  //比如在服务端配置了数据：{"timeLimit": 10}
  var timeLimit = lwsdk.getCustomConfigByKey('timeLimit');//timeLimit的值将会是10
  ```
  */
export function getCustomConfigByKey(key: string): any;

/**
 获取用户信息（初始化成功后调用才能正常返回用户信息）
 @returns null 或者 json结构的用户信息{uid: string, openid: string, nickName: string, gender: string, avatarUrl: string}
 @example 
 ```js
 //.不存在时返回null
 var userinfo = lwsdk.getUser();
 ```
 */
export function getUser(): { uid: string, openid: string, nickName: string, gender: string, avatarUrl: string };

/**
 自定义事件上报（微信小游戏官方）
 @param {string} branchId 事件id
 @param {string} branchDim 自定义维度(可选)：取值[1,100]，必须为整数，当上传类型不符时不统计
 @param {number} eventType 1：曝光； 2：点击。默认值为2
 @example
 ```js
  lwsdk.wxSendEvent({
    branchId: 'aftcE_rCid',
    eventType: 2
  })
 ```
 */
  export function wxSendEvent({
    branchId,
    eventType,
    branchDim
  }: {
    branchId: string,
    eventType: number,
    branchDim?: number
  }): void;

  /**
   自定义样式显示banner广告。
   @param {number} left banner与屏幕左边距离
   @param {number} top banner与屏幕顶部距离
   @param {number} width banner宽度
   @param {function} onResize 监听 banner 广告尺寸变化事件
   @param {function} success 成功回调
   @param {function} fail 失败回调
   @deprecated 功能整合已到showBanner
   @example 
   ```js
   lwsdk.showBannerWithStyle({
     left: 10,
     top: 10,
     onResize:(bannerAd,realStyle) => {
       console.log(2222222,bannerAd,realStyle)
      }
    })
   ```
  */
 export function showBannerWithStyle({ left, top, width, onResize, fail, success }: { left: number, top: number, width?: number, onResize?: (bannerAd,realStyle) => {}, fail?: (err) => void, success?: () => {} }): void

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
  export function getConfig(configType: number);
  /**
   * @deprecated 请调用 getConfig(1);
   */
  export function getConfig1();
  /**
   * @deprecated 请调用 getConfig(2);
   */
   export function getConfig2();
   /**
   * @deprecated 请调用 getConfig(3);
   */
  export function getConfig3();
  /**
   * @deprecated 请调用 getConfig(4);
   */
   export function getConfig4();
   /**
   * @deprecated 请调用 getConfig(5);
   */
  export function getConfig5();
  /**
   * @deprecated 请调用 getConfig(6);
   */
   export function getConfig6();
   /**
   * @deprecated 请调用 getConfig(7);
   */
  export function getConfig7();

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
   export function createImage(sprite, url, cb, cachee)

   /**
     根据位置获取对应的卖量导流数据
     @param {String} positionKey 位置key
     @example
     var data = lwsdk.getDiversionDataByKey('ceshi');
     */
     export function getDiversionDataByKey(positionKey)
}