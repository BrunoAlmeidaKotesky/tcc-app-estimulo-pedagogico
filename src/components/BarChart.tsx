"use client";

import { DashboardDataItem } from "@/lib/types";
import { useDashboardStore } from "@/store";
import {
  Tooltip,
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartBarChart,
  XAxis,
  YAxis,
} from "recharts";

interface GraphsProps {
  graphsData: DashboardDataItem[];
}
export const BarChart: React.FC<GraphsProps> = ({ graphsData }) => {
  const store = useDashboardStore();

  const graphData = store.isEveryChild
    ? [
        {
          name: "Todos filhos",
          value: graphsData
            .map((data) => data.points)
            .reduce((acc, value) => acc + value),
        },
      ]
    : [
        {
          name: graphsData.find((data) => data.name === store.selectedChild)
            ?.name,
          value: graphsData.find((data) => data.name === store.selectedChild)
            ?.points,
        },
      ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <em style={{ fontSize: "14px" }}>Quantidade de pontos</em>
      <RechartBarChart width={300} height={250} data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Pontos" />
      </RechartBarChart>
    </div>
  );
};
