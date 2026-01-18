import { Link } from 'react-router-dom';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { MarketplaceItem } from '../../types';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  onRequestBuy: (item: MarketplaceItem) => void;
}

export function MarketplaceCard({
  item,
  onRequestBuy
}: MarketplaceCardProps) {
  const thumbnail = item.media && item.media.length > 0
    ? (item.media[0].startsWith('/uploads') ? `${API_BASE_URL}${item.media[0]}` : item.media[0])
    : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

  return <Card hoverEffect className="h-full flex flex-col group">
    {/* Thumbnail */}
    <div className="relative aspect-video overflow-hidden bg-gray-800">
      <img src={thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute top-3 left-3">
        <Badge variant="verified" className="bg-blue-600 text-white border-none shadow-lg">
          ${item.price}
        </Badge>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <Link to={`/project/${item._id}`} className="hover:underline">
          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400">by {item.owner.name}</span>
        {item.sellerVerified && <CheckCircle className="w-3 h-3 text-blue-500" />}
      </div>

      <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
        {item.description}
      </p>

      <Button variant="primary" fullWidth onClick={() => onRequestBuy(item)} className="gap-2 mt-auto">
        <ShoppingCart className="w-4 h-4" />
        Request to Buy
      </Button>
    </div>
  </Card>;
}