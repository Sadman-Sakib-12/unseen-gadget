"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

// Global safeguard patch for Google Translate + React DOM collisions:
// When Google Translate mutates text nodes with <font> tags, React's removeChild & insertBefore
// fail with "The node to be removed is not a child of this node."
// This patch ensures safe node operations so React never crashes.
if (typeof window !== "undefined") {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export function triggerGoogleTranslate(lang: "en" | "bn") {
  try {
    const cookieValue = lang === "bn" ? "/en/bn" : "/en/en";
    const host = window.location.hostname;

    // Set cookie across root path and domain
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${host};`;
    if (host.includes(".")) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host};`;
    }

    if (lang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      if (host.includes(".")) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
      }
    }

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  } catch (err) {
    console.error("Google Translate trigger error:", err);
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,bn",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      } catch (e) {
        console.error("Failed to initialize Google Translate element", e);
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </>
  );
}
