export default class PoolMgr {
    private pool: cc.NodePool = null;
    private prefab: cc.Prefab = null;
    constructor(prefab: cc.Prefab, num: number) {
        this.prefab = prefab;
        this.pool = new cc.NodePool();
        for (let i = 0; i < num; i++) {
            this.pool.put(cc.instantiate(prefab));
        }
    }

    get() {
        if (this.pool.size() == 0) {
            console.error("增加对象池对象：",this.prefab.name)
            return cc.instantiate(this.prefab);     
        }
        return this.pool.get();
    }

    put(obj: cc.Node) {
        this.pool.put(obj);
    }

    size() {
        return this.pool.size();
    }
}
