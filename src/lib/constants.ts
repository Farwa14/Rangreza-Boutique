export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

export const SITE_NAME = 'Rangreza Boutique';
export const SITE_DESCRIPTION =
  'Carefully curated premium suits for women — quality, style, and affordability.';

export const BADGE_LABELS: Record<string, string> = {
  new: 'New Arrival',
  limited: 'Limited Stock',
  bestseller: 'Best Seller',
};

export const BADGE_COLORS: Record<string, string> = {
  new: 'bg-primary text-white',
  limited: 'bg-discount text-white',
  bestseller: 'bg-accent text-white',
};

export const CATEGORY_LABELS: Record<string, string> = {
  shirt: 'Shirts',
  '2-piece': '2-Piece Suits',
};
