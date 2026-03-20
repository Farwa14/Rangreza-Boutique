'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { BADGE_LABELS, BADGE_COLORS } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.price_original > product.price_discounted
    ? Math.round(((product.price_original - product.price_discounted) / product.price_original) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-sm">
          <Image
            src={product.image_urls?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-body font-semibold uppercase tracking-wider ${
                BADGE_COLORS[product.badge] || 'bg-primary text-white'
              }`}
            >
              {BADGE_LABELS[product.badge]}
            </span>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-discount text-white px-2 py-1 text-[10px] font-body font-bold">
              -{discount}%
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-foreground px-4 py-2 text-xs font-body font-semibold uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-heading text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {discount > 0 ? (
              <>
                <span className="font-body text-sm text-foreground/40 line-through">
                  Rs. {product.price_original.toLocaleString()}
                </span>
                <span className="font-body text-sm font-semibold text-discount">
                  Rs. {product.price_discounted.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-body text-sm font-semibold text-foreground">
                Rs. {product.price_original.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="font-body text-[11px] text-discount">
              Only {product.stock} left
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
