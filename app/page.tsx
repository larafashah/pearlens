export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
      <section className="max-w-xl w-full bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-3xl font-semibold mb-3">Pearlens</h1>
        <p className="text-sm text-gray-600 mb-6">
          Let your guests become your photographers. QR codes on tables → instant uploads → one private gallery for the couple.
        </p>

        <div className="space-y-3 text-left text-sm text-gray-700">
          <p>📸 No app download required</p>
          <p>✨ Works instantly with any smartphone camera</p>
          <p>💍 Perfect for weddings & special events</p>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          To set up an event, go to /event (admin only)
        </p>
      </section>
    </main>
  );
}
