# Admin Registration Control Feature

## Overview
This feature adds a toggle control on the admin dashboard to enable or disable the route for creating new admin accounts (`/admin/setup`).

## What Was Changed

### 1. Database Schema (`lib/instant.ts`)
- Added a new `SystemSettings` interface with `allowAdminRegistration` flag
- Added `systemSettings` to the InstantDB schema

### 2. Admin Dashboard (`app/admin/dashboard/page.tsx`)
- Added a "System Settings" section at the top of the dashboard
- Implemented a toggle switch to enable/disable admin registration
- Settings are persisted in InstantDB with ID `system-settings-primary`
- Uses toast notifications to confirm changes
- Beautiful UI with a Settings icon and clear description

### 3. Admin Setup Page (`app/admin/setup/page.tsx`)
- Added check for the `allowAdminRegistration` setting
- Shows a user-friendly "Registration Disabled" message when the flag is off
- Provides a button to return to the login page
- Defaults to allowing registration if no settings exist (first-time setup)

### 4. Admin Layout (`app/admin/layout.tsx`)
- Added logic to redirect users away from `/admin/setup` if registration is disabled
- Checks the system settings and enforces the restriction at the layout level

## How It Works

1. **Default Behavior**: On first use, admin registration is allowed by default (so the first admin can be created)

2. **Toggle Control**: Once an admin is logged in, they can go to the dashboard and toggle the "Allow Admin Registration" setting

3. **Protection**: When disabled:
   - Direct access to `/admin/setup` is blocked at the layout level
   - The setup page shows a "Registration Disabled" message
   - Users are redirected to the login page

4. **Persistence**: The setting is stored in InstantDB and persists across sessions

## Usage

1. Log in as an admin
2. Go to the Admin Dashboard
3. Look for the "System Settings" section at the top
4. Toggle the "Allow Admin Registration" switch
5. The `/admin/setup` route is now enabled or disabled based on your choice

## Security Benefits

- Prevents unauthorized admin account creation after initial setup
- Can be easily toggled on/off as needed
- Enforced at multiple levels (layout and page)
- No need to manually delete routes or files

## UI Features

- Clean, modern toggle switch design
- Clear labeling with route information
- Toast notifications for feedback
- Disabled state while saving
- Accessible with keyboard navigation and focus rings

