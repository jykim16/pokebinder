export interface CardVariety {
  id: string;
  name: string;
  rarity: string;
  image: string;
  marketValue: number;
  quantity: number;
  dateAcquired: string;
  condition: 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Light Play' | 'Moderate Play' | 'Heavy Play' | 'Damaged';
  personalPhotos: string[];
  notes: string;
}

export interface PokemonCard {
  id: number;
  name: string;
  image: string;
  type: string;
  hp: string;
  varieties: CardVariety[];
  selectedVarietyId: string;
}

export interface CardMetadata {
  totalValue: number;
  totalQuantity: number;
  firstAcquired: string;
  favoriteVariety: string;
}