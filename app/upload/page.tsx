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
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  // Read ?event= from URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("event") || "";
    setEventId(id);
  }, []);

  // Try to fetch displayName from Firestore (but don't block if it fails)
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setEventLoading(true);

      try {
        const refDoc = doc(db, "events", eventId);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          const data = snap.data() as any;
          if (data.displayName && data.displayName.trim().length > 0) {
            setDisplayName(data.displayName.trim());
          } else {
            setDisplayName(null);
          }
        } else {
          setDisplayName(null);
        }
      } catch (err) {
        console.error("[FETCH EVENT ERROR]", err);
        // If Firestore is blocked/offline, just fall back later
        setDisplayName(null);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Fallback: turn "ali-sarah-2025" into "Ali Sarah 2025"
  const getFallbackNameFromEventId = () => {
    if (!eventId) return "Pearlens Event";
    const cleaned = eventId.replace(/[-_]+/g, " ").trim();
    return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Draw photo with white frame + footer using Alex Brush
  const createFramedWatermarkedBlob = (
    file: File,
    watermarkText: string
  ) => {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Make sure Alex Brush font is loaded (from globals.css @import)
        if (typeof document !== "undefined" && (document as any).fonts?.load) {
          await (document as any).fonts.load("48px 'Alex Brush'");
        }

        const img = new Image();

        img.onload = () => {
          const maxWidth = 1600;
          let targetWidth = img.width;
          let targetHeight = img.height;

          if (targetWidth > maxWidth) {
            const ratio = maxWidth / targetWidth;
            targetWidth = maxWidth;
            targetHeight = targetHeight * ratio;
          }

          const framePadding = 40;
          const footerHeight = 80;

          const canvasWidth = targetWidth + framePadding * 2;
          const canvasHeight =
            targetHeight + framePadding * 2 + footerHeight;

          const canvas = document.createElement("canvas");
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No 2D context"));
            return;
          }

          // White background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          // Draw image
          ctx.drawImage(
            img,
            framePadding,
            framePadding,
            targetWidth,
            targetHeight
          );

          // Divider line
          ctx.strokeStyle = "#e5e5e5";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(framePadding, framePadding + targetHeight + 10);
          ctx.lineTo(
            canvasWidth - framePadding,
            framePadding + targetHeight + 10
          );
          ctx.stroke();

          // Alex Brush footer text (bottom-right)
          ctx.font = "48px 'Alex Brush'";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#222222";
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 3;

          const textWidth = ctx.measureText(watermarkText).width;
          const textX = canvasWidth - framePadding - textWidth;
          const textY =
            framePadding + targetHeight + footerHeight / 2;

          ctx.fillText(watermarkText, textX, textY);

          canvas.toBlob(
            (blob) => {
              if (!blob)
                reject(
                  new Error("Failed to create framed watermarked blob")
                );
              else resolve(blob);
            },
            "image/jpeg",
            0.9
          );
        };

        img.onerror = (err) => reject(err);
        img.src = URL.createObjectURL(file);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!eventId) {
      setStatus("Missing event ID. Please scan the correct QR code.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading...");

    const timestamp = Date.now();
    const path = `events/${eventId}/uploads/${timestamp}-${file.name}`;
    const fileRef = ref(storage, path);

    try {
      // Prefer Firestore displayName; if Firestore is blocked/offline,
      // fall back to cleaned eventId.
      const nameForWatermark =
        displayName && displayName.trim().length > 0
          ? displayName.trim()
          : getFallbackNameFromEventId();

      const framedBlob = await createFramedWatermarkedBlob(
        file,
        nameForWatermark
      );

      await uploadBytes(fileRef, framedBlob);
      setStatus("✔️ Photo uploaded! Upload another.");
    } catch (error) {
      console.error("[UPLOAD ERROR]:", error);
      setStatus("❌ Failed — please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const effectiveWatermarkName =
    displayName && displayName.trim().length > 0
      ? displayName.trim()
      : getFallbackNameFromEventId();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">
          Share Your Photos ✨
        </h1>

        <p className="text-sm text-gray-600 mb-1">
          Event ID:{" "}
          <span className="font-mono text-xs">
            {eventId || "(missing ?event= )"}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-4">
          Watermark name:{" "}
          <span className="font-semibold">
           {effectiveWatermarkName}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Your photos will appear in the couple’s private gallery with a
          framed, print-ready watermark.
        </p>

        <input
          id="pearlens-file-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        <label
          htmlFor="pearlens-file-input"
          className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white ${
            isUploading ? "bg-gray-400 cursor-wait" : "bg-black cursor-pointer"
          }`}
        >
          {isUploading ? "Uploading..." : "Open Camera & Upload"}
        </label>

        {status && (
          <p className="mt-4 text-sm text-gray-700">{status}</p>
        )}
      </section>
    </main>
  );
}
