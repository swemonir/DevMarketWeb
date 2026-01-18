import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { MarketplaceItem } from '../../types';
import { MessageCircle, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';

interface BuyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem | null;
}

export function BuyRequestModal({
  isOpen,
  onClose,
  item
}: BuyRequestModalProps) {
  const { user } = useAuth();

  if (!item) return null;

  const thumbnail = item.media && item.media.length > 0
    ? (item.media[0].startsWith('/uploads') ? `${API_BASE_URL}${item.media[0]}` : item.media[0])
    : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

  const defaultMessage = `Hello, I'm interested in purchasing your project "${item.title}" listed on DevNexus.`;

  // Try to find contact info in owner or marketplace nested object (legacy/future compatibility)
  const contactEmail = item.owner?.email;
  const whatsapp = (item as any).whatsapp || (item.owner as any)?.whatsapp;

  const handleWhatsApp = () => {
    if (whatsapp) {
      const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(defaultMessage)}`;
      window.open(url, '_blank');
    }
  };

  const handleEmail = () => {
    if (contactEmail) {
      const url = `mailto:${contactEmail}?subject=Purchase Request: ${item.title}&body=${encodeURIComponent(defaultMessage)}`;
      window.open(url, '_blank');
    }
  };

  return <Modal isOpen={isOpen} onClose={onClose} title="Contact Seller">
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex gap-4">
          <img src={thumbnail} alt={item.title} className="w-16 h-16 rounded object-cover" />
          <div>
            <h3 className="font-bold text-white">{item.title}</h3>
            <p className="text-blue-400 font-bold">${item.price}</p>
            <p className="text-sm text-gray-400 mt-1">
              Seller: {item.owner.name}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-400">
          Choose how you would like to contact the seller to discuss the
          purchase.
        </p>
        {
          user ? (
            <div className='flex flex-col gap-4'>
              {whatsapp && (
                <Button variant="primary" fullWidth onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-500 border-none">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact via WhatsApp
                </Button>
              )}

              <Button variant="secondary" fullWidth onClick={handleEmail}>
                <Mail className="w-5 h-5 mr-2" />
                Contact via Email
              </Button>
            </div>
          ) : (
            <p className="bg-blue-600/10 text-blue-400 border border-blue-600/20 p-4 rounded text-center">
              Please log in to contact the seller.
            </p>
          )
        }
      </div>

      <div className="bg-[#0a0e1a] p-3 rounded text-xs text-gray-500">
        <p className="font-medium mb-1">Pre-filled message:</p>
        "{defaultMessage}"
      </div>
    </div>
  </Modal >;
}