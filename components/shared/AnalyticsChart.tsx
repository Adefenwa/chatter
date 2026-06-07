"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  data: {
    day: string;
    current: number;
    previous: number;
  }[];
};

export default function AnalyticsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={4}>
        <XAxis
          dataKey="day"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "white",
          }}
        />
        <Legend
          wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
        />
        <Bar
          dataKey="current"
          name="Last 7 Days"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="previous"
          name="Previous 7 Days"
          fill="rgba(59,130,246,0.2)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
