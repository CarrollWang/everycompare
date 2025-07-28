"use client";

import { Language } from "@/lib/translations";
import { 
  Calculator,
  Hash,
  Palette,
  Clock,
  Wrench
} from "lucide-react";

interface PlaceholderToolProps {
  toolId: string;
  currentLanguage: Language;
}

const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  'hash-generator': Hash,
  'color-picker': Palette,
  'timestamp-converter': Clock,
  default: Wrench
};

const toolNames: Record<string, { en: string; zh: string }> = {
  calculator: { en: 'Calculator', zh: '计算器' },
  'hash-generator': { en: 'Hash Generator', zh: '哈希生成器' },
  'color-picker': { en: 'Color Picker', zh: '颜色选择器' },
  'timestamp-converter': { en: 'Timestamp Converter', zh: '时间戳转换' }
};

export default function PlaceholderTool({ toolId, currentLanguage }: PlaceholderToolProps) {
  const Icon = toolIcons[toolId] || toolIcons.default;
  const toolName = toolNames[toolId];

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Icon className="h-12 w-12 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {toolName ? (currentLanguage === 'en' ? toolName.en : toolName.zh) : 'Coming Soon'}
          </h2>
          <p className="text-muted-foreground">
            {currentLanguage === 'en' 
              ? 'This tool is under development and will be available soon.'
              : '此工具正在开发中，即将推出。'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            {currentLanguage === 'en' 
              ? 'Stay tuned for more powerful tools!'
              : '敬请期待更多强大的工具！'}
          </p>
        </div>

        <div className="pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-medium">
              {currentLanguage === 'en' ? 'In Development' : '开发中'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}