# Animation Features Summary

This document describes all the animations that have been added to the application to enhance user experience.

## 🎨 Animation Library

### Tailwind Config Animations

The following custom animations have been added to `tailwind.config.ts`:

1. **slide-in** - Slide in from right (entrance)
2. **slide-out** - Slide out to right (exit)
3. **fade-in** - Smooth fade-in effect
4. **fade-out** - Smooth fade-out effect
5. **fade-in-up** - Fade in with upward movement
6. **scale-in** - Scale-based entrance animation
7. **bounce-in** - Bouncy entrance animation with elastic effect
8. **pulse-once** - Single pulse animation
9. **success-bounce** - Celebratory bounce for success states
10. **cart-badge-bounce** - Badge animation for cart updates
11. **wiggle** - Gentle rotation wiggle effect

## 🎯 Key Animation Features

### 1. **Add to Cart Button** (Most Important!)

**File:** `components/DishCard.tsx`

The "Add to Cart" button now has a multi-stage success animation:

- **Click:** Button scales down slightly
- **Processing:** Plus icon spins briefly
- **Success:** 
  - Button changes to green background
  - Check icon appears with scale-in animation
  - Button bounces with the `success-bounce` animation
  - Text changes to "Aggiunto!" (Added!)
- **Duration:** Success state visible for 1 second

### 2. **Cart Badge Animation**

**File:** `components/Header.tsx`

When items are added to cart:
- Cart icon wiggles
- Badge scales up and bounces
- Clear visual feedback that something was added

### 3. **Dish Cards**

**File:** `components/DishCard.tsx` & `components/MenuGrid.tsx`

- Cards fade in and slide up on page load
- Staggered animation delay for each card
- Hover effects: slight scale-up and enhanced shadow
- Card title changes color on hover

### 4. **Shopping Cart Sidebar**

**File:** `components/MiniCart.tsx`

- **Opening:** Slide-in animation from right
- **Closing:** Smooth slide-out animation to right ⭐ NEW!
- Background overlay fades in and out smoothly
- Cart items fade in with staggered delays
- All buttons have hover scale and active press effects
- Quantity buttons scale on interaction
- Total amount has smooth transitions

### 5. **Search and Filter**

**File:** `components/SearchBar.tsx`

- Search bar fades in on load
- Input field scales slightly when focused
- Category buttons scale on hover and active press
- Selected category has shadow effect

### 6. **Modals and Dialogs**

**File:** `components/OrderForm.tsx` & `components/ConfirmDialog.tsx`

- **Opening:** Background overlay fades in, modal scales in from center
- **Closing:** Smooth fade-out animation for both overlay and modal ⭐ NEW!
- Close button rotates on hover
- Success state has bouncy check mark
- All buttons have scale effects
- Animations are coordinated for smooth UX

### 7. **Admin Dashboard**

**File:** `components/AdminOrderList.tsx`

- Order cards fade in with stagger effect
- Selected orders scale up
- Consolidate action bar scales in when orders selected
- Success notifications bounce in
- All action buttons have hover and active states
- Checkbox scales on hover

### 8. **Admin Floating Button**

**File:** `components/AdminFloatingButton.tsx`

- Bounces in on appearance
- Rotates on hover
- Scales on hover and press

### 9. **Confirm Dialogs**

**File:** `components/ConfirmDialog.tsx`

- Alert icon wiggles for attention
- Icon container bounces in
- Buttons scale on interaction

## 🎭 Interactive Effects

All interactive elements now have:
- **Hover:** Scale-up (typically 1.05)
- **Active/Press:** Scale-down (0.95) for tactile feedback
- **Transitions:** Smooth easing curves
- **Shadows:** Enhanced on hover for depth
- **Modal Exits:** Coordinated fade-out animations (300ms duration)
- **Sidebar Exits:** Slide-out animation matching entrance timing

## 📱 Performance Notes

All animations:
- Use CSS transforms for GPU acceleration
- Have appropriate durations (200ms-600ms)
- Include `will-change` optimizations via Tailwind classes
- Are disabled for users who prefer reduced motion (via Tailwind defaults)

## 🎪 CSS Utilities

**File:** `app/globals.css`

Additional utility animations:
- Custom spin animation for loading states
- Pulse animation for loading indicators
- Smooth transition helper class

## 🚀 Usage Examples

### Success Feedback
```tsx
className="animate-success-bounce"
```

### Entrance Animation
```tsx
className="animate-fade-in-up"
style={{ animationDelay: `${index * 50}ms` }}
```

### Interactive Button
```tsx
className="transition-all hover:scale-105 active:scale-95 hover:shadow-lg"
```

### Badge Bounce
```tsx
className={shouldAnimate ? "animate-cart-badge-bounce" : ""}
```

## 🎨 Design Philosophy

All animations follow these principles:
1. **Purpose:** Each animation serves a functional purpose
2. **Feedback:** Confirm user actions (especially "Add to Cart")
3. **Polish:** Add delight without being overwhelming
4. **Performance:** GPU-accelerated and optimized
5. **Accessibility:** Respect user motion preferences

