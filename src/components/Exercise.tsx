'use client';
import ApiClient from "@/lib/ApiClient";
import type { AnswerByExercise } from "@/lib/types"
import { useAppStore, useExerciseStore } from "@/store";
import useStore from "@/store";
import { useState } from "react";
import { toast } from "react-hot-toast";

type Props = { data: AnswerByExercise, idx: number }
export function Exercise({data: {exercise, answers}, idx}: Props) {
    const store = useStore(useAppStore, s => s);
    const exStore = useStore(useExerciseStore, s => s);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const onClickSendAnswer = async () => {
        const res = await ApiClient.sendAnswer({
            exerciseId: exercise.id,
            answerId: selectedAnswer!,
            childId: store?.childUser?.id!
        });
        
        if(res.isErr()) {
            exStore?.setCurrentExerciseIdx(idx + 1);
            return toast.error(res.error.message, {duration: 5000});
        }

        const {isRightAnswer, newPoints} = res.unwrap();
        store?.setChildUser(p => ({...p, points: newPoints}));
        if(isRightAnswer)
            toast.success("Resposta correta!", {duration: 5000});
        else toast.error("Resposta incorreta!", {duration: 5000});   
        exStore?.setCurrentExerciseIdx(idx + 1);
    }
    
    return (
        <div>
            <div>
                <h4>{exercise.title}</h4>
                <p>{exercise.description}</p>
                <p>{exercise.difficulty}</p>
            </div>
            <div>
            {answers.map(a => (
                <div key={a.id}>
                    <label htmlFor={a.id}>{a.answer}</label>
                    <input 
                        checked={selectedAnswer === a.id}
                        onChange={() => setSelectedAnswer(a.id)}
                        type="radio" name={a.id} id="" 
                        value={a.id}/>
                </div>
            ))}
            <button 
                onClick={onClickSendAnswer}
                disabled={!selectedAnswer}>Enviar Resposta</button>
            </div>
        </div>
    );
}