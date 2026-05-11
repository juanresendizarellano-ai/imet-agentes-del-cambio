"use client";

import { useEffect } from "react";

const VISITOR_KEY = "imet_visitor_id";
const LAST_VISIT_KEY = "imet_last_visit";
// Dedup: no contar la misma visita dentro de esta ventana de tiempo
const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 min

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function shouldLogVisit(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = localStorage.getItem(LAST_VISIT_KEY);
    if (!last) return true;
    const lastTs = parseInt(last, 10);
    if (isNaN(lastTs)) return true;
    return Date.now() - lastTs > DEDUP_WINDOW_MS;
  } catch {
    return true;
  }
}

export default function VisitTracker() {
  useEffect(() => {
    if (!shouldLogVisit()) return;

    const visitorId = getOrCreateVisitorId();
    const payload = {
      path: window.location.pathname,
      visitor_id: visitorId,
      referrer: document.referrer || null,
    };

    // Fire and forget
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(() => {
        try {
          localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
        } catch {
          // no-op
        }
      })
      .catch(() => {
        // silencioso — no romper UX si falla el tracking
      });
  }, []);

  return null;
}
