"use client";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 px-4 py-10 flex justify-center">
      <section className="w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold">Terms & Conditions</h1>

        <div className="space-y-4 text-sm text-neutral-800">
          <div>
            <h2 className="font-medium">Service</h2>
            <p>Pearlens provides guest-upload galleries for events. Use is for lawful purposes only.</p>
          </div>

          <div>
            <h2 className="font-medium">Uploads</h2>
            <p>You are responsible for the content you upload. Do not upload illegal, abusive, or infringing material. We may remove content that violates these terms.</p>
          </div>

          <div>
            <h2 className="font-medium">SMS/MMS</h2>
            <p>We send one-time SMS/MMS messages only when you request a photo link. Message/data rates may apply. Reply STOP to opt out; HELP for assistance.</p>
          </div>

          <div>
            <h2 className="font-medium">Availability</h2>
            <p>We aim for reliable service but do not guarantee uninterrupted access. We may update or suspend features as needed.</p>
          </div>

          <div>
            <h2 className="font-medium">Liability</h2>
            <p>Pearlens is provided “as is.” To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from use of the service.</p>
          </div>

          <div>
            <h2 className="font-medium">Contact</h2>
            <p>Questions about these terms? Contact hello@pearlens.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
