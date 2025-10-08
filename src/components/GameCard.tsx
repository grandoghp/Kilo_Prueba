'use client';

import { useState } from 'react';
import { Game } from '@/types/game';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(game, quantity);
    setQuantity(1);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="neumorph neumorph-hover rounded-2xl p-6 transition-all duration-300 group">
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img
          src={game.imageUrl}
          alt={game.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {game.stock <= 5 && game.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Only {game.stock} left
          </Badge>
        )}
        {game.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {game.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {game.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="neumorph-flat">
            {game.genre}
          </Badge>
          <Badge variant="outline" className="neumorph-flat">
            {game.platform}
          </Badge>
        </div>

        {renderStars(game.rating)}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${game.price.toFixed(2)}
          </span>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center neumorph-flat rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0 neumorph-hover rounded-r-none"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(game.stock, quantity + 1))}
                disabled={quantity >= game.stock}
                className="h-8 w-8 p-0 neumorph-hover rounded-l-none"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={game.stock === 0}
          className="w-full neumorph neumorph-hover group-hover:neumorph-pressed transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}