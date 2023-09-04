import { POINTS_MAP, WeightValues } from "@/lib/constants";
import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { ExerciseBody } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ExerciseBody;
    const { answerId, childId, exerciseId } = body;
    const correctAnswer = await prisma.answer.findFirst({
      where: {
        exerciseId,
        isCorrect: true
      },
      select: {
        id: true,
        exercise: {
          select: {
            difficulty: true
          }
        }
      }
    });

    if (!correctAnswer)
      return getErrorResponse(401, "Não foi encontrado uma resposta correta cadastrada.");

    const difficulty = correctAnswer.exercise.difficulty;
    const isRightAnswer = answerId === correctAnswer.id;
    const createdAnswer = await prisma.answeredExercise.create({
      data: {
        answerId,
        childId,
        exerciseId
      }
    });
    if (!createdAnswer)
      return getErrorResponse(401, "Nao foi possível salvar a sua resposta.");
    const child = await prisma.child.findUnique({
      where: {
        id: childId
      }
    });
    if (!child)
      return getErrorResponse(401, "Não foi encontrado um usuário com esse id.");

    const childPoints = child?.points || 0;
    const { increase, decrease } = POINTS_MAP.get(difficulty as WeightValues) || { increase: 0, decrease: 0 };
    const newPoints = isRightAnswer ? childPoints + increase : childPoints - decrease;

    try {
      await prisma.child.update({
        where: {
          id: childId
        },
        data: {
          points: newPoints
        }
      });
    } catch (e) {
      console.log(e);
      return getErrorResponse(401, "Não foi possível atualizar os pontos do usuário.");
    }

    return new NextResponse(
      JSON.stringify({
        isRightAnswer,
        newPoints
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json", "X-USER-TYPE": "child" },
      }
    );

  } catch (e: any) {
    return getErrorResponse(500, e.message);
  }
}