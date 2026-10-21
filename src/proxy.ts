import { NextResponse, type NextRequest } from "next/server";

import { getBlogPost } from "@/data/blog";
import { getFounder } from "@/data/founders";

/** Reject unknown content URLs before Partial Prerendering starts streaming. */
export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const exists = section === "blog" ? getBlogPost(slug) : getFounder(slug);

  if (!exists) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = { matcher: ["/blog/:slug", "/founders/:slug"] };
