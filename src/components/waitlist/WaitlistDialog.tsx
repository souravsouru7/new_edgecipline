"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { WaitlistForm } from "./WaitlistForm";

/**
 * Makes every same-site link ending in #waitlist open the form in place.
 * The href remains useful as a no-JavaScript fallback and as a direct link.
 */
export function WaitlistDialog() {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => {
      if (!dialog.current?.open) dialog.current?.showModal();
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash !== "#waitlist") return;

      event.preventDefault();
      open();
    };

    const onHashChange = () => {
      if (window.location.hash === "#waitlist") open();
    };

    // Capture runs before Next.js handles <Link>, so the router never starts
    // a page change for a waitlist action that should remain in-place.
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <dialog
      className="edg-dialog"
      ref={dialog}
      aria-labelledby="global-waitlist-title"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
    >
      <button
        type="button"
        className="edg-dialog-close"
        aria-label="Close waitlist form"
        onClick={() => dialog.current?.close()}
      >
        <X size={19} />
      </button>
      <h2 id="global-waitlist-title">Join the Edgecipline waitlist</h2>
      <p>Request invite-only access and receive product and plan updates.</p>
      <WaitlistForm />
    </dialog>
  );
}
