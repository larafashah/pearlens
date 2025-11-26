/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function GalleryPage() {
  const [eventId, setEventId] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read ?event= from the URL, e.g. /gallery?event=test1122
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ev = params.get("event") || "";
    setEventId(ev);
  }, []);

  // Load images from Firebase Storage for this event
  useEffect(() => {
    const loadPhotos = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const folderRef = ref(storage, `events/${eventId}/uploads`);
        const result = await listAll(folderRef);

        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item))
        );

        setPhotos(urls);
      } catch (err: any) {
        console.error("[GALLERY] Error loading photos:", err);
        setError(err.message || "Failed to load photos.");
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [eventId]);

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <section className="w-full max-w-5xl mx-auto">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-2">
            Pearlens · Guest Gallery
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
            Event gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {eventId
              ? `Showing photos for event: ${eventId}`
              : "No event selected. Make sure the link includes ?event=..."}
          </p>
        </header>

        {loading && (
          <p className="text-sm text-gray-400 mb-4">Loading photos…</p>
        )}

        {error && (
          <p className="text-sm text-red-400 mb-4">
            Error loading photos: {error}
          </p>
        )}

        {!loading && !error && photos.length === 0 && eventId && (
          <p className="text-sm text-gray-400">
            No uploads yet for this event. Ask your guests to scan the QR code
            and share their photos.
          </p>
        )}

        {/* Simple masonry-style grid */}
        <div className="mt-4 columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {photos.map((url, idx) => (
            <div
              key={idx}
              className="break-inside-avoid overflow-hidden rounded-xl border border-neutral-900 bg-[#050505]"
            >
              <img
                src={url}
                alt={`photo-${idx}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
