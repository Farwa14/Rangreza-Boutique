'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    slug: '/shirts',
    title: 'Shirts',
    description: 'Elegant standalone shirts for every occasion.',
  },
  {
    slug: '/2-piece',
    title: '2-Piece Suits',
    description: 'Complete coordinated sets crafted for sophistication.',
  },
];

export default function CategoryPreview() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
            Browse By
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link href={cat.slug} className="group block">
                <div className="relative aspect-[16/9] bg-white rounded-sm overflow-hidden flex items-center justify-center transition-shadow duration-300 group-hover:shadow-lg">
                  <div className="text-center p-8 space-y-3">
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="font-body text-sm text-foreground/50 max-w-xs mx-auto">
                      {cat.description}
                    </p>
                    <span className="inline-block font-body text-xs uppercase tracking-widest text-primary border-b border-primary pb-0.5">
                      View Collection
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
