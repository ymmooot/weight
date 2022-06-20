import fetch from "node-fetch";
import format from "date-fns/format";
import { Weight } from "./fit";

const DISCORD_WEBSOCKET_URL = process.env.DISCORD_WEBSOCKET_URL ?? "";

const COLORS = {
  GREEN: "C1F487",
  YELLOW: "F5DE6F",
  GRAY: "d8d8d8",
};

export const send = async (weight: Weight): Promise<void> => {
  if (!DISCORD_WEBSOCKET_URL) {
    return;
  }

  const color =
    weight.diff === 0 ? "GRAY" : weight.diff > 0 ? "YELLOW" : "GREEN";
  const plus = weight.diff > 0 ? "+" : "";

  await fetch(DISCORD_WEBSOCKET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          color: parseInt(COLORS[color], 16),
          fields: [
            {
              name: "Weight",
              value: `${weight.value} kg`,
              inline: true,
            },
            {
              name: "Diff from last time",
              value: weight.diff !== 0 ? `${plus}${weight.diff} kg` : "None",
              inline: true,
            },
            {
              name: "Measured At",
              value: format(new Date(weight.time), "yyyy-MM-dd(E) HH:mm"),
            },
          ],
        },
      ],
    }),
  });
};
