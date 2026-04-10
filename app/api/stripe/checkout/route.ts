import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const PLATFORM_FEE_PERCENT = 0.08; // 8%

type CheckoutRequestBody = {
  itemId?: string;
};

type SellerProfile = {
  id: string;
  stripe_account_id: string | null;
  stripe_payouts_enabled: boolean | null;
  stripe_charges_enabled: boolean | null;
  stripe_onboarding_complete: boolean | null;
} | null;

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = (await req.json()) as CheckoutRequestBody;
    const itemId = body.itemId;

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    const { data: item, error: itemError } = await supabase
      .from("items")
      .select(`
        id,
        title,
        slug,
        price,
        description,
        image_url,
        status,
        approval_status,
        seller_id,
        profiles:seller_id (
          id,
          stripe_account_id,
          stripe_payouts_enabled,
          stripe_charges_enabled,
          stripe_onboarding_complete
        )
      `)
      .eq("id", itemId)
      .eq("approval_status", "approved")
      .eq("status", "available")
      .maybeSingle();

    if (itemError) {
      console.error("Item fetch error:", itemError);
      return NextResponse.json(
        { error: "Unable to load item" },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const seller = (
      Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
    ) as SellerProfile;

    if (
      !seller?.stripe_account_id ||
      !seller?.stripe_payouts_enabled ||
      !seller?.stripe_charges_enabled ||
      !seller?.stripe_onboarding_complete
    ) {
      return NextResponse.json(
        { error: "Seller is not fully ready to accept payments yet." },
        { status: 400 }
      );
    }

    const unitAmount = Math.round(Number(item.price) * 100);

    if (!unitAmount || unitAmount < 50) {
      return NextResponse.json(
        { error: "Invalid item price for checkout" },
        { status: 400 }
      );
    }

    const platformFeeAmount = Math.round(unitAmount * PLATFORM_FEE_PERCENT);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        item_id: item.id,
        seller_user_id: item.seller_id,
        amount: unitAmount,
        platform_fee_amount: platformFeeAmount,
        currency: "usd",
        payment_status: "pending",
        order_status: "awaiting_payment",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Unable to create order" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${item.slug}?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${item.slug}?checkout=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: item.title,
              description: item.description || undefined,
              images: item.image_url ? [item.image_url] : [],
            },
          },
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: seller.stripe_account_id,
        },
        metadata: {
          order_id: order.id,
          item_id: item.id,
          seller_user_id: item.seller_id,
        },
      },
      metadata: {
        order_id: order.id,
        item_id: item.id,
        seller_user_id: item.seller_id,
      },
    });

    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq("id", order.id);

    if (updateOrderError) {
      console.error("Order update error:", updateOrderError);
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("🔥 STRIPE CHECKOUT ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong creating checkout" },
      { status: 500 }
    );
  }
}