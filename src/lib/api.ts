import {User, Product, Order, Notification, Metric} from '@/types';
import { apiClient } from "@/lib/apiClient.ts";


export const api = {
  login: async (email: string, password: string): Promise<{ user: User; access_token: string }> => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; access_token: string }> => {
    const res = await apiClient.post('/auth/register', { name, email, password });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get('/products/list/');
    return res.data;
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const res = await apiClient.put(`/products/update/${id}`, product);
    return res.data;
  },
  addProduct: async (product: Partial<Product>): Promise<Product> => {
    const res = await apiClient.post('/products/create/', product);
    return res.data;
  },
  getOrders: async (): Promise<Order[]> => {
    const res = await apiClient.get('/orders/list/');
    return res.data;
  },
  getMetrics: async (): Promise<Metric> => {
    const res = await apiClient.get('/metrics/');
    return res.data;
  },
  getCriticalStockProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get('/products/critical_stock_list/');
    return res.data;
  },

};
