import { getAuthClient } from "./auth";
import { fetchLastWeight } from "./fit";
import { send } from "./discord";

const main = async () => {
  const oauth2Client = await getAuthClient();
  const lastWeight = await fetchLastWeight(oauth2Client);

  if (!lastWeight) {
    console.log("New record is not found");
    return;
  }

  await send(lastWeight);
};

main();
