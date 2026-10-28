import { NextResponse, type NextRequest } from "next/server";

import { getBlogPost } from "@/data/blog";
import { getFounder } from "@/data/founders";

/** Reject unknown content URLs before Partial Prerendering starts streaming. */
export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  // Files in public/ (e.g. /founders/sourav-r.webp) share this URL space; never 404 them.
  if (slug.includes(".")) return NextResponse.next();
  const exists = section === "blog" ? getBlogPost(slug) : getFounder(slug);

  if (!exists) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = { matcher: ["/blog/:slug", "/founders/:slug"] };
