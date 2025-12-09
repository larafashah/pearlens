"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function GalleryPage() {
  const [eventId, setEventId] = useState("");
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSavingImages, setIsSavingImages] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

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
    const canShareFiles =
      typeof navigator !== "undefined" &&
      typeof File !== "undefined" &&
      !!navigator.canShare &&
      (() => {
        try {
          return navigator.canShare({
            files: [new File([""], "test.txt", { type: "text/plain" })],
          });
        } catch {
          return false;
        }
      })();
    setShareSupported(canShareFiles);

    const updateIsMobile = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 768);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    const proj = params.get("projector");
    if (proj === "1" || proj === "true") {
      setAutoProjectorRequested(true);
    }
    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
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
  const loadPhotos = useCallback(async () => {
    if (!eventId) return;
    setError(null);
    setLoading(true);
    setDownloadError(null);
    setActionMessage(null);
    try {
      const folderRef = ref(storage, `events/${eventId}/uploads`);
      const result = await listAll(folderRef);

      const sortedItems = result.items
        .slice()
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );

      const photoEntries = await Promise.all(
        sortedItems.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, name: item.name };
        })
      );

      setPhotos(photoEntries);
      setSelectedIndices(new Set());
    } catch (err) {
      console.error("[GALLERY LOAD ERROR]", err);
      setError("Unable to load photos for this event.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Poll for new photos every 30 seconds only while projector is active
  useEffect(() => {
    if (!eventId || !isProjector) return;
    const interval = window.setInterval(() => {
      if (!isRefreshing && !loading) {
        setIsRefreshing(true);
        loadPhotos();
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [eventId, isProjector, isRefreshing, loading, loadPhotos]);

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

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
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

  const refresh = () => {
    setIsRefreshing(true);
    loadPhotos();
  };

  const fetchPhotoBlob = async (photoIndex: number) => {
    const photo = photos[photoIndex];
    if (!photo) throw new Error("Photo not found");
    const response = await fetch(photo.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${photo.name}`);
    }
    return response.blob();
  };

  const downloadSelected = async () => {
    if (selectedIndices.size === 0 || photos.length === 0) return;
    setDownloadError(null);
    setActionMessage(null);
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const tasks = Array.from(selectedIndices).map(async (idx) => {
        const photo = photos[idx];
        if (!photo) return;
        const blob = await fetchPhotoBlob(idx);
        const fileName = photo.name || `photo-${idx + 1}.jpg`;
        zip.file(fileName, blob);
      });

      await Promise.all(tasks);
      const content = await zip.generateAsync({ type: "blob" });
      const fileLabel = prettyEventLabel
        ? prettyEventLabel.replace(/\s+/g, "-").toLowerCase()
        : "gallery";
      saveAs(content, `${fileLabel}-photos.zip`);
      setActionMessage("ZIP ready in your downloads.");
    } catch (err) {
      console.error("[GALLERY DOWNLOAD ERROR]", err);
      setDownloadError("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const saveSelectedImages = async () => {
    if (selectedIndices.size === 0 || photos.length === 0) return;
    setDownloadError(null);
    setActionMessage(null);
    setIsSavingImages(true);
    try {
      for (const idx of Array.from(selectedIndices)) {
        const blob = await fetchPhotoBlob(idx);
        const photo = photos[idx];
        const name = photo?.name || `photo-${idx + 1}.jpg`;
        saveAs(blob, name);
      }
      setActionMessage("Saved to device (check Photos/Files).");
    } catch (err) {
      console.error("[GALLERY SAVE IMAGES ERROR]", err);
      setDownloadError("Save failed. Please try again.");
    } finally {
      setIsSavingImages(false);
    }
  };

  const shareSelected = async () => {
    if (!shareSupported || selectedIndices.size === 0 || photos.length === 0) {
      return;
    }
    setDownloadError(null);
    setActionMessage(null);
    setIsSharing(true);
    try {
      const files = await Promise.all(
        Array.from(selectedIndices).map(async (idx) => {
          const blob = await fetchPhotoBlob(idx);
          const photo = photos[idx];
          const name = photo?.name || `photo-${idx + 1}.jpg`;
          return new File([blob], name, { type: blob.type || "image/jpeg" });
        })
      );

      await navigator.share({
        files,
        title: prettyEventLabel || "Gallery",
        text: "Selected photos",
      });
      setActionMessage("Shared to device (save to Photos).");
    } catch (err) {
      console.error("[GALLERY SHARE ERROR]", err);
      setDownloadError("Share failed. You can try download instead.");
    } finally {
      setIsSharing(false);
    }
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
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-[110px] md:h-8 md:w-[140px]">
                <Image
                  src="/pearlens-logo.png"
                  alt="Pearlens"
                  fill
                  className="object-contain"
                  sizes="140px"
                  priority
                />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Gallery
              </h1>
            </div>
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
        {(loading || isRefreshing) && (
          <div className="text-sm text-gray-700 mb-4">Loading photos...</div>
        )}
        {error && (
          <div className="flex items-center justify-between mb-4 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={refresh}
              className="rounded bg-red-50 px-3 py-1 text-red-700"
            >
              Retry
            </button>
          </div>
        )}
        {!error && !loading && (
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-xs text-gray-600">
              {selectedIndices.size > 0
                ? `${selectedIndices.size} photo${selectedIndices.size === 1 ? "" : "s"} selected`
                : "Select photos to download or share"}
              {downloadError && (
                <span className="ml-2 text-red-600">{downloadError}</span>
              )}
              {actionMessage && (
                <span className="ml-2 text-green-600">{actionMessage}</span>
              )}
            </div>
            <div className="text-[11px] text-gray-500">
              {shareSupported
                ? "Tip: On iPhone, use Share to save to Photos."
                : "Tip: Use Save on mobile; ZIP works best on desktop."}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {shareSupported && (
                <button
                  type="button"
                  onClick={shareSelected}
                  disabled={selectedIndices.size === 0 || isSharing}
                  className={`text-xs rounded-full px-3 py-1 border ${
                    selectedIndices.size === 0 || isSharing
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {isSharing ? "Sharing..." : "Share to device"}
                </button>
              )}
              {isMobile && !shareSupported && (
                <button
                  type="button"
                  onClick={saveSelectedImages}
                  disabled={selectedIndices.size === 0 || isSavingImages}
                  className={`text-xs rounded-full px-3 py-1 border ${
                    selectedIndices.size === 0 || isSavingImages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {isSavingImages ? "Saving..." : "Save images"}
                </button>
              )}
              <button
                type="button"
                onClick={downloadSelected}
                disabled={selectedIndices.size === 0 || isDownloading}
                className={`text-xs rounded-full px-3 py-1 border ${
                  selectedIndices.size === 0 || isDownloading
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:border-gray-500"
                }`}
              >
                {isDownloading ? "Preparing..." : "Download as ZIP"}
              </button>
              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className={`text-xs rounded-full px-3 py-1 border ${
                  isRefreshing
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover-border-gray-500"
                }`}
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {photos.map((photo, index) => (
              <button
                key={photo.url}
                type="button"
                onClick={() => handleThumbClick(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${
                  selectedIndices.has(index) ? "ring-2 ring-black" : ""
                }`}
              >
                <button
                  type="button"
                  aria-label={
                    selectedIndices.has(index)
                      ? "Deselect photo"
                      : "Select photo for download"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(index);
                  }}
                  className={`absolute top-2 left-2 z-10 h-7 w-7 rounded-md border flex items-center justify-center text-xs font-semibold ${
                    selectedIndices.has(index)
                      ? "bg-black text-white border-black"
                      : "bg-white/80 text-gray-700 border-gray-200"
                  }`}
                >
                  {selectedIndices.has(index) ? "✓" : "+"}
                </button>
                <Image
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 180px, (min-width: 768px) 160px, 32vw"
                  className="object-cover"
                  unoptimized
                  priority={index < 6}
                />
              </button>
            ))}
          </div>
        )}

        {loading && photos.length === 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg bg-gray-100 animate-pulse"
              />
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
        <div
          className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center px-4"
          onClick={handleCloseViewer}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseViewer}
              className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white"
            >
              Close
              </button>

              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={photos[selectedIndex].url}
                    alt={`Photo ${selectedIndex + 1}`}
                    fill
                    sizes="(min-width: 1024px) 1024px, 90vw"
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              </div>

            <div className="mt-3 flex items-center justify-between text-white text-xs md:text-sm">
              <button
                onClick={handleCloseViewer}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                Close
              </button>
              <button
                onClick={goPrev}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                Previous
              </button>
              <span>
                {selectedIndex + 1} / {photos.length}
              </span>
              <button
                onClick={goNext}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projector mode overlay */}
      {isProjector && photos.length > 0 && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="absolute top-3 left-4 text-xs md:text-sm text-gray-300">
            {prettyEventLabel} - {selectedIndex + 1} / {photos.length}
          </div>

          <div className="max-w-[95vw] max-h-[85vh] flex items-center justify-center">
            <div className="relative w-[95vw] h-[85vh]">
              <Image
                src={photos[selectedIndex].url}
                alt={`Photo ${selectedIndex + 1}`}
                fill
                sizes="95vw"
                className="object-contain"
                unoptimized
              />
            </div>
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
              Previous
            </button>
            <button
              onClick={goNext}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              Next
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
