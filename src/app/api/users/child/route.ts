import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { ChildUser } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-USER-ID");
    console.log(userId);

    if (!userId) {
        return getErrorResponse(
            401,
            "Você não está logado, por favor forneça um token de acesso."
        );
    }

    const child = await prisma.child.findUnique({ where: { id: userId } });
    if(!child)
        return getErrorResponse(404, "Usuário não encontrado.");
    const loggedChild: ChildUser = {
        age: child.age,
        name: child.name,
        id: child.id,
        points: child.points
    }

    return NextResponse.json({
        status: "success",
        data: loggedChild,
        userType: 'child'
    });
}
