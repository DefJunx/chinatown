import { NextResponse } from "next/server";
import { verifySlackRequestFromHeaders } from "@/lib/slack-verification";
import {
  isSlackUserAdmin,
  getSystemSettings,
  updateSystemSettings,
  adminDb,
  instantId,
} from "@/lib/slack-helpers";

/**
 * Handle /chiudi-ordinazioni Slack slash command
 * Admin-only: Closes ordering for all users
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
    // Check if user is an admin
    const isAdmin = await isSlackUserAdmin(slackUserId);

    if (!isAdmin) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Non hai i permessi per eseguire questo comando. Solo gli amministratori possono chiudere le ordinazioni.",
      });
    }

    // Get current system settings
    const settings = await getSystemSettings();

    if (settings) {
      // Update existing settings
      const success = await updateSystemSettings(settings.id, false);
      if (!success) {
        return NextResponse.json({
          response_type: "ephemeral",
          text: "Errore durante la chiusura delle ordinazioni. Riprova.",
        });
      }
    } else {
      // Create new settings with ordering disabled
      const newId = instantId();
      await adminDb.transact(
        adminDb.tx.systemSettings[newId].update({
          allowAdminRegistration: false,
          allowOrdering: false,
          updatedAt: Date.now(),
        })
      );
    }

    return NextResponse.json({
      response_type: "in_channel",
      text: "Ordinazioni chiuse!",
    });
  } catch (error) {
    console.error("Error handling /chiudi-ordinazioni command:", error);
    return NextResponse.json({
      response_type: "ephemeral",
      text: "Errore interno. Riprova più tardi.",
    });
  }
}
