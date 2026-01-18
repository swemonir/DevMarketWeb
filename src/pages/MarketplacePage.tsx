import { useEffect, useState } from 'react';
import { MarketplaceCard } from '../components/marketplace/MarketplaceCard';
import { BuyRequestModal } from '../components/marketplace/BuyRequestModal';
import { CardSkeleton } from '../components/shared/LoadingSkeleton';
import { MarketplaceItem } from '../types';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { marketplaceService } from '../services/api';
import toast from 'react-hot-toast';

export function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async (page: number) => {
    setLoading(true);
    try {
      const response = await marketplaceService.getMarketplaceProjects(page, pagination.limit);
      if (response.success) {
        setItems(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total,
          totalPages: response.totalPages,
          page: response.currentPage
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch marketplace projects:', error);
      toast.error('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleBuyRequest = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <MarketplaceCard item={item} onRequestBuy={handleBuyRequest} />
              </motion.div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 bg-[#151b2d] rounded-2xl border border-gray-800">
              <p className="text-gray-400">No projects found in the marketplace.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchProjects(i + 1)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${pagination.page === i + 1
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-[#151b2d] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <BuyRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />
    </div>
  );
}