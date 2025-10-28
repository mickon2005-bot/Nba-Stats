import NodeCache from "node-cache";

// Cache for API responses (TTL: 60 seconds for live data, 300 seconds for stats)
export const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export interface IStorage {
  // This storage is now just for caching NBA API data
  getCached<T>(key: string): T | undefined;
  setCached<T>(key: string, value: T, ttl?: number): boolean;
}

export class MemStorage implements IStorage {
  getCached<T>(key: string): T | undefined {
    return cache.get<T>(key);
  }

  setCached<T>(key: string, value: T, ttl?: number): boolean {
    return cache.set(key, value, ttl || 60);
  }
}

export const storage = new MemStorage();
