/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EventSetupPage() {
  const [eventId, setEventId] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [status, setStatus] = useState("");
  const [projectorEnabled, setProjectorEnabled] = useState(false);

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
    if (!displayName) {
      setDisplayName(coupleNames.trim());
    }
  };

  const uploadUrl = eventId ? `${baseUrl}/upload?event=${eventId}` : "";
  const galleryUrl = eventId ? `${baseUrl}/gallery?event=${eventId}` : "";

  const handleSave = async () => {
    if (!eventId) {
      setStatus("❌ Please enter an event ID before saving.");
      return;
    }
    try {
      setStatus("Saving event…");

      await setDoc(doc(db, "events", eventId), {
        eventId,
        coupleNames: coupleNames || null,
        displayName: displayName || coupleNames || eventId,
        projectorEnabled: projectorEnabled,
        createdAt: new Date().toISOString(),
      });

      setStatus("✅ Event saved. Use the links below for QR + gallery.");
    } catch (err) {
      console.error("[EVENT SAVE ERROR]", err);
      setStatus("❌ Could not save event. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6 md:p-8">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Pearlens Event Setup
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-700">
            Create a share link and gallery for each wedding or event.
          </p>
        </header>

        <div className="space-y-5">
          {/* Couple names */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Couple&apos;s names
            </label>
            <input
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              placeholder="e.g. Adam & Lina"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <button
              onClick={handleSuggestId}
              className="mt-1.5 text-xs md:text-sm text-black underline"
            >
              Suggest event ID from names
            </button>
          </div>

          {/* Display name (for watermark) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Display name for watermark
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. The Abedh Wedding • 2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              This exact text appears in the framed watermark on each photo.
            </p>
          </div>

          {/* Event ID */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Event ID (used in links)
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g. adam-lina-2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              Guests never see this. It becomes the folder name in Firebase and
              part of the URL.
            </p>
          </div>

          {/* Projector mode toggle */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="projectorEnabled"
              type="checkbox"
              checked={projectorEnabled}
              onChange={(e) => setProjectorEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-400 text-black focus:ring-black"
            />
            <div>
              <label
                htmlFor="projectorEnabled"
                className="text-sm font-medium text-gray-900"
              >
                Enable projector mode for this event
              </label>
              <p className="text-xs md:text-sm text-gray-600">
                When enabled, the gallery shows a full-screen slideshow button. Use
                this for packages that include “projector display” at the venue.
              </p>
            </div>
          </div>

          {/* Save button + status */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm md:text-base font-medium text-white hover:bg-gray-900"
            >
              Save event to Pearlens
            </button>
            {status && (
              <p className="mt-2 text-xs md:text-sm text-gray-800">
                {status}
              </p>
            )}
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Upload link */}
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
              Guest upload link
            </h2>
            <input
              type="text"
              readOnly
              value={uploadUrl}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs md:text-sm text-gray-900 bg-gray-50"
            />
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              Put this URL into the QR code on table cards. Guests scan → Open
              Camera & Upload page.
            </p>
          </div>

          {/* Gallery link */}
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
              Couple&apos;s gallery link
            </h2>
            <input
              type="text"
              readOnly
              value={galleryUrl}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs md:text-sm text-gray-900 bg-gray-50"
            />
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              Share this with the couple so they can view and download all
              event photos.
            </p>
          </div>

          {/* QR content */}
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
              QR content
            </h2>
            <textarea
              readOnly
              value={uploadUrl}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs md:text-sm text-gray-900 bg-gray-50 h-20"
            />
            <p className="mt-1 text-xs md:text-sm text-gray-600">
              Paste this into any QR generator (Canva, websites, printers).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
