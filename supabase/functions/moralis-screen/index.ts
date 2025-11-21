import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { addresses } = await req.json();
    
    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid addresses array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const moralisApiKey = Deno.env.get('MORALIS_API_KEY');
    if (!moralisApiKey) {
      console.error('MORALIS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Moralis API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Screening ${addresses.length} addresses with Moralis API`);

    // Fetch wallet data for each address
    const results = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          // Get wallet balance and token info
          const balanceResponse = await fetch(
            `https://deep-index.moralis.io/api/v2.2/${address}/balance?chain=eth`,
            {
              headers: {
                'X-API-Key': moralisApiKey,
                'accept': 'application/json',
              },
            }
          );

          if (!balanceResponse.ok) {
            console.error(`Failed to fetch balance for ${address}:`, await balanceResponse.text());
            return {
              address,
              balance: null,
              tokens: [],
              nfts: [],
              error: 'Failed to fetch wallet data',
            };
          }

          const balanceData = await balanceResponse.json();

          // Get ERC20 tokens
          const tokensResponse = await fetch(
            `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=eth`,
            {
              headers: {
                'X-API-Key': moralisApiKey,
                'accept': 'application/json',
              },
            }
          );

          const tokensData = tokensResponse.ok ? await tokensResponse.json() : [];

          // Get NFTs
          const nftsResponse = await fetch(
            `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=eth&format=decimal`,
            {
              headers: {
                'X-API-Key': moralisApiKey,
                'accept': 'application/json',
              },
            }
          );

          const nftsData = nftsResponse.ok ? await nftsResponse.json() : { result: [] };

          return {
            address,
            balance: balanceData.balance,
            tokens: tokensData,
            nfts: nftsData.result || [],
          };
        } catch (error) {
          console.error(`Error screening address ${address}:`, error);
          return {
            address,
            balance: null,
            tokens: [],
            nfts: [],
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    console.log('Screening complete:', results.length, 'results');

    return new Response(
      JSON.stringify({ results }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in moralis-screen function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
