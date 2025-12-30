
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
=======
# ToyShop

ToyShop is a full-stack web application for managing a toy rental and sales store. It features a modern React frontend and a Node.js/Express backend with MongoDB, providing a complete workflow for customers and administrators.

## User View:

<details>
<summary>Click to view screenshots</summary>

**Home Page**
<br>
<a href="images/image.png" target="_blank">
<img src="images/image.png" alt="Home Page" width="400" />
</a>

**Category Page**
<br>
<a href="images/image-1.png" target="_blank">
<img src="images/image-1.png" alt="Category Page" width="400" />
</a>

**Toy Details**
<br>
<a href="images/image-20.png" target="_blank">
<img src="images/image-20.png" alt="Toy Detail Page" width="400" />
</a>

**About Page**
<br>
<a href="images/image-2.png" target="_blank">
<img src="images/image-2.png" alt="About Page" width="400" />
</a>

**Contact Page**
<br>
<a href="images/image-3.png" target="_blank">
<img src="images/image-3.png" alt="Contact Page" width="400" />
</a>

**Wishlist**
<br>
<a href="images/image-4.png" target="_blank">
<img src="images/image-4.png" alt="Wishlist Page" width="400" />
</a>

**Gift Wrapping**
<br>
<a href="images/image-5.png" target="_blank">
<img src="images/image-5.png" alt="Gift Wrapping Page" width="400" />
</a>

**Checkout**
<br>
<a href="images/image-6.png" target="_blank">
<img src="images/image-6.png" alt="Checkout Page" width="400" />
</a>

**Success Screen**
<br>
<a href="images/image-7.png" target="_blank">
<img src="images/image-7.png" alt="Success Screen" width="400" />
</a>

**Order Tracking**
<br>
<a href="images/image-9.png" target="_blank">
<img src="images/image-9.png" alt="Order Tracking" width="400" />
</a>

**Order Status**
<br>
<a href="images/image-8.png" target="_blank">
<img src="images/image-8.png" alt="Order Status" width="400" />
</a>

**Shopping Cart**
<br>
<a href="images/image-10.png" target="_blank">
<img src="images/image-10.png" alt="Shopping Cart" width="400" />
</a>

**My Orders**
<br>
<a href="images/image-11.png" target="_blank">
<img src="images/image-11.png" alt="My Orders Page" width="400" />
</a>

</details>

## Admin Dashboard:

<details>
<summary>Click to view admin screenshots</summary>

**Reports**
<br>
<a href="images/image-12.png" target="_blank">
<img src="images/image-12.png" alt="Admin Reports" width="400" />
</a>

**Gift Wrapping Management**
<br>
<a href="images/image-13.png" target="_blank">
<img src="images/image-13.png" alt="Gift Wrapping Management" width="400" />
</a>

**Reviews Management**
<br>
<a href="images/image-14.png" target="_blank">
<img src="images/image-14.png" alt="Reviews Management" width="400" />
</a>

**Queries Management**
<br>
<a href="images/image-15.png" target="_blank">
<img src="images/image-15.png" alt="Queries Management" width="400" />
</a>

**Orders Management**
<br>
<a href="images/image-16.png" target="_blank">
<img src="images/image-16.png" alt="Orders Management" width="400" />
</a>

**Categories Management**
<br>
<a href="images/image-17.png" target="_blank">
<img src="images/image-17.png" alt="Categories Management" width="400" />
</a>

**Toy Management**
<br>
<a href="images/image-18.png" target="_blank">
<img src="images/image-18.png" alt="Toy Management" width="400" />
</a>

**User Management**
<br>
<a href="images/image-19.png" target="_blank">
<img src="images/image-19.png" alt="User Management" width="400" />
</a>

</details>

## Features

### Customer Features

- Browse toys by category and age group
- View detailed toy information and reviews
- Register and log in as a customer
- Add toys to cart and wishlist
- Checkout and place orders
- Track order status
- Submit queries and write reviews

### Admin Features

- Manage users (add, edit, delete)
- Manage toys (add, edit, delete, update stock)
- Manage categories
- Manage orders and update order status
- Manage gift wrapping options
- View business analytics and reports

## Tech Stack

- **Frontend:** React, Vite, Context API, modern CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Other:** JWT authentication, RESTful APIs

## Project Structure

```
toyshop/
	backend/
		models/
		controllers/
		routes/
		config/
		server.js
		...
	frontend/
		src/
			components/
			pages/
			context/
			utils/
		public/
		...
	docs/
	README.md
```

## Setup Instructions

### Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set up your `.env` file (see `backend/config/db.js` for required variables).
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Usage

- Visit the frontend at `http://localhost:5173` (or as shown in your terminal).
- The backend runs on `http://localhost:5000` by default.
- Register as a user or log in as admin to access management features.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is for educational purpos
