'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, FilterState } from '@/types';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import { SlidersHorizontal, X } from 'lucide-react';

interface ProductGridProps {
  initialCategory?: 'shirt' | '2-piece' | 'all';
  pageTitle: string;
  pageSubtitle?: string;
}

export default function ProductGrid({
  initialCategory = 'all',
  pageTitle,
  pageSubtitle,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    priceRange: [0, 100000],
  });

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      setProducts((data as Product[]) || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      const price = p.price_discounted || p.price_original;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      return true;
    });
  }, [products, filters]);

  return (
    <section className="section-padding bg-white pt-28 md:pt-32">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          {pageSubtitle && (
            <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
              {pageSubtitle}
            </span>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            {pageTitle}
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Mobile filter toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setFiltersOpen(true)}
              className="btn-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Mobile filter drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setFiltersOpen(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-heading text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebar filters={filters} onFilterChange={(f) => { setFilters(f); setFiltersOpen(false); }} />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-[3/4] bg-secondary rounded-sm" />
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <p className="font-body text-sm text-foreground/40 mb-6">
                  {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="font-body text-foreground/50">
                  No products found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
