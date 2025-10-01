import { PersonalizedFactsResponse } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const fetchPersonalizedFacts = async (
  birthDate: Date,
  currentAge: number,
  country?: string
): Promise<PersonalizedFactsResponse> => {
  // Format date as YYYY-MM-DD to avoid timezone issues
  const year = birthDate.getFullYear();
  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const day = String(birthDate.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const body: { birthdate: string; currentAge: number; country?: string } = {
    birthdate: dateString,
    currentAge,
  };

  if (country) {
    body.country = country;
  }

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/generate-facts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch personalized facts: ${response.statusText}`);
  }

  return response.json();
};
