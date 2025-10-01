// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateFactsRequest {
  birthdate: string
  currentAge: number
  country?: string
}

interface PersonalizedFacts {
  historicalEvents: string[]
  popCulture: string[]
  technologyMilestones: string[]
  celebrityBirthdays: string[]
  funComparisons: string[]
}

function buildGeminiPrompt(
  birthdate: string,
  age: number,
  country?: string
): string {
  const date = new Date(birthdate)
  const year = date.getFullYear()
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  const countrySpecificInstructions = country
    ? `
🔴 CRITICAL REQUIREMENT: This person is from ${country}. ALL facts MUST be relevant to ${country}.

DO NOT INCLUDE:
- US Presidents, US politics, or American-centric events (unless the person is from the US)
- Events from other countries unless they had major impact on ${country}
- Celebrities not from ${country} or not well-known in ${country}
- Pop culture not popular in ${country}

REQUIRED CONTENT FOR ${country}:
- Historical events that happened in ${country} or significantly affected ${country}
- Local pop culture (music, movies, TV shows, celebrities) from their birth year
- Notable people FROM ${country} who share their birthday
- ${country} political leaders and milestones (Prime Ministers, Presidents, major elections)
- Cultural moments specific to ${country} (festivals, sports achievements, economic milestones)
- Technology adoption timeline in ${country}
- ${country}-specific nostalgic references

Example for Malaysia: Mention Petronas Twin Towers, Malaysian Prime Ministers, local musicians like Siti Nurhaliza, local movies, badminton achievements, etc.
`
    : '';

  return `You are an incredibly fun, witty, and enthusiastic birthday fact generator! Your goal is to blow people's minds with fascinating, entertaining facts about their life journey that make them say "Wow, I never thought about it that way!"

**Birthdate:** ${monthDay}, ${year}
**Current Age:** ${age} years old
${country ? `**Country: ${country}**` : ''}

${countrySpecificInstructions}

WRITING STYLE REQUIREMENTS:
- Write in an ENTHUSIASTIC, conversational tone (like a fun friend telling stories)
- Use exclamation points, phrases like "Can you believe...", "Imagine this...", "Get this..."
- Make every fact SPECIFIC with real names, dates, numbers, and details
- Add emotional color: "shocked the world", "revolutionized", "iconic", "legendary"
- Include surprising comparisons and mind-blowing statistics
- NEVER be generic or vague - always include specific details
- Make it feel personal and exciting, not like a Wikipedia article

Generate 8-12 AMAZING, DETAILED facts categorized as follows. Return ONLY valid JSON with no markdown formatting, no code blocks, just raw JSON:

{
  "historicalEvents": [
    "${country ? `Specific historical events in ${country} with names, dates, and emotional impact. Example: "You were just 3 years old when the Petronas Twin Towers became the world's tallest buildings in 1998, putting Malaysia on the global map!"` : 'Major world events during their lifetime with specific details, dates, and impact. Example: "You arrived just months after the devastating Oklahoma City bombing in April 1995, a somber event that left a lasting mark on your birth year."'} (2-3 DETAILED facts)"
  ],
  "popCulture": [
    "${country ? `Specific ${country} pop culture with artist names, song titles, TV shows, movies. Example: "When you were born, Siti Nurhaliza's Cindai was dominating Malaysian radio, and P. Ramlee films were still beloved classics being rewatched!"` : 'Specific movies, songs, artists, TV shows from their birth year. Example: "When you were a tiny tot, Toy Story, the worlds first feature-length computer-animated film, hit theaters, revolutionizing animation forever!"'} (2-3 DETAILED facts with NAMES)"
  ],
  "technologyMilestones": [
    "${country ? `When specific technologies arrived in ${country} with exact years. Example: "You were 11 years old when 4G arrived in Malaysia in 2006, and you probably remember the dial-up internet era!"` : 'Products/tech younger than them with launch dates. Example: "You are actually older than Google! The search engine that now rules our lives was founded in September 1998, nearly three years after you made your grand entrance."'} (2-3 facts with DATES)"
  ],
  "celebrityBirthdays": [
    "${country ? `Famous people FROM ${country} who share their birthday with achievements. Example: "You share your special day with Malaysian badminton legend Lee Chong Wei, born October 1st!"` : 'Famous celebrities sharing their birthday with accomplishments. Example: "You share your special day with Oscar-winning actress Brie Larson, known for her roles in Captain Marvel and Room!"'} (1-2 facts with FULL NAMES and achievements)"
  ],
  "funComparisons": [
    "${country ? `Creative ${country}-specific comparisons with numbers. Example: "You have lived through 7 Malaysian Prime Ministers: Mahathir (twice!), Abdullah Badawi, Najib Razak, Muhyiddin, Ismail Sabri, and now Anwar Ibrahim - that is quite the political journey!"` : 'Mind-blowing comparisons with exact numbers. Example: "The very first iPhone, which completely changed how we interact with the world, did not exist until you were already 11 years old!"'} (2-3 facts with SPECIFIC NUMBERS)"
  ]
}

EXAMPLES OF GREAT VS BAD FACTS:

❌ BAD (generic): "You've seen technology change"
✅ GOOD (specific): "You're older than YouTube! The video-sharing giant that now hosts billions of videos didn't launch until February 2005, when you were already 10 years old!"

❌ BAD (boring): "Historical events happened during your life"
✅ GOOD (exciting): "You were just 2 years old when Princess Diana tragically died in 1997, an event that shocked the entire world and changed the monarchy forever!"

❌ BAD (vague): "Pop culture was popular"
✅ GOOD (detailed): "Your birth year gave us 'Gangsta's Paradise' by Coolio, 'Waterfalls' by TLC, and the Spice Girls' debut - 1995 was absolutely packed with iconic tracks!"

Make EVERY SINGLE FACT as exciting and detailed as the GOOD examples above!
${country ? `\n🔴 CRITICAL: EVERY fact must be about ${country} with ${country}-specific names, places, dates, and events!` : ''}

Return ONLY the JSON object, no other text.`
}

