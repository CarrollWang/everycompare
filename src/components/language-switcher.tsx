"use client";

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const handleSwitchLanguage = () => {
    const nextLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    onLanguageChange(nextLanguage);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSwitchLanguage} className="btn-hover shadow-modern">
      <Languages className="h-4 w-4 mr-2" />
      {currentLanguage === 'en' ? '中文' : 'English'}
    </Button>
  );
}