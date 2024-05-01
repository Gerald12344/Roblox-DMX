import { NextRequest } from "next/server";

let values: { id: number; values: number[] }[] = [];

export { values };

export async function POST(req: NextRequest) {
  const body = await req?.json();

  values = body.body as any;
  return new Response("Hello, world!");
}
