"use client";

import { useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function UploadHomePage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event") || "";

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenCamera = useCallback(() => {
    if (!eventId) {
      setStatus(
        "Missing event ID in URL. Please scan the correct QR code for this event."
      );
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [eventId]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !eventId) return;

      setIsUploading(true);
      setStatus("Uploading photo...");

      const timestamp = Date.now();
      const storagePath = `events/${eventId}/uploads/${timestamp}-${file.name}`;
      const storageRef = ref(storage, storagePath);

      console.log("Starting upload to:", storagePath);

      uploadBytes(storageRef, file)
        .then(() => {
          console.log("Upload finished");
          setStatus("✅ Photo uploaded! You can take another.");
        })
        .catch((error) => {
          console.error("Upload error:", error);
          setStatus("❌ Error uploading photo. Please try again.");
        })
        .finally(() => {
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        });
    },
    [eventId]
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="w-full max-w-md rounded-xl bg-white shadow-md p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Share Your Photos 📸</h1>

        <p className="text-sm text-gray-600 mb-2">
          Event ID: <span className="font-mono">{eventId || "none"}</span>
        </p>

        <p className="text-sm text-gray-600 mb-6">
          Take a photo or choose from your gallery and it will upload directly.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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

        <p className="mt-6 text-xs text-gray-500">
          Captured with love. Preserved with Pearlens.
        </p>
      </section>
    </main>
  );
}
