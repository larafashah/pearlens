"use client";

import { useState } from "react";
import Image from "next/image";

const steps = [
  {
    id: 1,
    label: "Scan",
    desc: "Guests scan a minimal QR card at their table - no app downloads or accounts needed.",
  },
  {
    id: 2,
    label: "Snap",
    desc: "They take photos and videos from their point of view and upload in seconds using their phone's browser.",
  },
  {
    id: 3,
    label: "Share",
    desc: "After the event, you receive access to one private gallery with every guest photo in one place.",
  },
];

const moments = [
  {
    title: "Wedding Receptions",
    desc: "Dance-floor candids, the laughter between courses, and the hugs you miss while you greet everyone.",
  },
  {
    title: "Engagement Parties",
    desc: "Champagne toasts, the ring reveal, and the reactions from friends seeing you two together.",
  },
  {
    title: "Private Events",
    desc: "Anniversaries, milestone birthdays, and intimate dinners captured without a camera crew.",
  },
];

export default function HomePage() {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsForm, setSmsForm] = useState({ phone: "", photoUrl: "" });
  const bgVideoUrl = process.env.NEXT_PUBLIC_BG_VIDEO_URL;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus("submitting");
    setFormMessage("Sending your inquiry...");

    const formData = new FormData(form);

    // Honeypot check
    if ((formData.get("website") as string) ?? "") {
      setFormStatus("success");
      setFormMessage("Thanks!"); // Silently ignore bots
      return;
    }

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setFormStatus("success");
      setFormMessage("Thanks! We received your inquiry and will reply soon.");
      form.reset();
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setFormMessage("Something went wrong. Please try again.");
    }
  };

  const handleSendText = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSmsStatus("sending");
    setSmsMessage("Sending your photo...");

    try {
      const response = await fetch("/api/send-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: smsForm.phone,
          photoUrl: smsForm.photoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSmsStatus("success");
      setSmsMessage("Text sent! Check your phone.");
      setSmsForm({ phone: "", photoUrl: "" });
    } catch (err) {
      console.error(err);
      setSmsStatus("error");
      setSmsMessage("Could not send the text. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f7f4ef] text-[#111] flex flex-col overflow-hidden">
      {/* Background layer (homepage only) */}
      {bgVideoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover -z-10 opacity-40"
          src={bgVideoUrl}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f7f4ef] via-[#f1e7da] to-[#f7f4ef]" />
      )}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-transparent to-white/50" />
      <div className="pointer-events-none absolute inset-0 z-0 animated-overlay opacity-80" />

      <div className="relative z-10 flex flex-col">
        {/* HEADER */}
        <header className="w-full border-b border-neutral-200 bg-[#f7f4ef]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-[150px] sm:w-[180px]">
              <Image
                src="/pearlens-logo.png"
                alt="Pearlens logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Nav (simple) */}
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about" className="border-b border-black pb-[2px]">
              About
            </a>
            <a href="#services" className="hover:text-neutral-700">
              How it works
            </a>
            <a href="#pricing" className="hover:text-neutral-700">
              Pricing
            </a>
            <a href="#contact" className="hover:text-neutral-700">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="about"
        className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center"
      >
        <div className="flex-1">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Guest Photo Sharing, Reimagined
          </p>
          <h1 className="mb-4 text-4xl font-serif leading-tight sm:text-5xl md:text-6xl">
            A simpler, more elegant way to save memories.
          </h1>
          <p className="max-w-xl text-sm text-neutral-700">
            Pearlens replaces bulky photobooths and cluttered group chats with a
            seamless guest gallery that blends into your event design.
          </p>
          <p className="mt-3 max-w-xl text-sm text-neutral-700">
            Guests capture the moments you don&apos;t see - you wake up to one
            private gallery, ready to download and share.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              Request a quote today
            </a>
            <span className="text-xs text-neutral-600">
              Or email{" "}
              <a href="mailto:hello@pearlens.com" className="underline">
                hello@pearlens.com
              </a>
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#e3d7c7] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              Pearlens Guest Gallery
            </p>
            <p className="text-lg font-serif">
              A modern guest gallery for weddings & events.
            </p>
            <p className="text-xs text-neutral-700">
              Discreet QR cards on each table, elegant holders, and optional
              selfie flashlights ensure every memory is captured - even when the
              lights are low.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[0.7rem] text-neutral-700">
              <div className="rounded-2xl bg-[#f7f4ef]/70 p-3">
                <p className="font-medium">For couples</p>
                <p className="mt-1">
                  Clear, candid memories from every guest, all in one link.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7f4ef]/70 p-3">
                <p className="font-medium">For planners & venues</p>
                <p className="mt-1">
                  A tech-forward detail that keeps your aesthetic intact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOMENTS SECTION */}
      <section className="border-t border-neutral-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-2xl font-serif">
            Moments we&apos;re built for
          </h2>
          <p className="mb-8 text-sm text-neutral-700 max-w-2xl">
            We capture the in-between - the real reactions, the surprise hugs,
            the late-night dance floor and the quiet details.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm text-neutral-800">
            {moments.map((item) => (
              <div key={item.title} className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
                <div className="aspect-[4/3] rounded-xl bg-[#e3d7c7]" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  {item.title}
                </p>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="services"
        className="border-t border-neutral-200 bg-white px-6 py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-2xl font-serif">How Pearlens works</h2>

          {/* Accordion steps */}
          <div>
            <div className="divide-y divide-neutral-200 border-t border-neutral-200">
              {steps.map((step) => (
                <div key={step.id} className="border-b border-neutral-200">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenStep(openStep === step.id ? null : step.id)
                    }
                    className="flex w-full items-center justify-between py-3"
                  >
                    <span className="flex-1 text-center font-medium">
                      {step.label}
                    </span>
                    <span
                      className={`text-xs transition-transform ${
                        openStep === step.id ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  {openStep === step.id && (
                    <p className="pb-4 text-sm text-neutral-700 text-center">
                      {step.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tagline + CTA under steps */}
          <div className="mt-10 space-y-4">
            <p className="text-sm sm:text-base text-neutral-800">
              Your Night. Your Guests. Their Lens.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              Request a quote today
            </a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="border-t border-neutral-200 bg-white px-6 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-2xl font-serif">Pricing</h2>
          <p className="mb-8 max-w-2xl text-sm text-neutral-700">
            Pricing depends on guest count, printed materials, and live display
            needs. We tailor every quote to your event.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm text-neutral-800">
            {/* Core */}
            <div className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Core Experience
              </p>
              <p className="font-medium">Digital Guest Gallery</p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-700">
                <li>- Custom event upload link</li>
                <li>- Unlimited guest uploads</li>
                <li>- Private gallery post-event</li>
              </ul>
            </div>

            {/* Printed */}
            <div className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Printed Details
              </p>
              <p className="font-medium">QR Cards + Flash Accessories</p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-700">
                <li>- QR cards for each table</li>
                <li>- Elegant table card holders</li>
                <li>- Phone-mounted selfie flashlights</li>
                <li>- Design matched to your event aesthetic</li>
              </ul>
            </div>

            {/* Premium */}
            <div className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Signature Display
              </p>
              <p className="font-medium">Live Projector Wall</p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-700">
                <li>- Real-time display of guest photos</li>
                <li>- Curated stream during speeches or party</li>
                <li>- Available with premium packages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="border-t border-neutral-200 bg-[#f7f4ef] px-6 py-16"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-serif">Let&apos;s capture every moment</h2>
          <p className="mb-8 text-sm text-neutral-700">
            Tell us a little about your event - we&apos;ll reach out with a custom
            quote.
          </p>

          <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              {["First Name", "Last Name"].map((label) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                    {label}
                  </label>
                  <input
                    name={label.toLowerCase().replace(" ", "")}
                    required
                    className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Event Type
                </label>
                <input
                  name="eventType"
                  placeholder="Wedding, engagement, etc."
                  required
                  className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Guest Count
                </label>
                <input
                  name="guestCount"
                  required
                  className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Venue + City
                </label>
                <input
                  name="venue"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Honeypot */}
            <div className="hidden">
              <label>
                Do not fill
                <input name="website" type="text" />
              </label>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                Special Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-black"
                placeholder="Lighting, planner contact, projector availability, etc."
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="mt-4 inline-flex rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900 transition-colors disabled:opacity-70"
            >
              {formStatus === "submitting" ? "Sending..." : "Submit Inquiry"}
            </button>

            {formMessage && (
              <p
                className={`text-sm ${
                  formStatus === "error" ? "text-red-600" : "text-green-700"
                }`}
              >
                {formMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-[#f7f4ef] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-center text-xs text-neutral-700 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>Pearlens - Guest galleries for weddings & events.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:gap-3 text-center sm:text-right">
            <span>Founder: Lara Fashah</span>
            <span className="text-neutral-400">•</span>
            <span>17 Friar Way, Wayne, NJ 07470</span>
            <span className="text-neutral-400">•</span>
            <a href="mailto:hello@pearlens.com" className="underline">
              hello@pearlens.com
            </a>
            <span>-</span>
            <span>(862) 686-3964</span>
            <span className="text-neutral-400">•</span>
            <a href="/privacy" className="underline">
              Privacy
            </a>
            <span className="text-neutral-400">•</span>
            <a href="/terms" className="underline">
              Terms
            </a>
          </div>
        </div>
      </footer>

      </div>

      <style jsx global>{`
        .animated-overlay {
          background-image:
            radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.85), transparent 60%),
            radial-gradient(1.2px 1.2px at 30% 40%, rgba(255, 255, 255, 0.85), transparent 60%),
            radial-gradient(1px 1px at 60% 15%, rgba(255, 255, 255, 0.78), transparent 60%),
            radial-gradient(1.4px 1.4px at 80% 50%, rgba(255, 255, 255, 0.82), transparent 60%),
            radial-gradient(1px 1px at 50% 80%, rgba(255, 255, 255, 0.76), transparent 60%),
            radial-gradient(1.3px 1.3px at 20% 70%, rgba(255, 255, 255, 0.8), transparent 60%),
            radial-gradient(1px 1px at 70% 30%, rgba(255, 255, 255, 0.82), transparent 60%);
          background-size: 200% 200%;
          mix-blend-mode: screen;
          animation: sparkleMove 18s linear infinite, sparkleTwinkle 2.3s ease-in-out infinite alternate;
        }
        @keyframes sparkleMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 50% 60%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        @keyframes sparkleTwinkle {
          0% {
            opacity: 0.5;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.55));
          }
          50% {
            opacity: 0.9;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.85));
          }
          100% {
            opacity: 0.5;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.55));
          }
        }
      `}</style>
    </main>
  );
}
