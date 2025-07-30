import { Product, ProductCategory, CategoryInfo, SpecCategory } from './product-types';

// 产品分类信息
export const categories: CategoryInfo[] = [
  {
    id: 'smartphone',
    name: 'Smartphones',
    nameZh: '智能手机',
    icon: '📱',
    description: 'Mobile phones and smartphones',
    descriptionZh: '手机和智能手机'
  },
  {
    id: 'laptop',
    name: 'Laptops',
    nameZh: '笔记本电脑',
    icon: '💻',
    description: 'Portable computers and laptops',
    descriptionZh: '便携式电脑和笔记本'
  },
  {
    id: 'tablet',
    name: 'Tablets',
    nameZh: '平板电脑',
    icon: '📱',
    description: 'Tablet computers and iPads',
    descriptionZh: '平板电脑和iPad'
  },
  {
    id: 'camera',
    name: 'Cameras',
    nameZh: '相机',
    icon: '📷',
    description: 'Digital cameras and camcorders',
    descriptionZh: '数码相机和摄像机'
  },
  {
    id: 'headphone',
    name: 'Headphones',
    nameZh: '耳机',
    icon: '🎧',
    description: 'Headphones and earphones',
    descriptionZh: '头戴式耳机和耳塞'
  },
  {
    id: 'smartwatch',
    name: 'Smart Watches',
    nameZh: '智能手表',
    icon: '⌚',
    description: 'Smart watches and fitness trackers',
    descriptionZh: '智能手表和健身追踪器'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    nameZh: '游戏设备',
    icon: '🎮',
    description: 'Gaming consoles and accessories',
    descriptionZh: '游戏机和配件'
  }
];

// 规格分类
export const specCategories: SpecCategory[] = [
  { id: 'basic', name: 'Basic Info', nameZh: '基本信息', order: 1 },
  { id: 'performance', name: 'Performance', nameZh: '性能', order: 2 },
  { id: 'display', name: 'Display', nameZh: '显示', order: 3 },
  { id: 'camera', name: 'Camera', nameZh: '相机', order: 4 },
  { id: 'battery', name: 'Battery', nameZh: '电池', order: 5 },
  { id: 'connectivity', name: 'Connectivity', nameZh: '连接性', order: 6 },
  { id: 'other', name: 'Other', nameZh: '其他', order: 7 }
];

