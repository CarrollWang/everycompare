"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  Sun,
  GitCompare
} from "lucide-react";
import EnhancedDiffEditor from "@/components/enhanced-diff-editor";
import LanguageSwitcher from "@/components/language-switcher";
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

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [leftContent, setLeftContent] = useState(INITIAL_LEFT_CONTENT);
  const [rightContent, setRightContent] = useState(INITIAL_RIGHT_CONTENT);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [rightReadOnly, setRightReadOnly] = useState(false);
  const [leftReadOnly, setLeftReadOnly] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 使用useMemo缓存translations，避免每次重新计算
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  // 使用useMemo缓存语言选项，避免每次重新创建数组
  const languages = useMemo(() => LANGUAGE_OPTIONS.map(lang => ({
    ...lang,
    label: t.languages[lang.value as keyof typeof t.languages] || lang.label
  })), [t]);

  // 主题切换效果
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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
    element.download = "mergely-comparison.txt";
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
    console.log('Before click, leftReadOnly:', leftReadOnly);
    setLeftReadOnly(!leftReadOnly);
    console.log('After click, leftReadOnly will be:', !leftReadOnly);
  }, [leftReadOnly]);

  const toggleRightReadOnly = useCallback(() => {
    setRightReadOnly(!rightReadOnly);
  }, [rightReadOnly]);

  const toggleLineNumbers = useCallback(() => {
    setShowLineNumbers(!showLineNumbers);
  }, [showLineNumbers]);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  // 使用useMemo缓存统计信息，避免每次重新计算
  const stats = useMemo(() => ({
    leftLines: leftContent.split('\n').length,
    leftChars: leftContent.length,
    rightLines: rightContent.split('\n').length,
    rightChars: rightContent.length,
  }), [leftContent, rightContent]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="header-glass border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <GitCompare className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">{t.app.title}</h1>
                <span className="text-xs text-muted-foreground">{t.app.description}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher 
              currentLanguage={currentLanguage} 
              onLanguageChange={(language: string) => setCurrentLanguage(language as Language)} 
            />
            <Button variant="outline" size="sm" onClick={toggleTheme} className="btn-hover shadow-modern">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="w-px h-6 bg-border"></div>
            <Button variant="outline" size="sm" onClick={handleNewFile} className="btn-hover shadow-modern">
              <FileText className="h-4 w-4 mr-2" />
              {t.header.new}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFileUpload('left')} className="btn-hover shadow-modern">
              <Upload className="h-4 w-4 mr-2" />
              {t.header.openLeft}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFileUpload('right')} className="btn-hover shadow-modern">
              <Upload className="h-4 w-4 mr-2" />
              {t.header.openRight}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="btn-primary btn-hover">
              <Download className="h-4 w-4 mr-2" />
              {t.header.save}
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="glass-effect border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="toolbar-select px-3 py-1 rounded-md text-sm"
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
                className="btn-hover shadow-modern"
              >
                {showLineNumbers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="ml-2">{t.toolbar.lineNumbers}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSwap}
                className="btn-hover shadow-modern"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                {t.toolbar.swap}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                className="btn-hover shadow-modern"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t.toolbar.reset}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleLeftReadOnly}
              className="btn-hover shadow-modern"
            >
              <Settings className="h-4 w-4 mr-2" />
              {leftReadOnly ? t.toolbar.enableLeftEdit : t.toolbar.leftReadOnly}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyDiff}
              className="btn-hover shadow-modern"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t.toolbar.copyDiff}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleRightReadOnly}
              className="btn-hover shadow-modern"
            >
              <Settings className="h-4 w-4 mr-2" />
              {rightReadOnly ? t.toolbar.enableRightEdit : t.toolbar.rightReadOnly}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* File Headers */}
        <div className="flex border-b border-border bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="flex-1 px-6 py-3 bg-muted/30 backdrop-blur-sm">
            <span className="text-sm font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              {t.editor.original}
            </span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex-1 px-6 py-3 bg-muted/30 backdrop-blur-sm">
            <span className="text-sm font-semibold text-foreground flex items-center">
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
      <div className="status-bar border-t border-border px-6 py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {t.status.ready}
            </span>
            <span>{t.status.language}: {languages.find(lang => lang.value === language)?.label}</span>
            <span>{t.status.left}: {leftReadOnly ? t.status.readOnly : t.status.editable}</span>
            <span>{t.status.right}: {rightReadOnly ? t.status.readOnly : t.status.editable}</span>
          </div>
          <div className="flex items-center space-x-6">
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