
import * as vscode from 'vscode';
import weappTemplateCommand = require('./commands/weappTemplateCommand');
import thinkphpTemplateCommand = require('./commands/thinkphpTemplateCommand');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // register extension commands
    let weappTemplate = vscode.commands.registerCommand('extension.weappTemplate', weappTemplateCommand.run);
    let thinkphpTemplate = vscode.commands.registerCommand('extension.thinkphpTemplate', thinkphpTemplateCommand.run);
    context.subscriptions.push(weappTemplate, thinkphpTemplate);
}

// this method is called when your extension is deactivated
export function deactivate() {
}