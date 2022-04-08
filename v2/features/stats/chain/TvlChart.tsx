import { useTranslation } from "next-i18next";
import React, { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import { formatDollars } from "v2/utils/format";
import { TvlData } from "v2/types";

const Chart: FC<{ data: TvlData[] }> = ({ data }) => {
  const { t } = useTranslation("common");
  const chartData = data ? data.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)) : [];
  const dataMax = getDataMax(chartData);

  return (
    <ResponsiveContainer className="w-full">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="0" stroke="rgb(var(--color-foreground-alt-400))" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
          height={75}
          angle={300}
          tickMargin={35}
          tick={{ fill: "rgb(var(--color-foreground-alt-300))", dx: -20 }}
        />
        <YAxis
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          domain={[0, dataMax]}
          width={100}
          padding={{ top: 50 }}
          tick={{ fill: "rgb(var(--color-foreground-alt-300))", dx: -10 }}
          tickCount={9}
        >
          <Label
            value={t(`v2.stats.chain.tvlYLabel`) as string}
            position="insideLeft"
            angle={-90}
            fill="rgb(var(--color-foreground-alt-100))"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip
          cursor={false}
          contentStyle={{ backgroundColor: "black", color: "#26ff91" }}
          labelFormatter={(label) =>
            new Date(label).toLocaleDateString() + " " + new Date(label).toLocaleTimeString()
          }
          formatter={(value: number) => formatDollars(value)}
        />
        <Line
          type="monotone"
          dataKey={"value"}
          stroke="rgb(var(--color-accent-light))"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const getDataMax = (o: any[]): number => {
  let dataMax = 0;
  for (let i = 0; i < o.length; i++) if (o[i].value > dataMax) dataMax = o[i].value;
  return dataMax;
};

export default Chart;
