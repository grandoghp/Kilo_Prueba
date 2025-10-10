'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you might fetch order details from your API
      // For now, just show success message
      setOrderDetails({ sessionId });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been processed successfully.
          </p>

          {sessionId && (
            <p className="text-sm text-muted-foreground mb-6">
              Session ID: {sessionId}
            </p>
          )}

          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="w-full">
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}