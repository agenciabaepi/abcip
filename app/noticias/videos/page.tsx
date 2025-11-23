import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import VideoSection from "@/components/VideoSection";
import { createClient } from "@/lib/supabase/server";
import { Video } from "@/lib/types";

export default async function VideosPage() {
  let videos: Video[] = [];

  try {
    const supabase = await createClient();
    const { data: videosData } = await supabase
      .from("videos")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    videos = (videosData as Video[]) || [];
  } catch (error) {
    console.warn("Não foi possível carregar vídeos do Supabase:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow">
        <VideoSection videos={videos} />
      </main>
      <Footer />
    </div>
  );
}

