export interface SearchResults {
  historicalEvents: string[]
  popCulture: string[]
  notablePeople: string[]
}

export function buildGeminiPrompt(
  birthdate: string,
  age: { years: number; months: number; days: number },
  searchResults: SearchResults
): string {
  return `You are a fun, engaging birthday fact generator. Given someone's birthdate and current age, generate personalized, interesting facts about their life journey.

**Birthdate:** ${birthdate}
**Current Age:** ${age.years} years, ${age.months} months, ${age.days} days

**Historical Context:**
${searchResults.historicalEvents.length > 0 ? searchResults.historicalEvents.join('\n') : 'No historical events found'}

**Pop Culture from Birth Year:**
${searchResults.popCulture.length > 0 ? searchResults.popCulture.join('\n') : 'No pop culture data found'}

**Notable People Born Same Day:**
${searchResults.notablePeople.length > 0 ? searchResults.notablePeople.join('\n') : 'No notable people found'}

Generate 8-12 fun, engaging facts categorized as follows. Return ONLY valid JSON with no markdown formatting, no code blocks, just raw JSON:

{
  "historicalEvents": [
    "Engaging fact about historical events during their lifetime (2-3 facts)"
  ],
  "popCulture": [
    "Fun facts about music, movies, TV shows from their birth year or childhood (2-3 facts)"
  ],
  "technologyMilestones": [
    "Technology products/services that are younger than them, or tech milestones during their life (2-3 facts)"
  ],
  "celebrityBirthdays": [
    "Interesting facts about celebrities who share their birthday (1-2 facts)"
  ],
  "funComparisons": [
    "Creative comparisons like 'You're older than the iPhone by X days' or 'You've lived through X presidencies' (2-3 facts)"
  ]
}

Make the facts:
- Specific and personal (use "you" and "your")
- Fun and engaging (not boring history lessons)
- Accurate based on the provided data
- Varied in tone (some nostalgic, some surprising, some humorous)
- Include specific numbers and dates when relevant

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
