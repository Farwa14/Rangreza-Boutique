'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-secondary overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6"
        >
          <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-accent">
            Premium Collection
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1]">
            Elegance,{' '}
            <span className="text-primary">Redefined</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-foreground/60 max-w-md leading-relaxed">
            Discover our curated collection of premium women&apos;s suits — where
            modern trends meet timeless sophistication.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/catalogue" className="btn-primary">
              Explore Collection
            </Link>
            <Link href="/about" className="btn-outline">
              Our Story
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="relative aspect-[3/4] max-h-[600px] bg-accent/20 rounded-sm overflow-hidden hidden lg:block"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading text-3xl text-primary">R</span>
              </div>
              <p className="font-body text-sm text-foreground/40 uppercase tracking-widest">
                Rangreza
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
