export interface PersonalizedFact {
  category: string;
  text: string;
}

export interface PersonalizedFactsResponse {
  facts: PersonalizedFact[];
  country?: string;
}

export interface Country {
  name: string;
  code: string;
}
