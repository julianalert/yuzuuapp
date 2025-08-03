import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  // For development/testing, allow direct API calls without signature
  if (!signature && process.env.NODE_ENV === 'development') {
    try {
      const data = JSON.parse(body);
      if (data.type === 'checkout.session.completed' && data.data?.object?.metadata?.campaignId) {
        const session = data.data.object;
        
        // Update campaign paid status in Supabase
        if (session.metadata?.campaignId && supabase) {
          const { error } = await supabase
            .from('campaign')
            .update({ paid_status: true })
            .eq('id', session.metadata.campaignId);

          if (error) {
            console.error('Error updating campaign status:', error);
            return NextResponse.json(
              { error: 'Failed to update campaign status' },
              { status: 500 }
            );
          }
        }
        
        return NextResponse.json({ received: true, mode: 'development' });
      }
    } catch (err) {
      console.error('Error processing development webhook:', err);
    }
  }

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  let event;

  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update campaign paid status in Supabase
      if (session.metadata?.campaignId && supabase) {
        const { error } = await supabase
          .from('campaign')
          .update({ paid_status: true })
          .eq('id', session.metadata.campaignId);

        if (error) {
          console.error('Error updating campaign status:', error);
          return NextResponse.json(
            { error: 'Failed to update campaign status' },
            { status: 500 }
          );
        }
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
} 