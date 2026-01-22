# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2025-12-05

### Added

- **User Authentication System**
  - Magic code email authentication for customer login
  - Secure login page with email verification code flow
  - Automatic account creation for new users
  - Session management with InstantDB authentication
  - Protected customer routes requiring authentication

- **User Profile System**
  - Customer profile creation and management page
  - Profile fields: first name, last name, preferred cutlery (forks/chopsticks/none)
  - Profile preferences automatically populate order form
  - Admin profile setup page for administrative users
  - UserProfileContext for centralized user profile state management
  - Profile data persisted in InstantDB userProfiles schema

- **Order History Page**
  - New `/orders` route for customers to view their order history
  - Displays all orders placed by the authenticated user
  - Shows order status badges (In Attesa, In Elaborazione, Completato)
  - Displays order details including items, utensils, pricing, and timestamps
  - Sorted by date (newest first)
  - Empty state with call-to-action to browse menu

- **Enhanced Header Navigation**
  - User menu with profile, orders, and logout options
  - Mobile-responsive hamburger menu for navigation
  - Admin dashboard link for admin users
  - Logout functionality with redirect to login page
  - Improved navigation with active route highlighting

### Changed

- **Customer Layout**
  - Now requires authentication for all routes except `/statistics`
  - Automatic redirect to login page for unauthenticated users
  - Automatic redirect to profile setup for users without profiles
  - Loading states during authentication and profile checks
  - Wrapped with UserProfileProvider for profile state management

- **Admin Layout**
  - Enhanced profile checking for admin users
  - Automatic redirect to admin profile setup for admins without profiles
  - Redirect to customer area for non-admin users
  - Profile-based admin access control

- **Order Form**
  - Pre-fills customer name from user profile
  - Pre-selects preferred cutlery from user profile
  - Orders now linked to users via `userId` field
  - Improved form initialization with profile data

- **Order Management**
  - Orders now include `userId` field to link orders to users
  - Enhanced order tracking with user association

### Technical Details

- Added `UserProfile` type to schema with fields: userId, email, firstName, lastName, preferredCutlery, isAdmin
- Created `UserProfileContext` for centralized profile state management
- Updated InstantDB schema to include `userProfiles` collection
- Enhanced route protection logic in both customer and admin layouts
- Improved loading states and user experience during authentication flows

---

## [1.5.0] - 2025-12-05

### Added

- **Utensils Selection Feature**
  - Added forks and chopsticks selection to order form
  - Customers can now request forks and/or chopsticks when placing orders
  - Utensils are displayed in order cards and consolidated order views
  - Utensils are included in copy-to-clipboard and WhatsApp sharing functionality
  - Utensils are properly aggregated when consolidating multiple orders
  - Utensils are properly subtracted when removing orders from consolidated orders

### Changed

- **Order Management**
  - Updated Order and ConsolidatedOrder types to include optional `forks` and `chopsticks` fields
  - Enhanced order consolidation logic to sum utensils from multiple orders
  - Improved order removal logic to subtract utensils from consolidated orders
  - Updated order display components to show utensils information when present

---

## [1.4.0] - 2025-12-03

### Added

- **OrderDetailModal Component**
  - New modal component for viewing detailed information about consolidated orders
  - Displays individual orders within a consolidated order
  - Shows customer details, items, and pricing for each order
  - Ability to remove individual orders from consolidated orders
  - Smooth animations and responsive design

### Changed

- **AdminOrderList Refactoring**
  - Replaced multi-select checkbox workflow with streamlined "Mark as Paid" button
  - Simplified order consolidation process - orders are automatically consolidated when marked as paid
  - Improved UX by removing complex selection UI in favor of direct action buttons
  - Added "Dettagli" (Details) button to consolidated orders for quick access to order details
  - Orders are automatically added to today's pending consolidated order or create a new one
  - Enhanced visual feedback with CheckCircle2 icon for paid status

---

## [1.3.1] - 2025-11-28

### Changed

- Added loading state with spinner to customer home page to prevent flicker while system settings load
- Improved user experience by showing "Caricamento..." message during initial data fetch

