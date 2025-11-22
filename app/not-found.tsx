import Link from "next/link";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary-500 text-dark-900 px-6 py-3 rounded-lg hover:bg-primary-400 transition font-semibold"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

