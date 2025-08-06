import { User, Product, Order, Notification } from '@/types';

// Mock API functions - replace with actual backend calls

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Placeholder - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: '1',
        email,
        name: 'Test User',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token'
    };
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: '1',
        email,
        name,
        role: 'user',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token'
    };
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'Laptop Dell XPS 13',
        description: 'High-performance ultrabook',
        category: 'Electronics',
        price: 15000,
        stock: 5,
        minStock: 10,
        supplier: 'Dell Inc.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Office Chair',
        description: 'Ergonomic office chair',
        category: 'Furniture',
        price: 800,
        stock: 15,
        minStock: 5,
        supplier: 'Office Supplies Co.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Wireless Mouse',
        description: 'Bluetooth wireless mouse',
        category: 'Electronics',
        price: 50,
        stock: 2,
        minStock: 20,
        supplier: 'Tech Accessories Ltd.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id,
      name: product.name || 'Updated Product',
      description: product.description || 'Updated description',
      category: product.category || 'General',
      price: product.price || 0,
      stock: product.stock || 0,
      minStock: product.minStock || 0,
      supplier: product.supplier || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        customerName: 'Ahmet Yılmaz',
        customerEmail: 'ahmet@example.com',
        products: [
          { productId: '1', productName: 'Laptop Dell XPS 13', quantity: 1, price: 15000 }
        ],
        totalAmount: 15000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        type: 'low_stock',
        title: 'Düşük Stok Uyarısı',
        message: 'Wireless Mouse ürününün stoğu kritik seviyenin altında (2/20)',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
  },
};