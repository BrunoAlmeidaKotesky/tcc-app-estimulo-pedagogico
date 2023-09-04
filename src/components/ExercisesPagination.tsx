'use client';
import type { AnswerByExercise } from "@/lib/types"
import { useExerciseStore } from "@/store";
import useStore from "@/store";
import { Exercise } from "./Exercise";

export function ExercisesPagination(props: {data: AnswerByExercise[]}) {
    const exStore = useStore(useExerciseStore, s => s);
    const currentIdx = exStore?.curExerciseIdx ?? 0;
    const shouldIncrement = props?.data?.length !== currentIdx + 1;

    if(!shouldIncrement)
        return <div>Não há mais exercícios para hoje!</div>
    return (
        <div>
            <Exercise shouldIncrement={shouldIncrement} data={props.data[currentIdx]} idx={currentIdx} />
        </div>
    );
}