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
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('Расширение PCSF активировано!');
    updateTokenColors();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('pcsfSyntax.colors')) {
            updateTokenColors();
        }
    }));
}
function updateTokenColors() {
    return __awaiter(this, void 0, void 0, function* () {
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
        currentConfig.textMateRules = newRules;
        yield editorConfig.update('tokenColorCustomizations', currentConfig, vscode.ConfigurationTarget.Global);
    });
}
