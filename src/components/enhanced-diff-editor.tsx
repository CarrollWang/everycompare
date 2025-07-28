"use client";

import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// 动态导入Monaco编辑器，禁用SSR
const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => ({ default: mod.DiffEditor })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }
);

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
  const diffEditorRef = useRef<any>(null);
  const updateLockRef = useRef<boolean>(false);
  const initializationCompleteRef = useRef<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // 组件挂载后设置标志
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 使用useMemo确保编辑器选项的稳定性
  const editorOptions = useMemo(() => ({
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
  }), [showLineNumbers]);

  // 原子性状态更新函数
  const atomicUpdate = useCallback((updateFn: () => void) => {
    if (!isMounted || updateLockRef.current || !diffEditorRef.current || !initializationCompleteRef.current) {
      return;
    }
    
    updateLockRef.current = true;
    
    try {
      updateFn();
    } catch (error) {
      console.error('Editor update error:', error);
    } finally {
      // 使用requestAnimationFrame确保DOM更新完成后再释放锁
      requestAnimationFrame(() => {
        updateLockRef.current = false;
      });
    }
  }, [isMounted]);

  // 安全的模型值更新
  const updateModelValue = useCallback((model: any, newValue: string) => {
    if (!model || model.getValue() === newValue) {
      return;
    }
    
    // 使用编辑操作而不是直接setValue，避免lineNumber错误
    const fullRange = model.getFullModelRange();
    model.pushEditOperations(
      [],
      [{
        range: fullRange,
        text: newValue
      }],
      () => null
    );
  }, []);

  // 安全的编辑器选项更新
  const updateEditorOptions = useCallback((
    editor: any, 
    readOnly: boolean
  ) => {
    if (!isMounted) return;
    
    try {
      const currentOptions = editor.getOptions();
      
      // 只在需要时更新选项
      if (currentOptions.get(72) !== readOnly) { // 72 is EditorOption.readOnly
        editor.updateOptions({ 
          readOnly,
          domReadOnly: readOnly
        });
      }
    } catch (error) {
      console.error('Failed to update editor options:', error);
    }
  }, [isMounted]);

  const handleEditorDidMount = useCallback((editor: any) => {
    if (!isMounted) return;
    
    diffEditorRef.current = editor;
    
    // 配置diff编辑器
    editor.updateOptions({
      renderSideBySide: true,
      enableSplitViewResizing: true,
      renderIndicators: true,
      ignoreTrimWhitespace: false,
      renderOverviewRuler: true,
      diffCodeLens: true,
      diffWordWrap: 'on',
    });

    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
    
    // 初始化编辑器选项
    updateEditorOptions(originalEditor, leftReadOnly);
    updateEditorOptions(modifiedEditor, rightReadOnly);

    // 添加内容变化监听器
    const originalModel = originalEditor.getModel();
    const modifiedModel = modifiedEditor.getModel();

    if (originalModel && onLeftChange) {
      originalModel.onDidChangeContent(() => {
        if (!updateLockRef.current) {
          const newValue = originalModel.getValue();
          onLeftChange(newValue);
        }
      });
    }

    if (modifiedModel && onRightChange) {
      modifiedModel.onDidChangeContent(() => {
        if (!updateLockRef.current) {
          const newValue = modifiedModel.getValue();
          onRightChange(newValue);
        }
      });
    }
    
    // 标记初始化完成
    initializationCompleteRef.current = true;
    
    console.log('Editor initialized with readOnly states:', { leftReadOnly, rightReadOnly });
  }, [isMounted, leftReadOnly, rightReadOnly, onLeftChange, onRightChange, updateEditorOptions]);

  // 原子性内容更新
  useEffect(() => {
    if (!isMounted) return;
    
    atomicUpdate(() => {
      if (!diffEditorRef.current) return;
      
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const originalModel = originalEditor.getModel();
      
      if (originalModel) {
        updateModelValue(originalModel, leftContent);
      }
    });
  }, [leftContent, atomicUpdate, updateModelValue, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
    atomicUpdate(() => {
      if (!diffEditorRef.current) return;
      
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      const modifiedModel = modifiedEditor.getModel();
      
      if (modifiedModel) {
        updateModelValue(modifiedModel, rightContent);
      }
    });
  }, [rightContent, atomicUpdate, updateModelValue, isMounted]);

  // 原子性只读状态更新
  useEffect(() => {
    if (!isMounted) return;
    
    atomicUpdate(() => {
      if (!diffEditorRef.current) return;
      
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      
      console.log('Updating readOnly states atomically:', { leftReadOnly, rightReadOnly });
      
      // 更新编辑器选项
      updateEditorOptions(originalEditor, leftReadOnly);
      updateEditorOptions(modifiedEditor, rightReadOnly);
      
      // 重新布局编辑器
      originalEditor.layout();
      modifiedEditor.layout();
      
      // 焦点管理
      if (!leftReadOnly) {
        originalEditor.focus();
      } else if (!rightReadOnly) {
        modifiedEditor.focus();
      }
    });
  }, [leftReadOnly, rightReadOnly, atomicUpdate, updateEditorOptions, isMounted]);

  // 服务端和客户端统一渲染
  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

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
        key={`${language}-${theme}`} // 强制重新挂载当语言或主题变化时
      />
    </div>
  );
};

export default EnhancedDiffEditor;