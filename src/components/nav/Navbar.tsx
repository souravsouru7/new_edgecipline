/**
 * The site-wide header. Re-exports the shared EdgHeader so every route carries
 * the same landing-style navigation (routes list, theme toggle, waitlist CTA,
 * mobile menu) and the chrome reads as one visual system across the site.
 */
export { EdgHeader as Navbar } from "@/components/landing/EdgChrome";
