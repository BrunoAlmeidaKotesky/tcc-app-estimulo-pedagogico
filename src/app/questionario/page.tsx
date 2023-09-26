import { ExercisesPagination } from "@/components/ExercisesPagination";
import Header from "@/components/Header";
import ApiClient from "@/lib/ApiClient";
import { cookies } from "next/headers";

export default async function Questions() {
  const cookieStore = cookies();
  const token = cookieStore?.get("token");
  const exercisesResult = await ApiClient.getDailyExercises(token?.value!);

  return (
    <>
      <Header />
      <section className="bg-green-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          {exercisesResult.isErr() ? (
            <p className="text-red-600">{exercisesResult?.error?.message}</p>
          ) : (
            <ExercisesPagination
              data={exercisesResult.unwrap()}
              token={token?.value}
            />
          )}
        </div>
      </section>
    </>
  );
}
