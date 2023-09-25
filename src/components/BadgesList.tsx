"use client";

import { useState } from "react";
import { Grid, MenuItem, Select } from "@mui/material";
import { BadgeCard } from "./BadgeCard";
import { BadgeData, BadgeResponse } from "@/lib/types";

interface BadgeListProps {
  badgeResponse: BadgeResponse;
  token: string;
}

export const BadgesList: React.FC<BadgeListProps> = ({
  badgeResponse,
  token,
}) => {
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filteredBadges, setFilteredBadges] = useState<BadgeData[]>(
    badgeResponse.allBadges
  );
  const earnedBadgesIds = badgeResponse.earnedBadges.map(
    (earnedBadge) => earnedBadge.badgeId
  );

  const handleFilterBadges = (filterBadgeValue: number) => {
    setFilterValue(filterBadgeValue);

    if (filterBadgeValue === 0) {
      setFilteredBadges(badgeResponse.allBadges);
    } else if (filterBadgeValue === 1) {
      setFilteredBadges(
        badgeResponse.allBadges.filter((badge) =>
          earnedBadgesIds.includes(badge.badgeId)
        )
      );
    } else {
      setFilteredBadges(
        badgeResponse.allBadges.filter(
          (badge) => !earnedBadgesIds.includes(badge.badgeId)
        )
      );
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "18px", color: "blue" }}>
          Visualize todas as medalhas disponíveis e conquistadas
        </p>
        <Select
          value={filterValue}
          onChange={(e) => handleFilterBadges(Number(e.target.value))}
        >
          <MenuItem value={0}>Todas</MenuItem>
          <MenuItem value={1}>Já obtidas</MenuItem>
          <MenuItem value={2}>Não obtidas</MenuItem>
        </Select>
      </div>
      <Grid container spacing={2}>
        {filteredBadges.map((content, index) => (
          <Grid item xs={3} key={index}>
            <BadgeCard
              achieved={earnedBadgesIds.includes(content.badgeId)}
              badge={content}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
