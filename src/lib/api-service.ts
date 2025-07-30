// API 集成服务层
// 用于对接 ZOL 中关村在线 API 和其他数码产品数据源

import { Product, ProductCategory, APIResponse, SearchResult } from './product-types';
import { mockProducts, searchProducts, getProductsByCategory as getProductsByCategoryMock, getProductById } from './product-data';

// API 配置
interface APIConfig {
  baseURL: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
}

// ZOL API 配置
const ZOL_API_CONFIG: APIConfig = {
  baseURL: 'https://api.zol.com.cn', // 示例 URL
  timeout: 10000,
  retryAttempts: 3
};

// API 错误类型
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 产品数据服务类
export class ProductService {
  private config: APIConfig;
  private useMockData: boolean;

  constructor(config: APIConfig = ZOL_API_CONFIG, useMockData: boolean = true) {
    this.config = config;
    this.useMockData = useMockData;
  }

  // 获取产品分类列表
  async getCategories(): Promise<APIResponse<ProductCategory[]>> {
    if (this.useMockData) {
      return {
        success: true,
        data: ['smartphone', 'laptop', 'tablet', 'camera', 'headphone', 'smartwatch', 'gaming']
      };
    }

    try {
      // 实际 API 调用逻辑
      const response = await this.makeRequest('/categories');
      return {
        success: true,
        data: response.data as ProductCategory[]
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 根据分类获取产品列表
  async getProductsByCategory(
    category: ProductCategory, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<APIResponse<SearchResult>> {
    if (this.useMockData) {
      const products = getProductsByCategoryMock(category);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        success: true,
        data: {
          products: products.slice(start, end),
          total: products.length,
          page,
          pageSize,
          query: category
        }
      };
    }

    try {
      const response = await this.makeRequest(`/products/category/${category}`, {
        page,
        pageSize
      });
      
      return {
        success: true,
        data: response.data as SearchResult
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 搜索产品
  async searchProducts(
    query: string, 
    page: number = 1, 
    pageSize: number = 20,
    category?: ProductCategory
  ): Promise<APIResponse<SearchResult>> {
    if (this.useMockData) {
      const products = searchProducts(query);
      const filteredProducts = category 
        ? products.filter(p => p.category === category)
        : products;
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        success: true,
        data: {
          products: filteredProducts.slice(start, end),
          total: filteredProducts.length,
          page,
          pageSize,
          query
        }
      };
    }

    try {
      const response = await this.makeRequest('/products/search', {
        q: query,
        page,
        pageSize,
        ...(category && { category })
      });
      
      return {
        success: true,
        data: response.data as SearchResult
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 获取产品详细信息
  async getProductDetail(productId: string): Promise<APIResponse<Product>> {
    if (this.useMockData) {
      const product = getProductById(productId);
      
      if (product) {
        return {
          success: true,
          data: product
        };
      } else {
        return {
          success: false,
          data: undefined as never,
          error: 'Product not found'
        };
      }
    }

    try {
      const response = await this.makeRequest(`/products/${productId}`);
      
      return {
        success: true,
        data: response.data as Product
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 获取热门产品
  async getPopularProducts(
    limit: number = 10,
    category?: ProductCategory
  ): Promise<APIResponse<Product[]>> {
    if (this.useMockData) {
      let products = mockProducts.sort((a, b) => b.popularity - a.popularity);
      
      if (category) {
        products = products.filter(p => p.category === category);
      }
      
      return {
        success: true,
        data: products.slice(0, limit)
      };
    }

    try {
      const response = await this.makeRequest('/products/trending', {
        limit,
        ...(category && { category })
      });
      
      return {
        success: true,
        data: response.data as Product[]
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 批量获取产品信息（用于对比）
  async getProductsById(productIds: string[]): Promise<APIResponse<Product[]>> {
    if (this.useMockData) {
      const products = productIds
        .map(id => getProductById(id))
        .filter(Boolean) as Product[];
      
      return {
        success: true,
        data: products
      };
    }

    try {
      const response = await this.makeRequest('/products/batch', {
        ids: productIds.join(',')
      });
      
      return {
        success: true,
        data: response.data as Product[]
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 通用请求方法
  private async makeRequest(
    endpoint: string, 
    params?: Record<string, string | number | boolean>
  ): Promise<{data: unknown}> {
    const url = new URL(endpoint, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      signal: AbortSignal.timeout(this.config.timeout)
    };

    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url.toString(), requestOptions);
        
        if (!response.ok) {
          throw new APIError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }
        
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < this.config.retryAttempts) {
          await this.delay(1000 * attempt); // 递增延迟
        }
      }
    }
    
    throw lastError!;
  }

  // 错误处理
  private handleError(error: unknown): APIResponse<never> {
    console.error('API Error:', error);
    
    let message = '数据获取失败，请稍后再试';
    let code = 'UNKNOWN_ERROR';
    
    if (error instanceof APIError) {
      message = error.message;
      code = error.code || 'API_ERROR';
    } else if (error instanceof Error) {
      if (error.name === 'AbortError') {
        message = '请求超时，请检查网络连接';
        code = 'TIMEOUT';
      } else if (error.message) {
        message = error.message;
      }
    }
    
    return {
      success: false,
      data: null as never,
      error: message,
      message: code
    };
  }

  // 延迟工具函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 切换数据源
  public toggleMockData(useMock: boolean) {
    this.useMockData = useMock;
  }

  // 更新 API 配置
  public updateConfig(newConfig: Partial<APIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// 默认产品服务实例
export const productService = new ProductService();

// 便捷方法 - 可直接在组件中使用
export const getProductsByCategory = async (category: ProductCategory) => {
  return await productService.getProductsByCategory(category);
};

export const searchProductsAPI = async (query: string) => {
  return await productService.searchProducts(query);
};

export const getProductDetail = async (productId: string) => {
  return await productService.getProductDetail(productId);
};

export const getPopularProducts = async (limit?: number) => {
  return await productService.getPopularProducts(limit);
};

export const getProductsForComparison = async (productIds: string[]) => {
  return await productService.getProductsById(productIds);
};