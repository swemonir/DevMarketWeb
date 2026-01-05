import React, { Component } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { MarketplaceItem } from '../../types';
import { MessageCircle, Mail } from 'lucide-react';
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
  if (!item) return null;
  const defaultMessage = `Hello, I'm interested in purchasing your project "${item.title}" listed on DevNexus.`;
  const handleWhatsApp = () => {
    if (item.whatsapp) {
      const url = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(defaultMessage)}`;
      window.open(url, '_blank');
    }
  };
  const handleEmail = () => {
    if (item.contactEmail) {
      const url = `mailto:${item.contactEmail}?subject=Purchase Request: ${item.title}&body=${encodeURIComponent(defaultMessage)}`;
      window.open(url, '_blank');
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Contact Seller">
      <div className="space-y-6">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex gap-4">
            <img src={item.thumbnail} alt={item.title} className="w-16 h-16 rounded object-cover" />
            <div>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-blue-400 font-bold">${item.price}</p>
              <p className="text-sm text-gray-400 mt-1">
                Seller: {item.authorName}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Choose how you would like to contact the seller to discuss the
            purchase.
          </p>

          <Button variant="primary" fullWidth onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-500 border-none">
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact via WhatsApp
          </Button>

          <Button variant="secondary" fullWidth onClick={handleEmail}>
            <Mail className="w-5 h-5 mr-2" />
            Contact via Email
          </Button>
        </div>

        <div className="bg-[#0a0e1a] p-3 rounded text-xs text-gray-500">
          <p className="font-medium mb-1">Pre-filled message:</p>"
          {defaultMessage}"
        </div>
      </div>
    </Modal>;
}