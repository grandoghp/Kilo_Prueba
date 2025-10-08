export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  genre: string;
  platform: string;
  imageUrl: string;
  rating?: number;
  releaseDate?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  gameId: string;
  quantity: number;
  game: Game;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  gameId: string;
  quantity: number;
  price: number;
  game: Game;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}