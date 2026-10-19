An AI chat app with usage metering. Text replies are free-form; image requests
are generated and metered against a credit balance the user funds through
Stripe. Every message costs the operator money, so the credit system is not a
feature bolted on at the end — it sits in front of every model call.

**Live:** https://finn-ten-umber.vercel.app

## Stack

| Layer | Choice |
| --- | --- |
| Client | React, Vite, Tailwind CSS 4, React Router, Context API |
| Rendering | `react-markdown` + Prism for syntax-highlighted code |
| Server | Node.js, Express, Mongoose |
| Auth | Email/password, bcrypt hashing, JWT (30-day expiry) |
| Model | Google Gemini via its OpenAI-compatible endpoint |
| Images | ImageKit generation + media library |
| Payments | Stripe Checkout + webhook |

## How the credits work

- New accounts start with **20 credits**.
- A text reply costs **1 credit**; an image costs **2**, because generation is
  genuinely more expensive and the price should say so.
- Plans: Basic $10 / 100 credits, Pro $20 / 500, Premium $30 / 1000.
- Stripe Checkout creates a `Transaction` document. The webhook on
  `payment_intent.succeeded` looks up the session metadata, verifies the
  `appId` is `Finn`, tops up the user's balance and marks the transaction paid.

Both message endpoints check the balance **before** calling the model and
deduct **after** a successful response. There is a narrow window: the deduction
and the model call are not in a transaction, so a crash between them can grant
a free turn. That is an accepted trade-off — the failure mode is a small
operator loss, not corrupted data.

## How images are generated

ImageKit is used as the generation provider as well as the host. The server
builds an `ik-genimg-prompt-<encoded prompt>` URL, fetches the bytes, and
uploads the result back into the ImageKit media library. Messages therefore
store a permanent CDN URL rather than a generation URL — the original link is
not an asset, and re-fetching it on every page load would cost money again.

If the user ticks *Publish to community*, the image is flagged `isPublished`
and appears in the public gallery, built with a Mongo aggregation that unwinds
each chat's messages.

## Project structure

```text
server/
├── configs/       db, ImageKit, Gemini (OpenAI-compatible client)
├── controllers/   chat, message, user, credit, Stripe webhook
├── middlewares/   JWT `protect`
├── models/        User, Chat, Transaction
├── routes/        user, chat, message, credit
└── server.js      Stripe webhook mounted before express.json()
client/
└── src/
    ├── context/   auth token, user, chats, theme
    ├── components/ ChatBox, Message, SideBar, Logo
    └── pages/     Login, Credits, Community, Loading

The Stripe webhook is mounted before express.json() with
express.raw({ type: 'application/json' }), so signature verification gets
the untouched request body.

Getting started

# server
cd server
npm install
cp .env.example .env   # or create .env manually
npm run server         # nodemon
# or: npm start

# client
cd client
npm install
npm run dev

Environment variables

server/.env

┌────────────────────────────────────────────────────────────────────┬────────────────────────────────┐
│                              Variable                              │            Purpose             │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ MONGODB_URI                                                        │ MongoDB connection string      │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ JWT_SECRET                                                         │ Signs 30-day auth tokens       │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ GEMINI_API_KEY                                                     │ Gemini API key                 │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT │ Image generation + hosting     │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ STRIPE_SECRET_KEY                                                  │ Checkout sessions              │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ STRIPE_WEBHOOK_SECRET                                              │ Webhook signature verification │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────┤
│ PORT                                                               │ Defaults to 3000               │
└────────────────────────────────────────────────────────────────────┴────────────────────────────────┘

client/.env

┌─────────────────┬─────────────────────┐
│    Variable     │       Purpose       │
├─────────────────┼─────────────────────┤
│ VITE_SERVER_URL │ Base URL of the API │
└─────────────────┴─────────────────────┘

For local Stripe testing, forward webhooks with
stripe listen --forward-to localhost:3000/api/stripe.

API

┌────────┬────────────────────────────┬──────┬─────────────────────────────────────┐
│ Method │           Route            │ Auth │               Purpose               │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/user/register         │ —    │ Create account, return JWT          │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/user/login            │ —    │ Sign in, return JWT                 │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ GET    │ /api/user/data             │ ✅   │ Current user                        │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ PUT    │ /api/user/update           │ ✅   │ Update name, email or password      │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ GET    │ /api/user/published-images │ —    │ Community image gallery             │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ GET    │ /api/chat/create           │ ✅   │ Create an empty chat                │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ GET    │ /api/chat/get              │ ✅   │ List the user's chats, newest first │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/chat/delete           │ ✅   │ Delete one of the user's chats      │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/message/text          │ ✅   │ Text reply (1 credit)               │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/message/image         │ ✅   │ Image generation (2 credits)        │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ GET    │ /api/credit/plan           │ —    │ Credit plans                        │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/credit/purchase       │ ✅   │ Create Stripe Checkout session      │
├────────┼────────────────────────────┼──────┼─────────────────────────────────────┤
│ POST   │ /api/stripe                │ —    │ Stripe webhook                      │
└────────┴────────────────────────────┴──────┴─────────────────────────────────────┘

Known limitations

- The credit deduction is not atomic with the model call (see above).
- A retry after a crash can charge twice; request ids and idempotent
  deductions are the next step.
- No rate limiting beyond the credit balance itself.

---
