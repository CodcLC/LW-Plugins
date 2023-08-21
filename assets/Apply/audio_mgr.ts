import Data from "./Data";


const { ccclass, property } = cc._decorator;

//Bgm类型枚举，除了kNone字段外必须与kBgms数组中的元素一一对应
export enum BgmType {
    kMenu,
    kNone = 9999,
}

const kBgms = [
    'bgm',
]
const kSfxSet = [
    "attack1",
    "attack2",
    "click",
    "draw",
    "fail",
    "getcoin",
    "hit",
    "victory",
]

//Sfx类型枚举，除了kNone字段外必须与kSfxSet数组中的元素一一对应
export enum SfxType {
    kattack1,
    kattack2,
    kclick,
    kdraw,
    kfail,
    kgetcoin,
    khit,
    kvictory,
}





/**
 * 暂停音频的的类型，不同的类型暂停和恢复的处理不同
 * 比如，在观看视频时音频会被暂停播放，这时候切后台会再调用一次音频暂停，
 * 切前台后会调用一次音频恢复，这两次调用都会无效，直到看视频结束或者取消观看视频后才真正恢复播放
 */
export enum AudioPauseType {
    kNorm, //普通
    kVideoAd, //观看视频广告
    kBackend //切后台
}

@ccclass
export default class AudioMgr {

    static audioMCMap = [];

    static audioEFMap = [];

    static musicState = false;

    static effeState = false;

    static initAudio() {
        cc.assetManager.loadBundle("audio", (err) => {
            if (err) {
                console.log(err)
                return;
            }
            for (let i = 0; i < kSfxSet.length; i++) {
                cc.assetManager.getBundle('audio').load(kSfxSet[i], cc.AudioClip, (err, asss) => {
                    if (err) {
                        return;
                    }
                    this.audioEFMap[i] = asss;
                    if (this.audioEFMap.length >= kSfxSet.length) {
                        this.effeState = true;
                    }
                })
            }

            for (let i = 0; i < kBgms.length; i++) {
                cc.assetManager.getBundle('audio').load(kBgms[i], cc.AudioClip, (err, asss) => {
                    if (err) {
                        return;
                    }
                    this.audioMCMap[i] = asss;
                    this.musicState = true;
                    this.playMusic(BgmType.kMenu);
                })
            }
        })

    }

    /**
     * 播放背景音乐
     * @param idx 
     * @param loop 
     */
    static playMusic(idx, loop = true) {
        if (!Data.set.music || !this.musicState) {
            return
        }
        cc.audioEngine.playMusic(this.audioMCMap[idx], loop);

    }

    /**
     * 停止背景音乐的播放
     */
    static stopMusic() {
        
        cc.audioEngine.stopMusic();
    }

    /**
    * 暂停背景音乐的播放
    */
    static pauseMusic() {
        // if (!Data.set.music || !this.musicState) {
        //     return
        // }
        cc.audioEngine.pauseMusic();
    }

    /**
     * 恢复背景音乐的播放
     */
    static resumeMusic() {
        if (!Data.set.music || !this.musicState) {
            return
        }
        cc.audioEngine.resumeMusic();
    }

    /**
     * 播放背景音乐
     * @param idx 
     * @param loop 
     */
    static playEffect(idx, loop = false) {
        if (!Data.set.music || !this.effeState) {
            return
        }
        cc.audioEngine.playEffect(this.audioEFMap[idx], loop);
    }

}
