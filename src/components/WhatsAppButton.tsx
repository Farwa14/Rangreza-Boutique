import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

interface WhatsAppButtonProps {
  productName: string;
  className?: string;
  size?: 'default' | 'large';
}

export default function WhatsAppButton({
  productName,
  className = '',
  size = 'default',
}: WhatsAppButtonProps) {
  const message = encodeURIComponent(`Hi! I want to order: ${productName}`);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-whatsapp ${size === 'large' ? 'px-8 py-4 text-base' : ''} ${className}`}
    >
      <MessageCircle size={size === 'large' ? 22 : 18} />
      Order on WhatsApp
    </a>
  );
}
