/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GalleryPage() {
  const [eventId, setEventId] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Projector mode
  const [isProjector, setIsProjector] = useState(false);
  const [projectorSeconds] = useState(8);
  const [projectorAllowed, setProjectorAllowed] = useState(false);
  const [autoProjectorRequested, setAutoProjectorRequested] = useState(false);

  // Optional: display name from event doc later if you want
  const [eventDisplayName, setEventDisplayName] = useState<string | null>(null);

  // Read ?event= and ?projector= from URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("event") || "";
    setEventId(id);

    const proj = params.get("projector");
    if (proj === "1" || proj === "true") {
      setAutoProjectorRequested(true);
    }
  }, []);

  // Load event config from Firestore (projectorEnabled, displayName)
  useEffect(() => {
    if (!eventId) return;

    const loadConfig = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const snap = await getDoc(eventRef);
        if (snap.exists()) {
          const data = snap.data();
          setProjectorAllowed(!!data.projectorEnabled);
          if (data.displayName) {
            setEventDisplayName(data.displayName as string);
          }
        } else {
          setProjectorAllowed(false);
        }
      } catch (err) {
        console.error("[GALLERY EVENT CONFIG ERROR]", err);
        setProjectorAllowed(false);
      }
    };

    loadConfig();
  }, [eventId]);

  // Load images from Firebase Storage
  useEffect(() => {
    if (!eventId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const folderRef = ref(storage, `events/${eventId}/uploads`);
        const result = await listAll(folderRef);

        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item))
        );

        const sorted = urls.slice().sort();
        setPhotos(sorted);
      } catch (err: any) {
        console.error("[GALLERY LOAD ERROR]", err);
        setError("Unable to load photos for this event.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId]);

  // Auto-start projector if ?projector=1 and allowed and photos are loaded
  useEffect(() => {
    if (!autoProjectorRequested) return;
    if (!projectorAllowed) return;
    if (photos.length === 0) return;

    setSelectedIndex(0);
    setIsProjector(true);
  }, [autoProjectorRequested, projectorAllowed, photos.length]);

  // Projector auto-advance
  useEffect(() => {
    if (!isProjector || photos.length === 0) return;

    if (selectedIndex === null) {
      setSelectedIndex(0);
    }

    const intervalId = window.setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % photos.length;
      });
    }, projectorSeconds * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isProjector, photos.length, projectorSeconds, selectedIndex]);

  const handleThumbClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedIndex(null);
  };

  const goPrev = () => {
    if (selectedIndex === null || photos.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  const goNext = () => {
    if (selectedIndex === null || photos.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  const startProjector = () => {
    if (!projectorAllowed || photos.length === 0) return;
    setSelectedIndex(0);
    setIsProjector(true);
  };

  const stopProjector = () => {
    setIsProjector(false);
  };

  const prettyEventLabel = eventDisplayName
    ? eventDisplayName
    : eventId
    ? eventId
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "No Event Selected";

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 md:py-10">
      <section className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-4 md:p-6">
        {/* Header */}
        <header className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Pearlens Gallery
            </h1>
            <p className="text-sm md:text-base text-gray-700">
              Event:{" "}
              <span className="font-medium">
                {prettyEventLabel}
              </span>
            </p>
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              {photos.length > 0
                ? `${photos.length} photo${photos.length === 1 ? "" : "s"}`
                : "No photos uploaded yet."}
            </p>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-2">
            {projectorAllowed ? (
              <>
                <button
                  type="button"
                  onClick={startProjector}
                  disabled={photos.length === 0}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium ${
                    photos.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  Start projector mode
                </button>
                <p className="text-[11px] md:text-xs text-gray-500 text-right max-w-xs">
                  Use this on a projector or big screen. Images will auto-advance
                  every {projectorSeconds} seconds. You can also use Next / Previous.
                </p>
                {autoProjectorRequested && !projectorAllowed && (
                  <p className="text-[11px] text-red-500 text-right">
                    Projector URL requested, but projector is not enabled for this
                    event.
                  </p>
                )}
              </>
            ) : (
              <p className="text-[11px] md:text-xs text-gray-400 text-right max-w-xs">
                Projector mode is not enabled for this event package.
              </p>
            )}
          </div>
        </header>

        {/* Loading / error */}
        {loading && (
          <p className="text-sm text-gray-700">Loading photos…</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* Grid */}
        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {photos.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => handleThumbClick(index)}
                className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <p className="text-sm text-gray-700">
            No photos found yet for this event. Once guests start uploading,
            they will appear here automatically.
          </p>
        )}
      </section>

      {/* Normal viewer (thumbnail click) */}
      {selectedIndex !== null && !isProjector && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center px-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
            <button
              onClick={handleCloseViewer}
              className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white"
            >
              Close
            </button>

            <div className="flex-1 flex items-center justify-center">
              <img
                src={photos[selectedIndex]}
                alt={`Photo ${selectedIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-white text-xs md:text-sm">
              <button
                onClick={goPrev}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                ◀ Previous
              </button>
              <span>
                {selectedIndex + 1} / {photos.length}
              </span>
              <button
                onClick={goNext}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projector mode overlay */}
      {isProjector && photos.length > 0 && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="absolute top-3 left-4 text-xs md:text-sm text-gray-300">
            {prettyEventLabel} — {selectedIndex + 1} / {photos.length}
          </div>

          <div className="max-w-[95vw] max-h-[85vh] flex items-center justify-center">
            <img
              src={photos[selectedIndex]}
              alt={`Photo ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-[95vw] object-contain"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs md:text-sm text-gray-100">
            <button
              onClick={stopProjector}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              Exit projector
            </button>
            <button
              onClick={goPrev}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              ◀ Previous
            </button>
            <button
              onClick={goNext}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              Next ▶
            </button>
          </div>

          <div className="mt-2 text-[11px] text-gray-400">
            Auto-advancing every {projectorSeconds} seconds
          </div>
        </div>
      )}
    </main>
  );
}
