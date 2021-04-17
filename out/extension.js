"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.get_response = exports.get_api_key = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const got_1 = require("got");
const regex = new RegExp("def\\s+\\w+\\s*\\(.*\\):");
class CommentsPython {
    static addComment(fn, comment) {
        return fn.replace(regex, "$&\n\t\"\"\"\n\t" + comment + "\n\t\"\"\"");
    }
}
function get_api_key() {
    return process.env.OPENAI_KEY;
}
exports.get_api_key = get_api_key;
function get_response(question) {
    return __awaiter(this, void 0, void 0, function* () {
        // const prompt = `Artist: Megadeth\n\nLyrics:\n`;
        const url = 'https://api.openai.com/v1/answers';
        // const url = '127.0.0.1/';
        const params = {
            "question": "description for this python code: " + question,
            "model": "davinci",
            "examples": [["create description for this python code: def sub( x,  y): \nreturn x - y", "This code subtracts x from y"]],
            "examples_context": "description for this python code: def sub( x,  y): \nreturn x - y \n is: This code subtracts x from y",
            "documents": []
        };
        const headers = {
            'Authorization': `Bearer ` + get_api_key(),
        };
        let response = got_1.default.post(url, { json: params, headers: headers }).json();
        // const bufferPromise = responsePromise.buffer();
        // const jsonPromise = responsePromise.json();
        // const [response, buffer, json] = await Promise.all([responsePromise, bufferPromise, jsonPromise]);
        return response;
    });
}
exports.get_response = get_response;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "documentify" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('documentify.create_documentation', () => __awaiter(this, void 0, void 0, function* () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const editor = vscode.window.activeTextEditor;
        try {
            if (editor) {
                let sel = editor.selections[0];
                const document = editor.document;
                const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
                let word = document.getText(range);
                let response = yield get_response(word);
                editor.edit(editBuilder => {
                    let new_text = CommentsPython.addComment(word, response.answers[0]);
                    editBuilder.replace(range, new_text);
                }); // apply the (accumulated) replacement(s) (if multiple cursors/selections)
            }
        }
        catch (error) {
            console.log(error);
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map