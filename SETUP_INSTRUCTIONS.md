# Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- An InstantDB account (free at https://instantdb.com)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up InstantDB

1. Go to https://instantdb.com and create a free account
2. Create a new app in the InstantDB dashboard
3. Copy your App ID from the dashboard
4. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_INSTANT_APP_ID=your_app_id_here
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## First-Time Admin Setup

### Option 1: Using the Setup Page

1. Navigate to http://localhost:3000/admin/setup
2. Enter an email and password for your admin account
3. Click "Create Account"
4. You'll be automatically redirected to the admin dashboard

**Security Note:** After creating your admin account, consider deleting the `/app/admin/setup` directory to prevent unauthorized admin account creation.

### Option 2: Using InstantDB Dashboard

1. Go to your InstantDB dashboard
2. Navigate to the "Auth" section
3. Manually create a user with your desired email and password
4. Use these credentials to log in at http://localhost:3000/admin/login

## Application Structure

### Customer-Facing Pages

- **Homepage (/)**: Browse menu, search dishes, add items to cart
- **Cart**: Slide-out panel from the right showing cart items
- **Order Submission**: Modal form for entering customer details

### Admin Pages

- **/admin/login**: Admin login page
- **/admin/setup**: One-time setup page for creating admin accounts (can be deleted after use)
- **/admin/dashboard**: Order management dashboard

## Features

### Customer Features

1. **Browse Menu**: View all dishes organized by category
2. **Search**: Find dishes by name with real-time filtering
3. **Category Filter**: Filter dishes by category
4. **Shopping Cart**: 
   - Add items with one click
   - Adjust quantities
   - Remove items
   - Persistent cart (saved in localStorage)
5. **Place Orders**: Submit orders with name and phone number

### Admin Features

1. **View Orders**: Real-time list of all orders (pending, consolidated, completed)
2. **Select Multiple Orders**: Use checkboxes to select orders
3. **Consolidate Orders**: 
   - Combine multiple orders into one
   - Automatically aggregates duplicate items
   - Shows consolidated quantities
4. **Copy Order List**: Copy the consolidated order list to clipboard for easy phone ordering
5. **Mark as Completed**: Move orders to completed status
6. **Real-time Updates**: Dashboard automatically updates when new orders come in

## Database Schema

The application uses InstantDB with the following collections:

### Orders Collection
- `customerName`: String
- `customerPhone`: String
- `items`: Array of items with id, name, price, quantity, category
- `totalPrice`: Number
- `status`: 'pending' | 'consolidated' | 'completed'
- `createdAt`: Timestamp

### Consolidated Orders Collection
- `orderIds`: Array of original order IDs
- `items`: Map of item ID to {name, quantity, price}
- `totalPrice`: Number
- `status`: 'pending' | 'completed'
- `createdAt`: Timestamp
- `adminId`: Admin user ID

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This Next.js application can be deployed to:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Configure build command as `npm run build`
- **Any Node.js hosting**: Build and run with `npm run build && npm start`

Make sure to set your `NEXT_PUBLIC_INSTANT_APP_ID` environment variable in your deployment platform.

## Troubleshooting

### Orders not showing up in admin dashboard

- Check that your InstantDB App ID is correctly set in `.env.local`
- Ensure you're logged in as an admin user
- Check the browser console for any errors

### Can't create admin account

- Verify your InstantDB app has authentication enabled
- Check that email format is valid
- Ensure password is at least 8 characters

### Cart not persisting

- Check browser localStorage is enabled
- Clear browser cache and try again

## Customization

### Changing the Color Scheme

Edit `tailwind.config.ts` to modify the primary colors:

```typescript
colors: {
  primary: {
    // Modify these color values
    600: '#dc2626',  // Main color
    700: '#b91c1c',  // Darker shade
    // ... etc
  },
}
```

### Modifying Menu Items

Edit `lib/menu-data.ts` to add, remove, or modify dishes:

```typescript
{
  name: 'Category Name',
  items: [
    { id: 'unique-id', name: 'Dish Name', price: 5.00, category: 'Category Name' },
    // Add more items...
  ]
}
```

## Support

For issues related to:
- InstantDB: Check https://instantdb.com/docs
- Next.js: Check https://nextjs.org/docs

## License

This project is created for educational and commercial use.

