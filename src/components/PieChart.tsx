"use client";

import {
  extractDataByDifficulty,
  extractDataBySubject,
  generateRandomColor,
} from "@/lib/helpers";
import { DashboardDataItem } from "@/lib/types";
import { useDashboardStore } from "@/store";
import {
  PieChart as RechartPieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GraphsProps {
  graphsData: DashboardDataItem[];
}

export function PieChart({ graphsData }: GraphsProps) {
  const { selectedChild, isEveryChild, generatedColors, setGeneratedColors } =
    useDashboardStore();

  let filteredData = graphsData;

  if (!isEveryChild) {
    filteredData = graphsData.filter((item) => item.name === selectedChild);
  }

  const dataBySubject = extractDataBySubject(filteredData);
  const dataByDifficulty = extractDataByDifficulty(filteredData);
  const totalSectors = dataBySubject.length + dataByDifficulty.length;

  if (generatedColors.length !== totalSectors) {
    const newGeneratedColors = Array.from({ length: totalSectors }, () =>
      generateRandomColor()
    );
    setGeneratedColors(newGeneratedColors);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        margin: "12px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <em style={{ fontSize: 14 }}>
          Quantidade de respostas respondidas por máteria.
        </em>
        <RechartPieChart width={300} height={300}>
          <Pie
            data={dataBySubject}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={60}
            label
          >
            {dataBySubject.map((entry, index) => (
              <Cell key={index} fill={generatedColors[index]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </RechartPieChart>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <em style={{ fontSize: 14 }}>
          Quantidade de respostas respondidas por dificuldade.
        </em>
        <RechartPieChart width={300} height={300}>
          <Pie
            data={dataByDifficulty}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={60}
            label
          >
            {dataByDifficulty.map((entry, index) => (
              <Cell
                key={index}
                fill={generatedColors[dataBySubject.length + index]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </RechartPieChart>
      </div>
    </div>
  );
}
