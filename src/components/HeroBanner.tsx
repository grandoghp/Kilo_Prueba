'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Play, Star } from 'lucide-react';

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, toggleCart } = useCart();

  const featuredGames = [
    {
      id: '1',
      title: 'Cyber Legends',
      description: 'Experience the ultimate cyberpunk adventure in a neon-lit metropolis',
      price: 59.99,
      rating: 4.8,
      image: '/hero-banner.jpg',
      badge: 'New Release',
    },
    {
      id: '2',
      title: 'Fantasy Quest',
      description: 'Embark on an epic journey through magical realms',
      price: 49.99,
      rating: 4.6,
      image: '/games/fantasy-rpg.jpg',
      badge: 'Best Seller',
    },
    {
      id: '3',
      title: 'Speed Rush',
      description: 'Feel the adrenaline in the fastest racing game ever',
      price: 39.99,
      rating: 4.7,
      image: '/games/racing.jpg',
      badge: 'Popular',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  const currentGame = featuredGames[currentSlide];

  const handleQuickBuy = () => {
    addToCart(
      {
        id: currentGame.id,
        title: currentGame.title,
        description: currentGame.description,
        price: currentGame.price,
        genre: 'Action',
        platform: 'Multi-platform',
        imageUrl: currentGame.image,
        rating: currentGame.rating,
        stock: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      1
    );
    toggleCart();
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentGame.image}
          alt={currentGame.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="neumorph-flat mb-2">
              {currentGame.badge}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {currentGame.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg">
              {currentGame.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(currentGame.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
              <span className="text-white ml-2">
                {currentGame.rating.toFixed(1)}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">
              ${currentGame.price.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={handleQuickBuy}
              className="neumorph neumorph-hover bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Quick Buy
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="neumorph neumorph-hover border-white text-white hover:bg-white hover:text-black"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredGames.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 neumorph neumorph-hover p-2 rounded-full text-white hover:bg-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredGames.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 neumorph neumorph-hover p-2 rounded-full text-white hover:bg-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}