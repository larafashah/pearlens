/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UploadPage() {
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [eventConfigLoaded, setEventConfigLoaded] = useState(false);

  // 1) Read ?event= from URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ev = params.get("event") || "";
    setEventId(ev);
  }, []);

  // 2) Load displayName from Firestore (if it exists)
  useEffect(() => {
    if (!eventId) return;

    const fetchName = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.displayName || null);
        } else {
          setDisplayName(null);
        }
      } catch (err) {
        console.error("Error fetching displayName:", err);
        setDisplayName(null);
      } finally {
        setEventConfigLoaded(true);
      }
    };

    fetchName();
  }, [eventId]);

  // 3) What to show in the UI for "Event: ..."
  const eventLabel = (() => {
    if (!eventId) return "Loading…";               // URL not parsed yet
    if (!eventConfigLoaded) return "Loading…";     // Still fetching config
    if (displayName) return displayName;           // Pretty name from Firestore
    return "Event not configured";                 // We have an eventId but no doc
  })();

  // 4) Watermark text – ONLY from displayName, never from eventId
  const getWatermark = () => {
    if (displayName) return displayName;
    return "Pearlens Guest Gallery"; // neutral fallback
  };

  // 5) Frame + watermark drawing
  const createFramedWatermarkedBlob = (
    file: File,
    watermarkText: string
  ) => {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 1600;
        let w = img.width;
        let h = img.height;

        if (w > maxWidth) {
          const r = maxWidth / w;
          w = maxWidth;
          h = h * r;
        }

        const pad = 40;
        const footer = 80;
        const canvas = document.createElement("canvas");
        canvas.width = w + pad * 2;
        canvas.height = h + pad * 2 + footer;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No 2D context");

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Photo
        ctx.drawImage(img, pad, pad, w, h);

        // Divider line above footer
        ctx.strokeStyle = "#e5e5e5";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, pad + h + 10);
        ctx.lineTo(canvas.width - pad, pad + h + 10);
        ctx.stroke();

        // Watermark text – uses Alex Brush (loaded via globals.css)
        ctx.font = `36px "Alex Brush", cursive`;
        ctx.fillStyle = "#222";
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 2;

        const textWidth = ctx.measureText(watermarkText).width;
        ctx.fillText(
          watermarkText,
          canvas.width - pad - textWidth,
          pad + h + footer / 2
        );

        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // 6) Upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!eventId) {
      setStatus("Missing event ID. Scan the right QR code.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading...");

    try {
      const watermark = getWatermark();
      const blob = await createFramedWatermarkedBlob(file, watermark);

      const timestamp = Date.now();
      const path = `events/${eventId}/uploads/${timestamp}.jpg`;

      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, blob);

      setStatus("✅ Uploaded! Take another.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // 7) UI
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="w-full max-w-md bg-white shadow-md p-6 rounded-xl text-center">
        <h1 className="text-xl font-semibold mb-4">
          Share Your Photos <span role="img" aria-label="camera">📸</span>
        </h1>

        <p className="text-sm text-gray-600 mb-2">
          Event:{" "}
          <span className="font-mono">
            {eventLabel}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Snap or choose a photo. It uploads instantly!
        </p>

        <input
          id="file-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        <label
          htmlFor="file-input"
          className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white ${
            isUploading ? "bg-gray-400 cursor-wait" : "bg-black cursor-pointer"
          }`}
        >
          {isUploading ? "Uploading..." : "Open Camera & Upload"}
        </label>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </section>
    </main>
  );
}
