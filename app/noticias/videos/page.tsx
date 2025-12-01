import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { Video } from "@/lib/types";
import Image from "next/image";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";

export default async function VideosPage() {
  let videos: Video[] = [];
  let settings: any = null;

  try {
    const supabase = await createClient();
    const [videosRes, settingsRes] = await Promise.all([
      supabase
        .from("videos")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true }),
      supabase.from("publicacoes_page_settings").select("*").single(),
    ]);

    videos = (videosRes.data as Video[]) || [];
    settings = settingsRes.data;
  } catch (error) {
    console.warn("Não foi possível carregar vídeos do Supabase:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        {/* Banner da Página - Mesmo tamanho da página de notícias */}
        {settings?.banner_image_url && (
          <div className="relative h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[35vh] min-h-[150px] sm:min-h-[200px] w-full overflow-hidden">
            <Image
              src={settings.banner_image_url}
              alt="Banner Vídeos"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Título */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-12 md:mb-16 text-center tracking-tight">
            Vídeos
          </h1>

          {/* Lista de Vídeos */}
          <div className="space-y-8 md:space-y-10 lg:space-y-12">
            {videos.map((video) => {
              const thumbnailUrl = video.thumbnail_url || getYouTubeThumbnail(video.youtube_url);
              const videoId = extractYouTubeId(video.youtube_url);
              
              return (
                <div
                  key={video.id}
                  className="flex flex-col md:flex-row gap-0 bg-white rounded-lg overflow-hidden shadow-md"
                >
                  {/* Thumbnail à esquerda - QUADRADA */}
                  <div className="relative w-full md:w-[450px] md:h-[450px] flex-shrink-0 overflow-hidden group cursor-pointer">
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors">
                          <svg
                            className="w-10 h-10 md:w-12 md:h-12 text-gray-900 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {/* ABCIP Logo no canto superior esquerdo */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 px-3 py-1.5 rounded-md">
                          <span className="text-xs md:text-sm font-bold text-gray-900">ABCIP</span>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Título à direita - FUNDO CINZA CLARO - MESMA ALTURA DA IMAGEM */}
                  <div className="flex flex-col justify-center flex-1 p-6 md:p-8 lg:p-10 bg-gray-100 md:h-[450px]">
                    <h3 className="font-archivo text-sm md:text-base lg:text-lg font-bold text-gray-900 uppercase leading-tight">
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-500 transition-colors"
                      >
                        {video.title}
                      </a>
                    </h3>
                  </div>
                </div>
              );
            })}

            {videos.length === 0 && (
              <div className="text-center py-12">
                <p className="font-archivo text-lg text-gray-500">
                  Nenhum vídeo disponível no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

