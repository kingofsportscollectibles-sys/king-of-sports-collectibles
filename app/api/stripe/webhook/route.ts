import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

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

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET" },
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

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const body = await req.text();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.order_id;
        const itemId = session.metadata?.item_id;
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        if (!orderId || !itemId) {
          console.error("Missing order_id or item_id in session metadata");
          break;
        }

        const { error: orderError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "awaiting_shipment",
            stripe_payment_intent_id: paymentIntentId,
            stripe_checkout_session_id: session.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (orderError) {
          console.error("Order update error:", orderError);
          return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
          );
        }

        const { error: itemError } = await supabase
          .from("items")
          .update({
            status: "sold",
            updated_at: new Date().toISOString(),
          })
          .eq("id", itemId);

        if (itemError) {
          console.error("Item update error:", itemError);
          return NextResponse.json(
            { error: "Failed to update item" },
            { status: 500 }
          );
        }

        console.log(`Order ${orderId} marked paid, item ${itemId} marked sold`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { error: orderError } = await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            order_status: "payment_failed",
            stripe_payment_intent_id: paymentIntent.id,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (orderError) {
          console.error("Failed payment order update error:", orderError);
        }

        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        console.log("🔥 ACCOUNT UPDATED EVENT RECEIVED");
        console.log("Stripe account id:", account.id);
        console.log("charges_enabled:", account.charges_enabled);
        console.log("payouts_enabled:", account.payouts_enabled);
        console.log("details_submitted:", account.details_submitted);
        console.log("capabilities:", account.capabilities);

        const onboardingComplete =
          account.details_submitted &&
          account.charges_enabled &&
          account.payouts_enabled;

        const { data: matchingProfiles, error: findProfileError } = await supabase
          .from("profiles")
          .select("id, email, stripe_account_id")
          .eq("stripe_account_id", account.id);

        console.log("Matching profiles for Stripe account:", matchingProfiles);

        if (findProfileError) {
          console.error("Profile lookup error:", findProfileError);
        }

        const { data: updatedProfiles, error: profileError } = await supabase
          .from("profiles")
          .update({
            stripe_charges_enabled: account.charges_enabled,
            stripe_payouts_enabled: account.payouts_enabled,
            stripe_details_submitted: account.details_submitted,
            stripe_onboarding_complete: onboardingComplete,
          })
          .eq("stripe_account_id", account.id)
          .select(
            "id, email, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_onboarding_complete"
          );

        console.log("Updated profile rows:", updatedProfiles);

        if (profileError) {
          console.error("Profile Stripe status update error:", profileError);
          break;
        }

        const sellerProfileId = updatedProfiles?.[0]?.id;

        if (!sellerProfileId) {
          console.warn("No seller profile found to sync item payment readiness.");
          break;
        }

        if (onboardingComplete) {
          const { error: itemReadyError } = await supabase
            .from("items")
            .update({
              seller_payment_ready: true,
            })
            .eq("seller_id", sellerProfileId)
            .eq("approval_status", "approved")
            .eq("status", "available");

          if (itemReadyError) {
            console.error("Item payment-ready sync error:", itemReadyError);
          } else {
            console.log(
              `Updated approved available items to seller_payment_ready=true for seller ${sellerProfileId}`
            );
          }
        } else {
          const { error: itemNotReadyError } = await supabase
            .from("items")
            .update({
              seller_payment_ready: false,
            })
            .eq("seller_id", sellerProfileId);

          if (itemNotReadyError) {
            console.error("Item payment-ready reset error:", itemNotReadyError);
          } else {
            console.log(
              `Updated items to seller_payment_ready=false for seller ${sellerProfileId}`
            );
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}