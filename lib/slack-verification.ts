import crypto from "crypto";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || "";

// Token expiration time (15 minutes)
const TOKEN_EXPIRY_MS = 15 * 60 * 1000;

export interface SlackRequestVerification {
  isValid: boolean;
  error?: string;
}

/**
 * Verifies that a request originated from Slack using their signing secret.
 * See: https://api.slack.com/authentication/verifying-requests-from-slack
 */
export function verifySlackRequest(
  body: string,
  timestamp: string | null,
  signature: string | null
): SlackRequestVerification {
  if (!SLACK_SIGNING_SECRET) {
    return {
      isValid: false,
      error: "SLACK_SIGNING_SECRET is not configured",
    };
  }

  if (!timestamp || !signature) {
    return {
      isValid: false,
      error: "Missing Slack signature headers",
    };
  }

  // Prevent replay attacks - reject requests older than 5 minutes
  const currentTime = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);
  if (isNaN(requestTime) || Math.abs(currentTime - requestTime) > 60 * 5) {
    return {
      isValid: false,
      error: "Request timestamp is invalid or too old",
    };
  }

  // Compute the signature
  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(sigBasestring, "utf8")
      .digest("hex");

  // Compare signatures using timing-safe comparison
  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(mySignature, "utf8"),
      Buffer.from(signature, "utf8")
    );
    return { isValid };
  } catch {
    return {
      isValid: false,
      error: "Invalid signature format",
    };
  }
}

/**
 * Helper function to verify a Slack request from Next.js API route
 */
export async function verifySlackRequestFromHeaders(
  request: Request
): Promise<SlackRequestVerification & { body: string }> {
  const timestamp = request.headers.get("x-slack-request-timestamp");
  const signature = request.headers.get("x-slack-signature");
  const body = await request.text();

  const verification = verifySlackRequest(body, timestamp, signature);
  return { ...verification, body };
}

/**
 * Generate a signed token for Slack login/register URLs
 * This prevents URL parameter manipulation attacks
 */
export function generateSlackLinkToken(
  slackUserId: string,
  email: string
): string {
  if (!SLACK_SIGNING_SECRET) {
    throw new Error("SLACK_SIGNING_SECRET is not configured");
  }

  const timestamp = Date.now();
  const payload = `${slackUserId}:${email}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SLACK_SIGNING_SECRET)
    .update(payload, "utf8")
    .digest("hex");

  // Return base64-encoded token: payload|signature
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

/**
 * Verify a Slack link token and extract the data
 * Returns null if token is invalid or expired
 */
export function verifySlackLinkToken(
  token: string
): { slackUserId: string; email: string } | null {
  if (!SLACK_SIGNING_SECRET) {
    console.error("SLACK_SIGNING_SECRET is not configured");
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [payload, signature] = decoded.split("|");

    if (!payload || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(payload, "utf8")
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    );

    if (!isValid) {
      return null;
    }

    // Parse payload
    const [slackUserId, email, timestampStr] = payload.split(":");
    const timestamp = parseInt(timestampStr, 10);

    // Check expiration
    if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_EXPIRY_MS) {
      return null;
    }

    return { slackUserId, email };
  } catch {
    return null;
  }
}
