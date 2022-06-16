import { Auth, google, fitness_v1 } from "googleapis";
import { getAuthClient } from "./auth";

const getDataSources = async (client: Auth.OAuth2Client) => {
  const fitnessApi: fitness_v1.Fitness = google.fitness({
    version: "v1",
    auth: client,
  });
  const { data } = await fitnessApi.users.dataSources.list({
    userId: "me",
  });
  console.log(JSON.stringify(data));
};

const main = async () => {
  const oauth2Client = await getAuthClient();
  const fitnessApi: fitness_v1.Fitness = google.fitness({
    version: "v1",
    auth: oauth2Client,
  });
  const from = Date.parse("2022-01-01") * 1e6;
  const to = Date.parse("2022-12-31") * 1e6;
  const { data } = await fitnessApi.users.dataSources.datasets.get({
    dataSourceId:
      "raw:com.google.weight:com.xiaomi.hm.health:GoogleFitSyncHelper - weight",
    userId: "me",
    datasetId: `${from}-${to}`,
  });

  console.log(JSON.stringify(data, null, 4));
};

main();
