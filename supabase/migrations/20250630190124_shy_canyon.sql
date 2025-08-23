/*
  # Seed Pokemon Cards Database

  1. Sample Pokemon Cards
    - Popular cards from various sets
    - Multiple varieties per card
    - Realistic market values

  2. Card Varieties
    - Different rarities and special editions
    - Market values based on real TCG prices
*/

-- Insert sample Pokemon cards
INSERT INTO pokemon_cards (name, type, hp, set_name, card_number, image_url) VALUES
  ('Charizard', 'Fire', '120', 'Base Set', '4/102', 'https://images.pokemontcg.io/base1/4_hires.png'),
  ('Pikachu', 'Electric', '60', 'Base Set', '58/102', 'https://images.pokemontcg.io/base1/58_hires.png'),
  ('Blastoise', 'Water', '100', 'Base Set', '2/102', 'https://images.pokemontcg.io/base1/2_hires.png'),
  ('Venusaur', 'Grass', '100', 'Base Set', '15/102', 'https://images.pokemontcg.io/base1/15_hires.png'),
  ('Mewtwo', 'Psychic', '60', 'Base Set', '10/102', 'https://images.pokemontcg.io/base1/10_hires.png'),
  ('Alakazam', 'Psychic', '80', 'Base Set', '1/102', 'https://images.pokemontcg.io/base1/1_hires.png'),
  ('Machamp', 'Fighting', '100', 'Base Set', '8/102', 'https://images.pokemontcg.io/base1/8_hires.png'),
  ('Gengar', 'Psychic', '60', 'Fossil', '5/62', 'https://images.pokemontcg.io/fossil/5_hires.png'),
  ('Dragonite', 'Colorless', '100', 'Fossil', '4/62', 'https://images.pokemontcg.io/fossil/4_hires.png'),
  ('Lugia', 'Colorless', '90', 'Neo Genesis', '9/111', 'https://images.pokemontcg.io/neo4/9_hires.png'),
  ('Ho-Oh', 'Fire', '90', 'Neo Genesis', '7/111', 'https://images.pokemontcg.io/neo4/7_hires.png'),
  ('Celebi', 'Grass', '50', 'Neo Genesis', '16/111', 'https://images.pokemontcg.io/neo4/16_hires.png'),
  ('Rayquaza', 'Colorless', '100', 'EX Deoxys', '97/107', 'https://images.pokemontcg.io/ex6/97_hires.png'),
  ('Kyogre', 'Water', '100', 'EX Ruby & Sapphire', '3/109', 'https://images.pokemontcg.io/ex3/3_hires.png'),
  ('Groudon', 'Fighting', '100', 'EX Ruby & Sapphire', '4/109', 'https://images.pokemontcg.io/ex3/4_hires.png'),
  ('Dialga', 'Metal', '90', 'Diamond & Pearl', '1/130', 'https://images.pokemontcg.io/dp1/1_hires.png'),
  ('Palkia', 'Water', '90', 'Diamond & Pearl', '11/130', 'https://images.pokemontcg.io/dp1/11_hires.png'),
  ('Eevee', 'Normal', '50', 'Cosmic Eclipse', '166/236', 'https://images.pokemontcg.io/sm12/166_hires.png'),
  ('Gardevoir ex', 'Psychic', '310', 'Paldea Evolved', '86/193', 'https://images.pokemontcg.io/sv4/86_hires.png'),
  ('Mimikyu', 'Psychic', '70', 'Hidden Fates', '58/68', 'https://images.pokemontcg.io/sm75/58_hires.png'),
  ('Plusle', 'Electric', '70', 'Vivid Voltage', '43/185', 'https://images.pokemontcg.io/swsh4/43_hires.png'),
  ('Minun', 'Electric', '70', 'Vivid Voltage', '44/185', 'https://images.pokemontcg.io/swsh4/44_hires.png'),
  ('Lechonk', 'Normal', '60', 'Scarlet & Violet', '156/198', 'https://images.pokemontcg.io/sv1/156_hires.png'),
  ('Riolu', 'Fighting', '70', 'Legends Awakened', '101/146', 'https://images.pokemontcg.io/dp6/101_hires.png'),
  ('Ralts', 'Psychic', '70', 'Paldea Evolved', '142/193', 'https://images.pokemontcg.io/sv4/142_hires.png'),
  ('Kirlia', 'Psychic', '90', 'Sword & Shield', '60/202', 'https://images.pokemontcg.io/swsh1/60_hires.png'),
  ('Mew', 'Psychic', '50', 'Wizards Promo', '8', 'https://images.pokemontcg.io/wizpromos/8_hires.png');

