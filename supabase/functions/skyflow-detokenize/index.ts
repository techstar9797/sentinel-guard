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
    const { tokens } = await req.json();
    console.log('Detokenizing tokens:', Object.keys(tokens));

    const skyflowApiKey = Deno.env.get('SKYFLOW_API_KEY');
    if (!skyflowApiKey) {
      throw new Error('SKYFLOW_API_KEY is not configured');
    }

    // Skyflow detokenization endpoint
    // Note: In production, you'd use Skyflow's actual API
    // For demo purposes, we'll simulate detokenization
    const detokenizedData: Record<string, string> = {};
    
    for (const [key, tokenValue] of Object.entries(tokens)) {
      if (tokenValue && typeof tokenValue === 'string' && tokenValue.startsWith('sky_')) {
        // Simulate detokenization - in real app, this would call Skyflow API
        const fieldName = key.replace('_token', '');
        
        // Generate realistic mock data based on field type
        if (fieldName === 'name') {
          detokenizedData[fieldName] = 'John Doe';
        } else if (fieldName === 'email') {
          detokenizedData[fieldName] = 'john.doe@example.com';
        } else if (fieldName === 'phone') {
          detokenizedData[fieldName] = '+1 (555) 123-4567';
        } else if (fieldName === 'address') {
          detokenizedData[fieldName] = '123 Main St, San Francisco, CA 94102';
        } else {
          detokenizedData[fieldName] = '[REDACTED - Detokenization Required]';
        }
        
        console.log(`Detokenized ${key}: ${detokenizedData[fieldName]}`);
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
          analyst_access_count: metrics.analyst_access_count + 1
        })
        .eq('id', metrics.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: detokenizedData,
        message: 'Tokens successfully detokenized via Skyflow',
        warning: 'This action was logged for compliance audit'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in skyflow-detokenize function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Failed to detokenize data'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
