import { getAuthClient } from "./auth";
import { fetchLastWeight } from "./fit";

const main = async () => {
  const oauth2Client = await getAuthClient();
  const lastWeight = await fetchLastWeight(oauth2Client);

  console.log(lastWeight);
};

main();