---

## [1.3.0] - 2025-11-28

### Added

- **Order Control Feature**
  - Admin toggle to enable/disable ordering system
  - System setting `allowOrdering` in SystemSettings schema
  - Customer-facing "Ordinazioni chiuse!" message when ordering is disabled
  - Conditional rendering of cart icon and cart sidebar based on ordering status
  - Real-time updates when admin changes ordering status
  - Toast notifications for ordering status changes

### Changed

- Updated customer layout to conditionally show cart functionality
- Updated customer home page to display closure message when ordering is disabled
- Enhanced admin dashboard with ordering control toggle
- Extended SystemSettings interface to include `allowOrdering` field

---

## [1.2.0] - 2025-11-25

### Added

- **Footer Component**
  - Added site-wide footer with branding "Made with 🧡 by Webformat"
  - Webformat link directs to https://www.webformat.com/
  - Dynamic version display pulled from package.json
  - Responsive design with mobile-friendly layout
  - Consistent styling across customer and admin sections
  - Fixed positioning at bottom of page with flex layout

### Changed
- Updated customer and admin layouts to include footer
- Added flex-grow to main content areas for proper footer positioning

---

## [1.1.0] - 2025-11-25

### Added

#### UI/UX Improvements
- **Smooth Animations & Transitions**
  - Fade-in animations for menu items on initial load
  - Staggered entrance animations for dish cards (50ms delay per item)
  - Smooth slide-in animations for cart panel
  - Hover scale effects on interactive elements
  - Button press feedback with scale animations
  - Loading state animations for async operations
  - Modal entrance/exit animations with backdrop fade
  - Toast notification animations

#### Documentation Enhancements
- **Organized Documentation Structure**
  - Created dedicated `/docs` folder for all documentation
  - Comprehensive animations documentation (`ANIMATIONS_SUMMARY.md`)
  - Animation testing guide (`ANIMATIONS_TEST_GUIDE.md`)
  - Admin registration feature docs (English & Italian)
  - Complete feature documentation (English & Italian)
  - Deployment guide
  - Quick start guide
  - Setup instructions
  - Project summary

### Changed
- Improved user experience with smooth transitions throughout the application
- Enhanced visual feedback for all interactive elements
- Better organization of project documentation

### Technical Details
- Added CSS transition properties to key components
- Implemented staggered animations using delay calculations
- Optimized animation performance with transform-based animations

---

## [1.0.0] - 2025-11-24

### Added

#### Customer Features
- **Menu Display System**
  - Responsive grid layout for menu items (1-4 columns based on screen size)
  - 8 organized food categories (Antipasti, Primi Piatti, Fish, Shrimp, Chicken, Duck, Pork, Beef)
  - Clean card-based design with hover effects
  - Clear price display in euros

- **Search & Filter Functionality**
  - Real-time search with debouncing (300ms)
  - Category filter buttons for quick navigation
  - Combined search and category filtering
  - "View All" option to see entire menu
  - User-friendly "no results" message

- **Shopping Cart System**
  - Slide-out cart panel with smooth animations
  - Persistent cart storage using localStorage
  - Add/remove items functionality
  - Quantity adjustment with +/- buttons
  - Real-time total calculation
  - Item counter badge on cart icon
  - Empty state messaging
  - Responsive design (full-width mobile, sidebar desktop)

- **Order Placement**
  - Modal form for customer details (name, phone)
  - Order summary with total preview
  - Success confirmation feedback
  - Automatic cart clearing after order
  - Error handling with user-friendly messages

- **Statistics Dashboard** (`/statistics`)
  - Display of most popular dishes with rankings
  - Medal system for top 3 dishes (gold, silver, bronze)
  - Overall statistics: total orders, dishes sold, total revenue
  - Interactive progress bars showing dish popularity
  - Revenue breakdown per dish
  - Beautiful animated UI with hover effects

#### Admin Features
- **Authentication System**
  - Secure email/password authentication via InstantDB
  - Protected admin routes with auto-redirect
  - Session management
  - Secure logout functionality
  - One-time setup page for first admin account creation

