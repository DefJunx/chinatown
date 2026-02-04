const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";

export interface SlackUserInfo {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  realName?: string;
  displayName?: string;
}

export interface SlackApiResponse {
  ok: boolean;
  user?: {
    id: string;
    name: string;
    real_name?: string;
    profile?: {
      email?: string;
      first_name?: string;
      last_name?: string;
      real_name?: string;
      display_name?: string;
    };
  };
  error?: string;
}

/**
 * Fetches user information from the Slack API
 */
export async function getSlackUserInfo(
  slackUserId: string
): Promise<SlackUserInfo | null> {
  if (!SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_TOKEN is not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://slack.com/api/users.info?user=${encodeURIComponent(slackUserId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data: SlackApiResponse = await response.json();

    if (!data.ok || !data.user) {
      console.error("Slack API error:", data.error);
      return null;
    }

    const profile = data.user.profile;
    return {
      id: data.user.id,
      email: profile?.email,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      realName: profile?.real_name || data.user.real_name,
      displayName: profile?.display_name,
    };
  } catch (error) {
    console.error("Failed to fetch Slack user info:", error);
    return null;
  }
}
