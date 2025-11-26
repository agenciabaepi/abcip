import Image from "next/image";
import Link from "next/link";
import ABCIPText from "@/components/ABCIPText";

const categories = [
  {
    id: 1,
    title: "Notícias",
    image: "/imagens/1.jpg",
    link: "/noticias",
  },
  {
    id: 2,
    title: "Movimentações do Setor",
    image: "/imagens/2.jpg",
    link: "/noticias",
  },
  {
    id: 3,
    title: "Eventos",
    image: "/imagens/3.jpg",
    link: "/noticias",
  },
  {
    id: 4,
    title: "ABCIP na Mídia",
    image: "/imagens/4.jpg",
    link: "/noticias",
  },
];

export default function NewsCategories() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-0 tracking-tight">
            Notícias
          </h2>
          <span className="text-base md:text-lg text-gray-900 font-bold">
            Últimas notícias, movimentação do mercado e eventos.
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => {
            const isClickable = category.id === 1; // Apenas "Notícias" tem link
            
            const content = (
              <>
                <h3 className={`text-base md:text-lg font-semibold text-gray-900 mb-3 ${isClickable ? 'group-hover:text-primary-500' : ''} transition-colors`}>
                  {category.id === 4 ? (
                    <ABCIPText>{category.title}</ABCIPText>
                  ) : (
                    category.title
                  )}
                </h3>
                <div className="relative overflow-hidden rounded-lg">
                  <div className={`relative h-56 md:h-64 lg:h-72 w-full ${isClickable ? 'group-hover:scale-105' : ''} transition-transform duration-300`}>
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </>
            );

            if (isClickable) {
              return (
                <Link
                  key={category.id}
                  href={category.link}
                  className="group block"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={category.id} className="block">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

