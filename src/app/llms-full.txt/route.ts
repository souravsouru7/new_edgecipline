import { llmsFullTxt } from "@/lib/llms-txt";

/**
 * GET /llms-full.txt
 *
 * The long companion to /llms.txt: every feature's full text, all the FAQ
 * answers, the plans, the founders and the article index in one document, so
 * a retrieval tool can answer from a single fetch instead of crawling eleven
 * animated pages.
 *
 * Same reasoning as its sibling — generated, not stored, so it cannot drift.
 */
export function GET() {
  return new Response(llmsFullTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
