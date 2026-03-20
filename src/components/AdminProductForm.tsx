'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductInsert } from '@/types';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AdminProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: ProductInsert = {
  name: '',
  category: 'shirt',
  price_original: 0,
  price_discounted: 0,
  stock: 0,
  description: '',
  image_urls: [],
  badge: null,
};

export default function AdminProductForm({ product, onSuccess, onCancel }: AdminProductFormProps) {
  const [form, setForm] = useState<ProductInsert>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price_original: product.price_original,
        price_discounted: product.price_discounted,
        stock: product.stock,
        description: product.description,
        image_urls: product.image_urls || [],
        badge: product.badge,
      });
    }
  }, [product]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      newUrls.push(urlData.publicUrl);
    }

    setForm((prev) => ({
      ...prev,
      image_urls: [...prev.image_urls, ...newUrls],
    }));
    setUploading(false);
    e.target.value = '';
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required');
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      price_discounted: form.price_discounted || form.price_original,
    };

    if (product) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);
      if (updateError) setError(updateError.message);
      else onSuccess();
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);
      if (insertError) setError(insertError.message);
      else onSuccess();
    }

    setSaving(false);
  }

  const inputClass =
    'w-full px-4 py-3 border border-secondary bg-white font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors rounded-sm';
  const labelClass = 'block font-body text-xs uppercase tracking-wider text-foreground/60 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-discount/10 border border-discount/20 text-discount p-3 text-sm font-body rounded-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className={labelClass}>Product Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          required
        />
      </div>

      {/* Category + Badge */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as 'shirt' | '2-piece' })}
            className={inputClass}
          >
            <option value="shirt">Shirt</option>
            <option value="2-piece">2-Piece</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <select
            value={form.badge || ''}
            onChange={(e) =>
              setForm({ ...form, badge: (e.target.value || null) as ProductInsert['badge'] })
            }
            className={inputClass}
          >
            <option value="">None</option>
            <option value="new">New Arrival</option>
            <option value="limited">Limited Stock</option>
            <option value="bestseller">Best Seller</option>
          </select>
        </div>
      </div>

      {/* Prices + Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Original Price (Rs.)</label>
          <input
            type="number"
            min="0"
            value={form.price_original || ''}
            onChange={(e) => setForm({ ...form, price_original: Number(e.target.value) })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Discounted Price</label>
          <input
            type="number"
            min="0"
            value={form.price_discounted || ''}
            onChange={(e) => setForm({ ...form, price_discounted: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input
            type="number"
            min="0"
            value={form.stock || ''}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Product Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.image_urls.map((url, i) => (
            <div key={i} className="relative w-20 h-24 group">
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover rounded-sm"
                sizes="80px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-discount text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-accent text-accent text-sm font-body cursor-pointer hover:bg-secondary transition-colors rounded-sm">
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
