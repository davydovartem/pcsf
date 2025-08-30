import * as vscode from 'vscode';

interface Arguments {
    formula: string;
    strategy: string;
    limit: number;
    json: boolean;
    outputFile: string;
}

export function activateDebugAdapter(context: vscode.ExtensionContext) {
    const factory = new BootfrostDebugAdapterDescriptorFactory();
    context.subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory('bootfrost', factory)
    );
    
    // Регистрируем провайдер конфигурации отладки
    const provider = new BootfrostDebugConfigurationProvider();
    context.subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider('bootfrost', provider)
    );
}

class BootfrostDebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
    createDebugAdapterDescriptor(
        session: vscode.DebugSession,
        executable: vscode.DebugAdapterExecutable | undefined
    ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
        // Возвращаем фиктивный дескриптор, чтобы VS Code не ждал реального адаптера
        // Запуск будет выполняться в resolveDebugConfiguration
        return new vscode.DebugAdapterExecutable('node', ['--version']);
    }

    private async runInTerminal(args: Arguments): Promise<void> {
        const config = vscode.workspace.getConfiguration('pcsfSyntax.bootfrost');
        const executable = config.get<string>('executablePath', 'bootfrost');
        
        // Ищем существующий терминал с именем 'Bootfrost'
        let terminal = vscode.window.terminals.find(t => t.name === 'Bootfrost');
        
        // Если терминал не найден, создаем новый
        if (!terminal) {
            terminal = vscode.window.createTerminal('Bootfrost');
        }
        
        // Экранируем пути
        const filePath = args.formula.replace(/\\/g, '\\\\');
        
        // Формируем команду с учетом новых параметров
        let command = `& '${executable}' -f '${filePath}' -s ${args.strategy} -l ${args.limit}`;
        
        // Добавляем флаг JSON, если нужно
        if (args.json) {
            command += ' -j';
        }
        
        // Добавляем перенаправление вывода, если указан файл
        if (args.outputFile) {
            command += ` > '${args.outputFile}'`;
        }
        
        terminal.show();
        terminal.sendText(command);
    }

}

class BootfrostDebugConfigurationProvider implements vscode.DebugConfigurationProvider {
    async resolveDebugConfiguration(
        folder: vscode.WorkspaceFolder | undefined,
        debugConfiguration: vscode.DebugConfiguration,
        token?: vscode.CancellationToken
    ): Promise<vscode.DebugConfiguration | undefined> {
        // Получаем путь к исполняемому файлу из настроек
        const config = vscode.workspace.getConfiguration('pcsfSyntax.bootfrost');
        const executable = config.get<string>('executablePath', 'bootfrost');
        
        // Получаем значения по умолчанию для параметров
        const defaultStrategy = config.get<string>('defaultStrategy', 'general');
        const defaultLimit = config.get<number>('defaultLimit', 1000);
        const defaultOutputFile = config.get<string>('defaultOutputFile', '');
        
        // Устанавливаем значения по умолчанию, если они не указаны
        debugConfiguration.strategy = debugConfiguration.strategy || defaultStrategy;
        debugConfiguration.limit = debugConfiguration.limit || defaultLimit;
        debugConfiguration.json = debugConfiguration.json || false;
        debugConfiguration.outputFile = debugConfiguration.outputFile || defaultOutputFile;
        
        // Заменяем переменные VS Code в пути к файлу
        let programPath = debugConfiguration.program;
        if (programPath && programPath.includes('${file}')) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                programPath = programPath.replace('${file}', activeEditor.document.uri.fsPath);
            }
        }
        
        // Запускаем отладку в терминале
        const factory = new BootfrostDebugAdapterDescriptorFactory();
        factory['runInTerminal']({
            formula: programPath,
            strategy: debugConfiguration.strategy,
            limit: debugConfiguration.limit,
            json: debugConfiguration.json,
            outputFile: debugConfiguration.outputFile
        });
        
        // Возвращаем undefined, чтобы VS Code не пытался запустить отладчик
        return undefined;
    }
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

export async function runBootfrostDebug(config: any) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'pcsf') {
        vscode.window.showErrorMessage('Активный файл не является PCSF файлом');
        return;
    }

    const workspaceConfig = vscode.workspace.getConfiguration('pcsfSyntax');
    let executablePath = workspaceConfig.get('bootfrost.executablePath', 'bootfrost');

    // Проверяем существование файла
    const fs = require('fs');
    if (!fs.existsSync(executablePath)) {
        const selectedPath = await promptForBootfrostPath();
        if (!selectedPath) {
            vscode.window.showErrorMessage('Необходимо выбрать исполняемый файл Bootfrost для запуска');
            return;
        }
        await workspaceConfig.update('bootfrost.executablePath', selectedPath, true);
        executablePath = selectedPath;
    }

    const strategy = config.strategy || workspaceConfig.get('bootfrost.defaultStrategy', 'general');
    const limit = config.limit || workspaceConfig.get('bootfrost.defaultLimit', 1000);
    const json = config.json || false;
    const outputFile = config.outputFile || workspaceConfig.get('bootfrost.defaultOutputFile', '');

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
    
    // Формируем команду с учетом новых параметров
    let command = `& '${executable}' -f '${filePath}' -s ${strategy} -l ${limit}`;
    
    // Добавляем флаг JSON, если нужно
    if (json) {
        command += ' -j';
    }
    
    // Добавляем перенаправление вывода, если указан файл
    if (outputFile) {
        command += ` > '${outputFile}'`;
    }
    
    terminal.sendText(command);
}