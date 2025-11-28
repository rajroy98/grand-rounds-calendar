# Try OAuth Flow Without Test User

Sometimes Google allows the project owner to authorize even without being explicitly added as a test user. Try this:

## Quick Test

1. Make sure your OAuth consent screen is at least partially configured:
   - Go to: https://console.cloud.google.com/apis/credentials/consent?project=tidy-resolver-470123-u2
   - If you see "Configure Consent Screen", click it and fill in at least:
     - App name
     - User support email (your email)
     - Developer contact email (your email)
   - Save it (you don't need to complete all steps)

2. Try the OAuth flow:
   - Open this URL in your browser (make sure you're logged in as rajroy121998@gmail.com):
   ```
   https://accounts.google.com/o/oauth2/v2/auth?client_id=520052013110-r3qnpapi8erfbtlmbe37kvjmfst8md1d.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&response_type=code&scope=https%3A%2F%%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&access_type=offline&prompt=consent
   ```

3. If it works, you'll get redirected with a code. If you get "Access blocked", then you definitely need to add yourself as a test user.

## If Still Blocked

The only way forward is to add yourself as a test user. Here's what to check:

1. **Check Publishing Status**: 
   - In OAuth consent screen, look for "Publishing status"
   - It should say "Testing" (not "In production")
   - If it says "In production", you need to verify the app (which requires verification)

2. **Complete OAuth Consent Screen Setup**:
   - Go through ALL the steps:
     - App information (required fields)
     - Scopes (add calendar.readonly)
     - Test users (add your email here)
     - Summary
   - Make sure you click "SAVE" on each step

3. **Check Project Permissions**:
   - Make sure you're the owner or have "Owner" or "Editor" role on the project
   - Go to: IAM & Admin > IAM
   - Verify your email has the right permissions

