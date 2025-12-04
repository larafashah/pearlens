"use client";
import { useState } from "react";

const steps = [
  {
    id: 1,
    label: "Scan",
    desc: "Guests scan a minimal QR card at their table — no app downloads or accounts needed.",
  },
  {
    id: 2,
    label: "Snap",
    desc: "Guests take photos and upload directly using their phone’s camera. They only see their own images — making the experience private.",
  },
  {
    id: 3,
    label: "Share",
    desc: "After the wedding, you receive access to a private gallery with every photo in one place.",
  },
];

export default function HomePage() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <main className="min-h-screen flex flex-col bg-white text-black">
      
      {/* HERO */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <img
            src="/pearlens-logo.png"
            alt="Pearlens logo"
            className="w-52 mx-auto mb-8"
          />

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-4">
            A Modern Guest Photo Gallery
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto mb-10">
            Give your guests a simple, elegant way to share every moment —
            without apps or group chats. Their lens becomes your gallery.
          </p>

          <a
            href="#services"
            className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-900 transition"
          >
            How it Works
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="services" className="px-6 py-20 border-t border-neutral-200 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif mb-10">
            How Pearlens works
          </h2>

          {/* Accordion */}
          <div className="text-left">
            <div className="divide-y divide-neutral-200 border-neutral-200 border-t">
              {steps.map((step) => (
                <div key={step.id} className="border-b border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setOpenStep(openStep === step.id ? null : step.id)}
                    className="flex w-full items-center justify-between py-3 text-left focus:outline-none"
                  >
                    <span className="font-medium">{step.label}</span>
                    <span
                      className={`text-xs transition-transform ${
                        openStep === step.id ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {openStep === step.id && (
                    <p className="pb-4 text-sm text-neutral-700">{step.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tagline + CTA */}
          <div className="mt-10 space-y-4">
            <p className="text-base font-medium tracking-wide">
              Your Night. Your Guests. Their Lens.
            </p>

            <a
              href="#contact"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm hover:bg-neutral-900 transition-colors"
            >
              Request a Quote Today
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <p className="font-medium text-white">Booking & Inquiries</p>
            <a
              href="mailto:hello@pearlens.com"
              className="text-white underline hover:opacity-75"
            >
              hello@pearlens.com
            </a>
          </div>
          <p className="text-neutral-400 text-[0.7rem] sm:text-xs">
            Pearlens — Guest Photo Sharing for Luxury Weddings
          </p>
        </div>
      </footer>

    </main>
  );
}
