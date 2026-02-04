# Slack Integration Manual

This document describes how to set up and use the Slack integration for the Chinese takeaway ordering system.

## Overview

The Slack integration provides three slash commands:

| Command | Description | Who can use it |
|---------|-------------|----------------|
| `/ordina` | Opens a link to place an order | Everyone |
| `/apri-ordinazioni` | Opens ordering for all users | Admins only |
| `/chiudi-ordinazioni` | Closes ordering for all users | Admins only |

---

## Setup Guide

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Enter a name (e.g., "Chinatown Orders") and select your workspace
4. Click **Create App**

### 2. Configure Slash Commands

Navigate to **Features** → **Slash Commands** and create three commands:

#### /ordina
- **Command**: `/ordina`
- **Request URL**: `https://your-domain.com/api/slack/ordina`
- **Short Description**: `Ordina il pranzo cinese`
- **Usage Hint**: (leave empty)

#### /apri-ordinazioni
- **Command**: `/apri-ordinazioni`
- **Request URL**: `https://your-domain.com/api/slack/apri-ordinazioni`
- **Short Description**: `[Admin] Apre le ordinazioni`
- **Usage Hint**: (leave empty)

#### /chiudi-ordinazioni
- **Command**: `/chiudi-ordinazioni`
- **Request URL**: `https://your-domain.com/api/slack/chiudi-ordinazioni`
- **Short Description**: `[Admin] Chiude le ordinazioni`
- **Usage Hint**: (leave empty)

### 3. Configure OAuth Scopes

Navigate to **OAuth & Permissions** → **Scopes** → **Bot Token Scopes** and add:

- `commands` - For slash commands
- `users:read` - To read user profile info
- `users:read.email` - To read user email addresses

### 4. Install the App

1. Navigate to **OAuth & Permissions**
2. Click **Install to Workspace**
3. Authorize the requested permissions
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### 5. Get Signing Secret

1. Navigate to **Basic Information**
2. Under **App Credentials**, copy the **Signing Secret**

### 6. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Slack Integration
SLACK_SIGNING_SECRET=your_signing_secret_here
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
NEXT_PUBLIC_APP_URL=https://your-domain.com

# InstantDB Admin (for server-side operations)
INSTANT_ADMIN_TOKEN=your_instantdb_admin_token
```

To get the InstantDB Admin Token:
1. Go to [instantdb.com](https://instantdb.com)
2. Open your app dashboard
3. Navigate to **Settings** → **Admin Token**
4. Generate and copy the token

### 7. Deploy

Deploy your application. The Slack integration will be active once the environment variables are set.

---

## User Flows

### First-Time User (via Slack)

```
┌─────────────────┐
│  User types     │
│   /ordina       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ System checks   │
│ for slackUserId │──── Not found
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fetch user info │
│   from Slack    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return register │
│     link        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User clicks     │
│    link         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify email    │
│ with magic code │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create profile  │
│ with slackUserId│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│     menu        │
└─────────────────┘
```

### Returning User (via Slack)

```
┌─────────────────┐
│  User types     │
│   /ordina       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ System checks   │
│ for slackUserId │──── Found!
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return login    │
│     link        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User clicks,    │
│ verifies email  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│     menu        │
└─────────────────┘
```

### Existing Web User (First Slack Use)

If a user already has a web account but hasn't used Slack before:

1. User types `/ordina` → gets register link (not found by slackUserId)
2. User enters their existing email address
3. User verifies with magic code → authenticated to existing account
4. System detects existing profile, links slackUserId to it
5. User is redirected to menu

### Admin Opening/Closing Orders

```
┌─────────────────┐
│  Admin types    │
│/apri-ordinazioni│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ System checks   │
│   isAdmin       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Admin     Not Admin
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Update  │ │ Return error │
│settings │ │   message    │
└────┬────┘ └──────────────┘
     │
     ▼
