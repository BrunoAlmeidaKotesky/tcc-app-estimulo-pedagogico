"use client";

import useStore, { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import {
  BsBarChartFill,
  BsFillPersonLinesFill,
  BsPencilFill,
} from "react-icons/bs";

import { FaMedal } from "react-icons/fa";

export const HomeNavigationList = () => {
  const userType = useStore(useAppStore, (s) => s.userType);
  const router = useRouter();

  return (
    <>
      {userType === "parent" && (
        <div style={{ display: "flex", gap: "10px", marginTop: "50px" }}>
          <button
            style={{
              display: "flex",
              flexDirection: "column",
              height: "80px",
              width: "120px",
              backgroundColor: "blue",
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
              backgroundColor: "blue",
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
      )}
      {userType === "child" && (
        <div style={{ display: "flex", gap: "10px", marginTop: "50px" }}>
          <button
            style={{
              display: "flex",
              flexDirection: "column",
              height: "80px",
              width: "120px",
              backgroundColor: "blue",
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
              backgroundColor: "blue",
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
      )}
    </>
  );
};
