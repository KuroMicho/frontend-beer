# 🍻 Cervecería Artesanal App

Welcome to the Cervecería Artesanal App\! This is a modern, client-side web application built with **React**, **Vite**, and **React Router v7**, demonstrating a CRUD (Create, Read, Update, Delete) interface for managing beer products. It connects to a **GraphQL API Gateway** using **Apollo Client**.

[](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## ✨ Features

- **Modern Frontend:** Built with React 19 and Vite for a blazing-fast development experience and optimized production builds.
- **Intuitive Routing:** Powered by React Router v7 for declarative and robust navigation.
- **Authentication Flow:** Includes secure login and registration routes with authentication guarding using `AuthRouter`.
- **GraphQL Integration:** Uses Apollo Client for efficient data fetching and mutations, interacting with a GraphQL API Gateway.
- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for managing beer products.
- **Responsive UI:** Styled with **Chakra UI** and **Tailwind CSS** for a beautiful and adaptive user experience across devices.
- **Performance Optimized:** Leverages React's `lazy` and `Suspense` for **code splitting** to ensure faster initial page loads.
- **Theming:** Supports light and dark mode toggling.

## 🚀 Getting Started

Follow these steps to get the Cervecería Artesanal App up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher, v20.11.1 recommended)
- npm (or yarn/pnpm)
- A running **GraphQL API Gateway** (this frontend expects one to be available for data operations).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd frontend-beer
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`. Changes to your code will hot-reload in the browser.

### Type Checking

Check for TypeScript errors:

```bash
npm run typecheck
```

## 📦 Building for Production

Create an optimized production-ready build of your application:

```bash
npm run build
```

This command will compile and optimize your code into the `dist/` directory.

### Previewing the Production Build

After building, you can locally preview the production version to ensure everything works as expected before deployment:

```bash
npm run preview
```

## 🌐 Deployment

The `npm run build` command generates static files in the `dist/` directory. This output can be easily deployed to any static site hosting service.

Examples of suitable platforms include:

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- Cloudflare Pages

Simply upload the contents of your `dist/` folder to your chosen hosting provider.

## 🎨 Styling

This project utilizes **Chakra UI** for its robust component library and responsive styling capabilities, alongside **Tailwind CSS** for utility-first styling and efficient design. Both are pre-configured for a seamless development experience.

---

Built with ❤️ and a passion for craft beers.
