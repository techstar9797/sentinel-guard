import { supabase } from "@/integrations/supabase/client";

export interface MoralisWalletData {
  address: string;
  balance: string | null;
  tokens: any[];
  nfts: any[];
  error?: string;
}

export interface MoralisResponse {
  results: MoralisWalletData[];
}

export const screenWallets = async (addresses: string[]): Promise<MoralisWalletData[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('moralis-screen', {
      body: { addresses },
    });

    if (error) {
      console.error('Error screening wallets:', error);
      throw new Error(error.message || 'Failed to screen wallets');
    }

    return data.results;
  } catch (error) {
    console.error('Moralis service error:', error);
    throw error;
  }
};

export const screenSingleWallet = async (address: string): Promise<MoralisWalletData> => {
  const results = await screenWallets([address]);
  return results[0];
};
