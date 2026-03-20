export interface Product {
  id: string;
  name: string;
  category: 'shirt' | '2-piece';
  price_original: number;
  price_discounted: number;
  stock: number;
  description: string;
  image_urls: string[];
  badge: 'new' | 'limited' | 'bestseller' | null;
  created_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at'>;

export interface FilterState {
  category: 'all' | 'shirt' | '2-piece';
  priceRange: [number, number];
}
