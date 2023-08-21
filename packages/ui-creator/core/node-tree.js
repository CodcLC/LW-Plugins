'use strict';

const fs = require('fire-fs');
const path = require('fire-path');
const util = require('util');

const conf = require('../export-conf');
const expConf = conf.port;
const compMap = conf.compMap;

const projectPath = Editor.Project.path; // 工程路径
const adb = Editor.assetdb;

var exportPath; // 导出路径
var exportFullPath; // 导出补全路径
let exportFlag; // 导出标识
let replaceReg = new RegExp(`\/\/--Auto export attr, Don't change--[\\w\\W]*//--Auto export attr, Don't change end--`);
let replaceFlag = `//--Auto export attr, Don't change--\n%s\t//--Auto export attr, Don't change end--`;

var getWarnMsg = function (warnStr) {
    return {
        type: 'warning',
        buttons: ['OK'],
        titile: 'warning',
        message: warnStr,
        defaultId: 0,
        noLink: true
    };
}

/**获取控件真正的名字：现在的控件名后缀有特定功能，去掉后缀才是控件真正名字 */
var getRealName = function (name) {
    let index = name.indexOf('__');
    if (index == -1) {
        return name;
    }
    name = name.substr(0, index);
    return name;
}

var getAutoUIName = function (url) {
    return path.basenameNoExt(url);
}

let $prefabData = null;
let rootName = '';
let declareStr = '';
let nameList = {};
let sameNameList = [];

let getDeclareStr = (path) => {
    $prefabData = fs.readJsonSync(path);
    let fileData = $prefabData[0];
    if (fileData["__type__"] !== 'cc.Prefab') {
        Editor.Dialog.messageBox(getWarnMsg(`请选中预制体文件导出`));
        return false;
    }
    nameList = {};
    sameNameList = [];
    declareStr = '\tprotected _autoBind: boolean = true;\n';
    let rootData = $prefabData[1]
    let rootName = rootData['_name'];
    findDeclare(rootName, rootData);
    return declareStr;
}

let findDeclare = (rootPath, nodeInfo) => {
    let name = nodeInfo['_name'];
    let path = `${rootPath}/${name}`
    // （导出标识为空 || 存在导出标识） && 不是默认取名
    if (name != rootName && (exportFlag == '' || name.indexOf(exportFlag) === 0) && name.indexOf(" ") == -1) {
        let noFlagName = name.slice(exportFlag.length, name.length);
        if (nameList[name] == undefined) { //同名控件检查
            nameList[name] = true;
            let type = 'cc.Node';
            for (let k in compMap) {
                let reg = `^${k}`;
                if (noFlagName.match(new RegExp(reg))) {
                    type = compMap[k];
                    break;
                }
            }
            declareStr += `\t@metadata("${type}")\n\tprivate _${noFlagName}: ${type} = null;\n`; // 拼接声明
        }
        else {
            sameNameList.push(path);
        }
    }

    let children = nodeInfo['_children'];
    if (!children || children == []) return; // 无子节点

    for (const childInfo in children) {
        const element = children[childInfo];
        let childID = element['__id__'];
        let childNode = $prefabData[childID];
        findDeclare(path, childNode);
    }
}

let exportFileByTsTemp = (str, uiName, filePath) => {
    if (adb.exists(filePath)) { // 如果文件已存在，就替换自动导出部分的内容
        let scriptPath = Editor.url(filePath);
        let scriptTemplate = fs.readFileSync(scriptPath) + '';
        let reStr = util.format(replaceFlag, str)
        scriptTemplate = scriptTemplate.replace(replaceReg, reStr);
        adb.saveExists(filePath, scriptTemplate);
    } else { // 不存在就按模版文件创建
        let templatePath = Editor.url('packages://ui-creator/template/tsTemp.ts')
        let scriptTemplate = fs.readFileSync(templatePath) + '';
        scriptTemplate = scriptTemplate.replace(/_CLASS_NAME_/g, uiName)
        let reStr = util.format(replaceFlag, str)
        scriptTemplate = scriptTemplate.replace(replaceReg, reStr);
        adb.create(filePath, scriptTemplate);
    }
}

module.exports = {
    init() {
        exportPath = expConf.exportPath;
        exportFullPath = path.join(projectPath, 'assets' ,exportPath);
        exportFlag = expConf.exportFlag;
    },

    dealPrefab(assetInfo) {
        if (!fs.existsSync(exportFullPath)) {
            fs.mkdirsSync(exportFullPath);
        }

        let url = assetInfo.url;
        // Editor.log(assetInfo);
        
        //获取文件夹名称
        // let moduleName = path.basenameNoExt(url);
        let uiName = getAutoUIName(url);
        let folder = path.dirname(url);
        // Editor.log('prefabFunc folder:', url, folder, moduleName);

        //创建对应父文件夹
        // let moduleFolder = path.join(exportFullPath, uiName);
        // let fullPath = path.basename(folder)
        let fullPath = adb.urlToFspath(folder)
        // Editor.log(fullPath);
        // Editor.log('父文件夹: ', moduleFolder);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirsSync(fullPath);
        }
        // Editor.log('1111', fullPath);

        //生成对应的ts文件
        let exportUIPath = exportPath === ''? `${folder}/${uiName}.ts`: `db://assets/${exportPath}/${uiName}/${uiName}.ts`;
        // Editor.log(`export prefab111: ${uiName} ==> ${exportUIPath}`);
        let strData = getDeclareStr(assetInfo.path);
        // Editor.log(strData);
        if (sameNameList.length > 0) {
            let warn = sameNameList.join('\n');
            Editor.log('export warn - same name::' + warn);
            Editor.Dialog.messageBox(getWarnMsg(`有命名重复请修改`));
            return;
        }

        if (strData) {
            exportFileByTsTemp(strData, uiName, exportUIPath);
        }
        Editor.log(`export prefab: ${uiName} ==> ${exportUIPath}`);
    }
}