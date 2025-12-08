"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { ChangeEvent } from "react";

// Ensure the Alex Brush font is loaded before drawing to canvas
let alexBrushFontPromise: Promise<void> | null = null;
const ensureAlexBrushFont = () => {
  if (typeof document === "undefined") return Promise.resolve();
  if (!("fonts" in document)) return Promise.resolve();
  if (alexBrushFontPromise) return alexBrushFontPromise;
  alexBrushFontPromise = document.fonts
    .load(`36px "Alex Brush"`)
    .then(() => undefined)
    .catch(() => undefined);
  return alexBrushFontPromise;
};

export default function UploadPage() {
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [watermarkReady, setWatermarkReady] = useState(false);
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [smsMessage, setSmsMessage] = useState("");
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [eventExists, setEventExists] = useState<boolean | null>(null);
  const [eventConfigLoaded, setEventConfigLoaded] = useState(false);

  const requiredPasscode = process.env.NEXT_PUBLIC_UPLOAD_PASSCODE;
  const [passcodeInput, setPasscodeInput] = useState("");
  const passcodeOk = !requiredPasscode || passcodeInput.trim() === requiredPasscode;

  // 1) Read ?event= from URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ev = params.get("event") || "";
    setEventId(ev);

    // Reset event state whenever eventId changes
    setDisplayName(null);
    setEventExists(null);
    setEventConfigLoaded(false);
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
          setEventExists(true);
        } else {
          setDisplayName(null);
          setEventExists(false);
        }
      } catch (err) {
        console.error("Error fetching displayName:", err);
        setDisplayName(null);
        setEventExists(false);
      } finally {
        setEventConfigLoaded(true);
      }
    };

    fetchName();
  }, [eventId]);

  // Preload watermark font
  useEffect(() => {
    ensureAlexBrushFont().then(() => setWatermarkReady(true));
  }, []);

  // 3) What to show in the UI for "Event: ..."
  const eventLabel = (() => {
    if (!eventId) return "Loading...";           // URL not parsed yet
    if (!eventConfigLoaded) return "Loading..."; // Still fetching config
    if (eventExists === false) return "Event not configured";
    if (displayName) return displayName;         // Pretty name from Firestore
    return eventId;                              // Show raw ID if no display name
  })();

  // 4) Watermark text - ONLY from displayName, never from eventId
  const getWatermark = () => {
    if (displayName) return displayName;
    return "Pearlens Guest Gallery"; // neutral fallback
  };

  // 5) Frame + watermark drawing
  const createFramedWatermarkedBlob = async (
    file: File,
    watermarkText: string
  ) => {
    await ensureAlexBrushFont();

    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
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

        // Watermark text uses Alex Brush (loaded via globals.css)
        ctx.font = `48px "Alex Brush", cursive`;
        ctx.fillStyle = "#222";
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 3;

        const textWidth = ctx.measureText(watermarkText).width;
        ctx.fillText(
          watermarkText,
          canvas.width - pad - textWidth,
          pad + h + footer / 2
        );

        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };
      img.src = objectUrl;
    });
  };

  // 6) Add files to queue
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    if (!eventId) {
      setStatus("Missing event ID. Scan the right QR code.");
      e.target.value = "";
      return;
    }

    if (!eventConfigLoaded) {
      setStatus("Validating event link. Please try again in a moment.");
      e.target.value = "";
      return;
    }

    if (eventExists === false) {
      setStatus("This event link is not configured. Please check with your host.");
      e.target.value = "";
      return;
    }

    if (!passcodeOk) {
      setStatus("Enter the host code to upload.");
      e.target.value = "";
      return;
    }

    setQueuedFiles((prev) => [...prev, ...files]);
    setStatus(
      `Added ${files.length} photo${files.length > 1 ? "s" : ""}. Queue: ${
        queuedFiles.length + files.length
      }.`
    );
    e.target.value = "";
  };

  // 7) Upload queued files
  const handleUploadQueued = async () => {
    if (queuedFiles.length === 0) {
      setStatus("Add at least one photo first.");
      return;
    }

    if (!eventId || !eventConfigLoaded || eventExists === false || !passcodeOk) {
      setStatus("Upload blocked. Check event link and host code.");
      return;
    }

    setIsUploading(true);
    setStatus(watermarkReady ? "Uploading..." : "Preparing watermark...");

    try {
      const watermark = getWatermark();
      let lastUrl: string | null = null;

      for (const file of queuedFiles) {
        const blob = await createFramedWatermarkedBlob(file, watermark);
        const timestamp = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
        const path = `events/${eventId}/uploads/${timestamp}.jpg`;
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, blob);
        lastUrl = await getDownloadURL(fileRef);
      }

      if (lastUrl) setLastPhotoUrl(lastUrl);
      setStatus(`Uploaded ${queuedFiles.length} photo${queuedFiles.length === 1 ? "" : "s"}!`);
      setQueuedFiles([]);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lastPhotoUrl) return;
    setSmsStatus("sending");
    setSmsMessage("Sending your photo...");

    try {
      const res = await fetch("/api/send-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, photoUrl: lastPhotoUrl }),
      });

      if (!res.ok) throw new Error("Failed");
      setSmsStatus("success");
      setSmsMessage("Text sent! Check your phone.");
      setPhone("");
    } catch (err) {
      console.error(err);
      setSmsStatus("error");
      setSmsMessage("Could not send the text. Please try again.");
    }
  };

  // 8) UI
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="w-full max-w-md bg-white shadow-md p-6 rounded-xl text-center">
        <h1 className="text-xl font-semibold mb-4">Share Your Photos</h1>

        <p className="text-sm text-gray-600 mb-2">
          Event:{" "}
          <span className="font-mono">
            {eventLabel}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Snap or choose a photo. It uploads instantly!
        </p>

        {requiredPasscode && (
          <div className="mb-4 text-left">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Host code
            </label>
            <input
              type="password"
              value={passcodeInput}
              onChange={(ev) => setPasscodeInput(ev.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Enter code"
            />
            {!passcodeOk && (
              <p className="mt-1 text-xs text-red-600">
                Enter the host-provided code to upload.
              </p>
            )}
          </div>
        )}

        <input
          id="file-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        <div className="space-y-2">
          <label
            htmlFor="file-input"
            className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white ${
              isUploading ? "bg-gray-400 cursor-wait" : "bg-black cursor-pointer"
            }`}
          >
            {isUploading ? "Uploading..." : "Add another photo"}
          </label>

          <button
            type="button"
            onClick={handleUploadQueued}
            disabled={isUploading || queuedFiles.length === 0}
            className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white ${
              queuedFiles.length === 0 || isUploading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isUploading
              ? "Uploading..."
              : queuedFiles.length === 0
              ? "Upload queued photos"
              : `Upload ${queuedFiles.length} photo${queuedFiles.length === 1 ? "" : "s"}`}
          </button>
        </div>

        {status && <p className="mt-4 text-sm">{status}</p>}

        {lastPhotoUrl && (
          <div className="mt-6 border-t pt-6 text-left">
            <p className="text-sm font-medium mb-2">Text this photo to yourself</p>
            <p className="text-xs text-gray-600 mb-3">
              Enter your number to receive the watermarked photo. Message/data rates may apply.
            </p>
            <form className="space-y-3" onSubmit={handleSendText}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1..."
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                type="submit"
                disabled={smsStatus === "sending"}
                className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors disabled:opacity-70"
              >
                {smsStatus === "sending" ? "Sending..." : "Text me this photo"}
              </button>
              {smsMessage && (
                <p
                  className={`text-sm ${
                    smsStatus === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {smsMessage}
                </p>
              )}
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
