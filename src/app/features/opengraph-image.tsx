import { BRAND_NAME } from "@/data/brand";
import { features } from "@/data/features";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const alt = `${BRAND_NAME} features — all ${features.length} capabilities`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Features",
    title: `${features.length} ways to see your own trading`,
    lede: "AI screenshot extraction, Trading DNA, the psychology cost calculator, missions and a daily AI coach.",
  });
}
