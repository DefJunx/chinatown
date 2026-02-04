import { NextResponse } from "next/server";
import { verifySlackLinkToken } from "@/lib/slack-verification";

/**
 * Verify a Slack link token and return the decoded data
 * This is called from client pages to validate tokens
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token mancante" },
        { status: 400 }
      );
    }

    const data = verifySlackLinkToken(token);

    if (!data) {
      return NextResponse.json(
        { error: "Token non valido o scaduto" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      slackUserId: data.slackUserId,
      email: data.email,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
  }
}
