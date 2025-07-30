# Authentication Setup Guide

This project uses Supabase for authentication. Follow these steps to set up authentication:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Wait for the project to be set up

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/dashboard` (for development)
   - `https://yourdomain.com/dashboard` (for production)

## 4. Email Templates (Optional)

1. Go to Authentication > Email Templates
2. Customize the confirmation and recovery email templates

## 5. Test the Authentication

1. Start your development server: `npm run dev`
2. Visit `/signup` to create an account
3. Visit `/signin` to sign in
4. Visit `/dashboard` to see the protected dashboard

## Features Included

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Protected routes
- ✅ Automatic redirects for authenticated/unauthenticated users
- ✅ User profile display
- ✅ Sign out functionality
- ✅ Loading states and error handling
- ✅ Form validation

## File Structure

```
lib/
├── auth.ts              # Authentication utilities
├── auth-context.tsx     # React context for auth state
└── supabase.ts          # Supabase client configuration

components/auth/
├── signup-form.tsx      # Sign up form component
├── signin-form.tsx      # Sign in form component
├── protected-route.tsx  # Route protection component
├── auth-redirect.tsx    # Auth page redirect component
└── user-profile.tsx     # User profile component

app/(auth)/
├── signup/page.tsx      # Sign up page
└── signin/page.tsx      # Sign in page

app/(default)/
└── dashboard/page.tsx   # Protected dashboard page
```

## Next Steps

- Add password reset functionality
- Implement social authentication (Google, GitHub, etc.)
- Add user profile management
- Create user roles and permissions
- Add email verification requirements 