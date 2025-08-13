import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
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

    const stripe = getStripeServer();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Log the request URL for debugging
    console.log('Request URL:', request.nextUrl.origin);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Unlock All Leads',
              description: 'Get instant access to all lead information, including emails, phone numbers, and AI-generated warm intros.',
            },
            unit_amount: 2700, // $27.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/api/complete-payment?campaignId=${campaignId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/leads?campaignId=${campaignId}&canceled=true`,
      metadata: {
        campaignId: campaignId,
      },
      // Customize the look and feel
      custom_text: {
        submit: {
          message: 'We will instantly unlock your leads after payment.'
        },
      },
      // Add business information
      payment_intent_data: {
        description: 'Yuzuu Marketing - Lead Access',
      },
      // Customize customer information collection
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      locale: 'en',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Detailed error:', error);
    
    // Return more specific error messages
    if (error?.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: `Stripe Error: ${error.message}` },
        { status: 400 }
      );
    }

    if (error?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Could not connect to Stripe. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 