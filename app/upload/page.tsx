/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function UploadPage() {
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setEventId(params.get("event") || "");
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("[UPLOAD] No file selected");
      return;
    }

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
      await uploadBytes(fileRef, file);
      setStatus("✅ Photo uploaded! You can take another.");
    } catch (error) {
      console.error("[UPLOAD] Error uploading:", error);
      setStatus(`❌ Upload failed: ${error.message || "Unknown error"}`);
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

        {/* Hidden real file input */}
        <input
          id="pearlens-file-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        {/* Pretty button that triggers the input */}
        <label
          htmlFor="pearlens-file-input"
          className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white ${
            isUploading ? "bg-gray-400 cursor-wait" : "bg-black cursor-pointer"
          }`}
        >
          {isUploading ? "Uploading..." : "Open Camera & Upload"}
        </label>

        {status && (
          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
            {status}
          </p>
        )}

        <p className="mt-6 text-xs text-gray-400">
          Captured with love. Preserved with Pearlens.
        </p>
      </section>
    </main>
  );
}
