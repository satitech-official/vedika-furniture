# Vedika Furniture

[![GitHub Pages Showcase](https://img.shields.io/badge/Showcase-GitHub%20Pages-6B4028?style=for-the-badge)](https://satitech-official.github.io/vedika-furniture/)

**Client demo:** https://satitech-official.github.io/vedika-furniture/  
**Note:** The link works once GitHub Pages is enabled for the repository.

### Publish the GitHub-only showcase

1. Open **Repository → Settings → Pages**.
2. Under **Build and deployment**, set **Source: Deploy from a branch**.
3. Choose **Branch: `gh-pages`** and **Folder: `/ (root)`**, then click **Save**.
4. After GitHub Pages finishes publishing, open the showcase link above.

The `gh-pages` branch contains a standalone responsive HTML/CSS/JS interactive client demo. The production Next.js source remains on `main` and is **not** hosted by GitHub Pages.

The showcase includes product browsing, filters/search, local wishlist and demo cart, WhatsApp enquiries, a room-photo **local preview**, and a rule-based shopping guide. It does **not** provide real AI generation, accurate 3D reconstruction, payments, real orders, or server-side delivery tracking. No customer photo is uploaded to a server in this demo. Product examples and photos are illustrative, not verified Vedika inventory.

---

## WhatsApp configured

The site is configured with the owner-provided number **+91 9301554348** (international digits `919301554348`). Click-to-chat leads to `https://wa.me/919301554348` and the site pre-fills enquiry text. The customer must tap **Send** inside WhatsApp; this is not an automated WhatsApp Business API bot. The number must be active on WhatsApp to work. The setting is in `.env.example` and `.env.local`; on Vercel, set `NEXT_PUBLIC_VEDIKA_WHATSAPP_NUMBER=919301554348` and redeploy.

# Vedika Furniture — Premium Website

Next.js App Router + JavaScript/JSX + Motion + Lucide React. No TypeScript or import aliases.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev` and visit http://localhost:3000.
4. Run `npm run build` before deploying to Vercel.

## Important launch checklist

- Replace all clearly marked illustrative concept products and images with actual authorized Vedika inventory photos, product descriptions, and prices.
- Replace the typographic **VEDIKA** wordmark with the original approved business logo once provided.
- Verify and configure the business phone number, WhatsApp number, email and showroom address before enabling enquiry submissions or map directions.
- Contact form currently creates a *local copyable enquiry draft only*. It never falsely reports an enquiry as sent. Connect a secured backend before publishing any claim of successful submission.
- Collect verified, permissioned customer testimonials if a reviews section is to be enabled.
- Review and approve privacy policy and terms for real operation.
- Illustrative photographs are sourced from Unsplash and should be reviewed for rights and relevance before launch.
- Automated build test was not possible in the generation environment because npm registry access was unavailable; run install/build on your development machine or CI.


## October 2026 image and animation reliability update
- Replaced fragile image-only rendering with `SmartImage` and four locally bundled category-specific SVG fallback visuals. If a remote photography URL fails, the site displays the corresponding illustrative fallback instead of an empty arch / broken-image symbol. These are graphic **fallbacks**, not verified showroom photographs. Replace image URLs with client-owned photos before production.
- Added a dedicated animated `HeroVisual` with softly morphing organic background, clipping reveal, animated accent line, floating decorative elements and reduced-motion support.
- Refined sticky-header contrast and section positioning, and simplified reveal thresholds.
- Functional browsing, wishlist and enquiry-list controls remain present; there is no real contact submission backend or configured WhatsApp destination.
- Build verification requires `npm install && npm run build` in an internet-enabled developer environment; could not execute it in the package generation environment.


## Added: marquee motion + purchase/delivery enquiry
- Animated looping editorial ticker and horizontal product inspiration rail (pause on hover; reduced-motion friendly).
- Hero organic motion, moving badges and floating decorative accents.
- LocalStorage cart; add-to-cart from product cards/details; change quantities and remove products at `/cart`.
- Checkout enquiry form at `/checkout`: address, 6-digit Indian PIN, pickup/standard/installation preference; client-side required-field checks; generates copyable purchase request.
- **Not a live purchase flow:** no verified prices, stock, delivery eligibility, delivery charges, payment provider or order backend; no fake success/confirmation. Merchant must configure inventory, shipping rules, legal policies, payments and order service before launching online purchasing.

## Online Buy Now / payment setup
Product cards and product details include **Buy Now** leading to checkout with customer delivery details. Checkout includes a secure payment action. Until configured, it refuses to initiate payments and the alternative enquiry flow remains available.

To activate: collect verified product information/prices and delivery policy, create Razorpay merchant keys, copy `.env.example` to `.env.local`, set `VEDIKA_VERIFIED_PRICES_PAISE` to JSON mapping product IDs to integer paise (example schema only: `{"your-product-id": 12345}`; do not copy fake values), set delivery charge, then set `VEDIKA_CHECKOUT_ENABLED=true`. The server creates each order with calculated total; payment is signature-verified server-side and provider payment status is retrieved. **Important:** before taking real customer payments, implement durable database orders, Razorpay webhooks, inventory reservation, shipping serviceability/pricing, fulfilment and refunds; the verification route is not a full order management backend. Never use this example as an unattended production store.

## AI Shopping Guide + WhatsApp (new)
- Persistent bottom-right shopping guide: search-like conversational recommendations, curated demo catalogue links, add to cart and add to enquiry actions, mobile-friendly responsive panel.
- When `OPENAI_API_KEY` is configured on the **server**, `/api/assistant` uses an AI provider to reply using the known demo catalogue. Never expose that key with `NEXT_PUBLIC_`.
- Without the key, the assistant falls back to simple **guided recommendations**. These are rule-based, not generated AI responses.
- Set `NEXT_PUBLIC_VEDIKA_WHATSAPP_NUMBER` to the **verified company WhatsApp Business number**, full country code and digits only (for India 91 + 10 digits). The green WhatsApp contact icon appears only after a valid number is configured and the site is rebuilt.
- This uses `wa.me` click-to-chat, *not* WhatsApp Cloud API or automatic outbound messaging. A customer must press Send in WhatsApp. It is not an automated WhatsApp AI bot.
- Illustrative products and their availability/prices are **not verified**. Assistant must not claim stock, shipping prices or successful orders.
- Future: add consent-based lead capture with database storage, moderation, abuse/rate limiting, genuine catalogue and actual image/3D room visualizer service before accepting public uploads.

## Advanced AI Room Studio, 3D and verified checkout

- `/room-visualizer`: room photo upload (JPEG/PNG/WebP, 8MB limit), real AI vision recommendations via server API when `OPENAI_API_KEY` is supplied, AI-generated 2D furnished preview via image-edit API, and an interactive **illustrative** Three.js furniture room with drag rotation/zoom. The 3D viewer is **not a reconstructed scan** of the uploaded photograph; real product-accurate 3D requires individually measured room dimensions and real furniture 3D assets.
- `/track`: tracks an actual recorded order using a cryptographically random private tracking token. This is **order status**, not real-time courier GPS. Showroom staff update delivery milestones in Supabase.
- `database/vedika-orders.sql`: execute in Supabase SQL editor. It enables RLS with **no public policies**; read/write happens using server-only service role, which must never be prefixed `NEXT_PUBLIC_`.
- Payment initialization now requires database + confirmed server-authoritative catalogue pricing + Razorpay credentials; creates payment provider order and persists pending order before allowing checkout. The callback verifies signature **and captured payment status** and updates database; configure Razorpay `payment.captured` webhook to `/api/payment/webhook` with `RAZORPAY_WEBHOOK_SECRET` for asynchronous reconciliation. Do not enable until database schema, webhooks and merchant product/delivery policies are verified.
- For AI: configure `OPENAI_API_KEY`, `VEDIKA_VISION_MODEL`, `VEDIKA_IMAGE_MODEL`. Image generation incurs API costs. No uploading customer photos unless the site owner has an appropriate privacy/consent policy and retention/deletion plan. The current AI photo preview is returned to the browser, not stored in the order database.
- Real prices, shipping rules, refunds, taxes, merchant settlement, inventory synchronization and identity-verified admin fulfilment dashboard are still business-specific prerequisites. The supplied catalogue is labelled illustrative and **must not be sold** as real Vedika merchandise.
- No AI, payment or order services are silently simulated when credentials are absent.
