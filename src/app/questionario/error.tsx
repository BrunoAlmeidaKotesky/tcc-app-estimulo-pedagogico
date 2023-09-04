'use client';
import Header from "@/components/Header";

export default function Error() {
    return (<>
        <Header />
        <section className="bg-ct-blue-600 min-h-screen pt-20">
            <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
                <p className="text-red-600">Erro ao carregar os exercícios</p>
            </div>
        </section>
    </>
    )
}