import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function POST(req: Request) {
  const formData = await req.formData();

  // Honeypot
  const website = (formData.get("website") as string) || "";
  if (website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const firstName = (formData.get("firstName") as string) || "";
  const lastName = (formData.get("lastName") as string) || "";
  const email = (formData.get("email") as string) || "";
  const eventType = (formData.get("eventType") as string) || "";
  const eventDate = (formData.get("eventDate") as string) || "";
  const guestCount = (formData.get("guestCount") as string) || "";
  const venue = (formData.get("venue") as string) || "";
  const notes = (formData.get("notes") as string) || "";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const bodyLines = [
    `Name: ${firstName} ${lastName}`.trim(),
    `Email: ${email}`,
    `Event Type: ${eventType}`,
    `Event Date: ${eventDate}`,
    `Guest Count: ${guestCount}`,
    `Venue + City: ${venue}`,
    "",
    "Special Notes:",
    notes || "(none)",
  ].join("\n");

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  try {
    const resp = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pearlens <hello@pearlens.com>",
        to: ["hello@pearlens.com"],
        subject: `New inquiry from ${firstName || "Guest"}`,
        reply_to: email,
        text: bodyLines,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[INQUIRY SEND ERROR]", text);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[INQUIRY ERROR]", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
