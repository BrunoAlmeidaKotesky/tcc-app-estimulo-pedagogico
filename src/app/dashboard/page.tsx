import { BarChart } from "@/components/BarChart";
import { PieChart } from "@/components/PieChart";
import Header from "@/components/Header";
import ApiClient from "@/lib/ApiClient";
import { cookies } from "next/headers";
import { DashboardDropdown } from "@/components/DashboardDropdown";
import { BarChartCorrectAnswer } from "@/components/BarChartCorrectAnswer";
import ErrorBoundary from "@/components/ErrorBoundry";

export default async function Dashboard() {
  const cookieStore = cookies();
  const token = cookieStore?.get("token");
  const graphsResponse = await ApiClient.getDashboardData(token?.value);

  if (graphsResponse.isErr()) return <div>{graphsResponse.error.message}</div>;

  const graphsData = graphsResponse.unwrap();

  return (
    <>
      <Header />
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md flex flex-col p-5 h-full">
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "blue" }}>
            Dashboard
          </p>
          <div
            style={{
              height: "100%",
              display: "flex",
              width: "100%",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <p style={{ fontSize: "18px", color: "blue" }}>
              Visualize o desempenho de seu(s) filho(s) através de gráficos e
              estatísticas. É possível filtrar por matéria escolar e também por
              algum filho específico.
            </p>
            <DashboardDropdown children={graphsData.map((n) => n.name)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <ErrorBoundary>
              <BarChart graphsData={graphsData} />
            </ErrorBoundary>
            <ErrorBoundary>
              <BarChartCorrectAnswer graphsData={graphsData} />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <PieChart graphsData={graphsData} />
          </ErrorBoundary>
        </div>
      </section>
    </>
  );
}
