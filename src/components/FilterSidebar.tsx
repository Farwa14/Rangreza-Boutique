'use client';

import type { FilterState } from '@/types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const PRICE_RANGES: { label: string; range: [number, number] }[] = [
  { label: 'All Prices', range: [0, 100000] },
  { label: 'Under Rs. 3,000', range: [0, 3000] },
  { label: 'Rs. 3,000 – Rs. 5,000', range: [3000, 5000] },
  { label: 'Rs. 5,000 – Rs. 10,000', range: [5000, 10000] },
  { label: 'Above Rs. 10,000', range: [10000, 100000] },
];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Category filter */}
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
          Category
        </h3>
        <div className="space-y-2">
          {[
            { value: 'all' as const, label: 'All Products' },
            { value: 'shirt' as const, label: 'Shirts' },
            { value: '2-piece' as const, label: '2-Piece Suits' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ ...filters, category: cat.value })}
              className={`block w-full text-left py-2 px-3 text-sm font-body transition-colors rounded-sm ${
                filters.category === cat.value
                  ? 'bg-primary text-white'
                  : 'text-foreground/70 hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
          Price Range
        </h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((pr) => {
            const isActive =
              filters.priceRange[0] === pr.range[0] && filters.priceRange[1] === pr.range[1];
            return (
              <button
                key={pr.label}
                onClick={() => onFilterChange({ ...filters, priceRange: pr.range })}
                className={`block w-full text-left py-2 px-3 text-sm font-body transition-colors rounded-sm ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground/70 hover:bg-secondary'
                }`}
              >
                {pr.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
