"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.activateDebugAdapter = activateDebugAdapter;
exports.runBootfrostDebug = runBootfrostDebug;
const vscode = __importStar(require("vscode"));
function activateDebugAdapter(context) {
    const factory = new BootfrostDebugAdapterDescriptorFactory();
    context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('bootfrost', factory));
    // Регистрируем провайдер конфигурации отладки
    const provider = new BootfrostDebugConfigurationProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('bootfrost', provider));
}
class BootfrostDebugAdapterDescriptorFactory {
    createDebugAdapterDescriptor(session, executable) {
        // Возвращаем фиктивный дескриптор, чтобы VS Code не ждал реального адаптера
        // Запуск будет выполняться в resolveDebugConfiguration
        return new vscode.DebugAdapterExecutable('node', ['--version']);
    }
    runInTerminal(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = vscode.workspace.getConfiguration('pcsfSyntax.bootfrost');
            const executable = config.get('executablePath', 'bootfrost');
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
        });
    }
}
class BootfrostDebugConfigurationProvider {
    resolveDebugConfiguration(folder, debugConfiguration, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Получаем путь к исполняемому файлу из настроек
            const config = vscode.workspace.getConfiguration('pcsfSyntax.bootfrost');
            const executable = config.get('executablePath', 'bootfrost');
            // Получаем значения по умолчанию для параметров
            const defaultStrategy = config.get('defaultStrategy', 'general');
            const defaultLimit = config.get('defaultLimit', 1000);
            const defaultOutputFile = config.get('defaultOutputFile', '');
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
        });
    }
}
function promptForBootfrostPath() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            title: 'Выберите исполняемый файл Bootfrost',
            filters: {
                'Исполняемые файлы': ['exe', 'cmd', 'bat'],
                'Все файлы': ['*']
            }
        };
        const fileUri = yield vscode.window.showOpenDialog(options);
        if (fileUri && fileUri[0]) {
            return fileUri[0].fsPath;
        }
        return undefined;
    });
}
function runBootfrostDebug(config) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const selectedPath = yield promptForBootfrostPath();
            if (!selectedPath) {
                vscode.window.showErrorMessage('Необходимо выбрать исполняемый файл Bootfrost для запуска');
                return;
            }
            yield workspaceConfig.update('bootfrost.executablePath', selectedPath, true);
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
    });
}
