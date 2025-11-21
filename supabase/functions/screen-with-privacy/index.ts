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
    const { walletAddress, piiData, usePrivacy = true } = await req.json();
    console.log('Screening wallet with privacy:', { walletAddress, usePrivacy });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let tokens: Record<string, string> = {};
    
    // Step 1: Tokenize PII if privacy is enabled
    if (usePrivacy && piiData) {
      const tokenizeResponse = await supabase.functions.invoke('skyflow-tokenize', {
        body: { piiData }
      });

      if (tokenizeResponse.error) {
        throw new Error(`Tokenization failed: ${tokenizeResponse.error.message}`);
      }

      tokens = tokenizeResponse.data.tokens;
      console.log('PII tokenized successfully');
    }

    // Step 2: Screen wallet with TRM directly
    const trmApiKey = Deno.env.get('TRM_API_KEY');
    if (!trmApiKey) {
      throw new Error('TRM_API_KEY is not configured');
    }

    const trmResponse = await fetch(`https://api.trmlabs.com/public/v2/screening/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(trmApiKey + ':')}`
      },
      body: JSON.stringify([{ address: walletAddress, chain: 'ethereum' }])
    });

    if (!trmResponse.ok) {
      const errorText = await trmResponse.text();
      console.error('TRM API error:', errorText);
      throw new Error(`TRM API request failed: ${trmResponse.status}`);
    }

    const trmResults = await trmResponse.json();
    console.log('TRM screening response:', trmResults);

    // Extract risk data from TRM response
    const firstResult = trmResults[0] || {};
    const riskScore = firstResult.risk || 0.5;
    const riskLevel = riskScore >= 0.9 ? 'high' : riskScore >= 0.7 ? 'medium' : 'low';
    
    const trmData = {
      riskScore,
      riskLevel,
      evidence: firstResult
    };
    
    console.log('TRM screening completed:', { riskScore: trmData.riskScore });

    // Step 3: Create case with tokenized data
    const caseNumber = `CASE-${Date.now()}`;
    
    const caseData: any = {
      case_number: caseNumber,
      wallet_address: walletAddress,
      trm_risk_score: trmData.riskScore,
      trm_risk_level: trmData.riskLevel,
      trm_evidence: trmData.evidence || {},
      status: 'pending',
      decision: trmData.riskScore >= 0.9 ? 'blocked' : trmData.riskScore >= 0.7 ? 'review' : 'approved',
      priority: trmData.riskScore >= 0.9 ? 'high' : trmData.riskScore >= 0.7 ? 'medium' : 'low',
    };

    if (usePrivacy) {
      // Store tokens instead of raw PII
      caseData.name_token = tokens['name_token'];
      caseData.email_token = tokens['email_token'];
      caseData.address_token = tokens['address_token'];
      caseData.phone_token = tokens['phone_token'];
    }

    const { data: newCase, error: caseError } = await supabase
      .from('cases')
      .insert(caseData)
      .select()
      .single();

    if (caseError) {
      throw new Error(`Failed to create case: ${caseError.message}`);
    }

    console.log('Case created successfully:', newCase.case_number);

    // Create demo comparison entry
    await supabase
      .from('demo_comparison')
      .insert({
        scenario_name: `Demo: ${caseNumber}`,
        // Without Skyflow (raw PII)
        raw_name: piiData?.name || 'John Doe',
        raw_email: piiData?.email || 'john.doe@example.com',
        raw_address: piiData?.address || '123 Main St',
        raw_phone: piiData?.phone || '+1-555-1234',
        // With Skyflow (tokenized)
        tokenized_name: tokens['name_token'] || null,
        tokenized_email: tokens['email_token'] || null,
        tokenized_address: tokens['address_token'] || null,
        tokenized_phone: tokens['phone_token'] || null,
        wallet_address: walletAddress,
        trm_risk_score: trmData.riskScore,
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        case: newCase,
        trmData,
        tokens: usePrivacy ? tokens : null,
        message: usePrivacy 
          ? 'Transaction screened with privacy protection (Skyflow + TRM)'
          : 'Transaction screened without privacy protection (TRM only)'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in screen-with-privacy function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Failed to screen transaction with privacy'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
