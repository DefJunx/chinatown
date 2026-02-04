import { NextResponse } from "next/server";
import {
  verifySlackRequestFromHeaders,
  generateSlackLinkToken,
} from "@/lib/slack-verification";
import { findUserBySlackId } from "@/lib/slack-helpers";
import { getSlackUserInfo } from "@/lib/slack-api";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Handle /ordina Slack slash command
 * Returns a link to login (existing user) or register (new user)
 */
export async function POST(request: Request) {
  // Verify the request is from Slack
  const verification = await verifySlackRequestFromHeaders(request);

  if (!verification.isValid) {
    console.error("Slack verification failed:", verification.error);
    return NextResponse.json(
      { error: verification.error },
      { status: 401 }
    );
  }

  // Parse the URL-encoded body from Slack
  const params = new URLSearchParams(verification.body);
  const slackUserId = params.get("user_id");

  if (!slackUserId) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "Errore: impossibile identificare l'utente Slack.",
    });
  }

  try {
    // Check if user already exists in our system
    const existingUser = await findUserBySlackId(slackUserId);

    if (existingUser) {
      // User exists - return login link with signed token
      const token = generateSlackLinkToken(slackUserId, existingUser.email);
      const loginUrl = `${APP_URL}/slack/login?token=${encodeURIComponent(token)}`;

      return NextResponse.json({
        response_type: "ephemeral",
        text: `${loginUrl} in fase di apertura`,
      });
    }

    // New user - fetch their info from Slack
    const slackUserInfo = await getSlackUserInfo(slackUserId);

    if (!slackUserInfo) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Errore: impossibile recuperare le informazioni utente da Slack.",
      });
    }

    // Build registration URL with signed token and pre-filled data
    const registerParams = new URLSearchParams();

    // Generate signed token (email may be empty for private Slack profiles)
    const token = generateSlackLinkToken(slackUserId, slackUserInfo.email || "");
    registerParams.set("token", token);

    // Add pre-filled name data (not security-sensitive)
    if (slackUserInfo.firstName) {
      registerParams.set("first_name", slackUserInfo.firstName);
    }
    if (slackUserInfo.lastName) {
      registerParams.set("last_name", slackUserInfo.lastName);
    }
    // Fallback to real name if first/last not available
    if (!slackUserInfo.firstName && slackUserInfo.realName) {
      const nameParts = slackUserInfo.realName.split(" ");
      registerParams.set("first_name", nameParts[0] || "");
      if (nameParts.length > 1) {
        registerParams.set("last_name", nameParts.slice(1).join(" "));
      }
    }

    const registerUrl = `${APP_URL}/slack/register?${registerParams.toString()}`;

    return NextResponse.json({
      response_type: "ephemeral",
      text: `${registerUrl} in fase di apertura`,
    });
  } catch (error) {
    console.error("Error handling /ordina command:", error);
    return NextResponse.json({
      response_type: "ephemeral",
      text: "Errore interno. Riprova più tardi.",
    });
  }
}
