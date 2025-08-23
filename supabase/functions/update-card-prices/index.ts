import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PokemonTCGCard {
  id: string
  name: string
  supertype: string
  subtypes: string[]
  hp: string
  types: string[]
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: any
    ptcgoCode: string
    releaseDate: string
    updatedAt: string
    images: any
  }
  number: string
  artist: string
  rarity: string
  flavorText?: string
  nationalPokedexNumbers?: number[]
  legalities: any
  images: {
    small: string
    large: string
  }
  tcgplayer?: {
    url: string
    updatedAt: string
    prices: {
      holofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      reverseHolofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      normal?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      '1stEditionHolofoil'?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      '1stEditionNormal'?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
    }
  }
}

interface PokemonTCGResponse {
  data: PokemonTCGCard[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting card price update process using Pokemon TCG API...')

    // Create initial log entry
    const { data: logEntry, error: logError } = await supabaseClient
      .from('price_update_logs')
      .insert({
        status: 'pending',
        update_timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (logError) {
      console.error('Failed to create log entry:', logError)
    }

    // Get all cards from our database that need price updates
    const { data: cards, error: cardsError } = await supabaseClient
      .from('pokemon_cards')
      .select(`
        id,
        name,
        type,
        set_name,
        card_number,
        tcg_player_id,
        card_varieties (
          id,
          name,
          rarity,
          market_value
        )
      `)

    if (cardsError) {
      throw new Error(`Failed to fetch cards: ${cardsError.message}`)
    }

    console.log(`Found ${cards?.length || 0} cards to update`)

    let updatedCount = 0
    let errorCount = 0
    const errorDetails: string[] = []

    // Process cards in batches to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < (cards?.length || 0); i += batchSize) {
      const batch = cards?.slice(i, i + batchSize) || []
      
      await Promise.all(batch.map(async (card) => {
        try {
          await updateCardPricesFromTCGAPI(card, supabaseClient)
          updatedCount++
          console.log(`Successfully updated prices for ${card.name}`)
        } catch (error) {
          console.error(`Error updating card ${card.name}:`, error)
          errorCount++
          errorDetails.push(`${card.name}: ${error.message}`)
        }
      }))

      // Add delay between batches to be respectful to the API
      if (i + batchSize < (cards?.length || 0)) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Update log entry with results
    const finalStatus = errorCount === 0 ? 'success' : (updatedCount > 0 ? 'partial_success' : 'failed')
    
    if (logEntry) {
      await supabaseClient
        .from('price_update_logs')
        .update({
          updated_cards: updatedCount,
          error_count: errorCount,
          status: finalStatus,
          error_details: errorDetails.length > 0 ? errorDetails.join('\n') : null
        })
        .eq('id', logEntry.id)
    }

    console.log(`Price update completed. Updated: ${updatedCount}, Errors: ${errorCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${updatedCount} cards with ${errorCount} errors`,
        updatedCount,
        errorCount,
        errorDetails: errorDetails.length > 0 ? errorDetails : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Price update failed:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function updateCardPricesFromTCGAPI(card: any, supabaseClient: any) {
  try {
    // Build search query for Pokemon TCG API
    let searchQuery = `name:"${card.name}"`
    
    // Add set filter if available
    if (card.set_name) {
      searchQuery += ` set.name:"${card.set_name}"`
    }
    
    // Add card number filter if available
    if (card.card_number) {
      const cardNum = card.card_number.split('/')[0] // Get just the number part
      searchQuery += ` number:${cardNum}`
    }

    console.log(`Searching for card: ${searchQuery}`)

    // Search for the card using Pokemon TCG API
    const searchUrl = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(searchQuery)}&pageSize=10`
    
    const response = await fetch(searchUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Pokemon TCG API request failed: ${response.status} ${response.statusText}`)
    }

    const data: PokemonTCGResponse = await response.json()
    
    if (!data.data || data.data.length === 0) {
      // Try a simpler search with just the card name
      const simpleSearchUrl = `https://api.pokemontcg.io/v2/cards?q=name:"${card.name}"&pageSize=5`
      const simpleResponse = await fetch(simpleSearchUrl)
      
      if (simpleResponse.ok) {
        const simpleData: PokemonTCGResponse = await simpleResponse.json()
        if (simpleData.data && simpleData.data.length > 0) {
          await processCardMatches(card, simpleData.data, supabaseClient)
          return
        }
      }
      
      console.log(`No matches found for ${card.name}`)
      return
    }

    await processCardMatches(card, data.data, supabaseClient)

  } catch (error) {
    console.error(`Error updating prices for ${card.name}:`, error)
    throw error
  }
}

async function processCardMatches(card: any, tcgCards: PokemonTCGCard[], supabaseClient: any) {
  // Find the best match for our card
  let bestMatch: PokemonTCGCard | null = null
  
  // Prefer exact name and set matches
  for (const tcgCard of tcgCards) {
    if (tcgCard.name.toLowerCase() === card.name.toLowerCase()) {
      if (card.set_name && tcgCard.set.name.toLowerCase().includes(card.set_name.toLowerCase())) {
        bestMatch = tcgCard
        break
      } else if (!bestMatch) {
        bestMatch = tcgCard
      }
    }
  }
  
  // If no exact name match, use the first result
  if (!bestMatch && tcgCards.length > 0) {
    bestMatch = tcgCards[0]
  }
  
  if (!bestMatch) {
    throw new Error('No suitable card match found')
  }

  console.log(`Found match: ${bestMatch.name} from ${bestMatch.set.name}`)

  // Update the Pokemon card with TCG API ID if not already set
  if (!card.tcg_player_id) {
    await supabaseClient
      .from('pokemon_cards')
      .update({ 
        tcg_player_id: bestMatch.id,
        image_url: bestMatch.images.large
      })
      .eq('id', card.id)
  }

  // Update card varieties with pricing information
  if (card.card_varieties && card.card_varieties.length > 0 && bestMatch.tcgplayer?.prices) {
    for (const variety of card.card_varieties) {
      await updateVarietyPrice(variety, bestMatch, supabaseClient)
    }
  }
}

async function updateVarietyPrice(variety: any, tcgCard: PokemonTCGCard, supabaseClient: any) {
  if (!tcgCard.tcgplayer?.prices) {
    console.log(`No pricing data available for ${tcgCard.name}`)
    return
  }

  const prices = tcgCard.tcgplayer.prices
  let marketPrice: number | null = null

  // Determine which price to use based on rarity and variety name
  const rarityLower = variety.rarity.toLowerCase()
  const varietyNameLower = variety.name.toLowerCase()

  if (varietyNameLower.includes('1st edition') && varietyNameLower.includes('holo')) {
    marketPrice = prices['1stEditionHolofoil']?.market
  } else if (varietyNameLower.includes('1st edition')) {
    marketPrice = prices['1stEditionNormal']?.market
  } else if (rarityLower.includes('holo') || varietyNameLower.includes('holo')) {
    marketPrice = prices.holofoil?.market
  } else if (prices.reverseHolofoil && varietyNameLower.includes('reverse')) {
    marketPrice = prices.reverseHolofoil.market
  } else if (prices.normal) {
    marketPrice = prices.normal.market
  } else {
    // Use the first available price
    const availablePrices = Object.values(prices)
    if (availablePrices.length > 0) {
      marketPrice = availablePrices[0].market
    }
  }

  if (marketPrice && marketPrice > 0) {
    const { error } = await supabaseClient
      .from('card_varieties')
      .update({ 
        market_value: marketPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', variety.id)

    if (error) {
      console.error(`Failed to update price for variety ${variety.name}:`, error)
      throw error
    } else {
      console.log(`Updated price for ${variety.name}: $${marketPrice}`)
    }
  } else {
    console.log(`No suitable price found for variety ${variety.name}`)
  }
}