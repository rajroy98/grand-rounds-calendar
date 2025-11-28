# Troubleshooting Infinite Loading on OAuth Consent

## Possible Causes:

1. **Redirect URI mismatch** - Most common issue
2. OAuth consent screen not fully configured
3. Browser cache/cookies issue
4. Network/firewall blocking localhost

## Solutions to Try:

### Solution 1: Verify Redirect URI (Most Important)

1. Go to: https://console.cloud.google.com/apis/credentials?project=tidy-resolver-470123-u2
2. Click on your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"
4. Make sure EXACTLY this is listed (case-sensitive, no trailing slash):
   ```
   http://localhost:3000/api/auth/callback
   ```
5. If it's different or missing, update it and SAVE

### Solution 2: Clear Browser Cache/Cookies

1. Try in an **Incognito/Private window**
2. Or clear cookies for `accounts.google.com`
3. Then try the authorization URL again

### Solution 3: Check OAuth Consent Screen Status

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=tidy-resolver-470123-u2
2. Check "Publishing status"
3. Should be "Testing" (not "In production")
4. Make sure all required fields are filled

### Solution 4: Try Different Redirect URI

If localhost keeps failing, we can use a different approach with a public redirect URI or use a service account instead.

### Solution 5: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any JavaScript errors
4. Go to Network tab and see if requests are failing

## Alternative: Use a Public Redirect URI

If localhost continues to fail, we can:
1. Use `http://127.0.0.1:3000/api/auth/callback` instead
2. Or use a service account (different authentication method)
3. Or use a public redirect URI service

