import type { KomodoCard, QuizQuestion } from '@/types';

export const komodoCards: KomodoCard[] = [
  {
    id: 'komodo-king',
    name: 'Komodo King',
    description: 'The alpha predator of the islands. Its venomous bite and massive size make it the ultimate hunter.',
    image: '/cards/hero_komodo.jpg',
    rarity: 'legendary',
    type: 'balanced',
    stats: { attack: 95, defense: 88, hp: 100, energy: 85, speed: 70 },
    habitat: 'Coastal Islands',
    ability: 'Venomous Strike: Deals bonus damage over time'
  },
  {
    id: 'forest-stalker',
    name: 'Forest Stalker',
    description: 'A master of stealth that moves silently through the dense jungle undergrowth.',
    image: '/cards/forest_dragon.jpg',
    rarity: 'rare',
    type: 'rogue',
    stats: { attack: 82, defense: 65, hp: 75, energy: 80, speed: 95 },
    habitat: 'Dense Forest',
    ability: 'Camouflage: 25% chance to dodge attacks'
  },
  {
    id: 'komodo-titan',
    name: 'Komodo Titan',
    description: 'An armored behemoth with scales like iron plates. Few can pierce its defenses.',
    image: '/cards/tank_type.jpg',
    rarity: 'epic',
    type: 'tank',
    stats: { attack: 70, defense: 98, hp: 120, energy: 60, speed: 40 },
    habitat: 'Rocky Terrain',
    ability: 'Iron Scales: Reduces incoming damage by 30%'
  },
  {
    id: 'swift-runner',
    name: 'Swift Runner',
    description: 'Lightning fast and deadly accurate. Strikes before prey can react.',
    image: '/cards/rogue_type.jpg',
    rarity: 'rare',
    type: 'rogue',
    stats: { attack: 88, defense: 55, hp: 65, energy: 90, speed: 100 },
    habitat: 'Open Plains',
    ability: 'First Strike: Always attacks first in combat'
  },
  {
    id: 'primal-guardian',
    name: 'Primal Guardian',
    description: 'An ancient elder who protects the sacred grounds of the island.',
    image: '/cards/balanced_type.jpg',
    rarity: 'epic',
    type: 'balanced',
    stats: { attack: 78, defense: 82, hp: 95, energy: 88, speed: 65 },
    habitat: 'Sacred Grounds',
    ability: 'Ancient Wisdom: Boosts all stats by 10%'
  },
  {
    id: 'coastal-lord',
    name: 'Coastal Lord',
    description: 'Rules the shoreline with an iron grip. Expert at ambushing from the waves.',
    image: '/cards/beach_dragon.jpg',
    rarity: 'rare',
    type: 'tank',
    stats: { attack: 85, defense: 75, hp: 90, energy: 70, speed: 60 },
    habitat: 'Coastal Shores',
    ability: 'Tidal Wave: Deals area damage to all enemies'
  },
  {
    id: 'volcanic-climber',
    name: 'Volcanic Climber',
    description: 'Thrives in the harsh volcanic landscapes where others cannot survive.',
    image: '/cards/rock_dragon.jpg',
    rarity: 'uncommon',
    type: 'balanced',
    stats: { attack: 72, defense: 78, hp: 85, energy: 65, speed: 55 },
    habitat: 'Volcanic Rocks',
    ability: 'Heat Resistance: Immune to fire damage'
  },
  {
    id: 'savanna-hunter',
    name: 'Savanna Hunter',
    description: 'Patient and calculating. Waits for the perfect moment to strike.',
    image: '/cards/grass_dragon.jpg',
    rarity: 'uncommon',
    type: 'rogue',
    stats: { attack: 80, defense: 60, hp: 70, energy: 75, speed: 85 },
    habitat: 'Dry Grasslands',
    ability: 'Patient Stalker: Critical hit chance increases each turn'
  },
  {
    id: 'aquatic-terror',
    name: 'Aquatic Terror',
    description: 'A rare water-dwelling variant that hunts in rivers and coastal waters.',
    image: '/cards/water_dragon.jpg',
    rarity: 'rare',
    type: 'tank',
    stats: { attack: 75, defense: 80, hp: 88, energy: 70, speed: 50 },
    habitat: 'Rivers & Water',
    ability: 'Aquatic Ambush: Bonus damage when attacking from water'
  },
  {
    id: 'fierce-predator',
    name: 'Fierce Predator',
    description: 'Known for its terrifying display of teeth and aggressive nature.',
    image: '/cards/fierce_dragon.jpg',
    rarity: 'common',
    type: 'balanced',
    stats: { attack: 70, defense: 65, hp: 75, energy: 60, speed: 70 },
    habitat: 'General Islands',
    ability: 'Intimidate: Reduces enemy attack by 15%'
  },
  {
    id: 'ancient-king',
    name: 'Ancient King',
    description: 'A wise and calm leader who has ruled for decades.',
    image: '/cards/calm_dragon.jpg',
    rarity: 'legendary',
    type: 'tank',
    stats: { attack: 85, defense: 92, hp: 110, energy: 80, speed: 55 },
    habitat: 'Ancient Groves',
    ability: 'Royal Presence: Allies gain +20% defense'
  },
  {
    id: 'shadow-stalker',
    name: 'Shadow Stalker',
    description: 'Hunts in the twilight hours when visibility is lowest.',
    image: '/cards/hunting_dragon.jpg',
    rarity: 'common',
    type: 'rogue',
    stats: { attack: 68, defense: 58, hp: 65, energy: 70, speed: 80 },
    habitat: 'Twilight Forest',
    ability: 'Night Vision: Accuracy bonus in low light'
  },
  {
    id: 'sun-basker',
    name: 'Sun Basker',
    description: 'Draws power from the sun, becoming stronger during daylight.',
    image: '/cards/resting_dragon.jpg',
    rarity: 'common',
    type: 'balanced',
    stats: { attack: 65, defense: 70, hp: 80, energy: 75, speed: 60 },
    habitat: 'Sunny Rocks',
    ability: 'Solar Charge: Stats increase during day cycles'
  },
  {
    id: 'alpha-defender',
    name: 'Alpha Defender',
    description: 'Territorial and aggressive, defends its domain at all costs.',
    image: '/cards/territorial_dragon.jpg',
    rarity: 'uncommon',
    type: 'tank',
    stats: { attack: 78, defense: 85, hp: 92, energy: 65, speed: 50 },
    habitat: 'Territory Borders',
    ability: 'Territorial Rage: Attack bonus when defending'
  },
  {
    id: 'mystic-dragon',
    name: 'Mystic Dragon',
    description: 'A legendary creature said to possess ancient magical powers.',
    image: '/cards/mystical_dragon.jpg',
    rarity: 'legendary',
    type: 'rogue',
    stats: { attack: 90, defense: 70, hp: 85, energy: 100, speed: 90 },
    habitat: 'Mystical Realms',
    ability: 'Arcane Power: Random powerful effect each turn'
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the average weight of an adult Komodo dragon?',
    options: ['50-70 kg', '70-90 kg', '90-110 kg', '110-130 kg'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Where are Komodo dragons exclusively found?',
    options: ['Madagascar', 'Indonesian Islands', 'Philippines', 'Australia'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: 'What makes Komodo dragon bites particularly dangerous?',
    options: ['Sharp teeth only', 'Venomous proteins', 'Bacterial infection only', 'Crushing force'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 'q4',
    question: 'How long can Komodo dragons live in the wild?',
    options: ['10-15 years', '20-25 years', '30+ years', '5-10 years'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'What is the top speed of a Komodo dragon?',
    options: ['10 km/h', '20 km/h', '30 km/h', '40 km/h'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 'q6',
    question: 'Komodo dragons can consume up to what percentage of their body weight in one meal?',
    options: ['50%', '60%', '70%', '80%'],
    correctAnswer: 3,
    difficulty: 'hard'
  },
  {
    id: 'q7',
    question: 'What unique ability helps Komodo dragons locate carrion from miles away?',
    options: ['Infrared vision', 'Forked tongue smelling', 'Echolocation', 'Electroreception'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 'q8',
    question: 'How many teeth do adult Komodo dragons typically have?',
    options: ['30-40', '40-50', '50-60', '60-70'],
    correctAnswer: 2,
    difficulty: 'hard'
  },
  {
    id: 'q9',
    question: 'Komodo dragons are classified as:',
    options: ['Mammals', 'Reptiles', 'Amphibians', 'Birds'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 'q10',
    question: 'What is the conservation status of Komodo dragons?',
    options: ['Least Concern', 'Vulnerable', 'Endangered', 'Critically Endangered'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 'q11',
    question: 'Female Komodo dragons can reproduce through:',
    options: ['Only sexual reproduction', 'Parthenogenesis', 'Budding', 'Regeneration'],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 'q12',
    question: 'What is the primary diet of Komodo dragons?',
    options: ['Plants only', 'Insects only', 'Carrion and live prey', 'Fish only'],
    correctAnswer: 2,
    difficulty: 'easy'
  }
];

export const getRandomCards = (count: number, rarityBonus: number = 0): KomodoCard[] => {
  const shuffled = [...komodoCards].sort(() => Math.random() - 0.5);
  const selected: KomodoCard[] = [];
  
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const card = shuffled[i];
    const rarityRoll = Math.random() + rarityBonus;
    
    if (rarityRoll > 0.95 && card.rarity === 'legendary') {
      selected.push(card);
    } else if (rarityRoll > 0.85 && card.rarity === 'epic') {
      selected.push(card);
    } else if (rarityRoll > 0.70 && card.rarity === 'rare') {
      selected.push(card);
    } else if (rarityRoll > 0.50 && card.rarity === 'uncommon') {
      selected.push(card);
    } else {
      selected.push(card);
    }
  }
  
  return selected;
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return '#B8C1B8';
    case 'uncommon': return '#4ADE80';
    case 'rare': return '#60A5FA';
    case 'epic': return '#A78BFA';
    case 'legendary': return '#FF6F2C';
    default: return '#B8C1B8';
  }
};

export const getRarityLabel = (rarity: string): string => {
  return rarity.toUpperCase();
};
