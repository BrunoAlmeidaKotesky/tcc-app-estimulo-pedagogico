"use client";
import type { AnswerByExercise } from "@/lib/types";
import { useExerciseStore } from "@/store";
import useStore from "@/store";
import { Exercise } from "./Exercise";
import Link from "next/link";
import ApiClient from "@/lib/ApiClient";
import { useState } from "react";
import { Badge } from "@prisma/client";
import { Dialog, Grid } from "@mui/material";
import { BadgeCard } from "./BadgeCard";

export function ExercisesPagination(props: {
  data: AnswerByExercise[];
  token?: string;
}) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const exStore = useStore(useExerciseStore, (s) => s);
  const currentIdx = exStore?.curExerciseIdx ?? 0;
  const shouldIncrement = props?.data?.length !== currentIdx;

  const handleUpdateBadges = async () => {
    const badgesResponse = await ApiClient.grantBadges(props.token);
    if (badgesResponse.isErr()) return;

    const earnedBadges = badgesResponse.unwrap().badges;
    setBadges(earnedBadges);
    if (earnedBadges.length > 0) {
      setOpenModal(true);
    }
  };

  if (!shouldIncrement) {
    if (badges.length < 1) handleUpdateBadges();
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div>Grupo de questões finalizadas!</div>
        <div style={{ display: "flex", gap: "10px", color: "white" }}>
          <button
            style={{
              backgroundColor: "blue",
              padding: "10px",
              borderRadius: "5px",
            }}
            onClick={() => window.location.reload()}
          >
            Continuar
          </button>
          <Link
            style={{
              backgroundColor: "blue",
              padding: "10px",
              borderRadius: "5px",
            }}
            href="/"
          >
            Voltar para home
          </Link>
        </div>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <div
            style={{
              display: "flex",
              padding: "10px",
              gap: "10px",
              flexDirection: "column",
              border: "10px solid blue",
            }}
          >
            <p style={{ fontSize: "22px", color: "blue" }}>
              Parabéns! Novas medalhas conquistadas!
            </p>
            <Grid container spacing={2}>
              {badges.map((badge) => (
                <Grid item xs={4}>
                  <BadgeCard
                    key={badge.id}
                    achieved={true}
                    badge={{ badge, badgeId: badge.id }}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <Exercise
        shouldIncrement={shouldIncrement}
        data={props.data[currentIdx]}
        idx={currentIdx}
        token={props.token}
      />
    </div>
  );
}
