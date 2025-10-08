'use client';

import { useState, useEffect } from 'react';
import { GameCard } from '@/components/GameCard';
import { CartSidebar } from '@/components/CartSidebar';
import { HeroBanner } from '@/components/HeroBanner';
import { SearchBar } from '@/components/SearchBar';
import { CartButton } from '@/components/CartButton';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CartProvider, useCart } from '@/hooks/useCart';
import { Game } from '@/types/game';

function GameStoreContent() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { isCartOpen } = useCart();

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, searchTerm, selectedCategory]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(game => game.genre === selectedCategory);
    }

    setFilteredGames(filtered);
  };

  const categories = ['all', 'Action', 'RPG', 'Racing', 'Puzzle', 'Shooter'];

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-foreground">GameStore</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
              />
            </div>
          </div>
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="neumorph rounded-2xl p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {filteredGames.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No games found</p>
          </div>
        )}
      </div>

      <CartSidebar />
      <CartButton />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <GameStoreContent />
    </CartProvider>
  );
}