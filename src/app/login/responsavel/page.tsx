import Header from "@/components/Header";
import LoginForm from "./login-form";

export default async function ParentLoginPage() {
  return (
    <>
      <Header />
      <section className="bg-green-600 min-h-screen grid place-items-center">
        <LoginForm />
      </section>
    </>
  );
}
