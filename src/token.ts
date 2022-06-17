import { promises as fs } from "fs";
import { Auth } from "googleapis";

const TOKEN_STORE_PATH = "store/token.json";

export const restoreToken = async (
  oAuth2Client: Auth.OAuth2Client
): Promise<boolean> => {
  try {
    const token = await fs.readFile(TOKEN_STORE_PATH);
    if (!token) {
      return false;
    }
    oAuth2Client.setCredentials(JSON.parse(token.toString()));
    return true;
  } catch (error) {
    return false;
  }
};

export const storeToken = async (token: Auth.Credentials): Promise<void> => {
  await fs.writeFile(TOKEN_STORE_PATH, JSON.stringify(token));
  return;
};
