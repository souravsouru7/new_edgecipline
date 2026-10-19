import Image from "next/image";

import { links, socials } from "./nav/links";
import { SideNavLinks } from "./nav/SideNavLinks";

export function Brand() { return <a className="brand" href="#home" aria-label="Edgecipline home"><Image src="/hero/logo.webp" alt="Edgecipline" width={440} height={330} priority /></a>; }
export function SidebarNav() { return <aside className="sidebar" aria-label="Primary navigation"><Brand /><SideNavLinks /><a className="waitlist side-waitlist" href="#waitlist">Join Waitlist <span aria-hidden="true">→</span></a><div className="side-quote"><blockquote>&ldquo;Discipline creates freedom.&rdquo;</blockquote><i aria-hidden="true" /><ul className="side-socials">{socials.map(([label, href, Icon]) => <li key={label}><a href={href} aria-label={label}><Icon aria-hidden="true" size={17} /></a></li>)}</ul></div></aside>; }
export { links };