// 模拟产品数据
export const mockProducts: Product[] = [
  // iPhone系列
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    nameZh: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphone',
    image: '/api/placeholder/300/300',
    price: 999,
    currency: 'USD',
    popularity: 95,
    releaseDate: '2023-09-15',
    description: 'The most advanced iPhone with titanium design',
    descriptionZh: ' 采用钛金属设计的最先进iPhone',
    specs: [
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'A17 Pro', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '6.1" Super Retina XDR', category: 'display' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '128GB/256GB/512GB/1TB', category: 'basic' },
      { key: 'camera', label: 'Main Camera', labelZh: '主摄像头', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', category: 'camera' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: 'Up to 23 hours video playback', category: 'battery' },
      { key: 'os', label: 'Operating System', labelZh: '操作系统', value: 'iOS 17', category: 'basic' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '187g', category: 'basic' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: '5G, Wi-Fi 6E, Bluetooth 5.3', category: 'connectivity' }
    ]
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    nameZh: 'iPhone 14',
    brand: 'Apple',
    category: 'smartphone',
    image: '/api/placeholder/300/300',
    price: 799,
    currency: 'USD',
    popularity: 88,
    releaseDate: '2022-09-16',
    description: 'iPhone 14 with improved cameras and battery life',
    descriptionZh: '改进相机和电池续航的iPhone 14',
    specs: [
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'A15 Bionic', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '6.1" Super Retina XDR', category: 'display' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '128GB/256GB/512GB', category: 'basic' },
      { key: 'camera', label: 'Main Camera', labelZh: '主摄像头', value: '12MP Main + 12MP Ultra Wide', category: 'camera' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: 'Up to 20 hours video playback', category: 'battery' },
      { key: 'os', label: 'Operating System', labelZh: '操作系统', value: 'iOS 16', category: 'basic' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '172g', category: 'basic' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: '5G, Wi-Fi 6, Bluetooth 5.3', category: 'connectivity' }
    ]
  },
  // Samsung Galaxy系列
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    nameZh: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphone',
    image: '/api/placeholder/300/300',
    price: 1199,
    currency: 'USD',
    popularity: 92,
    releaseDate: '2024-01-17',
    description: 'Samsung\'s flagship with S Pen and advanced AI features',
    descriptionZh: '三星旗舰手机，配备S Pen和先进AI功能',
    specs: [
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'Snapdragon 8 Gen 3', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '6.8" Dynamic AMOLED 2X', category: 'display' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '256GB/512GB/1TB', category: 'basic' },
      { key: 'camera', label: 'Main Camera', labelZh: '主摄像头', value: '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto', category: 'camera' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: '5000mAh with 45W fast charging', category: 'battery' },
      { key: 'os', label: 'Operating System', labelZh: '操作系统', value: 'Android 14 with One UI 6.1', category: 'basic' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '232g', category: 'basic' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: '5G, Wi-Fi 7, Bluetooth 5.3', category: 'connectivity' }
    ]
  },
  // MacBook系列
  {
    id: 'macbook-pro-14-m3',
    name: 'MacBook Pro 14" M3',
    nameZh: 'MacBook Pro 14英寸 M3',
    brand: 'Apple',
    category: 'laptop',
    image: '/api/placeholder/300/300',
    price: 1999,
    currency: 'USD',
    popularity: 90,
    releaseDate: '2023-10-30',
    description: 'Professional laptop with M3 chip and Liquid Retina XDR display',
    descriptionZh: '配备M3芯片和Liquid Retina XDR显示屏的专业笔记本',
    specs: [
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'Apple M3 (8-core CPU, 10-core GPU)', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '14.2" Liquid Retina XDR (3024×1964)', category: 'display' },
      { key: 'memory', label: 'Memory', labelZh: '内存', value: '8GB/18GB/36GB unified memory', category: 'performance' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '512GB/1TB/2TB/4TB/8TB SSD', category: 'basic' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: 'Up to 22 hours', category: 'battery' },
      { key: 'os', label: 'Operating System', labelZh: '操作系统', value: 'macOS Sonoma', category: 'basic' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '1.55kg', category: 'basic' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: '3×Thunderbolt 4, HDMI, SDXC, MagSafe 3', category: 'connectivity' }
    ]
  },
  {
    id: 'thinkpad-x1-carbon',
    name: 'ThinkPad X1 Carbon Gen 11',
    nameZh: 'ThinkPad X1 Carbon 第11代',
    brand: 'Lenovo',
    category: 'laptop',
    image: '/api/placeholder/300/300',
    price: 1429,
    currency: 'USD',
    popularity: 85,
    releaseDate: '2023-02-01',
    description: 'Ultra-light business laptop with excellent keyboard',
    descriptionZh: '超轻商务笔记本，配备出色键盘',
    specs: [
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'Intel Core i7-1365U (up to 5.2GHz)', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '14" IPS (1920×1200 or 2880×1800)', category: 'display' },
      { key: 'memory', label: 'Memory', labelZh: '内存', value: '16GB/32GB LPDDR5', category: 'performance' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '256GB/512GB/1TB/2TB SSD', category: 'basic' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: 'Up to 13 hours', category: 'battery' },
      { key: 'os', label: 'Operating System', labelZh: '操作系统', value: 'Windows 11 Pro', category: 'basic' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '1.12kg', category: 'basic' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: '2×Thunderbolt 4, 2×USB-A, HDMI, Wi-Fi 6E', category: 'connectivity' }
    ]
  },
  // iPad系列
  {
    id: 'ipad-pro-12-9',
    name: 'iPad Pro 12.9" M2',
    nameZh: 'iPad Pro 12.9英寸 M2',
    brand: 'Apple',
    category: 'tablet',
    image: '/api/placeholder/300/300',
    price: 1099,
    currency: 'USD',
    popularity: 87,
    releaseDate: '2022-10-18',
    description: 'Professional tablet with M2 chip and Apple Pencil support',
    descriptionZh: '配备M2芯片和Apple Pencil支持的专业平板',
    specs: [
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'Apple M2 (8-core CPU, 10-core GPU)', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '12.9" Liquid Retina XDR (2732×2048)', category: 'display' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '128GB/256GB/512GB/1TB/2TB', category: 'basic' },
      { key: 'camera', label: 'Main Camera', labelZh: '主摄像头', value: '12MP Wide + 10MP Ultra Wide', category: 'camera' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: 'Up to 10 hours', category: 'battery' },
      { key: 'os', label: 'Operating System', labelZh: '操作系统', value: 'iPadOS 16', category: 'basic' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '682g (Wi-Fi) / 684g (Cellular)', category: 'basic' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: 'Thunderbolt / USB 4, Wi-Fi 6E, Bluetooth 5.3', category: 'connectivity' }
    ]
  },
  // Sony相机
  {
    id: 'sony-a7r5',
    name: 'Sony α7R V',
    nameZh: 'Sony α7R V',
    brand: 'Sony',
    category: 'camera',
    image: '/api/placeholder/300/300',
    price: 3898,
    currency: 'USD',
    popularity: 82,
    releaseDate: '2022-10-01',
    description: 'High-resolution full-frame mirrorless camera',
    descriptionZh: '高分辨率全画幅无反相机',
    specs: [
      { key: 'sensor', label: 'Sensor', labelZh: '传感器', value: '61MP Full-Frame Exmor R CMOS', category: 'performance' },
      { key: 'processor', label: 'Processor', labelZh: '处理器', value: 'BIONZ XR', category: 'performance' },
      { key: 'viewfinder', label: 'Viewfinder', labelZh: '取景器', value: '9.44M-dot OLED EVF', category: 'display' },
      { key: 'lcd', label: 'LCD Screen', labelZh: 'LCD屏幕', value: '3.2" 2.1M-dot vari-angle touchscreen', category: 'display' },
      { key: 'video', label: 'Video', labelZh: '视频', value: '8K 24p, 4K 60p', category: 'camera' },
      { key: 'autofocus', label: 'Autofocus', labelZh: '自动对焦', value: '693 phase-detection points', category: 'camera' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: '530 shots (LCD) / 440 shots (EVF)', category: 'battery' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: 'Wi-Fi 6, Bluetooth 5.0, USB-C', category: 'connectivity' }
    ]
  },
  // AirPods耳机
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd generation)',
    nameZh: 'AirPods Pro (第二代)',
    brand: 'Apple',
    category: 'headphone',
    image: '/api/placeholder/300/300',
    price: 249,
    currency: 'USD',
    popularity: 93,
    releaseDate: '2022-09-23',
    description: 'Wireless earbuds with active noise cancellation',
    descriptionZh: '无线耳机，配备主动降噪功能',
    specs: [
      { key: 'chip', label: 'Chip', labelZh: '芯片', value: 'Apple H2', category: 'performance' },
      { key: 'anc', label: 'Noise Cancellation', labelZh: '降噪', value: 'Active Noise Cancellation with Adaptive Transparency', category: 'other' },
      { key: 'battery_earbuds', label: 'Battery (Earbuds)', labelZh: '电池(耳机)', value: 'Up to 6 hours with ANC', category: 'battery' },
      { key: 'battery_case', label: 'Battery (with Case)', labelZh: '电池(含充电盒)', value: 'Up to 30 hours total', category: 'battery' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: 'Bluetooth 5.3', category: 'connectivity' },
      { key: 'controls', label: 'Controls', labelZh: '控制', value: 'Touch controls, Siri voice control', category: 'other' },
      { key: 'water_resistance', label: 'Water Resistance', labelZh: '防水', value: 'IPX4 (earbuds and case)', category: 'other' },
      { key: 'weight', label: 'Weight', labelZh: '重量', value: '5.3g (each earbud)', category: 'basic' }
    ]
  },
  // Apple Watch
  {
    id: 'apple-watch-series-9',
    name: 'Apple Watch Series 9',
    nameZh: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'smartwatch',
    image: '/api/placeholder/300/300',
    price: 399,
    currency: 'USD',
    popularity: 89,
    releaseDate: '2023-09-22',
    description: 'Advanced smartwatch with health monitoring',
    descriptionZh: '配备健康监测功能的先进智能手表',
    specs: [
      { key: 'chip', label: 'Chip', labelZh: '芯片', value: 'S9 SiP with 64-bit dual-core processor', category: 'performance' },
      { key: 'display', label: 'Display', labelZh: '显示屏', value: '1.9" or 1.7" Always-On Retina LTPO OLED', category: 'display' },
      { key: 'health', label: 'Health Features', labelZh: '健康功能', value: 'ECG, Blood Oxygen, Heart Rate, Temperature', category: 'other' },
      { key: 'battery', label: 'Battery Life', labelZh: '电池续航', value: 'Up to 18 hours', category: 'battery' },
      { key: 'water_resistance', label: 'Water Resistance', labelZh: '防水', value: '50 meters', category: 'other' },
      { key: 'connectivity', label: 'Connectivity', labelZh: '连接性', value: 'Wi-Fi, Bluetooth 5.3, Optional Cellular', category: 'connectivity' },
      { key: 'storage', label: 'Storage', labelZh: '存储', value: '64GB', category: 'basic' },
      { key: 'crown', label: 'Digital Crown', labelZh: '数码表冠', value: 'Haptic feedback', category: 'other' }
    ]
  }
];