// Gemini API integration
async function generateFactsWithGemini(
  prompt: string,
  apiKey: string
): Promise<PersonalizedFacts> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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
          temperature: 0.9,
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

const fallbackFacts = {
  historicalEvents: [
    "You've witnessed the explosive rise of the internet from dial-up modems to lightning-fast 5G, fundamentally transforming how humanity communicates!",
    "Your lifetime has seen humanity land rovers on Mars, discover thousands of exoplanets, and capture the first-ever image of a black hole in 2019 - space exploration has absolutely exploded!"
  ],
  popCulture: [
    "You grew up watching the entertainment landscape transform from VHS tapes and Blockbuster nights to Netflix, streaming wars, and binge-watching entire seasons in a weekend!",
    "Your childhood era gave us some of the most iconic pop culture moments - from boy bands and Britney Spears to the Marvel Cinematic Universe dominating the box office!"
  ],
  technologyMilestones: [
    "Smartphones didn't exist when you were young! The iPhone that changed everything didn't launch until 2007, and now you can't imagine life without it!",
    "You're older than Google, YouTube, Facebook, Twitter, Instagram, and TikTok - you literally watched the entire social media revolution unfold from the beginning!"
  ],
  celebrityBirthdays: [
    "You share your birthday with amazing people around the world who have made their mark on history!"
  ],
  funComparisons: [
    "You've lived through multiple generations of gaming - from PlayStation 1 to PS5, witnessing gaming evolve from blocky graphics to photorealistic virtual worlds!",
    "Every single day of your life is a new adventure, and you've collected thousands of memories, experiences, and moments that make your journey uniquely yours!"
  ]
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

    // Get API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    let facts: PersonalizedFacts

    // Try to generate facts with Gemini, fallback if it fails
    if (geminiApiKey) {
      try {
        // Build prompt
        const prompt = buildGeminiPrompt(
          requestData.birthdate,
          requestData.currentAge,
          requestData.country
        )

        // Generate facts with Gemini
        facts = await generateFactsWithGemini(prompt, geminiApiKey)
      } catch (error) {
        console.error('Gemini API error, using fallback:', error)
        facts = fallbackFacts
      }
    } else {
      console.log('API key not configured, using fallback facts')
      facts = fallbackFacts
    }

    return new Response(
      JSON.stringify({
        success: true,
        facts,
        birthdate: requestData.birthdate,
        age: requestData.currentAge,
        country: requestData.country
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
        facts: fallbackFacts
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
