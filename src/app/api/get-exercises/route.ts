import { DIFFICULTY_WEIGHTS } from "@/lib/constants";
import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { AnswerByExercise } from "@/lib/types";
import { Answer, Exercise } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

function removeDuplicatedId(exs: Exercise[]): Exercise[] {
  const idsSet = Array.from(new Set(exs.map((e) => e.id)));
  return idsSet
    .map((id) => exs.find((e) => e?.id === id)!)
    .filter((e) => e !== undefined);
}

async function getInitialExercises(
  childId: string,
  numberOfAnsweredEx: number,
  answeredExerciseIds: string[]
): Promise<Exercise[]> {
  // Obtendo os assuntos dos exercícios já respondidos
  const answeredSubjects = await prisma.answeredExercise.findMany({
    where: { childId },
    select: {
      exercise: {
        select: {
          subjectId: true,
        },
      },
    },
  });
  const answeredSubjectsIds = answeredSubjects.map(
    (subject) => subject?.exercise?.subjectId
  );

  const exercisesToGet = await prisma.exercise.findMany({
    where: {
      NOT: {
        id: {
          in: answeredExerciseIds,
        },
        subjectId: {
          in: answeredSubjectsIds,
        },
      },
      difficulty: DIFFICULTY_WEIGHTS.EASY,
    },
    take: 10 - numberOfAnsweredEx,
  });

  if (exercisesToGet.length < 10 - numberOfAnsweredEx) {
    // Se não encontrarmos exercícios suficientes de diferentes assuntos,
    // pegue mais exercícios de assuntos já respondidos para preencher a lacuna
    const additionalExercises = await prisma.exercise.findMany({
      where: {
        NOT: {
          id: {
            in: answeredExerciseIds,
          },
        },
        difficulty: DIFFICULTY_WEIGHTS.EASY,
      },
      take: 10 - numberOfAnsweredEx - exercisesToGet.length,
    });
    exercisesToGet.push(...additionalExercises);
  }

  return removeDuplicatedId(exercisesToGet);
}

const getRecommendedExercises = async (
  childId: string
): Promise<Exercise[]> => {
  // Recupera os pontos da criança
  const childData = await prisma.child.findUnique({
    where: {
      id: childId,
    },
    select: {
      points: true,
    },
  });
  const points = childData?.points || 0;

  // Determina o nível de dificuldade com base nos pontos
  let targetDifficulty: number;
  if (points < 100) {
    targetDifficulty = DIFFICULTY_WEIGHTS.EASY;
  } else if (points < 200) {
    targetDifficulty = DIFFICULTY_WEIGHTS.MEDIUM;
  } else if (points < 300) {
    targetDifficulty = DIFFICULTY_WEIGHTS.HARD;
  } else {
    targetDifficulty = DIFFICULTY_WEIGHTS.VERY_HARD;
  }

  // Obtém os exercícios já respondidos pela criança
  const answeredExercises = await prisma.answeredExercise.findMany({
    where: {
      childId,
    },
    select: {
      exerciseId: true,
    },
  });
  const answeredExerciseIds = answeredExercises.map(
    (exercise) => exercise.exerciseId
  );
  const subjects = await prisma.subject.findMany();

  let exercisesToGet: Exercise[] = [];
  const exercisesPerSubject = Math.ceil(10 / subjects.length); // Número ideal de exercícios por matéria

  for (const subject of subjects) {
    const exercisesForSubject = await prisma.exercise.findMany({
      where: {
        NOT: {
          id: {
            in: answeredExerciseIds,
          },
        },
        difficulty: targetDifficulty,
        subjectId: subject.id,
      },
      take: exercisesPerSubject,
      orderBy: {
        updatedAt: "desc",
      },
    });

    exercisesToGet = [...exercisesToGet, ...exercisesForSubject];
  }

  // Se, por algum motivo, não conseguimos obter 10 exercícios, podemos buscar mais exercícios de qualquer matéria para completar
  if (exercisesToGet.length < 10) {
    const additionalExercises = await prisma.exercise.findMany({
      where: {
        NOT: {
          id: {
            in: [...answeredExerciseIds, ...exercisesToGet.map((e) => e.id)],
          },
        },
        difficulty: targetDifficulty,
      },
      take: 10 - exercisesToGet.length,
      orderBy: {
        updatedAt: "desc",
      },
    });

    exercisesToGet = [...exercisesToGet, ...additionalExercises];
  }
  return removeDuplicatedId(exercisesToGet);
};

async function getExercisesAnswers(
  exercises: Exercise[]
): Promise<AnswerByExercise[]> {
  const answersToExercises: Omit<Answer, "isCorrect">[] =
    await prisma.answer.findMany({
      where: {
        exerciseId: { in: exercises.map((e) => e.id) },
      },
      select: {
        answer: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        exerciseId: true,
      },
    });
  if (!answersToExercises?.length)
    throw new Error("Não foi possível localizar as respostas das questões");

  const answerByExercise: AnswerByExercise[] = [];
  for (const exercise of exercises) {
    const answers = answersToExercises.filter(
      (a) => a.exerciseId === exercise.id
    );
    if (answers.length > 0) answerByExercise.push({ exercise, answers });
  }
  return answerByExercise;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const childId = req.headers.get("X-USER-ID");
    if (!childId)
      return getErrorResponse(
        401,
        "Você não está logado, por favor forneça um token de acesso."
      );
    const answeredExercises = await prisma.answeredExercise.findMany({
      where: { childId },
    });
    let exercises: Exercise[] = [];
    const numberOfAnsweredEx = answeredExercises.length;
    const answeredExerciseIds = answeredExercises.map(
      (exercise) => exercise.exerciseId
    );
    if (numberOfAnsweredEx < 10)
      exercises = await getInitialExercises(
        childId,
        numberOfAnsweredEx,
        answeredExerciseIds
      );
    else exercises = await getRecommendedExercises(childId);
    if (exercises.length === 0)
      return getErrorResponse(
        400,
        "Os exercícios acabaram, tente novamente mais tarde"
      );
    const exercisesWithAnswer = await getExercisesAnswers(exercises);
    if (exercisesWithAnswer.length === 0)
      return getErrorResponse(
        404,
        "Não foi possível localizar as respostas das questões"
      );
    return new NextResponse(JSON.stringify(exercisesWithAnswer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return getErrorResponse(500, e.message);
  }
}
