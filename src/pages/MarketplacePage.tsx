import React, { useEffect, useState } from 'react';
import { MarketplaceCard } from '../components/marketplace/MarketplaceCard';
import { BuyRequestModal } from '../components/marketplace/BuyRequestModal';
import { CardSkeleton } from '../components/shared/LoadingSkeleton';
import { MarketplaceItem } from '../types';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
// Mock Data
const MOCK_MARKETPLACE: MarketplaceItem[] = Array.from({
  length: 8
}).map((_, i) => ({
  id: `m${i}`,
  title: `Premium Kit ${i + 1}`,
  description: 'Complete source code with documentation and 6 months of support included.',
  thumbnail: `https://picsum.photos/seed/${i + 50}/800/450`,
  category: 'Productivity',
  profession: 'Developer',
  platform: 'Web',
  tags: ['NextJS', 'SaaS', 'Stripe'],
  status: 'Approved',
  verified: true,
  authorId: 'u2',
  authorName: 'Sarah Creator',
  createdAt: new Date().toISOString(),
  price: 49 + i * 10,
  currency: 'USD',
  sellerVerified: true,
  contactEmail: 'sarah@example.com',
  whatsapp: '1234567890',
  type: 'Source Code'
}));
export function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(MOCK_MARKETPLACE);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const handleBuyRequest = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">
            Buy high-quality apps, websites, and source code.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#151b2d] border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#151b2d] border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <CardSkeleton key={i} />)}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => <motion.div key={item.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: idx * 0.05
      }}>
              <MarketplaceCard item={item} onRequestBuy={handleBuyRequest} />
            </motion.div>)}
        </div>}

      <BuyRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />
    </div>;
}