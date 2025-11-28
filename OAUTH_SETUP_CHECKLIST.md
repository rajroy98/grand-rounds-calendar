# OAuth Setup Checklist

## What You Need to Configure:

### 1. OAuth 2.0 Client ID (Credentials) ✅
**Location:** https://console.cloud.google.com/apis/credentials?project=tidy-resolver-470123-u2

**What to check:**
- Your OAuth 2.0 Client ID exists
- **Authorized redirect URIs** includes:
  ```
  http://localhost:3000/api/auth/callback
  ```
- If it's not there, click on your OAuth client ID → Add URI → Save

### 2. OAuth Consent Screen
**Location:** https://console.cloud.google.com/apis/credentials/consent?project=tidy-resolver-470123-u2

**Authorized domains:**
- For **localhost**, you typically DON'T need to add anything
- Authorized domains are mainly for production domains (like yourdomain.com)
- Localhost works automatically for development

**What you DO need:**
- App information filled in
- Scopes added: `https://www.googleapis.com/auth/calendar.readonly`
- Test users: Add `rajroy121998@gmail.com`
- Publishing status: Should be "Testing" (not "In production")

### 3. Google Calendar API
**Location:** https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=tidy-resolver-470123-u2

**What to check:**
- API should be **ENABLED**
- If not, click "ENABLE"

## Summary:

✅ **Authorized redirect URI** (in OAuth Client ID): `http://localhost:3000/api/auth/callback`
❌ **Authorized domains** (in OAuth Consent Screen): NOT needed for localhost

The most important thing is making sure the redirect URI is in your OAuth 2.0 Client ID settings!

