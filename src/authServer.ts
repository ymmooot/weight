import { Auth } from 'googleapis';
import { createServer } from 'http';
import open from 'open';
import { storeToken } from './token';

export const handleAuthRedirect = (authorizeUrl: string, oAuth2Client: Auth.OAuth2Client) =>
  new Promise<void>(resolve => {
    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith('/oauth2callback')) {
        return;
      }
      const url = new URL(req.url, 'https://hoge.com');
      const code = url.searchParams.get('code');
      if (!code) {
        return;
      }
      console.log(`Code is ${code}`);
      res.end('Authentication successful! Please return to the console.');
      server.close();
      const r = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(r.tokens);
      await storeToken(r.tokens);
      console.info('Tokens acquired.');
      resolve();
    }).listen(3000, () => {
      open(authorizeUrl);
    });
  });
