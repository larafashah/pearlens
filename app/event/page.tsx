/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

export default function EventSetupPage() {
  const [eventId, setEventId] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const handleSuggestId = () => {
    if (!coupleNames) return;
    const slug = coupleNames
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const year = new Date().getFullYear();
    setEventId(`${slug}-${year}`);
  };

  const uploadUrl = eventId ? `${baseUrl}/upload?event=${eventId}` : "";
  const galleryUrl = eventId ? `${baseUrl}/gallery?event=${eventId}` : "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <section className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Pearlens Event Setup
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Couple&apos;s names
            </label>
            <input
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              placeholder="e.g. Adam & Lina"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={handleSuggestId}
              className="mt-2 text-xs text-blue-600 underline"
            >
              Suggest event ID from names
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Event ID (used in links)
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g. adam-lina-2025"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              This becomes the folder name in Firebase and part of the URL.
            </p>
          </div>

          <hr className="my-4" />

          <div>
            <h2 className="text-sm font-semibold mb-2">Guest upload link</h2>
            <input
              type="text"
              readOnly
              value={uploadUrl}
              className="w-full border rounded-md px-3 py-2 text-xs bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Put this in the QR code on table cards. Guests scan → upload page.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">
              Couple&apos;s gallery link
            </h2>
            <input
              type="text"
              readOnly
              value={galleryUrl}
              className="w-full border rounded-md px-3 py-2 text-xs bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Share this with the couple so they can view & download all photos.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">QR content</h2>
            <textarea
              readOnly
              value={uploadUrl}
              className="w-full border rounded-md px-3 py-2 text-xs bg-gray-50 h-16"
            />
            <p className="mt-1 text-xs text-gray-500">
              Paste this URL into any QR generator (Canva, websites, etc.).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
