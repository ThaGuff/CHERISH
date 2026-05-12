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
    pagesPerMonth: -1, // unlimited — free to create
    maxBooks: -1,
    features: [
      "Unlimited pages & memory books",
      "All 6 creation modes",
      "Voice transcription",
      "Family Circle sharing",
      "Cloud backup & sync",
      "Timeline & library",
      "Pay only when you print or export",
    ],
  },
  PRO_MONTHLY: {
    name: "Pro",
    price: 499, // $4.99/mo
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Everything in Free",
      "All premium sticker packs",
      "All 4 visual themes",
      "HD photo quality",
      "Public profile & Explore feed",
      "10% off all print orders",
      "On This Day reminders",
      "Priority support",
    ],
  },
  PRO_ANNUAL: {
    name: "Pro Annual",
    price: 3999, // $39.99/yr
    stripePriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Everything in Pro",
      "Save 33% vs monthly",
      "Early access to new features",
    ],
  },
  FAMILY_ANNUAL: {
    name: "Family",
    price: 799, // $7.99/mo
    stripePriceId: process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Everything in Pro for up to 5 members",
      "Shared memory books",
      "Collaborative pages",
      "15% off all print orders",
    ],
  },
  FOUNDING: {
    name: "Founding Member",
    price: 299, // $2.99/mo locked for life
    stripePriceId: process.env.STRIPE_FOUNDING_PRICE_ID,
    pagesPerMonth: -1,
    maxBooks: -1,
    features: [
      "Everything in Pro",
      "$2.99/mo locked for life",
      "Founding Member badge",
      "All future features included",
      "Cherish Gives contributor",
    ],
  },
} as const;
