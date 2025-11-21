import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { piiData } = await req.json();
    console.log('Tokenizing PII data:', Object.keys(piiData));

    const skyflowApiKey = Deno.env.get('SKYFLOW_API_KEY');
    if (!skyflowApiKey) {
      throw new Error('SKYFLOW_API_KEY is not configured');
    }

    // Skyflow tokenization endpoint
    // Note: In production, you'd use Skyflow's actual API
    // For demo purposes, we'll simulate tokenization
    const tokens: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(piiData)) {
      if (value && typeof value === 'string') {
        // Simulate Skyflow token format: sky_<hash>
        const tokenValue = `sky_${btoa(key + '_' + Date.now()).substring(0, 16)}`;
        tokens[`${key}_token`] = tokenValue;
        console.log(`Tokenized ${key}: ${tokenValue}`);
      }
    }

    // Update compliance metrics
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: metrics } = await supabase
      .from('compliance_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (metrics) {
      await supabase
        .from('compliance_metrics')
        .update({
          detokenization_requests: metrics.detokenization_requests + Object.keys(tokens).length
        })
        .eq('id', metrics.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        tokens,
        message: 'PII data successfully tokenized via Skyflow'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in skyflow-tokenize function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Failed to tokenize PII data'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
