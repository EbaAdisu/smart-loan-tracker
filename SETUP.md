# Setup Guide

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your database:**
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and add your database URL:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/loan_tracker"
     ```

3. **Initialize the database:**

   ```bash
   npm run db:push
   ```

4. **Start the app:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

That's it! You're ready to track your loans.

## Theming

- The app uses a centralized monochrome theme via CSS variables in `src/app/globals.css`.
- To change the entire theme (light/dark or adjust grays), edit the token values in `globals.css` under the `:root[data-theme='mono-light']` and `:root[data-theme='mono-dark']` blocks.
- The default theme is set on the `html` element in `src/app/layout.tsx` using `data-theme="mono-light"`.

### Guardrails

- To prevent accidental reintroduction of colored utilities, run:

```bash
npm run lint:colors
```

This fails if non-neutral Tailwind color utilities (e.g., `bg-blue-600`) are found.
