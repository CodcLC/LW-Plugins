
class ResLoader {
    private static _inst: ResLoader = null;
    public static getInst(): ResLoader {
        if (!ResLoader._inst) {
            ResLoader._inst = new ResLoader();
        }
        return ResLoader._inst;
    }

    public load<T extends cc.Asset>(bundleName:string, paths: string, type: typeof cc.Asset, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: T) => void): void;
	public load<T extends cc.Asset>(bundleName:string, paths: string[], type: typeof cc.Asset, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void;
    public load<T extends cc.Asset>(bundleName:string, paths: string, onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: T) => void): void;
    public load<T extends cc.Asset>(bundleName:string, paths: string[], onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void;
    public load<T extends cc.Asset>(bundleName:string, paths: string, type: typeof cc.Asset, onComplete?: (error: Error, assets: T) => void): void;
    public load<T extends cc.Asset>(bundleName:string, paths: string[], type: typeof cc.Asset, onComplete?: (error: Error, assets: Array<T>) => void): void;
    public load<T extends cc.Asset>(bundleName:string, paths: string, onComplete?: (error: Error, assets: T) => void): void;
    public load<T extends cc.Asset>(bundleName:string, paths: string[], onComplete?: (error: Error, assets: Array<T>) => void): void;		
    public load() {
        let args = Array.from(arguments);
        let bundleName = args[0] || 'resources';
        args.splice(0, 1)
        this.loadBundle(bundleName, (bundle) => {
            bundle.load.apply(bundle, args);
        })
    }

    /** 加载Bundle */
    public loadBundle(bundleName: string, cb: (bundle: cc.AssetManager.Bundle) => void) {
        let bundle = cc.assetManager.getBundle(bundleName);
        if (bundle) {
            cb(bundle);
        }
        else {
            cc.assetManager.loadBundle(bundleName, (err, b:cc.AssetManager.Bundle) => {
                if (err) {
                    cb(null);
                    cc.error(err);
                }
                else {
                    cb(b);
                }
            })
        }
    }

    public async loadSync(bundleName = 'resources', path, type?: typeof cc.Asset){
        return new Promise((resolve, reject) => {
            this.loadBundle(bundleName, (bundle) => {
                if (!bundle) {
                    reject(null);
                    return;
                }
                bundle.load(path, type, (err, asset: cc.Asset) => {
                    if (err) {
                        reject(null);
                    }
                    else {
                        resolve(asset);
                    }
                })
            })
        })
    }

    public async loadBundleSync() { 
        
    }
}
export default ResLoader.getInst();