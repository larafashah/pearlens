/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event") || "";

  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const folderRef = ref(storage, `events/${eventId}/uploads`);

    listAll(folderRef)
      .then(async (res) => {
        const urls = await Promise.all(
          res.items.map((item) => getDownloadURL(item))
        );
        setPhotos(urls);
      })
      .catch((err) => {
        console.error("Error loading gallery:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {eventId ? `Gallery: ${eventId}` : "Missing event"}
      </h1>

      {loading && <p className="text-center">Loading photos...</p>}

      {!loading && photos.length === 0 && (
        <p className="text-center text-gray-500">No photos yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((url, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white rounded-lg shadow-sm p-2"
          >
            <img
              src={url}
              alt={`Photo ${i + 1} from event ${eventId}`}
              className="w-full rounded-md mb-2"
            />
            <a
              href={url}
              download
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 underline"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
