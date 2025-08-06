import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Hata",
        description: "Ürünler yüklenirken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await api.updateProduct(product.id, product);
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Başarılı",
        description: "Ürün güncellendi.",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Hata",
        description: "Ürün güncellenirken hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) {
      return { status: 'low', color: 'destructive' as const };
    }
    if (product.stock <= product.minStock * 1.5) {
      return { status: 'medium', color: 'secondary' as const };
    }
    return { status: 'good', color: 'default' as const };
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Ürünler</h2>
          <div className="text-muted-foreground">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Ürünler</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ürün Listesi</CardTitle>
            <CardDescription>
              Toplam {filteredProducts.length} ürün
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün Adı</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tedarikçi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₺{product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.stock <= product.minStock && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          {product.stock}/{product.minStock}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color}>
                          {stockStatus.status === 'low' ? 'Düşük' : 
                           stockStatus.status === 'medium' ? 'Orta' : 'İyi'}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell>
                        <Dialog open={isDialogOpen && editingProduct?.id === product.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ürün Düzenle</DialogTitle>
                              <DialogDescription>
                                Ürün bilgilerini güncelleyin
                              </DialogDescription>
                            </DialogHeader>
                            {editingProduct && (
                              <ProductEditForm
                                product={editingProduct}
                                onSave={handleUpdateProduct}
                                onCancel={() => {
                                  setIsDialogOpen(false);
                                  setEditingProduct(null);
                                }}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface ProductEditFormProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditForm = ({ product, onSave, onCancel }: ProductEditFormProps) => {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ürün Adı</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock">Stok</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minStock">Minimum Stok</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Tedarikçi</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          Kaydet
        </Button>
      </div>
    </form>
  );
};