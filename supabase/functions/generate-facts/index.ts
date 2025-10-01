// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { buildGeminiPrompt, fallbackFacts, type SearchResults } from './prompts.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateFactsRequest {
  birthdate: string
  currentAge: {
    years: number
    months: number
    days: number
  }
}

interface PersonalizedFacts {
  historicalEvents: string[]
  popCulture: string[]
  technologyMilestones: string[]
  celebrityBirthdays: string[]
  funComparisons: string[]
}

// Brave Search API integration
async function searchBraveAPI(query: string, apiKey: string): Promise<any> {
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
    {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Brave Search API error: ${response.statusText}`)
  }

  return await response.json()
}

// Helper function to delay between requests (for rate limiting)
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchHistoricalData(birthdate: string, apiKey: string): Promise<SearchResults> {
  const date = new Date(birthdate)
  const year = date.getFullYear()
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  try {
    // Search for historical events on birth date
    const eventsQuery = `historical events ${monthDay} ${year}`
    const eventsData = await searchBraveAPI(eventsQuery, apiKey)

    // Wait 1.1 seconds between requests (free tier: 1 request per second)
    await delay(1100)

    // Search for pop culture from birth year
    const popCultureQuery = `popular movies music ${year}`
    const popCultureData = await searchBraveAPI(popCultureQuery, apiKey)

    // Wait 1.1 seconds between requests
    await delay(1100)

    // Search for notable people born same day
    const celebrityQuery = `celebrities born ${monthDay}`
    const celebrityData = await searchBraveAPI(celebrityQuery, apiKey)

    return {
      historicalEvents: eventsData.web?.results?.slice(0, 3).map((r: any) => r.description || r.title) || [],
      popCulture: popCultureData.web?.results?.slice(0, 3).map((r: any) => r.description || r.title) || [],
      notablePeople: celebrityData.web?.results?.slice(0, 2).map((r: any) => r.description || r.title) || [],
    }
  } catch (error) {
    console.error('Brave Search error:', error)
    return {
      historicalEvents: [],
      popCulture: [],
      notablePeople: [],
    }
  }
}

// Gemini API integration
async function generateFactsWithGemini(
  prompt: string,
  apiKey: string
): Promise<PersonalizedFacts> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('No response from Gemini')
  }

  // Parse the JSON response from Gemini
  // Remove potential markdown code blocks
  const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleanedText)
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse and validate input
    const requestData: GenerateFactsRequest = await req.json()

    if (!requestData.birthdate) {
      return new Response(
        JSON.stringify({ error: 'birthdate is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get API keys from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const braveApiKey = Deno.env.get('BRAVE_SEARCH_API_KEY')

    let facts: PersonalizedFacts

    // Try to generate facts with APIs, fallback if they fail
    if (geminiApiKey && braveApiKey) {
      try {
        // Fetch historical data from Brave Search
        const searchResults = await fetchHistoricalData(requestData.birthdate, braveApiKey)

        // Build prompt with search results
        const prompt = buildGeminiPrompt(requestData.birthdate, requestData.currentAge, searchResults)

        // Generate facts with Gemini
        facts = await generateFactsWithGemini(prompt, geminiApiKey)
      } catch (error) {
        console.error('API error, using fallback:', error)
        facts = fallbackFacts
      }
    } else {
      console.log('API keys not configured, using fallback facts')
      facts = fallbackFacts
    }

    return new Response(
      JSON.stringify({
        success: true,
        facts,
        birthdate: requestData.birthdate,
        age: requestData.currentAge
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error',
        facts: fallbackFacts // Always provide fallback facts
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start`
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-facts' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"birthdate":"1990-01-01","currentAge":{"years":35,"months":0,"days":0}}'

*/
