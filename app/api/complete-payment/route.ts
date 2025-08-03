import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const sessionId = searchParams.get('session_id');

    if (!campaignId || !sessionId) {
      return NextResponse.redirect(new URL('/leads?error=missing_params', request.url));
    }

    // Verify the payment with Stripe
    const stripe = getStripeServer();
    if (!stripe) {
      return NextResponse.redirect(new URL('/leads?error=stripe_not_configured', request.url));
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/leads?error=payment_not_completed', request.url));
    }

    // Update campaign paid status in Supabase
    if (supabase) {
      const { error } = await supabase
        .from('campaign')
        .update({ paid_status: true })
        .eq('id', campaignId);

      if (error) {
        console.error('Error updating campaign status:', error);
        return NextResponse.redirect(new URL('/leads?error=update_failed', request.url));
      }
    }

    // Redirect to leads page with success
    return NextResponse.redirect(new URL(`/leads?campaignId=${campaignId}&success=true`, request.url));

  } catch (error) {
    console.error('Error completing payment:', error);
    return NextResponse.redirect(new URL('/leads?error=completion_failed', request.url));
  }
} 