┌─────────────────┐
│ Post message    │
│  to channel     │
│"Ordinazioni     │
│   aperte!"      │
└─────────────────┘
```

---

## Admin Setup

For an admin to use Slack commands:

1. **Create admin account via web** at `/admin/setup`
2. **Link Slack account** by using `/ordina` command
3. Enter the same email used for admin registration
4. Verify with magic code
5. The admin's profile now has a `slackUserId`
6. Admin can now use `/apri-ordinazioni` and `/chiudi-ordinazioni`

---

## Security Features

### Request Verification

All incoming Slack requests are verified using HMAC-SHA256 signatures:

1. Slack signs each request with the Signing Secret
2. Our server recomputes the signature and compares
3. Requests older than 5 minutes are rejected (replay attack prevention)
4. Timing-safe comparison prevents timing attacks

### Signed URL Tokens

URLs returned to users contain signed tokens to prevent tampering:

1. Token contains: `slackUserId`, `email`, `timestamp`
2. Token is HMAC-signed with the Signing Secret
3. Tokens expire after 15 minutes
4. Tokens are verified server-side before any action

This prevents attacks where someone modifies URL parameters to link a different Slack account.

---

## Troubleshooting

### "Non hai i permessi per eseguire questo comando"

The user trying to use `/apri-ordinazioni` or `/chiudi-ordinazioni` is not an admin. They need to:

1. Have an admin account (created via `/admin/setup`)
2. Have their Slack account linked (by using `/ordina` first)

### "Token non valido o scaduto"

The link has expired (15 minutes) or was tampered with. Use `/ordina` again to get a fresh link.

### "Errore: impossibile recuperare le informazioni utente da Slack"

The Slack Bot Token is missing or invalid. Check:

1. `SLACK_BOT_TOKEN` is set in environment variables
2. The token starts with `xoxb-`
3. The app has `users:read` and `users:read.email` scopes

### "Errore interno"

Check server logs for details. Common causes:

1. Missing `INSTANT_ADMIN_TOKEN`
2. Database connection issues
3. Invalid `NEXT_PUBLIC_INSTANT_APP_ID`

### Commands not appearing in Slack

1. Verify the app is installed to the workspace
2. Check that slash commands are configured correctly
3. Ensure the Request URL is accessible (HTTPS required in production)

---

## API Reference

### POST /api/slack/ordina

Handles the `/ordina` slash command.

**Response (existing user):**
```json
{
  "response_type": "ephemeral",
  "text": "https://example.com/slack/login?token=... in fase di apertura"
}
```

**Response (new user):**
```json
{
  "response_type": "ephemeral",
  "text": "https://example.com/slack/register?token=...&first_name=...&last_name=... in fase di apertura"
}
```

### POST /api/slack/apri-ordinazioni

Handles the `/apri-ordinazioni` slash command (admin only).

**Success Response:**
```json
{
  "response_type": "in_channel",
  "text": "Ordinazioni aperte! Usa /ordina per ordinare."
}
```

**Error Response (not admin):**
```json
{
  "response_type": "ephemeral",
  "text": "Non hai i permessi per eseguire questo comando. Solo gli amministratori possono aprire le ordinazioni."
}
```

### POST /api/slack/chiudi-ordinazioni

Handles the `/chiudi-ordinazioni` slash command (admin only).

**Success Response:**
```json
{
  "response_type": "in_channel",
  "text": "Ordinazioni chiuse!"
}
```

### POST /api/slack/verify-token

Internal API to verify signed tokens from client pages.

**Request:**
```json
{
  "token": "base64url-encoded-token"
}
```

**Success Response:**
```json
{
  "slackUserId": "U123ABC",
  "email": "user@example.com"
}
```

---

## File Structure

```
lib/
├── slack-verification.ts   # Signature verification & token generation
├── slack-api.ts            # Slack API client (fetch user info)
└── slack-helpers.ts        # Database helpers (find user, check admin)

app/api/slack/
├── ordina/route.ts              # /ordina command handler
├── apri-ordinazioni/route.ts    # /apri-ordinazioni command handler
├── chiudi-ordinazioni/route.ts  # /chiudi-ordinazioni command handler
└── verify-token/route.ts        # Token verification endpoint

app/slack/
├── login/page.tsx     # Login flow for existing users
└── register/page.tsx  # Registration flow for new users
```

---

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `SLACK_SIGNING_SECRET` | Yes | From Slack App → Basic Information |
| `SLACK_BOT_TOKEN` | Yes | From Slack App → OAuth & Permissions |
| `INSTANT_ADMIN_TOKEN` | Yes | From InstantDB dashboard |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app's public URL |
| `NEXT_PUBLIC_INSTANT_APP_ID` | Yes | InstantDB App ID (already configured) |
