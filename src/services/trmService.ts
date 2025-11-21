import { supabase } from "@/integrations/supabase/client";

export interface TRMScreeningResult {
  address: string;
  isSanctioned: boolean;
}

export interface TRMResponse {
  results: TRMScreeningResult[];
}

export const screenAddresses = async (addresses: string[]): Promise<TRMScreeningResult[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('trm-screen', {
      body: { addresses },
    });

    if (error) {
      console.error('Error screening addresses:', error);
      throw new Error(error.message || 'Failed to screen addresses');
    }

    return data.results;
  } catch (error) {
    console.error('TRM service error:', error);
    throw error;
  }
};

export const screenSingleAddress = async (address: string): Promise<TRMScreeningResult> => {
  const results = await screenAddresses([address]);
  return results[0];
};
