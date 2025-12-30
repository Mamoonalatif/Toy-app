# BookNest

BookNest is a demo React application implementing a library reservation workflow for a course assignment. It demonstrates catalog browsing, reservations, checkout, QR confirmation, and a basic dashboard. The app persists state in `localStorage` and is responsive.

## Features implemented
- Book catalog with search and genre filter
- Book details page with full information and reviews
- Reservation cart and checkout with per-book pickup date and duration
- Reservation confirmation with generated ID and QR code
- User dashboard (reservations + wishlist)
- Dark mode (persists across sessions)
- Contact form
- LocalStorage persistence for books, cart, reservations, wishlist, and theme
- Responsive layout (mobile, tablet, desktop)

## Tech
- React 18+ (functional components)
- React Router v6
- Context API for state management
- `react-qr-code`, `date-fns`, `uuid`

## Setup
1. Install dependencies

```powershell
cd "c:\Users\mamoo\OneDrive\Desktop\5th_sem\FullStack\React_projects\booknest"
npm install
```

2. Run the dev server

```powershell
npm run dev
```

3. Build for production

```powershell
npm run build
```

## Packaging for submission
Create a ZIP containing all `.js` and `.css` files for the application (do not include `node_modules`). Example PowerShell command (run from project root):

```powershell
$roll = "<YOUR_ROLL_NUMBER>" ;
$dest = "${roll}.zip" ;
Get-ChildItem -Recurse -Include *.js,*.jsx,*.css,*.html,*.md | Compress-Archive -DestinationPath $dest
```

Replace `<YOUR_ROLL_NUMBER>` with your roll number.

## Notes and next steps
- This implementation focuses on the client-side UX and local persistence; a real application would connect to a backend to manage concurrent reservations and users.
- You can extend features like per-book extensions, real email sending, and real QR validation at pickup.

## Screenshots
Open the app locally and capture screenshots for desktop/tablet/mobile, then add them here.
