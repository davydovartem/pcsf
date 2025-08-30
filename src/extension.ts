import * as vscode from 'vscode';
import { activateDebugAdapter } from './debugAdapter';

export function activate(context: vscode.ExtensionContext) {
    console.log('PCSF Syntax Highlighting Extension активировано');
    
    // Активируем отладку
    activateDebugAdapter(context);

    // Команда для запуска Bootfrost на активном файле
    const runBootfrostCommand = vscode.commands.registerCommand('pcsfSyntax.runBootfrost', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'pcsf') {
            vscode.window.showErrorMessage('Активный файл не является PCSF файлом');
            return;
        }

        const config = vscode.workspace.getConfiguration('pcsfSyntax');
        let executablePath = config.get('bootfrost.executablePath', 'bootfrost');

        // Проверяем существование файла
        const fs = require('fs');
        if (!fs.existsSync(executablePath)) {
            const selectedPath = await promptForBootfrostPath();
            if (!selectedPath) {
                return;
            }
            await config.update('bootfrost.executablePath', selectedPath, true);
            executablePath = selectedPath;
        }

        const strategy = config.get('bootfrost.defaultStrategy', 'general');
        const limit = config.get('bootfrost.defaultLimit', 1000);

        // Ищем существующий терминал с именем 'Bootfrost'
        let terminal = vscode.window.terminals.find(t => t.name === 'Bootfrost');
        
        // Если терминал не найден, создаем новый
        if (!terminal) {
            terminal = vscode.window.createTerminal('Bootfrost');
        }
        
        terminal.show();
        
        // Правильно экранируем путь к файлу для PowerShell
        const filePath = editor.document.uri.fsPath.replace(/\\/g, '\\\\');
        const executable = executablePath.replace(/\\/g, '\\\\');
        
        // Формируем команду с учетом синтаксиса PowerShell
        const command = `& '${executable}' -f '${filePath}' -s ${strategy} -l ${limit}`;
        
        terminal.sendText(command);
    });

    context.subscriptions.push(runBootfrostCommand);
}

async function promptForBootfrostPath(): Promise<string | undefined> {
    const options: vscode.OpenDialogOptions = {
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        title: 'Выберите исполняемый файл Bootfrost',
        filters: {
            'Исполняемые файлы': ['exe', 'cmd', 'bat'],
            'Все файлы': ['*']
        }
    };
    
    const fileUri = await vscode.window.showOpenDialog(options);
    
    if (fileUri && fileUri[0]) {
        return fileUri[0].fsPath;
    }
    
    return undefined;
}

export function deactivate() {}
