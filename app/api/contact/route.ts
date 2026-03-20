import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "missing-api-key" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const inquiryType = String(formData.get("inquiryType") || "").trim();
    const itemName = String(formData.get("itemName") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: "missing-fields" },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "King of Sports Collectibles <onboarding@resend.dev>",
      to: ["kingofsportscollectibles@gmail.com"],
      replyTo: email,
      subject: `New Contact Inquiry: ${inquiryType}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
          <p><strong>Inquiry Type:</strong> ${escapeHtml(inquiryType)}</p>
          <p><strong>Item / Player / Team / Year:</strong> ${escapeHtml(itemName || "Not provided")}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; padding: 12px; background: #f6f6f6; border-radius: 8px;">
            ${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "email-failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "server-error" },
      { status: 500 }
    );
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