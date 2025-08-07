export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  critical_stock: number;
}

export interface GetProductsResponse {
  data: Product[];
  total: number;
}

export interface Order {
  order_date: string;
  quantity: number;
  product_id: number;
  total: number;
  id: string;
  products: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Metric {
  "critical_stock_count": number,
  "total_products_count": number,
  "total_orders": number,
  "total_orders_revenue": number
}
