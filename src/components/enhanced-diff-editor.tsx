"use client";

import React, { useRef, useEffect } from 'react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface EnhancedDiffEditorProps {
  leftContent: string;
  rightContent: string;
  showLineNumbers?: boolean;
  onLeftChange?: (value: string) => void;
  onRightChange?: (value: string) => void;
  language?: string;
  leftReadOnly?: boolean;
  rightReadOnly?: boolean;
  theme?: string;
}

const EnhancedDiffEditor: React.FC<EnhancedDiffEditorProps> = ({
  leftContent,
  rightContent,
  showLineNumbers = true,
  onLeftChange,
  onRightChange,
  language = 'javascript',
  leftReadOnly = false,
  rightReadOnly = false,
  theme = 'vs',
}) => {
  const diffEditorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
  const leftContentRef = useRef(leftContent);
  const rightContentRef = useRef(rightContent);
  const isUpdatingFromParent = useRef(false);

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

    // Set individual editor options
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
    
    console.log('Initial readOnly states on mount:', { leftReadOnly, rightReadOnly });
    
    originalEditor.updateOptions({ readOnly: leftReadOnly });
    modifiedEditor.updateOptions({ readOnly: rightReadOnly });

    // Add listeners for content changes
    const originalModel = originalEditor.getModel();
    const modifiedModel = modifiedEditor.getModel();

    if (originalModel && onLeftChange) {
      originalModel.onDidChangeContent(() => {
        if (!isUpdatingFromParent.current) {
          const newValue = originalModel.getValue();
          leftContentRef.current = newValue;
          onLeftChange(newValue);
        }
      });
    }

    if (modifiedModel && onRightChange) {
      modifiedModel.onDidChangeContent(() => {
        if (!isUpdatingFromParent.current) {
          const newValue = modifiedModel.getValue();
          rightContentRef.current = newValue;
          onRightChange(newValue);
        }
      });
    }
  };

  // Update content when props change (but avoid re-render cycles)
  useEffect(() => {
    if (diffEditorRef.current && leftContent !== leftContentRef.current) {
      isUpdatingFromParent.current = true;
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const originalModel = originalEditor.getModel();
      if (originalModel) {
        originalModel.setValue(leftContent);
        leftContentRef.current = leftContent;
      }
      setTimeout(() => {
        isUpdatingFromParent.current = false;
      }, 0);
    }
  }, [leftContent]);

  useEffect(() => {
    if (diffEditorRef.current && rightContent !== rightContentRef.current) {
      isUpdatingFromParent.current = true;
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      const modifiedModel = modifiedEditor.getModel();
      if (modifiedModel) {
        modifiedModel.setValue(rightContent);
        rightContentRef.current = rightContent;
      }
      setTimeout(() => {
        isUpdatingFromParent.current = false;
      }, 0);
    }
  }, [rightContent]);

  // Update readOnly status when props change
  useEffect(() => {
    if (diffEditorRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      
      console.log('Updating readOnly states:', { leftReadOnly, rightReadOnly });
      
      // Update readOnly for both editors
      originalEditor.updateOptions({ 
        readOnly: leftReadOnly,
        domReadOnly: leftReadOnly
      });
      modifiedEditor.updateOptions({ 
        readOnly: rightReadOnly,
        domReadOnly: rightReadOnly
      });
      
      // Only focus when switching to editable, don't reset content
      if (!leftReadOnly) {
        setTimeout(() => originalEditor.focus(), 50);
      }
      
      if (!rightReadOnly) {
        setTimeout(() => modifiedEditor.focus(), 50);
      }
      
      // Force layout update
      originalEditor.layout();
      modifiedEditor.layout();
    }
  }, [leftReadOnly, rightReadOnly]);

  const editorOptions = {
    fontSize: 14,
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    lineNumbers: showLineNumbers ? 'on' as const : 'off' as const,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    automaticLayout: true,
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
        original={leftContentRef.current}
        modified={rightContentRef.current}
        onMount={handleEditorDidMount}
        options={editorOptions}
        theme={theme}
      />
    </div>
  );
};

export default EnhancedDiffEditor;