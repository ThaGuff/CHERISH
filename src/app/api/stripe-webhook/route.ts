import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Tier } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const tier = (session.metadata?.tier as Tier) || "PRO_MONTHLY";

        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await prisma.subscription.create({
            data: {
              userId,
              stripeSubId: sub.id,
              stripePriceId: sub.items.data[0].price.id,
              status: sub.status,
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          });

          await prisma.user.update({
            where: { id: userId },
            data: {
              tier,
              stripeId: session.customer as string,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubId: sub.id },
          data: {
            status: sub.status,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubId: sub.id },
          data: { status: "canceled" },
        });

        // Find user and downgrade
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubId: sub.id },
        });
        if (subscription) {
          await prisma.user.update({
            where: { id: subscription.userId },
            data: { tier: "FREE" },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await prisma.subscription.update({
            where: { stripeSubId: invoice.subscription as string },
            data: { status: "past_due" },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
