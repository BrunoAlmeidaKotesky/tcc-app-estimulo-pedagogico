"use client";

import Spinner from "./Spinner";
import Link from "next/link";
import useSession from "@/lib/useSession";
import useStore from "@/store";
import ApiClient from "@/lib/ApiClient";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { match, P } from 'ts-pattern';
import { HeaderLink } from "./HeaderLink";

const Header = () => {
  const store = useStore();
  const parentUser = useSession('parent');
  const childUser = useSession('child');
  const router = useRouter();

  const handleLogout = async () => {
    store.setRequestLoading(true);
    const res = await ApiClient.logoutUser();
    if (res.isErr())
      return toast.error("Erro ao fazer logout");
    store.reset();
    router.push('/login');
  };

  const renderLinks = () => match([parentUser.isNone(), childUser.isNone()])
      .with([true, true], () => (
        <>
          <HeaderLink href="/cadastro" text="Cadastro" />
          <HeaderLink href="/login" text="Login" />
        </>
      ))
      .with([false, P._], () => (
        <>
          <HeaderLink href="/perfil" text="Perfil" />
          <HeaderLink text="Sair" onClick={handleLogout} />
        </>
      ))
      .with([true, false], () => (
        <>
          <HeaderLink href="/questionario" text="Questionário" />
          <HeaderLink text="Sair" onClick={handleLogout} />
        </>
      ))
      .exhaustive();
  

  return (
    <>
      <header className="bg-white h-20">
        <nav className="h-full flex justify-between container items-center">
          <div>
            <Link href="/" className="text-ct-dark-600 text-2xl font-semibold">
              TCC APP DE ESTIMULAÇÃO PEDAGÓGICA
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/" className="text-ct-dark-600">
                Home
              </Link>
            </li>
            {renderLinks()}
          </ul>
        </nav>
      </header>
      <div className="pt-4 pl-2 bg-ct-blue-600 fixed">
        {store.requestLoading && <Spinner color="text-ct-yellow-600" />}
      </div>
    </>
  );
};

export default Header;
