"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  RotateCcw, 
  Copy,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Moon,
  Sun
} from "lucide-react";
import EnhancedDiffEditor from "@/components/enhanced-diff-editor";
import { ToastContainer } from "@/components/toast";
import { translations, Language } from "@/lib/translations";

// 将初始内容移到组件外部，避免每次渲染重新创建
const INITIAL_LEFT_CONTENT = `// Original code
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  getTotal() {
    return calculateTotal(this.items);
  }
}`;

const INITIAL_RIGHT_CONTENT = `// Modified code
function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

class ShoppingCart {
  constructor() {
    this.items = [];
    this.discount = 0;
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  setDiscount(percentage) {
    this.discount = percentage;
  }
  
  getTotal() {
    const subtotal = calculateTotal(this.items);
    return subtotal * (1 - this.discount / 100);
  }
  
  getItemCount() {
    return this.items.length;
  }
}`;

// 将语言选项移到组件外部
const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
];

interface TextCompareToolProps {
  currentLanguage: Language;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function TextCompareTool({ currentLanguage, isDark, onToggleTheme }: TextCompareToolProps) {
  const [leftContent, setLeftContent] = useState(INITIAL_LEFT_CONTENT);
  const [rightContent, setRightContent] = useState(INITIAL_RIGHT_CONTENT);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [rightReadOnly, setRightReadOnly] = useState(false);
  const [leftReadOnly, setLeftReadOnly] = useState(false);

  // 使用useMemo缓存translations，避免每次重新计算
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  // 使用useMemo缓存语言选项，避免每次重新创建数组
  const languages = useMemo(() => LANGUAGE_OPTIONS.map(lang => ({
    ...lang,
    label: t.languages[lang.value as keyof typeof t.languages] || lang.label
  })), [t]);

  // 使用useCallback缓存事件处理函数，避免子组件不必要的重渲染
  const handleSwap = useCallback(() => {
    const temp = leftContent;
    setLeftContent(rightContent);
    setRightContent(temp);
  }, [leftContent, rightContent]);

  const handleReset = useCallback(() => {
    setLeftContent(INITIAL_LEFT_CONTENT);
    setRightContent(INITIAL_RIGHT_CONTENT);
  }, []);

  const handleCopyDiff = useCallback(() => {
    const diffText = `--- Original\n+++ Modified\n\n${leftContent}\n\n--- End Original ---\n\n${rightContent}`;
    navigator.clipboard.writeText(diffText);
  }, [leftContent, rightContent]);

  const handleDownload = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([`Original:\n${leftContent}\n\nModified:\n${rightContent}`], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = "text-comparison.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    // 清理blob URL防止内存泄漏
    URL.revokeObjectURL(element.href);
  }, [leftContent, rightContent]);

  const handleFileUpload = useCallback((side: 'left' | 'right') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.ts,.py,.java,.cpp,.c,.html,.css,.json,.md';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (side === 'left') {
            setLeftContent(content);
          } else {
            setRightContent(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleNewFile = useCallback(() => {
    setLeftContent('');
    setRightContent('');
  }, []);

  const toggleLeftReadOnly = useCallback(() => {
    setLeftReadOnly(!leftReadOnly);
  }, [leftReadOnly]);

  const toggleRightReadOnly = useCallback(() => {
    setRightReadOnly(!rightReadOnly);
  }, [rightReadOnly]);

  const toggleLineNumbers = useCallback(() => {
    setShowLineNumbers(!showLineNumbers);
  }, [showLineNumbers]);

  // 使用useMemo缓存统计信息，避免每次重新计算
  const stats = useMemo(() => ({
    leftLines: leftContent.split('\n').length,
    leftChars: leftContent.length,
    rightLines: rightContent.split('\n').length,
    rightChars: rightContent.length,
  }), [leftContent, rightContent]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="glass-effect border-b border-border px-3 md:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="toolbar-select px-2 md:px-3 py-1 rounded-md text-sm flex-shrink-0"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleLineNumbers}
              className="btn-hover shadow-modern text-xs md:text-sm"
            >
              {showLineNumbers ? <Eye className="h-3 w-3 md:h-4 md:w-4" /> : <EyeOff className="h-3 w-3 md:h-4 md:w-4" />}
              <span className="ml-1 md:ml-2 hidden sm:inline">{t.toolbar.lineNumbers}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSwap}
              className="btn-hover shadow-modern text-xs md:text-sm"
            >
              <ArrowLeftRight className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.toolbar.swap}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="btn-hover shadow-modern text-xs md:text-sm"
            >
              <RotateCcw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.toolbar.reset}</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" onClick={onToggleTheme} className="btn-hover shadow-modern">
              {isDark ? <Sun className="h-3 w-3 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 md:h-4 md:w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewFile} className="btn-hover shadow-modern text-xs md:text-sm">
              <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.header.new}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFileUpload('left')} className="btn-hover shadow-modern text-xs md:text-sm">
              <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">{t.header.openLeft}</span>
              <span className="md:hidden">L</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFileUpload('right')} className="btn-hover shadow-modern text-xs md:text-sm">
              <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">{t.header.openRight}</span>
              <span className="md:hidden">R</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleLeftReadOnly}
              className="btn-hover shadow-modern text-xs md:text-sm"
            >
              <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden lg:inline">{leftReadOnly ? t.toolbar.enableLeftEdit : t.toolbar.leftReadOnly}</span>
              <span className="lg:hidden">L</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyDiff}
              className="btn-hover shadow-modern text-xs md:text-sm"
            >
              <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.toolbar.copyDiff}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleRightReadOnly}
              className="btn-hover shadow-modern text-xs md:text-sm"
            >
              <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden lg:inline">{rightReadOnly ? t.toolbar.enableRightEdit : t.toolbar.rightReadOnly}</span>
              <span className="lg:hidden">R</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="btn-primary btn-hover text-xs md:text-sm">
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.header.save}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* File Headers */}
        <div className="flex border-b border-border bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="flex-1 px-3 md:px-6 py-2 md:py-3 bg-muted/30 backdrop-blur-sm">
            <span className="text-xs md:text-sm font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              {t.editor.original}
            </span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex-1 px-3 md:px-6 py-2 md:py-3 bg-muted/30 backdrop-blur-sm">
            <span className="text-xs md:text-sm font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              {t.editor.modified}
            </span>
          </div>
        </div>

        {/* Diff Editor */}
        <div className="flex-1 diff-editor-container">
          <EnhancedDiffEditor
            leftContent={leftContent}
            rightContent={rightContent}
            showLineNumbers={showLineNumbers}
            onLeftChange={setLeftContent}
            onRightChange={setRightContent}
            language={language}
            leftReadOnly={leftReadOnly}
            rightReadOnly={rightReadOnly}
            currentLanguage={currentLanguage}
            theme={isDark ? 'vs-dark' : 'vs'}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar border-t border-border px-3 md:px-6 py-2 md:py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 text-xs md:text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {t.status.ready}
            </span>
            <span>{t.status.language}: {languages.find(lang => lang.value === language)?.label}</span>
            <span className="hidden md:inline">{t.status.left}: {leftReadOnly ? t.status.readOnly : t.status.editable}</span>
            <span className="hidden md:inline">{t.status.right}: {rightReadOnly ? t.status.readOnly : t.status.editable}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <span className="font-mono text-xs">{t.status.left}: {stats.leftLines} {t.status.lines}, {stats.leftChars} {t.status.chars}</span>
            <span className="font-mono text-xs">{t.status.right}: {stats.rightLines} {t.status.lines}, {stats.rightChars} {t.status.chars}</span>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer language={currentLanguage} />
    </div>
  );
}