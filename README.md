# Chinese Takeaway Ordering Website

A full-stack Next.js application for managing orders at a Chinese takeaway restaurant with real-time order management.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![InstantDB](https://img.shields.io/badge/InstantDB-realtime-ff6b6b)

## ✨ Features

### Customer Features

- 🍜 Browse menu items by category
- 🔍 Real-time search and filter
- 🛒 Shopping cart with quantity management
- 📱 Fully responsive design
- 💾 Persistent cart (localStorage)
- 📝 Easy order submission

### Admin Features

- 👀 Real-time order monitoring
- 📦 Multi-order consolidation
- 📋 Copy order lists to clipboard
- ✅ Order status management
- 🔐 Secure authentication
- 📊 Orders grouped by status

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- InstantDB account (free at [instantdb.com](https://instantdb.com))

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up InstantDB:**
   - Create an account at https://instantdb.com
   - Create a new app and copy your App ID
   - Create `.env.local` file:

```bash
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id_here
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**
   - Customer interface: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login
   - Admin setup: http://localhost:3000/admin/setup

## 📖 Detailed Setup

For comprehensive setup instructions, see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: InstantDB (real-time sync)
- **Authentication**: InstantDB Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📁 Project Structure

```
china-menu/
├── app/
│   ├── (customer)/       # Customer-facing pages
│   │   ├── page.tsx      # Menu page
│   │   └── layout.tsx    # Customer layout
│   ├── admin/            # Admin pages
│   │   ├── login/        # Admin login
│   │   ├── setup/        # One-time admin setup
│   │   ├── dashboard/    # Order management
│   │   └── layout.tsx    # Admin auth guard
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── DishCard.tsx
│   ├── MenuGrid.tsx
│   ├── SearchBar.tsx
│   ├── MiniCart.tsx
│   ├── OrderForm.tsx
│   └── AdminOrderList.tsx
├── contexts/
│   └── CartContext.tsx   # Shopping cart state
├── lib/
│   ├── instant.ts        # InstantDB config
│   └── menu-data.ts      # Menu items
└── types/
    └── index.ts          # TypeScript types
```

## 🎯 How It Works

### Customer Flow

1. Browse menu with categories
2. Search/filter dishes
3. Add items to cart
4. Enter name and phone
5. Submit order → appears in admin dashboard

### Admin Flow

1. Log in to admin dashboard
2. View real-time orders
3. Select multiple orders
4. Consolidate and copy list
5. Call restaurant with consolidated order
6. Mark orders as completed

## 🔧 Customization

### Update Menu Items

Edit `lib/menu-data.ts`:

```typescript
{
  name: 'New Category',
  items: [
    { id: 'item-1', name: 'Dish Name', price: 10.00, category: 'New Category' }
  ]
}
```

### Change Color Scheme

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    600: '#your-color',
    700: '#darker-shade',
  }
}
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

```bash
npm run build
npm start
```

Set environment variable: `NEXT_PUBLIC_INSTANT_APP_ID`

## 📝 License

MIT License - Feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:

- InstantDB: https://instantdb.com/docs
- Next.js: https://nextjs.org/docs
