# AI编辑器问题集锦

## 编码类问题

### eslint未使用包报错
- 安装检查插件
```bash
pnpm add -D eslint-plugin-unused-imports
```
- 配置根目录**/.eslintrc.json**
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "unused-imports"
  ],
  "rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ]
  }
}
```
- 修改**package.json**，让本地dev环境执行时就会进行`eslint --fix . && next lint`命令，清除未使用的导入
- 生产环境不要使用，因为这是本地代码提交前就要保证的

```json
{
    "scripts": {
        "predev": "pnpm run lint",
        "dev": "next dev",
        "lint": "eslint --fix . && next lint"
    }
}
```

### 国际化语言翻译键值完整性检查
- 安装所需的依赖
```bash
pnpm add -D ts-node glob @types/glob typescript
```
- 创建**tsconfig.node.json**文件
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "CommonJS",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020"],
    "esModuleInterop": true
  },
  "include": ["scripts/**/*"]
}
```
- 创建**appConfig.ts**文件, 定义项目支持的语言列表
```ts
export const appConfig = {
  // 国际化配置
  i18n: {
    locales: ["en", "zh", "ja", "ko", "fr", "de", "es", "it", "pt", "ru", "ar", "hi", "tr", "pl", "uk"] as const,
    defaultLocale: "en" as const,
    localeLabels: {
      en: "English",
      zh: "简体中文",
      ja: "日本語",
      ko: "한국어",
      fr: "Français",
      de: "Deutsch",
      es: "Español",
      it: "Italiano",
      pt: "Português",
      ru: "Русский",
      ar: "العربية",
      hi: "हिन्दी",
      tr: "Türkçe",
      pl: "Polski",
      uk: "Українська"
    }
  }
}
```
- 创建国际化翻译目录**messages**及每种语言的翻译文件**XX.json**

- 在**package.json**中添加脚本
```json
{
  "scripts": {
    "check-translations": "ts-node scripts/check-translations.ts"
  }
}
```
- 运行脚本
```bash
pnpm check-translations
```


### eslint关于使用any类型的问题
- 尽量遵循规范，不要使用any类型
- 询问AI时，制定生成代码的规则，明确要求它遵守TS的强类型规范
- 对于历史代码，禁用改检查项

```text
1. 特定行禁用该规则，可以使用注释：
// eslint-disable-next-line @typescript-eslint/no-explicit-any

2. 特定文件禁用该规则，可以在文件顶部添加注释：
/* eslint-disable @typescript-eslint/no-explicit-any */

3. 特定函数禁用该规则，可以在 ESLint 配置文件（如 .eslintrc.json ）中进行配置：

module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```


