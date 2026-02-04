import { init, id as instantId } from "@instantdb/admin";
import type { UserProfile } from "@/types";
import type { SystemSettings } from "@/lib/instant";

// Initialize InstantDB admin client for server-side queries
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || "";
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN || "";

// Create admin db instance (only for server-side use)
const adminDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
});

// Export for use in other server-side code
export { adminDb, instantId };

/**
 * Find a user profile by their Slack user ID
 */
export async function findUserBySlackId(
  slackUserId: string
): Promise<UserProfile | null> {
  try {
    const result = await adminDb.query({
      userProfiles: {
        $: {
          where: {
            slackUserId: slackUserId,
          },
        },
      },
    });

    const profiles = result.userProfiles || [];
    if (profiles.length === 0) {
      return null;
    }

    return profiles[0] as UserProfile;
  } catch (error) {
    console.error("Error finding user by Slack ID:", error);
    return null;
  }
}

/**
 * Check if a user with the given Slack ID is an admin
 */
export async function isSlackUserAdmin(slackUserId: string): Promise<boolean> {
  const user = await findUserBySlackId(slackUserId);
  return user?.isAdmin === true;
}

/**
 * Get the current system settings
 */
export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    const result = await adminDb.query({
      systemSettings: {},
    });

    const settings = result.systemSettings || [];
    if (settings.length === 0) {
      return null;
    }

    return settings[0] as SystemSettings;
  } catch (error) {
    console.error("Error getting system settings:", error);
    return null;
  }
}

/**
 * Update system settings (open/close ordering)
 */
export async function updateSystemSettings(
  settingsId: string,
  allowOrdering: boolean
): Promise<boolean> {
  try {
    await adminDb.transact(
      adminDb.tx.systemSettings[settingsId].update({
        allowOrdering,
        updatedAt: Date.now(),
      })
    );
    return true;
  } catch (error) {
    console.error("Error updating system settings:", error);
    return false;
  }
}
