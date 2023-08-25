import { DIFFICULTY_WEIGHTS } from "@/lib/constants";
import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { BadgeBody, BadgeResponse } from "@/lib/types";
import { Exercise } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const userId = req.headers.get("X-USER-ID");
        const body = (await req.json() as BadgeBody);
        let response: BadgeResponse = {
            allBadges: [],
            earnedBadges: []
        };
            
        return new NextResponse(JSON.stringify({}), {
            status: 200, headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return getErrorResponse(500, e.message);
    }
}