## 快捷键
- Intellij IDEA风格
```json
// Place your key bindings in this file to override the defaults
[
    {
        "key": "shift+alt+cmd+h",
        "command": "references-view.showCallHierarchy",
        "when": "editorHasCallHierarchyProvider",
        "isAIItem": false
    },
    {
        "key": "shift+alt+h",
        "command": "-references-view.showCallHierarchy",
        "when": "editorHasCallHierarchyProvider"
    },
    {
        "key": "cmd+d",
        "command": "-notebook.addFindMatchToSelection",
        "when": "config.notebook.multiCursor.enabled && notebookCellEditorFocused && activeEditor == 'workbench.editor.notebook'"
    },
    {
        "key": "cmd+d",
        "command": "-editor.action.addSelectionToNextFindMatch",
        "when": "editorFocus"
    },
    {
        "key": "cmd+d",
        "command": "editor.action.copyLinesDownAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+down",
        "command": "-editor.action.copyLinesDownAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+up",
        "command": "-editor.action.copyLinesUpAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+cmd+c",
        "command": "-copyRelativeFilePath",
        "when": "!editorFocus"
    },
    {
        "key": "cmd+k alt+cmd+c",
        "command": "-copyFilePath",
        "when": "editorFocus"
    },
    {
        "key": "shift+tab",
        "command": "-editor.action.inlineSuggest.acceptNextLine",
        "when": "inlineSuggestionVisible && !editorTabMovesFocus"
    },
    {
        "key": "cmd+right",
        "command": "-editor.action.inlineSuggest.acceptNextWord",
        "when": "inlineSuggestionVisible && !editorReadonly"
    },
    {
        "key": "alt+cmd+down",
        "command": "-quickInput.nextSeparator",
        "when": "inQuickInput && quickInputType == 'quickPick'"
    },
    {
        "key": "alt+cmd+down",
        "command": "-workbench.action.terminal.focusNextPane",
        "when": "terminalFocus && terminalHasBeenCreated || terminalFocus && terminalProcessSupported"
    },
    {
        "key": "shift+alt+i",
        "command": "-editor.action.insertCursorAtEndOfEachLineSelected",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+k cmd+c",
        "command": "-editor.action.addCommentLine",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "cmd+f2",
        "command": "-editor.action.changeAll",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+space",
        "command": "-editor.action.triggerParameterHints",
        "when": "editorHasSignatureHelpProvider && editorTextFocus"
    },
    {
        "key": "shift+cmd+space",
        "command": "keybindings.editor.removeKeybinding",
        "when": "inKeybindings && keybindingFocus && !inputFocus"
    },
    {
        "key": "cmd+backspace",
        "command": "-keybindings.editor.removeKeybinding",
        "when": "inKeybindings && keybindingFocus && !inputFocus"
    },
    {
        "key": "cmd+k m",
        "command": "-workbench.action.editor.changeLanguageMode",
        "when": "!notebookEditorFocused"
    },
    {
        "key": "cmd+enter",
        "command": "-chatEditor.action.accept",
        "when": "chat.hasEditorModifications && editorFocus && hasUndecidedChatEditingResource && !chat.ctxHasRequestInProgress || chat.hasNotebookEditorModifications && editorFocus && hasUndecidedChatEditingResource && !chat.ctxHasRequestInProgress"
    },
    {
        "key": "ctrl+enter",
        "command": "-workbench.action.chat.applyInEditor",
        "when": "accessibleViewInCodeBlock && chatIsEnabled || chatIsEnabled && inChat && !inChatInput"
    },
    {
        "key": "cmd+backspace",
        "command": "-chatEditor.action.reject",
        "when": "chat.hasEditorModifications && editorFocus && hasUndecidedChatEditingResource && !chat.ctxHasRequestInProgress || chat.hasNotebookEditorModifications && editorFocus && hasUndecidedChatEditingResource && !chat.ctxHasRequestInProgress"
    },
    {
        "key": "alt+f5",
        "command": "-chatEditor.action.navigateNext",
        "when": "chat.hasEditorModifications && editorFocus || chat.hasNotebookEditorModifications && editorFocus"
    },
    {
        "key": "shift+alt+f5",
        "command": "-chatEditor.action.navigatePrevious",
        "when": "chat.hasEditorModifications && editorFocus || chat.hasNotebookEditorModifications && editorFocus"
    },
    {
        "key": "ctrl+enter",
        "command": "-workbench.action.chat.insertCodeBlock",
        "when": "accessibleViewInCodeBlock && chatIsEnabled || chatIsEnabled && inChat && !inChatInput"
    },
    {
        "key": "ctrl+alt+enter",
        "command": "-workbench.action.chat.runInTerminal",
        "when": "accessibleViewInCodeBlock && chatIsEnabled || chatIsEnabled && inChat"
    },
    {
        "key": "ctrl+l",
        "command": "-workbench.action.chat.newChat",
        "when": "chatIsEnabled && inChat && chatLocation != 'editing-session'"
    },
    {
        "key": "ctrl+l",
        "command": "-workbench.action.chat.newEditSession",
        "when": "chatEditingParticipantRegistered && chatIsEnabled && inChat && chatLocation == 'editing-session'"
    },
    {
        "key": "alt+cmd+pagedown",
        "command": "-workbench.action.chat.nextCodeBlock",
        "when": "chatIsEnabled && inChat"
    },
    {
        "key": "cmd+f9",
        "command": "-workbench.action.chat.nextFileTree",
        "when": "chatIsEnabled && inChat"
    },
    {
        "key": "ctrl+cmd+i",
        "command": "-workbench.action.chat.open",
        "when": "chatPanelParticipantRegistered || chatSetupInstalled"
    },
    {
        "key": "alt+cmd+pageup",
        "command": "-workbench.action.chat.previousCodeBlock",
        "when": "chatIsEnabled && inChat"
    },
    {
        "key": "shift+cmd+f9",
        "command": "-workbench.action.chat.previousFileTree",
        "when": "chatIsEnabled && inChat"
    },
    {
        "key": "cmd+u",
        "command": "-workbench.action.chat.icube.open",
        "when": "icubeHasChatProvider"
    },
    {
        "key": "cmd+i",
        "command": "-workbench.action.chat.startVoiceChat",
        "when": "chatIsEnabled && hasSpeechProvider && inChatInput && !chatSessionRequestInProgress && !editorFocus && !notebookEditorFocused && !scopedVoiceChatGettingReady && !speechToTextInProgress || chatIsEnabled && hasSpeechProvider && inlineChatFocused && !chatSessionRequestInProgress && !editorFocus && !notebookEditorFocused && !scopedVoiceChatGettingReady && !speechToTextInProgress"
    },
    {
        "key": "escape",
        "command": "-workbench.action.chat.stopListening",
        "when": "voiceChatInProgress && scopedVoiceChatInProgress == 'editor' || voiceChatInProgress && scopedVoiceChatInProgress == 'inline' || voiceChatInProgress && scopedVoiceChatInProgress == 'quick' || voiceChatInProgress && scopedVoiceChatInProgress == 'view'"
    },
    {
        "key": "cmd+i",
        "command": "-workbench.action.chat.stopListeningAndSubmit",
        "when": "inChatInput && voiceChatInProgress && scopedVoiceChatInProgress == 'editor' || inChatInput && voiceChatInProgress && scopedVoiceChatInProgress == 'inline' || inChatInput && voiceChatInProgress && scopedVoiceChatInProgress == 'quick' || inChatInput && voiceChatInProgress && scopedVoiceChatInProgress == 'view' || inlineChatFocused && voiceChatInProgress && scopedVoiceChatInProgress == 'editor' || inlineChatFocused && voiceChatInProgress && scopedVoiceChatInProgress == 'inline' || inlineChatFocused && voiceChatInProgress && scopedVoiceChatInProgress == 'quick' || inlineChatFocused && voiceChatInProgress && scopedVoiceChatInProgress == 'view'"
    },
    {
        "key": "escape",
        "command": "-workbench.action.speech.stopReadAloud",
        "when": "scopedChatSynthesisInProgress && textToSpeechInProgress"
    },
    {
        "key": "shift+cmd+backspace",
        "command": "-chatEditor.action.undoHunk",
        "when": "editorFocus && hasUndecidedChatEditingResource && !chatSessionRequestInProgress"
    },
    {
        "key": "ctrl+l",
        "command": "-notebook.centerActiveCell",
        "when": "notebookEditorFocused"
    },
    {
        "key": "ctrl+l",
        "command": "workbench.debug.panel.action.clearReplAction",
        "when": "focusedView == 'workbench.panel.repl.view'"
    },
    {
        "key": "cmd+k",
        "command": "-workbench.debug.panel.action.clearReplAction",
        "when": "focusedView == 'workbench.panel.repl.view'"
    },
    {
        "key": "shift+cmd+w",
        "command": "-workbench.action.closeWindow"
    },
    {
        "key": "cmd+k alt+cmd+c",
        "command": "-workbench.action.addComment",
        "when": "activeCursorHasCommentingRange"
    },
    {
        "key": "alt+f10",
        "command": "-editor.action.nextCommentedRangeAction",
        "when": "activeEditorHasCommentingRange"
    },
    {
        "key": "cmd+k alt+cmd+down",
        "command": "-editor.action.nextCommentingRange",
        "when": "accessibilityModeEnabled && commentFocused || accessibilityModeEnabled && editorFocus || accessibilityHelpIsShown && accessibilityModeEnabled && accessibleViewCurrentProviderId == 'comments'"
    },
    {
        "key": "shift+alt+f10",
        "command": "-editor.action.previousCommentedRangeAction",
        "when": "activeEditorHasCommentingRange"
    },
    {
        "key": "cmd+k alt+cmd+up",
        "command": "-editor.action.previousCommentingRange",
        "when": "accessibilityModeEnabled && commentFocused || accessibilityModeEnabled && editorFocus || accessibilityHelpIsShown && accessibilityModeEnabled && accessibleViewCurrentProviderId == 'comments'"
    },
    {
        "key": "ctrl+alt+cmd+n",
        "command": "-welcome.showNewFileEntries"
    },
    {
        "key": "cmd+u",
        "command": "-cursorUndo",
        "when": "textInputFocus"
    },
    {
        "key": "cmd+k cmd+d",
        "command": "-editor.action.moveSelectionToNextFindMatch",
        "when": "editorFocus"
    },
    {
        "key": "alt+down",
        "command": "-workbench.action.terminal.accessibleBufferGoToNextCommand",
        "when": "accessibleViewIsShown && accessibleViewCurrentProviderId == 'terminal' || accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"
    },
    {
        "key": "alt+down",
        "command": "-history.showNext",
        "when": "historyNavigationForwardsEnabled && historyNavigationWidgetFocus && !isComposing && !suggestWidgetVisible"
    },
    {
        "key": "alt+down",
        "command": "-list.focusAnyDown",
        "when": "listFocus && !inputFocus && !treestickyScrollFocused"
    },
    {
        "key": "alt+down",
        "command": "-scm.forceViewNextCommit",
        "when": "scmRepository"
    },
    {
        "key": "alt+down",
        "command": "-showNextParameterHint",
        "when": "editorFocus && parameterHintsMultipleSignatures && parameterHintsVisible"
    },
    {
        "key": "alt+down",
        "command": "-editor.action.pageDownHover",
        "when": "editorHoverFocused"
    },
    {
        "key": "cmd+d",
        "command": "notebook.cell.copyDown",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "shift+alt+down",
        "command": "-notebook.cell.copyDown",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "shift+alt+down",
        "command": "editor.action.moveLinesDownAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "alt+down",
        "command": "-editor.action.moveLinesDownAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+down",
        "command": "notebook.cell.moveDown",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "alt+down",
        "command": "-notebook.cell.moveDown",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "alt+up",
        "command": "-workbench.action.terminal.accessibleBufferGoToPreviousCommand",
        "when": "accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"
    },
    {
        "key": "alt+up",
        "command": "-history.showPrevious",
        "when": "historyNavigationBackwardsEnabled && historyNavigationWidgetFocus && !isComposing && !suggestWidgetVisible"
    },
    {
        "key": "alt+up",
        "command": "-list.focusAnyUp",
        "when": "listFocus && !inputFocus && !treestickyScrollFocused"
    },
    {
        "key": "alt+up",
        "command": "-scm.forceViewPreviousCommit",
        "when": "scmRepository"
    },
    {
        "key": "alt+up",
        "command": "-showPrevParameterHint",
        "when": "editorFocus && parameterHintsMultipleSignatures && parameterHintsVisible"
    },
    {
        "key": "alt+up",
        "command": "-editor.action.pageUpHover",
        "when": "editorHoverFocused"
    },
    {
        "key": "shift+alt+up",
        "command": "editor.action.moveLinesUpAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "alt+up",
        "command": "-editor.action.moveLinesUpAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+up",
        "command": "notebook.cell.moveUp",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "alt+up",
        "command": "-notebook.cell.moveUp",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "shift+alt+up",
        "command": "-notebook.cell.copyUp",
        "when": "notebookEditorFocused && !inputFocus"
    },
    {
        "key": "alt+cmd+/",
        "command": "editor.action.blockComment",
        "when": "editorTextFocus && !editorReadonly",
        "isAIItem": false
    },
    {
        "key": "shift+alt+a",
        "command": "-editor.action.blockComment",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+i",
        "command": "-workbench.panel.chatEditing",
        "when": "workbench.panel.chat.view.edits.active"
    },
    {
        "key": "shift+cmd+i",
        "command": "-workbench.action.chat.openEditSession",
        "when": "chatEditingParticipantRegistered && view != 'workbench.panel.chat.view.edits'"
    },
    {
        "key": "shift+cmd+i",
        "command": "editor.action.toggleColumnSelection"
    },
    {
        "key": "alt+cmd+up",
        "command": "-editor.action.insertCursorAbove",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+cmd+down",
        "command": "-editor.action.insertCursorBelow",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+u",
        "command": "editor.action.deleteLines",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+k",
        "command": "-editor.action.deleteLines",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "cmd+k cmd+k",
        "command": "-editor.action.defineKeybinding",
        "when": "resource == 'vscode-userdata:/Users/funeye/Library/Application%20Support/Trae/User/keybindings.json'"
    },
    {
        "key": "cmd+delete",
        "command": "-deleteAllRight",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "cmd+l",
        "command": "-expandLineSelection",
        "when": "textInputFocus"
    },
    {
        "key": "cmd+g",
        "command": "-editor.action.nextMatchFindAction",
        "when": "editorFocus"
    },
    {
        "key": "cmd+g",
        "command": "-workbench.action.terminal.findNext",
        "when": "terminalFindFocused && terminalHasBeenCreated || terminalFindFocused && terminalProcessSupported || terminalFocusInAny && terminalHasBeenCreated || terminalFocusInAny && terminalProcessSupported"
    },
    {
        "key": "cmd+g",
        "command": "-workbench.action.terminal.goToRecentDirectory",
        "when": "terminalFocus && terminalHasBeenCreated || terminalFocus && terminalProcessSupported"
    },
    {
        "key": "cmd+down",
        "command": "-editor.action.goToBottomHover",
        "when": "editorHoverFocused"
    },
    {
        "key": "end",
        "command": "-editor.action.goToBottomHover",
        "when": "editorHoverFocused"
    },
    {
        "key": "cmd+b",
        "command": "-workbench.action.toggleSidebarVisibility"
    },
    {
        "key": "cmd+b",
        "command": "editor.action.revealDefinition",
        "when": "editorHasDefinitionProvider && editorTextFocus"
    },
    {
        "key": "f12",
        "command": "-editor.action.revealDefinition",
        "when": "editorHasDefinitionProvider && editorTextFocus"
    },
    {
        "key": "cmd+f12",
        "command": "-editor.action.revealDefinition",
        "when": "editorHasDefinitionProvider && editorTextFocus && isWeb"
    },
    {
        "key": "alt+cmd+b",
        "command": "-workbench.action.toggleAuxiliaryBar"
    },
    {
        "key": "alt+cmd+b",
        "command": "editor.action.goToImplementation",
        "when": "editorHasImplementationProvider && editorTextFocus"
    },
    {
        "key": "cmd+f12",
        "command": "-editor.action.goToImplementation",
        "when": "editorHasImplementationProvider && editorTextFocus"
    },
    {
        "key": "cmd+k cmd+q",
        "command": "-workbench.action.navigateToLastEditLocation"
    },
    {
        "key": "cmd+]",
        "command": "-editor.action.indentLines",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "cmd+]",
        "command": "editor.action.jumpToBracket",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+cmd+\\",
        "command": "-editor.action.jumpToBracket",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+[",
        "command": "editor.action.jumpToBracket",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+[",
        "command": "-editor.action.outdentLines",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "cmd+k down",
        "command": "-workbench.action.moveActiveEditorGroupDown"
    },
    {
        "key": "cmd+k left",
        "command": "-workbench.action.moveActiveEditorGroupLeft"
    },
    {
        "key": "cmd+k right",
        "command": "-workbench.action.moveActiveEditorGroupRight"
    },
    {
        "key": "cmd+k up",
        "command": "-workbench.action.moveActiveEditorGroupUp"
    },
    {
        "key": "ctrl+cmd+1",
        "command": "-workbench.action.moveEditorToFirstGroup"
    },
    {
        "key": "ctrl+cmd+9",
        "command": "-workbench.action.moveEditorToLastGroup"
    },
    {
        "key": "ctrl+cmd+right",
        "command": "-workbench.action.moveEditorToNextGroup"
    },
    {
        "key": "ctrl+cmd+left",
        "command": "-workbench.action.moveEditorToPreviousGroup"
    },
    {
        "key": "cmd+k shift+cmd+left",
        "command": "-workbench.action.moveEditorLeftInGroup"
    },
    {
        "key": "cmd+k shift+cmd+right",
        "command": "-workbench.action.moveEditorRightInGroup"
    },
    {
        "key": "ctrl+right",
        "command": "-quickInput.acceptInBackground",
        "when": "cursorAtEndOfQuickInputBox && inQuickInput && quickInputType == 'quickPick' || inQuickInput && !inputFocus && quickInputType == 'quickPick'"
    },
    {
        "key": "alt+cmd+left",
        "command": "workbench.action.navigateBack",
        "when": "canNavigateBack",
        "isAIItem": false
    },
    {
        "key": "ctrl+-",
        "command": "-workbench.action.navigateBack",
        "when": "canNavigateBack"
    },
    {
        "key": "alt+cmd+right",
        "command": "workbench.action.navigateForward",
        "when": "canNavigateForward",
        "isAIItem": false
    },
    {
        "key": "ctrl+shift+-",
        "command": "-workbench.action.navigateForward",
        "when": "canNavigateForward"
    },
    {
        "key": "shift+f6",
        "command": "renameFile",
        "when": "filesExplorerFocus && foldersViewVisible && !explorerResourceIsRoot && !explorerResourceReadonly && !inputFocus"
    },
    {
        "key": "enter",
        "command": "-renameFile",
        "when": "filesExplorerFocus && foldersViewVisible && !explorerResourceIsRoot && !explorerResourceReadonly && !inputFocus"
    },
    {
        "key": "shift+f6",
        "command": "-workbench.action.focusPreviousPart"
    },
    {
        "key": "alt+enter",
        "command": "-workbench.action.terminal.chat.insertCommand",
        "when": "terminalChatResponseContainsCodeBlock && terminalHasBeenCreated && !terminalChatActiveRequest && !terminalChatResponseContainsMultipleCodeBlocks || terminalChatResponseContainsCodeBlock && terminalProcessSupported && !terminalChatActiveRequest && !terminalChatResponseContainsMultipleCodeBlocks"
    },
    {
        "key": "alt+enter",
        "command": "-workbench.action.terminal.chat.insertFirstCommand",
        "when": "terminalChatResponseContainsMultipleCodeBlocks && terminalHasBeenCreated && !terminalChatActiveRequest || terminalChatResponseContainsMultipleCodeBlocks && terminalProcessSupported && !terminalChatActiveRequest"
    },
    {
        "key": "alt+enter",
        "command": "-notebook.cell.executeAndInsertBelow",
        "when": "notebookCellListFocused && notebookCellType == 'markup' || notebookCellListFocused && notebookMissingKernelExtension && !notebookCellExecuting && notebookCellType == 'code' || notebookCellListFocused && !notebookCellExecuting && notebookCellType == 'code' && notebookKernelCount > 0 || notebookCellListFocused && !notebookCellExecuting && notebookCellType == 'code' && notebookKernelSourceCount > 0"
    },
    {
        "key": "alt+enter",
        "command": "-debug.openBreakpointToSide",
        "when": "breakpointsFocused"
    },
    {
        "key": "alt+enter",
        "command": "-editor.action.selectAllMatches",
        "when": "editorFocus && findWidgetVisible"
    },
    {
        "key": "alt+enter",
        "command": "-testing.editFocusedTest",
        "when": "focusedView == 'workbench.view.testing'"
    },
    {
        "key": "alt+enter",
        "command": "editor.action.quickFix",
        "when": "editorHasCodeActionsProvider && textInputFocus && !editorReadonly"
    },
    {
        "key": "cmd+.",
        "command": "-editor.action.quickFix",
        "when": "editorHasCodeActionsProvider && textInputFocus && !editorReadonly"
    },
    {
        "key": "alt+enter",
        "command": "workbench.action.terminal.showQuickFixes",
        "when": "terminalFocus"
    },
    {
        "key": "cmd+.",
        "command": "-workbench.action.terminal.showQuickFixes",
        "when": "terminalFocus"
    },
    {
        "key": "alt+enter",
        "command": "problems.action.showQuickFixes",
        "when": "problemFocus"
    },
    {
        "key": "cmd+.",
        "command": "-problems.action.showQuickFixes",
        "when": "problemFocus"
    },
    {
        "key": "alt+cmd+enter",
        "command": "-workbench.action.terminal.chat.insertFirstCommand",
        "when": "terminalChatResponseContainsMultipleCodeBlocks && terminalHasBeenCreated && !terminalChatActiveRequest || terminalChatResponseContainsMultipleCodeBlocks && terminalProcessSupported && !terminalChatActiveRequest"
    },
    {
        "key": "cmd+enter",
        "command": "-workbench.action.terminal.chat.runFirstCommand",
        "when": "terminalChatResponseContainsMultipleCodeBlocks && terminalHasBeenCreated && !terminalChatActiveRequest || terminalChatResponseContainsMultipleCodeBlocks && terminalProcessSupported && !terminalChatActiveRequest"
    },
    {
        "key": "ctrl+space",
        "command": "-workbench.action.terminal.requestCompletions",
        "when": "config.terminal.integrated.suggest.enabled && terminalFocus && terminalProcessSupported && terminalShellIntegrationEnabled"
    },
    {
        "key": "cmd+i",
        "command": "-editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly && !suggestWidgetVisible"
    },
    {
        "key": "alt+escape",
        "command": "-editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly && !suggestWidgetVisible"
    },
    {
        "key": "ctrl+space",
        "command": "-editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly && !suggestWidgetVisible"
    },
    {
        "key": "ctrl+alt+down",
        "command": "editor.action.smartSelect.shrink",
        "when": "editorTextFocus",
        "isAIItem": false
    },
    {
        "key": "ctrl+shift+left",
        "command": "-editor.action.smartSelect.shrink",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+cmd+left",
        "command": "-editor.action.smartSelect.shrink",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+up",
        "command": "editor.action.smartSelect.expand",
        "when": "editorTextFocus",
        "isAIItem": false
    },
    {
        "key": "ctrl+shift+right",
        "command": "-editor.action.smartSelect.expand",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+cmd+right",
        "command": "-editor.action.smartSelect.expand",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+cmd+left",
        "command": "-workbench.action.terminal.focusPreviousPane",
        "when": "terminalFocus && terminalHasBeenCreated || terminalFocus && terminalProcessSupported"
    },
    {
        "key": "ctrl+left",
        "command": "workbench.action.previousEditor"
    },
    {
        "key": "alt+cmd+left",
        "command": "-workbench.action.previousEditor"
    },
    {
        "key": "alt+cmd+right",
        "command": "-workbench.action.terminal.focusNextPane",
        "when": "terminalFocus && terminalHasBeenCreated || terminalFocus && terminalProcessSupported"
    },
    {
        "key": "alt+cmd+right",
        "command": "-quickInput.acceptInBackground",
        "when": "cursorAtEndOfQuickInputBox && inQuickInput && quickInputType == 'quickPick' || inQuickInput && !inputFocus && quickInputType == 'quickPick'"
    },
    {
        "key": "ctrl+right",
        "command": "workbench.action.nextEditor"
    },
    {
        "key": "alt+cmd+right",
        "command": "-workbench.action.nextEditor"
    },
    {
        "key": "cmd+k shift+cmd+w",
        "command": "-workbench.action.closeAllGroups"
    },
    {
        "key": "cmd+k w",
        "command": "-workbench.action.closeEditorsInGroup"
    },
    {
        "key": "alt+cmd+t",
        "command": "-workbench.action.closeOtherEditors"
    },
    {
        "key": "cmd+k u",
        "command": "-workbench.action.closeUnmodifiedEditors"
    },
    {
        "key": "shift+cmd+w",
        "command": "workbench.action.closeAllEditors"
    },
    {
        "key": "cmd+k cmd+w",
        "command": "-workbench.action.closeAllEditors"
    },
    {
        "key": "shift+cmd+t",
        "command": "-workbench.action.reopenClosedEditor"
    },
    {
        "key": "cmd+r",
        "command": "-workbench.action.reloadWindow",
        "when": "isDevelopment"
    },
    {
        "key": "cmd+r",
        "command": "-workbench.action.terminal.runRecentCommand",
        "when": "accessibilityModeEnabled && terminalFocus && terminalHasBeenCreated || accessibilityModeEnabled && terminalFocus && terminalProcessSupported || accessibilityModeEnabled && accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibilityModeEnabled && accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"
    },
    {
        "key": "cmd+r",
        "command": "-inlineChat.regenerate",
        "when": "inlineChatHasProvider && inlineChatVisible"
    },
    {
        "key": "ctrl+a",
        "command": "-cursorLineStart",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+l",
        "command": "deleteAllLeft",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "cmd+backspace",
        "command": "-deleteAllLeft",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+r",
        "command": "deleteAllRight",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+k",
        "command": "-deleteAllRight",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "cmd+e",
        "command": "workbench.action.openRecent",
        "isAIItem": false
    },
    {
        "key": "ctrl+r",
        "command": "-workbench.action.openRecent"
    },
    {
        "key": "cmd+r",
        "command": "workbench.action.quickOpenNavigateNextInRecentFilesPicker",
        "when": "inQuickOpen && inRecentFilesPicker"
    },
    {
        "key": "ctrl+r",
        "command": "-workbench.action.quickOpenNavigateNextInRecentFilesPicker",
        "when": "inQuickOpen && inRecentFilesPicker"
    },
    {
        "key": "cmd+k cmd+.",
        "command": "-editor.removeManualFoldingRanges",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "ctrl+shift+up",
        "command": "editor.createFoldingRangeFromSelection",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+,",
        "command": "-editor.createFoldingRangeFromSelection",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "ctrl+shift+alt+enter",
        "command": "editor.action.autoFix",
        "when": "textInputFocus && !editorReadonly && supportedCodeAction =~ /(\\s|^)quickfix\\b/"
    },
    {
        "key": "alt+cmd+.",
        "command": "-editor.action.autoFix",
        "when": "textInputFocus && !editorReadonly && supportedCodeAction =~ /(\\s|^)quickfix\\b/"
    },
    {
        "key": "shift+alt+d",
        "command": "-editor.detectLanguage",
        "when": "editorTextFocus && !notebookEditable"
    },
    {
        "key": "shift+cmd+up",
        "command": "-workbench.action.terminal.selectToPreviousCommand",
        "when": "terminalFocus && terminalHasBeenCreated || terminalFocus && terminalProcessSupported"
    },
    {
        "key": "alt+cmd+i",
        "command": "-workbench.action.toggleDevTools",
        "when": "isDevelopment"
    },
    {
        "key": "alt+f6",
        "command": "-editor.action.accessibleViewDisableHint",
        "when": "accessibilityHelpIsShown && accessibleViewVerbosityEnabled || accessibleViewIsShown && accessibleViewVerbosityEnabled"
    },
    {
        "key": "cmd+k e",
        "command": "-workbench.files.action.focusOpenEditorsView",
        "when": "workbench.explorer.openEditorsView.active"
    },
    {
        "key": "ctrl+shift+alt+i",
        "command": "workbench.files.action.showActiveFileInExplorer"
    },
    {
        "key": "alt+cmd+r",
        "command": "-revealFileInOS",
        "when": "!editorFocus"
    },
    {
        "key": "cmd+k r",
        "command": "-workbench.action.files.revealActiveFileInWindows"
    },
    {
        "key": "alt+cmd+c",
        "command": "-workbench.action.terminal.toggleFindCaseSensitive",
        "when": "terminalFindVisible && terminalHasBeenCreated || terminalFindVisible && terminalProcessSupported"
    },
    {
        "key": "ctrl+alt+c",
        "command": "copyRelativeFilePath",
        "when": "editorFocus"
    },
    {
        "key": "cmd+k shift+alt+cmd+c",
        "command": "-copyRelativeFilePath",
        "when": "editorFocus"
    },
    {
        "key": "ctrl+shift+alt+c",
        "command": "copyFilePath",
        "when": "!editorFocus"
    },
    {
        "key": "alt+cmd+c",
        "command": "-copyFilePath",
        "when": "!editorFocus"
    },
    {
        "key": "f8",
        "command": "workbench.action.debug.continue",
        "when": "debugState == 'stopped'",
        "isAIItem": false
    },
    {
        "key": "f5",
        "command": "-workbench.action.debug.continue",
        "when": "debugState == 'stopped'"
    },
    {
        "key": "shift+f5",
        "command": "-workbench.action.debug.disconnect",
        "when": "focusedSessionIsAttach && inDebugMode"
    },
    {
        "key": "shift+cmd+]",
        "command": "-workbench.action.debug.nextConsole",
        "when": "inDebugRepl"
    },
    {
        "key": "shift+cmd+[",
        "command": "-workbench.action.debug.prevConsole",
        "when": "inDebugRepl"
    },
    {
        "key": "shift+f8",
        "command": "workbench.action.debug.pause",
        "when": "debugState == 'running'",
        "isAIItem": false
    },
    {
        "key": "f6",
        "command": "-workbench.action.debug.pause",
        "when": "debugState == 'running'"
    },
    {
        "key": "shift+f9",
        "command": "-editor.debug.action.toggleInlineBreakpoint",
        "when": "editorTextFocus"
    },
    {
        "key": "f10",
        "command": "-extension.node-debug.startWithStopOnEntry",
        "when": "!inDebugMode && debugConfigurationType == 'node' || !inDebugMode && debugConfigurationType == 'pwa-extensionHost' || !inDebugMode && debugConfigurationType == 'pwa-node'"
    },
    {
        "key": "f11",
        "command": "-extension.node-debug.startWithStopOnEntry",
        "when": "!inDebugMode && activeViewlet == 'workbench.view.debug' && debugConfigurationType == 'node' || !inDebugMode && activeViewlet == 'workbench.view.debug' && debugConfigurationType == 'pwa-extensionHost' || !inDebugMode && activeViewlet == 'workbench.view.debug' && debugConfigurationType == 'pwa-node'"
    },
    {
        "key": "f5",
        "command": "-workbench.action.debug.start",
        "when": "debuggersAvailable && debugState == 'inactive'"
    },
    {
        "key": "shift+cmd+f5",
        "command": "-workbench.action.debug.restart",
        "when": "inDebugMode"
    },
    {
        "key": "ctrl+shift+alt+v",
        "command": "editor.debug.action.showDebugHover",
        "when": "editorTextFocus && inDebugMode"
    },
    {
        "key": "cmd+k cmd+i",
        "command": "-editor.debug.action.showDebugHover",
        "when": "editorTextFocus && inDebugMode"
    },
    {
        "key": "f9",
        "command": "workbench.action.debug.stepInto",
        "when": "debugState != 'inactive'"
    },
    {
        "key": "f11",
        "command": "-workbench.action.debug.stepInto",
        "when": "debugState != 'inactive'"
    },
    {
        "key": "f7",
        "command": "workbench.action.debug.stepOut",
        "when": "debugState == 'stopped'"
    },
    {
        "key": "shift+f11",
        "command": "-workbench.action.debug.stepOut",
        "when": "debugState == 'stopped'"
    },
    {
        "key": "shift+f9",
        "command": "workbench.action.debug.stepOver",
        "when": "debugState == 'stopped'"
    },
    {
        "key": "f10",
        "command": "-workbench.action.debug.stepOver",
        "when": "debugState == 'stopped'"
    },
    {
        "key": "alt+f9",
        "command": "workbench.action.debug.stepIntoTarget",
        "when": "inDebugMode && stepIntoTargetsSupported && debugState == 'stopped'"
    },
    {
        "key": "cmd+f11",
        "command": "-workbench.action.debug.stepIntoTarget",
        "when": "inDebugMode && stepIntoTargetsSupported && debugState == 'stopped'"
    },
    {
        "key": "shift+f5",
        "command": "-workbench.action.debug.stop",
        "when": "inDebugMode && !focusedSessionIsAttach"
    },
    {
        "key": "cmd+f8",
        "command": "editor.debug.action.toggleBreakpoint",
        "when": "debuggersAvailable && disassemblyViewFocus || debuggersAvailable && editorTextFocus"
    },
    {
        "key": "f9",
        "command": "-editor.debug.action.toggleBreakpoint",
        "when": "debuggersAvailable && disassemblyViewFocus || debuggersAvailable && editorTextFocus"
    },
    {
        "key": "f8",
        "command": "-editor.action.marker.nextInFiles",
        "when": "editorFocus"
    },
    {
        "key": "shift+f9",
        "command": "-settings.action.showContextMenu",
        "when": "inSettingsEditor"
    },
    {
        "key": "f7",
        "command": "-inlineChat.moveToNextHunk",
        "when": "inlineChatHasProvider && inlineChatVisible"
    },
    {
        "key": "f7",
        "command": "-editor.action.wordHighlight.next",
        "when": "editorTextFocus && hasWordHighlights"
    },
    {
        "key": "f7",
        "command": "-editor.action.accessibleDiffViewer.next",
        "when": "isInDiffEditor"
    },
    {
        "key": "shift+f7",
        "command": "-editor.action.accessibleDiffViewer.prev",
        "when": "isInDiffEditor"
    },
    {
        "key": "shift+f8",
        "command": "-editor.action.marker.prevInFiles",
        "when": "editorFocus"
    },
    {
        "key": "alt+cmd+l",
        "command": "-toggleSearchEditorContextLines",
        "when": "inSearchEditor"
    },
    {
        "key": "alt+cmd+l",
        "command": "-toggleFindInSelection",
        "when": "editorFocus"
    },
    {
        "key": "alt+cmd+l",
        "command": "editor.action.formatDocument",
        "when": "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor"
    },
    {
        "key": "shift+alt+f",
        "command": "-editor.action.formatDocument",
        "when": "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor"
    },
    {
        "key": "alt+cmd+l",
        "command": "editor.action.formatDocument.none",
        "when": "editorTextFocus && !editorHasDocumentFormattingProvider && !editorReadonly"
    },
    {
        "key": "shift+alt+f",
        "command": "-editor.action.formatDocument.none",
        "when": "editorTextFocus && !editorHasDocumentFormattingProvider && !editorReadonly"
    },
    {
        "key": "alt+cmd+l",
        "command": "notebook.formatCell",
        "when": "editorHasDocumentFormattingProvider && editorTextFocus && inCompositeEditor && notebookEditable && !editorReadonly && activeEditor == 'workbench.editor.notebook'"
    },
    {
        "key": "shift+alt+f",
        "command": "-notebook.formatCell",
        "when": "editorHasDocumentFormattingProvider && editorTextFocus && inCompositeEditor && notebookEditable && !editorReadonly && activeEditor == 'workbench.editor.notebook'"
    },
    {
        "key": "alt+cmd+l",
        "command": "editor.action.formatSelection",
        "when": "editorHasDocumentSelectionFormattingProvider && editorTextFocus && !editorReadonly"
    },
    {
        "key": "cmd+k cmd+f",
        "command": "-editor.action.formatSelection",
        "when": "editorHasDocumentSelectionFormattingProvider && editorTextFocus && !editorReadonly"
    },
    {
        "key": "down",
        "command": "-icube.inlineChat.focus",
        "when": "editorTextFocus && icube.inlineChatVisible && !accessibilityModeEnabled && !icube.inlineChatFocused && !isEmbeddedDiffEditor && icube.inlineChatOuterCursorPosition == 'above'"
    },
    {
        "key": "up",
        "command": "-icube.inlineChat.focus",
        "when": "editorTextFocus && icube.inlineChatVisible && !accessibilityModeEnabled && !icube.inlineChatFocused && !isEmbeddedDiffEditor && icube.inlineChatOuterCursorPosition == 'below'"
    },
    {
        "key": "cmd+down",
        "command": "-inlineChat.focus",
        "when": "editorTextFocus && inlineChatVisible && !accessibilityModeEnabled && !inlineChatFocused && !isEmbeddedDiffEditor && inlineChatOuterCursorPosition == 'above'"
    },
    {
        "key": "cmd+up",
        "command": "-inlineChat.focus",
        "when": "editorTextFocus && inlineChatVisible && !accessibilityModeEnabled && !inlineChatFocused && !isEmbeddedDiffEditor && inlineChatOuterCursorPosition == 'below'"
    },
    {
        "key": "cmd+i",
        "command": "-icube.inlineChat.start",
        "when": "icube.inlineChatHasProvider && icubeConfigEnableInlineChat && !editorReadonly"
    },
    {
        "key": "alt+cmd+enter",
        "command": "-workbench.action.terminal.chat.insertCommand",
        "when": "terminalChatResponseContainsCodeBlock && terminalHasBeenCreated && !terminalChatActiveRequest && !terminalChatResponseContainsMultipleCodeBlocks || terminalChatResponseContainsCodeBlock && terminalProcessSupported && !terminalChatActiveRequest && !terminalChatResponseContainsMultipleCodeBlocks"
    },
    {
        "key": "shift+f7",
        "command": "-inlineChat.moveToPreviousHunk",
        "when": "inlineChatHasProvider && inlineChatVisible"
    },
    {
        "key": "cmd+enter",
        "command": "-workbench.action.terminal.chat.runCommand",
        "when": "terminalChatResponseContainsCodeBlock && terminalHasBeenCreated && !terminalChatActiveRequest && !terminalChatResponseContainsMultipleCodeBlocks || terminalChatResponseContainsCodeBlock && terminalProcessSupported && !terminalChatActiveRequest && !terminalChatResponseContainsMultipleCodeBlocks"
    },
    {
        "key": "cmd+k i",
        "command": "-inlineChat.startWithCurrentLine",
        "when": "inlineChatHasProvider && !editorReadonly && !inlineChatVisible"
    },
    {
        "key": "cmd+i",
        "command": "-inlineChat.startWithCurrentLine",
        "when": "inlineChatHasProvider && inlineChatShowingHint && !editorReadonly && !inlineChatVisible"
    },
    {
        "key": "cmd+i",
        "command": "-workbench.action.terminal.chat.start",
        "when": "terminalChatAgentRegistered && terminalFocusInAny && terminalHasBeenCreated || terminalChatAgentRegistered && terminalFocusInAny && terminalProcessSupported"
    },
    {
        "key": "enter",
        "command": "-editor.action.insertColorWithStandaloneColorPicker",
        "when": "standaloneColorPickerFocused"
    },
    {
        "key": "cmd+k c",
        "command": "-workbench.files.action.compareWithClipboard"
    },
    {
        "key": "cmd+k d",
        "command": "-workbench.files.action.compareWithSaved"
    },
    {
        "key": "cmd+n",
        "command": "-workbench.action.files.newUntitledFile"
    },
    {
        "key": "cmd+e",
        "command": "-editor.action.toggleScreenReaderAccessibilityMode",
        "when": "accessibilityHelpIsShown"
    },
    {
        "key": "cmd+e",
        "command": "-actions.findWithSelection"
    },
    {
        "key": "cmd+k s",
        "command": "-workbench.action.files.saveWithoutFormatting"
    },
    {
        "key": "alt+cmd+tab",
        "command": "-workbench.action.showAllEditors"
    },
    {
        "key": "shift+cmd+.",
        "command": "-breadcrumbs.focusAndSelect",
        "when": "breadcrumbsPossible && breadcrumbsVisible"
    },
    {
        "key": "shift+cmd+;",
        "command": "-breadcrumbs.focus",
        "when": "breadcrumbsPossible && breadcrumbsVisible"
    },
    {
        "key": "cmd+k cmd+-",
        "command": "-editor.foldAllExcept",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+1",
        "command": "-editor.foldLevel1",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+2",
        "command": "-editor.foldLevel2",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+3",
        "command": "-editor.foldLevel3",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+4",
        "command": "-editor.foldLevel4",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+5",
        "command": "-editor.foldLevel5",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+6",
        "command": "-editor.foldLevel6",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+7",
        "command": "-editor.foldLevel7",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "ctrl+alt+[",
        "command": "editor.fold",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "alt+cmd+[",
        "command": "-editor.fold",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "ctrl+shift+alt+[",
        "command": "editor.foldAll",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+0",
        "command": "-editor.foldAll",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "ctrl+alt+]",
        "command": "editor.unfold",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "alt+cmd+]",
        "command": "-editor.unfold",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "alt+cmd+]",
        "command": "-notebook.unfold",
        "when": "notebookEditorFocused && !inputFocus && activeEditor == 'workbench.editor.notebook'"
    },
    {
        "key": "ctrl+shift+alt+]",
        "command": "editor.unfoldAll",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+j",
        "command": "-editor.unfoldAll",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+=",
        "command": "-editor.unfoldAllExcept",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+9",
        "command": "-editor.unfoldAllMarkerRegions",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+]",
        "command": "-editor.unfoldRecursively",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "right",
        "command": "-notebook.unfold",
        "when": "notebookEditorFocused && !inputFocus && activeEditor == 'workbench.editor.notebook'"
    },
    {
        "key": "cmd+k cmd+/",
        "command": "-editor.foldAllBlockComments",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+8",
        "command": "-editor.foldAllMarkerRegions",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+[",
        "command": "-editor.foldRecursively",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k cmd+r",
        "command": "-git.revertSelectedRanges",
        "when": "isInDiffEditor && !operationInProgress"
    },
    {
        "key": "cmd+k alt+cmd+s",
        "command": "-git.stageSelectedRanges",
        "when": "isInDiffEditor && !operationInProgress"
    },
    {
        "key": "cmd+k cmd+n",
        "command": "-git.unstageSelectedRanges",
        "when": "isInDiffEditor && !operationInProgress"
    },
    {
        "key": "alt+down",
        "command": "workbench.action.compareEditor.nextChange",
        "when": "textCompareEditorVisible",
        "isAIItem": false
    },
    {
        "key": "alt+f5",
        "command": "-workbench.action.compareEditor.nextChange",
        "when": "textCompareEditorVisible"
    },
    {
        "key": "alt+down",
        "command": "workbench.action.editor.nextChange",
        "when": "editorTextFocus && !textCompareEditorActive",
        "isAIItem": false
    },
    {
        "key": "alt+f5",
        "command": "-workbench.action.editor.nextChange",
        "when": "editorTextFocus && !textCompareEditorActive"
    },
    {
        "key": "alt+f8",
        "command": "-editor.action.marker.next",
        "when": "editorFocus"
    },
    {
        "key": "alt+up",
        "command": "workbench.action.compareEditor.previousChange",
        "when": "textCompareEditorVisible",
        "isAIItem": false
    },
    {
        "key": "shift+alt+f5",
        "command": "-workbench.action.compareEditor.previousChange",
        "when": "textCompareEditorVisible"
    },
    {
        "key": "alt+up",
        "command": "workbench.action.editor.previousChange",
        "when": "editorTextFocus && !textCompareEditorActive",
        "isAIItem": false
    },
    {
        "key": "shift+alt+f5",
        "command": "-workbench.action.editor.previousChange",
        "when": "editorTextFocus && !textCompareEditorActive"
    },
    {
        "key": "shift+alt+f8",
        "command": "-editor.action.marker.prev",
        "when": "editorFocus"
    },
    {
        "key": "shift+f7",
        "command": "-editor.action.wordHighlight.prev",
        "when": "editorTextFocus && hasWordHighlights"
    },
    {
        "key": "shift+cmd+.",
        "command": "-editor.action.accessibleViewGoToSymbol",
        "when": "accessibilityHelpIsShown && accessibleViewGoToSymbolSupported || accessibleViewGoToSymbolSupported && accessibleViewIsShown"
    },
    {
        "key": "shift+cmd+o",
        "command": "-editor.action.accessibleViewGoToSymbol",
        "when": "accessibilityHelpIsShown && accessibleViewGoToSymbolSupported || accessibleViewGoToSymbolSupported && accessibleViewIsShown"
    },
    {
        "key": "shift+cmd+o",
        "command": "-workbench.action.gotoSymbol",
        "when": "!accessibilityHelpIsShown && !accessibleViewIsShown"
    },
    {
        "key": "cmd+t",
        "command": "-workbench.action.showAllSymbols"
    },
    {
        "key": "shift+cmd+v",
        "command": "-markdown.showPreview",
        "when": "!notebookEditorFocused && editorLangId == 'markdown'"
    },
    {
        "key": "cmd+k v",
        "command": "-markdown.showPreviewToSide",
        "when": "!notebookEditorFocused && editorLangId == 'markdown'"
    },
    {
        "key": "shift+alt+d",
        "command": "-notebook.cell.detectLanguage",
        "when": "notebookCellEditable && notebookEditable"
    },
    {
        "key": "cmd+k f12",
        "command": "-editor.action.revealDefinitionAside",
        "when": "editorHasDefinitionProvider && editorTextFocus && !isInEmbeddedEditor"
    },
    {
        "key": "cmd+k cmd+f12",
        "command": "-editor.action.revealDefinitionAside",
        "when": "editorHasDefinitionProvider && editorTextFocus && isWeb && !isInEmbeddedEditor"
    },
    {
        "key": "shift+cmd+c",
        "command": "-workbench.action.terminal.openNativeConsole",
        "when": "!terminalFocus"
    },
    {
        "key": "ctrl+alt+o",
        "command": "editor.action.organizeImports",
        "when": "textInputFocus && !editorReadonly && supportedCodeAction =~ /(\\s|^)source\\.organizeImports\\b/"
    },
    {
        "key": "shift+alt+o",
        "command": "-editor.action.organizeImports",
        "when": "textInputFocus && !editorReadonly && supportedCodeAction =~ /(\\s|^)source\\.organizeImports\\b/"
    },
    {
        "key": "cmd+k cmd+u",
        "command": "-editor.action.removeCommentLine",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+o",
        "command": "-workbench.action.terminal.openDetectedLink",
        "when": "terminalFocus && terminalHasBeenCreated"
    },
    {
        "key": "shift+cmd+o",
        "command": "workbench.action.quickOpen"
    },
    {
        "key": "cmd+p",
        "command": "-workbench.action.quickOpen"
    },
    {
        "key": "ctrl+shift+j",
        "command": "editor.action.joinLines",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+j",
        "command": "-editor.action.joinLines",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "alt+cmd+o",
        "command": "-workbench.action.remote.showMenu"
    },
    {
        "key": "alt+cmd+f7",
        "command": "references-view.findReferences",
        "when": "editorHasReferenceProvider"
    },
    {
        "key": "shift+alt+f12",
        "command": "-references-view.findReferences",
        "when": "editorHasReferenceProvider"
    },
    {
        "key": "ctrl+t",
        "command": "-editor.action.transposeLetters",
        "when": "textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+t",
        "command": "editor.action.refactor",
        "when": "editorHasCodeActionsProvider && textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+shift+r",
        "command": "-editor.action.refactor",
        "when": "editorHasCodeActionsProvider && textInputFocus && !editorReadonly"
    },
    {
        "key": "alt+cmd+backspace",
        "command": "-editor.action.removeBrackets",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+f6",
        "command": "editor.action.rename",
        "when": "editorHasRenameProvider && editorTextFocus && !editorReadonly",
        "isAIItem": false
    },
    {
        "key": "f2",
        "command": "-editor.action.rename",
        "when": "editorHasRenameProvider && editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+.",
        "command": "-editor.action.inPlaceReplace.down",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+cmd+,",
        "command": "-editor.action.inPlaceReplace.up",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+l",
        "command": "workbench.action.terminal.clear",
        "when": "terminalFocus && terminalHasBeenCreated && !accessibilityModeEnabled || terminalFocus && terminalProcessSupported && !accessibilityModeEnabled || accessibilityModeEnabled && accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibilityModeEnabled && accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"
    },
    {
        "key": "cmd+k",
        "command": "-workbench.action.terminal.clear",
        "when": "terminalFocus && terminalHasBeenCreated && !accessibilityModeEnabled || terminalFocus && terminalProcessSupported && !accessibilityModeEnabled || accessibilityModeEnabled && accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibilityModeEnabled && accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"
    },
    {
        "key": "escape",
        "command": "-workbench.action.terminal.clearSelection",
        "when": "terminalFocusInAny && terminalHasBeenCreated && terminalTextSelected && !terminalFindVisible || terminalFocusInAny && terminalProcessSupported && terminalTextSelected && !terminalFindVisible"
    },
    {
        "key": "ctrl+shift+`",
        "command": "-workbench.action.terminal.new",
        "when": "terminalProcessSupported || terminalWebExtensionContributedProfile"
    },
    {
        "key": "cmd+k cmd+l",
        "command": "-editor.toggleFold",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "cmd+k shift+cmd+l",
        "command": "-editor.toggleFoldRecursively",
        "when": "editorTextFocus && foldingEnabled"
    },
    {
        "key": "shift+alt+f1",
        "command": "-editor.action.toggleScreenReaderAccessibilityMode"
    },
    {
        "key": "ctrl+shift+m",
        "command": "-editor.action.toggleTabFocusMode"
    },
    {
        "key": "alt+cmd+0",
        "command": "-workbench.action.toggleEditorGroupLayout"
    },
    {
        "key": "cmd+k cmd+x",
        "command": "-editor.action.trimTrailingWhitespace",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "cmd+k o",
        "command": "-workbench.action.copyEditorToNewWindow",
        "when": "activeEditor"
    },
    {
        "key": "cmd+k cmd+up",
        "command": "-workbench.action.focusAboveGroup"
    },
    {
        "key": "cmd+k cmd+down",
        "command": "-workbench.action.focusBelowGroup"
    },
    {
        "key": "cmd+1",
        "command": "-workbench.action.focusFirstEditorGroup"
    },
    {
        "key": "cmd+0",
        "command": "-workbench.action.focusSideBar"
    },
    {
        "key": "cmd+k cmd+left",
        "command": "-workbench.action.focusLeftGroup"
    },
    {
        "key": "f6",
        "command": "-workbench.action.focusNextPart"
    },
    {
        "key": "cmd+k cmd+right",
        "command": "-workbench.action.focusRightGroup"
    },
    {
        "key": "cmd+k shift+cmd+\\",
        "command": "-workbench.action.joinEditorInGroup",
        "when": "sideBySideEditorActive"
    },
    {
        "key": "cmd+k enter",
        "command": "-workbench.action.keepEditor"
    },
    {
        "key": "cmd+9",
        "command": "-workbench.action.lastEditorInGroup"
    },
    {
        "key": "ctrl+0",
        "command": "-workbench.action.lastEditorInGroup"
    },
    {
        "key": "shift+cmd+]",
        "command": "-workbench.action.nextEditor"
    },
    {
        "key": "cmd+k alt+cmd+right",
        "command": "-workbench.action.nextEditorInGroup"
    },
    {
        "key": "shift+cmd+[",
        "command": "-workbench.action.previousEditor"
    },
    {
        "key": "cmd+k alt+cmd+left",
        "command": "-workbench.action.previousEditorInGroup"
    },
    {
        "key": "cmd+k shift+enter",
        "command": "-workbench.action.pinEditor",
        "when": "!activeEditorIsPinned"
    },
    {
        "key": "ctrl+shift+tab",
        "command": "-workbench.action.quickOpenLeastRecentlyUsedEditorInGroup",
        "when": "!activeEditorGroupEmpty"
    },
    {
        "key": "ctrl+tab",
        "command": "-workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup",
        "when": "!activeEditorGroupEmpty"
    },
    {
        "key": "cmd+numpad0",
        "command": "-workbench.action.zoomReset"
    },
    {
        "key": "shift+cmd+f",
        "command": "-workbench.view.search",
        "when": "workbench.view.search.active && neverMatch =~ /doesNotMatch/"
    },
    {
        "key": "shift+cmd+e",
        "command": "-workbench.view.explorer",
        "when": "viewContainer.workbench.view.explorer.enabled"
    },
    {
        "key": "shift+cmd+d",
        "command": "-workbench.view.debug",
        "when": "viewContainer.workbench.view.debug.enabled"
    },
    {
        "key": "ctrl+cmd+i",
        "command": "-workbench.panel.chat",
        "when": "workbench.panel.chat.view.copilot.active"
    },
    {
        "key": "ctrl+shift+g",
        "command": "-workbench.view.scm",
        "when": "workbench.scm.active"
    },
    {
        "key": "cmd+k cmd+\\",
        "command": "-workbench.action.splitEditorDown"
    },
    {
        "key": "cmd+k shift+cmd+\\",
        "command": "-workbench.action.splitEditorInGroup",
        "when": "activeEditorCanSplitInGroup"
    },
    {
        "key": "cmd+k cmd+\\",
        "command": "-workbench.action.splitEditorOrthogonal"
    },
    {
        "key": "cmd+k cmd+\\",
        "command": "-workbench.action.splitEditorUp"
    },
    {
        "key": "shift+cmd+y",
        "command": "-workbench.debug.action.toggleRepl",
        "when": "workbench.panel.repl.view.active"
    },
    {
        "key": "ctrl+cmd+f",
        "command": "-workbench.action.toggleFullScreen",
        "when": "!isIOS"
    },
    {
        "key": "cmd+k cmd+m",
        "command": "-workbench.action.toggleMaximizeEditorGroup",
        "when": "editorPartMaximizedEditorGroup || editorPartMultipleEditorGroups"
    },
    {
        "key": "shift+cmd+u",
        "command": "-workbench.action.output.toggleOutput",
        "when": "workbench.panel.output.active"
    },
    {
        "key": "alt+cmd+o",
        "command": "-editor.action.toggleOvertypeInsertMode"
    },
    {
        "key": "cmd+j",
        "command": "-workbench.action.togglePanel"
    },
    {
        "key": "shift+cmd+m",
        "command": "-workbench.actions.view.problems",
        "when": "workbench.panel.markers.view.active"
    },
    {
        "key": "ctrl+`",
        "command": "-workbench.action.terminal.toggleTerminal",
        "when": "terminal.active"
    },
    {
        "key": "alt+z",
        "command": "-editor.action.toggleWordWrap"
    },
    {
        "key": "cmd+k z",
        "command": "-workbench.action.toggleZenMode",
        "when": "!isAuxiliaryWindowFocusedContext"
    },
    {
        "key": "cmd+k shift+enter",
        "command": "-workbench.action.unpinEditor",
        "when": "activeEditorIsPinned"
    },
    {
        "key": "cmd+numpad_add",
        "command": "-workbench.action.zoomIn"
    },
    {
        "key": "shift+cmd+=",
        "command": "-workbench.action.zoomIn"
    },
    {
        "key": "cmd+=",
        "command": "-workbench.action.zoomIn"
    },
    {
        "key": "cmd+numpad_subtract",
        "command": "-workbench.action.zoomOut"
    },
    {
        "key": "shift+cmd+-",
        "command": "-workbench.action.zoomOut"
    },
    {
        "key": "cmd+-",
        "command": "-workbench.action.zoomOut"
    },
    {
        "key": "alt+cmd+v",
        "command": "-workbench.action.editorDictation.start",
        "when": "hasSpeechProvider && !editorReadonly && !speechToTextInProgress"
    },
    {
        "key": "escape",
        "command": "-workbench.action.editorDictation.stop",
        "when": "editorDictation.inProgress"
    },
    {
        "key": "cmd+k cmd+\\",
        "command": "-workbench.action.splitEditorLeft"
    },
    {
        "key": "cmd+k cmd+\\",
        "command": "-workbench.action.splitEditorRight"
    },
    {
        "key": "alt+f3",
        "command": "-editor.action.dirtydiff.next",
        "when": "editorTextFocus && !textCompareEditorActive"
    },
    {
        "key": "shift+alt+f3",
        "command": "-editor.action.dirtydiff.previous",
        "when": "editorTextFocus && !textCompareEditorActive"
    },
    {
        "key": "f3",
        "command": "-workbench.action.terminal.findNext",
        "when": "terminalFindFocused && terminalHasBeenCreated || terminalFindFocused && terminalProcessSupported || terminalFocusInAny && terminalHasBeenCreated || terminalFocusInAny && terminalProcessSupported"
    },
    {
        "key": "alt+down",
        "command": "notebook.diff.action.next",
        "when": "activeEditor == 'workbench.editor.notebookTextDiffEditor'"
    },
    {
        "key": "alt+f3",
        "command": "-notebook.diff.action.next",
        "when": "activeEditor == 'workbench.editor.notebookTextDiffEditor'"
    },
    {
        "key": "alt+up",
        "command": "notebook.diff.action.previous",
        "when": "activeEditor == 'workbench.editor.notebookTextDiffEditor'"
    },
    {
        "key": "shift+alt+f3",
        "command": "-notebook.diff.action.previous",
        "when": "activeEditor == 'workbench.editor.notebookTextDiffEditor'"
    },
    {
        "key": "ctrl+shift+alt+o",
        "command": "revealFileInOS"
    },
    {
        "key": "alt+f7",
        "command": "typescript.findAllFileReferences"
    },
    {
        "key": "ctrl+shift+alt+down",
        "command": "workbench.action.togglePanel"
    },
    {
        "key": "ctrl+shift+alt+left",
        "command": "workbench.action.toggleSidebarVisibility"
    },
    {
        "key": "ctrl+shift+alt+l",
        "command": "cursorWordPartLeftSelect",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+shift+alt+left",
        "command": "-cursorWordPartLeftSelect",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+shift+alt+r",
        "command": "cursorWordPartRightSelect",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+shift+alt+right",
        "command": "-cursorWordPartRightSelect",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+shift+alt+right",
        "command": "workbench.action.chat.icube.open",
        "isAIItem": true
    },
    {
        "key": "cmd+; cmd+a",
        "command": "-testing.debugAll"
    },
    {
        "key": "cmd+; cmd+e",
        "command": "-testing.debugFailTests"
    },
    {
        "key": "cmd+; cmd+l",
        "command": "-testing.debugLastRun"
    },
    {
        "key": "cmd+; cmd+c",
        "command": "-testing.debugAtCursor",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+; cmd+f",
        "command": "-testing.debugCurrentFile",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+; cmd+m",
        "command": "-testing.openOutputPeek"
    },
    {
        "key": "cmd+; cmd+r",
        "command": "-testing.refreshTests",
        "when": "testing.canRefresh"
    },
    {
        "key": "cmd+; e",
        "command": "-testing.reRunFailTests"
    },
    {
        "key": "cmd+; l",
        "command": "-testing.reRunLastRun"
    },
    {
        "key": "cmd+; shift+cmd+l",
        "command": "-testing.coverageLastRun"
    },
    {
        "key": "cmd+; a",
        "command": "-testing.runAll"
    },
    {
        "key": "cmd+; shift+cmd+a",
        "command": "-testing.coverageAll"
    },
    {
        "key": "cmd+; c",
        "command": "-testing.runAtCursor",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+; shift+cmd+c",
        "command": "-testing.coverageAtCursor",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+; f",
        "command": "-testing.runCurrentFile",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+; shift+cmd+f",
        "command": "-testing.coverageCurrentFile",
        "when": "editorTextFocus"
    },
    {
        "key": "cmd+; cmd+o",
        "command": "-testing.showMostRecentOutput",
        "when": "testing.hasAnyResults"
    },
    {
        "key": "cmd+; shift+cmd+i",
        "command": "-testing.toggleInlineCoverage"
    },
    {
        "key": "cmd+; cmd+i",
        "command": "-testing.toggleInlineTestOutput"
    },
    {
        "key": "cmd+; cmd+x",
        "command": "-testing.cancelRun"
    },
    {
        "key": "cmd+;",
        "command": "workbench.action.openGlobalKeybindings"
    },
    {
        "key": "cmd+k cmd+s",
        "command": "-workbench.action.openGlobalKeybindings"
    },
    {
        "key": "ctrl+shift+alt+3",
        "command": "workbench.action.icubeAi.addToChat"
    },
    {
        "key": "alt+cmd+2",
        "command": "workbench.action.splitEditorRight"
    },
    {
        "key": "cmd+t",
        "command": "workbench.action.terminal.kill"
    },
    {
        "key": "shift+cmd+t",
        "command": "workbench.action.terminal.killAll"
    }
]

```
