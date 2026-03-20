import Link from 'next/link';
import { SITE_NAME, WHATSAPP_NUMBER } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-white mb-3">
              {SITE_NAME}
            </h3>
            <p className="font-body text-sm leading-relaxed text-white/60">
              Carefully curated premium suits for women.
              Quality, style, and affordability — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/catalogue', label: 'Catalogue' },
                { href: '/shirts', label: 'Shirts' },
                { href: '/2-piece', label: '2-Piece Suits' },
                { href: '/about', label: 'About Us' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-3">
              Get in Touch
            </h4>
            <p className="font-body text-sm text-white/60 mb-3">
              Place your order or ask us anything on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
