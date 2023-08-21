
/**
 * 一些通用的函数就放在这里
 */
export default class Apply {
    /**
     * 数组去重，Nah被忽略，对象不去重
     * @param arr 传入数组参数
    */
    public static repeatArray(arr: any[]) {
        let res = arr.filter(function (item, index, array) {
            return array.indexOf(item) === index;
        })
        return res;
    }

    /**
     * 去除数组特定的对象
     * @param arr 
     * @param target 
     */
    public static rmFromArray(arr: Array<any>, target: any) {
        for (let index = 0; arr.length; ++index) {
            if (arr[index] == target) {
                arr.splice(index, 1);
                break;
            }
        }
    }

    /**
     * 数组里是否有
     * @param target 目标节点
     * @param arr   目标数组
     */
    public static isEqual(target,arr) {
        let bool = false;
        for (let index = 0; index < arr.length; index++) {
            if (arr[index] == target) {
                bool = true;
                return bool;
            }
        }
        return bool;
    }

    /**
     *  * 把一个节点的本地坐标转到另一个节点的本地坐标下(原点在中心)
     * @param {*} node 
     * @param {*} targetNode 
     */
    public static convetOtherNodeSpaceAR(node, targetNode) {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint = this.localConvertWorldPointAR(node);
        return this.worldConvertLocalPointAR(targetNode, worldPoint);
    }

    /**
    * 得到一个节点的世界坐标
    * node的原点在中心
    * @param {*} node 
    */
    public static localConvertWorldPointAR(node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }

    /**
        * 把一个世界坐标的点，转换到某个节点下的坐标
        * 原点在node中心
        * @param {*} node 
        * @param {*} worldPoint 
        */
    public static worldConvertLocalPointAR(node, worldPoint) {
        if (node) {
            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }

    //取一个随机范围内的数字，min必须小于max
    /*
        let r = G.randRange(1, 3)
    */
    public static randRange(min: number, max: number): number {
        return Math.round(Math.random() * (max - min)) + min
    }

    /**
     * 取一个随机范围内的小数，min必须小于max，返回值保留3位小数
     * @param min 最小值
     * @param max 最大值
     * @param decimals 小数位数，默认为0，表示不限制位数，否则应该为大于0的数
     */
    public static randRangeF(min: number, max: number, decimals = 0): number {
        let ret = Math.random() * (max - min) + min
        if (decimals > 0)
            ret = parseFloat(ret.toFixed(decimals))

        return ret
    }

    /**
     * 
     * 加载龙骨的函数
     * @param node 龙骨的组件
     * @param path 龙骨所在的头文件名
     * @param path2 龙骨所在的路劲
     * @param cackfun   龙骨的回调函数
     */
    public static loadDragonBones(node, path1, path2, cackfun?: Function) {
        cc.assetManager.loadBundle(path1, (err) => {
            if (err) {
                console.log(err)
                return;
            }
            cc.assetManager.getBundle(path1).loadDir(path2, (err, assets) => {
                if (err || assets.length <= 0) {
                    console.log(err)
                    return;
                }
                assets.forEach(asset => {
                    if (asset instanceof dragonBones.DragonBonesAsset) {
                        node.dragonAsset = asset;
                    }
                    if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
                        node.dragonAtlasAsset = asset;
                    }
                });
                if (cackfun) {
                    cackfun();
                }
            })
        })

    }

    /**
     * 
     * 加载文件的函数
     * @param path 头文件名
     * @param path2 文件路劲
     * @param cackfun   文件回调函数
     */
    public static loadDras(path1, path2, cackfun?: Function) {
        cc.assetManager.getBundle(path1).loadDir(path2, (err, res) => {
            if (err == null) {
                let arr = [];
                for (let index in res) {
                    if (res[index] instanceof cc.SpriteFrame) {
                        arr.push(res[index]);
                    }
                }
                if (cackfun) {
                    cackfun(arr);
                }
            }
        })

    }
}



