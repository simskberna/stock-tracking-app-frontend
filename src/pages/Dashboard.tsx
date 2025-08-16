import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { api } from '@/lib/api';
import { Product, Order, Metric } from '@/types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';

export const Dashboard = () => {
  const { data: orders = [], isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: api.getOrders,
  });

  const { data: metrics = { critical_stock_count: 0, total_orders: 0, total_orders_revenue: 0, total_products_count: 0 }, isLoading: loadingMetrics } = useQuery<Metric>({
    queryKey: ['metrics'],
    queryFn: api.getMetrics,
  });

  const { data: criticalStockProducts = [], isLoading: loadingCritical } = useQuery<Product[]>({
    queryKey: ['criticalStockProducts'],
    queryFn: api.getCriticalStockProducts,
  });

  const { data: forecastData = [], isLoading: loadingForecast } = useQuery<{ date: string, predicted_demand: number }[]>({
    queryKey: ['demandForecast'],
    queryFn: api.getDemandForecast,
  });

  const loading = loadingOrders || loadingMetrics || loadingCritical || loadingForecast;
  const lowStockProducts = metrics.critical_stock_count;
  const totalRevenue = metrics.total_orders_revenue;

  if (loading) {
    return (
        <Layout>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <div className="text-muted-foreground">Yükleniyor...</div>
          </div>
        </Layout>
    );
  }

  return (
      <Layout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.total_products_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.total_orders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Düşük Stok</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺{totalRevenue?.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts > 0 && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Düşük Stok Uyarısı</CardTitle>
                  <CardDescription>
                    Aşağıdaki ürünlerin stoğu kritik seviyenin altında
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criticalStockProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between">
                          <span className="font-medium">{product.name}</span>
                          <Badge variant="destructive">
                            {product.stock}/{product.critical_stock}
                          </Badge>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Demand Forecast Chart */}
          {forecastData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Demand Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={forecastData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="predicted_demand" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
          )}

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Son Siparişler</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                  <div className="text-muted-foreground">Henüz sipariş yok</div>
              ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order, i) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">Customer {i}</div>
                            <div className="text-sm text-muted-foreground">customer-{i}@example.com</div>
                            <span>Product: {order.product_id}</span><br/>
                            <span>Quantity: {order.quantity}</span><br/>
                            <span>Order Date: {order.order_date}</span><br/>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₺{order?.total?.toLocaleString()}</div>
                            <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                              {order.status || 'completed'}
                            </Badge>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
};
