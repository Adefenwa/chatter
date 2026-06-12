# Chatter

A modern publishing platform for writers and readers — built as a credible, text-first alternative to Medium and Hashnode. Chatter focuses on long-form content, personalized discovery, social engagement, and creator analytics.

> "Type is a visual vehicle for language, but it is also a vessel for emotion."

---

## ✨ Features

### Authentication

- Email/password registration and login via Supabase Auth
- Google OAuth sign-in
- Password reset via email magic link
- Protected routes via Next.js middleware
- Row Level Security (RLS) policies across all tables

### Content Creation

- Distraction-free Markdown editor with toolbar (bold, italic, headings, code, images)
- Cover image upload
- Tagging system (up to 5 tags per post)
- Draft → Published → Archived workflow
- Autosave with live save status indicator
- Automatic estimated read time calculation

### Content Discovery

- Personalized home feed of published posts
- Dedicated Explore page with full-text search
- Tag-based browsing
- Trending topics sidebar

### Social Features

- Likes and bookmarks
- Nested comments (2 levels deep)
- Author follow/unfollow
- User profile pages with published posts, bookmarks, and stats

### Creator Analytics

- Dashboard with views, likes, comments, and bookmarks per post
- Engagement chart comparing the last 7 days vs. the previous 7 days (Recharts)
- Top performing posts table

### Accessibility & SEO

- Dynamic Open Graph and Twitter Card metadata per post
- Semantic HTML structure throughout
- Responsive design across mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer                    | Technology                              |
| ------------------------ | --------------------------------------- |
| Framework                | Next.js (App Router)                    |
| Language                 | TypeScript                              |
| Styling                  | Tailwind CSS                            |
| Database & Auth          | Supabase (Postgres, Auth, Storage, RLS) |
| Editor                   | `@uiw/react-md-editor`                  |
| Charts                   | Recharts                                |
| Unit & Component Testing | Vitest + React Testing Library          |
| E2E Testing              | Playwright                              |
| Package Manager          | Bun                                     |
| Deployment               | Vercel                                  |

---

## 📂 Project Structure

```
chatter/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── auth/
│   │   ├── callback/
│   │   └── reset-password/
│   ├── [username]/
│   │   ├── [slug]/          # Reader view
│   │   └── page.tsx          # Profile page
│   ├── dashboard/             # Analytics dashboard
│   ├── explore/                # Search & discovery
│   ├── bookmarks/
│   ├── write/                  # Post editor
│   ├── layout.tsx
│   └── page.tsx                # Home feed
├── components/
│   ├── shared/
│   └── ui/
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── middleware.ts
├── __tests__/
│   ├── unit/
│   └── components/
└── e2e/
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone <repository-url>
cd chatter
bun install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database setup

Run the schema and RLS policies from `/supabase` (or your SQL Editor) to create the following tables:

- `profiles`
- `posts`
- `comments`
- `likes`
- `bookmarks`
- `tags`
- `post_tags`
- `follows`

Each table has Row Level Security enabled with policies enforcing data ownership.

### 4. Run the development server

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🔐 Authentication Setup

1. In Supabase → **Authentication → Providers**, enable **Email** and **Google**.
2. For Google OAuth, create credentials in [Google Cloud Console](https://console.cloud.google.com) and add the callback URL from Supabase to your **Authorised redirect URIs**.
3. Add your production and local URLs to **Authentication → URL Configuration**:

```
Site URL: https://your-app.vercel.app
Redirect URLs:
  https://your-app.vercel.app/**
  http://localhost:3000/**
```

---

## 🧪 Testing

### Unit & Component Tests (Vitest)

```bash
bun test
```

Covers:

- Read time calculation
- Slug generation
- Feed sorting
- Form validation
- `PostCard`, `TagPill`, `CommentThread`, `AnalyticsDashboard` components

### End-to-End Tests (Playwright)

```bash
bun run test:e2e
```

Covers:

- Authentication flows (sign up, login, protected routes, password reset)
- Home feed rendering
- Search and discovery

---

## 📦 Deployment

Chatter is deployed on [Vercel](https://vercel.com). To deploy your own instance:

1. Push your repository to GitHub
2. Import the project into Vercel
3. Add the same environment variables from `.env.local` to Vercel's **Environment Variables** settings
4. Deploy

---

## 📄 License

This project was built as part of an academic exam submission for the AltSchool Africa Frontend Engineering program.

---

## 🙏 Acknowledgements

Built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), [Tailwind CSS](https://tailwindcss.com), and [Recharts](https://recharts.org).
