/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function UploadPage() {
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Read ?event= from the URL (NO useSearchParams)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ev = params.get("event") || "";
    setEventId(ev);
  }, []);

  const handleOpenCamera = () => {
    if (!eventId) {
      setStatus("Missing event ID. Please scan the correct QR code.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !eventId) return;

    setIsUploading(true);
    setStatus("Uploading...");

    const timestamp = Date.now();
    const path = `events/${eventId}/uploads/${timestamp}-${file.name}`;
    const fileRef = ref(storage, path);

    try {
      await uploadBytes(fileRef, file);
      setStatus("✅ Photo uploaded! You can take another.");
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("❌ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="w-full max-w-md bg-white shadow-md p-6 rounded-xl text-center">
        <h1 className="text-xl font-semibold mb-4">Share Your Photos 📸</h1>

        <p className="text-sm text-gray-600 mb-2">
          Event ID:{" "}
          <span className="font-mono">
            {eventId || "none – URL missing ?event="}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Take or choose a photo and it will upload instantly to the couple&apos;s
          private gallery.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          onClick={handleOpenCamera}
          disabled={isUploading}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            isUploading ? "bg-gray-400" : "bg-black"
          }`}
        >
          {isUploading ? "Uploading..." : "Open Camera & Upload"}
        </button>

        {status && (
          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
            {status}
          </p>
        )}

        <p className="mt-6 text-xs text-gray-400">
          Thank you for capturing memories with Pearlens.
        </p>
      </section>
    </main>
  );
}
