import { NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY");
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
    const itemName = String(formData.get("itemName") || "").trim();
    const itemType = String(formData.get("itemType") || "").trim();
    const details = String(formData.get("details") || "").trim();

    if (!name || !email || !itemName || !itemType || !details) {
      return NextResponse.json(
        { error: "missing-fields" },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("photos")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: "too-many-files" },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "bad-file-type" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "file-too-large" },
          { status: 400 }
        );
      }
    }

    const attachments = await Promise.all(
      files.map(async (file, index) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
          filename: file.name || `photo-${index + 1}.jpg`,
          content: buffer.toString("base64"),
          contentType: file.type,
        };
      })
    );

    const { error } = await resend.emails.send({
      from: "King of Sports Collectibles <onboarding@resend.dev>",
      to: ["kingofsportscollectibles@gmail.com"],
      replyTo: email,
      subject: `New Appraisal Request: ${itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>New Appraisal Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
          <p><strong>Item Name / Player / Year:</strong> ${escapeHtml(itemName)}</p>
          <p><strong>Item Type:</strong> ${escapeHtml(itemType)}</p>
          <p><strong>Photos Attached:</strong> ${attachments.length}</p>
          <p><strong>Details:</strong></p>
          <div style="white-space: pre-wrap; padding: 12px; background: #f6f6f6; border-radius: 8px;">
            ${escapeHtml(details)}
          </div>
        </div>
      `,
      attachments,
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
    console.error("Appraisal form error:", error);
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