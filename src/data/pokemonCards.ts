import { PokemonCard } from '../types/pokemon';

export const sampleCards: PokemonCard[] = [
  // Page 1
  {
    id: 1,
    name: "Plusle",
    image: "https://images.pokemontcg.io/swsh4/43_hires.png",
    type: "Electric",
    hp: "70",
    selectedVarietyId: "plusle-common",
    varieties: [
      {
        id: "plusle-common",
        name: "Common",
        rarity: "Common",
        image: "https://images.pokemontcg.io/swsh4/43_hires.png",
        marketValue: 0.25,
        quantity: 3,
        dateAcquired: "2023-06-15",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Got these from a booster pack opening session with friends"
      },
      {
        id: "plusle-holo",
        name: "Holo Rare",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/swsh4/43_hires.png",
        marketValue: 2.50,
        quantity: 1,
        dateAcquired: "2023-08-22",
        condition: "Mint",
        personalPhotos: [],
        notes: "Beautiful holo pattern, kept in perfect condition"
      }
    ]
  },
  {
    id: 2,
    name: "Minun",
    image: "https://images.pokemontcg.io/swsh4/44_hires.png",
    type: "Electric",
    hp: "70",
    selectedVarietyId: "minun-common",
    varieties: [
      {
        id: "minun-common",
        name: "Common",
        rarity: "Common",
        image: "https://images.pokemontcg.io/swsh4/44_hires.png",
        marketValue: 0.25,
        quantity: 2,
        dateAcquired: "2023-06-15",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Pairs perfectly with Plusle"
      }
    ]
  },
  {
    id: 3,
    name: "Mimikyu",
    image: "https://images.pokemontcg.io/sm75/58_hires.png",
    type: "Psychic",
    hp: "70",
    selectedVarietyId: "mimikyu-rare",
    varieties: [
      {
        id: "mimikyu-rare",
        name: "Rare",
        rarity: "Rare",
        image: "https://images.pokemontcg.io/sm75/58_hires.png",
        marketValue: 1.75,
        quantity: 1,
        dateAcquired: "2023-07-10",
        condition: "Excellent",
        personalPhotos: [],
        notes: "Love the artwork on this one!"
      },
      {
        id: "mimikyu-alt-art",
        name: "Special Art Rare",
        rarity: "Special Art Rare",
        image: "https://images.pokemontcg.io/sm75/58_hires.png",
        marketValue: 15.00,
        quantity: 1,
        dateAcquired: "2023-09-05",
        condition: "Mint",
        personalPhotos: [],
        notes: "Amazing alternate artwork, one of my favorites"
      }
    ]
  },
  {
    id: 4,
    name: "Lechonk",
    image: "https://images.pokemontcg.io/sv1/156_hires.png",
    type: "Normal",
    hp: "60",
    selectedVarietyId: "lechonk-common",
    varieties: [
      {
        id: "lechonk-common",
        name: "Common",
        rarity: "Common",
        image: "https://images.pokemontcg.io/sv1/156_hires.png",
        marketValue: 0.15,
        quantity: 4,
        dateAcquired: "2023-05-20",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "So cute! Got multiple copies"
      }
    ]
  },
  {
    id: 5,
    name: "Eevee",
    image: "https://images.pokemontcg.io/sm12/166_hires.png",
    type: "Normal",
    hp: "50",
    selectedVarietyId: "eevee-promo",
    varieties: [
      {
        id: "eevee-common",
        name: "Common",
        rarity: "Common",
        image: "https://images.pokemontcg.io/sm12/166_hires.png",
        marketValue: 0.50,
        quantity: 2,
        dateAcquired: "2023-04-12",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Classic Eevee card"
      },
      {
        id: "eevee-promo",
        name: "Promo",
        rarity: "Promo",
        image: "https://images.pokemontcg.io/sm12/166_hires.png",
        marketValue: 3.25,
        quantity: 1,
        dateAcquired: "2023-06-01",
        condition: "Mint",
        personalPhotos: [],
        notes: "Special promo from Pokemon Center"
      },
      {
        id: "eevee-shiny",
        name: "Shiny Rare",
        rarity: "Shiny Rare",
        image: "https://images.pokemontcg.io/sm12/166_hires.png",
        marketValue: 12.00,
        quantity: 1,
        dateAcquired: "2023-08-15",
        condition: "Mint",
        personalPhotos: [],
        notes: "Gorgeous shiny variant, very lucky pull!"
      }
    ]
  },
  {
    id: 6,
    name: "Riolu",
    image: "https://images.pokemontcg.io/dp6/101_hires.png",
    type: "Fighting",
    hp: "70",
    selectedVarietyId: "riolu-common",
    varieties: [
      {
        id: "riolu-common",
        name: "Common",
        rarity: "Common",
        image: "https://images.pokemontcg.io/dp6/101_hires.png",
        marketValue: 0.30,
        quantity: 1,
        dateAcquired: "2023-07-25",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Pre-evolution of Lucario"
      }
    ]
  },
  {
    id: 7,
    name: "Ralts",
    image: "https://images.pokemontcg.io/sv4/142_hires.png",
    type: "Psychic",
    hp: "70",
    selectedVarietyId: "ralts-common",
    varieties: [
      {
        id: "ralts-common",
        name: "Common",
        rarity: "Common",
        image: "https://images.pokemontcg.io/sv4/142_hires.png",
        marketValue: 0.20,
        quantity: 2,
        dateAcquired: "2023-09-10",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Building the Gardevoir evolution line"
      }
    ]
  },
  {
    id: 8,
    name: "Kirlia",
    image: "https://images.pokemontcg.io/swsh1/60_hires.png",
    type: "Psychic",
    hp: "90",
    selectedVarietyId: "kirlia-uncommon",
    varieties: [
      {
        id: "kirlia-uncommon",
        name: "Uncommon",
        rarity: "Uncommon",
        image: "https://images.pokemontcg.io/swsh1/60_hires.png",
        marketValue: 0.75,
        quantity: 1,
        dateAcquired: "2023-09-10",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Middle evolution of the Gardevoir line"
      }
    ]
  },
  {
    id: 9,
    name: "Gardevoir ex",
    image: "https://images.pokemontcg.io/sv4/86_hires.png",
    type: "Psychic",
    hp: "310",
    selectedVarietyId: "gardevoir-ex",
    varieties: [
      {
        id: "gardevoir-ex",
        name: "Ultra Rare ex",
        rarity: "Ultra Rare",
        image: "https://images.pokemontcg.io/sv4/86_hires.png",
        marketValue: 25.00,
        quantity: 1,
        dateAcquired: "2023-09-15",
        condition: "Mint",
        personalPhotos: [],
        notes: "Crown jewel of my Gardevoir collection! Amazing pull from a single pack."
      }
    ]
  },
  // Page 2 - Classic cards
  {
    id: 10,
    name: "Pikachu",
    image: "https://images.pokemontcg.io/base1/58_hires.png",
    type: "Electric",
    hp: "60",
    selectedVarietyId: "pikachu-base-set",
    varieties: [
      {
        id: "pikachu-base-set",
        name: "Base Set",
        rarity: "Common",
        image: "https://images.pokemontcg.io/base1/58_hires.png",
        marketValue: 8.00,
        quantity: 1,
        dateAcquired: "2023-03-10",
        condition: "Light Play",
        personalPhotos: [],
        notes: "Classic Base Set Pikachu, some wear but still iconic"
      }
    ]
  },
  {
    id: 11,
    name: "Charizard",
    image: "https://images.pokemontcg.io/base1/4_hires.png",
    type: "Fire",
    hp: "120",
    selectedVarietyId: "charizard-base-set",
    varieties: [
      {
        id: "charizard-base-set",
        name: "Base Set Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/base1/4_hires.png",
        marketValue: 350.00,
        quantity: 1,
        dateAcquired: "2023-01-15",
        condition: "Excellent",
        personalPhotos: [],
        notes: "THE card! Base Set Charizard in great condition. My most valuable card."
      }
    ]
  },
  {
    id: 12,
    name: "Blastoise",
    image: "https://images.pokemontcg.io/base1/2_hires.png",
    type: "Water",
    hp: "100",
    selectedVarietyId: "blastoise-base-set",
    varieties: [
      {
        id: "blastoise-base-set",
        name: "Base Set Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/base1/2_hires.png",
        marketValue: 120.00,
        quantity: 1,
        dateAcquired: "2023-02-20",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Beautiful Base Set Blastoise, part of the original starter trio"
      }
    ]
  },
  {
    id: 13,
    name: "Venusaur",
    image: "https://images.pokemontcg.io/base1/15_hires.png",
    type: "Grass",
    hp: "100",
    selectedVarietyId: "venusaur-base-set",
    varieties: [
      {
        id: "venusaur-base-set",
        name: "Base Set Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/base1/15_hires.png",
        marketValue: 85.00,
        quantity: 1,
        dateAcquired: "2023-03-05",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Completes my Base Set starter trio collection"
      }
    ]
  },
  {
    id: 14,
    name: "Alakazam",
    image: "https://images.pokemontcg.io/base1/1_hires.png",
    type: "Psychic",
    hp: "80",
    selectedVarietyId: "alakazam-base-set",
    varieties: [
      {
        id: "alakazam-base-set",
        name: "Base Set Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/base1/1_hires.png",
        marketValue: 45.00,
        quantity: 1,
        dateAcquired: "2023-04-01",
        condition: "Excellent",
        personalPhotos: [],
        notes: "Classic psychic type from the original set"
      }
    ]
  },
  {
    id: 15,
    name: "Machamp",
    image: "https://images.pokemontcg.io/base1/8_hires.png",
    type: "Fighting",
    hp: "100",
    selectedVarietyId: "machamp-base-set",
    varieties: [
      {
        id: "machamp-base-set",
        name: "Base Set Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/base1/8_hires.png",
        marketValue: 35.00,
        quantity: 1,
        dateAcquired: "2023-04-15",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Powerful fighting type from the original Base Set"
      }
    ]
  },
  {
    id: 16,
    name: "Gengar",
    image: "https://images.pokemontcg.io/fossil/5_hires.png",
    type: "Psychic",
    hp: "60",
    selectedVarietyId: "gengar-fossil",
    varieties: [
      {
        id: "gengar-fossil",
        name: "Fossil Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/fossil/5_hires.png",
        marketValue: 55.00,
        quantity: 1,
        dateAcquired: "2023-05-01",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Spooky ghost type from the Fossil expansion"
      }
    ]
  },
  {
    id: 17,
    name: "Dragonite",
    image: "https://images.pokemontcg.io/fossil/4_hires.png",
    type: "Colorless",
    hp: "100",
    selectedVarietyId: "dragonite-fossil",
    varieties: [
      {
        id: "dragonite-fossil",
        name: "Fossil Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/fossil/4_hires.png",
        marketValue: 65.00,
        quantity: 1,
        dateAcquired: "2023-05-10",
        condition: "Excellent",
        personalPhotos: [],
        notes: "Majestic dragon from the Fossil set"
      }
    ]
  },
  {
    id: 18,
    name: "Mewtwo",
    image: "https://images.pokemontcg.io/base1/10_hires.png",
    type: "Psychic",
    hp: "60",
    selectedVarietyId: "mewtwo-base-set",
    varieties: [
      {
        id: "mewtwo-base-set",
        name: "Base Set Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/base1/10_hires.png",
        marketValue: 75.00,
        quantity: 1,
        dateAcquired: "2023-03-25",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Legendary psychic Pokemon from Base Set"
      }
    ]
  },
  // Page 3 - Legendary cards
  {
    id: 19,
    name: "Mew",
    image: "https://images.pokemontcg.io/wizpromos/8_hires.png",
    type: "Psychic",
    hp: "50",
    selectedVarietyId: "mew-promo",
    varieties: [
      {
        id: "mew-promo",
        name: "Promo",
        rarity: "Promo",
        image: "https://images.pokemontcg.io/wizpromos/8_hires.png",
        marketValue: 95.00,
        quantity: 1,
        dateAcquired: "2023-06-20",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Rare promotional Mew card, very special"
      }
    ]
  },
  {
    id: 20,
    name: "Lugia",
    image: "https://images.pokemontcg.io/neo4/9_hires.png",
    type: "Colorless",
    hp: "90",
    selectedVarietyId: "lugia-neo",
    varieties: [
      {
        id: "lugia-neo",
        name: "Neo Genesis Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/neo4/9_hires.png",
        marketValue: 125.00,
        quantity: 1,
        dateAcquired: "2023-07-05",
        condition: "Mint",
        personalPhotos: [],
        notes: "Legendary bird from Neo Genesis, pristine condition"
      }
    ]
  },
  {
    id: 21,
    name: "Ho-Oh",
    image: "https://images.pokemontcg.io/neo4/7_hires.png",
    type: "Fire",
    hp: "90",
    selectedVarietyId: "ho-oh-neo",
    varieties: [
      {
        id: "ho-oh-neo",
        name: "Neo Genesis Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/neo4/7_hires.png",
        marketValue: 110.00,
        quantity: 1,
        dateAcquired: "2023-07-05",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Legendary phoenix Pokemon, beautiful artwork"
      }
    ]
  },
  {
    id: 22,
    name: "Celebi",
    image: "https://images.pokemontcg.io/neo4/16_hires.png",
    type: "Grass",
    hp: "50",
    selectedVarietyId: "celebi-neo",
    varieties: [
      {
        id: "celebi-neo",
        name: "Neo Genesis Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/neo4/16_hires.png",
        marketValue: 85.00,
        quantity: 1,
        dateAcquired: "2023-08-01",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Time-traveling mythical Pokemon"
      }
    ]
  },
  {
    id: 23,
    name: "Rayquaza",
    image: "https://images.pokemontcg.io/ex6/97_hires.png",
    type: "Colorless",
    hp: "100",
    selectedVarietyId: "rayquaza-ex",
    varieties: [
      {
        id: "rayquaza-ex",
        name: "EX Series Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/ex6/97_hires.png",
        marketValue: 145.00,
        quantity: 1,
        dateAcquired: "2023-08-20",
        condition: "Mint",
        personalPhotos: [],
        notes: "Sky high legendary dragon, amazing condition"
      }
    ]
  },
  {
    id: 24,
    name: "Kyogre",
    image: "https://images.pokemontcg.io/ex3/3_hires.png",
    type: "Water",
    hp: "100",
    selectedVarietyId: "kyogre-ex",
    varieties: [
      {
        id: "kyogre-ex",
        name: "EX Series Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/ex3/3_hires.png",
        marketValue: 95.00,
        quantity: 1,
        dateAcquired: "2023-09-01",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Legendary sea Pokemon from Hoenn"
      }
    ]
  },
  {
    id: 25,
    name: "Groudon",
    image: "https://images.pokemontcg.io/ex3/4_hires.png",
    type: "Fighting",
    hp: "100",
    selectedVarietyId: "groudon-ex",
    varieties: [
      {
        id: "groudon-ex",
        name: "EX Series Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/ex3/4_hires.png",
        marketValue: 90.00,
        quantity: 1,
        dateAcquired: "2023-09-01",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Legendary ground Pokemon, pairs with Kyogre"
      }
    ]
  },
  {
    id: 26,
    name: "Dialga",
    image: "https://images.pokemontcg.io/dp1/1_hires.png",
    type: "Metal",
    hp: "90",
    selectedVarietyId: "dialga-dp",
    varieties: [
      {
        id: "dialga-dp",
        name: "Diamond & Pearl Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/dp1/1_hires.png",
        marketValue: 65.00,
        quantity: 1,
        dateAcquired: "2023-09-20",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Time legendary from Sinnoh region"
      }
    ]
  },
  {
    id: 27,
    name: "Palkia",
    image: "https://images.pokemontcg.io/dp1/11_hires.png",
    type: "Water",
    hp: "90",
    selectedVarietyId: "palkia-dp",
    varieties: [
      {
        id: "palkia-dp",
        name: "Diamond & Pearl Holo",
        rarity: "Holo Rare",
        image: "https://images.pokemontcg.io/dp1/11_hires.png",
        marketValue: 60.00,
        quantity: 1,
        dateAcquired: "2023-09-20",
        condition: "Near Mint",
        personalPhotos: [],
        notes: "Space legendary, complements Dialga perfectly"
      }
    ]
  }
];