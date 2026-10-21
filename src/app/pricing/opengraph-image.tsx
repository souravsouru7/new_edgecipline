import { BRAND_NAME } from "@/data/brand";
import { PRICING_FOOTNOTE, plans } from "@/data/pricing";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const alt = `${BRAND_NAME} pricing — ${plans.length} plans, every feature in each`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The cheapest plan's headline price leads the card, because "from ₹349" is
 * the fact someone sharing a pricing link is actually sharing. It is read
 * from `plans` rather than typed out, so the card cannot quote a price the
 * page has stopped charging.
 */
export default function Image() {
  const cheapest = plans.reduce((low, plan) => (plan.amount < low.amount ? plan : low), plans[0]);

  return ogCard({
    eyebrow: "Pricing",
    title: `Every feature, from ${cheapest.price} ${cheapest.period}`,
    lede: PRICING_FOOTNOTE,
  });
}
