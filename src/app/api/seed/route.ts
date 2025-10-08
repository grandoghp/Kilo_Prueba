import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const sampleGames = [
  {
    title: 'Cyber Legends 2077',
    description: 'Experience the ultimate cyberpunk adventure in a neon-lit metropolis. Hack, shoot, and drive your way through a dystopian future.',
    price: 59.99,
    genre: 'Action',
    platform: 'PC, PlayStation, Xbox',
    imageUrl: '/games/cyberpunk-game.jpg',
    rating: 4.8,
    releaseDate: new Date('2024-01-15'),
    stock: 15,
  },
  {
    title: 'Fantasy Quest XII',
    description: 'Embark on an epic journey through magical realms. Battle dragons, cast spells, and save the kingdom from ancient evil.',
    price: 49.99,
    genre: 'RPG',
    platform: 'PC, Nintendo Switch',
    imageUrl: '/games/fantasy-rpg.jpg',
    rating: 4.6,
    releaseDate: new Date('2023-11-20'),
    stock: 8,
  },
  {
    title: 'Speed Rush Pro',
    description: 'Feel the adrenaline in the fastest racing game ever. Drive supercars through stunning tracks around the world.',
    price: 39.99,
    genre: 'Racing',
    platform: 'PC, PlayStation, Xbox',
    imageUrl: '/games/racing.jpg',
    rating: 4.7,
    releaseDate: new Date('2024-02-10'),
    stock: 12,
  },
  {
    title: 'Space Defender',
    description: 'Defend Earth from alien invaders in this intense space shooter. Upgrade your ship and save humanity.',
    price: 29.99,
    genre: 'Shooter',
    platform: 'PC, Xbox',
    imageUrl: '/games/space-shooter.jpg',
    rating: 4.5,
    releaseDate: new Date('2023-09-05'),
    stock: 20,
  },
  {
    title: 'Mind Bender',
    description: 'Challenge your brain with hundreds of colorful puzzles. Perfect for all ages and skill levels.',
    price: 19.99,
    genre: 'Puzzle',
    platform: 'PC, Mobile, Switch',
    imageUrl: '/games/puzzle.jpg',
    rating: 4.4,
    releaseDate: new Date('2024-03-01'),
    stock: 25,
  },
];

export async function POST() {
  try {
    // Clear existing games
    await db.game.deleteMany();
    
    // Insert sample games
    for (const game of sampleGames) {
      await db.game.create({
        data: game,
      });
    }
    
    return NextResponse.json({ 
      message: 'Database seeded successfully',
      count: sampleGames.length 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}