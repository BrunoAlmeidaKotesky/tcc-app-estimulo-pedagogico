"use client";
import ApiClient from "@/lib/ApiClient";
import { DIFFICULTY_WEIGHTS } from "@/lib/constants";
import type { AnswerByExercise } from "@/lib/types";
import { useAppStore, useExerciseStore } from "@/store";
import useStore from "@/store";
import { useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  data: AnswerByExercise;
  idx: number;
  shouldIncrement: boolean;
  token?: string;
};
export function Exercise({ data: { exercise, answers }, idx, token }: Props) {
  const store = useStore(useAppStore, (s) => s);
  const exStore = useStore(useExerciseStore, (s) => s);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const onClickSendAnswer = async () => {
    const res = await ApiClient.sendAnswer(
      {
        exerciseId: exercise.id,
        answerId: selectedAnswer!,
      },
      token
    );

    if (res.isErr()) {
      exStore?.setCurrentExerciseIdx(idx + 1);
      return toast.error(res.error.message, { duration: 5000 });
    }

    const { isRightAnswer, newPoints } = res.unwrap();
    store?.setChildUser((p) => ({ ...p, points: newPoints }));
    if (isRightAnswer) toast.success("Resposta correta!", { duration: 5000 });
    else toast.error("Resposta incorreta!", { duration: 5000 });
    exStore?.setCurrentExerciseIdx(idx + 1);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <strong>{exercise?.title}</strong>
          <DifficultyLabel difficulty={exercise.difficulty} />
        </div>
        <p className="text-gray-500 text-sm">{exercise.description}</p>
      </div>
      <div>
        {answers.map((a) => (
          <div key={a.id}>
            <input
              checked={selectedAnswer === a.id}
              onChange={() => setSelectedAnswer(a.id)}
              type="radio"
              name={a.id}
              id=""
              value={a.id}
            />
            <label htmlFor={a.id}>{a.answer}</label>
          </div>
        ))}
        <button
          className="w-full py-3 font-semibold rounded-lg outline-none border-none flex justify-center bg-ct-yellow-600 text-white"
          onClick={onClickSendAnswer}
          disabled={!selectedAnswer}
        >
          Enviar Resposta
        </button>
      </div>
    </div>
  );
}

const DifficultyLabel = ({ difficulty }: { difficulty: number }) => {
  switch (difficulty) {
    case DIFFICULTY_WEIGHTS.EASY:
      return (
        <span className="bg-green-500 text-white px-2 py-1 rounded-md">
          Fácil
        </span>
      );
    case DIFFICULTY_WEIGHTS.MEDIUM:
      return (
        <span className="bg-yellow-500 text-white px-2 py-1 rounded-md">
          Médio
        </span>
      );
    case DIFFICULTY_WEIGHTS.HARD:
      return (
        <span className="bg-red-500 text-white px-2 py-1 rounded-md">
          Difícil
        </span>
      );
    case DIFFICULTY_WEIGHTS.VERY_HARD:
      return (
        <span className="bg-red-900 text-white px-2 py-1 rounded-md">
          Muito Difícil
        </span>
      );
    default:
      return (
        <span className="bg-gray-500 text-white px-2 py-1 rounded-md">
          Desconhecido
        </span>
      );
  }
};
