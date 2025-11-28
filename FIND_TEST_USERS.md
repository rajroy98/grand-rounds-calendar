# How to Find and Add Test Users

If you don't see "Configure Consent Screen", the consent screen is already set up. Here's how to add test users:

## Option 1: From OAuth Consent Screen Page

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=tidy-resolver-470123-u2

2. You should see the consent screen configuration page with tabs/sections like:
   - **PUBLISHING STATUS** (at the top - should say "Testing" or "In production")
   - **OAuth consent screen** (main content)
   - Scroll down to find **"Test users"** section

3. Look for a section that says:
   - "Test users" or "Users" 
   - Or a button/link that says "ADD USERS" or "+ ADD USERS"

4. If you see "Test users" section:
   - Click "+ ADD USERS" or "ADD USERS" button
   - Enter: `rajroy121998@gmail.com`
   - Click "ADD"

## Option 2: Check Publishing Status

1. On the OAuth consent screen page, look at the top
2. You should see "Publishing status: Testing" or "Publishing status: In production"
3. If it says "In production", you need to:
   - Click "PUBLISH APP" or change it to "Testing" mode
   - In Testing mode, you can add test users
   - In Production mode, the app needs verification (more complex)

## Option 3: Edit the Consent Screen

1. On the OAuth consent screen page
2. Look for an "EDIT APP" button (usually at the top right)
3. Click it to edit the configuration
4. Navigate through the steps until you reach "Test users"
5. Add your email there

## What You Should See

The page should look something like this:
```
OAuth consent screen
├── Publishing status: Testing
├── App information
├── Scopes
├── Test users  ← LOOK FOR THIS SECTION
│   └── [+ ADD USERS] button
└── Summary
```

## If You Still Can't Find It

Take a screenshot of what you see on the OAuth consent screen page, and I can help you locate the exact button/link to add test users.

