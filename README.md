# Grand Rounds Calendar

A collaborative calendar application for tracking surgery grand rounds events across multiple institutions in America. Institutions can add the shared Gmail account (`grandroundscollaborative@gmail.com`) to their Zoom calendar invites, and all events will automatically appear in this real-time calendar interface.

## Features

- 📅 **Real-time Calendar View**: Month, week, and day views with automatic updates
- 🏥 **Institution Filtering**: Filter events by institution
- 🔄 **Auto-refresh**: Automatically syncs with Google Calendar every 5 minutes
- 🔗 **Zoom Integration**: Automatically extracts and displays Zoom meeting links
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, intuitive interface with dark mode support

## Prerequisites

- Node.js 18+ and npm
- A Google Cloud Project with Calendar API enabled
- A Gmail account (e.g., `grandroundscollaborative@gmail.com`) for receiving calendar invites

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Calendar API Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth2 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback`
   - Save the Client ID and Client Secret

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace account)
   - Fill in the required fields (App name, User support email, Developer contact email)
   - Add your test email (`grandroundscollaborative@gmail.com`) to the "Test users" section
   - Click "Save and Continue" through the scopes and summary screens
   - **Important**: You must add your email as a test user, otherwise you'll get "Access blocked" error

5. **Get Refresh Token**
   
   You'll need to run an OAuth flow to get a refresh token. Here's a quick script to help:

   ```bash
   node scripts/get-refresh-token.js
   ```
   
   Or manually:
   - Visit: `https://accounts.google.com/o/oauth2/v2/auth?client_id=520052013110-r3qnpapi8erfbtlmbe37kvjmfst8md1d.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly&access_type=offline`
   - Authorize the application
   - Copy the authorization code from the redirect URL
   - Exchange it for a refresh token using the Google OAuth2 API

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   GOOGLE_REFRESH_TOKEN=your-refresh-token
   GOOGLE_CALENDAR_EMAIL=grandroundscollaborative@gmail.com
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Institutions add events**: Institutions add `grandroundscollaborative@gmail.com` as an attendee to their Zoom calendar invites
2. **Events sync automatically**: The application polls Google Calendar API every 5 minutes
3. **Institution detection**: The app automatically identifies institutions from event titles, descriptions, or organizer emails
4. **Real-time display**: All events appear in the calendar interface with filtering capabilities

## Institution Identification

The app automatically identifies institutions from:
- Event titles (e.g., "Johns Hopkins Grand Rounds")
- Event descriptions
- Event locations
- Organizer email domains

You can customize the institution extraction logic in `lib/calendar-service.ts` in the `extractInstitution` method.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

Make sure to set all environment variables in your deployment platform.

## Project Structure

```
grand-rounds-calendar/
├── app/
│   ├── api/
│   │   └── events/
│   │       └── route.ts          # API endpoint for fetching events
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── Calendar.tsx               # Calendar component
│   ├── EventFilters.tsx           # Institution filter component
│   └── EventModal.tsx             # Event details modal
├── lib/
│   └── calendar-service.ts        # Google Calendar API service
└── package.json
```

## Troubleshooting

### Events not showing up

1. **Check API credentials**: Ensure your OAuth2 credentials are correct
2. **Verify refresh token**: Make sure the refresh token is valid and not expired
3. **Check calendar email**: Confirm the calendar email matches the Gmail account receiving invites
4. **Check API quota**: Google Calendar API has rate limits (1,000,000 requests/day by default)

### Authentication errors

- **"Access blocked: app has not completed Google verification" (Error 403: access_denied)**
  - This happens when your email is not added as a test user in the OAuth consent screen
  - Go to Google Cloud Console > APIs & Services > OAuth consent screen
  - Scroll down to "Test users" section
  - Click "+ ADD USERS" and add your email (`grandroundscollaborative@gmail.com`)
  - Save and try the OAuth flow again
- Ensure the refresh token hasn't expired
- Re-run the OAuth flow to get a new refresh token
- Check that the redirect URI matches exactly

### Institution not detected

- Customize the `extractInstitution` method in `lib/calendar-service.ts`
- Ensure institutions follow a consistent naming pattern in their event titles

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

