export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-yellow-500 mb-4">
            Luxury Wedding Guest Gallery
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-4">
            Pearlens
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mb-8">
            A modern way to collect every moment from your wedding. Guests scan a
            discreet QR code at their table — you wake up to a curated gallery of
            everything they captured.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="/event"
              className="px-6 py-3 rounded-full bg-yellow-500 text-black text-sm font-medium tracking-wide hover:bg-yellow-400 transition"
            >
              Set up an event
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-full border border-gray-600 text-sm font-medium tracking-wide hover:border-yellow-500 hover:text-yellow-300 transition"
            >
              How it works
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-gray-400">
            <div>
              <p className="font-semibold text-white">No app download</p>
              <p>Guests simply scan and share.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Private gallery</p>
              <p>Only you and your planner receive the link.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Perfect for venues</p>
              <p>Elegant enough to sit on any ballroom table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-neutral-900 bg-[#050505] px-6 py-10"
      >
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            How Pearlens works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3 text-sm text-gray-300">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
                Step 1
              </p>
              <p className="font-medium text-white">We create your event ID</p>
              <p>
                Use the private <span className="text-yellow-400">/event</span>{" "}
                page to generate a custom link for your wedding.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
                Step 2
              </p>
              <p className="font-medium text-white">QR cards on each table</p>
              <p>
                We turn your upload link into minimal QR cards that sit
                discreetly on guest tables.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
                Step 3
              </p>
              <p className="font-medium text-white">You receive everything</p>
              <p>
                After the wedding, you&apos;ll receive access to a private
                gallery with every guest photo in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For couples & planners */}
      <section className="border-t border-neutral-900 bg-black px-6 py-10">
        <div className="w-full max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.2fr,1fr] text-sm">
          <div className="space-y-4 text-gray-300">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Designed for couples who care about the details
            </h3>
            <p>
              Pearlens is for couples who want their wedding to feel curated from
              the invitation to the last glass of champagne — including how they
              collect memories from their guests.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>No cluttered group chats or shared drives</li>
              <li>Simple, elegant experience for guests of any age</li>
              <li>All photos in one place, ready to download or share</li>
            </ul>
          </div>

          <div className="space-y-3 text-gray-300">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              For planners & venues
            </h3>
            <p>
              Add Pearlens as an elevated, tech-forward touch to your wedding
              packages without compromising your aesthetic.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Clean branding that fits luxury venues</li>
              <li>Easy to integrate into your timeline</li>
              <li>Custom QR card designs available</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact / footer */}
      <footer className="border-t border-neutral-900 bg-black px-6 py-6">
        <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400">
          <div>
            <p className="font-medium text-white">Booking & inquiries</p>
            <a
              href="mailto:hello@pearlens.com"
              className="text-yellow-400 hover:text-yellow-300"
            >
              hello@pearlens.com
            </a>
          </div>
          <p className="text-[0.7rem] sm:text-xs text-gray-500">
            Pearlens · A modern guest gallery for weddings & events
          </p>
        </div>
      </footer>
    </main>
  );
}
