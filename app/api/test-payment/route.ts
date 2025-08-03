import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Update campaign paid status in Supabase
    if (supabase) {
      const { error } = await supabase
        .from('campaign')
        .update({ paid_status: true })
        .eq('id', campaignId);

      if (error) {
        console.error('Error updating campaign status:', error);
        return NextResponse.json(
          { error: 'Failed to update campaign status' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Campaign marked as paid successfully' 
      });
    }

    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error in test payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 