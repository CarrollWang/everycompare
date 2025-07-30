// 数码产品数据类型定义

export interface ProductSpec {
  key: string;
  label: string;
  labelZh: string;
  value: string;
  category: 'basic' | 'performance' | 'display' | 'camera' | 'battery' | 'connectivity' | 'other';
}

export interface Product {
  id: string;
  name: string;
  nameZh: string;
  brand: string;
  category: ProductCategory;
  image: string;
  price: number;
  currency: string;
  popularity: number; // 热门程度 1-100
  specs: ProductSpec[];
  releaseDate: string;
  description: string;
  descriptionZh: string;
}

export type ProductCategory = 
  | 'smartphone' 
  | 'laptop' 
  | 'tablet' 
  | 'camera' 
  | 'headphone' 
  | 'smartwatch' 
  | 'gaming';

export interface ProductComparison {
  products: Product[];
  differences: {
    specKey: string;
    isDifferent: boolean;
    values: { productId: string; value: string }[];
  }[];
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  nameZh: string;
  icon: string;
  description: string;
  descriptionZh: string;
}

// 产品规格分类
export interface SpecCategory {
  id: string;
  name: string;
  nameZh: string;
  order: number;
}

// API响应类型
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// 搜索结果类型  
export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}

// 对比状态管理
export interface CompareState {
  selectedProducts: Product[];
  maxProducts: number;
  isComparing: boolean;
  compareMode: 'side-by-side' | 'table';
}