-- Insert card varieties with different rarities and market values
INSERT INTO card_varieties (card_id, name, rarity, image_url, market_value) VALUES
  -- Charizard varieties
  (1, 'Base Set Holo', 'Holo Rare', 'https://images.pokemontcg.io/base1/4_hires.png', 350.00),
  (1, 'Base Set Shadowless', 'Holo Rare', 'https://images.pokemontcg.io/base1/4_hires.png', 1200.00),
  (1, 'Base Set 1st Edition', 'Holo Rare', 'https://images.pokemontcg.io/base1/4_hires.png', 5000.00),
  
  -- Pikachu varieties
  (2, 'Base Set Common', 'Common', 'https://images.pokemontcg.io/base1/58_hires.png', 8.00),
  (2, 'Base Set Shadowless', 'Common', 'https://images.pokemontcg.io/base1/58_hires.png', 25.00),
  (2, 'Base Set 1st Edition', 'Common', 'https://images.pokemontcg.io/base1/58_hires.png', 150.00),
  
  -- Blastoise varieties
  (3, 'Base Set Holo', 'Holo Rare', 'https://images.pokemontcg.io/base1/2_hires.png', 120.00),
  (3, 'Base Set Shadowless', 'Holo Rare', 'https://images.pokemontcg.io/base1/2_hires.png', 400.00),
  
  -- Venusaur varieties
  (4, 'Base Set Holo', 'Holo Rare', 'https://images.pokemontcg.io/base1/15_hires.png', 85.00),
  (4, 'Base Set Shadowless', 'Holo Rare', 'https://images.pokemontcg.io/base1/15_hires.png', 300.00),
  
  -- Mewtwo varieties
  (5, 'Base Set Holo', 'Holo Rare', 'https://images.pokemontcg.io/base1/10_hires.png', 75.00),
  (5, 'Base Set Shadowless', 'Holo Rare', 'https://images.pokemontcg.io/base1/10_hires.png', 250.00),
  
  -- Other cards with single varieties for now
  (6, 'Base Set Holo', 'Holo Rare', 'https://images.pokemontcg.io/base1/1_hires.png', 45.00),
  (7, 'Base Set Holo', 'Holo Rare', 'https://images.pokemontcg.io/base1/8_hires.png', 35.00),
  (8, 'Fossil Holo', 'Holo Rare', 'https://images.pokemontcg.io/fossil/5_hires.png', 55.00),
  (9, 'Fossil Holo', 'Holo Rare', 'https://images.pokemontcg.io/fossil/4_hires.png', 65.00),
  (10, 'Neo Genesis Holo', 'Holo Rare', 'https://images.pokemontcg.io/neo4/9_hires.png', 125.00),
  (11, 'Neo Genesis Holo', 'Holo Rare', 'https://images.pokemontcg.io/neo4/7_hires.png', 110.00),
  (12, 'Neo Genesis Holo', 'Holo Rare', 'https://images.pokemontcg.io/neo4/16_hires.png', 85.00),
  (13, 'EX Series Holo', 'Holo Rare', 'https://images.pokemontcg.io/ex6/97_hires.png', 145.00),
  (14, 'EX Series Holo', 'Holo Rare', 'https://images.pokemontcg.io/ex3/3_hires.png', 95.00),
  (15, 'EX Series Holo', 'Holo Rare', 'https://images.pokemontcg.io/ex3/4_hires.png', 90.00),
  (16, 'Diamond & Pearl Holo', 'Holo Rare', 'https://images.pokemontcg.io/dp1/1_hires.png', 65.00),
  (17, 'Diamond & Pearl Holo', 'Holo Rare', 'https://images.pokemontcg.io/dp1/11_hires.png', 60.00),
  
  -- Modern cards
  (18, 'Common', 'Common', 'https://images.pokemontcg.io/sm12/166_hires.png', 0.50),
  (18, 'Promo', 'Promo', 'https://images.pokemontcg.io/sm12/166_hires.png', 3.25),
  (18, 'Shiny Rare', 'Shiny Rare', 'https://images.pokemontcg.io/sm12/166_hires.png', 12.00),
  
  (19, 'Ultra Rare ex', 'Ultra Rare', 'https://images.pokemontcg.io/sv4/86_hires.png', 25.00),
  (19, 'Special Art Rare', 'Special Art Rare', 'https://images.pokemontcg.io/sv4/86_hires.png', 45.00),
  
  (20, 'Rare', 'Rare', 'https://images.pokemontcg.io/sm75/58_hires.png', 1.75),
  (20, 'Special Art Rare', 'Special Art Rare', 'https://images.pokemontcg.io/sm75/58_hires.png', 15.00),
  
  (21, 'Common', 'Common', 'https://images.pokemontcg.io/swsh4/43_hires.png', 0.25),
  (21, 'Holo Rare', 'Holo Rare', 'https://images.pokemontcg.io/swsh4/43_hires.png', 2.50),
  
  (22, 'Common', 'Common', 'https://images.pokemontcg.io/swsh4/44_hires.png', 0.25),
  (23, 'Common', 'Common', 'https://images.pokemontcg.io/sv1/156_hires.png', 0.15),
  (24, 'Common', 'Common', 'https://images.pokemontcg.io/dp6/101_hires.png', 0.30),
  (25, 'Common', 'Common', 'https://images.pokemontcg.io/sv4/142_hires.png', 0.20),
  (26, 'Uncommon', 'Uncommon', 'https://images.pokemontcg.io/swsh1/60_hires.png', 0.75),
  (27, 'Promo', 'Promo', 'https://images.pokemontcg.io/wizpromos/8_hires.png', 95.00);