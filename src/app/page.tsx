"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GitCompare } from "lucide-react";
import Sidebar from "@/components/sidebar";
import TextCompareTool from "@/components/tools/text-compare-tool";
import PlaceholderTool from "@/components/tools/placeholder-tool";
import LanguageSwitcher from "@/components/language-switcher";
import { translations, Language } from "@/lib/translations";

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentTool, setCurrentTool] = useState('text-compare');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 主题切换效果
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  const handleToolChange = useCallback((toolId: string) => {
    // 如果选择的是相同工具且侧边栏已折叠，则不执行自动折叠
    if (toolId === currentTool && sidebarCollapsed) {
      return;
    }

    setCurrentTool(toolId);
    
    // 清除之前的定时器
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    
    // 只有在侧边栏展开时才执行自动折叠
    if (!sidebarCollapsed) {
      // 选择工具后延迟300ms自动折叠侧边栏，让用户看到选择效果
      collapseTimeoutRef.current = setTimeout(() => {
        setSidebarCollapsed(true);
      }, 300);
    }
  }, [currentTool, sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    // 手动切换时清除自动折叠定时器
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'text-compare':
        return (
          <TextCompareTool 
            currentLanguage={currentLanguage}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        );
      default:
        return (
          <PlaceholderTool 
            toolId={currentTool}
            currentLanguage={currentLanguage}
          />
        );
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        currentTool={currentTool}
        onToolChange={handleToolChange}
        currentLanguage={currentLanguage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="header-glass border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <GitCompare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">
                    {translations[currentLanguage].app.title}
                  </h1>
                  <span className="text-xs text-muted-foreground">
                    {translations[currentLanguage].app.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher 
                currentLanguage={currentLanguage} 
                onLanguageChange={(language: string) => setCurrentLanguage(language as Language)} 
              />
            </div>
          </div>
        </header>

        {/* Tool Content */}
        <div className="flex-1 overflow-hidden">
          {renderCurrentTool()}
        </div>
      </div>
    </div>
  );
}