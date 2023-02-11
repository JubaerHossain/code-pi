const vscode = require('vscode');
const axios = require('axios');

const apiUrl = 'https://api.openai.com/v1/engines/autocomplete/jobs';
const apiKey = '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';


async function getCompletions(query) {
  const response = await axios.post(apiUrl, {
    prompt: query,
    "model": "code-davinci-002",
    "max_tokens": 7,
    "temperature": 0
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const completions = response.data.choices[0].text.split("\n");
  return completions;
}

class CompletionProvider {
  constructor() {}

  provideCompletionItems(
    document,
    position,
    token,
    context
  ) {
    const line = document.lineAt(position).text;
    return getCompletions(line).then((completions) => {
      return completions.map((completion) => {
        const completionItem = new vscode.CompletionItem(completion);
        completionItem.insertText = completion;
        return completionItem;
      });
    });
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-pi" is now active!');

	const provider = new CompletionProvider();
	const disposable = vscode.languages.registerCompletionItemProvider(
		'*',
		provider,
		'.'
	);
	context.subscriptions.push(disposable);

	let codePIDisposable = vscode.commands.registerCommand('code-pi.codePI', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Welcome to Code PI!');
	});

	context.subscriptions.push(codePIDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
