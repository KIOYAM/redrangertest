# PromptGen - AI Prompt Builder

A modern, secure web application for generating prompts with role-based AI access.

## 🚀 Features

*   **Role-Based Access**: Admin panel to manage user permissions.
*   **Dual-Mode Generation**:
    *   **Normal Mode**: Template-based generation for all users.
    *   **AI Mode**: OpenAI-powered generation for approved users.
*   **Modern UI**: Built with Next.js, Tailwind CSS, Shadcn UI, and Framer Motion.
*   **Secure Auth**: Powered by Supabase Authentication.

## 🛠️ Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env.local` and fill in your keys:
    ```bash
    cp .env.example .env.local
    ```
    Required keys:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `OPENAI_API_KEY`

3.  **Database Setup**
    Run the SQL script in `supabase/schema.sql` in your Supabase SQL Editor.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🔑 Admin Access

To become an admin:
1.  Sign up in the app.
2.  Go to Supabase Dashboard -> Table Editor -> `profiles`.
3.  Change your user's `role` to `admin`.
4.  Refresh the app to see the Admin Panel.
