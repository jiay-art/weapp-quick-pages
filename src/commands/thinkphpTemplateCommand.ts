import vscode = require("vscode");
import fs = require("fs");
import path = require("path");

/**
 * Main command to create thinkphp project class file.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {*} args
 * @returns
 */
export function run(args: any) {

    let targetFolder = args ? args.fsPath : vscode.workspace.rootPath + '/Application/Admin/Controller'
    if (!fs.existsSync(targetFolder)) return vscode.window.showInformationMessage('The project controller directory was not found')
    let inputOptions = <vscode.InputBoxOptions>{
        prompt: "Please enter the desired file name",
        value: "",
        validateInput: val => {
            if (/^[A-Z]\w*$/.test(val)) return null
            return "Invalidata controller name"
        }
    }

    // ask for filename
    vscode.window.showInputBox(inputOptions).then(name => {
        // create file temaplate
        let model = path.basename(path.dirname(targetFolder))
        if (!model) return vscode.window.showInformationMessage('The project model directory was not found')
        fs.writeFileSync(path.join(targetFolder, `${name}Controller.class.php`), "<?php\nnamespace " + model + "\\Controller;\nuse Think\\Controller;\nclass " + name + "Controller extends Controller {\n    public function index(){\n    }\n}")
    })

}