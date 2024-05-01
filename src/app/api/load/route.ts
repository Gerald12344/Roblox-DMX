import { NextRequest } from "next/server";
import { values } from "../save/route";

export async function GET(req: NextRequest) {
  return new Response(JSON.stringify({ values: values }));
}
