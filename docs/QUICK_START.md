# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Node.js

If you don't have Node.js installed:

- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation: `node --version` (should show v18 or higher)

### Step 2: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:

- Next.js 15
- React 19
- InstantDB for real-time database
- Tailwind CSS for styling
- Lucide React for icons

### Step 3: Set Up InstantDB (2 minutes)

1. Go to https://instantdb.com
2. Sign up for a free account (no credit card required)
3. Click "Create New App"
4. Give it a name (e.g., "Chinese Menu")
5. Copy your App ID from the dashboard

### Step 4: Configure Environment

Create a file named `.env.local` in the project root:

```bash
NEXT_PUBLIC_INSTANT_APP_ID=paste_your_app_id_here
```

### Step 5: Start the Development Server

```bash
npm run dev
```

The app will start at http://localhost:3000

### Step 6: Create Your First Admin Account

1. Visit http://localhost:3000/admin/setup
2. Enter your email (e.g., admin@example.com)
3. Create a password (minimum 8 characters)
4. Click "Create Account"

✅ You're all set! You'll be redirected to the admin dashboard.

## 📱 Using the Application

### As a Customer

1. Visit http://localhost:3000
2. Browse the menu by category
3. Use the search bar to find specific dishes
4. Click "Add" to add items to your cart
5. Click the cart icon (top right) to view your order
6. Adjust quantities or remove items as needed
7. Click "Place Order"
8. Enter your name and phone number
9. Submit your order

### As an Admin

1. Visit http://localhost:3000/admin/login
2. Log in with your admin credentials
3. View all incoming orders in real-time
4. Select multiple orders using checkboxes
5. Click "Copy List" to copy the consolidated items
6. Click "Consolidate" to merge the orders
7. Use the copied list to call the restaurant
8. Mark orders as completed when done

## 🎯 Next Steps

### Delete the Setup Page (Security)

After creating your admin account, delete the setup directory:

```bash
# On Windows
rmdir /s app\admin\setup

# On Mac/Linux
rm -rf app/admin/setup
```

### Customize the Menu

Edit `lib/menu-data.ts` to add your restaurant's actual dishes:

```typescript
{
  name: 'Appetizers',
  items: [
    {
      id: 'app-1',
      name: 'Spring Rolls',
      price: 3.50,
      category: 'Appetizers'
    },
    // Add more items...
  ]
}
```

### Change Colors

Edit `tailwind.config.ts` to match your brand:

```typescript
primary: {
  600: '#your-main-color',
  700: '#your-darker-shade',
}
```

## 🐛 Troubleshooting

### "npm not found" or "node not found"

- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Orders not appearing in dashboard

- Check that `.env.local` has the correct InstantDB App ID
- Make sure you're logged in to the admin dashboard
- Check browser console (F12) for errors

### Can't log in to admin

- Make sure you created an account at `/admin/setup`
- Check email and password are correct
- Password must be at least 8 characters

### Port 3000 already in use

Change the port when starting:

```bash
# Windows
set PORT=3001 && npm run dev

# Mac/Linux
PORT=3001 npm run dev
```

## 📞 Need Help?

- Check the full [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- InstantDB docs: https://instantdb.com/docs
- Next.js docs: https://nextjs.org/docs

## 🎉 You're Ready!

Your Chinese takeaway ordering system is now live. Customers can start placing orders, and you can manage them from the admin dashboard in real-time.

Happy ordering! 🍜
