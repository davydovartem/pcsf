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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const debugAdapter_1 = require("./debugAdapter");
function activate(context) {
    console.log('PCSF Syntax Highlighting Extension активировано');
    // Активируем отладку
    (0, debugAdapter_1.activateDebugAdapter)(context);
    // Команда для запуска Bootfrost на активном файле
    const runBootfrostCommand = vscode.commands.registerCommand('pcsfSyntax.runBootfrost', () => __awaiter(this, void 0, void 0, function* () {
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
            const selectedPath = yield promptForBootfrostPath();
            if (!selectedPath) {
                return;
            }
            yield config.update('bootfrost.executablePath', selectedPath, true);
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
    }));
    context.subscriptions.push(runBootfrostCommand);
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
function deactivate() { }
