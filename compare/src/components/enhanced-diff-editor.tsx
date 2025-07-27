"use client";

import React, { useRef } from 'react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface EnhancedDiffEditorProps {
  leftContent: string;
  rightContent: string;
  showLineNumbers?: boolean;
  onLeftChange?: (value: string) => void;
  onRightChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  theme?: string;
}

const EnhancedDiffEditor: React.FC<EnhancedDiffEditorProps> = ({
  leftContent,
  rightContent,
  showLineNumbers = true,
  onLeftChange,
  onRightChange,
  language = 'javascript',
  readOnly = false,
  theme = 'vs',
}) => {
  const diffEditorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editor;
    
    // Configure the editor
    editor.updateOptions({
      renderSideBySide: true,
      enableSplitViewResizing: true,
      renderIndicators: true,
      ignoreTrimWhitespace: false,
      renderOverviewRuler: true,
      diffCodeLens: true,
      diffWordWrap: 'on',
    });

    // Add listeners for content changes
    const originalModel = editor.getOriginalEditor().getModel();
    const modifiedModel = editor.getModifiedEditor().getModel();

    if (originalModel && onLeftChange) {
      originalModel.onDidChangeContent(() => {
        onLeftChange(originalModel.getValue());
      });
    }

    if (modifiedModel && onRightChange) {
      modifiedModel.onDidChangeContent(() => {
        onRightChange(modifiedModel.getValue());
      });
    }
  };

  const editorOptions = {
    fontSize: 14,
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    lineNumbers: showLineNumbers ? 'on' as const : 'off' as const,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    automaticLayout: true,
    readOnly,
    renderWhitespace: 'selection' as const,
    renderControlCharacters: true,
    folding: true,
    foldingStrategy: 'indentation' as const,
    showFoldingControls: 'always' as const,
    unfoldOnClickAfterEndOfLine: true,
    bracketPairColorization: {
      enabled: true,
    },
  };

  return (
    <div className="h-full w-full">
      <MonacoDiffEditor
        height="100%"
        language={language}
        original={leftContent}
        modified={rightContent}
        onMount={handleEditorDidMount}
        options={editorOptions}
        theme={theme}
      />
    </div>
  );
};

export default EnhancedDiffEditor;