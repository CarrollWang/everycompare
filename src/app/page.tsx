"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GitCompare } from "lucide-react";
import Sidebar from "@/components/sidebar";
import TextCompareTool from "@/components/tools/text-compare-tool";
import ProductCompareTool from "@/components/tools/product-compare-tool";
import PlaceholderTool from "@/components/tools/placeholder-tool";
import LanguageSwitcher from "@/components/language-switcher";
import { translations, Language } from "@/lib/translations";

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentTool, setCurrentTool] = useState('text-compare');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 检测移动设备
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // 在移动端默认折叠侧边栏
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

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
    
    // 移动端立即折叠，桌面端延迟折叠
    if (isMobile) {
      setSidebarCollapsed(true);
    } else if (!sidebarCollapsed) {
      // 选择工具后延迟300ms自动折叠侧边栏，让用户看到选择效果
      collapseTimeoutRef.current = setTimeout(() => {
        setSidebarCollapsed(true);
      }, 300);
    }
  }, [currentTool, sidebarCollapsed, isMobile]);

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
      case 'product-compare':
        return (
          <ProductCompareTool 
            currentLanguage={currentLanguage}
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
    <div className="h-screen flex bg-background relative">
      {/* 移动端遮罩层 */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
              sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
            }`
          : 'relative'
      }`}>
        <Sidebar
          currentTool={currentTool}
          onToolChange={handleToolChange}
          currentLanguage={currentLanguage}
          collapsed={sidebarCollapsed && !isMobile ? true : false}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="header-glass border-b border-border px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-6 min-w-0">
              {/* 移动端菜单按钮 */}
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md hover:bg-muted/50 transition-colors md:hidden"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                </button>
              )}
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <GitCompare className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent truncate">
                    {translations[currentLanguage].app.title}
                  </h1>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {translations[currentLanguage].app.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
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