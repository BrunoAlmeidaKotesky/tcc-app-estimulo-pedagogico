import Header from "@/components/Header";
import { HomeNavigationList } from "@/components/HomeNavigationList";

export default function Home() {
  return (
    <>
      <Header />
      <section className="bg-green-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center flex-col">
          <p className="text-3xl font-semibold">Bem vindo!</p>
          <HomeNavigationList />
        </div>
      </section>
    </>
  );
}
