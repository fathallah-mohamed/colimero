import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, is_verified } = await req.json()

    if (!user_id) {
      throw new Error('User ID is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Mettre à jour auth.users
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      user_id,
      {
        user_metadata: { email_verified: is_verified },
        email_confirmed_at: is_verified ? new Date().toISOString() : null
      }
    )

    if (authUpdateError) {
      console.error('Error updating auth user:', authUpdateError)
      throw authUpdateError
    }

    return new Response(
      JSON.stringify({ message: 'User verification status updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})