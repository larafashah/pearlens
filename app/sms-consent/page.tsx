"use client";

export default function SmsConsentPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 px-4 py-10 flex justify-center">
      <section className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">SMS Consent</h1>
        <p className="text-sm text-neutral-700">
          By requesting a photo via SMS from Pearlens, you agree to receive a one-time text message containing a link to
          your photo.
        </p>
        <div className="space-y-3 text-sm text-neutral-800">
          <div>
            <h2 className="font-medium">What you&apos;ll receive</h2>
            <p>A single message with a link to the photo you selected. No recurring messages.</p>
          </div>
          <div>
            <h2 className="font-medium">Message frequency</h2>
            <p>One-time per request (only when you submit your number to receive a photo).</p>
          </div>
          <div>
            <h2 className="font-medium">Charges</h2>
            <p>Message and data rates may apply.</p>
          </div>
          <div>
            <h2 className="font-medium">Opt-out</h2>
            <p>Reply STOP to opt out of further messages.</p>
          </div>
          <div>
            <h2 className="font-medium">Help</h2>
            <p>Reply HELP for assistance, or contact hello@pearlens.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
