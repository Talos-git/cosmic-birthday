import { PersonalizedFactsResponse } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const fetchPersonalizedFacts = async (
  birthDate: Date,
  currentAge: number
): Promise<PersonalizedFactsResponse> => {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/generate-facts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        birthdate: birthDate.toISOString(),
        currentAge,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch personalized facts: ${response.statusText}`);
  }

  return response.json();
};
