"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 px-4 py-10 flex justify-center">
      <section className="w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>

        <p className="text-sm text-neutral-700">
          Pearlens respects your privacy. This policy describes what information we collect, how we use it, and your
          choices.
        </p>

        <div className="space-y-4 text-sm text-neutral-800">
          <div>
            <h2 className="font-medium">Information we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Guest uploads: photos/videos you choose to upload to an event gallery.</li>
              <li>SMS: phone numbers you enter to receive a one-time link to your photo.</li>
              <li>Basic analytics: device/browser info and usage to improve the service.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">How we use your information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and deliver the guest gallery service.</li>
              <li>Send one-time SMS/MMS with your requested photo link (no recurring marketing).</li>
              <li>Maintain security and improve the service.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">Sharing</h2>
            <p>We do not sell your data. We share with service providers we use to deliver the product (e.g., cloud hosting, SMS). </p>
          </div>

          <div>
            <h2 className="font-medium">Data retention</h2>
            <p>Uploads remain in the event gallery until removed by the event owner or per our data retention practices. SMS numbers are used only to send your requested link.</p>
          </div>

          <div>
            <h2 className="font-medium">Your choices</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Opt out of SMS by not providing your number or by replying STOP to any message.</li>
              <li>Request removal of content by contacting hello@pearlens.com.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">Contact</h2>
            <p>Questions? Contact us at hello@pearlens.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
