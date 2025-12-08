import { NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_NUMBER;

export async function POST(req: Request) {
  try {
    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: "SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER." },
        { status: 500 }
      );
    }

    const { phone, photoUrl } = await req.json();

    if (!phone || !photoUrl) {
      return NextResponse.json({ error: "Phone and photoUrl are required." }, { status: 400 });
    }

    const payload = new URLSearchParams();
    payload.append("To", phone);
    payload.append("From", fromNumber);
    payload.append("Body", "Here is your photo—thanks for sharing!");
    payload.append("MediaUrl", photoUrl);

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      }
    );

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error("Twilio send error:", errorText);
      return NextResponse.json({ error: "Failed to send text." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SMS route error:", error);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
