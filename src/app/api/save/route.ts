import { setValues } from "@/app/server/BackendCache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req?.json();

  setValues(body.body as any);
  return new Response("Hello, world!");
}
