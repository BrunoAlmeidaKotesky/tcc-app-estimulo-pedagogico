"use client";

import useStore, { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import {
  BsBarChartFill,
  BsFillPersonLinesFill,
  BsPencilFill,
  BsFillPersonPlusFill,
} from "react-icons/bs";

import { BiLogIn } from "react-icons/bi";

import { FaMedal } from "react-icons/fa";

export const HomeNavigationList = () => {
  const userType = useStore(useAppStore, (s) => s.userType);
  const router = useRouter();

  return (
    <>
      {!userType && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "50px",
            flexDirection: "column",
          }}
        >
          <p>Para acessar a plataforma, cadastre-se ou realize login</p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              className="bg-ct-yellow-600"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80px",
                width: "120px",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={() => router.push("/login")}
            >
              <BiLogIn style={{ fontSize: "64px" }} />

              <p style={{ fontWeight: "bold" }}>Login</p>
            </button>

            <button
              className="bg-ct-yellow-600"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80px",
                width: "120px",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={() => router.push("/cadastro")}
            >
              <BsFillPersonPlusFill style={{ fontSize: "64px" }} />
              <p style={{ fontWeight: "bold" }}>Cadastro</p>
            </button>
          </div>
        </div>
      )}
      {userType === "parent" && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "50px",
            flexDirection: "column",
          }}
        >
          <p>Acesse seus dados ou visualize o desempenho de seu(s) filho(s)</p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80px",
                width: "120px",
                backgroundColor: "#1B4D3E",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={() => router.push("/perfil")}
            >
              <BsFillPersonLinesFill style={{ fontSize: "64px" }} />
              <p style={{ fontWeight: "bold" }}>Perfil</p>
            </button>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80px",
                width: "120px",
                backgroundColor: "#1B4D3E",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={() => router.push("/dashboard")}
            >
              <BsBarChartFill style={{ fontSize: "64px" }} />
              <p style={{ fontWeight: "bold" }}>Dashboard</p>
            </button>
          </div>
        </div>
      )}
      {userType === "child" && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "50px",
            flexDirection: "column",
          }}
        >
          <p>Responda um grupo de questões ou visualize as medalhas</p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80px",
                width: "120px",
                backgroundColor: "#1B4D3E",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={() => router.push("/questionario")}
            >
              <BsPencilFill style={{ fontSize: "64px" }} />
              <p style={{ fontWeight: "bold" }}>Questionário</p>
            </button>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80px",
                width: "120px",
                backgroundColor: "#1B4D3E",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={() => router.push("/medalhas")}
            >
              <FaMedal style={{ fontSize: "64px" }} />
              <p style={{ fontWeight: "bold" }}>Medalhas</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
