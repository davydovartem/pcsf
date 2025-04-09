import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
    console.log('Расширение PCSF активировано!');

    updateTokenColors();

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
        },
        {
            "scope": "variable.parameter.pcsf",
            "settings": {
                "foreground": config.get('colors.variable', '#D19A66')
            }
        },
        {
            "scope": "comment.line.pcsf",
            "settings": {
                "foreground": config.get('colors.comment', '#5C6370')
            }
        },
        {
            "scope": "entity.name.function.pcsf",
            "settings": {
                "foreground": config.get('colors.function', '#61AFEF')
            }
        },
        {
            "scope": "punctuation.separator.pcsf",
            "settings": {
                "foreground": config.get('colors.punctuation', '#ABB2BF')
            }
        },
        {
            "scope": "constant.numeric.pcsf",
            "settings": {
                "foreground": config.get('colors.constant', '#ffffff')
            }
        },
        {
            "scope": "string.quoted.double.pcsf",
            "settings": {
                "foreground": config.get('colors.string', '#98C379')
            }
        },
        {
            "scope": "keyword.operator.comparison.pcsf",
            "settings": {
                "foreground": config.get('colors.comparison', '#C678DD')
            }
        },
        {
            "scope": "keyword.operator.arithmetic.pcsf",
            "settings": {
                "foreground": config.get('colors.arithmetic', '#E06C75')
            }
        },
        {
            "scope": "keyword.control.directive.pcsf",
            "settings": {
                "foreground": config.get('colors.directive', '#56B6C2')
            }
        },
        {
            "scope": "keyword.character.continuation.pcsf",
            "settings": {
                "foreground": config.get('colors.continuation', '#B22222')
            }
        },
        {
            "scope": "keyword.operator.sets.pcsf",
            "settings": {
                "foreground": config.get('colors.sets', '#56B6C2')
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
