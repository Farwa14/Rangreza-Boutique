'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import AdminProductForm from '@/components/AdminProductForm';
import { SITE_NAME, BADGE_LABELS, CATEGORY_LABELS } from '@/lib/constants';
import { Plus, Pencil, Trash2, LogOut, Package } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleLogout() {
    document.cookie = 'admin-auth=; path=/; max-age=0';
    supabase.auth.signOut();
    router.push('/admin/login');
  }

  function handleAdd() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    await fetchProducts();
    setDeleting(null);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30">
        <div className="container-custom flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Package size={18} className="text-primary" />
            <h1 className="font-heading text-base font-semibold text-foreground">
              {SITE_NAME} — Admin
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-body text-foreground/50 hover:text-discount transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <AdminProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditingProduct(null); }}
            />
          </div>
        ) : (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-sm text-foreground/50">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <button onClick={handleAdd} className="btn-primary text-xs">
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {/* Product table */}
            {loading ? (
              <div className="text-center py-20 font-body text-foreground/40">
                Loading...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white shadow-sm">
                <Package size={48} className="mx-auto text-foreground/20 mb-4" />
                <p className="font-body text-foreground/50 mb-4">No products yet</p>
                <button onClick={handleAdd} className="btn-primary text-xs">
                  <Plus size={16} />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Image</th>
                      <th className="text-left py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Name</th>
                      <th className="text-left py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Category</th>
                      <th className="text-left py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Price</th>
                      <th className="text-left py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Stock</th>
                      <th className="text-left py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Badge</th>
                      <th className="text-right py-3 px-4 font-body text-[10px] uppercase tracking-wider text-foreground/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="relative w-12 h-14 bg-secondary rounded-sm overflow-hidden">
                            <Image
                              src={product.image_urls?.[0] || '/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-body text-sm text-foreground font-medium">
                          {product.name}
                        </td>
                        <td className="py-3 px-4 font-body text-sm text-foreground/60">
                          {CATEGORY_LABELS[product.category]}
                        </td>
                        <td className="py-3 px-4">
                          {product.price_discounted < product.price_original ? (
                            <div>
                              <span className="font-body text-xs text-foreground/30 line-through block">
                                Rs. {product.price_original.toLocaleString()}
                              </span>
                              <span className="font-body text-sm text-discount font-medium">
                                Rs. {product.price_discounted.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-body text-sm text-foreground">
                              Rs. {product.price_original.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-body text-sm font-medium ${
                              product.stock <= 0
                                ? 'text-discount'
                                : product.stock <= 5
                                ? 'text-amber-600'
                                : 'text-green-600'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-body text-xs text-foreground/50">
                          {product.badge ? BADGE_LABELS[product.badge] : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-foreground/40 hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deleting === product.id}
                              className="p-2 text-foreground/40 hover:text-discount transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
