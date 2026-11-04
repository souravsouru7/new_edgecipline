import type { Metadata } from "next";

import { StoryExperience } from "@/components/story3d/StoryExperience";
import { BRAND_NAME, OG_LOCALE, TWITTER_DEFAULTS, absoluteUrl } from "@/data/brand";

const title = "Our Story | Why We Built Edgecipline";
const description =
  "From a losing streak to a trading coach built around trader psychology: find your behaviour patterns, break them, and trade with discipline. The Edgecipline story, told in 3D.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/story") },
  openGraph: {
    siteName: BRAND_NAME,
    locale: OG_LOCALE,
    title,
    description,
    type: "website",
    url: absoluteUrl("/story"),
  },
  twitter: { ...TWITTER_DEFAULTS, card: "summary_large_image", title, description },
};

export default function StoryPage() {
  return <StoryExperience />;
}
