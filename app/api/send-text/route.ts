import { NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_NUMBER;

export async function POST(req: Request) {
  try {
    const missing: string[] = [];
    if (!accountSid) missing.push("TWILIO_ACCOUNT_SID");
    if (!authToken) missing.push("TWILIO_AUTH_TOKEN");
    if (!fromNumber) missing.push("TWILIO_NUMBER");
    if (missing.length) {
      return NextResponse.json(
        {
          error:
            "SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER.",
          missing,
        },
        { status: 500 }
      );
    }

    const { phone, photoUrls, photoUrl, honey, eventName } = await req.json();

    if (typeof honey === "string" && honey.trim().length > 0) {
      return NextResponse.json({ error: "Not allowed" }, { status: 400 });
    }

    const urlsFromBody: string[] = [];
    if (Array.isArray(photoUrls)) {
      urlsFromBody.push(...photoUrls.filter((u) => typeof u === "string" && u.trim().length > 0));
    }
    if (photoUrl && typeof photoUrl === "string") {
      urlsFromBody.push(photoUrl);
    }

    if (!phone || urlsFromBody.length === 0) {
      return NextResponse.json(
        { error: "Phone and at least one photoUrl are required." },
        { status: 400 }
      );
    }

    const normalizePhone = (raw: string) => {
      const trimmed = raw.trim();
      if (trimmed.startsWith("+")) return trimmed;
      const digits = trimmed.replace(/\D/g, "");
      if (digits.length === 10) return `+1${digits}`;
      if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
      return null;
    };

    const normalizedTo = normalizePhone(phone);
    if (!normalizedTo) {
      return NextResponse.json(
        { error: "Invalid phone format. Use +15551234567 or 10-digit US number." },
        { status: 400 }
      );
    }

    const sid = accountSid as string;
    const token = authToken as string;
    const from = fromNumber as string;

    const label =
      typeof eventName === "string" && eventName.trim().length > 0
        ? eventName.trim()
        : "your event";

    const payload = new URLSearchParams();
    payload.append("To", normalizedTo);
    payload.append("From", from);
    payload.append(
      "Body",
      `Pearlens: Here is your photo link from ${label}. One-time message; msg & data rates may apply. Reply STOP to opt out.`
    );
    urlsFromBody.slice(0, 10).forEach((u) => payload.append("MediaUrl", u));

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      }
    );

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error("Twilio send error:", errorText);
      return NextResponse.json(
        { error: "Failed to send text.", detail: errorText },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SMS route error:", error);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
