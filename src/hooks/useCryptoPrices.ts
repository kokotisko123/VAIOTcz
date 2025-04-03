
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

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useCryptoPrices() {
  const { data, error } = useSWR<PriceData, Error>(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,vaiot&vs_currencies=usd,eur',
    fetcher,
    { refreshInterval: 10000 }
  );

  return {
    prices: data,
    isLoading: !error && !data,
    error
  };
}
