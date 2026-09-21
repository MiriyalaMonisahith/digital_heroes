"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CharityContributionChart({
  data,
}: {
  data: { charity: string; total: number }[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-charcoal-500">
        No donations recorded yet — figures will appear once subscribers start contributing.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="#ded8c4" />
        <XAxis
          type="number"
          tickFormatter={(v) => `₹${v.toLocaleString()}`}
          tick={{ fill: "#6b7568", fontSize: 12 }}
          axisLine={{ stroke: "#ded8c4" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="charity"
          width={140}
          tick={{ fill: "#3a4235", fontSize: 13 }}
          axisLine={{ stroke: "#ded8c4" }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#eef2ee" }}
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Contributed"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #ded8c4",
            background: "#f7f5ee",
            fontSize: 13,
          }}
        />
        <Bar dataKey="total" fill="#5c7a63" radius={[0, 4, 4, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
