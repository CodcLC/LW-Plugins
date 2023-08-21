
/** 界面配置 */
const ViewConfig = {
    // "TTView": <VConf>{BundlePath: 'TTView', PrefabPath: 'TTView', preventTouch: false},
    // "TTView2": <VConf>{BundlePath: 'TTView2', PrefabPath: 'TTView2', preventTouch: false},
    // "PopView": <VConf>{BundlePath: 'PopView', PrefabPath: 'PopView', preventTouch: false},
    // "PopView2": <VConf>{BundlePath: 'PopView2', PrefabPath: 'PopView2', preventTouch: false},
    // "SubView": <VConf>{BundlePath: 'SubView', PrefabPath: 'SubView', preventTouch: false},
    // "ButtonView": <VConf>{BundlePath: 'ButtonView', PrefabPath: 'ButtonView', preventTouch: false},
    
    "Load": <VConf>{BundlePath: 'Load', PrefabPath: 'Load', preventTouch: false},
    "Start": <VConf>{BundlePath: 'Start', PrefabPath: 'Start', preventTouch: false},
    "Draw": <VConf>{BundlePath: 'Draw', PrefabPath: 'Draw', preventTouch: false},
    "Game": <VConf>{BundlePath: 'Game', PrefabPath: 'Game', preventTouch: true},
    "Shop": <VConf>{BundlePath: 'Shop', PrefabPath: 'Shop', preventTouch: false},
    "Rich": <VConf>{BundlePath: 'Rich', PrefabPath: 'Rich', preventTouch: false},
    "Sett": <VConf>{BundlePath: 'Sett', PrefabPath: 'Sett', preventTouch: false},
    "Buff": <VConf>{BundlePath: 'Buff', PrefabPath: 'Buff', preventTouch: false},
    "Set": <VConf>{BundlePath: 'Set', PrefabPath: 'Set', preventTouch: false},
    "Export": <VConf>{BundlePath: 'Export', PrefabPath: 'Export', preventTouch: false},
    "Trial": <VConf>{BundlePath: 'TT', PrefabPath: 'Trial', preventTouch: false},
    "Video": <VConf>{BundlePath: 'TT', PrefabPath: 'Video', preventTouch: false},
    "Egg": <VConf>{BundlePath: 'TT', PrefabPath: 'Egg', preventTouch: false},
}
export default ViewConfig

// ViewClass = ViewClass || {}

export class VConf {
    BundlePath: string;
    PrefabPath: string;
    /** 在界面开启前屏蔽点击 */
    preventTouch: boolean = false;
}