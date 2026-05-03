import { NextResponse } from "next/server";
import { getAllTours, createTour, deleteTour } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const tours = getAllTours();
  return NextResponse.json(tours);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title, description, price, currency = "JPY",
    duration, rating = 5.0, tags = [], product_url = "",
    image_url = "", location = "鹿児島",
  } = body;

  if (!title || !description || !price || !duration) {
    return NextResponse.json({ error: "title, description, price, duration は必須です" }, { status: 400 });
  }

  const tour = createTour({
    product_code: `CUSTOM-${randomUUID().slice(0, 8).toUpperCase()}`,
    title,
    description,
    price: Number(price),
    currency,
    duration,
    rating: Number(rating),
    review_count: 0,
    tags: JSON.stringify(Array.isArray(tags) ? tags : [tags]),
    product_url,
    image_url,
    location,
  });

  return NextResponse.json(tour, { status: 201 });
}
