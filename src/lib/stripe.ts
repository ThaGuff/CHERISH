import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia" as unknown as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    pagesPerMonth: 10,
    maxBooks: 1,
    features: [
      "10 pages per month",
      "1 memory book",
      "Basic stickers",
      "Private entries",
      "Cloud backup",
    ],
  },
  PRO_MONTHLY: {
    name: "Pro Monthly",
    price: 799, // cents
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    pagesPerMonth: -1, // unlimited
    maxBooks: -1,
    features: [
      "Unlimited pages & books",
      "All stickers & themes",
      "PDF export & print",
      "Voice memos & transcription",
      "Family Circle",
      "On This Day memories",
      "Priority support",
    ],
  },
  PRO_ANNUAL: {
    name: "Pro Annual",
    price: 6499, // cents
    stripePriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Early access to new features",
    ],
  },
  FAMILY_ANNUAL: {
    name: "Family Annual",
    price: 9999, // cents
    stripePriceId: process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Pro for up to 5 family members",
      "Shared memory books",
      "Family Circle premium features",
      "All sticker packs included",
    ],
  },
  FOUNDING: {
    name: "Founding Member",
    price: 479, // cents — locked for life
    stripePriceId: process.env.STRIPE_FOUNDING_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Everything in Pro",
      "$4.79/mo locked for life",
      "Founding Member badge",
      "All future features included",
    ],
  },
} as const;
