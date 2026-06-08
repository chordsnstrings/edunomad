"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Pull-to-refresh for the student feeds/lists (CLAUDE.md §9). Triggers a soft
 * RSC refresh when the user pulls down from the top of the page.
 */
export function PullToRefresh() {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);

  useEffect(() => {
    function onStart(e: TouchEvent) {
      startY.current = window.scrollY <= 0 ? e.touches[0].clientY : null;
    }
    function onMove(e: TouchEvent) {
      if (startY.current === null) return;
      const d = e.touches[0].clientY - startY.current;
      const p = d > 0 ? Math.min(d * 0.5, 80) : 0;
      pullRef.current = p;
      setPull(p);
    }
    function onEnd() {
      if (startY.current === null) return;
      startY.current = null;
      if (pullRef.current > 55) {
        setRefreshing(true);
        setPull(40);
        router.refresh();
        setTimeout(() => {
          setRefreshing(false);
          setPull(0);
          pullRef.current = 0;
        }, 700);
      } else {
        setPull(0);
        pullRef.current = 0;
      }
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [router]);

  if (pull === 0 && !refreshing) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center"
      style={{ transform: `translateY(${Math.max(0, pull - 16)}px)` }}
    >
      <span className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-line bg-white">
        <Loader2 className={`h-4 w-4 text-navy ${refreshing ? "animate-spin" : ""}`} />
      </span>
    </div>
  );
}
