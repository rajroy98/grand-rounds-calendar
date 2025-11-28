# Google Cloud Console Links for Project: tidy-resolver-470123-u2

## Direct Links

### 1. OAuth Consent Screen
https://console.cloud.google.com/apis/credentials/consent?project=tidy-resolver-470123-u2

**What to do here:**
- If not configured: Click "CREATE" or "CONFIGURE CONSENT SCREEN"
- Choose "External" 
- Fill in:
  - App name: `Surgery Grand Rounds` (or any name)
  - User support email: `rajroy121998@gmail.com`
  - Developer contact email: `rajroy121998@gmail.com`
- Click "SAVE AND CONTINUE"
- On Scopes page: Add `https://www.googleapis.com/auth/calendar.readonly`
- On Test users page: Click "+ ADD USERS" and add `rajroy121998@gmail.com`
- Complete all steps and save

### 2. OAuth 2.0 Client IDs (Credentials)
https://console.cloud.google.com/apis/credentials?project=tidy-resolver-470123-u2

**What to check here:**
- Verify your OAuth 2.0 Client ID exists
- Check that redirect URI is: `http://localhost:3000/api/auth/callback`

### 3. Enable Google Calendar API
https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=tidy-resolver-470123-u2

**What to do:**
- Click "ENABLE" if not already enabled

### 4. IAM & Admin (Check Permissions)
https://console.cloud.google.com/iam-admin/iam?project=tidy-resolver-470123-u2

**What to check:**
- Make sure `rajroy121998@gmail.com` has "Owner" or "Editor" role
- This ensures you can modify OAuth consent screen settings

## Quick Authorization URL

Once test user is added, use this URL to authorize:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=520052013110-r3qnpapi8erfbtlmbe37kvjmfst8md1d.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&access_type=offline&prompt=consent
```

