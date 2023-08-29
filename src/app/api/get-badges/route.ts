import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { BadgeBody, BadgeData, BadgeResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { BADGE_SELECT as select } from '@/lib/constants';

async function fetchAllBadges() {
    const allBadges = await prisma.badge.findMany({ select });

    if (allBadges.length === 0) {
        throw new Error("Nenhuma insígnia encontrada.");
    }

    return allBadges.map(badge => ({
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
        }
    });

    if (!earnedBadges) 
        throw new Error("Nenhuma insígnia ganha encontrada para a criança.");
    return earnedBadges;
}

async function fetchParentEarnedBadges(userId: string): Promise<BadgeData[]> {
    const parentChildIds = await prisma.child.findMany({
        where: { parentId: userId },
        select: { id: true }
    });

    if (!parentChildIds || parentChildIds.length === 0) 
        throw new Error("Nenhuma criança associada ao pai.");

    const childEarnedBadges = await prisma.earnedBadge.findMany({
        where: {
          childId: {
            in: parentChildIds.map(child => child.id)
          }
        },
        select: { badge: { select } }
    });
      
    if (!childEarnedBadges || childEarnedBadges.length === 0)
        throw new Error("Nenhuma insígnia ganha encontrada para as crianças do pai.");

    return childEarnedBadges.map(({badge}) => ({
        badgeId: badge.id,
        badge: badge,
    }));
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const userId = req.headers.get("X-USER-ID");
        const body = (await req.json() as BadgeBody);
        if (!body?.userType || !userId)
            return getErrorResponse(400, "Ocorreu um erro ao buscar as medalhas.");

        const response: BadgeResponse = {
            allBadges: [],
            earnedBadges: []
        };

        response.allBadges = await fetchAllBadges();

        if (body.userType === "child")
            response.earnedBadges = await fetchChildEarnedBadges(userId);
        else if (body.userType === "parent")
            response.earnedBadges = await fetchParentEarnedBadges(userId);

        return new NextResponse(JSON.stringify(response), {
            status: 200, headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return getErrorResponse(500, e.message);
    }
}