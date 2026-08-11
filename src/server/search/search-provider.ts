// server/search/search-provider.ts
export interface SearchResult {
  productId: string;
  rank: number;
}

export interface SearchProvider {
  search(query: string, limit?: number): Promise<SearchResult[]>;
}