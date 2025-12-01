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

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // For swipe gestures
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Read ?event=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setEventId(params.get("event") || "");
  }, []);

  // Load photos from Firebase Storage
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
        setError(err.message || "Failed to load photos.");
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [eventId]);

  const openLightbox = (idx: number) => setSelectedIndex(idx);
  const closeLightbox = () => {
    setSelectedIndex(null);
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const nextImage = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % photos.length
    );
  };

  const prevImage = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  };

  // Keyboard support: ESC to close, arrows to navigate
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, photos.length]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const threshold = 50; // px

    if (distance > threshold) {
      // swipe left → next
      nextImage();
    } else if (distance < -threshold) {
      // swipe right → prev
      prevImage();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <section className="w-full max-w-5xl mx-auto">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-2">
            Pearlens · Gallery
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
            Event Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {eventId
              ? `Event: ${eventId}`
              : "Missing event name. Check your link."}
          </p>
        </header>

        {loading && (
          <p className="text-sm text-gray-400">Loading photos…</p>
        )}

        {error && (
          <p className="text-sm text-red-400">Error: {error}</p>
        )}

        {!loading && !error && photos.length === 0 && (
          <p className="text-sm text-gray-400">
            No uploads yet. Ask guests to scan the QR code!
          </p>
        )}

        <div className="mt-4 columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {photos.map((url, idx) => (
            <div
              key={idx}
              className="cursor-pointer break-inside-avoid overflow-hidden rounded-lg border border-neutral-800 hover:opacity-90 transition"
              onClick={() => openLightbox(idx)}
            >
              <img src={url} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      {selectedIndex !== null && photos[selectedIndex] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            ×
          </button>

          {/* Prev Button */}
          {photos.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 text-4xl text-gray-300 select-none hidden sm:block"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={photos[selectedIndex]}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-lg"
          />

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 text-4xl text-gray-300 select-none hidden sm:block"
            >
              ›
            </button>
          )}

          {/* Download Button */}
          <a
            href={photos[selectedIndex]}
            download
            className="absolute bottom-6 px-6 py-2 rounded-lg bg-white text-black font-medium"
          >
            Download Photo
          </a>
        </div>
      )}
    </main>
  );
}