// 根据分类获取产品
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts
    .filter(product => product.category === category)
    .sort((a, b) => b.popularity - a.popularity);
};

// 搜索产品
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.nameZh.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.descriptionZh.toLowerCase().includes(lowercaseQuery)
  );
};

// 获取产品详情
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// 获取热门产品
export const getPopularProducts = (limit: number = 10): Product[] => {
  return mockProducts
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

// 对比产品差异
export const compareProducts = (productIds: string[]) => {
  const products = productIds
    .map(id => getProductById(id))
    .filter(Boolean) as Product[];

  if (products.length < 2) {
    return { products, differences: [], specs: [] };
  }

  // 获取所有规格键
  const allSpecKeys = new Set<string>();
  products.forEach(product => {
    product.specs.forEach(spec => allSpecKeys.add(spec.key));
  });

  // 分析差异
  const differences = Array.from(allSpecKeys).map(specKey => {
    const values = products.map(product => {
      const spec = product.specs.find(s => s.key === specKey);
      return {
        productId: product.id,
        value: spec?.value || 'N/A'
      };
    });

    const uniqueValues = new Set(values.map(v => v.value));
    const isDifferent = uniqueValues.size > 1;

    return {
      specKey,
      isDifferent,
      values
    };
  });

  // 获取规格信息
  const specs = Array.from(allSpecKeys).map(specKey => {
    const firstSpec = products[0].specs.find(s => s.key === specKey);
    return {
      key: specKey,
      label: firstSpec?.label || specKey,
      labelZh: firstSpec?.labelZh || specKey,
      category: firstSpec?.category || 'other'
    };
  });

  return {
    products,
    differences,
    specs
  };
};