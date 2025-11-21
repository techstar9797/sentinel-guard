import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScreeningRequest {
  addresses: string[];
}

interface ScreeningResult {
  address: string;
  isSanctioned: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const trmApiKey = Deno.env.get('TRM_API_KEY');
    
    if (!trmApiKey) {
      console.error('TRM_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'TRM API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { addresses }: ScreeningRequest = await req.json();

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: addresses array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Screening ${addresses.length} addresses with TRM Labs`);

    // Call TRM Labs API
    const trmResponse = await fetch('https://api.trmlabs.com/public/v1/sanctions/screening', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(trmApiKey + ':')}`,
      },
      body: JSON.stringify(addresses.map(address => ({ address }))),
    });

    if (!trmResponse.ok) {
      const errorText = await trmResponse.text();
      console.error(`TRM API error (${trmResponse.status}):`, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'TRM API request failed',
          status: trmResponse.status,
          details: errorText
        }),
        { 
          status: trmResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const results: ScreeningResult[] = await trmResponse.json();
    
    console.log(`Screening complete: ${results.length} results`);

    return new Response(
      JSON.stringify({ results }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in trm-screen function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
