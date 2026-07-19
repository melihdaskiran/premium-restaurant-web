# L'Etoile Restaurant & CMS

A premium, full-stack restaurant website featuring an elegant, modern UI for customers and a secure Content Management System (CMS) for administrators.

## Features

- **Premium Customer Interface**: Built with Next.js, Framer Motion, and Tailwind CSS. Features dark-mode aesthetics, glassmorphism, and a highly responsive design fit for a fine-dining experience.
- **Dynamic Menu Integration**: Menu items are fetched and categorized dynamically from the backend API.
- **Secure Admin Panel (CMS)**: 
  - Manage menu items (Create, Update, Delete).
  - Secure login with **JWT (JSON Web Tokens)**.
  - XSS Protection via **HTTP-Only Cookies**.
  - Passwords are securely hashed using **BCrypt** (`$2a$` format).
  - Ability to change username and password securely from the dashboard.
- **Clean Architecture Backend**: The .NET 8 API is built using Clean Architecture principles, ensuring scalability, maintainability, and clear separation of concerns (Domain, Application, Infrastructure, API).

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: TypeScript

### Backend
- **Framework**: [.NET 8](https://dotnet.microsoft.com/) Minimal APIs
- **Architecture**: Clean Architecture & CQRS (via MediatR)
- **Database**: SQLite (via Entity Framework Core)
- **Security**: JWT Bearer Auth & BCrypt.Net-Next

## Getting Started

### Prerequisites
- Node.js (v18+)
- .NET 8 SDK

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/RestaurantApp.API
   ```
2. Run the API:
   ```bash
   dotnet run
   ```
   > The API will automatically create the `restaurant.db` SQLite file and seed the initial categories and the default admin user.

**Default Admin Credentials:**
- **Username**: `admin`
- **Password**: `password`

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Usage

- **Customer Site**: Open `http://localhost:3000` in your browser.
- **Admin Panel**: Open `http://localhost:3000/admin` to log in and manage the menu.

## Security Considerations
- The API uses `SameSite=Strict` and `HttpOnly` for JWT cookies.
- Ensure to change the default admin credentials upon your first login.
- In a production environment, ensure both the Next.js frontend and .NET API are served over **HTTPS** so that secure cookies function correctly.

## License
MIT License
