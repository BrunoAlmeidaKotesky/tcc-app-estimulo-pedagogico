import { getEnvVariable, getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/token";
import { Child } from "@prisma/client";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { accessCode, name } = (await req.json()) as { accessCode: string, name: string };

        const childWithTheSameName = await prisma.child.findMany({
            where: { name }, 
        });
        console.log(name);
        if(childWithTheSameName.length === 0)
            return getErrorResponse(401, "Nenhum usuário encontrado com este nome.");
        console.log(childWithTheSameName);
        
        let matchedChild: Child | null = null;
        for (const child of childWithTheSameName) {
            if (await compare(accessCode, child.accessCode)) {
                matchedChild = child;
                break;
            }
        }
        if (!matchedChild) {
            return getErrorResponse(401, "Código de acesso inválido.");
        }
        
        const JWT_EXPIRES_IN = getEnvVariable("JWT_EXPIRES_IN");

        const token = await signJWT(
            { sub: matchedChild.id },
            { exp: `${JWT_EXPIRES_IN}m` }
        );

        const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;
        const cookieOptions = {
            name: "child-token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV !== "development",
            maxAge: tokenMaxAge,
        };

        const response = new NextResponse(
            JSON.stringify({
                status: "success",
                token,
                userType: 'child'
            }),{ status: 200, headers: { "Content-Type": "application/json", "X-USER-TYPE": "child" }}
        );

        response.cookies.set(cookieOptions);
        return response;
    } catch (error: any) {
        return getErrorResponse(500, error.message);
    }
}
