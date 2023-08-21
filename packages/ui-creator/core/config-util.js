let fs = require('fire-fs');
let path = require('fire-path');

const package_name = 'ui-creator';

module.exports = {
    config_data: {},
    my_data: {
        exportPath: '', // 默认在同名bundle
        exportFlag: '$', // 导出标识
        ccButton: 'btn_', 
        ccLable: 'lab_', 
        ccEditBox: 'edit_',
        ccScrolleView: 'scro_',
        ccRickText:'rLab_',
        ccSpine: 'spine_',
        ccProgress: 'bar_',
        ccPageView: 'pView_',
        ccToggle: 'tog_',
        ccToggleContainer: 'togC_',
    },
    initCfg(cb) {
        let cfgPath = this._getPath();
        if (fs.existsSync(cfgPath)) {
            fs.readFile(cfgPath, 'utf-8', (err, data) => {
                if (!err) {
                    this.config_data = JSON.parse(data.toString());
                    if (!this.config_data[package_name]) {
                        this.config_data[package_name] = this.my_data;
                        this._save();
                    } else {
                        this.my_data = this.config_data[package_name];
                    }
                    cb && cb(this.my_data);
                }
            });
        } else {
            cb && cb(this.my_data);
        }
    },
    saveCfg(data) {
        Editor.log(data);
        // this.my_data.nodeOutputPath = data.nodeOutputPath;
        // this.my_data.uiOutputPath = data.uiOutputPath;
        this.config_data[package_name] = this.my_data;
        this._save();
    },
    _save() {
        let cfgPath = this._getPath();
        fs.writeFileSync(cfgPath, JSON.stringify(this.config_data));
    },
    _getPath() {
        let cfgFileName = `${package_name}-configuration.json`;
        let cfgPath = path.join(Editor.Project.path, 'settings', cfgFileName);
        return cfgPath;
    }
}