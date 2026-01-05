# Stripe Payment Integration Setup

This document explains how to set up Stripe payment integration for the subscription feature.

## Required Environment Variables

Add the following environment variables to your `.env` file in the root directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL (for Stripe redirects)
FRONTEND_URL=http://localhost:5173
```

## Getting Your Stripe Test Keys

1. **Sign up for a Stripe Account** (if you don't have one):
   - Go to https://stripe.com
   - Click "Sign up" and create a free account
   - You can use test mode for development (no credit card required)

2. **Get Your API Keys**:
   - Log in to your Stripe Dashboard
   - Make sure you're in **Test mode** (toggle in the top right)
   - Go to **Developers** → **API keys**
   - Copy your **Secret key** (starts with `sk_test_...`)
   - Copy your **Publishable key** (starts with `pk_test_...`)

3. **Add Keys to .env**:
   - Open your `.env` file in the root directory
   - Add the keys as shown above

## How It Works

1. **When a restaurant selects "Credit Card" as payment method**:
   - The system creates a Stripe Checkout Session
   - User is redirected to Stripe's secure payment page
   - After successful payment, user is redirected back to the subscription page

2. **Payment Verification**:
   - The system verifies the payment with Stripe
   - If payment is successful, the subscription is activated
   - Subscription expires after 1 month

## Test Cards

For testing in Stripe test mode, use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

For all test cards:
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

## Subscription Amount

- **Amount**: PKR 3,500 per month
- **Currency**: PKR (Pakistani Rupee)

**Note**: If PKR is not available in your Stripe account, you can temporarily use USD for testing:
- Change `currency: "pkr"` to `currency: "usd"` in `server/src/controllers/subscription.controller.js`
- Adjust the amount accordingly (e.g., $35 USD ≈ PKR 3,500)

## Important Notes

1. **Test Mode**: Make sure you're using test keys (`sk_test_...` and `pk_test_...`) for development
2. **Production**: When deploying to production, switch to live keys (`sk_live_...` and `pk_live_...`)
3. **Webhook**: For production, you may want to set up Stripe webhooks for more reliable payment verification
4. **Security**: Never commit your `.env` file or expose your secret keys

## Troubleshooting

- **"Stripe is not configured"**: Make sure `STRIPE_SECRET_KEY` is set in your `.env` file
- **Payment not completing**: Check that you're using test cards in test mode
- **Redirect issues**: Verify `FRONTEND_URL` matches your frontend URL

