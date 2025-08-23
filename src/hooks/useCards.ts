import { useState, useEffect } from 'react';
import { supabase, CardWithVarieties, UserCardWithDetails } from '../lib/supabase';
import { PokemonCard, CardVariety } from '../types/pokemon';
import { sampleCards } from '../data/pokemonCards';

export function useCards(userId?: string, isDemoMode?: boolean) {
  const [userCards, setUserCards] = useState<PokemonCard[]>([]);
  const [allCards, setAllCards] = useState<CardWithVarieties[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available cards for searching/scanning
  const fetchAllCards = async () => {
    console.log('Fetching all cards, demo mode:', isDemoMode);
    
    if (isDemoMode) {
      // Use sample cards for demo mode
      const demoAllCards = sampleCards.map(card => ({
        id: card.id,
        name: card.name,
        type: card.type,
        hp: card.hp,
        set_name: card.varieties[0]?.rarity || 'Demo Set',
        card_number: `${card.id}/100`,
        image_url: card.image,
        tcg_player_id: null,
        created_at: '2023-01-01T00:00:00Z',
        varieties: card.varieties.map((variety, index) => ({
          id: parseInt(variety.id.replace(/\D/g, '')) || index + 1,
          card_id: card.id,
          name: variety.name,
          rarity: variety.rarity,
          image_url: variety.image,
          market_value: variety.marketValue,
          tcg_player_variety_id: null,
          created_at: '2023-01-01T00:00:00Z'
        }))
      }));
      console.log('Demo all cards loaded:', demoAllCards.length);
      setAllCards(demoAllCards);
      return;
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      // Use sample cards as fallback
      const demoAllCards = sampleCards.map(card => ({
        id: card.id,
        name: card.name,
        type: card.type,
        hp: card.hp,
        set_name: card.varieties[0]?.rarity || 'Demo Set',
        card_number: `${card.id}/100`,
        image_url: card.image,
        tcg_player_id: null,
        created_at: '2023-01-01T00:00:00Z',
        varieties: card.varieties.map((variety, index) => ({
          id: parseInt(variety.id.replace(/\D/g, '')) || index + 1,
          card_id: card.id,
          name: variety.name,
          rarity: variety.rarity,
          image_url: variety.image,
          market_value: variety.marketValue,
          tcg_player_variety_id: null,
          created_at: '2023-01-01T00:00:00Z'
        }))
      }));
      setAllCards(demoAllCards);
      return;
    }

    try {
      const { data: cards, error: cardsError } = await supabase
        .from('pokemon_cards')
        .select(`
          *,
          varieties:card_varieties(*)
        `);

      if (cardsError) throw cardsError;

      setAllCards(cards || []);
    } catch (err) {
      console.error('Error fetching all cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    }
  };

  // Fetch user's card collection
  const fetchUserCards = async () => {
    console.log('Fetching user cards, userId:', userId, 'demo mode:', isDemoMode);
    
    if (!userId) {
      setUserCards([]);
      setLoading(false);
      return;
    }

    if (isDemoMode) {
      // Use sample cards for demo mode
      console.log('Loading demo cards:', sampleCards.length);
      setUserCards(sampleCards);
      setLoading(false);
      return;
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      // Use sample cards as fallback
      console.log('No Supabase config, using sample cards');
      setUserCards(sampleCards);
      setLoading(false);
      return;
    }

    try {
      const { data: userCardsData, error: userCardsError } = await supabase
        .from('user_cards')
        .select(`
          *,
          pokemon_card:pokemon_cards(*),
          card_variety:card_varieties(*),
          card_photos(*)
        `)
        .eq('user_id', userId);

      if (userCardsError) throw userCardsError;

      // Transform database format to frontend format
      const transformedCards = transformUserCardsToFrontend(userCardsData || []);
      setUserCards(transformedCards);
    } catch (err) {
      console.error('Error fetching user cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user cards');
    } finally {
      setLoading(false);
    }
  };

  // Transform database format to frontend PokemonCard format
  const transformUserCardsToFrontend = (dbCards: UserCardWithDetails[]): PokemonCard[] => {
    const cardMap = new Map<number, PokemonCard>();

    dbCards.forEach((dbCard) => {
      const cardId = dbCard.pokemon_card.id;
      
      if (!cardMap.has(cardId)) {
        // Create new PokemonCard
        cardMap.set(cardId, {
          id: cardId,
          name: dbCard.pokemon_card.name,
          image: dbCard.card_variety.image_url,
          type: dbCard.pokemon_card.type,
          hp: dbCard.pokemon_card.hp,
          selectedVarietyId: `${dbCard.variety_id}`,
          varieties: []
        });
      }

      const card = cardMap.get(cardId)!;
      
      // Add variety to the card
      const variety: CardVariety = {
        id: `${dbCard.variety_id}`,
        name: dbCard.card_variety.name,
        rarity: dbCard.card_variety.rarity,
        image: dbCard.card_variety.image_url,
        marketValue: Number(dbCard.card_variety.market_value),
        quantity: dbCard.quantity,
        dateAcquired: dbCard.date_acquired,
        condition: dbCard.condition as CardVariety['condition'],
        personalPhotos: dbCard.card_photos.map(photo => photo.photo_url),
        notes: dbCard.notes
      };

      card.varieties.push(variety);
    });

    return Array.from(cardMap.values());
  };

  // Add a card to user's collection
  const addCardToCollection = async (cardId: number, varietyId: number, cardDetails: {
    quantity: number;
    condition: string;
    dateAcquired: string;
    notes: string;
  }) => {
    if (!userId) throw new Error('User not logged in');

    if (isDemoMode) {
      console.log('Adding card to demo collection:', cardId, varietyId);
      // For demo mode, just add to local state
      const cardToAdd = allCards.find(card => card.id === cardId);
      const varietyToAdd = cardToAdd?.varieties.find(v => v.id === varietyId);
      
      if (cardToAdd && varietyToAdd) {
        const newCard: PokemonCard = {
          id: cardToAdd.id,
          name: cardToAdd.name,
          image: varietyToAdd.image_url,
          type: cardToAdd.type,
          hp: cardToAdd.hp,
          selectedVarietyId: `${varietyId}`,
          varieties: [{
            id: `${varietyId}`,
            name: varietyToAdd.name,
            rarity: varietyToAdd.rarity,
            image: varietyToAdd.image_url,
            marketValue: varietyToAdd.market_value,
            quantity: cardDetails.quantity,
            dateAcquired: cardDetails.dateAcquired,
            condition: cardDetails.condition as CardVariety['condition'],
            personalPhotos: [],
            notes: cardDetails.notes
          }]
        };
        
        setUserCards(prev => [...prev, newCard]);
        console.log('Card added to demo collection');
      }
      return;
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Database service not configured');
    }

    // Map frontend field names to database column names
    const dbCardDetails = {
      user_id: userId,
      card_id: cardId,
      variety_id: varietyId,
      quantity: cardDetails.quantity,
      condition: cardDetails.condition,
      date_acquired: cardDetails.dateAcquired, // Map dateAcquired to date_acquired
      notes: cardDetails.notes
    };

    const { data, error } = await supabase
      .from('user_cards')
      .insert(dbCardDetails)
      .select(`
        *,
        pokemon_card:pokemon_cards(*),
        card_variety:card_varieties(*),
        card_photos(*)
      `)
      .single();

    if (error) throw error;

    // Refresh user cards
    await fetchUserCards();
    return data;
  };

  // Update a card in user's collection
  const updateUserCard = async (userCardId: number, updates: Partial<{
    quantity: number;
    condition: string;
    dateAcquired: string;
    notes: string;
  }>) => {
    if (isDemoMode) {
      // For demo mode, update local state
      setUserCards(prev => prev.map(card => ({
        ...card,
        varieties: card.varieties.map(variety => ({
          ...variety,
          ...updates
        }))
      })));
      return;
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Database service not configured');
    }

    // Map frontend field names to database column names
    const dbUpdates: any = {};
    if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
    if (updates.condition !== undefined) dbUpdates.condition = updates.condition;
    if (updates.dateAcquired !== undefined) dbUpdates.date_acquired = updates.dateAcquired; // Map dateAcquired to date_acquired
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('user_cards')
      .update(dbUpdates)
      .eq('id', userCardId)
      .select(`
        *,
        pokemon_card:pokemon_cards(*),
        card_variety:card_varieties(*),
        card_photos(*)
      `)
      .single();

    if (error) throw error;

    // Refresh user cards
    await fetchUserCards();
    return data;
  };

  // Add photo to a user's card
  const addCardPhoto = async (userCardId: number, photoUrl: string) => {
    if (isDemoMode) {
      // For demo mode, update local state
      setUserCards(prev => prev.map(card => ({
        ...card,
        varieties: card.varieties.map(variety => ({
          ...variety,
          personalPhotos: [...variety.personalPhotos, photoUrl]
        }))
      })));
      return;
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Database service not configured');
    }

    const { data, error } = await supabase
      .from('card_photos')
      .insert({
        user_card_id: userCardId,
        photo_url: photoUrl
      })
      .select()
      .single();

    if (error) throw error;

    // Refresh user cards
    await fetchUserCards();
    return data;
  };

  // Remove photo from a user's card
  const removeCardPhoto = async (photoId: number) => {
    if (isDemoMode) {
      // For demo mode, this would need more complex logic
      // For now, just refresh
      return;
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Database service not configured');
    }

    const { error } = await supabase
      .from('card_photos')
      .delete()
      .eq('id', photoId);

    if (error) throw error;

    // Refresh user cards
    await fetchUserCards();
  };

  // Search cards in the database
  const searchCards = (query: string): CardWithVarieties[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return allCards.filter(card =>
      card.name.toLowerCase().includes(searchTerm) ||
      card.set_name.toLowerCase().includes(searchTerm) ||
      card.type.toLowerCase().includes(searchTerm)
    );
  };

  // Effect to fetch all cards when demo mode changes
  useEffect(() => {
    console.log('useCards effect triggered for all cards, isDemoMode:', isDemoMode);
    fetchAllCards();
  }, [isDemoMode]); // Add isDemoMode as dependency

  // Effect to fetch user cards when userId or demo mode changes
  useEffect(() => {
    console.log('useCards effect triggered for user cards, userId:', userId, 'isDemoMode:', isDemoMode);
    fetchUserCards();
  }, [userId, isDemoMode]); // Add isDemoMode as dependency

  return {
    userCards,
    allCards,
    loading,
    error,
    addCardToCollection,
    updateUserCard,
    addCardPhoto,
    removeCardPhoto,
    searchCards,
    refreshUserCards: fetchUserCards,
    refreshAllCards: fetchAllCards
  };
}