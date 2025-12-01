/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function EventSetupPage() {
  const [eventId, setEventId] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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
    const suggested = `${slug}-${year}`;
    setEventId(suggested);

    if (!displayName) {
      const pretty = coupleNames
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setDisplayName(pretty);
    }
  };

  const uploadUrl = eventId ? `${baseUrl}/upload?event=${eventId}` : "";
  const galleryUrl = eventId ? `${baseUrl}/gallery?event=${eventId}` : "";

  const handleSaveEvent = async () => {
    setSaveMessage("");

    if (!eventId || !displayName) {
      setSaveMessage("Please fill in Event ID and Display Name.");
      return;
    }

    try {
      setSaving(true);
      await setDoc(doc(db, "events", eventId), {
        eventId,
        displayName,
        coupleNames,
        createdAt: serverTimestamp(),
      });
      setSaveMessage("✅ Event saved. Use the links below for QR and gallery.");
    } catch (err: any) {
      console.error("[EVENT SAVE ERROR]", err);
      setSaveMessage(`❌ Failed to save event: ${err.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <section className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Pearlens · Event Setup
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Couple&apos;s names (for your reference)
            </label>
            <input
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              placeholder="e.g. Ali & Sarah"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={handleSuggestId}
              className="mt-2 text-xs text-blue-600 underline"
            >
              Suggest Event ID & Display Name
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Event ID (used in links & storage)
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g. ali-sarah-2025"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              No spaces. Use letters, numbers, dashes (e.g. ali-sarah-2025).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Display name (for watermark & gallery)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Ali & Sarah Wedding"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              This exact text will appear in the watermark frame (no &quot;The&quot;
              added automatically).
            </p>
          </div>

          <button
            onClick={handleSaveEvent}
            disabled={saving}
            className={`w-full py-2.5 rounded-lg text-sm font-medium text-white ${
              saving ? "bg-gray-500" : "bg-black"
            }`}
          >
            {saving ? "Saving..." : "Save event to Pearlens"}
          </button>

          {saveMessage && (
            <p className="text-xs mt-2 text-gray-700 whitespace-pre-line">
              {saveMessage}
            </p>
          )}

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
        </div>
      </section>
    </main>
  );
}
