# Warrior Learning OS: Supabase + Vercel

This version is designed for cloud hosting:

- **Vercel** hosts the webpage.
- **Supabase Auth** provides email/password accounts.
- **Supabase Postgres** stores one private JSONB learning state per user.
- **Row Level Security (RLS)** ensures each signed-in user can only access their own row.
- **JSON Backup** exports the currently loaded state from the browser.

## 1. Create the Supabase backend

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Copy all SQL from `supabase/setup.sql` and run it.
4. Open **Authentication > Providers > Email**.
5. Keep Email/Password enabled.
6. Decide whether email confirmation is required:
   - Enabled: new users must confirm the email before signing in.
   - Disabled: account creation signs the user in immediately.

The SQL creates `public.learning_states` and private per-user RLS policies.

## 2. Get the two public client values

In Supabase, open the project's **Connect** or **API Keys** area and copy:

- Project URL
- Publishable key, or legacy anon key

Do **not** use or expose the service-role/secret key. This app only needs the public client key because Supabase Auth plus RLS controls access.

## 3. Deploy to Vercel

Upload this folder to a GitHub repository, import that repository into Vercel, then add these Environment Variables:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```

Use these build settings:

```text
Framework Preset: Other
Build Command: npm run build
Output Directory: dist
```

Deploy or redeploy after adding the variables.

## 4. First use

1. Open the Vercel URL.
2. Select **Create account**.
3. If email confirmation is enabled, confirm the email.
4. Sign in.
5. Add a task and wait for **Saved to Supabase**.
6. Open the site on another device and sign in using the same account.

## Local development

Create `.env.local`:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```

Then run:

```sh
npm install
npm run dev
```

## Data model

Each user has one row:

```text
learning_states
├── user_id     UUID, primary key
├── state       JSONB
└── updated_at  timestamp
```

The JSONB state contains:

```json
{
  "activeDates": [],
  "tasks": [],
  "revs": [],
  "back": []
}
```

## Security

- The browser receives only the Supabase publishable/anon key.
- Never add `SUPABASE_SECRET_KEY` or service-role keys to this frontend.
- RLS restricts select, insert, update, and delete by `auth.uid()`.
- The app refreshes expired sessions using the Supabase refresh token.
- Each user sees only their own learning state.

## Backup

Use **JSON Backup** in the app header. It downloads the current state as a local JSON file.
