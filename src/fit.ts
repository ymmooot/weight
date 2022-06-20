import { Auth, google, fitness_v1 } from 'googleapis';
import { GaxiosResponse } from 'googleapis-common';
import { promises as fs } from 'fs';

export type Weight = WeightStore & { diff: number };

type WeightStore = {
  value: number;
  time: number;
};

const STORE_PATH = 'store/weight.json';

const restoreWeight = async (): Promise<WeightStore | null> => {
  try {
    const file = await fs.readFile(STORE_PATH);
    return JSON.parse(file.toString());
  } catch {
    return null;
  }
};

const storeWeight = async (weight: WeightStore): Promise<void> =>
  fs.writeFile(STORE_PATH, JSON.stringify(weight));
const round = (num: number): number => Math.round(num * 100) / 100;

export const fetchLastWeight = async (
  oauth2Client: Auth.OAuth2Client,
  _year?: string,
): Promise<Weight | null> => {
  const year = _year ?? new Date().getFullYear();
  const fitnessApi: fitness_v1.Fitness = google.fitness({
    version: 'v1',
    auth: oauth2Client,
  });

  const from = Date.parse(`${year}-01-01`) * 1e6;
  const to = Date.parse(`${year}-12-31`) * 1e6;

  const { data }: GaxiosResponse<fitness_v1.Schema$Dataset> =
    await fitnessApi.users.dataSources.datasets.get({
      dataSourceId: 'raw:com.google.weight:com.xiaomi.hm.health:GoogleFitSyncHelper - weight',
      userId: 'me',
      datasetId: `${from}-${to}`,
    });

  const lastWeightPoint = data.point![data.point!.length - 1];
  const lastWeightKG = round(lastWeightPoint.value![0].fpVal!);
  const weight = {
    value: lastWeightKG,
    time: parseInt(lastWeightPoint.startTimeNanos!, 10) / 1e6,
  };

  const storedWeight = await restoreWeight();
  if (storedWeight && storedWeight.time === weight.time) {
    return null;
  }
  await storeWeight(weight);
  return {
    ...weight,
    diff: round(storedWeight ? lastWeightKG - storedWeight?.value : 0),
  };
};
