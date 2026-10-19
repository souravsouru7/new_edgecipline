import { BrainCircuit, Camera, CircleHelp, Compass, Home, Landmark, Layers3, Podcast, ScrollText, SquarePlay } from "lucide-react";

/**
 * Shared by the sidebar, the mobile drawer and the scroll spy. Kept in its own
 * module so the client-side nav does not have to import the server component
 * that renders it.
 */
export const links = [["Home", "#home", Home], ["Story", "#story", ScrollText], ["How It Works", "#how-it-works", Compass], ["AI Coach", "#ai-coach", BrainCircuit], ["Trading DNA", "#trading-dna", Layers3], ["Pricing", "#pricing", Landmark], ["FAQ", "#faq", CircleHelp]] as const;

export const socials = [["Podcast", "#podcast", Podcast], ["YouTube", "#youtube", SquarePlay], ["Instagram", "#instagram", Camera]] as const;
