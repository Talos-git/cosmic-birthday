export interface SearchResults {
  historicalEvents: string[]
  popCulture: string[]
  notablePeople: string[]
}

export function buildGeminiPrompt(
  birthdate: string,
  age: { years: number; months: number; days: number },
  searchResults: SearchResults,
  country?: string
): string {
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
- Malaysian/Local pop culture (music, movies, TV shows, celebrities) from their birth year
- Notable people FROM ${country} who share their birthday
- ${country} political leaders and milestones (Prime Ministers, major elections, independence events)
- Cultural moments specific to ${country} (festivals, sports achievements, economic milestones)
- Technology adoption timeline in ${country}
- ${country}-specific nostalgic references

Example for Malaysia: Mention Petronas Twin Towers, Malaysian Prime Ministers, local musicians like Siti Nurhaliza, local movies, badminton achievements, etc.
`
    : '';

  return `You are a fun, engaging birthday fact generator. Given someone's birthdate and current age, generate personalized, interesting facts about their life journey.

**Birthdate:** ${birthdate}
**Current Age:** ${age.years} years, ${age.months} months, ${age.days} days
${country ? `**Country: ${country}**` : ''}

${countrySpecificInstructions}

**Historical Context:**
${searchResults.historicalEvents.length > 0 ? searchResults.historicalEvents.join('\n') : 'No historical events found'}

**Pop Culture from Birth Year:**
${searchResults.popCulture.length > 0 ? searchResults.popCulture.join('\n') : 'No pop culture data found'}

**Notable People Born Same Day:**
${searchResults.notablePeople.length > 0 ? searchResults.notablePeople.join('\n') : 'No notable people found'}

Generate 8-12 fun, engaging facts categorized as follows. Return ONLY valid JSON with no markdown formatting, no code blocks, just raw JSON:

{
  "historicalEvents": [
    "${country ? `Historical events that happened IN ${country} or significantly affected ${country}` : 'Engaging fact about historical events during their lifetime'} (2-3 facts)"
  ],
  "popCulture": [
    "${country ? `Pop culture popular IN ${country} - local movies, music, TV shows, sports from their birth year or childhood` : 'Fun facts about music, movies, TV shows from their birth year or childhood'} (2-3 facts)"
  ],
  "technologyMilestones": [
    "${country ? `Technology milestones in ${country} - when internet, smartphones, social media arrived in ${country}` : 'Technology products/services that are younger than them'} (2-3 facts)"
  ],
  "celebrityBirthdays": [
    "${country ? `Celebrities FROM ${country} who share their birthday` : 'Interesting facts about celebrities who share their birthday'} (1-2 facts)"
  ],
  "funComparisons": [
    "${country ? `Creative comparisons using ${country} context - 'You've lived through X ${country} Prime Ministers' or '${country}-specific events'` : 'Creative comparisons like You are older than the iPhone by X days'} (2-3 facts)"
  ]
}

Make the facts:
- Specific and personal (use "you" and "your")
- Fun and engaging (not boring history lessons)
- Accurate based on the provided data
- Varied in tone (some nostalgic, some surprising, some humorous)
- Include specific numbers and dates when relevant
${country ? `- EVERY SINGLE FACT MUST BE ABOUT ${country} - NO EXCEPTIONS\n- Use ${country}-specific names, places, and events\n- Reference ${country} leaders, not US or other country leaders` : ''}

Return ONLY the JSON object, no other text.`
}

export const fallbackFacts = {
  historicalEvents: [
    "You've witnessed the rise of the internet age and social media revolution",
    "Your lifetime has seen incredible advances in space exploration"
  ],
  popCulture: [
    "You grew up in an era of amazing technological and cultural change",
    "The entertainment landscape has transformed dramatically since you were born"
  ],
  technologyMilestones: [
    "Smartphones didn't exist when you were born, but now they're everywhere",
    "You've lived through the digital revolution"
  ],
  celebrityBirthdays: [
    "You share your birthday with amazing people around the world"
  ],
  funComparisons: [
    "You've experienced more sunrises than you might realize",
    "Every day you're creating new memories and milestones"
  ]
}
