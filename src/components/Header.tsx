"use client";

import Spinner from "./Spinner";
import Link from "next/link";
import useSession from "@/lib/useSession";
import useStore, { useAppStore } from "@/store";
import ApiClient from "@/lib/ApiClient";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { HeaderLink } from "./HeaderLink";
import { useMemo } from "react";

const Header = () => {
  const store = useStore(useAppStore, (s) => s);
  //useSession();
  const router = useRouter();

  const handleLogout = async () => {
    store?.setRequestLoading(true);
    const res = await ApiClient.logoutUser();
    if (res.isErr()) {
      store?.setRequestLoading(false);
      return toast.error("Erro ao fazer logout");
    }
    store?.reset(true);
    router.push("/login");
    store?.setRequestLoading(false);
  };

  const links = useMemo(() => {
    if (store?.userType === null) {
      return (
        <>
          <HeaderLink text="Cadastro" href="/cadastro" />
          <HeaderLink text="Login" href="/login" />
        </>
      );
    } else if (store?.userType === "parent") {
      return (
        <>
          <HeaderLink text="Perfil" href="/perfil" />
          <HeaderLink text="Dashboard" href="dashboard" />
          <HeaderLink text="Sair" onClick={handleLogout} />
        </>
      );
    } else if (store?.userType === "child") {
      return (
        <>
          <HeaderLink text="Questionário" href="/questionario" />
          <HeaderLink text="Medalhas" href="/medalhas" />
          <HeaderLink text="Sair" onClick={handleLogout} />
        </>
      );
    }
    return null;
  }, [store?.userType]);

  return (
    <>
      <header className="bg-white h-20">
        <nav className="h-full flex justify-between container items-center">
          <div>
            <Link href="/" className="text-ct-dark-600 text-2xl font-semibold">
              TCC
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/" className="text-ct-dark-600">
                Home
              </Link>
            </li>
            {links}
          </ul>
        </nav>
      </header>
      <div className="pt-4 pl-2 bg-green-600 fixed">
        {store?.requestLoading && <Spinner color="text-ct-yellow-600" />}
      </div>
    </>
  );
};

export default Header;
