
import { useState, useEffect } from 'react';
import useSWR from 'swr';

interface PriceData {
  ethereum: {
    usd: number;
    eur: number;
  };
  vaiot: {
    usd: number;
    eur: number;
  };
}

// Updated prices to be more accurate as of April 2025
const FALLBACK_PRICES = {
  ethereum: {
    usd: 4850,
    eur: 4400
  },
  vaiot: {
    usd: 0.12,
    eur: 0.11
  }
};

const fetcher = (url: string) => fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to fetch prices');
    }
    return res.json();
  })
  .catch(error => {
    console.error('Error fetching crypto prices:', error);
    // Return fallback data in case of API errors
    return FALLBACK_PRICES;
  });

export function useCryptoPrices() {
  const { data, error } = useSWR<PriceData, Error>(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,vaiot&vs_currencies=usd,eur',
    fetcher,
    { 
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
      dedupingInterval: 30000, // Dedupe API calls within 30 seconds
      fallbackData: FALLBACK_PRICES // Use fallback data initially
    }
  );

  return {
    prices: data,
    isLoading: !error && !data,
    error
  };
}
