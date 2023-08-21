
let metaMap = {};

export function Metadata(description: string) {
    return (target, name) => {
        //console.log("++++++++++++++", target, name, description);
        //["__classname__"]
        // let keys = Object.keys(target);
        // for(let k of keys) {
        //     console.log(k);
        // }
        setTimeout(() => {
            let clsName = target["__classname__"] || "default";
            if (!metaMap[clsName]) {
                metaMap[clsName] = {};
            }
            let map = metaMap[clsName];
            map[name] = description;
        }, 1)
    }
}

/** 
 * 获取标记属性 
 * @param {string} className 类名
 * @param {string} attrKey 属性名
 */
export function getMatedata(className: string, attrKey: string) {
    if (!metaMap[className]) {
        return null;
    }
    return metaMap[className][attrKey] || null;
}
