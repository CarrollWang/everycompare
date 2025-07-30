"use client";

import React, { useState } from 'react';
import { 
  GitCompare, 
  Calculator,
  Hash,
  Palette,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface Tool {
  id: string;
  name: string;
  nameZh: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  descriptionZh: string;
  category: 'text' | 'developer' | 'utility';
}

const tools: Tool[] = [
  {
    id: 'text-compare',
    name: 'Text Compare',
    nameZh: '文本对比',
    icon: GitCompare,
    description: 'Compare and analyze text differences',
    descriptionZh: '文本对比与差异分析',
    category: 'text'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    nameZh: '计算器',
    icon: Calculator,
    description: 'Advanced calculator tool',
    descriptionZh: '高级计算器工具',
    category: 'utility'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    nameZh: '哈希生成器',
    icon: Hash,
    description: 'Generate MD5, SHA1, SHA256 hashes',
    descriptionZh: '生成MD5、SHA1、SHA256哈希值',
    category: 'developer'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    nameZh: '颜色选择器',
    icon: Palette,
    description: 'Pick and convert colors',
    descriptionZh: '颜色选择与转换工具',
    category: 'utility'
  },
  {
    id: 'product-compare',
    name: 'Product Compare',
    nameZh: '产品对比',
    icon: Smartphone,
    description: 'Compare digital products side by side',
    descriptionZh: '数码产品规格对比分析',
    category: 'utility'
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    nameZh: '时间戳转换',
    icon: Clock,
    description: 'Convert between timestamp and date',
    descriptionZh: '时间戳与日期相互转换',
    category: 'utility'
  }
];

const categories = [
  { id: 'text', name: 'Text Tools', nameZh: '文本工具' },
  { id: 'developer', name: 'Developer Tools', nameZh: '开发工具' },
  { id: 'utility', name: 'Utility Tools', nameZh: '实用工具' }
];

interface SidebarProps {
  currentTool: string;
  onToolChange: (toolId: string) => void;
  currentLanguage: Language;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ 
  currentTool, 
  onToolChange, 
  currentLanguage,
  collapsed = false,
  onToggleCollapse,
  isMobile = false
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['text', 'developer', 'utility'])
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getToolsByCategory = (category: string) => {
    return tools.filter(tool => tool.category === category);
  };

  return (
    <div className={`h-full bg-gradient-to-b from-muted/30 to-muted/10 border-r border-border flex flex-col transition-all duration-300 ${
      isMobile ? 'w-64' : (collapsed ? 'w-16' : 'w-64')
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">
                  EveryCompare
                </h2>
                <span className="text-xs text-muted-foreground">
                  {currentLanguage === 'en' ? 'Tool Suite' : '工具集合'}
                </span>
              </div>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1 h-auto hover:bg-muted/50"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto py-4">
        {categories.map(category => {
          const categoryTools = getToolsByCategory(category.id);
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className="mb-6">
              {(!collapsed || isMobile) && (
                <div
                  className="px-4 mb-2 cursor-pointer hover:bg-muted/20 py-1 rounded-md mx-2"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {currentLanguage === 'en' ? category.name : category.nameZh}
                    </span>
                    <ChevronRight 
                      className={`h-3 w-3 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              )}
              
              {((collapsed && !isMobile) || isExpanded || isMobile) && (
                <div className="space-y-1 px-2">
                  {categoryTools.map(tool => {
                    const Icon = tool.icon;
                    const isActive = currentTool === tool.id;
                    
                    return (
                      <button
                        key={tool.id}
                        onClick={() => onToolChange(tool.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg text-left transition-all duration-200 hover:bg-muted/40 group touch-manipulation ${
                          isActive 
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title={(collapsed && !isMobile) ? (currentLanguage === 'en' ? tool.name : tool.nameZh) : undefined}
                      >
                        <Icon className={`h-5 w-5 md:h-4 md:w-4 flex-shrink-0 ${
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        }`} />
                        {(!collapsed || isMobile) && (
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {currentLanguage === 'en' ? tool.name : tool.nameZh}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {currentLanguage === 'en' ? tool.description : tool.descriptionZh}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {(!collapsed || isMobile) && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {currentLanguage === 'en' 
              ? 'More tools coming soon...' 
              : '更多工具即将推出...'}
          </div>
        </div>
      )}
    </div>
  );
}