export const translations = {
  en: {
    app: {
      title: "Mergely Editor",
      description: "Compare and merge text differences"
    },
    header: {
      new: "New",
      openLeft: "Open Left", 
      openRight: "Open Right",
      save: "Save"
    },
    toolbar: {
      lineNumbers: "Line Numbers",
      swap: "Swap",
      reset: "Reset",
      copyDiff: "Copy Diff",
      enableEdit: "Enable Edit",
      readOnly: "Read Only"
    },
    editor: {
      original: "Original",
      modified: "Modified"
    },
    languages: {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      java: "Java",
      csharp: "C#", 
      cpp: "C++",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      markdown: "Markdown",
      plaintext: "Plain Text"
    },
    status: {
      ready: "Ready",
      language: "Language",
      editable: "Editable",
      readOnly: "Read-only",
      left: "Left",
      right: "Right",
      lines: "lines",
      chars: "chars"
    }
  },
  zh: {
    app: {
      title: "文档比较编辑器",
      description: "比较和合并文本差异"
    },
    header: {
      new: "新建",
      openLeft: "打开左侧",
      openRight: "打开右侧",
      save: "保存"
    },
    toolbar: {
      lineNumbers: "行号",
      swap: "交换",
      reset: "重置",
      copyDiff: "复制差异",
      enableEdit: "启用编辑",
      readOnly: "只读模式"
    },
    editor: {
      original: "原始版本",
      modified: "修改版本"
    },
    languages: {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python", 
      java: "Java",
      csharp: "C#",
      cpp: "C++",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      markdown: "Markdown",
      plaintext: "纯文本"
    },
    status: {
      ready: "就绪",
      language: "语言",
      editable: "可编辑",
      readOnly: "只读",
      left: "左侧",
      right: "右侧", 
      lines: "行",
      chars: "字符"
    }
  }
};

export type Language = 'en' | 'zh';
export type TranslationKey = keyof typeof translations.en;