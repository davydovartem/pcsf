# PCSF Syntax Highlighting Extension

This extension provides syntax highlighting for files formatted in the positively constructed standardized formulas (PCSF) language, which can be utilized in the [Bootfrost](https://github.com/snigavik/bootfrost) PCSF prover.

## Features

- **Syntax Highlighting**: Enjoy enhanced readability with syntax highlighting for various elements of PCSF, including quantifiers, variables, functions, and comments.
- **Customizable Colors**: Easily modify the color scheme to fit your preferences through the settings.
- **Support for Lists and Predicates**: The extension recognizes lists of variables and predicates, making it easier to work with complex formulas.

## Installation

You have three alternatives:

1. You can install it through VS Code Extension Marketplace. Just open extensions bar of your VScode and start typing "PCSF syntax..." and you should not miss it.

2. Download installable VSIX package file from releases section on github. Then just double click it and follow intallation steps. Or, go to extensions bar of your VScode, there you may find "Views and more Actions" button (usually in top right corner), and choose "Install from VSIX..." option, choose downloaded file and it should be installed.

3. Clone repo and build it for your own. You will need the vsce tool: `npm install -g @vscode/vsce`, once installed run `vsce package` under extension folder.

## Requirements

This extension is compatible with 1.97.0 version of VS Code.

## Known Issues

- Comments may not be recognized in certain contexts.

## Release Notes

### 0.1.0

Initial release of the PCSF syntax highlighting extension.
