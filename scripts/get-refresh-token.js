/**
 * Helper script to get a Google OAuth2 refresh token
 * 
 * Usage:
 * 1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file
 * 2. Run: node scripts/get-refresh-token.js
 * 3. Follow the instructions to authorize and get the refresh token
 */

const readline = require('readline');
const https = require('https');
const http = require('http');
const url = require('url');

require('dotenv').config({ path: '.env.local' });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      
      if (parsedUrl.pathname === '/callback') {
        const code = parsedUrl.query.code;
        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>Authorization successful!</h1>
                <p>You can close this window.</p>
                <script>window.close();</script>
              </body>
            </html>
          `);
          resolve(code);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Error: No authorization code received');
          resolve(null);
        }
        server.close();
      }
    });

    server.listen(3000, () => {
      console.log('Local server started on http://localhost:3000');
    });
  });
}

function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.refresh_token) {
            resolve(response);
          } else {
            reject(new Error('No refresh token in response: ' + JSON.stringify(response)));
          }
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('\n=== Google OAuth2 Refresh Token Generator ===\n');
  console.log('This script will help you get a refresh token for the Google Calendar API.\n');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly')}&` +
    `access_type=offline&` +
    `prompt=consent`;

  console.log('Step 1: Open this URL in your browser:');
  console.log('\n' + authUrl + '\n');
  console.log('Step 2: Authorize the application');
  console.log('Step 3: You will be redirected to localhost:3000/callback\n');
  
  await question('Press Enter after you have authorized the application...\n');

  const code = await startServer();
  
  if (!code) {
    console.error('Failed to get authorization code');
    process.exit(1);
  }

  console.log('\nExchanging authorization code for refresh token...');
  
  try {
    const tokens = await exchangeCodeForToken(code);
    console.log('\n✅ Success! Here are your tokens:\n');
    console.log('Refresh Token:');
    console.log(tokens.refresh_token);
    console.log('\nAccess Token (expires in 1 hour):');
    console.log(tokens.access_token);
    console.log('\nAdd the refresh token to your .env file:');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }

  rl.close();
}

main();