- **Admin Registration Control**
  - Toggle switch in dashboard to enable/disable `/admin/setup` route
  - System settings persisted in InstantDB
  - Enforcement at layout level
  - Defaults to allowing registration for first-time setup
  - User-friendly "Registration Disabled" message
  - Toast notifications for setting changes

- **Order Management Dashboard**
  - Real-time order updates using InstantDB subscriptions
  - Three status categories: Pending, Consolidated, Completed
  - Detailed order cards showing:
    - Customer name and phone
    - Order timestamp
    - Itemized list with quantities
    - Individual and total pricing
    - Order status badges

- **Multi-Order Selection**
  - Checkbox selection for multiple pending orders
  - Visual feedback for selected orders
  - Selection counter display
  - Automatic clearing after consolidation

- **Order Consolidation**
  - Smart aggregation of multiple orders
  - Automatic quantity summing for duplicate items
  - Total price calculation across orders
  - Status update to "consolidated"
  - Admin tracking for consolidation actions
  - Creation of consolidated order records

- **Copy to Clipboard**
  - One-click copy of order details
  - Formatted output optimized for phone orders
  - Visual confirmation of copy action
  - Works with selected orders or individual orders

- **Order Status Management**
  - Mark orders as completed
  - Status tracking with visual indicators
  - Count badges for each category
  - History view (last 10 completed orders)

- **ConfirmDialog Component**
  - Reusable confirmation dialog for destructive actions
  - Clean modal design with backdrop
  - Customizable title, message, and button text
  - Keyboard support (ESC to cancel, Enter to confirm)

#### Technical Features
- **Real-time Synchronization**
  - Instant order updates via InstantDB
  - Live dashboard without page refresh
  - Optimistic UI updates
  - Automatic conflict resolution

- **Responsive Design**
  - Mobile-first approach
  - Adaptive breakpoints (mobile/tablet/desktop)
  - Touch-friendly interface
  - Responsive cart and modals

- **Performance Optimization**
  - Next.js automatic code splitting
  - Lazy loading of components
  - Debounced search input
  - Memoized filtering calculations
  - LocalStorage caching for cart

- **User Experience**
  - Loading states for async operations
  - Graceful error handling
  - Success feedback for all actions
  - Smooth CSS animations
  - Full keyboard accessibility
  - Screen reader support with ARIA labels

- **Security**
  - Protected admin routes requiring authentication
  - Environment variables for sensitive data
  - Client-side form validation
  - Secure authentication via InstantDB

#### Documentation
- Comprehensive feature documentation (English & Italian)
- Admin registration feature guide
- Quick start guide
- Setup instructions
- Deployment guide
- Project summary

### Changed
- Updated all admin components with improved UI/UX
- Enhanced customer-facing components with better responsiveness
- Improved error handling across all forms
- Updated InstantDB schema with SystemSettings
- Upgraded package dependencies to latest versions

### Technical Details
- **Framework**: Next.js 15.0.3 with App Router
- **Database**: InstantDB v0.14.2
- **Styling**: TailwindCSS 3.4.15
- **UI Library**: Lucide React v0.460.0
- **Notifications**: Sonner v2.0.7
- **Language**: TypeScript 5.6.3

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Mobile browsers: Optimized

### Accessibility
- WCAG AA compliant color contrast
- Full keyboard navigation support
- Screen reader compatible
- Semantic HTML structure
- Proper focus indicators

---

## [Unreleased]

### Planned Features
- Order notifications (email/SMS)
- Delivery address collection
- Customer order history
- Payment integration
- Order scheduling (pre-orders)
- Analytics dashboard
- Multi-language support
- Dish images

[1.3.0]: https://github.com/DefJunx/chinatown/releases/tag/v1.3.0
[1.2.0]: https://github.com/DefJunx/chinatown/releases/tag/v1.2.0
[1.1.0]: https://github.com/DefJunx/chinatown/releases/tag/v1.1.0
[1.0.0]: https://github.com/DefJunx/chinatown/releases/tag/v1.0.0

