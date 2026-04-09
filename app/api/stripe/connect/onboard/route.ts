import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const profileId = body.profileId as string | undefined;
    const email = body.email as string | undefined;

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, display_name, stripe_account_id")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json({ error: "Unable to load profile" }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let stripeAccountId = profile.stripe_account_id as string | null;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
  type: "express",
  country: "US",
  email: profile.email || email || undefined,
  business_type: "individual",
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  metadata: {
    profile_id: profile.id,
  },
});

      stripeAccountId = account.id;

      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          stripe_account_id: stripeAccountId,
        })
        .eq("id", profile.id);

      if (updateProfileError) {
        console.error("Profile Stripe account save error:", updateProfileError);
        return NextResponse.json(
          { error: "Unable to save Stripe account to profile" },
          { status: 500 }
        );
      }
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error("Stripe Connect onboarding error:", error);
    return NextResponse.json(
      { error: error.message || "Unable to start Stripe onboarding" },
      { status: 500 }
    );
  }
}