'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export function CartButton() {
  const { totalItems, toggleCart } = useCart();

  return (
    <Button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 neumorph neumorph-hover h-14 w-14 rounded-full p-0 z-30 shadow-lg"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs neumorph-flat"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Button>
  );
}