import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import {
  BadgeData,
  BadgeResponse,
  GroupedByDifficulty,
  GroupedBySubject,
  ExerciseDataItem,
  GroupedUnion,
  DataBySubject,
} from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { DIFFICULTY_NAMES, BADGE_SELECT as select } from "@/lib/constants";

function groupBySubject(exercises: ExerciseDataItem[]): GroupedBySubject {
  return exercises.reduce<GroupedBySubject>((acc, exerciseData) => {
    const { isCorrect, exerciseId, difficulty, subjectName } =
      exerciseData as GroupedUnion;
    const difficultyLabel = DIFFICULTY_NAMES.get(Number(difficulty))!;
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push({
      isCorrect,
      exerciseId,
      difficulty: difficultyLabel,
    });
    return acc;
  }, {});
}

function groupByDifficulty(exercises: ExerciseDataItem[]): GroupedByDifficulty {
  return exercises.reduce<GroupedByDifficulty>((acc, exerciseData) => {
    const { difficulty, isCorrect, exerciseId, subjectName } =
      exerciseData as GroupedUnion;
    const difficultyLabel = DIFFICULTY_NAMES.get(Number(difficulty))!;
    if (!acc[difficultyLabel]) {
      acc[difficultyLabel] = [];
    }
    acc[difficultyLabel].push({ isCorrect, exerciseId, subjectName });
    return acc;
  }, {});
}

async function getChildrenData(parentId: string) {
  const children = await prisma.child.findMany({
    where: { parentId },
    select: {
      AnsweredExercise: {
        select: {
          answer: { select: { isCorrect: true } },
          exercise: {
            select: {
              id: true,
              subject: { select: { name: true, id: true } },
              difficulty: true,
            },
          },
        },
      },
      name: true,
      points: true,
    },
  });

  return children.map((child) => {
    const exercises = child.AnsweredExercise.map((exerciseData) => ({
      isCorrect: exerciseData.answer.isCorrect,
      exerciseId: exerciseData.exercise.id,
      subjectName: exerciseData.exercise.subject.name,
      difficulty: exerciseData.exercise.difficulty,
    }));

    return {
      name: child.name,
      points: child?.points || 0,
      exercisesGroupedBySubject: groupBySubject(exercises),
      exercisesGroupedByDifficulty: groupByDifficulty(exercises),
    };
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = req.headers.get("X-USER-ID");
    if (!userId)
      return getErrorResponse(500, "Ocorreu um erro ao buscar os dados.");

    const data = await getChildrenData(userId);
    if (data?.length === 0)
      return getErrorResponse(500, "Ocorreu um erro ao buscar os dados.");

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return getErrorResponse(500, e.message);
  }
}
