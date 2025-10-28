"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    netlifyIdentity?: {
      on: (event: string, callback: (user?: unknown) => void) => void;
      off: (event: string, callback: (user?: unknown) => void) => void;
      init: (options?: { locale?: string }) => void;
      close: () => void;
      currentUser: () => unknown | null;
      open: () => void;
    };
  }
}

const LOGIN_REDIRECT = "/admin/";

export function NetlifyIdentity() {
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const setupIdentity = (identity: NonNullable<typeof window.netlifyIdentity>) => {
      const redirectToAdmin = () => {
        identity.close();
        if (window.location.pathname !== LOGIN_REDIRECT) {
          window.location.assign(LOGIN_REDIRECT);
        }
      };

      const handleLogout = () => {
        identity.close();
        window.location.replace("/");
      };

      const handleInit = (user?: unknown) => {
        if (!user) {
          identity.on("login", redirectToAdmin);
        }
      };

      identity.on("init", handleInit);
      identity.on("login", redirectToAdmin);
      identity.on("logout", handleLogout);
      identity.init();

      cleanup = () => {
        identity.off("init", handleInit);
        identity.off("login", redirectToAdmin);
        identity.off("logout", handleLogout);
      };
    };

    const attemptSetup = () => {
      if (!mounted) {
        return true;
      }

      const identity = window.netlifyIdentity;
      if (!identity) {
        return false;
      }

      setupIdentity(identity);
      return true;
    };

    if (!attemptSetup()) {
      const interval = window.setInterval(() => {
        if (attemptSetup()) {
          window.clearInterval(interval);
        }
      }, 200);

      cleanup = () => {
        window.clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return null;
}
