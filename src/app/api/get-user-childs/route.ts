import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { BadgeData, BadgeResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { BADGE_SELECT as select } from "@/lib/constants";

async function fetchAllBadges() {
  const childs = await prisma.child.findMany({ where: { parentId } });

  if (allBadges.length === 0) {
    throw new Error("Nenhuma insígnia encontrada.");
  }

  return allBadges.map((badge) => ({
    badgeId: badge.id,
    badge: badge,
  }));
}

async function fetchChildEarnedBadges(userId: string): Promise<BadgeData[]> {
  const earnedBadges = await prisma.earnedBadge.findMany({
    where: { childId: userId },
    select: {
      badgeId: true,
      badge: { select },
    },
  });

  if (!earnedBadges)
    throw new Error("Nenhuma insígnia ganha encontrada para a criança.");
  return earnedBadges;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = req.headers.get("X-USER-ID");

    if (!userId)
      return getErrorResponse(400, "Ocorreu um erro ao buscar as medalhas.");

    const response: BadgeResponse = {
      allBadges: [],
      earnedBadges: [],
    };

    response.allBadges = await fetchAllBadges();

    response.earnedBadges = await fetchChildEarnedBadges(userId);
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return getErrorResponse(500, e.message);
  }
}
