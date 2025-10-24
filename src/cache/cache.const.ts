// Add cache keys here for centralized cache key management
export const CACHE_KEYS = {
  IDEMPOTENT_KEY: (key: string) => `idempotent:${key}`,
};

// Add cache Default TTL here for centralized cache key management
// Note: TTL values are in milliseconds for cache-manager version > 4
export const TTL = {
  IDEMPOTENT: 120000, // 2 minutes in milliseconds (120000ms = 2min)
};
