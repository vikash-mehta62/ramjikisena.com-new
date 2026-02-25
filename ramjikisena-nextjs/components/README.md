# Reusable Components

## Navbar Component

Reusable navigation bar component with authentication support.

### Features

- ✅ Responsive design (mobile + desktop)
- ✅ Mobile hamburger menu
- ✅ Active link highlighting
- ✅ Login/Logout state management
- ✅ Sticky header
- ✅ Divine theme styling
- ✅ Icon support for all links

### Usage

```tsx
import Navbar from '@/components/Navbar';

// Basic usage
<Navbar />

// With auth buttons
<Navbar showAuthButtons={true} />

// Without auth buttons (for logged-in pages)
<Navbar showAuthButtons={false} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showAuthButtons` | `boolean` | `true` | Show/hide Login and Sign Up buttons |
| `variant` | `'default' \| 'dashboard'` | `'default'` | Navbar style variant (future use) |

### Navigation Links

The navbar includes these links by default:
- 📖 About (`/about`)
- 🛕 Mandirs (`/mandirs`)
- 🖼️ Gallery (`/gallery`)
- 📞 Contact (`/contact`)

### Authentication States

**Not Logged In:**
- Shows "Login" button
- Shows "Sign Up" button

**Logged In:**
- Shows "Dashboard" button
- Shows "Logout" button

### Mobile Menu

- Hamburger icon on screens < 1024px
- Slide-down menu with all links
- Auto-closes on link click

### Styling

Uses Tailwind CSS with custom divine theme:
- Gradient background: orange → red → orange
- Sticky positioning
- Shadow and glow effects
- Smooth transitions

### Example Pages Using Navbar

1. **Home Page** (`app/page.tsx`)
   ```tsx
   <Navbar showAuthButtons={true} />
   ```

2. **Mandirs Page** (`app/mandirs/page.tsx`)
   ```tsx
   <Navbar showAuthButtons={true} />
   ```

3. **Dashboard** (future)
   ```tsx
   <Navbar showAuthButtons={false} />
   ```

### Customization

To add new links, edit the `navLinks` array in `Navbar.tsx`:

```tsx
const navLinks = [
  { href: '/about', label: 'About', icon: '📖' },
  { href: '/new-page', label: 'New Page', icon: '✨' }, // Add here
];
```

### Active Link Detection

Uses Next.js `usePathname()` to highlight the current page:
- Active links have `text-yellow-300` color
- Hover effect on all links

### Local Storage

Checks `localStorage.getItem('token')` to determine login state.
- Token present = Logged in
- No token = Not logged in

### Logout Functionality

Logout button:
1. Removes token from localStorage
2. Redirects to home page
3. Clears authentication state

### Responsive Breakpoints

- **Mobile**: < 1024px (hamburger menu)
- **Desktop**: ≥ 1024px (full navigation)

### Future Enhancements

- [ ] User profile dropdown
- [ ] Notification badge
- [ ] Search bar integration
- [ ] Theme toggle (light/dark)
- [ ] Language selector
