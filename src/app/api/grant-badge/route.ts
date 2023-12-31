import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Badge } from "@prisma/client";

function checkPoints(
  childPoints: number,
  allBadges: Badge[],
  earnedBadges: Badge[]
): Badge[] {
  const pointBadges = allBadges.filter((b) => b.criteria === "points");
  for (let badge of pointBadges) {
    if (childPoints >= badge.threshold) earnedBadges.push(badge);
  }
  return earnedBadges;
}

async function checkDifficulty(
  childId: string,
  allBadges: Badge[],
  earnedBadges: Badge[]
): Promise<Badge[]> {
  const answeredExercises = await prisma.answeredExercise.findMany({
    where: { childId },
    include: { exercise: true },
  });

  // Contar o número de exercícios por dificuldade
  const exercisesByDifficulty = answeredExercises.reduce((acc, curr) => {
    const difficulty = curr.exercise.difficulty;
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const difficultyBadges = allBadges.filter((b) =>
    b.criteria.startsWith("difficulty_")
  );
  for (let badge of difficultyBadges) {
    const requiredDifficulty = parseInt(badge.criteria.split("_")[1], 10);
    if (exercisesByDifficulty[requiredDifficulty] >= badge.threshold)
      earnedBadges.push(badge);
  }

  return earnedBadges;
}

async function checkSubject(
  childId: string,
  allBadges: Badge[],
  earnedBadges: Badge[]
): Promise<Badge[]> {
  const answeredExercises = await prisma.answeredExercise.findMany({
    where: { childId },
    include: { exercise: { include: { subject: true } } },
  });

  // Contar o número de exercícios por matéria
  const exercisesBySubject = answeredExercises.reduce((acc, curr) => {
    const subjectId = curr.exercise.subject.id;
    acc[subjectId] = (acc[subjectId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const subjectBadges = allBadges.filter((b) =>
    b.criteria.startsWith("subject_")
  );
  for (let badge of subjectBadges) {
    const requiredSubject = parseInt(badge.criteria.split("_")[1], 10);
    if (exercisesBySubject[requiredSubject] >= badge.threshold) {
      earnedBadges.push(badge);
    }
  }

  return earnedBadges;
}

async function checkForBadges(childId: string) {
  // Puxe as informações da criança do banco de dados
  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { points: true },
  });

  // Puxe todos os emblemas disponíveis
  const allBadges = await prisma.badge.findMany();

  // Inicialize uma lista para guardar os emblemas conquistados
  let earnedBadges: Badge[] = [];

  // 1. Verifique os pontos
  earnedBadges = checkPoints(child?.points!, allBadges, earnedBadges);

  // 2. Verifique a dificuldade dos exercícios respondidos
  earnedBadges = await checkDifficulty(childId, allBadges, earnedBadges);

  // 3. Verifique as matérias dos exercícios respondidos
  earnedBadges = await checkSubject(childId, allBadges, earnedBadges);

  // Puxe todos os emblemas que a criança já ganhou
  const alreadyEarnedBadges = await prisma.earnedBadge.findMany({
    where: { childId },
    select: { badgeId: true },
  });
  const alreadyEarnedBadgeIds = alreadyEarnedBadges.map((e) => e.badgeId);

  const badgesResponse: Badge[] = [];
  // Atualize o banco de dados apenas com os novos emblemas conquistados
  for (let badge of earnedBadges) {
    if (!alreadyEarnedBadgeIds.find((badgeId) => badgeId === badge.id)) {
      await prisma.earnedBadge.create({
        data: { childId, badgeId: badge.id },
      });
      badgesResponse.push(badge);
    }
  }

  return badgesResponse;
}

/**Temos que descobrir onde vamos chamar essa endpoint, para evitar que seja chamada muitas vezes */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const childId = req.headers.get("X-USER-ID");
    if (!childId)
      return getErrorResponse(
        401,
        "Você não está logado, por favor forneça um token de acesso."
      );

    const earnedBadges = await checkForBadges(childId);
    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Medalhas atualizadas com sucesso!",
        badges: earnedBadges,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
