import Header from "@/components/Header";
import { ChildLogin } from "./child-login";

export default async function ParentLoginPage() {
  return (
    <>
      <Header />
      <section className="bg-green-600 min-h-screen grid place-items-center">
        <ChildLogin />
      </section>
    </>
  );
}
