import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#111]">
      {/* Header / Nav */}
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

          {/* Nav */}
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about" className="border-b border-black pb-[2px]">
              About
            </a>
            <a href="#services" className="hover:text-neutral-700">
              Services
            </a>
            <a href="#pricing" className="hover:text-neutral-700">
              Pricing
            </a>
            <a href="#contact" className="hover:text-neutral-700">
              Contact
            </a>
          </nav>

          {/* Social (placeholders) */}
          <div className="hidden items-center gap-4 text-sm md:flex">
            <a href="https://instagram.com" className="hover:text-neutral-700">
              IG
            </a>
            <a href="https://x.com" className="hover:text-neutral-700">
              X
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
            Pearlens replaces bulky photobooths with a seamless, minimalist
            experience that blends into your event design.
          </p>
          <p className="mt-3 max-w-xl text-sm text-neutral-700">
            Guests capture the moments you miss — everything is saved to one
            private gallery for you.
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

        {/* Brand product card */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#e3d7c7] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              Pearlens Guest Gallery
            </p>
            <p className="text-lg font-serif">
              Your Night. Your Guests. Their Lens.
            </p>
            <p className="text-xs text-neutral-700">
              Discreet QR cards on each table, elegant holders, and optional
              selfie flashlights ensure every memory is captured — even when
              the lights are low.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[0.7rem] text-neutral-700">
              <div className="rounded-2xl bg-[#f7f4ef]/70 p-3">
                <p className="font-medium">For couples</p>
                <p className="mt-1">
                  Clear, stunning memories from every guest.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7f4ef]/70 p-3">
                <p className="font-medium">For planners</p>
                <p className="mt-1">
                  A tech-forward touch to elevate your service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moments / Showcase */}
      <section className="border-t border-neutral-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-2xl font-serif">
            Moments we&apos;re built for
          </h2>
          <p className="mb-8 text-sm text-neutral-700 max-w-2xl">
            We capture the in-between — the real reactions, the surprise hugs,
            the late-night dance circle.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm text-neutral-800">
            {["Wedding Receptions", "Engagement Parties", "Private Events"].map(
              (title, i) => (
                <div key={i} className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
                  <div className="aspect-[4/3] rounded-xl bg-[#e3d7c7]" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    {title}
                  </p>
                  <p>
                    Guests capture moments you don&apos;t — and you receive them
                    all, in one private gallery.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* How it Works + CTA */}
      <section
        id="services"
        className="border-t border-neutral-200 bg-white px-6 py-16"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr,1fr]">
          <div>
            <h2 className="mb-6 text-2xl font-serif">How it works</h2>

            {[
              {
                step: "Scan",
                desc:
                  "Guests scan a simple QR card at their table. No app downloads — just tap and go.",
              },
              {
                step: "Snap",
                desc:
                  "They take photos and videos from their perspective — the real, unforgettable moments.",
              },
              {
                step: "Share",
                desc:
                  "Everything instantly flows into your private gallery, ready to download and save.",
              },
            ].map(({ step, desc }) => (
              <div key={step} className="mb-4">
                <button className="flex w-full items-center justify-between border-b border-neutral-300 pb-3 text-left">
                  <span className="font-medium">{step}</span>
                  <span className="text-xs">▼</span>
                </button>
                <p className="mt-3 text-sm text-neutral-700">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Copy Block – constrained width, not a full bar */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm text-center lg:text-left">
              <p className="text-xl font-serif mb-3">
                Your Night. Your Guests. Their Lens.
              </p>
              <p className="text-sm text-neutral-700 mb-5">
                Keep the aesthetic intact while capturing every moment — from
                the quiet toasts to the wild dance floor.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
              >
                Request a quote today
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
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
                <li>• Custom event upload link</li>
                <li>• Unlimited guest uploads</li>
                <li>• Private gallery post-event</li>
              </ul>
            </div>

            {/* Printed */}
            <div className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Printed Details
              </p>
              <p className="font-medium">QR Cards + Flash Accessories</p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-700">
                <li>• QR cards for every table</li>
                <li>• Elegant table card holders</li>
                <li>• Phone-mounted selfie flashlights</li>
                <li>• Aesthetic-matched design</li>
              </ul>
            </div>

            {/* Premium */}
            <div className="space-y-2 rounded-2xl bg-[#f7f4ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Signature Display
              </p>
              <p className="font-medium">Live Projector Wall</p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-700">
                <li>• Real-time display of guest photos</li>
                <li>• Curated stream for speeches or party</li>
                <li>• Premium package upgrade</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        id="contact"
        className="border-t border-neutral-200 bg-[#f7f4ef] px-6 py-16"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-serif">Let’s capture every moment</h2>
          <p className="mb-8 text-sm text-neutral-700">
            Tell us a little about your event — we’ll reach out with a custom
            quote.
          </p>

          <form
            className="space-y-6 text-sm"
            action="mailto:hello@pearlens.com"
            method="post"
            encType="text/plain"
          >
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
              className="mt-4 inline-flex rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-[#f7f4ef] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-xs text-neutral-700 sm:flex-row sm:justify-between sm:text-left">
          <p>Your Night. Your Guests. Their Lens.</p>
          <div className="space-x-3">
            <a href="mailto:hello@pearlens.com" className="underline">
              hello@pearlens.com
            </a>
            <span>·</span>
            <span>(862) 686-3964</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
