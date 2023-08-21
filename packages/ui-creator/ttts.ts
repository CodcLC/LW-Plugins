/**
 * name: 
 * author:
 * Date:
 * Desc:
 */

import BaseView from "../Framework/View/BaseView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestNode extends BaseView {

    //--Auto export attr, Don't change--
	public bg: cc.Node = null;
	public btnClose: cc.Node = null;
	//--Auto export attr, Don't change end--

    /** 界面初始化 在 onLoad 和 onEnable执行之后  start执行之前 */
    protected init(...arg) {
        // TODO
        console.log("11111111111")
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
}
