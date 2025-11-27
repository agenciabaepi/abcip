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
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14 lg:mb-16 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="font-archivo text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-0 tracking-tight">
            Notícias
          </h2>
          <span className="font-archivo text-lg md:text-xl lg:text-2xl text-gray-900 font-bold">
            Últimas notícias, movimentação do mercado e eventos.
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {categories.map((category) => {
            const isClickable = category.id === 1; // Apenas "Notícias" tem link
            
            const content = (
              <>
                <h3 className={`font-archivo text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-4 ${isClickable ? 'group-hover:text-primary-500' : ''} transition-colors`}>
                  {category.id === 4 ? (
                    <ABCIPText>{category.title}</ABCIPText>
                  ) : (
                    category.title
                  )}
                </h3>
                <div className="relative overflow-hidden rounded-lg">
                  <div className={`relative h-64 md:h-72 lg:h-80 w-full ${isClickable ? 'group-hover:scale-105' : ''} transition-transform duration-300`}>
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

