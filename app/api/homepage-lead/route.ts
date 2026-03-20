import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "missing-api-key" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const serviceNeeded = String(formData.get("serviceNeeded") || "").trim();
    const details = String(formData.get("details") || "").trim();

    if (!name || !email || !serviceNeeded || !details) {
      return NextResponse.json({ error: "missing-fields" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "King of Sports Collectibles <onboarding@resend.dev>",
      to: ["kingofsportscollectibles@gmail.com"],
      replyTo: email,
      subject: `New Homepage Lead: ${serviceNeeded}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>New Homepage Lead</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Service Needed:</strong> ${escapeHtml(serviceNeeded)}</p>
          <p><strong>Details:</strong></p>
          <div style="white-space: pre-wrap; padding: 12px; background: #f6f6f6; border-radius: 8px;">
            ${escapeHtml(details)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "email-failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Homepage lead form error:", error);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}