"use client";
import { BadgeData } from "@/lib/types";
import { Typography } from "@mui/material";
import { FaMedal } from "react-icons/fa";

interface BadgeCardProps {
  achieved: boolean;
  badge: BadgeData;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ achieved, badge }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FaMedal
        style={{ fontSize: "64px" }}
        color={achieved ? "blue" : "grey"}
      />
      <Typography
        color={achieved ? "blue" : "grey"}
        sx={{ fontWeight: achieved ? "bold" : "normal" }}
      >
        {badge.badge.name}
      </Typography>
    </div>
  );
};
