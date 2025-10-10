'use client';

import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Minus, ShoppingCart, Trash2, LogIn } from 'lucide-react';
import Link from 'next/link';

export function CartSidebar() {
  const { data: session } = useSession();
  const {
    items,
    isCartOpen,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    closeCart,
  } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redirect to Stripe
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creating checkout session');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full neumorph">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <Badge variant="secondary" className="neumorph-flat">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="neumorph-hover"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 p-6">
            {!session?.user ? (
              <div className="text-center py-12">
                <LogIn className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-4">Please sign in to view your cart</p>
                <Button asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="neumorph-flat rounded-xl p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.game.imageUrl}
                        alt={item.game.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.game.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.game.price.toFixed(2)} each
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 neumorph-flat rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.gameId, item.quantity - 1)}
                              className="h-6 w-6 p-0 neumorph-hover"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.gameId, item.quantity + 1)}
                              className="h-6 w-6 p-0 neumorph-hover"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.gameId)}
                            className="text-destructive hover:text-destructive neumorph-hover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          ${(item.game.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {session?.user && items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1 neumorph neumorph-hover"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 neumorph neumorph-hover"
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}