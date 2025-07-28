"use client";

import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { showToast } from './toast';
import { translations, Language } from '@/lib/translations';

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
  currentLanguage?: Language;
}

const EnhancedDiffEditor: React.FC<EnhancedDiffEditorProps> = React.memo(({
  leftContent,
  rightContent,
  showLineNumbers = true,
  onLeftChange,
  onRightChange,
  language = 'javascript',
  leftReadOnly = false,
  rightReadOnly = false,
  theme = 'vs',
  currentLanguage = 'en'
}) => {
  const diffEditorRef = useRef<import('monaco-editor').editor.IStandaloneDiffEditor | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const lastToastTime = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const isUpdatingRef = useRef(false);
  const eventListenersRef = useRef<Array<() => void>>([]);

  // 组件挂载后设置标志
  useEffect(() => {
    setIsMounted(true);
    
    // 清理函数，确保组件卸载时移除所有事件监听器
    return () => {
      eventListenersRef.current.forEach(cleanup => cleanup());
      eventListenersRef.current = [];
    };
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

  // 显示只读提示的函数，带防抖机制
  const showReadOnlyWarning = useCallback((side: 'left' | 'right') => {
    const now = Date.now();
    const lastTime = lastToastTime.current[side];
    
    // 防止频繁显示提示（2秒内只显示一次）
    if (now - lastTime < 2000) {
      return;
    }
    
    lastToastTime.current[side] = now;
    
    const t = translations[currentLanguage];
    const message = side === 'left' 
      ? t.toast.leftReadOnlyWarning 
      : t.toast.rightReadOnlyWarning;
    
    console.log('Showing toast in language:', currentLanguage, 'Message:', message);
    showToast(message, 'warning', 4000);
  }, [currentLanguage]);

  const handleEditorDidMount = useCallback((editor: import('monaco-editor').editor.IStandaloneDiffEditor) => {
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
    
    // 安全地设置初始只读状态
    try {
      originalEditor.updateOptions({ 
        readOnly: leftReadOnly,
        domReadOnly: leftReadOnly
      });
      modifiedEditor.updateOptions({ 
        readOnly: rightReadOnly,
        domReadOnly: rightReadOnly
      });
    } catch (error) {
      console.error('Error setting initial readonly state:', error);
    }

    // 添加键盘输入监听器，并保存清理函数
    const leftKeyDownDisposable = originalEditor.onKeyDown((e: import('monaco-editor').IKeyboardEvent) => {
      console.log('Left editor keydown:', { keyCode: e.keyCode, leftReadOnly });
      if (leftReadOnly && (
        (e.keyCode >= 48 && e.keyCode <= 57) || // 数字0-9
        (e.keyCode >= 65 && e.keyCode <= 90) || // 字母A-Z
        (e.keyCode >= 186 && e.keyCode <= 222) || // 符号
        e.keyCode === 32 || // 空格
        e.keyCode === 13 || // 回车
        e.keyCode === 8 || // 退格
        e.keyCode === 46 // 删除
      )) {
        console.log('Showing left readonly warning');
        showReadOnlyWarning('left');
      }
    });

    const rightKeyDownDisposable = modifiedEditor.onKeyDown((e: import('monaco-editor').IKeyboardEvent) => {
      console.log('Right editor keydown:', { keyCode: e.keyCode, rightReadOnly });
      if (rightReadOnly && (
        (e.keyCode >= 48 && e.keyCode <= 57) || // 数字0-9
        (e.keyCode >= 65 && e.keyCode <= 90) || // 字母A-Z
        (e.keyCode >= 186 && e.keyCode <= 222) || // 符号
        e.keyCode === 32 || // 空格
        e.keyCode === 13 || // 回车
        e.keyCode === 8 || // 退格
        e.keyCode === 46 // 删除
      )) {
        console.log('Showing right readonly warning');
        showReadOnlyWarning('right');
      }
    });

    // 添加粘贴事件监听
    const leftPasteDisposable = originalEditor.onDidPaste(() => {
      if (leftReadOnly) {
        showReadOnlyWarning('left');
      }
    });

    const rightPasteDisposable = modifiedEditor.onDidPaste(() => {
      if (rightReadOnly) {
        showReadOnlyWarning('right');
      }
    });

    // 保存清理函数
    eventListenersRef.current.push(
      () => leftKeyDownDisposable.dispose(),
      () => rightKeyDownDisposable.dispose(),
      () => leftPasteDisposable.dispose(),
      () => rightPasteDisposable.dispose()
    );

    // 添加内容变化监听器
    const originalModel = originalEditor.getModel();
    const modifiedModel = modifiedEditor.getModel();

    if (originalModel && onLeftChange) {
      const leftChangeDisposable = originalModel.onDidChangeContent(() => {
        if (!isUpdatingRef.current) {
          const newValue = originalModel.getValue();
          onLeftChange(newValue);
        }
      });
      eventListenersRef.current.push(() => leftChangeDisposable.dispose());
    }

    if (modifiedModel && onRightChange) {
      const rightChangeDisposable = modifiedModel.onDidChangeContent(() => {
        if (!isUpdatingRef.current) {
          const newValue = modifiedModel.getValue();
          onRightChange(newValue);
        }
      });
      eventListenersRef.current.push(() => rightChangeDisposable.dispose());
    }
    
    console.log('Editor initialized with readOnly states:', { leftReadOnly, rightReadOnly });
  }, [isMounted, leftReadOnly, rightReadOnly, onLeftChange, onRightChange, showReadOnlyWarning]);

  // 安全的内容更新，使用防抖优化
  const updateContentDebounced = useCallback((
    editor: import('monaco-editor').editor.IStandaloneCodeEditor,
    model: import('monaco-editor').editor.ITextModel, 
    newContent: string
  ) => {
    if (!model || !editor || model.getValue() === newContent) return;
    
    isUpdatingRef.current = true;
    try {
      // 批量更新，减少重绘次数
      editor.getModel()?.pushStackElement();
      model.setValue(newContent);
      editor.getModel()?.pushStackElement();
    } catch (error) {
      console.error('Error updating content:', error);
    } finally {
      // 使用 requestIdleCallback 优化更新时机
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          isUpdatingRef.current = false;
        });
      } else {
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 16); // 约一帧的时间
      }
    }
  }, []);

  // 优化内容更新
  useEffect(() => {
    if (!isMounted || !diffEditorRef.current) return;
    
    const originalEditor = diffEditorRef.current.getOriginalEditor();
    const originalModel = originalEditor?.getModel();
    
    if (originalModel) {
      updateContentDebounced(originalEditor, originalModel, leftContent);
    }
  }, [leftContent, isMounted, updateContentDebounced]);

  useEffect(() => {
    if (!isMounted || !diffEditorRef.current) return;
    
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    const modifiedModel = modifiedEditor?.getModel();
    
    if (modifiedModel) {
      updateContentDebounced(modifiedEditor, modifiedModel, rightContent);
    }
  }, [rightContent, isMounted, updateContentDebounced]);

  // 只读状态更新，使用批处理优化
  useEffect(() => {
    if (!isMounted || !diffEditorRef.current) return;
    
    const originalEditor = diffEditorRef.current.getOriginalEditor();
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    
    console.log('Updating readOnly states:', { leftReadOnly, rightReadOnly });
    
    // 使用 requestAnimationFrame 优化更新时机
    const updateFrame = requestAnimationFrame(() => {
      try {
        // 批量更新减少重绘
        originalEditor.updateOptions({ 
          readOnly: leftReadOnly,
          domReadOnly: leftReadOnly
        });
        modifiedEditor.updateOptions({ 
          readOnly: rightReadOnly,
          domReadOnly: rightReadOnly
        });
        
        // 延迟布局更新
        const layoutFrame = requestAnimationFrame(() => {
          originalEditor.layout();
          modifiedEditor.layout();
          console.log('ReadOnly state updated and synced');
        });
        
        return () => cancelAnimationFrame(layoutFrame);
      } catch (error) {
        console.error('Error updating readonly state:', error);
      }
    });
    
    return () => cancelAnimationFrame(updateFrame);
  }, [leftReadOnly, rightReadOnly, isMounted]);

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
        key={`editor-${language}-${theme}`}
      />
    </div>
  );
});

// 添加 displayName 用于调试
EnhancedDiffEditor.displayName = 'EnhancedDiffEditor';

export default EnhancedDiffEditor;