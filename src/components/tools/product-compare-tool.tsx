"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Laptop, 
  Tablet,
  Camera,
  Headphones,
  Watch,
  Gamepad2,
  Search,
  X,
  ArrowRightLeft,
  Filter,
  Eye,
  ShoppingCart
} from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { 
  Product, 
  ProductCategory, 
  CompareState 
} from "@/lib/product-types";
import { 
  categories, 
  getProductsByCategory, 
  searchProducts, 
  compareProducts 
} from "@/lib/product-data";

// 图标映射
const categoryIcons = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  camera: Camera,
  headphone: Headphones,  
  smartwatch: Watch,
  gaming: Gamepad2
} as const;

interface ProductCompareToolProps {
  currentLanguage: Language;
}

export default function ProductCompareTool({ currentLanguage }: ProductCompareToolProps) {
  const [compareState, setCompareState] = useState<CompareState>({
    selectedProducts: [],
    maxProducts: 4,
    isComparing: false,
    compareMode: 'side-by-side'
  });
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('smartphone');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'categories' | 'search' | 'compare'>('categories');

  // 获取翻译文本
  const t = translations[currentLanguage];

  // 获取当前显示的产品列表
  const currentProducts = useMemo(() => {
    if (viewMode === 'search' && searchQuery.trim()) {
      return searchProducts(searchQuery.trim());
    }
    return getProductsByCategory(activeCategory);
  }, [viewMode, searchQuery, activeCategory]);

  // 添加产品到对比列表
  const addToCompare = useCallback((product: Product) => {
    setCompareState(prev => {
      if (prev.selectedProducts.some(p => p.id === product.id)) {
        return prev; // 已存在，不重复添加
      }
      if (prev.selectedProducts.length >= prev.maxProducts) {
        return prev; // 已达到最大数量
      }
      return {
        ...prev,
        selectedProducts: [...prev.selectedProducts, product]
      };
    });
  }, []);

  // 从对比列表移除产品
  const removeFromCompare = useCallback((productId: string) => {
    setCompareState(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.id !== productId)
    }));
  }, []);

  // 清空对比列表
  const clearCompare = useCallback(() => {
    setCompareState(prev => ({
      ...prev,
      selectedProducts: [],
      isComparing: false
    }));
  }, []);

  // 开始对比
  const startCompare = useCallback(() => {
    if (compareState.selectedProducts.length >= 2) {
      setCompareState(prev => ({ ...prev, isComparing: true }));
      setViewMode('compare');
    }
  }, [compareState.selectedProducts.length]);

  // 返回产品选择界面
  const backToSelection = useCallback(() => {
    setCompareState(prev => ({ ...prev, isComparing: false }));
    setViewMode('categories');
  }, []);

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setViewMode('search');
    } else {
      setViewMode('categories');
    }
  }, []);

  // 渲染分类标签
  const renderCategoryTabs = () => (
    <div className="flex space-x-2 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map(category => {
        const Icon = categoryIcons[category.id];
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setViewMode('categories');
              setSearchQuery('');
            }}
            className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium">
              {currentLanguage === 'en' ? category.name : category.nameZh}
            </span>
          </button>
        );
      })}
    </div>
  );

  // 渲染产品卡片
  const renderProductCard = (product: Product) => {
    const isSelected = compareState.selectedProducts.some(p => p.id === product.id);
    const canAddMore = compareState.selectedProducts.length < compareState.maxProducts;
    
    return (
      <div
        key={product.id}
        className={`bg-card border rounded-lg p-3 md:p-4 transition-all hover:shadow-md touch-manipulation ${
          isSelected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-muted-foreground/20'
        }`}
      >
        {/* 产品图片和基本信息 */}
        <div className="flex items-start space-x-3 md:space-x-4 mb-3 md:mb-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl">{categories.find(c => c.id === product.category)?.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
              {currentLanguage === 'en' ? product.name : product.nameZh}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">{product.brand}</p>
            <p className="text-base md:text-lg font-bold text-primary mt-1">
              ${product.price}
            </p>
          </div>
        </div>

        {/* 关键规格预览 */}
        <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
          {product.specs.slice(0, 3).map(spec => (
            <div key={spec.key} className="flex justify-between text-xs md:text-sm">
              <span className="text-muted-foreground truncate">
                {currentLanguage === 'en' ? spec.label : spec.labelZh}:
              </span>
              <span className="text-foreground font-medium truncate ml-2 max-w-32 md:max-w-none">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2">
          {isSelected ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeFromCompare(product.id)}
              className="flex-1 text-xs md:text-sm py-2 md:py-1"
            >
              <X className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              {t.productCompare.remove}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => addToCompare(product)}
              disabled={!canAddMore}
              className="flex-1 text-xs md:text-sm py-2 md:py-1"
            >
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              {t.productCompare.addToCompare}
            </Button>
          )}
          <Button size="sm" variant="ghost" className="px-2 md:px-3">
            <Eye className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // 渲染对比栏
  const renderCompareBar = () => {
    if (compareState.selectedProducts.length === 0) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <span className="text-xs md:text-sm font-medium">
                {t.productCompare.selectedForComparison}
              </span>
              <div className="flex flex-wrap gap-2">
                {compareState.selectedProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-2 bg-muted rounded-md px-2 md:px-3 py-1"
                  >
                    <span className="text-xs md:text-sm truncate max-w-24 md:max-w-32">
                      {currentLanguage === 'en' ? product.name : product.nameZh}
                    </span>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="text-muted-foreground hover:text-foreground touch-manipulation"
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({compareState.selectedProducts.length}/{compareState.maxProducts})
              </span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button variant="outline" size="sm" onClick={clearCompare} className="text-xs md:text-sm">
                {t.productCompare.clearAll}
              </Button>
              <Button
                size="sm"
                onClick={startCompare}
                disabled={compareState.selectedProducts.length < 2}
                className="bg-primary hover:bg-primary/90 text-xs md:text-sm"
              >
                <ArrowRightLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                {t.productCompare.compare}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染对比结果
  const renderComparisonView = () => {
    const comparison = compareProducts(compareState.selectedProducts.map(p => p.id));
    
    return (
      <div className="space-y-6">
        {/* 对比头部 */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={backToSelection}>
              ← {t.productCompare.backToSelection}
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">
              {t.productCompare.comparing} {comparison.products.length} {t.productCompare.products}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
            >
              {t.productCompare.clearAll}
            </Button>
          </div>
        </div>

        {/* 对比表格 */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* 产品标题行 */}
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-2 md:p-4 font-medium text-foreground min-w-32 md:min-w-48 sticky left-0 bg-muted/30 z-10">
                    <span className="text-xs md:text-sm">{t.productCompare.specifications}</span>
                  </th>
                  {comparison.products.map(product => (
                    <th key={product.id} className="text-center p-2 md:p-4 min-w-48 md:min-w-64">
                      <div className="space-y-2">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-muted rounded-lg mx-auto flex items-center justify-center">
                          <span className="text-base md:text-xl">{categories.find(c => c.id === product.category)?.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-xs md:text-sm">
                            {currentLanguage === 'en' ? product.name : product.nameZh}
                          </h3>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <p className="text-sm md:text-lg font-bold text-primary">${product.price}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.specs.map(spec => {
                  const difference = comparison.differences.find(d => d.specKey === spec.key);
                  const isDifferent = difference?.isDifferent || false;
                  
                  return (
                    <tr key={spec.key} className="border-b hover:bg-muted/20">
                      <td className="p-2 md:p-4 font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10">
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                          <span className="text-xs md:text-sm">{currentLanguage === 'en' ? spec.label : spec.labelZh}</span>
                          {isDifferent && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full w-fit">
                              {t.productCompare.different}
                            </span>
                          )}
                        </div>
                      </td>
                      {comparison.products.map(product => {
                        const productSpec = product.specs.find(s => s.key === spec.key);
                        const value = productSpec?.value || 'N/A';
                        
                        return (
                          <td 
                            key={product.id}
                            className={`p-2 md:p-4 text-center text-xs md:text-sm ${
                              isDifferent ? 'text-red-600 font-semibold' : 'text-foreground'
                            }`}
                          >
                            <div className="break-words">
                              {value}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 主渲染
  return (
    <div className="h-full flex flex-col bg-background">
      {/* 工具栏 */}
      <div className="glass-effect border-b border-border px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-6 min-w-0">
            <h2 className="text-base md:text-lg font-semibold text-foreground truncate">
              {t.productCompare.title}
            </h2>
            {!compareState.isComparing && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t.productCompare.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            {viewMode === 'search' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setViewMode('categories');
                  setSearchQuery('');
                }}
                className="text-xs md:text-sm"
              >
                <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{t.productCompare.browseCategories}</span>
                <span className="sm:hidden">分类</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-3 md:p-6">
          {compareState.isComparing ? (
            renderComparisonView()
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* 分类标签 */}
              {viewMode === 'categories' && renderCategoryTabs()}
              
              {/* 搜索结果提示 */}
              {viewMode === 'search' && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    {t.productCompare.searchResults} 
                    <span className="font-semibold text-foreground mx-1">&quot;{searchQuery}&quot;</span>
                    ({currentProducts.length} {t.productCompare.productsFound})
                  </p>
                </div>
              )}

              {/* 产品网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                {currentProducts.map(renderProductCard)}
              </div>

              {/* 空状态 */}
              {currentProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {t.productCompare.noProductsFound}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 对比栏 */}
      {!compareState.isComparing && renderCompareBar()}
    </div>
  );
}