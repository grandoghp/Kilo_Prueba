import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const genres = ['Action', 'RPG', 'Shooter', 'Strategy', 'Sports', 'Racing', 'Adventure', 'Puzzle', 'Simulation', 'Horror'];
const platforms = ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Mobile'];
const developers = ['Naughty Dog', 'Rockstar Games', 'CD Projekt Red', 'Valve', 'Ubisoft', 'EA Games', 'Square Enix', 'Capcom', 'Bethesda', 'FromSoftware'];
const publishers = ['Sony Interactive', 'Take-Two Interactive', 'CD Projekt', 'Valve Corporation', 'Ubisoft Entertainment', 'Electronic Arts', 'Square Enix', 'Capcom', 'Bethesda Softworks', 'Bandai Namco'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateGameTitle(index: number): string {
  const prefixes = ['The', 'Call of', 'Battle', 'Grand', 'Need for', 'Assassin\'s', 'Final', 'Metal', 'Super', 'Mega'];
  const middles = ['Duty', 'Field', 'Theft', 'Creed', 'Fantasy', 'Gear', 'Mario', 'Sonic', 'Zelda', 'Pokemon'];
  const suffixes = ['Modern Warfare', 'Black Ops', 'Auto', 'Odyssey', 'VII', 'Solid', 'World', 'Adventure', 'Quest', 'Chronicles'];

  const title = `${getRandomElement(prefixes)} ${getRandomElement(middles)} ${getRandomElement(suffixes)} ${index}`;
  return title.substring(0, 100); // Limit length
}

function generateDescription(): string {
  const descriptions = [
    'An epic adventure that takes you on a journey through breathtaking worlds filled with danger and discovery.',
    'Experience intense gameplay with stunning graphics and immersive storytelling that will keep you engaged for hours.',
    'Join the fight in this action-packed game featuring multiplayer modes and challenging single-player campaigns.',
    'Explore vast open worlds, complete quests, and uncover secrets in this role-playing masterpiece.',
    'Race against time in high-speed action with realistic physics and competitive multiplayer modes.',
    'Solve puzzles and overcome obstacles in this mind-bending adventure that challenges your problem-solving skills.',
    'Build, create, and survive in this sandbox world where your imagination is the only limit.',
    'Command armies, conquer territories, and outsmart your opponents in this strategic masterpiece.',
    'Experience heart-pounding horror as you navigate through dark environments filled with terrifying creatures.',
    'Compete with players worldwide in this fast-paced sports game with realistic gameplay and stunning visuals.'
  ];
  return getRandomElement(descriptions);
}

function generateSpecs(): string {
  const specs = [
    'Minimum: OS: Windows 10, CPU: Intel Core i5, RAM: 8GB, GPU: GTX 1060',
    'Recommended: OS: Windows 11, CPU: Intel Core i7, RAM: 16GB, GPU: RTX 3070',
    'System Requirements: 4GB RAM, 2GB GPU, DirectX 11 compatible',
    'High-end PC recommended for optimal performance',
    'Compatible with most modern gaming systems'
  ];
  return getRandomElement(specs);
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing games
  await prisma.game.deleteMany({});
  console.log('🗑️  Cleared existing games');

  const games: Array<{
    title: string;
    description: string;
    price: number;
    genre: string;
    platform: string;
    imageUrl: string;
    rating: number;
    releaseDate: Date;
    stock: number;
    videoUrl: string | null;
    specs: string;
    developer: string;
    publisher: string;
  }> = [];

  for (let i = 1; i <= 1000; i++) {
    const game = {
      title: generateGameTitle(i),
      description: generateDescription(),
      price: Math.round((Math.random() * 60 + 10) * 100) / 100, // $10-$70
      genre: getRandomElement(genres),
      platform: getRandomElement(platforms),
      imageUrl: `https://picsum.photos/400/300?random=${i}`,
      rating: Math.round((Math.random() * 4 + 1) * 10) / 10, // 1.0-5.0
      releaseDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      stock: Math.floor(Math.random() * 100) + 10, // 10-110 units
      videoUrl: Math.random() > 0.7 ? `https://www.youtube.com/watch?v=dQw4w9WgXcQ` : null,
      specs: generateSpecs(),
      developer: getRandomElement(developers),
      publisher: getRandomElement(publishers),
    };

    games.push(game);

    if (i % 100 === 0) {
      console.log(`📝 Generated ${i} games...`);
    }
  }

  // Insert in batches to avoid memory issues
  const batchSize = 50;
  for (let i = 0; i < games.length; i += batchSize) {
    const batch = games.slice(i, i + batchSize);
    await prisma.game.createMany({
      data: batch,
    });
    console.log(`💾 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(games.length / batchSize)}`);
  }

  console.log('✅ Seed completed successfully!');
  console.log(`📊 Created ${games.length} games`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });