import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ExerciseBody;
    const { answerId, childId, exerciseId } = body;
    const rightAnswer = await prisma.exerciseRightAnswer.findFirst({
      where: {
        exerciseId
      }
    });
    if (!rightAnswer)
      return getErrorResponse(401, "Não foi encontrado uma resposta correta cadastrada.");
    const rightAnswerId = rightAnswer?.answerId;
    const isRightAnswer = answerId === rightAnswerId;
    const createdAnswer = await prisma.answeredExercise.create({
      data: {
        answerId,
        childId,
        exerciseId
      }
    });
    if (!createdAnswer)
      return getErrorResponse(401, "Nao foi possível salvar a sua resposta.");
    return new NextResponse(
      JSON.stringify({
        status: "success",
        isRightAnswer
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

interface ExerciseBody {
  exerciseId: string;
  childId: string;
  answerId: string;
}