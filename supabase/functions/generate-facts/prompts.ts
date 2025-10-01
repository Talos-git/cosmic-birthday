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
**Current Date:** ${new Date().toISOString().split('T')[0]}
${country ? `**Country: ${country}**` : ''}

${countrySpecificInstructions}

**Historical Context:**
${searchResults.historicalEvents.length > 0 ? searchResults.historicalEvents.join('\n') : 'No historical events found'}

**Pop Culture from Birth Year:**
${searchResults.popCulture.length > 0 ? searchResults.popCulture.join('\n') : 'No pop culture data found'}

**Notable People Born Same Day:**
${searchResults.notablePeople.length > 0 ? searchResults.notablePeople.join('\n') : 'No notable people found'}

🔴 ACCURACY REQUIREMENTS - READ CAREFULLY:

1. **AGE CALCULATIONS ARE CRITICAL:**
   - The person was born on ${birthdate}
   - Today's date is ${new Date().toISOString().split('T')[0]}
   - They are currently ${age.years} years, ${age.months} months, ${age.days} days old
   - CALCULATE their age at ANY historical event by subtracting their birth year from the event year
   - Example: If born October 1, 1995, and event happened in 1997, they were approximately 1-2 years old
   - Example: If born October 1, 1995, and event happened in 2005, they were approximately 9-10 years old
   - VERIFY every age calculation before including it in a fact

2. **BEFORE WRITING ANY FACT WITH AN AGE:**
   - Calculate: Event Year - Birth Year = Approximate Age
   - Adjust for months if needed (if event was before their birthday that year, subtract 1)
   - Double-check the math
   - If the calculation seems wrong, DON'T include that fact

3. **SAFER ALTERNATIVES:**
   - Instead of exact ages, use: "You were born the same year as...", "You were born just before...", "You grew up during..."
   - Use time periods: "In your childhood...", "During your teenage years...", "In your early twenties..."
   - Use relative terms: "You were already alive when...", "You weren't born yet when..."

4. **EVENT TIMING:**
   - ONLY mention events that happened AFTER ${birthdate}
   - For events before their birth, say "This happened X years before you were born"
   - For events after their birth, calculate their age accurately

Generate 8-12 fun, engaging facts categorized as follows. Return ONLY valid JSON with no markdown formatting, no code blocks, just raw JSON:

{
  "historicalEvents": [
    "${country ? `Historical events that happened IN ${country} or significantly affected ${country}. Use accurate age calculations or avoid specific ages.` : 'Engaging fact about historical events during their lifetime. Use accurate age calculations or avoid specific ages.'} (2-3 facts)"
  ],
  "popCulture": [
    "${country ? `Pop culture popular IN ${country} - local movies, music, TV shows, sports from their birth year or childhood` : 'Fun facts about music, movies, TV shows from their birth year or childhood'} (2-3 facts)"
  ],
  "technologyMilestones": [
    "${country ? `Technology milestones in ${country} - when internet, smartphones, social media arrived in ${country}. Calculate age accurately or use 'You were X years old when...'` : 'Technology products/services that are younger than them or were released during their lifetime'} (2-3 facts)"
  ],
  "celebrityBirthdays": [
    "${country ? `Celebrities FROM ${country} who share their birthday (October 1st)` : 'Interesting facts about celebrities who share their birthday'} (1-2 facts)"
  ],
  "funComparisons": [
    "${country ? `Creative comparisons using ${country} context - count actual years lived, count prime ministers accurately` : 'Creative comparisons like calculating exact days older than iPhone or other products'} (2-3 facts)"
  ]
}

🔴 CRITICAL LENGTH REQUIREMENT:
- **EVERY FACT MUST BE MAXIMUM 50 WORDS**
- Count the words before including any fact
- If a fact exceeds 50 words, rewrite it to be more concise
- Shorter is better - aim for 30-40 words when possible

Make the facts:
- Specific and personal (use "you" and "your")
- Fun and engaging (not boring history lessons)
- Accurate based on the provided data
- **MATHEMATICALLY CORRECT - verify all age calculations**
- **MAXIMUM 50 WORDS PER FACT - NO EXCEPTIONS**
- Varied in tone (some nostalgic, some surprising, some humorous)
- Include specific numbers and dates when relevant
${country ? `- EVERY SINGLE FACT MUST BE ABOUT ${country} - NO EXCEPTIONS\n- Use ${country}-specific names, places, and events\n- Reference ${country} leaders, not US or other country leaders` : ''}
- **When in doubt about age accuracy, use vaguer time references instead of specific ages**

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
