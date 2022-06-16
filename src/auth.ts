import { Auth, google } from "googleapis";
import { handleAuthRedirect } from "./authServer";
import { restoreToken } from "./store";

// if you changed the scopes, you have to clear store/token.json
const SCOPES = ["https://www.googleapis.com/auth/fitness.body.read"];

export const getAuthClient = async (): Promise<Auth.OAuth2Client> => {
  let oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "http://localhost:3000/oauth2callback",
  });

  const ok = await restoreToken(oAuth2Client);
  if (ok) {
    return oAuth2Client;
  }

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  await handleAuthRedirect(url, oAuth2Client);
  return oAuth2Client;
};
