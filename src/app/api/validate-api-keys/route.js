import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();
    
    // Basic validation for API key format
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid API key format' 
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Query the api_keys table to check if the provided key exists
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, usage')
      .eq('value', apiKey)
      .single();

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ 
        valid: false, 
        message: 'Error checking API key' 
      });
    }

    // If no data found, key doesn't exist
    if (!data) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid API key' 
      });
    }

    // Update usage count
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: (data.usage || 0) + 1 })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating usage count:', updateError);
    }

    // Key exists and is valid
    return NextResponse.json({ 
      valid: true, 
      message: `API key '${data.name}' is valid`,
      usage: (data.usage || 0) + 1
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ 
      valid: false, 
      message: 'Error validating API key' 
    }, { status: 500 });
  }
} 