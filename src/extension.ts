// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import got from 'got';
import { start } from 'node:repl';
import { stringify } from 'node:querystring';

const regex = new RegExp("def\\s+\\w+\\s*\\(.*\\):")

class CommentsPython {

    static addComment(fn:string, comment:string) {
        return fn.replace(regex, "$&\n\t\"\"\"\n\t"+comment+"\n\t\"\"\"")
    }
}

export function get_api_key(){
	return process.env.OPENAI_KEY
}

export async function get_response(question: string){
	// const prompt = `Artist: Megadeth\n\nLyrics:\n`;


	const url = 'https://api.openai.com/v1/answers';
	// const url = '127.0.0.1/';
	const params = {
		"question": "description for this python code: "+question,
		"model": "davinci",
		"examples": [["create description for this python code: def sub( x,  y): \nreturn x - y", "This code subtracts x from y"]],
		"examples_context": "description for this python code: def sub( x,  y): \nreturn x - y \n is: This code subtracts x from y",
		"documents": []
	}
	const headers = {
		'Authorization': `Bearer ` + get_api_key(),
	};

	let response : any  = got.post(url, { json: params, headers: headers }).json();

	// const bufferPromise = responsePromise.buffer();
	// const jsonPromise = responsePromise.json();
	// const [response, buffer, json] = await Promise.all([responsePromise, bufferPromise, jsonPromise]);
	return response;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export  function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "documentify" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('documentify.create_documentation', async () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		
	
		try{
			if (editor) {
				let sel = editor.selections[0]
				const document = editor.document;
				const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
				let word = document.getText(range);
	
				let response = await get_response(word)
				editor.edit(  editBuilder => {
					let new_text = CommentsPython.addComment(word, response.answers[0])
					editBuilder.replace(range, new_text);
			   
				}) // apply the (accumulated) replacement(s) (if multiple cursors/selections)
			
			}
		}
		catch (error) {
			console.log(error)
		}
       
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}