"use client";

import { useState, useEffect } from "react";
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
import LanguageSwitcher from "@/components/language-switcher";
import { translations, Language } from "@/lib/translations";

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const t = translations[currentLanguage];
  
  const [leftContent, setLeftContent] = useState(`// Original code
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
}`);

  const [rightContent, setRightContent] = useState(`// Modified code
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
}`);

  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [rightReadOnly, setRightReadOnly] = useState(false);
  const [leftReadOnly, setLeftReadOnly] = useState(true);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  const handleSwap = () => {
    const temp = leftContent;
    setLeftContent(rightContent);
    setRightContent(temp);
  };
  
  const handleReset = () => {
    setLeftContent(`// Original code
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
}`);
    setRightContent(`// Modified code
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
}`);
  };
  
  const handleCopyDiff = () => {
    const diffText = `--- Original\n+++ Modified\n\n${leftContent}\n\n--- End Original ---\n\n${rightContent}`;
    navigator.clipboard.writeText(diffText);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`Original:\n${leftContent}\n\nModified:\n${rightContent}`], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = "mergely-comparison.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = (side: 'left' | 'right') => {
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
  };

  const handleNewFile = () => {
    setLeftContent('');
    setRightContent('');
  };

  const languages = [
    { value: "javascript", label: t.languages.javascript },
    { value: "typescript", label: t.languages.typescript },
    { value: "python", label: t.languages.python },
    { value: "java", label: t.languages.java },
    { value: "csharp", label: t.languages.csharp },
    { value: "cpp", label: t.languages.cpp },
    { value: "html", label: t.languages.html },
    { value: "css", label: t.languages.css },
    { value: "json", label: t.languages.json },
    { value: "markdown", label: t.languages.markdown },
    { value: "plaintext", label: t.languages.plaintext },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="header-glass border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{t.app.title}</h1>
                <span className="text-xs text-muted-foreground">{t.app.description}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher 
              currentLanguage={currentLanguage} 
              onLanguageChange={(language: string) => setCurrentLanguage(language as Language)} 
            />
            <Button variant="outline" size="sm" onClick={() => setIsDark(!isDark)} className="btn-hover shadow-modern">
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
                onClick={() => setShowLineNumbers(!showLineNumbers)}
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
              onClick={() => setLeftReadOnly(!leftReadOnly)}
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
              onClick={() => setRightReadOnly(!rightReadOnly)}
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
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              {t.editor.original}
            </span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex-1 px-6 py-3 bg-muted/30 backdrop-blur-sm">
            <span className="text-sm font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
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
            <span className="font-mono text-xs">{t.status.left}: {leftContent.split('\n').length} {t.status.lines}, {leftContent.length} {t.status.chars}</span>
            <span className="font-mono text-xs">{t.status.right}: {rightContent.split('\n').length} {t.status.lines}, {rightContent.length} {t.status.chars}</span>
          </div>
        </div>
      </div>
    </div>
  );
}