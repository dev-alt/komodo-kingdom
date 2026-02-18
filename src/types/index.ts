export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardType = 'tank' | 'rogue' | 'balanced';

export interface CardStats {
  attack: number;
  defense: number;
  hp: number;
  energy: number;
  speed: number;
}

export interface KomodoCard {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: Rarity;
  type: CardType;
  stats: CardStats;
  habitat: string;
  ability: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  collection: Array<KomodoCard>;
  packsOpened: number;
  quizzesCompleted: number;
  correctAnswers: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: Array<string>;
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PackResult {
  cards: Array<KomodoCard>;
  rarityBonus: number;
}
