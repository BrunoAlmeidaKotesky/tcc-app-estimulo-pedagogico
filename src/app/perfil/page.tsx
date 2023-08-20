import Header from "@/components/Header";
import ApiClient from "@/lib/ApiClient";
import { cookies } from "next/headers";
import { AuthPageInvisible } from "@/lib/protect-page";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const response = await ApiClient.getAuthUser(token?.value);
  if (response.isErr()) return <div>Erro</div>
  const data = response.unwrap().data;
  console.log(data);

  return (
    <>
      <Header />
      <section className="bg-ct-blue-600  min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <div>
            <p className="mb-3 text-5xl text-center font-semibold">
              Página de Perfil
            </p>
            <div className="mt-8">
              <p className="mb-3">Id: {data.user.id}</p>
              <p className="mb-3">Nome: {data.user.name}</p>
              <p className="mb-3">Email: {data.user.email}</p>
              <p className="mb-3">Verificado: {String(data.user.verified)}</p>
              <p className="mb-3">Códigos de acesso:
                <ul>
                  {data.childAccessCodes.map(({ accessCode, name }) =>
                    <li key={accessCode}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <strong>{accessCode}</strong>
                        - 
                        <span>{name}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </p>
            </div>
          </div>
        </div>
      </section>
      <AuthPageInvisible />
    </>
  );
}
