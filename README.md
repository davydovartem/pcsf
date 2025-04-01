# PCF Syntax Highlighting Extension

This is the README for your extension "PCF". This extension provides syntax highlighting for files formatted in the positively-constructed formulas (PCF) language, which can be utilized in the [Bootfrost](https://github.com/snigavik/bootfrost) PCF prover 

## Features

- **Syntax Highlighting**: Enjoy enhanced readability with syntax highlighting for various elements of PCF, including quantifiers, variables, functions, and comments.
- **Customizable Colors**: Easily modify the color scheme to fit your preferences through the settings.
- **Support for Lists and Predicates**: The extension recognizes lists of variables and predicates, making it easier to work with complex formulas.

## Requirements

To use this extension, ensure you have Visual Studio Code installed. This extension is compatible with the latest versions of VS Code.

## Extension Settings

This extension contributes the following settings:

* `pcf.enable`: Enable/disable syntax highlighting for PCF files.
* `pcf.colorScheme`: Set to customize the color scheme for different syntax elements.

## Known Issues

- Some edge cases in nested predicates may not be highlighted correctly.
- Comments may not be recognized in certain contexts.

## Release Notes

### 0.1.0

Initial release of the PCF syntax highlighting extension.