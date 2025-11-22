import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { Associate } from "@/lib/types";
import Image from "next/image";

export default async function AssociadosPage() {
  const supabase = await createClient();
  const { data: associates } = await supabase
    .from("associates")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center tracking-tight">
            Nossos Associados
          </h1>

          {associates && associates.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {(associates as Associate[]).map((associate) => (
                <div
                  key={associate.id}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center justify-center"
                >
                  {associate.website ? (
                    <a
                      href={associate.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-24 sm:h-32 relative"
                    >
                      <Image
                        src={associate.logo_url}
                        alt={associate.name}
                        fill
                        className="object-contain"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 sm:h-32 relative">
                      <Image
                        src={associate.logo_url}
                        alt={associate.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-base text-center font-semibold text-gray-900">
                    {associate.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum associado cadastrado ainda.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

