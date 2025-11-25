"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setStatus(
        "Missing event ID in URL. Please use the QR code from the wedding."
      );
    }
  }, [eventId]);

  const handleOpenCamera = () => {
    if (!eventId) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !eventId) return;

    try {
      setIsUploading(true);
      setStatus("Uploading photo...");

      const timestamp = Date.now();
      const storagePath = `events/${eventId}/uploads/${timestamp}-${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      const uploadsCol = collection(db, "uploads");
      await addDoc(uploadsCol, {
        eventId,
        fileURL: downloadURL,
        storagePath,
        uploadedAt: serverTimestamp(),
        fileName: file.name,
        fileType: file.type,
      });

      setStatus("✅ Photo uploaded! You can take another.");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error uploading photo. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="w-full max-w-md rounded-xl bg-white shadow-md p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">
          {eventId ? "Share Your Photos 📸" : "Upload Error"}
        </h1>

        {eventId && (
          <p className="text-sm text-gray-600 mb-6">
            Thank you for celebrating with us! Take a photo and it will
            upload directly to the couple&apos;s private gallery.
          </p>
        )}

        {!eventId && (
          <p className="text-sm text-red-600 mb-6">
            This link is missing an event ID. Please scan the correct QR
            code from your table.
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {eventId && (
          <button
            onClick={handleOpenCamera}
            disabled={isUploading}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              isUploading ? "bg-gray-400" : "bg-black"
            }`}
          >
            {isUploading ? "Uploading..." : "Open Camera & Upload"}
          </button>
        )}

        {status && (
          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
            {status}
          </p>
        )}

        {eventId && (
          <p className="mt-6 text-xs text-gray-500">
            No app. No account. Just memories 💍
          </p>
        )}
      </section>
    </main>
  );
}
