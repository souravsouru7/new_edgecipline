import { llmsTxt } from "@/lib/llms-txt";

/**
 * GET /llms.txt
 *
 * A Route Handler rather than a file in `/public`, because the content is
 * generated from `src/data/*.ts`. A static file would be a fourteenth copy of
 * facts that already exist in fourteen places, and the first one to go stale.
 *
 * It reads no request API and fetches nothing, so with `cacheComponents` on it
 * prerenders at build time and is served as a static asset.
 *
 * `text/plain` with an explicit charset: the convention is a markdown file,
 * but it is meant to be *read*, and `text/markdown` makes some clients offer
 * a download instead of showing it.
 */
export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
