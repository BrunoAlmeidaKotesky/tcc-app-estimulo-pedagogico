import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { Exercise } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getInitialExercises(
    childId: string,
    numberOfAnsweredEx: number,
    answeredExerciseIds: string[]
): Promise<Exercise[]> {

    // Obtendo os assuntos dos exercícios já respondidos
    const answeredSubjects = await prisma.answeredExercise.findMany({
        where: {
            childId,
        },
        select: {
            exercise: {
                select: {
                    subjectId: true
                }
            }
        }
    });
    const answeredSubjectsIds = answeredSubjects.map(subject => subject?.exercise?.subjectId);

    const exercisesToGet = await prisma.exercise.findMany({
        where: {
            NOT: {
                id: {
                    in: answeredExerciseIds
                },
                subjectId: {
                    in: answeredSubjectsIds
                }
            },
            difficulty: {
                // Peso 1 = fácil
                weight: 1
            }
        },
        take: 10 - numberOfAnsweredEx,
    });

    if (exercisesToGet.length < (10 - numberOfAnsweredEx)) {
        // Se não encontrarmos exercícios suficientes de diferentes assuntos, 
        // pegue mais exercícios de assuntos já respondidos para preencher a lacuna
        const additionalExercises = await prisma.exercise.findMany({
            where: {
                NOT: {
                    id: {
                        in: answeredExerciseIds
                    }
                },
                difficulty: {
                    weight: 1
                }
            },
            take: (10 - numberOfAnsweredEx) - exercisesToGet.length,
        });
        exercisesToGet.push(...additionalExercises);
    }

    return exercisesToGet;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const childId = req.headers.get("X-USER-ID");

        if (!childId)
            return getErrorResponse(401, "Você não está logado, por favor forneça um token de acesso.");
        const answeredExercises = await prisma.answeredExercise.findMany({
            where: { childId }
        });

        const numberOfAnsweredEx = answeredExercises.length;
        const answeredExerciseIds = answeredExercises.map(exercise => exercise.exerciseId);
        if (numberOfAnsweredEx < 10) {
            const exercises = await getInitialExercises(childId, numberOfAnsweredEx, answeredExerciseIds);

        }
        return new NextResponse(JSON.stringify({}), { 
            status: 200, headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return getErrorResponse(500, e.message);
    }
}
