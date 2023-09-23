import { Graphs } from "@/components/Graphs";
import Header from "@/components/Header";

export default async function Dashboard() {
  return (
    <>
      <Header />
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md flex flex-col p-5 h-full">
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "blue" }}>
            Dashboard
          </p>
          <Graphs />
        </div>
      </section>
    </>
  );
}
