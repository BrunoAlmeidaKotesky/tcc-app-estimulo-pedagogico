import { BadgesList } from "@/components/BadgesList";
import Header from "@/components/Header";
import ApiClient from "@/lib/ApiClient";
import { cookies } from "next/headers";

export default async function Medalhas() {
  const cookieStore = cookies();
  const token = cookieStore?.get("token");
  const badgesResponse = await ApiClient.getAllBadgesAndEarnedBadges(
    token?.value
  );

  if (badgesResponse.isErr()) return <div>Erro</div>;

  const badgesData = badgesResponse.unwrap();

  return (
    <>
      <Header />
      <section className="bg-green-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md flex flex-col p-5 h-full">
          <div style={{ display: "flex" }}>
            <p
              style={{ fontSize: "32px", fontWeight: "bold", color: "#1B4D3E" }}
            >
              Medalhas
            </p>
          </div>

          {token?.value && (
            <BadgesList badgeResponse={badgesData} token={token?.value} />
          )}
        </div>
      </section>
    </>
  );
}
