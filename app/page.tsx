export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#111]">
      {/* Header / Nav */}
      <header className="w-full border-b border-neutral-200 bg-[#f7f4ef]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black">
              <span className="text-xs font-semibold tracking-[0.15em]">
                P
              </span>
            </div>
            <span className="text-lg font-semibold tracking-[0.3em] uppercase">
              Pearlens
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about" className="border-b border-black pb-[2px]">
              About
            </a>
            <a href="#services" className="hover:text-neutral-700">
              Services
            </a>
            <a href="#contact" className="hover:text-neutral-700">
              Contact
            </a>
          </nav>

          {/* Social placeholders */}
          <div className="hidden items-center gap-4 text-sm md:flex">
            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-neutral-700"
            >
              IG
            </a>
            <a
              href="https://x.com"
              target="_blank"
              className="hover:text-neutral-700"
            >
              X
            </a>
          </div>
        </div>
      </header>

      {/* Hero / About */}
      <section
        id="about"
        className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center"
      >
        <div className="flex-1">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Guest Photo Sharing, Reimagined
          </p>
          <h1 className="mb-6 text-4xl leading-tight font-serif sm:text-5xl md:text-6xl">
            A simpler, more elegant way to save memories.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-700">
            Pearlens was created to elevate how we capture life&apos;s biggest
            moments. By giving guests a simple way to take photos and instantly
            share them, we replace the bulky, outdated photobooth with a
            seamless experience that blends right into your event design.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-700">
            From weddings to private celebrations, we&apos;re here to make sure
            every memory is captured — beautifully.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900"
            >
              Request a quote today
            </a>
            <span className="text-xs text-neutral-600">
              Or email us at{" "}
              <a
                href="mailto:hello@pearlens.com"
                className="underline underline-offset-2"
              >
                hello@pearlens.com
              </a>
            </span>
          </div>
        </div>

        {/* Right-side visual placeholder */}
        <div className="flex-1">
          <div className="aspect-[4/5] w-full rounded-3xl bg-[#e3d7c7]" />
        </div>
      </section>

      {/* Services / How It Works */}
      <section
        id="services"
        className="border-t border-neutral-200 bg-white px-6 py-16"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr,1fr]">
          <div>
            <h2 className="mb-6 text-2xl font-serif">How It Works</h2>

            <div className="space-y-6 text-sm text-neutral-800">
              <div>
                <button className="flex w-full items-center justify-between border-b border-neutral-300 pb-3 text-left">
                  <span className="font-medium">Scan</span>
                  <span className="text-xs">▼</span>
                </button>
                <p className="mt-3 text-neutral-700">
                  Guests scan a discreet QR code at their table. No app
                  downloads, no accounts, just a camera and a tap.
                </p>
              </div>

              <div>
                <button className="flex w-full items-center justify-between border-b border-neutral-300 pb-3 text-left">
                  <span className="font-medium">Snap</span>
                  <span className="text-xs">▼</span>
                </button>
                <p className="mt-3 text-neutral-700">
                  They capture the moments you don&apos;t see — quiet toasts,
                  candid laughs, and everything in between.
                </p>
              </div>

              <div>
                <button className="flex w-full items-center justify-between border-b border-neutral-300 pb-3 text-left">
                  <span className="font-medium">Share</span>
                  <span className="text-xs">▼</span>
                </button>
                <p className="mt-3 text-neutral-700">
                  Photos flow into a private gallery that only you receive,
                  ready to download, favorite, and share.
                </p>
              </div>
            </div>
          </div>

          {/* Simple CTA block */}
          <div className="flex flex-col items-start justify-between gap-6 text-left md:items-start">
            <p className="text-xl font-serif">
              Your Night. Your Guests. Their Lens.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900"
            >
              Request a quote today
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-neutral-200 bg-[#f7f4ef] px-6 py-16"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-serif">Pearlens Event Inquiry Form</h2>
          <p className="mb-8 text-sm text-neutral-700">
            Tell us a bit about your event and we&apos;ll be in touch with a
            custom quote.
          </p>

          <form
            className="space-y-6 text-sm"
            action="mailto:hello@pearlens.com"
            method="post"
            encType="text/plain"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  First Name
                </label>
                <input
                  name="firstName"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Last Name
                </label>
                <input
                  name="lastName"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Type of Event
                </label>
                <input
                  name="eventType"
                  placeholder="Wedding, engagement, etc."
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Date of Event
                </label>
                <input
                  type="date"
                  name="eventDate"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Estimated Guest Count
                </label>
                <input
                  name="guestCount"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                  Venue Name &amp; City
                </label>
                <input
                  name="venue"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-600">
                Load-in Time &amp; Event Start Time
              </label>
              <textarea
                name="timing"
                rows={3}
                className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-neutral-900"
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
            <a
              href="mailto:hello@pearlens.com"
              className="underline underline-offset-2"
            >
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
