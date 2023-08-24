import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const childId = req.headers.get("X-USER-ID");

        if (!childId)
            return getErrorResponse(401, "Você não está logado, por favor forneça um token de acesso.");
        const answeredExercises = await prisma.answeredExercise.findMany({
            where: {
                childId
            }
        });
        const numberOfAnsweredEx = answeredExercises.length;
        if(numberOfAnsweredEx <= 10) {
            const exercisesToGet = await prisma.exercise.findMany({
                take: 10 - numberOfAnsweredEx,
                /*where: {
                    difficulty: 
                }*/
            });
        }
        
    } catch (e: any) {
        return getErrorResponse(500, e.message);
    }
}

interface ExerciseBody {
    exerciseId: string;
    childId: string;
    answerId: string;
}