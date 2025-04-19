import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { plans } from '@/components/Pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

class WebhookError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'WebhookError'
  }
}

async function validateWebhookRequest(req: Request): Promise<{ signature: string; payload: string }> {
  const headersList = await headers()
  const stripeSignature = headersList.get('stripe-signature')
  const stripePayload = await req.text()

  if (!stripeSignature || !stripePayload) {
    throw new WebhookError('Missing Stripe signature or payload', 400)
  }

  return { signature: stripeSignature, payload: stripePayload }
}

async function verifyStripeEvent(signature: string, payload: string): Promise<Stripe.Event> {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    throw new WebhookError(`Invalid webhook signature: ${err}`, 400)
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || typeof session.customer !== 'string') {
    throw new WebhookError('Invalid customer ID', 400)
  }

  const customer = await stripe.customers.retrieve(session.customer)
  if (!customer || customer.deleted) {
    throw new WebhookError('Customer not found', 400)
  }

  if (!customer.email) {
    throw new WebhookError('Customer email not found', 400)
  }

  const priceId = session.line_items?.data[0]?.price?.id
  if (!priceId) {
    throw new WebhookError('Price ID not found in session', 400)
  }

  const plan = Object.values(plans).find((plan) => plan.priceId === priceId)
  if (!plan) {
    throw new WebhookError('Invalid plan', 400)
  }

  let user = await prisma.user.findUnique({
    where: { email: customer.email },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: customer.email,
        id: session.customer,
      },
    })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscription: 'PLUS',
      priceId: priceId,
    },
  })

  // TODO: Implement email notification
  console.log(`Successfully processed subscription for user ${user.email}`)
}

export async function POST(req: Request) {
  try {
    const { signature, payload } = await validateWebhookRequest(req)
    const event = await verifyStripeEvent(signature, payload)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
          expand: ['line_items'],
        })
        await handleCheckoutSessionCompleted(session)
        return new Response('Subscription updated successfully', { status: 200 })
      }
      default:
        return new Response(`Unhandled event type: ${event.type}`, { status: 200 })
    }
  } catch (error) {
    console.error('Webhook error:', error)

    if (error instanceof WebhookError) {
      return new Response(error.message, { status: error.statusCode })
    }

    return new Response('Internal server error', { status: 500 })
  }
}
