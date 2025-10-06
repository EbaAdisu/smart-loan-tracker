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


