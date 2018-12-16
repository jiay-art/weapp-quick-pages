
import vscode = require("vscode");
import fs = require("fs");
import path = require("path");
import * as os from 'os'
/**
 * Main command to create miniapp project template page.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {*} args
 * @returns
 */
export function run(args: any) {

    let targetFolder = args ? args.fsPath : vscode.workspace.rootPath + '/pages'
    if (!fs.existsSync(targetFolder)) return vscode.window.showInformationMessage('The miniapp pages directory was not found')
    let inputOptions = <vscode.InputBoxOptions>{
        prompt: "Please enter the desired file name",
        value: "",
        validateInput: val => {
            if (/^\w+$/.test(val)) return null
            return "Invalidata page name"
        }
    }

    // ask for filename
    vscode.window.showInputBox(inputOptions).then(page => {
        var pagePath = path.join(targetFolder, page!)
        fs.existsSync(pagePath) || fs.mkdirSync(pagePath)
        // create file temaplate  
        template(page!).forEach(item => fs.writeFileSync(path.join(pagePath, item.name), item.content))
        //regist app.json
        let appjSON = findAppJson(targetFolder)
        if (!appjSON) return vscode.window.showInformationMessage('app.json not find')
        //read this json file
        var json = JSON.parse(fs.readFileSync(appjSON!, 'utf-8'));
        json.pages.push(`pages/${page}/${page}`);
        //rewrite data
        fs.writeFileSync(appjSON!, JSON.stringify(json, null, 4));
    })
}
// by parh find app.json file
function findAppJson(url: string): string | null {
    if (os.platform() == 'win32') {
        if (/^[a-z]:\\?$/i.test(url)) return null
    } else {
        if (url == '/') return null
    }
    let _json = path.join(url, 'app.json')
    //Does the app.json file exist in the current directory.
    if (fs.existsSync(_json)) return _json
    return findAppJson(path.dirname(url))//Upper level directory query
}

// wecaht mini template
function template(template: string) {
    return [
        {
            name: template + ".js",
            content: "//" + template + ".js\n\nPage({\n  data: {\n    test:'this is " + template + " page.'\n  },\n  onLoad: function () {\n    this.setData({})\n  }\n})"
        },
        {
            name: template + ".wxml",
            content: "<!-- " + template + ".wxml -->\n\n<view>{{test}}</view>"
        },
        {
            name: template + ".json",
            content: "{}"
        },
        {
            name: template + ".wxss",
            content: "/* " + template + ".wxss */\n\nview {\n    font-size: 1em;\n}"
        }
    ];
}