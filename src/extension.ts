import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { GoogleGenerativeAI, ChatSession, GenerativeModel, Part } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const messageParts: (string | Part)[] = [];

async function fetchGeminiReplyFileChat(chat: ChatSession, prompt: string, fileContent: string = ""): Promise<string> {
  try {

    if (fileContent === "") {
      messageParts.push({
        text: prompt
      });
    } else {
      messageParts.push({
        text: `${prompt} \nFile content if available: \n\`\`\`\n${fileContent}\n\`\`\``
      });
    }

    const result = await chat.sendMessage(messageParts);
    const response = result.response;
    return response.text() || "❌ No response";
  } catch (err) {
    console.error("Gemini error:", err);
    return `❌ Gemini error: ${err.message || String(err)}`;

  }
}


function getWorkspaceFiles(): string[] {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return [];

  const ignoreDirs = ['node_modules', '.git', '.vscode', 'dist', 'build', 'out'];
  const result: string[] = [];

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(workspaceFolders[0].uri.fsPath, fullPath);

      if (entry.isDirectory()) {
        if (!ignoreDirs.includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        result.push(relPath.replace(/\\/g, '/')); // normalize path
      }
    }
  };

  walk(workspaceFolders[0].uri.fsPath);
  return result;
}





export function activate(context: vscode.ExtensionContext) {
  // vscode.commands.executeCommand('vscode.setEditorLayout', {
  //   orientation: 0,
  //   groups: [
  //     { groups: [{}], size: 0.7 },
  //     { groups: [{}], size: 0.3 }
  //   ]
  // });

  const disposable = vscode.commands.registerCommand('botcoder.openChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'botcoderChat',
      'BotCoder Assistant',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'dist'))
        ]
      }
    );

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';

    const htmlPath = path.join(context.extensionPath, 'webview.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Point to dist/webview.js 
    const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'));
    const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

    html = html.replace('${webviewUri}', scriptUri.toString());
    panel.webview.html = html;

    // gemini models
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({}); // keep conversation going

    // code later;
    panel.webview.onDidReceiveMessage(
      async (message) => {
        let aiResponse: any = "";
        if (message.type === 'userPrompt') {
          const userInput = message.value;

          if (Array.isArray(message.files) && message.files.length > 0) {
            const fileContent = message.files.map(filename => {
              const filePath = path.join(workspacePath, filename);
              return fs.existsSync(filePath)
                ? fs.readFileSync(filePath, 'utf-8')
                : `// ❌ File not found: ${filename}`;
            }).join('\n\n');

            aiResponse = await fetchGeminiReplyFileChat(chat, userInput, fileContent);
          } else {

            aiResponse = await fetchGeminiReplyFileChat(chat, userInput);
          }


          panel.webview.postMessage({
            type: 'aiResponse',
            value: aiResponse
          });
        } else if (message.type === 'getFileList') {
          const files = getWorkspaceFiles();
          panel.webview.postMessage({ type: 'fileList', value: files });

        }
        else if (message.type === 'clearChat') {
          messageParts.splice(0, messageParts.length);
        }
      },
      undefined,
      context.subscriptions
    );

  });



  context.subscriptions.push(disposable);
}
