# Manual Steps to Get Refresh Token

Since Node.js is not installed, follow these manual steps:

## Step 1: Get Authorization Code

1. Visit this URL in your browser (make sure you're logged in as `rajroy121998@gmail.com`):
   ```
   https://accounts.google.com/o/oauth2/v2/auth?client_id=520052013110-r3qnpapi8erfbtlmbe37kvjmfst8md1d.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly&access_type=offline&prompt=consent
   ```

2. Click "Allow" to authorize the application

3. You'll be redirected to `http://localhost:3000/api/auth/callback?code=...`

4. **Copy the entire URL** from your browser's address bar

## Step 2: Extract the Authorization Code

From the URL, extract the `code` parameter. For example, if the URL is:
```
http://localhost:3000/api/auth/callback?code=4/0AeanR...xyz&scope=...
```

The code is: `4/0AeanR...xyz` (everything between `code=` and the next `&`)

## Step 3: Exchange Code for Refresh Token

Run this curl command (replace `YOUR_AUTHORIZATION_CODE` with the code from Step 2, and `YOUR_CLIENT_SECRET` with your actual client secret):

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/json" \
  -d '{
    "code": "YOUR_AUTHORIZATION_CODE",
    "client_id": "520052013110-r3qnpapi8erfbtlmbe37kvjmfst8md1d.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "http://localhost:3000/api/auth/callback",
    "grant_type": "authorization_code"
  }'
```

## Step 4: Save the Refresh Token

The response will look like:
```json
{
  "access_token": "...",
  "expires_in": 3599,
  "refresh_token": "1//0abc...xyz",
  "scope": "...",
  "token_type": "Bearer"
}
```

Copy the `refresh_token` value and add it to your `.env.local` file:
```
GOOGLE_REFRESH_TOKEN=1//0abc...xyz
```

## Alternative: Use an Online Tool

You can also use Postman or any HTTP client to make the POST request to exchange the code for tokens.

