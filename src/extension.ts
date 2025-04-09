import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
    console.log('Расширение PCSF активировано!');
    const editorConfigView = vscode.workspace.getConfiguration('editor');
    console.log(editorConfigView.get('tokenColorCustomizations.textMateRules'));
    

    // Обновляем цвета при старте
    updateTokenColors();

    // И при изменении настроек
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('pcsfSyntax.colors')) {
                updateTokenColors();
            }
        })
    );
}

async function updateTokenColors() {
    const config = vscode.workspace.getConfiguration('pcsfSyntax');
    const editorConfig = vscode.workspace.getConfiguration('editor');

    const newRules = [
        {
            "scope": "keyword.control.a-quantifier.pcsf",
            "settings": {
                "foreground": config.get('colors.aQuantifier', '#4545FF')
            }
        },
        {
            "scope": "keyword.control.e-quantifier.pcsf",
            "settings": {
                "foreground": config.get('colors.eQuantifier', '#FF0000')
            }
        }
    ];

    const currentConfig = editorConfig.get('tokenColorCustomizations') || {};
    (currentConfig as any).textMateRules = newRules;

    await editorConfig.update(
        'tokenColorCustomizations',
        currentConfig,
        vscode.ConfigurationTarget.Global
    );
}
