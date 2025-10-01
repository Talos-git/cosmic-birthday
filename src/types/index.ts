export interface PersonalizedFact {
  category: string;
  text: string;
}

export interface PersonalizedFactsResponse {
  facts: PersonalizedFact[];
}
