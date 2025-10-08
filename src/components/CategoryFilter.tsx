'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={`neumorph neumorph-hover capitalize ${
            selectedCategory === category
              ? 'neumorph-pressed bg-primary text-primary-foreground'
              : 'bg-background text-foreground'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}