import Header from "@/components/Header";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <>
      <Header />
      <section className="bg-green-600 min-h-screen grid place-items-center">
        <div className="w-full">
          <h2 className="text-lg text-center mb-4 text-ct-dark-200">
            Faça login para continuar
          </h2>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              gap: "16px",
            }}
          >
            <Link href={"/login/responsavel"}>
              <button className="w-full bg-ct-dark-200 text-green-600 rounded-md py-2 px-4">
                Sou Responsável
              </button>
            </Link>
            <Link href={"/login/filho"}>
              <button className="w-full bg-ct-dark-200 text-green-600 rounded-md py-2 px-4">
                Sou Filho
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
