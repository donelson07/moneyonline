import { NextResponse } from "next/server";
import Stripe from "stripe";

const FEATURED_LISTING_PRICE_USD = 4900; // $49.00, one-time, self-serve

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Los pagos aún no están configurados. Contacta al administrador del sitio.",
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const body = await request.json().catch(() => ({}));
  const company = typeof body.company === "string" ? body.company.slice(0, 200) : "";
  const title = typeof body.title === "string" ? body.title.slice(0, 200) : "";
  const applyUrl = typeof body.applyUrl === "string" ? body.applyUrl.slice(0, 500) : "";
  const email = typeof body.email === "string" ? body.email.slice(0, 200) : "";

  if (!company || !title || !applyUrl) {
    return NextResponse.json(
      { error: "Faltan datos de la vacante (empresa, título o enlace)." },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: FEATURED_LISTING_PRICE_USD,
          product_data: {
            name: "Vacante destacada (7 días) — TrabajoRemoto.es",
            description: `Empresa: ${company} — ${title}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { company, title, applyUrl, email },
    customer_email: email || undefined,
    success_url: `${origin}/destacar-vacante?status=success`,
    cancel_url: `${origin}/destacar-vacante?status=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
