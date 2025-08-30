# PCSF Syntax Highlighting Extension

This extension provides syntax highlighting for files formatted in the positively constructed standardized formulas (PCSF) language, which can be utilized in the [Bootfrost](https://github.com/snigavik/bootfrost) PCSF prover.

## Features

- **Syntax Highlighting**: Enjoy enhanced readability with syntax highlighting for various elements of PCSF, including quantifiers, variables, functions, and comments.
- **Customizable Colors**: Easily modify the color scheme to fit your preferences through the settings.
- **Bootfrost Integration**: Built-in debugger for running Bootfrost prover directly from VS Code.

## Installation

You have three alternatives:

1. Install it through VS Code Extension Marketplace. Just open extensions bar of your VScode and start typing "PCSF syntax..." and you should not be missing it.

2. Download installable VSIX package file from releases section on github. Then just double click it and follow intallation steps. Or, go to extensions bar of your VScode, there you may find "Views and more Actions" button (usually in top right corner), and choose "Install from VSIX..." option, choose downloaded file and it should be installed.

3. Clone repo and build it for your own. You will need the vsce tool: `npm install -g @vscode/vsce`, once installed run `vsce package` under extension folder.

## Requirements

This extension is compatible with 1.97.0 version of VS Code.

## Running Bootfrost Prover

### Prerequisites

1. Install the [Bootfrost](https://github.com/snigavik/bootfrost) prover on your system.
2. Configure the path to the Bootfrost executable in VS Code settings:
   - Open VS Code settings (Ctrl+,)
   - Search for "PCSF"
   - Set the "Bootfrost Executable Path" (pcsfSyntax.bootfrost.executablePath) to the full path of your Bootfrost executable

### Using the Debugger

1. Open a PCSF file in VS Code
2. Press F5 to start debugging
3. Select "Launch Bootfrost" configuration
4. The prover will run in the integrated terminal

### Debug Configuration Parameters

You can customize the Bootfrost execution by editing the launch.json file:

```json
{
    "type": "bootfrost",
    "request": "launch",
    "name": "Launch Bootfrost",
    "program": "${file}",
    "strategy": "general",
    "limit": 1000,
    "json": false,
    "outputFile": ""
}
```

- **strategy**: Proof strategy ("plain", "general", "manualfirst", "manualbest")
- **limit**: Maximum number of steps
- **json**: Enable JSON output (true/false)
- **outputFile**: File path to save the output (empty for console output)

### Running via Command Palette

Alternatively, you can run Bootfrost using the command palette:

1. Open a PCSF file
2. Press Ctrl+Shift+P to open the command palette
3. Type "Run Bootfrost" and select the command
4. The prover will run with default settings

## Known Issues

- Probably need to adjust the color palette, I'll be glad for suggestions.

## Release Notes

### 0.3.0

- Added Bootfrost debugger integration
- Added support for JSON output
- Added support for output redirection to file
- Improved terminal handling (reuses existing terminal)

### 0.2.0

Initial release of the PCSF syntax highlighting extension.
