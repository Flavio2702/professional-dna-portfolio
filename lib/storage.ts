import { ProfessionalDNA } from '@/types/portfolio';

const STORAGE_KEY = 'dna-portfolios';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

interface PortfolioStorage {
  [id: string]: ProfessionalDNA;
}

/**
 * Get all portfolios from localStorage
 */
function getStorage(): PortfolioStorage {
  if (!isBrowser) return {};

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data) as PortfolioStorage;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
}

/**
 * Save portfolios to localStorage
 */
function setStorage(data: PortfolioStorage): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * Save a portfolio to localStorage
 */
export function savePortfolio(id: string, data: ProfessionalDNA): void {
  const storage = getStorage();

  // Update lastUpdated timestamp
  const updatedData: ProfessionalDNA = {
    ...data,
    metadata: {
      ...data.metadata,
      lastUpdated: new Date().toISOString(),
    },
  };

  storage[id] = updatedData;
  setStorage(storage);
}

/**
 * Get a portfolio by ID from localStorage
 */
export function getPortfolio(id: string): ProfessionalDNA | null {
  const storage = getStorage();
  return storage[id] || null;
}

/**
 * Get all portfolios from localStorage
 */
export function getAllPortfolios(): ProfessionalDNA[] {
  const storage = getStorage();
  return Object.values(storage);
}

/**
 * Delete a portfolio by ID from localStorage
 */
export function deletePortfolio(id: string): void {
  const storage = getStorage();
  delete storage[id];
  setStorage(storage);
}
