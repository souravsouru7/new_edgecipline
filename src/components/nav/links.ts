import { BookOpen, Camera, CircleHelp, Home, Landmark, Mail, Podcast, ScrollText, Sparkles, SquarePlay } from "lucide-react";

/**
 * The site's routes. Shared by the sidebar and the mobile drawer, and kept in
 * its own module so the client-side nav does not have to import the server
 * component that renders it.
 *
 * This is a multi-page site: every entry here is a page of its own, never a
 * fragment of a long scrolling page. Only routes that actually exist are
 * listed — a nav link to a route that is not built yet is a 404 in the
 * primary navigation.
 */
export const links = [["Home", "/", Home], ["Features", "/features", Sparkles], ["Pricing", "/pricing", Landmark], ["About", "/about", ScrollText], ["Blog", "/blog", BookOpen], ["FAQ", "/faq", CircleHelp], ["Contact", "/contact", Mail]] as const;

export const socials = [["Podcast", "#podcast", Podcast], ["YouTube", "#youtube", SquarePlay], ["Instagram", "#instagram", Camera]] as const;

/**
 * Secondary links. These live in the sidebar foot and the mobile drawer, not
 * in the primary nav — the same split the previous site used, where Founders
 * sat in the footer's Company column and the legal pages in its Legal column.
 */
export const metaLinks = [
  ["Founders", "/founders"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
] as const;
