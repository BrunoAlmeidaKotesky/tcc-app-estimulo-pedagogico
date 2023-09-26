"use client";

import { DashboardDataItem } from "@/lib/types";
import { useDashboardStore } from "@/store";
import {
  CartesianGrid,
  Legend,
  BarChart as RechartBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";

interface GraphsProps {
  graphsData: DashboardDataItem[];
}

interface SubjectCount {
  subject: string;
  value: number;
}

export const BarChartCorrectAnswer: React.FC<GraphsProps> = ({
  graphsData,
}) => {
  const { isEveryChild, selectedChild } = useDashboardStore();

  const groupedBySubject = isEveryChild
    ? graphsData.map((data) => data.exercisesGroupedBySubject)
    : [
        graphsData.find((data) => data.name === selectedChild)
          ?.exercisesGroupedBySubject,
      ];

  const modifiedObject: Record<string, SubjectCount> = {};

  groupedBySubject.forEach((childGroupBySubject) => {
    for (const key in childGroupBySubject) {
      if (childGroupBySubject.hasOwnProperty(key)) {
        const correctAnswers = childGroupBySubject[key].filter(
          (item) => item.isCorrect === true
        ).length;

        if (modifiedObject[key]) {
          modifiedObject[key].value += correctAnswers;
        } else {
          modifiedObject[key] = { subject: key, value: correctAnswers };
        }
      }
    }
  });

  const groupedBySubjectArray = Object.values(modifiedObject);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <em style={{ fontSize: "14px" }}>Quantidade de acertos por matéria.</em>
      <RechartBarChart
        outerRadius={90}
        width={550}
        height={250}
        data={groupedBySubjectArray}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Acertos" fill="#8884d8" />
      </RechartBarChart>
    </div>
  );
};
