import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-USER-ID");

  if (!userId) {
    return getErrorResponse(
      401,
      "Você não está logado, por favor forneça um token de acesso."
    );
  }

  const user = await prisma.parent.findUnique({ where: { id: userId } });

  return NextResponse.json({
    status: "success",
    data: { user: { ...user, password: undefined } },
    userType: "parent",
  });
}
