"use client";

import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

export const Graphs = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <p style={{ fontSize: "18px", color: "blue" }}>
        Visualize o desempenho de seu(s) filho(s) através de gráficos e
        estatísticas. É possível filtrar por matéria escolar e também por algum
        filho específico.
      </p>
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <PieChart width={300} height={300}>
          <Pie
            data={[
              { name: "Matemática", value: 30 },
              { name: "Português", value: 10 },
              { name: "Ciências", value: 40 },
              { name: "Geografia", value: 5 },
              { name: "História", value: 15 },
            ]}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={60}
            label
            fill="#8884d8"
          />
          <Legend />
          <Tooltip />
        </PieChart>
        <PieChart width={300} height={300}>
          <Pie
            data={[
              { name: "Matemática", value: 30 },
              { name: "Português", value: 10 },
              { name: "Ciências", value: 40 },
              { name: "Geografia", value: 5 },
              { name: "História", value: 15 },
            ]}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={60}
            label
            fill="#8884d8"
          />
          <Legend />
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};
